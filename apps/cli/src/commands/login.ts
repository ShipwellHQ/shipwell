import chalk from "chalk";
import ora from "ora";
import { startAuthFlow } from "../lib/auth.js";
import { setUser, getUser } from "../lib/store.js";

const accent = chalk.hex("#6366f1");

export async function loginCommand() {
  const existing = getUser();
  if (existing) {
    console.log();
    console.log(`  Already logged in as ${accent(existing.name)} (${chalk.dim(existing.email)})`);
    console.log(chalk.dim("  Run 'shipwell logout' first to switch accounts."));
    console.log();
    return;
  }

  console.log();
  console.log(`  ${accent("⛵")} Opening browser to sign in...`);
  console.log();

  const spinner = ora({ text: "Waiting for authentication...", color: "cyan", prefixText: "  " }).start();

  try {
    const result = await startAuthFlow("https://shipwell.app");
    setUser(result);
    spinner.succeed(`Logged in as ${accent(result.name)} (${chalk.dim(result.email)})`);
    console.log();
    console.log(chalk.dim("  Next, set your API key:"));
    console.log(`  ${chalk.cyan("shipwell config set api-key")} ${chalk.dim("sk-ant-...")}`);
    console.log();
  } catch (err: any) {
    spinner.fail(err.message);
    process.exit(1);
  }
}
