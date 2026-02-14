import type { Finding, MetricEvent } from "../types.js";

/**
 * Streaming XML parser that extracts findings as they complete.
 * Uses simple regex-based extraction on accumulated text.
 */
export class StreamingParser {
  private buffer = "";
  private findingCount = 0;
  private emittedFindings = new Set<string>();

  /** Append new text chunk and extract any complete findings */
  push(chunk: string): { findings: Finding[]; metrics: MetricEvent[] } {
    this.buffer += chunk;
    return {
      findings: this.extractFindings(),
      metrics: this.extractMetrics(),
    };
  }

  private extractFindings(): Finding[] {
    const findings: Finding[] = [];
    const regex = /<finding\s+id="([^"]*)"[^>]*type="([^"]*)"[^>]*(?:severity="([^"]*)")?[^>]*>([\s\S]*?)<\/finding>/g;

    let match;
    while ((match = regex.exec(this.buffer)) !== null) {
      const id = match[1];
      if (this.emittedFindings.has(id)) continue;
      this.emittedFindings.add(id);

      const body = match[4];

      const title = extractTag(body, "title") || "Untitled";
      const description = extractTag(body, "description") || "";
      const crossFile = extractTag(body, "cross-file") === "true";
      const category = extractTag(body, "category") || undefined;
      const diff = extractTag(body, "diff") || undefined;

      // Extract files
      const files: string[] = [];
      const fileRegex = /<file>(.*?)<\/file>/g;
      let fileMatch;
      while ((fileMatch = fileRegex.exec(body)) !== null) {
        files.push(fileMatch[1].trim());
      }

      findings.push({
        id,
        type: match[2] as Finding["type"],
        severity: (match[3] as Finding["severity"]) || undefined,
        title,
        description,
        files,
        crossFile,
        category,
        diff,
      });
    }

    return findings;
  }

  private extractMetrics(): MetricEvent[] {
    const metrics: MetricEvent[] = [];
    const regex = /<metric\s+label="([^"]*)"[^>]*before="([^"]*)"[^>]*after="([^"]*)"[^>]*(?:unit="([^"]*)")?[^>]*\/>/g;

    let match;
    while ((match = regex.exec(this.buffer)) !== null) {
      metrics.push({
        label: match[1],
        before: match[2],
        after: match[3],
        unit: match[4] || undefined,
      });
    }

    return metrics;
  }

  /** Get the analysis summary */
  getSummary(): string | null {
    return extractTag(this.buffer, "summary");
  }

  /** Get full accumulated text */
  getFullText(): string {
    return this.buffer;
  }
}

function extractTag(text: string, tag: string): string | null {
  const regex = new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`);
  const match = regex.exec(text);
  return match ? match[1].trim() : null;
}
