#!/usr/bin/env node

import { Command } from "commander";
import chalk from "chalk";
import { AVAILABLE_MODELS, DEFAULT_MODEL } from "@shipwell/core";
import { analyzeCommand } from "./commands/analyze.js";
import { interactiveCommand } from "./commands/interactive.js";
import { loginCommand } from "./commands/login.js";
import { logoutCommand } from "./commands/logout.js";
import { whoamiCommand } from "./commands/whoami.js";
import { configShowCommand, configSetCommand, configDeleteCommand } from "./commands/config-cmd.js";
import { modelsCommand } from "./commands/models.js";
import { getUser, getApiKey, getModel } from "./lib/store.js";

const VERSION = "0.4.2";

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

function centerStr(s: string, w: number): string {
  const gap = w - visLen(s);
  if (gap <= 0) return s;
  const l = Math.floor(gap / 2);
  return " ".repeat(l) + s + " ".repeat(gap - l);
}

// ─── ASCII art ──────────────────────────────────────────────

const LOGO = [
  "╔═╗╦ ╦╦╔═╗╦ ╦╔═╗╦  ╦  ",
  "╚═╗╠═╣║╠═╝║║║╠═ ║  ║  ",
  "╚═╝╩ ╩╩╩  ╚╩╝╚═╝╩═╝╩═╝",
];

// ─── Main banner ────────────────────────────────────────────

function showBanner() {
  const user = getUser();
  const apiKey = getApiKey();
  const storedModel = getModel();
  const modelId = storedModel || DEFAULT_MODEL;
  const modelObj = AVAILABLE_MODELS.find(m => m.id === modelId);
  const modelLabel = modelObj?.label || modelId;

  const termW = process.stdout.columns || 90;
  const W = Math.min(Math.max(termW, 80), 100);
  const LW = Math.floor((W - 7) / 2);
  const RW = W - 7 - LW;

  const g = dim;
  const row = (l: string, r: string) =>
    `${g("│")} ${padR(l, LW)} ${g("│")} ${padR(r, RW)} ${g("│")}`;
  const empty = () => row("", "");

  // ── Borders ──
  const title = `${accent("⛵ Shipwell")} ${g(`v${VERSION}`)}`;
  const titleVis = visLen(title);
  const top = `${g("╭─")} ${title} ${g("─".repeat(Math.max(0, W - 5 - titleVis)))}${g("╮")}`;
  const bot = `${g("╰")}${g("─".repeat(W - 2))}${g("╯")}`;

  // ── Build rows ──
  const lines: string[] = [];
  lines.push("");
  lines.push(top);
  lines.push(empty());

  // Welcome
  const welcome = user
    ? `Welcome back, ${accent(user.name)}!`
    : `Welcome to ${accent("Shipwell")}`;
  lines.push(row(centerStr(welcome, LW), bold("Getting started")));
  lines.push(row("", `${chalk.cyan("audit")} ${g("<path>")}      ${g("Security audit")}`));

  // ASCII SHIPWELL logo (left) + commands (right)
  lines.push(row(centerStr(accent(LOGO[0]), LW), `${chalk.cyan("migrate")} ${g("<path>")}    ${g("Migration plan")}`));
  lines.push(row(centerStr(accent(LOGO[1]), LW), `${chalk.cyan("refactor")} ${g("<path>")}   ${g("Refactor analysis")}`));
  lines.push(row(centerStr(accent(LOGO[2]), LW), `${chalk.cyan("docs")} ${g("<path>")}       ${g("Documentation")}`));

  lines.push(row("", `${chalk.cyan("upgrade")} ${g("<path>")}    ${g("Dep upgrade plan")}`));
  lines.push(row("", g("─".repeat(RW))));

  // Model + key info (left) + Account section (right)
  const keyDot = apiKey ? chalk.green("●") : chalk.red("●");
  const keyText = apiKey ? g("API Key") : chalk.red("No API Key");
  const info = `${accent(modelLabel)} · ${keyDot} ${keyText}`;
  lines.push(row(centerStr(info, LW), bold("Account & Config")));

  if (user) {
    lines.push(row(centerStr(g(user.email), LW), `${chalk.cyan("login")}      ${g("Sign in with Google")}`));
  } else {
    lines.push(row(
      centerStr(`${g("Run")} ${chalk.cyan("shipwell login")} ${g("to start")}`, LW),
      `${chalk.cyan("login")}      ${g("Sign in with Google")}`,
    ));
  }

  lines.push(row("", `${chalk.cyan("config")}     ${g("View/set configuration")}`));
  lines.push(row("", `${chalk.cyan("models")}     ${g("Available Claude models")}`));
  lines.push(row("", `${chalk.cyan("update")}     ${g("Update to latest version")}`));

  lines.push(empty());
  lines.push(bot);
  lines.push("");

  console.log(lines.join("\n"));
}

