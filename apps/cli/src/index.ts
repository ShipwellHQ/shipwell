#!/usr/bin/env node

import { Command } from "commander";
import { analyzeCommand } from "./commands/analyze.js";

const program = new Command();

program
  .name("shipwell")
  .description("Full Codebase Autopilot — deep cross-file analysis powered by Claude")
  .version("0.1.0");

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
    .option("-k, --api-key <key>", "Anthropic API key (or set ANTHROPIC_API_KEY env var)")
    .option("-m, --model <model>", "Claude model to use (or set SHIPWELL_MODEL env var)")
    .option("-t, --target <target>", "Migration target (for migrate operation)")
    .option("-c, --context <context>", "Additional context for the analysis")
    .option("-r, --raw", "Also print raw streaming output")
    .action((source, options) => {
      analyzeCommand(op, source, options);
    });
}

program.parse();
