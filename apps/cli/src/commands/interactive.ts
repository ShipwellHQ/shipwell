import chalk from "chalk";
import { stat } from "node:fs/promises";
import type { Operation } from "@shipwell/core";
import { AVAILABLE_MODELS, DEFAULT_MODEL } from "@shipwell/core";
import { getModel, getUser } from "../lib/store.js";
import { promptChoice, promptText, promptTextRequired, promptConfirmation } from "../lib/prompts.js";
import { analyzeCommand } from "./analyze.js";

const accent = chalk.hex("#6366f1");
const dim = chalk.dim;
const bold = chalk.bold;

const operations: { label: string; op: Operation; desc: string }[] = [
  { label: "Security Audit", op: "audit", desc: "Find vulnerabilities & security issues" },
  { label: "Migration Plan", op: "migrate", desc: "Plan framework/library migrations" },
  { label: "Refactor Analysis", op: "refactor", desc: "Detect code smells & duplication" },
  { label: "Generate Docs", op: "docs", desc: "Comprehensive codebase documentation" },
  { label: "Dep. Upgrade", op: "upgrade", desc: "Analyze & plan safe dependency upgrades" },
];

function isGitHubUrl(s: string): boolean {
  return /^(https?:\/\/)?(www\.)?github\.com\//.test(s) || s.startsWith("github.com/");
}

async function isLocalPath(s: string): Promise<boolean> {
  try {
    const s2 = await stat(s);
    return s2.isDirectory();
  } catch {
    return false;
  }
}

export async function interactiveCommand() {
  const user = getUser();
  if (!user) {
    console.error(chalk.red("\n  Error: Not logged in.\n"));
    console.error(dim("  Run ") + chalk.cyan("shipwell login") + dim(" to sign in first.\n"));
    process.exit(1);
  }

  const modelId = getModel() || DEFAULT_MODEL;
  const modelObj = AVAILABLE_MODELS.find(m => m.id === modelId);
  const modelLabel = modelObj?.label || modelId;

  // Header
  console.log();
  console.log(accent("  ⛵ Shipwell"), dim("— Interactive Mode"));
  console.log(dim(`  Logged in as ${user.name} · ${modelLabel}`));
  console.log();

  // Step 1: Choose operation
  console.log(`  ${bold("What would you like to do?")}`);
  console.log();
  for (let i = 0; i < operations.length; i++) {
    const o = operations[i];
    console.log(`    ${accent(`${i + 1}.`)} ${bold(o.label)}  ${dim(o.desc)}`);
  }
  console.log();

  const choice = await promptChoice(operations);
  const selected = operations[choice];
  console.log();

  // Step 2: Source — validate it's a real path or GitHub URL
  let source = "";
  while (true) {
    source = await promptTextRequired(
      "Source (local path or GitHub URL):",
      "Source is required.",
    );

    if (isGitHubUrl(source)) break;

    if (await isLocalPath(source)) break;

    console.log(`  ${chalk.red("Not a valid directory or GitHub URL. Please try again.")}`);
  }
  console.log();

  // Step 3: Optional context
  const context = await promptText("Additional context (optional, Enter to skip):");

  // Step 4: Confirmation
  console.log();
  console.log(dim("  ─────────────────────────────────────────"));
  console.log(`  ${dim("Operation:")}  ${accent(selected.label)}`);
  console.log(`  ${dim("Source:")}     ${chalk.cyan(source)}`);
  console.log(`  ${dim("Model:")}      ${modelLabel}`);
  if (context) {
    console.log(`  ${dim("Context:")}    ${context}`);
  }
  console.log(dim("  ─────────────────────────────────────────"));
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
