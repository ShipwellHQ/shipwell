"use client";

import { motion } from "framer-motion";
import { AlertTriangle, Info, Lightbulb, FileCode2, Link2, ChevronDown, Copy, Check } from "lucide-react";
import type { Finding } from "@shipwell/core/client";
import clsx from "clsx";
import { useState, useCallback } from "react";
import { DiffViewer } from "./diff-viewer";

const severityConfig = {
  critical: { border: "border-red-500/20", bg: "bg-red-500/5", badge: "bg-red-500/15 text-red-400 ring-red-500/20" },
  high: { border: "border-orange-500/20", bg: "bg-orange-500/5", badge: "bg-orange-500/15 text-orange-400 ring-orange-500/20" },
  medium: { border: "border-yellow-500/20", bg: "bg-yellow-500/5", badge: "bg-yellow-500/15 text-yellow-400 ring-yellow-500/20" },
  low: { border: "border-blue-500/20", bg: "bg-blue-500/5", badge: "bg-blue-500/15 text-blue-400 ring-blue-500/20" },
  info: { border: "border-border", bg: "bg-bg-card", badge: "bg-bg-elevated text-text-dim ring-border" },
};

const typeIcons = {
  issue: AlertTriangle,
  suggestion: Lightbulb,
  change: FileCode2,
  doc: Info,
  metric: Info,
};

export function FindingCard({ finding, index }: { finding: Finding; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    if (!finding.diff) return;
    navigator.clipboard.writeText(finding.diff);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [finding.diff]);
  const severity = finding.severity || "info";
  const config = severityConfig[severity];
  const Icon = typeIcons[finding.type] || Info;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: index * 0.03 }}
      className={clsx("border rounded-xl overflow-hidden", config.border, config.bg)}
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-bg-elevated/80 flex items-center justify-center shrink-0">
              <Icon className="w-3.5 h-3.5 text-text-muted" />
            </div>
            <h4 className="font-semibold text-[13px] leading-tight">{finding.title}</h4>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            {finding.crossFile && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-accent/10 text-accent text-[11px] font-medium ring-1 ring-accent/15">
                <Link2 className="w-3 h-3" />
                Cross-file
              </span>
            )}
            <span className={clsx("px-2 py-0.5 rounded-md text-[11px] font-semibold uppercase tracking-wide ring-1", config.badge)}>
              {severity}
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="text-text-muted text-[13px] leading-relaxed mb-3 pl-[38px]">
          {finding.description}
        </p>

        {/* Files */}
        {finding.files.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pl-[38px]">
            {finding.files.map((file) => (
              <span key={file} className="px-2 py-0.5 bg-bg/60 rounded-md text-[11px] text-text-dim font-mono border border-border">
                {file}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Diff expander */}
      {finding.diff && (
        <div className="border-t border-border/50">
          <div className="flex items-center">
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-2 flex-1 px-4 py-2 text-[12px] text-accent hover:bg-accent/5 transition-colors"
            >
              <ChevronDown className={clsx("w-3.5 h-3.5 transition-transform", expanded && "rotate-180")} />
              {expanded ? "Hide" : "View"} suggested fix
            </button>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-2 text-[12px] text-text-muted hover:text-accent hover:bg-accent/5 transition-colors"
              title="Copy diff to clipboard"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-success" />
                  <span className="text-success">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy fix</span>
                </>
              )}
            </button>
          </div>
          {expanded && (
            <div className="px-4 pb-3">
              <DiffViewer diff={finding.diff} />
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
