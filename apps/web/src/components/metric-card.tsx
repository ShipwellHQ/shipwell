"use client";

import { motion } from "framer-motion";
import type { MetricEvent } from "@shipwell/core";

export function MetricCard({ metric, index }: { metric: MetricEvent; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="bg-bg-card border border-border rounded-lg p-4"
    >
      <div className="text-text-dim text-xs uppercase tracking-wide mb-2">{metric.label}</div>
      <div className="flex items-end gap-3">
        <div>
          <span className="text-text-dim text-xs">Before</span>
          <div className="text-xl font-bold text-danger">{metric.before}</div>
        </div>
        <div className="text-text-dim text-lg mb-0.5">&rarr;</div>
        <div>
          <span className="text-text-dim text-xs">After</span>
          <div className="text-xl font-bold text-success">{metric.after}</div>
        </div>
        {metric.unit && <span className="text-text-dim text-xs mb-1">{metric.unit}</span>}
      </div>
    </motion.div>
  );
}
