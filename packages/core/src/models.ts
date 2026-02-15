export const AVAILABLE_MODELS = [
  { id: "claude-sonnet-4-5-20250929", label: "Claude Sonnet 4.5", contextWindow: 200_000, maxOutput: 64_000, default: true },
  { id: "claude-opus-4-6", label: "Claude Opus 4.6", contextWindow: 200_000, maxOutput: 32_000 },
  { id: "claude-haiku-4-5-20251001", label: "Claude Haiku 4.5", contextWindow: 200_000, maxOutput: 64_000 },
] as const;

export const DEFAULT_MODEL = "claude-sonnet-4-5-20250929";

/** Max codebase tokens = context window - max output - system prompt overhead - safety margin */
export function getMaxCodebaseTokens(modelId: string): number {
  const model = AVAILABLE_MODELS.find(m => m.id === modelId);
  const contextWindow = model?.contextWindow ?? 200_000;
  const maxOutput = model?.maxOutput ?? 128_000;
  const systemOverhead = 8_000;
  const safetyMargin = 10_000;
  return contextWindow - maxOutput - systemOverhead - safetyMargin;
}

export function getMaxOutputTokens(modelId: string): number {
  const model = AVAILABLE_MODELS.find(m => m.id === modelId);
  return model?.maxOutput ?? 128_000;
}
