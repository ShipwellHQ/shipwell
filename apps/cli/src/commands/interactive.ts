import chalk from "chalk";
import type { Operation } from "@shipwell/core";
import { getModel, getUser } from "../lib/store.js";
import { promptChoice, promptText, promptConfirmation } from "../lib/prompts.js";
import { analyzeCommand } from "./analyze.js";

const accent = chalk.hex("#6366f1");
const dim = chalk.dim;
const bold = chalk.bold;

const operations: { label: string; op: Operation; description: string }[] = [
  { label: "Security Audit", op: "audit", description: "Find vulnerabilities & security issues" },
  { label: "Migration Plan", op: "migrate", description: "Plan framework/library migrations" },
  { label: "Refactor Analysis", op: "refactor", description: "Detect code smells & duplication" },
  { label: "Generate Documentation", op: "docs", description: "Comprehensive codebase docs" },
  { label: "Dependency Upgrade", op: "upgrade", description: "Analyze & plan safe upgrades" },
];

function drawBox(lines: string[], width: number): string {
  const out: string[] = [];
  out.push(`  ${dim("\u256D\u2500")} ${accent("\u26F5")} ${bold("Shipwell Interactive Mode")} ${dim("\u2500".repeat(Math.max(0, width - 35)) + "\u256E")}`);
  out.push(`  ${dim("\u2502")}${" ".repeat(width - 2)}${dim("\u2502")}`);
  for (const line of lines) {
    const stripped = line.replace(/\x1b\[[0-9;]*m/g, "");
    const pad = width - 2 - stripped.length;
    out.push(`  ${dim("\u2502")}${line}${pad > 0 ? " ".repeat(pad) : ""}${dim("\u2502")}`);
  }
  out.push(`  ${dim("\u2502")}${" ".repeat(width - 2)}${dim("\u2502")}`);
  out.push(`  ${dim("\u2570" + "\u2500".repeat(width - 2) + "\u256F")}`);
  return out.join("\n");
}

export async function interactiveCommand() {
  const user = getUser();
  const model = getModel() || "claude-sonnet-4-5-20250929";

  console.log();
  const menuLines = [
    `  ${bold("What would you like to do?")}`,
    "",
    ...operations.map((o, i) => `    ${dim(`${i + 1}.`)} ${o.label}  ${dim(o.description)}`),
  ];
  console.log(drawBox(menuLines, 56));
  console.log();

  const choice = await promptChoice("Choose an operation:", operations.map(o => ({
    label: o.label,
    description: o.description,
  })));

  const selected = operations[choice];

  const source = await promptText("Source (path or GitHub URL):");
  if (!source) {
    console.log(dim("\n  No source provided. Exiting.\n"));
    return;
  }

  const context = await promptText("Additional context (optional, Enter to skip):");

  // Confirmation box
  console.log();
  const confirmLines = [
    `  ${bold("Operation:")} ${selected.label}`,
    `  ${bold("Source:")}    ${source}`,
    `  ${bold("Model:")}     ${model}`,
  ];
  if (context) {
    confirmLines.push(`  ${bold("Context:")}   ${context}`);
  }

  const W = 40;
  console.log(`  ${dim("\u250C" + "\u2500".repeat(W - 2) + "\u2510")}`);
  for (const line of confirmLines) {
    const stripped = line.replace(/\x1b\[[0-9;]*m/g, "");
    const pad = W - 2 - stripped.length;
    console.log(`  ${dim("\u2502")}${line}${pad > 0 ? " ".repeat(pad) : ""}${dim("\u2502")}`);
  }
  console.log(`  ${dim("\u2570" + "\u2500".repeat(W - 2) + "\u256F")}`);
  console.log();

  const proceed = await promptConfirmation("Proceed?");
  if (!proceed) {
    console.log(dim("\n  Cancelled.\n"));
    return;
  }

  await analyzeCommand(selected.op, source, {
    context: context || undefined,
    yes: true,
  });
}
