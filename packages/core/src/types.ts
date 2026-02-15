export type Operation = "audit" | "migrate" | "refactor" | "docs" | "upgrade";

export interface IngestOptions {
  /** Local path or GitHub URL */
  source: string;
  /** Max token budget for codebase content */
  maxTokens?: number;
  /** File patterns to include (globs) */
  include?: string[];
  /** File patterns to exclude (globs) */
  exclude?: string[];
  /** Called after glob scan with total files found */
  onScanProgress?: (filesFound: number) => void;
  /** Called after each file is read */
  onReadProgress?: (current: number, total: number) => void;
}

export interface IngestedFile {
  path: string;
  content: string;
  language: string;
  tokens: number;
  priority: number;
}

export interface IngestResult {
  files: IngestedFile[];
  totalTokens: number;
  totalFiles: number;
  skippedFiles: number;
  repoPath: string;
}

export interface BundleResult {
  xml: string;
  totalTokens: number;
  includedFiles: number;
  skippedFiles: number;
}

export interface AnalysisRequest {
  operation: Operation;
  source: string;
  apiKey: string;
  /** Optional migration target, e.g. "React 19" */
  target?: string;
  /** Optional extra context from the user */
  context?: string;
  /** Max codebase tokens (default ~865K) */
  maxCodebaseTokens?: number;
}

export interface Finding {
  id: string;
  type: "issue" | "suggestion" | "change" | "metric" | "doc";
  severity?: "critical" | "high" | "medium" | "low" | "info";
  title: string;
  description: string;
  files: string[];
  crossFile: boolean;
  diff?: string;
  before?: string;
  after?: string;
  category?: string;
}

export interface AnalysisEvent {
  type: "status" | "finding" | "metric" | "complete" | "error";
  data: StatusEvent | Finding | MetricEvent | CompleteEvent | ErrorEvent;
}

export interface StatusEvent {
  message: string;
  phase: "ingesting" | "bundling" | "analyzing" | "parsing";
  progress?: number;
}

export interface MetricEvent {
  label: string;
  before: number | string;
  after: number | string;
  unit?: string;
}

export interface CompleteEvent {
  summary: string;
  totalFindings: number;
  totalFiles: number;
  duration: number;
}

export interface ErrorEvent {
  message: string;
  code?: string;
}
