/**
 * Fast token estimation — ~4 chars per token for code.
 * This is a rough approximation that avoids needing tiktoken.
 */
export function estimateTokens(text: string): number {
  // Claude tokenizer averages ~3.5-4.5 chars per token for code
  // We use 4 as a reasonable middle ground
  return Math.ceil(text.length / 4);
}
