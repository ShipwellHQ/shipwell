import { readFile, readdir, stat, mkdir, writeFile } from "fs/promises";
import { join, relative } from "path";
import * as tar from "tar";
import { glob } from "glob";
import { createFilter, isCodeFile, getLanguage } from "./filters.js";
import { estimateTokens } from "./tokens.js";
import { getFilePriority } from "./priority.js";
import type { IngestOptions, IngestedFile, IngestResult } from "../types.js";

const MAX_FILE_SIZE = 512 * 1024; // 512KB per file
const DEFAULT_MAX_TOKENS = 865_000;

function isGitHubUrl(source: string): boolean {
  return source.startsWith("https://github.com/") || source.startsWith("http://github.com/") || source.startsWith("github.com/") || source.startsWith("git@github.com:");
}

function normalizeSource(source: string): string {
  if (source.startsWith("github.com/")) {
    return `https://${source}`;
  }
  return source;
}

/** Parse "owner/repo" from a GitHub URL */
function parseGitHub(url: string): { owner: string; repo: string } {
  // https://github.com/owner/repo or git@github.com:owner/repo
  const cleaned = url.replace(/\.git$/, "");
  const match = cleaned.match(/github\.com[/:]([^/]+)\/([^/]+)/);
  if (!match) throw new Error(`Invalid GitHub URL: ${url}`);
  return { owner: match[1], repo: match[2] };
}

async function downloadRepo(url: string): Promise<string> {
  const { owner, repo } = parseGitHub(url);
  const tmpDir = join("/tmp", `shipwell-${Date.now().toString(36)}`);
  await mkdir(tmpDir, { recursive: true });

  // Download tarball via GitHub API (works without git binary)
  const tarballUrl = `https://api.github.com/repos/${owner}/${repo}/tarball`;
  const res = await fetch(tarballUrl, {
    headers: { Accept: "application/vnd.github+json", "User-Agent": "shipwell-cli" },
    redirect: "follow",
  });

  if (!res.ok) {
    throw new Error(`GitHub API error ${res.status}: could not fetch ${owner}/${repo}`);
  }

  const tarPath = join(tmpDir, "repo.tar.gz");
  const buffer = Buffer.from(await res.arrayBuffer());
  await writeFile(tarPath, buffer);

  // Extract tarball using pure JS tar (no native binary needed)
  await tar.extract({ file: tarPath, cwd: tmpDir, strip: 1 });

  return tmpDir;
}

export async function ingestRepo(options: IngestOptions): Promise<IngestResult> {
  const maxTokens = options.maxTokens ?? DEFAULT_MAX_TOKENS;

  // Resolve source to local path
  const source = normalizeSource(options.source);
  let repoPath: string;
  if (isGitHubUrl(source)) {
    repoPath = await downloadRepo(source);
  } else {
    repoPath = source;
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

      // Include XML wrapping overhead in token estimate
      const xmlOverhead = `<file path="${filePath}" language="${getLanguage(filePath)}">\n</file>\n`;
      const tokens = estimateTokens(content + xmlOverhead);
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
