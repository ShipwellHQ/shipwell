"use client";

import { motion } from "framer-motion";
import clsx from "clsx";
import { AnimatedNumber } from "./animated-number";

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

function glowColor(score: number): string {
  if (score >= 80) return "rgba(34, 197, 94, 0.15)";
  if (score >= 60) return "rgba(245, 158, 11, 0.15)";
  return "rgba(239, 68, 68, 0.15)";
}

function offsetForScore(score: number): number {
  return CIRCUMFERENCE * (1 - clampScore(score) / 100);
}

export function HealthScore({ before, after }: HealthScoreProps) {
  const clampedBefore = clampScore(before);
  const clampedAfter = clampScore(after);
  const targetOffset = offsetForScore(clampedBefore);

  return (
    <div className="bg-bg-card/80 backdrop-blur-sm border border-border rounded-xl p-5 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.02] to-transparent pointer-events-none" />
      <div className="relative">
        {/* Label */}
        <div className="text-[10px] uppercase tracking-wider font-semibold text-text-dim mb-3">
          Health Score
        </div>

        {/* Gauge */}
        <div className="flex flex-col items-center">
          <div className="relative w-[120px] h-[120px]">
            {/* Radial glow behind gauge */}
            <div
              className="absolute inset-[-12px] rounded-full blur-xl pointer-events-none"
              style={{ background: `radial-gradient(circle, ${glowColor(clampedBefore)}, transparent 70%)` }}
            />

            <svg
              viewBox="0 0 120 120"
              className="w-full h-full -rotate-90 relative"
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
                <AnimatedNumber value={clampedBefore} />
              </span>
            </div>
          </div>

          {/* Before -> After */}
          <div className="mt-3 flex items-center gap-1.5 text-sm tabular-nums">
            <span className="font-semibold text-text-muted"><AnimatedNumber value={clampedBefore} /></span>
            <span className="text-text-dim select-none">&rarr;</span>
            <span className={clsx("font-semibold", scoreColor(clampedAfter))}>
              <AnimatedNumber value={clampedAfter} />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
