"use client";

import { motion } from "framer-motion";
import clsx from "clsx";
import { AnimatedNumber } from "./animated-number";

interface SeverityBarProps {
  critical: number;
  high: number;
  medium: number;
  low: number;
  info: number;
}

const severities = [
  { key: "critical", label: "Critical", color: "bg-red-500" },
  { key: "high", label: "High", color: "bg-orange-500" },
  { key: "medium", label: "Medium", color: "bg-yellow-500" },
  { key: "low", label: "Low", color: "bg-blue-500" },
  { key: "info", label: "Info", color: "bg-gray-400" },
] as const;

export function SeverityBar({ critical, high, medium, low, info }: SeverityBarProps) {
  const counts: Record<string, number> = { critical, high, medium, low, info };
  const total = critical + high + medium + low + info;

  return (
    <div className="bg-bg-card/80 backdrop-blur-sm border border-border rounded-xl p-5 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.02] to-transparent pointer-events-none" />
      <div className="relative">
        <h3 className="uppercase text-[10px] tracking-wider font-semibold text-text-dim mb-4">
          Severity Distribution
        </h3>

        {/* Stacked bar */}
        <div className="h-3 w-full rounded-full overflow-hidden bg-border/30">
          {total === 0 ? (
            <div className="h-full w-full rounded-full bg-gray-500/30" />
          ) : (
            <div className="flex h-full w-full">
              {severities.map((severity, index) => {
                const count = counts[severity.key];
                if (count === 0) return null;

                const widthPercent = (count / total) * 100;

                return (
                  <motion.div
                    key={severity.key}
                    className={clsx(
                      severity.color,
                      "h-full",
                      // If this is the last non-zero segment, round the right side
                      severities
                        .slice(index + 1)
                        .every((s) => counts[s.key] === 0) && "rounded-r-full",
                      // If all previous segments are zero, round the left side
                      severities
                        .slice(0, index)
                        .every((s) => counts[s.key] === 0) && "rounded-l-full",
                    )}
                    initial={{ width: 0 }}
                    animate={{ width: `${widthPercent}%` }}
                    transition={{
                      duration: 0.6,
                      delay: index * 0.1,
                      ease: [0.25, 0.46, 0.45, 0.94],
                    }}
                  />
                );
              })}
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 mt-4 flex-wrap">
          {severities.map((severity) => {
            const count = counts[severity.key];
            if (count === 0) return null;
            return (
              <div key={severity.key} className="flex items-center gap-1.5">
                <span
                  className={clsx("inline-block h-2 w-2 rounded-full", severity.color)}
                />
                <span className="text-xs text-text-muted">{severity.label}</span>
                <span className="text-xs font-medium text-text">
                  <AnimatedNumber value={count} />
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
