import ora from "ora";
import chalk from "chalk";
import { ingestRepo, bundleCodebase, streamAnalysis, StreamingParser, getMaxCodebaseTokens } from "@shipwell/core";
import type { Operation, Finding, MetricEvent } from "@shipwell/core";
import { getApiKey, getModel, getUser } from "../lib/store.js";

interface AnalyzeOptions {
  apiKey?: string;
  target?: string;
  context?: string;
  model?: string;
  raw?: boolean;
}

const accent = chalk.hex("#6366f1");
const dim = chalk.dim;
const bold = chalk.bold;

const severityColor: Record<string, (s: string) => string> = {
  critical: chalk.red.bold,
  high: chalk.hex("#f97316").bold,
  medium: chalk.yellow,
  low: chalk.blue,
  info: chalk.dim,
};

const opLabels: Record<string, string> = {
  audit: "Security Audit",
  migrate: "Migration Plan",
  refactor: "Refactor Analysis",
  docs: "Documentation",
  upgrade: "Dependency Upgrade",
};

function severityBadge(sev?: string): string {
  if (!sev) return "";
  const color = severityColor[sev] || chalk.dim;
  return color(` [${sev.toUpperCase()}]`);
}

function formatFinding(f: Finding, i: number): string {
  const lines: string[] = [];
  const num = dim(`${String(i + 1).padStart(2)}.`);
  const cross = f.crossFile ? accent(" ⟷ cross-file") : "";
  lines.push(`  ${num} ${bold(f.title)}${severityBadge(f.severity)}${cross}`);
  if (f.description) {
    lines.push(`     ${dim(f.description)}`);
  }
  if (f.files.length > 0) {
    lines.push(`     ${dim("files:")} ${f.files.map(file => chalk.cyan(file)).join(dim(", "))}`);
  }
  return lines.join("\n");
}

function formatMetric(m: MetricEvent): string {
  return `  ${dim("•")} ${m.label}: ${chalk.red(m.before)} ${dim("→")} ${chalk.green(m.after)}${m.unit ? dim(` ${m.unit}`) : ""}`;
}

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
  console.log(accent("  ⛵ Shipwell"), dim("— Full Codebase Autopilot"));
  console.log(dim(`  ${opLabels[operation] || operation} · ${model}`));
  console.log();

  // Phase 1: Ingest
  const spinner = ora({ text: "Reading repository...", color: "cyan", prefixText: "  " }).start();

  let ingestResult: Awaited<ReturnType<typeof ingestRepo>>;
  try {
    ingestResult = await ingestRepo({ source, maxTokens: getMaxCodebaseTokens(model) });
    spinner.succeed(
      `Read ${bold(ingestResult.totalFiles)} files ${dim(`(${ingestResult.skippedFiles} skipped, ~${Math.round(ingestResult.totalTokens / 1000)}K tokens)`)}`
    );
  } catch (err: any) {
    spinner.fail(`Failed to read repository: ${err.message}`);
    process.exit(1);
  }

  // Phase 2: Bundle
  const bundleSpinner = ora({ text: "Bundling codebase...", color: "cyan", prefixText: "  " }).start();
  const bundle = bundleCodebase(ingestResult!);
  bundleSpinner.succeed(
    `Bundled ${bold(bundle.includedFiles)} files ${dim(`(~${Math.round(bundle.totalTokens / 1000)}K tokens)`)}`
  );

  // Phase 3: Analyze
  const analyzeSpinner = ora({ text: `Running ${operation} analysis...`, color: "magenta", prefixText: "  " }).start();

  const parser = new StreamingParser();
  const allFindings: Finding[] = [];
  const allMetrics: MetricEvent[] = [];

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

      if (findings.length > 0 || metrics.length > 0) {
        allFindings.push(...findings);
        allMetrics.push(...metrics);
        analyzeSpinner.text = `Analyzing... ${dim(`${allFindings.length} findings, ${allMetrics.length} metrics`)}`;
      }

      if (options.raw) {
        process.stdout.write(chunk);
      }
    }
  } catch (err: any) {
    analyzeSpinner.fail(`Analysis failed: ${err.message}`);
    process.exit(1);
  }

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  analyzeSpinner.succeed(`Analysis complete ${dim(`(${elapsed}s)`)}`);

  // Results
  console.log();
  console.log(accent("  ─── Results ───────────────────────────────────────────"));
  console.log();

  // Findings
  if (allFindings.length > 0) {
    const critCount = allFindings.filter(f => f.severity === "critical").length;
    const highCount = allFindings.filter(f => f.severity === "high").length;
    const medCount = allFindings.filter(f => f.severity === "medium").length;
    const lowCount = allFindings.filter(f => f.severity === "low").length;
    const crossCount = allFindings.filter(f => f.crossFile).length;

    const counts = [
      critCount > 0 ? chalk.red(`${critCount} critical`) : null,
      highCount > 0 ? chalk.hex("#f97316")(`${highCount} high`) : null,
      medCount > 0 ? chalk.yellow(`${medCount} medium`) : null,
      lowCount > 0 ? chalk.blue(`${lowCount} low`) : null,
    ].filter(Boolean).join(dim(" · "));

    console.log(`  ${bold(`${allFindings.length} Findings`)} ${dim("(")}${counts}${dim(")")}`);
    if (crossCount > 0) {
      console.log(`  ${accent(`${crossCount} cross-file issues`)}`);
    }
    console.log();

    for (let i = 0; i < allFindings.length; i++) {
      console.log(formatFinding(allFindings[i], i));
      if (i < allFindings.length - 1) console.log();
    }
  } else {
    console.log(dim("  No findings."));
  }

  // Metrics
  if (allMetrics.length > 0) {
    console.log();
    console.log(`  ${bold("Metrics")}`);
    for (const m of allMetrics) {
      console.log(formatMetric(m));
    }
  }

  // Summary
  const summary = parser.getSummary();
  if (summary) {
    console.log();
    console.log(`  ${bold("Summary")}`);
    console.log(`  ${dim(summary)}`);
  }

  // Footer
  console.log();
  console.log(accent("  ─────────────────────────────────────────────────────"));
  console.log(`  ${chalk.green("✓")} ${bold(`${allFindings.length} findings`)} in ${elapsed}s · ${dim(`${bundle.includedFiles} files · ~${Math.round(bundle.totalTokens / 1000)}K tokens`)}`);
  console.log();
}
