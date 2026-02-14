#!/usr/bin/env node

import { Command } from "commander";
import { analyzeCommand } from "./commands/analyze.js";

const program = new Command();

program
  .name("shipwell")
  .description("Full Codebase Autopilot — deep cross-file analysis powered by Claude Opus 4.6")
  .version("0.1.0");

const operations = ["audit", "migrate", "refactor", "docs", "upgrade"] as const;

for (const op of operations) {
  program
    .command(op)
    .description(`Run ${op} analysis on a codebase`)
    .argument("<source>", "Local path or GitHub URL")
    .option("-k, --api-key <key>", "Anthropic API key (or set ANTHROPIC_API_KEY env var)")
    .option("-t, --target <target>", "Migration target (for migrate operation)")
    .option("-c, --context <context>", "Additional context for the analysis")
    .action((source, options) => {
      analyzeCommand(op, source, options);
    });
}

program.parse();
