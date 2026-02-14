"use client";

import { motion } from "framer-motion";
import { AlertTriangle, Info, Lightbulb, FileCode2, Link2 } from "lucide-react";
import type { Finding } from "@shipwell/core";
import clsx from "clsx";

const severityColors = {
  critical: "border-red-500/50 bg-red-500/5",
  high: "border-orange-500/50 bg-orange-500/5",
  medium: "border-yellow-500/50 bg-yellow-500/5",
  low: "border-blue-500/50 bg-blue-500/5",
  info: "border-zinc-500/50 bg-zinc-500/5",
};

const severityBadge = {
  critical: "bg-red-500/20 text-red-400",
  high: "bg-orange-500/20 text-orange-400",
  medium: "bg-yellow-500/20 text-yellow-400",
  low: "bg-blue-500/20 text-blue-400",
  info: "bg-zinc-500/20 text-zinc-400",
};

const typeIcons = {
  issue: AlertTriangle,
  suggestion: Lightbulb,
  change: FileCode2,
  doc: Info,
  metric: Info,
};

export function FindingCard({ finding, index }: { finding: Finding; index: number }) {
  const severity = finding.severity || "info";
  const Icon = typeIcons[finding.type] || Info;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={clsx(
        "border rounded-lg p-4",
        severityColors[severity]
      )}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <Icon className="w-4 h-4 shrink-0 text-text-muted" />
          <h4 className="font-semibold text-sm truncate">{finding.title}</h4>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {finding.crossFile && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent/20 text-accent text-xs">
              <Link2 className="w-3 h-3" />
              Cross-file
            </span>
          )}
          <span className={clsx("px-2 py-0.5 rounded-full text-xs font-medium uppercase", severityBadge[severity])}>
            {severity}
          </span>
        </div>
      </div>

      <p className="text-text-muted text-xs leading-relaxed mb-3">{finding.description}</p>

      {finding.files.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {finding.files.map((file) => (
            <span key={file} className="px-2 py-0.5 bg-bg-elevated rounded text-xs text-text-dim font-mono">
              {file}
            </span>
          ))}
        </div>
      )}

      {finding.diff && (
        <details className="mt-2">
          <summary className="text-xs text-accent cursor-pointer hover:text-accent-hover">
            View suggested fix
          </summary>
          <pre className="mt-2 p-3 bg-bg rounded text-xs overflow-x-auto whitespace-pre-wrap font-mono leading-relaxed">
            {finding.diff}
          </pre>
        </details>
      )}
    </motion.div>
  );
}
