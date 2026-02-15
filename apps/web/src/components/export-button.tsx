"use client";

import { useCallback } from "react";
import { Download } from "lucide-react";
import clsx from "clsx";
import type { Finding, MetricEvent } from "@shipwell/core/client";

interface ExportButtonProps {
  findings: Finding[];
  metrics: MetricEvent[];
  summary: string | null;
  operation: string;
  source: string;
}

const severityOrder: Array<NonNullable<Finding["severity"]>> = [
  "critical",
  "high",
  "medium",
  "low",
  "info",
];

function buildMarkdown({
  findings,
  metrics,
  summary,
  operation,
  source,
}: ExportButtonProps): string {
  const lines: string[] = [];

  lines.push("# Shipwell Analysis Report");
  lines.push("");
  lines.push(`**Date:** ${new Date().toLocaleString()}`);
  lines.push(`**Operation:** ${operation}`);
  lines.push(`**Source:** ${source}`);
  lines.push("");

  // Summary
  if (summary) {
    lines.push("## Summary");
    lines.push("");
    lines.push(summary);
    lines.push("");
  }

  // Metrics table
  if (metrics.length > 0) {
    lines.push("## Metrics");
    lines.push("");
    lines.push("| Metric | Before | After | Unit |");
    lines.push("|--------|--------|-------|------|");
    for (const m of metrics) {
      lines.push(
        `| ${m.label} | ${m.before} | ${m.after} | ${m.unit ?? "—"} |`,
      );
    }
    lines.push("");
  }

  // Findings grouped by severity
  if (findings.length > 0) {
    lines.push("## Findings");
    lines.push("");

    const grouped = new Map<string, Finding[]>();
    for (const f of findings) {
      const sev = f.severity ?? "info";
      if (!grouped.has(sev)) grouped.set(sev, []);
      grouped.get(sev)!.push(f);
    }

    for (const severity of severityOrder) {
      const group = grouped.get(severity);
      if (!group || group.length === 0) continue;

      lines.push(`### ${severity.charAt(0).toUpperCase() + severity.slice(1)}`);
      lines.push("");

      for (const f of group) {
        lines.push(`#### ${f.title}`);
        lines.push("");
        lines.push(f.description);
        lines.push("");

        if (f.category) {
          lines.push(`**Category:** ${f.category}`);
          lines.push("");
        }

        if (f.files.length > 0) {
          lines.push("**Files:**");
          for (const file of f.files) {
            lines.push(`- \`${file}\``);
          }
          lines.push("");
        }

        if (f.diff) {
          lines.push("**Suggested diff:**");
          lines.push("");
          lines.push("```diff");
          lines.push(f.diff);
          lines.push("```");
          lines.push("");
        }
      }
    }
  }

  return lines.join("\n");
}

export function ExportButton({
  findings,
  metrics,
  summary,
  operation,
  source,
}: ExportButtonProps) {
  const handleExport = useCallback(() => {
    const markdown = buildMarkdown({
      findings,
      metrics,
      summary,
      operation,
      source,
    });

    const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const timestamp = Date.now();
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `shipwell-report-${timestamp}.md`;
    document.body.appendChild(anchor);
    anchor.click();

    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  }, [findings, metrics, summary, operation, source]);

  return (
    <button
      type="button"
      onClick={handleExport}
      className={clsx(
        "flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium",
        "text-text-muted hover:text-text",
        "bg-bg-elevated hover:bg-bg-elevated/80",
        "rounded-lg border border-border transition-colors",
      )}
    >
      <Download className="w-3.5 h-3.5" />
      Download Report
    </button>
  );
}
