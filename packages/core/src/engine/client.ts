import Anthropic from "@anthropic-ai/sdk";
import { SYSTEM_PROMPT, getOperationPrompt } from "../prompts/index.js";
import { DEFAULT_MODEL, getMaxOutputTokens } from "../models.js";
import type { Operation } from "../types.js";

export { AVAILABLE_MODELS, DEFAULT_MODEL, getMaxOutputTokens } from "../models.js";

export interface StreamOptions {
  apiKey: string;
  operation: Operation;
  codebaseXml: string;
  model?: string;
  target?: string;
  context?: string;
  onText?: (text: string) => void;
}

export async function* streamAnalysis(options: StreamOptions): AsyncGenerator<string> {
  const { apiKey, operation, codebaseXml, model, target, context, onText } = options;

  const client = new Anthropic({ apiKey });

  const userPrompt = `${getOperationPrompt(operation, { target, context })}

Here is the complete codebase to analyze:

${codebaseXml}`;

  const selectedModel = model || DEFAULT_MODEL;
  const stream = client.messages.stream({
    model: selectedModel,
    max_tokens: getMaxOutputTokens(selectedModel),
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: userPrompt }],
  });

  for await (const event of stream) {
    if (event.type === "content_block_delta" && "text" in event.delta) {
      const text = (event.delta as any).text as string;
      onText?.(text);
      yield text;
    }
  }
}

export async function runAnalysis(options: Omit<StreamOptions, "onText">): Promise<string> {
  let result = "";
  for await (const text of streamAnalysis(options)) {
    result += text;
  }
  return result;
}
