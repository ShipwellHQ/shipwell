"use client";

import { motion } from "framer-motion";
import type { TokenInfo } from "@/hooks/use-sse";

function formatTokens(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}K`;
  return String(n);
}

interface TokenGaugeProps {
  tokenInfo: TokenInfo;
  outputChars: number;
}

export function TokenGauge({ tokenInfo, outputChars }: TokenGaugeProps) {
  const { codebaseTokens, maxCodebaseTokens, maxOutputTokens } = tokenInfo;
  const inputPct = Math.min((codebaseTokens / maxCodebaseTokens) * 100, 100);
  // Rough estimate: ~4 chars per token
  const estimatedOutputTokens = Math.round(outputChars / 4);
  const outputPct = Math.min((estimatedOutputTokens / maxOutputTokens) * 100, 100);

  return (
    <div className="bg-bg-card border border-border rounded-xl px-5 py-4 space-y-3">
      <h3 className="uppercase text-[10px] tracking-wider font-semibold text-text-dim">
        Token Usage
      </h3>

      {/* Input tokens */}
      <div>
        <div className="flex items-center justify-between text-[11px] mb-1.5">
          <span className="text-text-muted">Input (codebase)</span>
          <span className="text-text-dim tabular-nums">
            {formatTokens(codebaseTokens)} / {formatTokens(maxCodebaseTokens)}
          </span>
        </div>
        <div className="h-2 w-full rounded-full bg-border/30 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-accent"
            initial={{ width: 0 }}
            animate={{ width: `${inputPct}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Output tokens */}
      <div>
        <div className="flex items-center justify-between text-[11px] mb-1.5">
          <span className="text-text-muted">Output (streaming)</span>
          <span className="text-text-dim tabular-nums">
            ~{formatTokens(estimatedOutputTokens)} / {formatTokens(maxOutputTokens)}
          </span>
        </div>
        <div className="h-2 w-full rounded-full bg-border/30 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-emerald-500"
            initial={{ width: 0 }}
            animate={{ width: `${outputPct}%` }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
        </div>
      </div>
    </div>
  );
}