// ─── CLI program ────────────────────────────────────────────

const program = new Command();

program
  .name("shipwell")
  .description("Full Codebase Autopilot — deep cross-file analysis powered by Claude")
  .version(VERSION)
  .action(() => {
    showBanner();
  });

// ─── Analysis commands ──────────────────────────────────────

const operations = ["audit", "migrate", "refactor", "docs", "upgrade"] as const;

const opDesc: Record<string, string> = {
  audit: "Run a security audit on a codebase",
  migrate: "Plan a framework/library migration",
  refactor: "Detect code smells, duplication & architecture issues",
  docs: "Generate comprehensive documentation",
  upgrade: "Analyze dependencies & plan safe upgrades",
};

for (const op of operations) {
  program
    .command(op)
    .description(opDesc[op] || `Run ${op} analysis on a codebase`)
    .argument("<source>", "Local path or GitHub URL")
    .option("-k, --api-key <key>", "Anthropic API key")
    .option("-m, --model <model>", "Claude model to use")
    .option("-t, --target <target>", "Migration target (for migrate)")
    .option("-c, --context <context>", "Additional context for the analysis")
    .option("-r, --raw", "Also print raw streaming output")
    .option("-y, --yes", "Skip cost confirmation prompt")
    .option("-o, --output <path>", "Export report to file (.md or .json)")
    .option("--create-pr", "Create a GitHub PR with auto-fixes after analysis")
    .action((source, options) => {
      analyzeCommand(op, source, options);
    });
}

// ─── Interactive mode ───────────────────────────────────────

program
  .command("interactive")
  .alias("i")
  .description("Launch interactive guided mode")
  .action(() => {
    interactiveCommand();
  });

// ─── Auth commands ──────────────────────────────────────────

program
  .command("login")
  .description("Sign in with Google via browser")
  .action(() => {
    loginCommand();
  });

program
  .command("logout")
  .description("Sign out and clear stored credentials")
  .action(() => {
    logoutCommand();
  });

program
  .command("delete-key")
  .description("Remove stored Anthropic API key")
  .action(() => {
    configDeleteCommand("api-key");
  });

program
  .command("whoami")
  .description("Show current user, API key status, and model")
  .action(() => {
    whoamiCommand();
  });

// ─── Config commands ────────────────────────────────────────

const config = program
  .command("config")
  .description("View or modify configuration")
  .action(() => {
    configShowCommand();
  });

config
  .command("set")
  .description("Set a config value (api-key, model)")
  .argument("<key>", "Config key (api-key, model)")
  .argument("<value>", "Config value")
  .action((key, value) => {
    configSetCommand(key, value);
  });

config
  .command("delete")
  .description("Delete a config value")
  .argument("<key>", "Config key (api-key, model)")
  .action((key) => {
    configDeleteCommand(key);
  });

// ─── Models command ─────────────────────────────────────────

program
  .command("models")
  .description("List available Claude models")
  .action(() => {
    modelsCommand();
  });

// ─── Update command ─────────────────────────────────────────

program
  .command("update")
  .description("Update Shipwell CLI to the latest version")
  .action(async () => {
    const { execSync } = await import("node:child_process");
    const ora = (await import("ora")).default;
    const spinner = ora({ text: "Checking for updates...", prefixText: "  " }).start();
    try {
      const latest = execSync("npm view @shipwellapp/cli version", { encoding: "utf-8" }).trim();
      if (latest === VERSION) {
        spinner.succeed(`Already on the latest version (${accent(VERSION)})`);
      } else {
        spinner.text = `Updating to v${latest}...`;
        execSync("npm install -g @shipwellapp/cli@latest", { stdio: "pipe" });
        spinner.succeed(`Updated to v${accent(latest)} ${dim(`(was v${VERSION})`)}`);
      }
    } catch {
      spinner.fail("Update failed. Try manually:");
      console.log(`  ${chalk.cyan("npm install -g @shipwellapp/cli@latest")}`);
    }
    console.log();
  });

// ─── Help command ──────────────────────────────────────────

