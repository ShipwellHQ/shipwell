const PRICING: Record<string, { inputPerM: number; outputPerM: number }> = {
  "claude-sonnet-4-5-20250929": { inputPerM: 3, outputPerM: 15 },
  "claude-opus-4-6": { inputPerM: 15, outputPerM: 75 },
  "claude-haiku-4-5-20251001": { inputPerM: 0.80, outputPerM: 4 },
};

const OUTPUT_ESTIMATES: Record<string, number> = {
  audit: 8000,
  migrate: 12000,
  refactor: 8000,
  docs: 10000,
  upgrade: 6000,
};

export function estimateCost(
  inputTokens: number,
  model: string,
  operation: string,
): { cost: number; outputTokens: number } {
  const pricing = PRICING[model] ?? PRICING["claude-sonnet-4-5-20250929"];
  const outputTokens = OUTPUT_ESTIMATES[operation] ?? 8000;
  const inputCost = (inputTokens / 1_000_000) * pricing.inputPerM;
  const outputCost = (outputTokens / 1_000_000) * pricing.outputPerM;
  return { cost: inputCost + outputCost, outputTokens };
}

export function formatCost(cost: number): string {
  if (cost < 0.01) return `$${cost.toFixed(4)}`;
  return `$${cost.toFixed(2)}`;
}
