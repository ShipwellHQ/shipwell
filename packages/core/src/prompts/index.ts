import { SYSTEM_PROMPT } from "./system.js";
import { AUDIT_PROMPT } from "./audit.js";
import { getMigratePrompt } from "./migrate.js";
import { REFACTOR_PROMPT } from "./refactor.js";
import { DOCS_PROMPT } from "./docs.js";
import { UPGRADE_PROMPT } from "./upgrade.js";
import type { Operation } from "../types.js";

export { SYSTEM_PROMPT } from "./system.js";

export function getOperationPrompt(operation: Operation, options?: { target?: string; context?: string }): string {
  let prompt: string;

  switch (operation) {
    case "audit":
      prompt = AUDIT_PROMPT;
      break;
    case "migrate":
      prompt = getMigratePrompt(options?.target || "latest version");
      break;
    case "refactor":
      prompt = REFACTOR_PROMPT;
      break;
    case "docs":
      prompt = DOCS_PROMPT;
      break;
    case "upgrade":
      prompt = UPGRADE_PROMPT;
      break;
  }

  if (options?.context) {
    prompt += `\n\nAdditional context from the user:\n${options.context}`;
  }

  return prompt;
}
