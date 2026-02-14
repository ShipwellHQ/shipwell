"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Ship, Shield, ArrowRight, GitBranch, BookOpen, PackageCheck,
  Play, Square, Loader2, CheckCircle2, XCircle, Link2, Filter,
  ChevronLeft,
} from "lucide-react";
import Link from "next/link";
import clsx from "clsx";
import { useSSE } from "@/hooks/use-sse";
import { FindingCard } from "@/components/finding-card";
import { MetricCard } from "@/components/metric-card";
import { StreamingOutput } from "@/components/streaming-output";

const operations = [
  { id: "audit", label: "Security Audit", icon: Shield, color: "text-red-400" },
  { id: "migrate", label: "Migration", icon: ArrowRight, color: "text-blue-400" },
  { id: "refactor", label: "Refactor", icon: GitBranch, color: "text-purple-400" },
  { id: "docs", label: "Documentation", icon: BookOpen, color: "text-green-400" },
  { id: "upgrade", label: "Dep. Upgrade", icon: PackageCheck, color: "text-yellow-400" },
] as const;

type Tab = "findings" | "raw" | "metrics";

export default function AnalysisPage() {
  const [source, setSource] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [operation, setOperation] = useState<string>("audit");
  const [target, setTarget] = useState("");
  const [context, setContext] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("findings");
  const [filterCrossFile, setFilterCrossFile] = useState(false);
  const [filterSeverity, setFilterSeverity] = useState<string | null>(null);

  const sse = useSSE();

  const handleStart = () => {
    if (!source || !apiKey) return;
    sse.start({ operation, source, apiKey, target: target || undefined, context: context || undefined });
  };

  const filteredFindings = sse.findings.filter((f) => {
    if (filterCrossFile && !f.crossFile) return false;
    if (filterSeverity && f.severity !== filterSeverity) return false;
    return true;
  });

  const crossFileCount = sse.findings.filter((f) => f.crossFile).length;
  const isRunning = sse.status === "connecting" || sse.status === "streaming";

  return (
    <div className="min-h-screen flex flex-col">
      {/* Nav */}
      <nav className="border-b border-border px-6 py-3 flex items-center gap-4">
        <Link href="/" className="flex items-center gap-2 text-text-muted hover:text-text transition-colors">
          <ChevronLeft className="w-4 h-4" />
          <Ship className="w-5 h-5 text-accent" />
          <span className="font-bold">Shipwell</span>
        </Link>
        <div className="flex-1" />
        {sse.phase && isRunning && (
          <div className="flex items-center gap-2 text-sm text-accent">
            <Loader2 className="w-4 h-4 animate-spin" />
            {sse.phase}
          </div>
        )}
        {sse.status === "complete" && (
          <div className="flex items-center gap-2 text-sm text-success">
            <CheckCircle2 className="w-4 h-4" />
            Complete — {sse.findings.length} findings
          </div>
        )}
        {sse.status === "error" && (
          <div className="flex items-center gap-2 text-sm text-danger">
            <XCircle className="w-4 h-4" />
            Error
          </div>
        )}
      </nav>

      <div className="flex-1 flex">
        {/* Sidebar */}
        <aside className="w-80 border-r border-border p-4 flex flex-col gap-4 shrink-0 overflow-y-auto">
          {/* Repo Input */}
          <div>
            <label className="block text-xs text-text-muted mb-1">Repository (path or GitHub URL)</label>
            <input
              type="text"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder="/path/to/repo or https://github.com/..."
              className="w-full bg-bg border border-border rounded-md px-3 py-2 text-sm focus:border-accent focus:outline-none placeholder:text-text-dim"
              disabled={isRunning}
            />
          </div>

          {/* API Key */}
          <div>
            <label className="block text-xs text-text-muted mb-1">Anthropic API Key</label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-ant-..."
              className="w-full bg-bg border border-border rounded-md px-3 py-2 text-sm focus:border-accent focus:outline-none placeholder:text-text-dim"
              disabled={isRunning}
            />
          </div>

          {/* Operation Selector */}
          <div>
            <label className="block text-xs text-text-muted mb-2">Operation</label>
            <div className="grid gap-1.5">
              {operations.map((op) => (
                <button
                  key={op.id}
                  onClick={() => setOperation(op.id)}
                  disabled={isRunning}
                  className={clsx(
                    "flex items-center gap-2 px-3 py-2 rounded-md text-sm text-left transition-colors",
                    operation === op.id
                      ? "bg-accent/10 border border-accent/30 text-accent"
                      : "border border-transparent hover:bg-bg-elevated text-text-muted"
                  )}
                >
                  <op.icon className={clsx("w-4 h-4", operation === op.id ? "text-accent" : op.color)} />
                  {op.label}
                </button>
              ))}
            </div>
          </div>

          {/* Migration Target */}
          {operation === "migrate" && (
            <div>
              <label className="block text-xs text-text-muted mb-1">Migration Target</label>
              <input
                type="text"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                placeholder="e.g. React 19, Next.js 15"
                className="w-full bg-bg border border-border rounded-md px-3 py-2 text-sm focus:border-accent focus:outline-none placeholder:text-text-dim"
                disabled={isRunning}
              />
            </div>
          )}

          {/* Extra Context */}
          <div>
            <label className="block text-xs text-text-muted mb-1">Additional Context (optional)</label>
            <textarea
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="Focus on auth endpoints..."
              rows={3}
              className="w-full bg-bg border border-border rounded-md px-3 py-2 text-sm focus:border-accent focus:outline-none placeholder:text-text-dim resize-none"
              disabled={isRunning}
            />
          </div>

          {/* Start / Stop Button */}
          {isRunning ? (
            <button
              onClick={sse.stop}
              className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-danger/20 hover:bg-danger/30 text-danger font-medium rounded-lg transition-colors"
            >
              <Square className="w-4 h-4" />
              Stop Analysis
            </button>
          ) : (
            <button
              onClick={handleStart}
              disabled={!source || !apiKey}
              className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-accent hover:bg-accent-hover disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors glow-accent"
            >
              <Play className="w-4 h-4" />
              Start Analysis
            </button>
          )}
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {sse.status === "idle" ? (
            <div className="h-full flex items-center justify-center text-text-dim">
              <div className="text-center">
                <Ship className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p>Enter a repository and start an analysis</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Error Banner */}
              {sse.error && (
                <div className="bg-danger/10 border border-danger/30 rounded-lg p-4 text-danger text-sm">
                  {sse.error}
                </div>
              )}

              {/* Metrics */}
              {sse.metrics.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {sse.metrics.map((m, i) => (
                    <MetricCard key={m.label} metric={m} index={i} />
                  ))}
                </div>
              )}

              {/* Tabs */}
              <div className="flex items-center gap-1 border-b border-border">
                {(["findings", "raw", "metrics"] as Tab[]).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={clsx(
                      "px-4 py-2 text-sm font-medium border-b-2 transition-colors capitalize",
                      activeTab === tab
                        ? "border-accent text-accent"
                        : "border-transparent text-text-muted hover:text-text"
                    )}
                  >
                    {tab}
                    {tab === "findings" && sse.findings.length > 0 && (
                      <span className="ml-2 px-1.5 py-0.5 bg-accent/20 text-accent text-xs rounded-full">
                        {sse.findings.length}
                      </span>
                    )}
                  </button>
                ))}

                <div className="flex-1" />

                {/* Filters */}
                {activeTab === "findings" && sse.findings.length > 0 && (
                  <div className="flex items-center gap-2 pb-1">
                    <button
                      onClick={() => setFilterCrossFile(!filterCrossFile)}
                      className={clsx(
                        "flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors",
                        filterCrossFile
                          ? "bg-accent/20 text-accent"
                          : "text-text-muted hover:text-text"
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
                            "px-2 py-1 rounded text-xs capitalize transition-colors",
                            filterSeverity === sev
                              ? "bg-accent/20 text-accent"
                              : "text-text-muted hover:text-text"
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
                      <p className="text-text-dim text-sm py-8 text-center">No findings match the current filters</p>
                    ) : isRunning ? (
                      <div className="flex items-center gap-2 text-text-muted text-sm py-8 justify-center">
                        <Loader2 className="w-4 h-4 animate-spin" />
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
                        <MetricCard key={m.label} metric={m} index={i} />
                      ))
                    ) : (
                      <p className="text-text-dim text-sm py-8 text-center col-span-2">
                        {isRunning ? "Metrics will appear as analysis completes" : "No metrics available"}
                      </p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Summary */}
              {sse.summary && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-bg-card border border-border rounded-lg p-4"
                >
                  <h3 className="text-sm font-semibold mb-2">Summary</h3>
                  <p className="text-text-muted text-sm leading-relaxed">{sse.summary}</p>
                </motion.div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
