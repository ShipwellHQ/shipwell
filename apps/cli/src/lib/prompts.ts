import { createInterface } from "node:readline";

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

export function promptChoice(
  message: string,
  choices: { label: string; description?: string }[],
): Promise<number> {
  return new Promise((resolve) => {
    const rl = createRL();
    console.log();
    console.log(`  ${message}`);
    console.log();
    for (let i = 0; i < choices.length; i++) {
      const desc = choices[i].description ? `  ${choices[i].description}` : "";
      console.log(`    ${i + 1}. ${choices[i].label}${desc}`);
    }
    console.log();
    rl.question(`  Choice [1-${choices.length}]: `, (answer) => {
      rl.close();
      const n = parseInt(answer.trim(), 10);
      if (n >= 1 && n <= choices.length) {
        resolve(n - 1);
      } else {
        resolve(0);
      }
    });
  });
}
