import chalk from "chalk";
import { clearUser, getUser } from "../lib/store.js";

const accent = chalk.hex("#6366f1");

export function logoutCommand() {
  const user = getUser();
  if (!user) {
    console.log();
    console.log(chalk.dim("  Not logged in."));
    console.log();
    return;
  }

  clearUser();
  console.log();
  console.log(`  ${chalk.green("✓")} Logged out ${accent(user.name)}`);
  console.log();
}
