"use client";

import { motion } from "framer-motion";
import { TrendingDown, TrendingUp, Minus } from "lucide-react";
import clsx from "clsx";
import type { MetricEvent } from "@shipwell/core/client";

export function MetricCard({ metric, index }: { metric: MetricEvent; index: number }) {
  const beforeNum = typeof metric.before === "number" ? metric.before : parseFloat(metric.before);
  const afterNum = typeof metric.after === "number" ? metric.after : parseFloat(metric.after);
  const isImprovement = afterNum > beforeNum;
  const isDecline = afterNum < beforeNum;
  const isNeutral = !isImprovement && !isDecline;

  // For metrics where lower is better (like "vulnerabilities", "issues", "errors")
  const lowerIsBetter = /vuln|issue|error|bug|debt|risk|warn|duplicate|complex|dead/i.test(metric.label);
  const isPositive = lowerIsBetter ? isDecline : isImprovement;
  const isNegative = lowerIsBetter ? isImprovement : isDecline;

  const TrendIcon = isImprovement ? TrendingUp : isDecline ? TrendingDown : Minus;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.06 }}
      className="bg-bg-card/80 backdrop-blur-sm border border-border rounded-xl p-5 card-hover relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.02] to-transparent pointer-events-none" />
      <div className="relative">
        {/* Label & Trend */}
        <div className="flex items-start justify-between mb-4">
          <span className="text-text-dim text-[11px] uppercase tracking-wider font-semibold leading-tight max-w-[70%]">
            {metric.label}
          </span>
          <div className={clsx(
            "w-7 h-7 rounded-lg flex items-center justify-center",
            isPositive ? "bg-success/10" : isNegative ? "bg-danger/10" : "bg-bg-elevated"
          )}>
            <TrendIcon className={clsx(
              "w-3.5 h-3.5",
              isPositive ? "text-success" : isNegative ? "text-danger" : "text-text-dim"
            )} />
          </div>
        </div>

        {/* Values */}
        <div className="flex items-end gap-3">
          <div className="flex-1">
            <span className="text-[10px] text-text-dim uppercase tracking-wide">Before</span>
            <div className="text-2xl font-bold tabular-nums text-text-muted">{metric.before}</div>
          </div>
          <div className="text-text-dim text-lg mb-1 select-none">&rarr;</div>
          <div className="flex-1">
            <span className="text-[10px] text-text-dim uppercase tracking-wide">After</span>
            <div className={clsx(
              "text-2xl font-bold tabular-nums",
              isPositive ? "text-success" : isNegative ? "text-danger" : "text-text"
            )}>
              {metric.after}
            </div>
          </div>
        </div>

        {/* Unit */}
        {metric.unit && (
          <div className="mt-2 text-[11px] text-text-dim">{metric.unit}</div>
        )}

        {/* Progress bar */}
        <div className="mt-3 h-1 rounded-full bg-bg-elevated overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 0.6, delay: index * 0.06 + 0.2, ease: "easeOut" }}
            className={clsx(
              "h-full rounded-full",
              isPositive ? "bg-success/50" : isNegative ? "bg-danger/50" : "bg-text-dim/30"
            )}
          />
        </div>
      </div>
    </motion.div>
  );
}
