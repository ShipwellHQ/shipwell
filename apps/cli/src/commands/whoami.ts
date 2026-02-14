import chalk from "chalk";
import { getUser, getApiKey, getModel } from "../lib/store.js";
import { DEFAULT_MODEL } from "@shipwell/core";

const accent = chalk.hex("#6366f1");
const dim = chalk.dim;

export function whoamiCommand() {
  const user = getUser();
  const apiKey = getApiKey();
  const model = getModel();

  console.log();
  if (user) {
    console.log(`  ${accent("⛵")} ${chalk.bold(user.name)}`);
    console.log(`     ${dim(user.email)}`);
  } else {
    console.log(`  ${dim("Not logged in.")} Run ${chalk.cyan("shipwell login")} to sign in.`);
  }
  console.log();
  console.log(`  ${dim("API Key")}   ${apiKey ? chalk.green("●") + " configured " + dim(`(${apiKey.slice(0, 12)}...)`) : chalk.yellow("●") + " not set"}`);
  console.log(`  ${dim("Model")}     ${accent(model || DEFAULT_MODEL)}${!model ? dim(" (default)") : ""}`);
  console.log(`  ${dim("Config")}    ${dim("~/.shipwell/config.json")}`);
  console.log();
}