program
  .command("help")
  .description("Show help for all commands, flags, and usage")
  .argument("[command]", "Show detailed help for a specific command")
  .action((cmd?: string) => {
    // If a specific command was requested, delegate to commander's built-in help
    if (cmd) {
      const sub = program.commands.find(c => c.name() === cmd || c.aliases().includes(cmd));
      if (sub) {
        sub.outputHelp();
        return;
      }
      console.log(chalk.red(`  Unknown command: ${cmd}\n`));
    }

    const w = Math.min(process.stdout.columns || 80, 90);
    const hr = dim("─".repeat(w));

    console.log();
    console.log(`  ${accent("⛵ Shipwell CLI")} ${dim(`v${VERSION}`)}`);
    console.log(`  ${dim("Full Codebase Autopilot — deep cross-file analysis powered by Claude")}`);
    console.log();
    console.log(hr);
    console.log();

    // Analysis operations
    console.log(`  ${bold("ANALYSIS OPERATIONS")}`);
    console.log();
    console.log(`  ${chalk.cyan("shipwell audit")} ${dim("<path>")}       ${dim("Run a security audit on a codebase")}`);
    console.log(`  ${chalk.cyan("shipwell migrate")} ${dim("<path>")}     ${dim("Plan a framework/library migration")}`);
    console.log(`  ${chalk.cyan("shipwell refactor")} ${dim("<path>")}    ${dim("Detect code smells & architecture issues")}`);
    console.log(`  ${chalk.cyan("shipwell docs")} ${dim("<path>")}        ${dim("Generate comprehensive documentation")}`);
    console.log(`  ${chalk.cyan("shipwell upgrade")} ${dim("<path>")}     ${dim("Analyze dependencies & plan upgrades")}`);
    console.log();
    console.log(`  ${dim("<path> can be a local directory or a GitHub URL")}`);
    console.log();
    console.log(hr);
    console.log();

    // Flags
    console.log(`  ${bold("FLAGS")} ${dim("(apply to any analysis command)")}`);
    console.log();
    console.log(`  ${accent("-k, --api-key <key>")}       ${dim("Override the stored API key for this run")}`);
    console.log(`  ${accent("-m, --model <model>")}       ${dim("Override the Claude model")}`);
    console.log(`  ${accent("-t, --target <target>")}     ${dim("Migration target framework/library")}`);
    console.log(`  ${accent("-c, --context <ctx>")}       ${dim("Additional context for the analysis")}`);
    console.log(`  ${accent("-r, --raw")}                 ${dim("Print raw streaming output alongside results")}`);
    console.log(`  ${accent("-y, --yes")}                 ${dim("Skip cost confirmation prompt")}`);
    console.log(`  ${accent("-o, --output <path>")}       ${dim("Export report to file (.md or .json)")}`);
    console.log(`  ${accent("    --create-pr")}           ${dim("Create a GitHub PR with auto-fixes")}`);
    console.log();
    console.log(hr);
    console.log();

    // Account & Config
    console.log(`  ${bold("ACCOUNT & CONFIG")}`);
    console.log();
    console.log(`  ${chalk.cyan("shipwell login")}              ${dim("Sign in with Google via browser")}`);
    console.log(`  ${chalk.cyan("shipwell logout")}             ${dim("Sign out and clear credentials")}`);
    console.log(`  ${chalk.cyan("shipwell whoami")}             ${dim("Show current user, API key & model")}`);
    console.log(`  ${chalk.cyan("shipwell config")}             ${dim("View current configuration")}`);
    console.log(`  ${chalk.cyan("shipwell config set")} ${dim("<k> <v>")}  ${dim("Set a config value (api-key, model)")}`);
    console.log(`  ${chalk.cyan("shipwell config delete")} ${dim("<k>")}  ${dim("Delete a config value")}`);
    console.log(`  ${chalk.cyan("shipwell delete-key")}         ${dim("Remove stored Anthropic API key")}`);
    console.log();
    console.log(hr);
    console.log();

    // Utilities
    console.log(`  ${bold("UTILITIES")}`);
    console.log();
    console.log(`  ${chalk.cyan("shipwell interactive")}        ${dim("Launch interactive guided mode")}`);
    console.log(`  ${chalk.cyan("shipwell models")}             ${dim("List available Claude models")}`);
    console.log(`  ${chalk.cyan("shipwell update")}             ${dim("Update CLI to the latest version")}`);
    console.log(`  ${chalk.cyan("shipwell help")}               ${dim("Show this help page")}`);
    console.log(`  ${chalk.cyan("shipwell help")} ${dim("<command>")}     ${dim("Show help for a specific command")}`);
    console.log();
    console.log(hr);
    console.log();

    // Examples
    console.log(`  ${bold("EXAMPLES")}`);
    console.log();
    console.log(`  ${dim("$")} ${chalk.cyan("shipwell audit ./my-app")}`);
    console.log(`  ${dim("$")} ${chalk.cyan('shipwell migrate ./app --target "Next.js 15"')}`);
    console.log(`  ${dim("$")} ${chalk.cyan("shipwell audit ./app --create-pr --yes")}`);
    console.log(`  ${dim("$")} ${chalk.cyan("shipwell audit ./app -o report.md -m claude-opus-4-6")}`);
    console.log(`  ${dim("$")} ${chalk.cyan("shipwell config set api-key sk-ant-api03-...")}`);
    console.log();
    console.log(`  ${dim("Docs:")} ${accent("https://shipwell.app/docs")}`);
    console.log();
  });

program.parse();
