# @shipwell/cli

Command-line interface for Shipwell. Run deep codebase analysis from your terminal.

## Usage

```bash
# Build
pnpm build

# Run
node dist/index.js <operation> <source> [options]
```

## Operations

```bash
# Security audit
shipwell audit ./my-repo

# Migration plan (specify target)
shipwell migrate ./my-repo --target "React 19"

# Refactor analysis
shipwell refactor ./my-repo

# Generate documentation
shipwell docs ./my-repo

# Dependency upgrade plan
shipwell upgrade ./my-repo
```

## Options

```
-k, --api-key <key>      Anthropic API key (or set ANTHROPIC_API_KEY)
-m, --model <model>      Claude model (or set SHIPWELL_MODEL)
-t, --target <target>    Migration target (for migrate operation)
-c, --context <context>  Additional context for analysis
-r, --raw                Also print raw streaming output
-h, --help               Display help
```

## Output

The CLI displays:

1. **Ingestion stats** — files read, tokens estimated, files skipped
2. **Bundle stats** — files included in the analysis
3. **Live progress** — finding/metric count updates during analysis
4. **Findings** — numbered list with severity badges, descriptions, affected files
5. **Metrics** — before/after comparisons with color-coded values
6. **Summary** — overall analysis summary

Severity levels are color-coded: `CRITICAL` (red), `HIGH` (orange), `MEDIUM` (yellow), `LOW` (blue), `INFO` (dim).

Cross-file issues are marked with `⟷ cross-file`.

## Environment Variables

| Variable | Description |
|----------|-------------|
| `ANTHROPIC_API_KEY` | Anthropic API key (required if not using --api-key) |
| `SHIPWELL_MODEL` | Default model (default: claude-sonnet-4-5-20250929) |
