import chalk from "chalk";
import type { Finding, MetricEvent } from "@shipwell/core";

const accent = chalk.hex("#6366f1");
const dim = chalk.dim;
const bold = chalk.bold;

// ─── Box drawing helpers ────────────────────────────────────

function stripAnsi(s: string): string {
  return s.replace(/\x1b\[[0-9;]*m/g, "");
}

function visLen(s: string): number {
  return stripAnsi(s).length;
}

function padR(s: string, w: number): string {
  const gap = w - visLen(s);
  return gap > 0 ? s + " ".repeat(gap) : s;
}

function truncate(s: string, max: number): string {
  // Collapse newlines and whitespace runs into single spaces
  const flat = s.replace(/\n/g, " ").replace(/\s+/g, " ").trim();
  if (flat.length <= max) return flat;
  return flat.slice(0, max - 1) + "\u2026";
}

// ─── Severity colors ────────────────────────────────────────

const severityColor: Record<string, (s: string) => string> = {
  critical: chalk.red.bold,
  high: chalk.hex("#f97316").bold,
  medium: chalk.yellow,
  low: chalk.blue,
  info: chalk.dim,
};

const severityIcon: Record<string, string> = {
  critical: "\u{1F534}",
  high: "\u{1F7E0}",
  medium: "\u{1F7E1}",
  low: "\u{1F535}",
};

// ─── Public formatters ──────────────────────────────────────

export interface SummaryStats {
  totalFindings: number;
  critCount: number;
  highCount: number;
  medCount: number;
  lowCount: number;
  crossFileCount: number;
  filesAnalyzed: number;
  tokensK: number;
  elapsed: string;
}

export function formatSeverityRow(findings: Finding[]): string {
  const crit = findings.filter(f => f.severity === "critical").length;
  const high = findings.filter(f => f.severity === "high").length;
  const med = findings.filter(f => f.severity === "medium").length;
  const low = findings.filter(f => f.severity === "low").length;

  const parts = [
    crit > 0 ? `${severityIcon.critical} ${crit} critical` : null,
    high > 0 ? `${severityIcon.high} ${high} high` : null,
    med > 0 ? `${severityIcon.medium} ${med} medium` : null,
    low > 0 ? `${severityIcon.low} ${low} low` : null,
  ].filter(Boolean);

  return parts.join(dim(" \u00B7 "));
}

export function formatSummaryBox(stats: SummaryStats): string {
  const lines: string[] = [];
  const W = 58;
  const inner = W - 4;

  const sevRow = [
    stats.critCount > 0 ? `${severityIcon.critical} ${stats.critCount} critical` : null,
    stats.highCount > 0 ? `${severityIcon.high} ${stats.highCount} high` : null,
    stats.medCount > 0 ? `${severityIcon.medium} ${stats.medCount} medium` : null,
    stats.lowCount > 0 ? `${severityIcon.low} ${stats.lowCount} low` : null,
  ].filter(Boolean).join(dim(" \u00B7 "));

  const crossRow = stats.crossFileCount > 0
    ? `\u27F7  ${stats.crossFileCount} cross-file issues`
    : null;

  const statsRow = `\u{1F4C1} ${stats.filesAnalyzed} files \u00B7 ${stats.tokensK}K tokens \u00B7 ${stats.elapsed}s`;

  lines.push(`  ${dim("\u256D" + "\u2500".repeat(W - 2) + "\u256E")}`);
  lines.push(`  ${dim("\u2502")}  ${padR(`${accent("\u26F5")} ${bold("Analysis Complete")}`, inner)}  ${dim("\u2502")}`);
  lines.push(`  ${dim("\u2502")}${" ".repeat(W - 2)}${dim("\u2502")}`);
  if (sevRow) {
    lines.push(`  ${dim("\u2502")}  ${padR(sevRow, inner)}  ${dim("\u2502")}`);
  }
  if (crossRow) {
    lines.push(`  ${dim("\u2502")}  ${padR(crossRow, inner)}  ${dim("\u2502")}`);
  }
  lines.push(`  ${dim("\u2502")}${" ".repeat(W - 2)}${dim("\u2502")}`);
  lines.push(`  ${dim("\u2502")}  ${padR(statsRow, inner)}  ${dim("\u2502")}`);
  lines.push(`  ${dim("\u256E" + "\u2500".repeat(W - 2) + "\u256F")}`);

  return lines.join("\n");
}

/** Compact finding card — streams in real-time during analysis */
export function formatFindingCard(f: Finding, i: number): string {
  const sev = f.severity || "info";
  const color = severityColor[sev] || chalk.dim;
  const num = dim(`${String(i + 1).padStart(2)}.`);
  const badge = color(`[${sev.toUpperCase()}]`);
  const cross = f.crossFile ? accent(" \u27F7") : "";

  const header = `  ${num} ${bold(f.title)} ${badge}${cross}`;
  const lines: string[] = [header];

  if (f.files.length > 0) {
    lines.push(`     ${f.files.map(file => chalk.cyan(file)).join(dim(", "))}`);
  }
  if (f.description) {
    lines.push(`     ${dim(truncate(f.description, 120))}`);
  }

  return lines.join("\n");
}

export function formatMetric(m: MetricEvent): string {
  return `  ${dim("\u2022")} ${m.label}: ${chalk.red(String(m.before))} ${dim("\u2192")} ${chalk.green(String(m.after))}${m.unit ? dim(` ${m.unit}`) : ""}`;
}
