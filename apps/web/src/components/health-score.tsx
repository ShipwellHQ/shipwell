"use client";

import { motion } from "framer-motion";
import clsx from "clsx";

interface HealthScoreProps {
  before: number;
  after: number;
}

const RADIUS = 52;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function clampScore(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, value));
}

function scoreColor(score: number): string {
  if (score >= 80) return "text-emerald-500";
  if (score >= 60) return "text-amber-500";
  return "text-red-500";
}

function strokeColor(score: number): string {
  if (score >= 80) return "stroke-emerald-500";
  if (score >= 60) return "stroke-amber-500";
  return "stroke-red-500";
}

function offsetForScore(score: number): number {
  return CIRCUMFERENCE * (1 - clampScore(score) / 100);
}

export function HealthScore({ before, after }: HealthScoreProps) {
  const clampedBefore = clampScore(before);
  const clampedAfter = clampScore(after);
  const targetOffset = offsetForScore(clampedBefore);

  return (
    <div className="bg-bg-card border border-border rounded-xl p-5">
      {/* Label */}
      <div className="text-[10px] uppercase tracking-wider font-semibold text-text-dim mb-3">
        Health Score
      </div>

      {/* Gauge */}
      <div className="flex flex-col items-center">
        <div className="relative w-[120px] h-[120px]">
          <svg
            viewBox="0 0 120 120"
            className="w-full h-full -rotate-90"
            aria-hidden="true"
          >
            {/* Background track */}
            <circle
              cx={60}
              cy={60}
              r={RADIUS}
              fill="none"
              strokeWidth={8}
              className="stroke-border"
            />
            {/* Foreground arc */}
            <motion.circle
              cx={60}
              cy={60}
              r={RADIUS}
              fill="none"
              strokeWidth={8}
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              initial={{ strokeDashoffset: CIRCUMFERENCE }}
              animate={{ strokeDashoffset: targetOffset }}
              transition={{ duration: 1, ease: "easeOut" }}
              className={strokeColor(clampedBefore)}
            />
          </svg>

          {/* Center score */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className={clsx(
                "text-3xl font-bold tabular-nums",
                scoreColor(clampedBefore),
              )}
            >
              {clampedBefore}
            </span>
          </div>
        </div>

        {/* Before -> After */}
        <div className="mt-3 flex items-center gap-1.5 text-sm tabular-nums">
          <span className="font-semibold text-text-muted">{clampedBefore}</span>
          <span className="text-text-dim select-none">&rarr;</span>
          <span className={clsx("font-semibold", scoreColor(clampedAfter))}>
            {clampedAfter}
          </span>
        </div>
      </div>
    </div>
  );
}
