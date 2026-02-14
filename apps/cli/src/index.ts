#!/usr/bin/env node

import { Command } from "commander";
import chalk from "chalk";
import { analyzeCommand } from "./commands/analyze.js";
import { loginCommand } from "./commands/login.js";
import { logoutCommand } from "./commands/logout.js";
import { whoamiCommand } from "./commands/whoami.js";
import { configShowCommand, configSetCommand, configDeleteCommand } from "./commands/config-cmd.js";
import { modelsCommand } from "./commands/models.js";
import { getUser, getApiKey } from "./lib/store.js";

const VERSION = "0.2.0";

const accent = chalk.hex("#6366f1");
const dim = chalk.dim;

function showBanner() {
  const user = getUser();
  const apiKey = getApiKey();

  console.log();
  console.log(`  ${accent("⛵")} ${chalk.bold("Shipwell")} ${dim(`v${VERSION}`)}`);
  console.log(`  ${dim("Full Codebase Autopilot — powered by Claude")}`);
  console.log();

  if (!user) {
    console.log(`  ${chalk.yellow("●")} Not logged in`);
    console.log(`  ${dim("Get started:")} ${chalk.cyan("shipwell login")}`);
    console.log();
  } else if (!apiKey) {
    console.log(`  ${chalk.green("●")} ${user.name} ${dim(`(${user.email})`)}`);
    console.log(`  ${chalk.yellow("●")} API key not set`);
    console.log(`  ${dim("Set it:")} ${chalk.cyan("shipwell config set api-key")} ${dim("sk-ant-...")}`);
    console.log();
  } else {
    console.log(`  ${chalk.green("●")} ${user.name} ${dim(`(${user.email})`)}`);
    console.log(`  ${chalk.green("●")} API key configured`);
    console.log();
  }

  console.log(`  ${chalk.bold("Analysis Commands")}`);
  console.log(`    ${chalk.cyan("shipwell audit")} ${dim("<path>")}       Security audit`);
  console.log(`    ${chalk.cyan("shipwell migrate")} ${dim("<path>")}     Migration plan`);
  console.log(`    ${chalk.cyan("shipwell refactor")} ${dim("<path>")}    Refactor analysis`);
  console.log(`    ${chalk.cyan("shipwell docs")} ${dim("<path>")}        Generate documentation`);
  console.log(`    ${chalk.cyan("shipwell upgrade")} ${dim("<path>")}     Dependency upgrade plan`);
  console.log();
  console.log(`  ${chalk.bold("Account & Config")}`);
  console.log(`    ${chalk.cyan("shipwell login")}                Sign in with Google`);
  console.log(`    ${chalk.cyan("shipwell logout")}               Sign out`);
  console.log(`    ${chalk.cyan("shipwell whoami")}               Show current user & config`);
  console.log(`    ${chalk.cyan("shipwell config")}               View configuration`);
  console.log(`    ${chalk.cyan("shipwell config set")} ${dim("<k> <v>")}  Set a config value`);
  console.log(`    ${chalk.cyan("shipwell models")}               List available models`);
  console.log(`    ${chalk.cyan("shipwell update")}               Update to latest version`);
  console.log();
  console.log(`  ${dim("Docs: https://shipwell.app  ·  v" + VERSION)}`);
  console.log();
}

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
    .action((source, options) => {
      analyzeCommand(op, source, options);
    });
}

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
    } catch (err: any) {
      spinner.fail("Update failed. Try manually:");
      console.log(`  ${chalk.cyan("npm install -g @shipwellapp/cli@latest")}`);
    }
    console.log();
  });

program.parse();
