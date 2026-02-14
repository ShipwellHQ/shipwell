import { readFile, readdir, stat } from "fs/promises";
import { join, relative } from "path";
import { simpleGit } from "simple-git";
import { glob } from "glob";
import { createFilter, isCodeFile, getLanguage } from "./filters.js";
import { estimateTokens } from "./tokens.js";
import { getFilePriority } from "./priority.js";
import type { IngestOptions, IngestedFile, IngestResult } from "../types.js";

const MAX_FILE_SIZE = 512 * 1024; // 512KB per file
const DEFAULT_MAX_TOKENS = 865_000;

function isGitHubUrl(source: string): boolean {
  return source.startsWith("https://github.com/") || source.startsWith("git@github.com:");
}

async function cloneRepo(url: string): Promise<string> {
  const tmpDir = join("/tmp", "shipwell-" + Date.now().toString(36));
  const git = simpleGit();
  await git.clone(url, tmpDir, ["--depth", "1", "--single-branch"]);
  return tmpDir;
}

export async function ingestRepo(options: IngestOptions): Promise<IngestResult> {
  const maxTokens = options.maxTokens ?? DEFAULT_MAX_TOKENS;

  // Resolve source to local path
  let repoPath: string;
  if (isGitHubUrl(options.source)) {
    repoPath = await cloneRepo(options.source);
  } else {
    repoPath = options.source;
  }

  // Read .gitignore if present
  let gitignoreContent: string | undefined;
  try {
    gitignoreContent = await readFile(join(repoPath, ".gitignore"), "utf-8");
  } catch {
    // No .gitignore
  }

  const filter = createFilter(gitignoreContent);

  // Find all files
  const allFiles = await glob("**/*", {
    cwd: repoPath,
    nodir: true,
    dot: false,
    absolute: false,
  });

  // Filter and read files
  const files: IngestedFile[] = [];
  let skippedFiles = 0;

  for (const filePath of allFiles) {
    // Apply ignore filter
    if (filter.ignores(filePath)) {
      skippedFiles++;
      continue;
    }

    // Check if it's a code file
    if (!isCodeFile(filePath)) {
      skippedFiles++;
      continue;
    }

    const fullPath = join(repoPath, filePath);

    // Check file size
    try {
      const fileStat = await stat(fullPath);
      if (fileStat.size > MAX_FILE_SIZE) {
        skippedFiles++;
        continue;
      }
    } catch {
      skippedFiles++;
      continue;
    }

    // Read file content
    try {
      const content = await readFile(fullPath, "utf-8");
      // Skip binary-looking files
      if (content.includes("\0")) {
        skippedFiles++;
        continue;
      }

      const tokens = estimateTokens(content);
      files.push({
        path: filePath,
        content,
        language: getLanguage(filePath),
        tokens,
        priority: getFilePriority(filePath),
      });
    } catch {
      skippedFiles++;
    }
  }

  // Sort by priority (highest first)
  files.sort((a, b) => b.priority - a.priority);

  // Trim to token budget
  let totalTokens = 0;
  const includedFiles: IngestedFile[] = [];
  for (const file of files) {
    if (totalTokens + file.tokens > maxTokens) {
      skippedFiles++;
      continue;
    }
    totalTokens += file.tokens;
    includedFiles.push(file);
  }

  return {
    files: includedFiles,
    totalTokens,
    totalFiles: includedFiles.length,
    skippedFiles,
    repoPath,
  };
}
