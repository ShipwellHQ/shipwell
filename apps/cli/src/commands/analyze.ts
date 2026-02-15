import ora from "ora";
import chalk from "chalk";
import { ingestRepo, bundleCodebase, streamAnalysis, StreamingParser, getMaxCodebaseTokens } from "@shipwell/core";
import type { Operation, Finding, MetricEvent } from "@shipwell/core";
import { getApiKey, getModel, getUser } from "../lib/store.js";
import { estimateCost, formatCost } from "../lib/pricing.js";
import { promptConfirmation } from "../lib/prompts.js";
import { formatSummaryBox, formatFindingCard, formatMetric } from "../lib/formatters.js";
import { writeReport, type ExportData } from "../lib/export.js";

export interface AnalyzeOptions {
  apiKey?: string;
  target?: string;
  context?: string;
  model?: string;
  raw?: boolean;
  yes?: boolean;
  output?: string;
}

const accent = chalk.hex("#6366f1");
const dim = chalk.dim;
const bold = chalk.bold;

const opLabels: Record<string, string> = {
  audit: "Security Audit",
  migrate: "Migration Plan",
  refactor: "Refactor Analysis",
  docs: "Documentation",
  upgrade: "Dependency Upgrade",
};

export async function analyzeCommand(operation: Operation, source: string, options: AnalyzeOptions) {
  // Check login
  const user = getUser();
  if (!user) {
    console.error(chalk.red("\n  Error: Not logged in.\n"));
    console.error(dim("  Run ") + chalk.cyan("shipwell login") + dim(" to sign in with Google.\n"));
    process.exit(1);
  }

  // Resolve API key: flag > env > stored config
  const apiKey = options.apiKey || process.env.ANTHROPIC_API_KEY || getApiKey();
  if (!apiKey) {
    console.error(chalk.red("\n  Error: Anthropic API key is required.\n"));
    console.error(dim("  Set it with: ") + chalk.cyan("shipwell config set api-key sk-ant-..."));
    console.error(dim("  Or pass it:  ") + chalk.cyan("shipwell audit ./repo --api-key sk-ant-..."));
    console.error(dim("  Or set env:  ") + chalk.cyan("export ANTHROPIC_API_KEY=sk-ant-...\n"));
    process.exit(1);
  }

  // Resolve model: flag > env > stored config > default
  const model = options.model || process.env.SHIPWELL_MODEL || getModel() || "claude-sonnet-4-5-20250929";
  const startTime = Date.now();

  // Header
  console.log();
  console.log(accent("  \u26F5 Shipwell"), dim("\u2014 Full Codebase Autopilot"));
  console.log(dim(`  ${opLabels[operation] || operation} \u00B7 ${model}`));
  console.log();

  // Phase 1: Ingest (with progress callbacks)
  const spinner = ora({ text: "Scanning repository...", color: "cyan", prefixText: "  " }).start();

  let ingestResult: Awaited<ReturnType<typeof ingestRepo>>;
  try {
    ingestResult = await ingestRepo({
      source,
      maxTokens: getMaxCodebaseTokens(model),
      onScanProgress: (count) => {
        spinner.text = `Scanning... ${count} files found`;
      },
      onReadProgress: (current, total) => {
        spinner.text = `Reading files [${current}/${total}]...`;
      },
    });
    spinner.succeed(
      `Read ${bold(String(ingestResult.totalFiles))} files ${dim(`(${ingestResult.skippedFiles} skipped, ~${Math.round(ingestResult.totalTokens / 1000)}K tokens)`)}`
    );
  } catch (err: any) {
    spinner.fail(`Failed to read repository: ${err.message}`);
    process.exit(1);
  }

  // Phase 2: Bundle
  const bundleSpinner = ora({ text: "Bundling codebase...", color: "cyan", prefixText: "  " }).start();
  const bundle = bundleCodebase(ingestResult!);
  bundleSpinner.succeed(
    `Bundled ${bold(String(bundle.includedFiles))} files ${dim(`(~${Math.round(bundle.totalTokens / 1000)}K tokens)`)}`
  );

  // Cost estimation + confirmation
  const { cost, outputTokens } = estimateCost(bundle.totalTokens, model, operation);
  if (!options.yes) {
    console.log();
    console.log(`  ${dim("Estimated cost:")} ${bold(`~${formatCost(cost)}`)} ${dim(`(${Math.round(bundle.totalTokens / 1000)}K input + ~${Math.round(outputTokens / 1000)}K output tokens)`)}`);
    const proceed = await promptConfirmation("Proceed?");
    if (!proceed) {
      console.log(dim("\n  Cancelled.\n"));
      process.exit(0);
    }
  }

  // Phase 3: Analyze — stream findings in real-time
  const analyzeSpinner = ora({ text: `Analyzing...`, color: "magenta", prefixText: "  " }).start();

  const parser = new StreamingParser();
  const allFindings: Finding[] = [];
  const allMetrics: MetricEvent[] = [];
  let headerPrinted = false;

  try {
    for await (const chunk of streamAnalysis({
      apiKey,
      operation,
      model,
      codebaseXml: bundle.xml,
      target: options.target,
      context: options.context,
    })) {
      const { findings, metrics } = parser.push(chunk);

      // Stream findings live as they arrive
      for (const f of findings) {
        if (!headerPrinted) {
          analyzeSpinner.stop();
          console.log();
          console.log(accent("  \u2500\u2500\u2500 Findings \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500"));
          console.log();
          headerPrinted = true;
        } else {
          analyzeSpinner.stop();
        }
        allFindings.push(f);
        console.log(formatFindingCard(f, allFindings.length - 1));
        console.log();
        analyzeSpinner.start(`Analyzing... ${dim(`${allFindings.length} findings`)}`);
      }

      // Stream metrics live
      for (const m of metrics) {
        allMetrics.push(m);
        analyzeSpinner.text = `Analyzing... ${dim(`${allFindings.length} findings, ${allMetrics.length} metrics`)}`;
      }

      if (options.raw) {
        analyzeSpinner.stop();
        process.stdout.write(chunk);
        analyzeSpinner.start();
      }
    }
  } catch (err: any) {
    analyzeSpinner.fail(`Analysis failed: ${err.message}`);
    process.exit(1);
  }

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  analyzeSpinner.stop();

  if (allFindings.length === 0 && !headerPrinted) {
    console.log();
    console.log(dim("  No findings."));
  }

  // Metrics
  if (allMetrics.length > 0) {
    console.log(accent("  \u2500\u2500\u2500 Metrics \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500"));
    console.log();
    for (const m of allMetrics) {
      console.log(formatMetric(m));
    }
    console.log();
  }

  // Summary
  const summary = parser.getSummary();
  if (summary) {
    console.log(accent("  \u2500\u2500\u2500 Summary \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500"));
    console.log();
    console.log(`  ${dim(summary)}`);
    console.log();
  }

  // Summary box
  const critCount = allFindings.filter(f => f.severity === "critical").length;
  const highCount = allFindings.filter(f => f.severity === "high").length;
  const medCount = allFindings.filter(f => f.severity === "medium").length;
  const lowCount = allFindings.filter(f => f.severity === "low").length;
  const crossFileCount = allFindings.filter(f => f.crossFile).length;

  console.log(formatSummaryBox({
    totalFindings: allFindings.length,
    critCount,
    highCount,
    medCount,
    lowCount,
    crossFileCount,
    filesAnalyzed: bundle.includedFiles,
    tokensK: Math.round(bundle.totalTokens / 1000),
    elapsed,
  }));
  console.log();

  // Export report if --output specified
  if (options.output) {
    const exportData: ExportData = {
      operation,
      source,
      model,
      timestamp: new Date().toISOString().split("T")[0],
      findings: allFindings,
      metrics: allMetrics,
      summary: summary || null,
      stats: {
        totalFindings: allFindings.length,
        crossFileCount,
        duration: parseFloat(elapsed),
        filesAnalyzed: bundle.includedFiles,
        tokensProcessed: bundle.totalTokens,
      },
    };

    try {
      await writeReport(exportData, options.output);
      console.log(`  ${chalk.green("\u2713")} Report saved to ${chalk.cyan(options.output)}`);
      console.log();
    } catch (err: any) {
      console.error(`  ${chalk.red("\u2717")} Failed to write report: ${err.message}`);
    }
  }
}
