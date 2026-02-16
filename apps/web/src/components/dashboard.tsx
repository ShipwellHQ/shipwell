"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield, ArrowRight, GitBranch, BookOpen, PackageCheck,
  Play, Square, Loader2, Link2,
  AlertTriangle, Scan, FileCode2, ChevronRight, Key, Terminal, ExternalLink,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import clsx from "clsx";
import { Navbar } from "@/components/navbar";
import { ActivityLog } from "@/components/activity-log";
import { useSSE } from "@/hooks/use-sse";
import { useApiKey } from "@/hooks/use-api-key";
import { FindingCard } from "@/components/finding-card";
import { AnimatedNumber } from "@/components/animated-number";
import { MetricCard } from "@/components/metric-card";
import { StreamingOutput } from "@/components/streaming-output";
import { HealthScore } from "@/components/health-score";
import { SeverityBar } from "@/components/severity-bar";
import { FileImpact } from "@/components/file-impact";
import { CrossFileGraph } from "@/components/cross-file-graph";
import { ExportButton } from "@/components/export-button";
import { CreatePRButton } from "@/components/create-pr-button";
import { TokenGauge } from "@/components/token-gauge";
import { useToasts, ToastContainer } from "@/components/toast";
import { AVAILABLE_MODELS, DEFAULT_MODEL } from "@shipwell/core/client";

const operations = [
  { id: "audit", label: "Security Audit", icon: Shield, color: "text-red-400", bg: "bg-red-500/8", desc: "Find vulnerabilities" },
  { id: "migrate", label: "Migration", icon: ArrowRight, color: "text-blue-400", bg: "bg-blue-500/8", desc: "Plan migrations" },
  { id: "refactor", label: "Refactor", icon: GitBranch, color: "text-purple-400", bg: "bg-purple-500/8", desc: "Detect code smells" },
  { id: "docs", label: "Documentation", icon: BookOpen, color: "text-emerald-400", bg: "bg-emerald-500/8", desc: "Generate docs" },
  { id: "upgrade", label: "Dep. Upgrade", icon: PackageCheck, color: "text-amber-400", bg: "bg-amber-500/8", desc: "Upgrade deps" },
] as const;

type Tab = "findings" | "raw" | "metrics";

export function Dashboard() {
  return (
    <Suspense>
      <DashboardContent />
    </Suspense>
  );
}

