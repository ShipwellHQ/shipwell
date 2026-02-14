# @shipwell/core

Shared analysis engine for Shipwell. Handles codebase ingestion, token budgeting, prompt construction, Claude API streaming, and output parsing.

## Exports

### Ingest

```typescript
import { ingestRepo, bundleCodebase, estimateTokens, getMaxCodebaseTokens } from "@shipwell/core";

// Ingest a local repo
const result = await ingestRepo({
  source: "./my-repo",
  maxTokens: getMaxCodebaseTokens("claude-sonnet-4-5-20250929"),
});
// result.files, result.totalTokens, result.totalFiles, result.skippedFiles

// Bundle into XML for Claude
const bundle = bundleCodebase(result);
// bundle.xml, bundle.totalTokens, bundle.includedFiles
```

### Analysis

```typescript
import { streamAnalysis, runAnalysis } from "@shipwell/core";

// Streaming (for real-time UI)
for await (const chunk of streamAnalysis({
  apiKey: "sk-ant-...",
  operation: "audit",
  codebaseXml: bundle.xml,
  model: "claude-sonnet-4-5-20250929",
  target: "React 19",     // for migrate
  context: "Focus on auth", // optional
})) {
  process.stdout.write(chunk);
}

// Non-streaming
const fullText = await runAnalysis({ ... });
```

### Output Parsing

```typescript
import { StreamingParser } from "@shipwell/core";

const parser = new StreamingParser();

for await (const chunk of streamAnalysis({ ... })) {
  const { findings, metrics } = parser.push(chunk);
  // findings: Finding[] — newly completed findings in this chunk
  // metrics: MetricEvent[] — newly completed metrics in this chunk
}

const summary = parser.getSummary(); // string | null
```

### Types

```typescript
import type { Operation, Finding, MetricEvent, IngestResult, BundleResult } from "@shipwell/core";
```

**`Operation`**: `"audit" | "migrate" | "refactor" | "docs" | "upgrade"`

**`Finding`**:
- `id`, `type`, `severity`, `title`, `description`
- `files` — affected file paths
- `crossFile` — spans multiple files
- `diff`, `before`, `after` — code changes
- `category` — e.g. "security", "performance"

**`MetricEvent`**: `{ label, before, after, unit? }`

### Models

```typescript
import { AVAILABLE_MODELS, DEFAULT_MODEL, getMaxCodebaseTokens } from "@shipwell/core";

// AVAILABLE_MODELS: Array<{ id, name, contextWindow }>
// DEFAULT_MODEL: "claude-sonnet-4-5-20250929"
// getMaxCodebaseTokens("claude-opus-4-6") → ~166000
```

## File Prioritization

| Priority | Score | Examples |
|----------|-------|---------|
| Config | 100 | package.json, tsconfig.json, .env |
| Entry points | 85-90 | index.ts, main.ts, app.ts, route handlers |
| Core source | 50-70 | Components, utils, services, middleware |
| Tests | 30 | *.test.ts, *.spec.ts |
| Docs | 20 | *.md (non-README) |

## Supported File Types

80+ file types including TypeScript, JavaScript, Python, Rust, Go, Java, Kotlin, C/C++, C#, Ruby, PHP, Swift, HTML, CSS, Vue, Svelte, SQL, GraphQL, Dockerfile, YAML, TOML, and more.

Automatically filters out: `node_modules`, `.git`, `dist`, `build`, lock files, minified files, binaries, and media files.
