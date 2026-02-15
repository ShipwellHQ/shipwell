"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  GitBranch, FolderOpen, Package, Scan, Shield, BarChart3,
  CheckCircle2, XCircle, Loader2,
} from "lucide-react";
import clsx from "clsx";
import type { ActivityEntry } from "@/hooks/use-sse";

const iconMap = {
  clone: GitBranch,
  read: FolderOpen,
  bundle: Package,
  analyze: Scan,
  finding: Shield,
  metric: BarChart3,
  done: CheckCircle2,
  error: XCircle,
};

const iconColor = {
  clone: "text-blue-400",
  read: "text-cyan-400",
  bundle: "text-purple-400",
  analyze: "text-accent",
  finding: "text-amber-400",
  metric: "text-emerald-400",
  done: "text-success",
  error: "text-danger",
};

const bgColor = {
  clone: "bg-blue-500/8",
  read: "bg-cyan-500/8",
  bundle: "bg-purple-500/8",
  analyze: "bg-accent/8",
  finding: "bg-amber-500/8",
  metric: "bg-emerald-500/8",
  done: "bg-success/8",
  error: "bg-danger/8",
};

const verbs = [
  "Thinking",
  "Reading",
  "Scanning",
  "Tracing",
  "Mapping",
  "Crafting",
  "Analyzing",
  "Inspecting",
  "Resolving",
  "Reasoning",
];

function formatTokens(chars: number): string {
  const tokens = Math.round(chars / 3.5);
  if (tokens >= 1000) {
    return `${(tokens / 1000).toFixed(1)}k`;
  }
  return `${tokens}`;
}

function formatTime(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s}s`;
}

function ThinkingLine({ startedAt, tokenChars }: { startedAt: number; tokenChars: number }) {
  const [verbIndex, setVerbIndex] = useState(0);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setVerbIndex((prev) => (prev + 1) % verbs.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startedAt) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [startedAt]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center gap-2.5 py-1.5 px-2 -mx-2 rounded-lg bg-gradient-to-r from-accent/[0.04] to-transparent"
    >
      <span className="thinking-sparkle text-accent text-[14px]">✶</span>
      <span className="text-[13px] text-text inline-flex items-center gap-0">
        <span className="thinking-fade" key={verbIndex}>{verbs[verbIndex]}</span>
        <span className="thinking-dots text-accent ml-px">
          <span className="dot dot-1">.</span>
          <span className="dot dot-2">.</span>
          <span className="dot dot-3">.</span>
        </span>
      </span>
      <span className="text-[11px] text-text-dim tabular-nums">
        ({formatTime(elapsed)}
        {tokenChars > 0 && <> · <span className="text-accent/70">↓</span> {formatTokens(tokenChars)} tokens</>}
        )
      </span>
    </motion.div>
  );
}

export function ActivityLog({
  activity,
  isRunning,
  startedAt,
  tokenChars,
}: {
  activity: ActivityEntry[];
  isRunning: boolean;
  startedAt?: number;
  tokenChars?: number;
}) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activity.length]);

  if (activity.length === 0) return null;

  const lastIndex = activity.length - 1;

  return (
    <div className={clsx(
      "bg-bg-card border rounded-xl overflow-hidden transition-colors duration-300",
      isRunning ? "border-accent/20" : "border-border"
    )}>
      {/* Header */}
      <div className="px-4 py-2.5 border-b border-border flex items-center gap-2.5">
        {isRunning ? (
          <div className="relative flex items-center justify-center w-4 h-4">
            <span className="absolute inline-flex h-full w-full rounded-full bg-accent/30 animate-ping" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
          </div>
        ) : (
          <CheckCircle2 className="w-4 h-4 text-success" />
        )}
        <span className="text-[13px] font-medium text-text-muted">
          {isRunning ? "Analyzing..." : "Analysis Complete"}
        </span>
        <span className="text-[11px] text-text-dim ml-auto tabular-nums">{activity.length} steps</span>
      </div>

      {/* Timeline */}
      <div className="max-h-[260px] overflow-y-auto px-4 py-3">
        <div className="space-y-1">
          {activity.map((entry, i) => {
            const Icon = iconMap[entry.icon];
            const isLast = i === lastIndex;
            const showShimmer = isLast && isRunning;
            return (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.15 }}
                className={clsx(
                  "flex items-center gap-3 py-1 px-2 -mx-2 rounded-lg relative overflow-hidden",
                  showShimmer && "shimmer-row"
                )}
              >
                {showShimmer && (
                  <div className="absolute inset-0 shimmer-overlay rounded-lg" />
                )}

                <div className={clsx(
                  "w-6 h-6 rounded-md flex items-center justify-center shrink-0 relative z-10",
                  !entry.done ? "bg-accent/10" : bgColor[entry.icon]
                )}>
                  {!entry.done ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-accent" />
                  ) : (
                    <Icon className={clsx("w-3.5 h-3.5", iconColor[entry.icon])} />
                  )}
                </div>

                <span className={clsx(
                  "text-[13px] leading-snug truncate relative z-10",
                  entry.icon === "error" ? "text-danger" :
                  entry.icon === "done" ? "text-success font-medium" :
                  !entry.done ? "text-text" :
                  showShimmer ? "text-text" : "text-text-muted"
                )}>
                  {entry.message}
                </span>
              </motion.div>
            );
          })}

          {/* Claude Code-style thinking line */}
          {isRunning && (
            <ThinkingLine
              startedAt={startedAt || Date.now()}
              tokenChars={tokenChars || 0}
            />
          )}

          <div ref={bottomRef} />
        </div>
      </div>
    </div>
  );
}
