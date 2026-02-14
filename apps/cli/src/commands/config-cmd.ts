import chalk from "chalk";
import { loadConfig, setApiKey, setModel, clearApiKey } from "../lib/store.js";
import { AVAILABLE_MODELS, DEFAULT_MODEL } from "@shipwell/core";

const accent = chalk.hex("#6366f1");
const dim = chalk.dim;

export function configShowCommand() {
  const config = loadConfig();
  console.log();
  console.log(`  ${chalk.bold("Configuration")} ${dim("~/.shipwell/config.json")}`);
  console.log();
  console.log(`  ${dim("api-key")}   ${config.apiKey ? chalk.green("●") + " " + dim(`${config.apiKey.slice(0, 12)}...`) : chalk.yellow("●") + " not set"}`);
  console.log(`  ${dim("model")}     ${accent(config.model || DEFAULT_MODEL)}${!config.model ? dim(" (default)") : ""}`);
  if (config.user) {
    console.log(`  ${dim("user")}      ${config.user.name} ${dim(`(${config.user.email})`)}`);
  }
  console.log();
  console.log(dim("  Set values:"));
  console.log(`    ${chalk.cyan("shipwell config set api-key")} ${dim("<key>")}`);
  console.log(`    ${chalk.cyan("shipwell config set model")} ${dim("<model-id>")}`);
  console.log();
}

export function configSetCommand(key: string, value: string) {
  switch (key) {
    case "api-key": {
      if (!value.startsWith("sk-ant-")) {
        console.log(chalk.yellow("\n  Warning: API key doesn't look like an Anthropic key (expected sk-ant-...).\n"));
      }
      setApiKey(value);
      console.log(`\n  ${chalk.green("✓")} API key saved\n`);
      break;
    }
    case "model": {
      const validIds = AVAILABLE_MODELS.map(m => m.id);
      if (!validIds.includes(value as any)) {
        console.error(chalk.red(`\n  Unknown model: ${value}`));
        console.error(dim(`  Available: ${validIds.join(", ")}\n`));
        process.exit(1);
      }
      setModel(value);
      console.log(`\n  ${chalk.green("✓")} Default model set to ${accent(value)}\n`);
      break;
    }
    default:
      console.error(chalk.red(`\n  Unknown config key: ${key}`));
      console.error(dim(`  Available keys: api-key, model\n`));
      process.exit(1);
  }
}

export function configDeleteCommand(key: string) {
  switch (key) {
    case "api-key":
      clearApiKey();
      console.log(`\n  ${chalk.green("✓")} API key removed\n`);
      break;
    case "model":
      setModel("");
      console.log(`\n  ${chalk.green("✓")} Model reset to default (${DEFAULT_MODEL})\n`);
      break;
    default:
      console.error(chalk.red(`\n  Unknown config key: ${key}`));
      process.exit(1);
  }
}
