import ora from "ora";
import chalk from "chalk";
import { ingestRepo, bundleCodebase, streamAnalysis, StreamingParser } from "@shipwell/core";
import type { Operation } from "@shipwell/core";

interface AnalyzeOptions {
  apiKey?: string;
  target?: string;
  context?: string;
}

export async function analyzeCommand(operation: Operation, source: string, options: AnalyzeOptions) {
  const apiKey = options.apiKey || process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error(chalk.red("Error: Anthropic API key is required."));
    console.error(chalk.dim("Set ANTHROPIC_API_KEY env var or use --api-key flag"));
    process.exit(1);
  }

  console.log();
  console.log(chalk.bold.hex("#6366f1")("  ⛵ Shipwell"), chalk.dim("— Full Codebase Autopilot"));
  console.log();

  // Phase 1: Ingest
  const spinner = ora({ text: "Reading repository...", color: "cyan" }).start();

  let ingestResult: Awaited<ReturnType<typeof ingestRepo>>;
  try {
    ingestResult = await ingestRepo({ source });
    spinner.succeed(
      `Read ${chalk.bold(ingestResult.totalFiles)} files (${chalk.dim(`${ingestResult.skippedFiles} skipped`)})`
    );
  } catch (err: any) {
    spinner.fail(`Failed to read repository: ${err.message}`);
    process.exit(1);
  }

  // Phase 2: Bundle
  const bundleSpinner = ora({ text: "Bundling codebase...", color: "cyan" }).start();
  const bundle = bundleCodebase(ingestResult!);
  bundleSpinner.succeed(
    `Bundled ${chalk.bold(bundle.includedFiles)} files (${chalk.dim(`~${Math.round(bundle.totalTokens / 1000)}K tokens`)})`
  );

  // Phase 3: Analyze
  console.log();
  console.log(chalk.bold(`Running ${operation} analysis with Claude Opus 4.6...`));
  console.log(chalk.dim("─".repeat(60)));
  console.log();

  const parser = new StreamingParser();

  try {
    for await (const chunk of streamAnalysis({
      apiKey,
      operation,
      codebaseXml: bundle.xml,
      target: options.target,
      context: options.context,
    })) {
      // Stream raw output
      process.stdout.write(chunk);
      parser.push(chunk);
    }
  } catch (err: any) {
    console.error();
    console.error(chalk.red(`Analysis failed: ${err.message}`));
    process.exit(1);
  }

  console.log();
  console.log(chalk.dim("─".repeat(60)));
  console.log();

  // Summary
  const summary = parser.getSummary();
  if (summary) {
    console.log(chalk.bold("Summary:"), summary);
    console.log();
  }

  console.log(chalk.green("✓"), chalk.bold("Analysis complete"));
}
