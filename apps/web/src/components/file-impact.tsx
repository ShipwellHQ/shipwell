"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";

interface FileImpactProps {
  findings: Array<{ files: string[]; severity?: string }>;
}

const MAX_FILES = 8;

const SEVERITY_PRIORITY: Record<string, number> = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
};

const SEVERITY_COLORS: Record<string, string> = {
  critical: "bg-red-500",
  high: "bg-orange-500",
  medium: "bg-yellow-500",
  low: "bg-blue-500",
};

function getDominantSeverity(severities: string[]): string {
  let dominant = "low";
  let maxPriority = 0;

  for (const s of severities) {
    const normalized = s.toLowerCase();
    const priority = SEVERITY_PRIORITY[normalized] ?? 0;
    if (priority > maxPriority) {
      maxPriority = priority;
      dominant = normalized;
    }
  }

  return dominant;
}

function truncatePath(filePath: string): string {
  const segments = filePath.split("/").filter(Boolean);
  if (segments.length <= 2) return segments.join("/");
  return segments.slice(-2).join("/");
}

interface FileEntry {
  path: string;
  displayName: string;
  count: number;
  dominantSeverity: string;
}

function aggregateByFile(
  findings: FileImpactProps["findings"],
): FileEntry[] {
  const countMap = new Map<string, number>();
  const severityMap = new Map<string, string[]>();

  for (const finding of findings) {
    for (const file of finding.files) {
      countMap.set(file, (countMap.get(file) ?? 0) + 1);

      if (finding.severity) {
        const existing = severityMap.get(file) ?? [];
        existing.push(finding.severity);
        severityMap.set(file, existing);
      }
    }
  }

  const entries: FileEntry[] = [];

  for (const [path, count] of countMap) {
    entries.push({
      path,
      displayName: truncatePath(path),
      count,
      dominantSeverity: getDominantSeverity(severityMap.get(path) ?? []),
    });
  }

  entries.sort((a, b) => b.count - a.count);

  return entries.slice(0, MAX_FILES);
}

export function FileImpact({ findings }: FileImpactProps) {
  const entries = useMemo(() => aggregateByFile(findings), [findings]);
  const maxCount = entries.length > 0 ? entries[0].count : 0;

  return (
    <div className="bg-bg-card border border-border rounded-xl p-5">
      <h3 className="uppercase text-[10px] tracking-wider font-semibold text-text-dim mb-4">
        Most Impacted Files
      </h3>

      {entries.length === 0 ? (
        <div className="flex items-center justify-center py-8">
          <span className="text-xs text-text-muted">
            No file-level findings detected
          </span>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {entries.map((entry, index) => {
            const barColor =
              SEVERITY_COLORS[entry.dominantSeverity] ?? "bg-blue-500";
            const widthPercent = (entry.count / maxCount) * 100;

            return (
              <div key={entry.path} className="flex items-center gap-3">
                <span
                  className="font-mono text-[11px] text-text-muted truncate w-40 shrink-0 text-right"
                  title={entry.path}
                >
                  {entry.displayName}
                </span>

                <div className="flex-1 h-5 rounded bg-bg-elevated overflow-hidden">
                  <motion.div
                    className={clsx("h-full rounded", barColor)}
                    initial={{ width: 0 }}
                    animate={{ width: `${widthPercent}%` }}
                    transition={{
                      duration: 0.5,
                      delay: index * 0.06,
                      ease: [0.25, 0.46, 0.45, 0.94],
                    }}
                  />
                </div>

                <span className="text-xs font-medium tabular-nums text-text w-6 text-right shrink-0">
                  {entry.count}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
