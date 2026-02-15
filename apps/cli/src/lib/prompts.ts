import { createInterface } from "node:readline";
import chalk from "chalk";

const dim = chalk.dim;
const accent = chalk.hex("#6366f1");

function createRL() {
  return createInterface({ input: process.stdin, output: process.stdout });
}

export function promptConfirmation(message: string): Promise<boolean> {
  return new Promise((resolve) => {
    const rl = createRL();
    rl.question(`  ${message} [Y/n] `, (answer) => {
      rl.close();
      const a = answer.trim().toLowerCase();
      resolve(a === "" || a === "y" || a === "yes");
    });
  });
}

export function promptText(message: string): Promise<string> {
  return new Promise((resolve) => {
    const rl = createRL();
    rl.question(`  ${message} `, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

export async function promptTextRequired(message: string, errorMsg?: string): Promise<string> {
  while (true) {
    const answer = await promptText(message);
    if (answer) return answer;
    console.log(`  ${chalk.red(errorMsg || "Input required. Please try again.")}`);
  }
}

export async function promptChoice(
  choices: { label: string; description?: string }[],
): Promise<number> {
  while (true) {
    const rl = createRL();
    const answer = await new Promise<string>((resolve) => {
      rl.question(`  ${dim("Choice")} [1-${choices.length}]: `, (a) => {
        rl.close();
        resolve(a.trim());
      });
    });

    const n = parseInt(answer, 10);
    if (n >= 1 && n <= choices.length) {
      return n - 1;
    }
    console.log(`  ${chalk.red(`Please enter a number between 1 and ${choices.length}.`)}`);
  }
}