function DashboardContent() {
  const [source, setSource] = useState("");
  const [operation, setOperation] = useState<string>("audit");
  const [target, setTarget] = useState("");
  const [context, setContext] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("findings");
  const [filterCrossFile, setFilterCrossFile] = useState(false);
  const [filterSeverity, setFilterSeverity] = useState<string | null>(null);

  const sse = useSSE();
  const { apiKey, isConnected, loaded } = useApiKey();
  const { toasts, addToast, dismissToast } = useToasts();
  const prevFindingCount = useRef(0);
  const searchParams = useSearchParams();
  const demoTriggered = useRef(false);

  // Auto-start demo mode from URL param
  useEffect(() => {
    if (searchParams.get("demo") === "true" && !demoTriggered.current && sse.status === "idle") {
      demoTriggered.current = true;
      sse.loadDemo();
    }
  }, [searchParams, sse.status, sse.loadDemo]);

  // Toast for critical/high findings
  useEffect(() => {
    if (sse.findings.length > prevFindingCount.current) {
      const newFindings = sse.findings.slice(prevFindingCount.current);
      for (const f of newFindings) {
        if (f.severity === "critical" || f.severity === "high") {
          addToast(f.severity, f.title);
        }
      }
    }
    prevFindingCount.current = sse.findings.length;
  }, [sse.findings, addToast]);

  const [model, setModel] = useState(DEFAULT_MODEL);

  useEffect(() => {
    const stored = localStorage.getItem("shipwell_model");
    if (stored) setModel(stored);
  }, []);

  const handleStart = () => {
    if (!source || !apiKey || !isGitHubUrl) return;
    sse.start({
      operation,
      source,
      apiKey,
      model,
      target: target || undefined,
      context: context || undefined,
    });
  };

  const filteredFindings = sse.findings.filter((f) => {
    if (filterCrossFile && !f.crossFile) return false;
    if (filterSeverity && f.severity !== filterSeverity) return false;
    return true;
  });

  const crossFileCount = sse.findings.filter((f) => f.crossFile).length;
  const isRunning = sse.status === "connecting" || sse.status === "streaming";
  const isGitHubUrl = /^(https?:\/\/)?(www\.)?github\.com\/[^/]+\/[^/]+/.test(source);
  const isReady = !!source && isGitHubUrl && isConnected;

  const severityCounts = {
    critical: sse.findings.filter((f) => f.severity === "critical").length,
    high: sse.findings.filter((f) => f.severity === "high").length,
    medium: sse.findings.filter((f) => f.severity === "medium").length,
    low: sse.findings.filter((f) => f.severity === "low").length,
    info: sse.findings.filter((f) => !f.severity || f.severity === "info").length,
  };
  const hasSeverityData = sse.findings.length > 0;

  const healthMetric = sse.metrics.find((m) => /health\s*score/i.test(m.label));
  const healthBeforeRaw = healthMetric ? parseFloat(String(healthMetric.before)) : NaN;
  const healthAfterRaw = healthMetric ? parseFloat(String(healthMetric.after)) : NaN;
  const healthBefore = Number.isFinite(healthBeforeRaw) ? healthBeforeRaw : null;
  const healthAfter = Number.isFinite(healthAfterRaw) ? healthAfterRaw : null;
  const showDashboard = isRunning || sse.findings.length > 0 || healthMetric;

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Navbar />

      <div className="flex-1 flex min-h-0">
        {/* Sidebar — fixed height, internally scrollable */}
        <aside className="w-[300px] border-r border-border flex flex-col shrink-0 bg-bg-card/30">
          {/* Scrollable controls */}
          <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-5 sidebar-scroll">
            {/* API Key Warning */}
            {loaded && !isConnected && (
              <Link
                href="/settings"
                className="flex items-center gap-2.5 px-3 py-2.5 bg-warning/8 border border-warning/20 text-warning rounded-xl text-[12px] hover:bg-warning/12 transition-colors"
              >
                <Key className="w-3.5 h-3.5 shrink-0" />
                <span className="flex-1 font-medium">Connect API key</span>
                <ChevronRight className="w-3.5 h-3.5 shrink-0" />
              </Link>
            )}

            {/* Repository Input */}
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-text-dim font-semibold mb-1.5">GitHub Repository</label>
              <input
                type="text"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                placeholder="https://github.com/owner/repo"
                className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-[13px] focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/30 placeholder:text-text-dim transition-colors"
                disabled={isRunning}
              />
              {source && !isGitHubUrl && (
                <p className="text-[11px] text-red-400 mt-1">Please enter a valid GitHub repository URL</p>
              )}
            </div>

            {/* Gradient divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

            {/* Operation Selector */}
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-text-dim font-semibold mb-1.5">Operation</label>
              <div className="grid gap-1">
                {operations.map((op) => (
                  <button
                    key={op.id}
                    onClick={() => setOperation(op.id)}
                    disabled={isRunning}
                    className={clsx(
                      "flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left transition-all duration-150",
                      operation === op.id
                        ? "bg-accent/8 border border-accent/25"
                        : "border border-transparent hover:bg-bg-elevated"
                    )}
                  >
                    <div className={clsx(
                      "w-8 h-8 rounded-md flex items-center justify-center shrink-0",
                      operation === op.id ? "bg-accent/15" : op.bg
                    )}>
                      <op.icon className={clsx("w-4 h-4", operation === op.id ? "text-accent" : op.color)} />
                    </div>
                    <div className="min-w-0">
                      <div className={clsx(
                        "text-[13px] font-medium leading-tight",
                        operation === op.id ? "text-accent" : "text-text"
                      )}>
                        {op.label}
                      </div>
                      <div className="text-[10px] text-text-dim leading-tight">{op.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Gradient divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

            {/* Migration Target */}
            {operation === "migrate" && (
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-text-dim font-semibold mb-1.5">Migration Target</label>
                <input
                  type="text"
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  placeholder="e.g. React 19, Next.js 15"
                  className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-[13px] focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/30 placeholder:text-text-dim transition-colors"
                  disabled={isRunning}
                />
              </div>
            )}

            {/* Additional Context */}
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-text-dim font-semibold mb-1.5">
                Context <span className="font-normal normal-case text-text-dim">(optional)</span>
              </label>
              <textarea
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder="Focus on specific areas..."
                rows={2}
                className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-[13px] focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/30 placeholder:text-text-dim resize-none transition-colors"
                disabled={isRunning}
              />
            </div>

            {/* Demo Button */}
            {!isRunning && sse.status !== "streaming" && (
              <button
                onClick={() => sse.loadDemo()}
                className="flex items-center gap-2.5 px-3 py-2.5 bg-purple-500/5 border border-purple-500/15 rounded-xl text-[12px] hover:bg-purple-500/10 transition-colors group w-full text-left"
              >
                <div className="w-7 h-7 rounded-md bg-purple-500/10 flex items-center justify-center shrink-0">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[12px] font-medium text-text leading-tight">Load Demo</div>
                  <div className="text-[10px] text-text-dim leading-tight">See a sample analysis</div>
                </div>
              </button>
            )}

            {/* CLI Link */}
            <Link
              href="/docs#cli"
              className="flex items-center gap-2.5 px-3 py-2.5 bg-accent/5 border border-accent/10 rounded-xl text-[12px] hover:bg-accent/10 transition-colors group"
            >
              <div className="w-7 h-7 rounded-md bg-accent/10 flex items-center justify-center shrink-0">
                <Terminal className="w-3.5 h-3.5 text-accent" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[12px] font-medium text-text leading-tight">Shipwell CLI</div>
                <div className="text-[10px] text-text-dim leading-tight">Run from your terminal</div>
              </div>
              <ExternalLink className="w-3 h-3 text-text-dim group-hover:text-accent transition-colors shrink-0" />
            </Link>
          </div>

          {/* Bottom bar — always visible */}
          <div className="p-3 border-t border-border space-y-2.5 shrink-0 bg-bg-card/50">
            {/* Model */}
            <div className="flex items-center justify-between px-1">
              <span className="text-[10px] text-text-dim truncate">
                {AVAILABLE_MODELS.find(m => m.id === model)?.label || model}
              </span>
              <Link href="/settings" className="text-[10px] text-accent hover:text-accent-hover font-medium shrink-0">
                Change
              </Link>
            </div>

            {/* Action Button */}
            {isRunning ? (
              <button
                onClick={sse.stop}
                className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-danger/10 hover:bg-danger/15 text-danger font-semibold rounded-xl transition-colors border border-danger/20 text-[13px]"
              >
                <Square className="w-3.5 h-3.5" />
                Stop
              </button>
            ) : (
              <button
                onClick={handleStart}
                disabled={!isReady}
                className={clsx(
                  "flex items-center justify-center gap-2 w-full px-4 py-3 bg-accent hover:bg-accent-hover disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-200 text-[14px]",
                  isReady ? "glow-pulse" : "glow-accent"
                )}
              >
                <Play className="w-3.5 h-3.5" />
                Start Analysis
              </button>
            )}
          </div>
        </aside>

        {/* Main Content — scrolls independently */}
        <main className={clsx("flex-1 min-h-0 overflow-y-auto", sse.status === "idle" && "bg-analysis-gradient")}>
          {sse.status === "idle" ? (
            /* Empty State */
            <div className="h-full flex items-center justify-center">
              <div className="text-center max-w-xs">
                {/* Animated pulse rings */}
                <div className="relative w-20 h-20 mx-auto mb-5">
                  <div className="absolute inset-0 rounded-2xl border border-accent/20" style={{ animation: "pulse-ring 3s ease-in-out infinite" }} />
                  <div className="absolute inset-[-8px] rounded-3xl border border-accent/10" style={{ animation: "pulse-ring 3s ease-in-out infinite 0.5s" }} />
                  <div className="absolute inset-[-16px] rounded-[20px] border border-accent/5" style={{ animation: "pulse-ring 3s ease-in-out infinite 1s" }} />
                  <div className="absolute inset-0 rounded-2xl bg-bg-elevated border border-border flex items-center justify-center">
                    <Scan className="w-8 h-8 text-text-dim" />
                  </div>
                </div>
                <h3 className="font-semibold text-lg mb-2">Ready to analyze</h3>
                <p className="text-text-dim text-sm leading-relaxed mb-4">
                  Enter a repository and choose an operation to start deep cross-file analysis.
                </p>
                {!isConnected && loaded && (
                  <Link
                    href="/settings"
                    className="inline-flex items-center gap-1.5 text-accent text-sm hover:text-accent-hover font-medium"
                  >
                    Connect your API key first
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
            </div>
          ) : (
            <div className="p-6 space-y-5">
              {/* Activity Log */}
              <ActivityLog activity={sse.activity} isRunning={isRunning} startedAt={sse.startedAt} tokenChars={sse.rawText.length} />

              {/* Token Gauge */}
              {sse.tokenInfo && (
                <TokenGauge tokenInfo={sse.tokenInfo} outputChars={sse.rawText.length} />
              )}

              {/* Error Banner */}
              {sse.error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-danger/8 border border-danger/20 rounded-xl p-4 text-danger text-[13px] flex items-start gap-3"
                >
                  <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                  <span className="leading-relaxed">{sse.error}</span>
                </motion.div>
              )}

              {/* Dashboard Row */}
              {showDashboard && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 md:grid-cols-3 gap-4"
                >
                  {healthBefore !== null && healthAfter !== null ? (
                    <HealthScore before={healthBefore} after={healthAfter} />
                  ) : !isRunning ? (
                    <HealthScore before={0} after={0} />
                  ) : (
                    <DashboardShimmer label="Health Score" />
                  )}
                  {hasSeverityData || !isRunning ? (
                    <SeverityBar {...severityCounts} />
                  ) : (
                    <DashboardShimmer label="Severity Distribution" />
                  )}
                  {sse.findings.length > 0 || !isRunning ? (
                    <FileImpact findings={sse.findings} />
                  ) : (
                    <DashboardShimmer label="Most Impacted Files" />
                  )}
                </motion.div>
              )}

              {/* Cross-File Graph */}
              {crossFileCount > 0 && (
                <CrossFileGraph findings={sse.findings} />
              )}

              {/* Tabs */}
              <div className="flex items-center gap-0.5 border-b border-border">
                {([
                  { key: "findings" as Tab, label: "Findings", count: sse.findings.length },
                  { key: "raw" as Tab, label: "Raw Output", count: 0 },
                  { key: "metrics" as Tab, label: "Metrics", count: sse.metrics.length },
                ]).map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={clsx(
                      "px-4 py-2.5 text-[13px] font-medium border-b-2 transition-all duration-150 -mb-px",
                      activeTab === tab.key
                        ? "border-accent text-accent"
                        : "border-transparent text-text-muted hover:text-text"
                    )}
                  >
                    {tab.label}
                    {tab.count > 0 && (
                      <span className={clsx(
                        "ml-2 px-1.5 py-0.5 text-[10px] rounded-full font-semibold",
                        activeTab === tab.key
                          ? "bg-accent/15 text-accent"
                          : "bg-bg-elevated text-text-dim"
                      )}>
                        <AnimatedNumber value={tab.count} />
                      </span>
                    )}
                  </button>
                ))}

                <div className="flex-1" />

                {/* Export + Fix PR */}
                {sse.status === "complete" && sse.findings.length > 0 && (
                  <>
                    <CreatePRButton
                      findings={sse.findings}
                      operation={operation}
                      source={source}
                    />
                    <ExportButton
                      findings={sse.findings}
                      metrics={sse.metrics}
                      summary={sse.summary}
                      operation={operation}
                      source={source}
                    />
                  </>
                )}

                {/* Filters */}
                {activeTab === "findings" && sse.findings.length > 0 && (
                  <div className="flex items-center gap-1.5 pb-1">
                    <button
                      onClick={() => setFilterCrossFile(!filterCrossFile)}
                      className={clsx(
                        "flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors",
                        filterCrossFile
                          ? "bg-accent/15 text-accent ring-1 ring-accent/20"
                          : "text-text-muted hover:text-text hover:bg-bg-elevated"
                      )}
                    >
                      <Link2 className="w-3 h-3" />
                      Cross-file ({crossFileCount})
                    </button>
                    {["critical", "high", "medium", "low"].map((sev) => {
                      const count = sse.findings.filter((f) => f.severity === sev).length;
                      if (count === 0) return null;
                      return (
                        <button
                          key={sev}
                          onClick={() => setFilterSeverity(filterSeverity === sev ? null : sev)}
                          className={clsx(
                            "px-2.5 py-1 rounded-lg text-[11px] font-medium capitalize transition-colors",
                            filterSeverity === sev
                              ? "bg-accent/15 text-accent ring-1 ring-accent/20"
                              : "text-text-muted hover:text-text hover:bg-bg-elevated"
                          )}
                        >
                          {sev} ({count})
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Tab Content */}
              <AnimatePresence mode="wait">
                {activeTab === "findings" && (
                  <motion.div
                    key="findings"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-3"
                  >
                    {filteredFindings.length > 0 ? (
                      filteredFindings.map((f, i) => (
                        <FindingCard key={f.id} finding={f} index={i} />
                      ))
                    ) : sse.findings.length > 0 ? (
                      <div className="text-center py-12">
                        <FileCode2 className="w-8 h-8 text-text-dim mx-auto mb-3" />
                        <p className="text-text-dim text-sm">No findings match the current filters</p>
                      </div>
                    ) : isRunning ? (
                      <div className="flex items-center gap-2.5 text-text-muted text-sm py-12 justify-center">
                        <Loader2 className="w-4 h-4 animate-spin text-accent" />
                        Analyzing... findings will appear as they&apos;re discovered
                      </div>
                    ) : null}
                  </motion.div>
                )}

                {activeTab === "raw" && (
                  <motion.div
                    key="raw"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <StreamingOutput text={sse.rawText} isStreaming={isRunning} />
                  </motion.div>
                )}

                {activeTab === "metrics" && (
                  <motion.div
                    key="metrics"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="grid grid-cols-2 gap-4"
                  >
                    {sse.metrics.length > 0 ? (
                      sse.metrics.map((m, i) => (
                        <MetricCard key={`${m.label}-${i}`} metric={m} index={i} />
                      ))
                    ) : (
                      <div className="col-span-2 text-center py-12">
                        <FileCode2 className="w-8 h-8 text-text-dim mx-auto mb-3" />
                        <p className="text-text-dim text-sm">
                          {isRunning ? "Metrics will appear as analysis completes" : "No metrics available"}
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Summary */}
              {sse.summary && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-bg-card border border-border rounded-xl overflow-hidden"
                >
                  <div className="px-5 py-3 border-b border-border">
                    <h3 className="text-[13px] font-semibold">Summary</h3>
                  </div>
                  <p className="px-5 py-4 text-text-muted text-[13px] leading-relaxed">{sse.summary}</p>
                </motion.div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Toast notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}

function DashboardShimmer({ label }: { label: string }) {
  return (
    <div className="bg-bg-card/80 backdrop-blur-sm border border-border rounded-xl p-5 overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.02] to-transparent pointer-events-none" />
      <div className="relative">
        <div className="text-[10px] uppercase tracking-wider font-semibold text-text-dim mb-4">
          {label}
        </div>
        <div className="space-y-3">
          <div className="h-3 rounded-full bg-border/30 overflow-hidden">
            <div className="h-full w-full shimmer-bar" />
          </div>
          <div className="h-3 rounded-full bg-border/30 overflow-hidden w-3/4">
            <div className="h-full w-full shimmer-bar" style={{ animationDelay: "0.2s" }} />
          </div>
          <div className="h-3 rounded-full bg-border/30 overflow-hidden w-1/2">
            <div className="h-full w-full shimmer-bar" style={{ animationDelay: "0.4s" }} />
          </div>
        </div>
      </div>
    </div>
  );
}
