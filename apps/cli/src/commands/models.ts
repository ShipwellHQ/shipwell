import chalk from "chalk";
import { AVAILABLE_MODELS, DEFAULT_MODEL } from "@shipwell/core";
import { getModel } from "../lib/store.js";

const accent = chalk.hex("#6366f1");
const dim = chalk.dim;

export function modelsCommand() {
  const currentModel = getModel() || DEFAULT_MODEL;

  console.log();
  console.log(`  ${chalk.bold("Available Models")}`);
  console.log();

  for (const m of AVAILABLE_MODELS) {
    const isCurrent = m.id === currentModel;
    const marker = isCurrent ? accent("●") : dim("○");
    const label = isCurrent ? chalk.bold(m.label) : m.label;
    const id = dim(m.id);
    const ctx = dim(`${Math.round(m.contextWindow / 1000)}K context`);
    const dflt = "default" in m && m.default ? chalk.green(" default") : "";
    const active = isCurrent ? accent(" ← active") : "";
    console.log(`  ${marker} ${label}  ${id}  ${ctx}${dflt}${active}`);
  }

  console.log();
  console.log(dim(`  Switch: shipwell config set model <model-id>`));
  console.log();
}
