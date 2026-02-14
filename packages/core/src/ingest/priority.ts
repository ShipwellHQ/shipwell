/**
 * Assigns priority scores to files for smart token budgeting.
 * Higher priority = included first when hitting token limits.
 */

const CONFIG_FILES = new Set([
  "package.json", "tsconfig.json", "next.config.ts", "next.config.js", "next.config.mjs",
  "vite.config.ts", "vite.config.js", "webpack.config.js", "webpack.config.ts",
  ".eslintrc.js", ".eslintrc.json", "eslint.config.js", "eslint.config.mjs",
  "tailwind.config.ts", "tailwind.config.js", "postcss.config.js", "postcss.config.mjs",
  "cargo.toml", "go.mod", "requirements.txt", "pyproject.toml",
  "gemfile", "build.gradle", "pom.xml", "cmakelists.txt",
  "docker-compose.yml", "docker-compose.yaml", "dockerfile",
  ".env.example", "makefile",
]);

const ENTRY_PATTERNS = [
  /^src\/(index|main|app)\.[tj]sx?$/,
  /^src\/app\/layout\.[tj]sx?$/,
  /^src\/app\/page\.[tj]sx?$/,
  /^src\/pages\/_app\.[tj]sx?$/,
  /^src\/pages\/index\.[tj]sx?$/,
  /^app\/layout\.[tj]sx?$/,
  /^app\/page\.[tj]sx?$/,
  /^src\/lib\/.*\.[tj]sx?$/,
  /^lib\/.*\.[tj]sx?$/,
  /^main\.\w+$/,
  /^index\.\w+$/,
];

export function getFilePriority(filePath: string): number {
  const basename = (filePath.split("/").pop() || "").toLowerCase();
  const normalized = filePath.replace(/\\/g, "/").toLowerCase();

  // Root config files — highest priority
  if (CONFIG_FILES.has(basename)) return 100;

  // Entry points
  for (const pattern of ENTRY_PATTERNS) {
    if (pattern.test(normalized)) return 90;
  }

  // API routes
  if (/\/(api|routes?)\//.test(normalized)) return 85;

  // Middleware / auth
  if (/middleware\.[tj]sx?$/.test(normalized)) return 85;
  if (/auth/.test(normalized)) return 80;

  // Core source code
  if (/^src\//.test(normalized)) return 70;

  // Components
  if (/components?\//.test(normalized)) return 65;

  // Hooks, utils, helpers
  if (/hooks?\//.test(normalized)) return 60;
  if (/(utils?|helpers?|lib)\//.test(normalized)) return 60;

  // Types / interfaces
  if (/types?\.[tj]s$/.test(normalized)) return 55;

  // Tests — lower priority
  if (/\.(test|spec)\.[tj]sx?$/.test(normalized)) return 30;
  if (/__(tests?|mocks?)__\//.test(normalized)) return 30;

  // Docs
  if (/\.md$/.test(normalized)) return 20;

  // Default
  return 50;
}
