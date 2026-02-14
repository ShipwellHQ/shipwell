import ignore from "ignore";

const ALWAYS_IGNORE = [
  "node_modules",
  ".git",
  ".next",
  "dist",
  "build",
  ".turbo",
  "coverage",
  "__pycache__",
  ".venv",
  "venv",
  ".env",
  ".env.local",
  "*.lock",
  "package-lock.json",
  "pnpm-lock.yaml",
  "yarn.lock",
  "*.min.js",
  "*.min.css",
  "*.map",
  "*.woff",
  "*.woff2",
  "*.ttf",
  "*.eot",
  "*.ico",
  "*.png",
  "*.jpg",
  "*.jpeg",
  "*.gif",
  "*.svg",
  "*.webp",
  "*.mp4",
  "*.mp3",
  "*.pdf",
  "*.zip",
  "*.tar.gz",
  "*.exe",
  "*.dll",
  "*.so",
  "*.dylib",
  "*.bin",
  "*.dat",
  "*.db",
  "*.sqlite",
  ".DS_Store",
  "Thumbs.db",
];

const CODE_EXTENSIONS = new Set([
  ".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs",
  ".py", ".pyw",
  ".rs",
  ".go",
  ".java", ".kt", ".kts",
  ".c", ".cpp", ".cc", ".h", ".hpp",
  ".cs",
  ".rb",
  ".php",
  ".swift",
  ".scala",
  ".clj", ".cljs",
  ".ex", ".exs",
  ".hs",
  ".lua",
  ".r", ".R",
  ".sql",
  ".sh", ".bash", ".zsh",
  ".html", ".htm", ".css", ".scss", ".sass", ".less",
  ".vue", ".svelte",
  ".json", ".yaml", ".yml", ".toml", ".xml",
  ".md", ".mdx", ".txt", ".rst",
  ".dockerfile", ".dockerignore",
  ".env.example",
  ".gitignore",
  ".eslintrc", ".prettierrc",
  ".graphql", ".gql",
  ".proto",
]);

const LANGUAGE_MAP: Record<string, string> = {
  ".ts": "typescript", ".tsx": "tsx", ".js": "javascript", ".jsx": "jsx",
  ".mjs": "javascript", ".cjs": "javascript",
  ".py": "python", ".pyw": "python",
  ".rs": "rust", ".go": "go",
  ".java": "java", ".kt": "kotlin", ".kts": "kotlin",
  ".c": "c", ".cpp": "cpp", ".cc": "cpp", ".h": "c", ".hpp": "cpp",
  ".cs": "csharp", ".rb": "ruby", ".php": "php", ".swift": "swift",
  ".scala": "scala", ".clj": "clojure", ".cljs": "clojurescript",
  ".ex": "elixir", ".exs": "elixir", ".hs": "haskell", ".lua": "lua",
  ".r": "r", ".R": "r", ".sql": "sql",
  ".sh": "bash", ".bash": "bash", ".zsh": "zsh",
  ".html": "html", ".htm": "html", ".css": "css",
  ".scss": "scss", ".sass": "sass", ".less": "less",
  ".vue": "vue", ".svelte": "svelte",
  ".json": "json", ".yaml": "yaml", ".yml": "yaml",
  ".toml": "toml", ".xml": "xml",
  ".md": "markdown", ".mdx": "mdx", ".txt": "text", ".rst": "rst",
  ".graphql": "graphql", ".gql": "graphql", ".proto": "protobuf",
};

export function createFilter(gitignoreContent?: string) {
  const ig = ignore();
  ig.add(ALWAYS_IGNORE);
  if (gitignoreContent) {
    ig.add(gitignoreContent);
  }
  return ig;
}

export function isCodeFile(filePath: string): boolean {
  const lower = filePath.toLowerCase();
  // Check exact filenames
  const basename = lower.split("/").pop() || "";
  if (basename === "dockerfile" || basename === "makefile" || basename === "rakefile" ||
      basename === "gemfile" || basename === "procfile" || basename === "cmakelists.txt") {
    return true;
  }
  // Check extensions
  const ext = "." + basename.split(".").slice(1).join(".");
  if (CODE_EXTENSIONS.has(ext)) return true;
  const lastExt = "." + (basename.split(".").pop() || "");
  return CODE_EXTENSIONS.has(lastExt);
}

export function getLanguage(filePath: string): string {
  const basename = filePath.split("/").pop() || "";
  const lower = basename.toLowerCase();
  if (lower === "dockerfile") return "dockerfile";
  if (lower === "makefile") return "makefile";
  const ext = "." + (basename.split(".").pop() || "");
  return LANGUAGE_MAP[ext] || "text";
}
