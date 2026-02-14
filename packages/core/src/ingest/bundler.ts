import type { IngestResult, BundleResult } from "../types.js";
import { estimateTokens } from "./tokens.js";

/**
 * Bundles ingested files into XML format that Claude excels at parsing.
 *
 * Format:
 * <codebase>
 *   <file path="src/index.ts" language="typescript">
 *     file content here
 *   </file>
 *   ...
 * </codebase>
 */
export function bundleCodebase(ingestResult: IngestResult): BundleResult {
  const parts: string[] = ['<codebase>'];

  for (const file of ingestResult.files) {
    parts.push(`<file path="${escapeXmlAttr(file.path)}" language="${file.language}">`);
    parts.push(file.content);
    parts.push('</file>');
  }

  parts.push('</codebase>');

  const xml = parts.join("\n");

  return {
    xml,
    totalTokens: estimateTokens(xml),
    includedFiles: ingestResult.totalFiles,
    skippedFiles: ingestResult.skippedFiles,
  };
}

function escapeXmlAttr(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
