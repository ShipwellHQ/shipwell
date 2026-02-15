# @shipwellapp/cli

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

## Commands

```bash
# Interactive guided mode
shipwell interactive

# Authentication
shipwell login              # Sign in with Google via browser
shipwell logout             # Sign out and clear credentials
shipwell whoami             # Show current user, API key, and model

# Configuration
shipwell config             # View current configuration
shipwell config set api-key <key>    # Set Anthropic API key
shipwell config set model <model>    # Set default Claude model
shipwell config delete api-key       # Remove API key
shipwell config delete model         # Reset model to default
shipwell delete-key         # Shortcut to remove API key

# Utility
shipwell models             # List available Claude models
shipwell update             # Update CLI to latest version
```

## Options

```
-k, --api-key <key>      Anthropic API key (or set ANTHROPIC_API_KEY)
-m, --model <model>      Claude model (or set SHIPWELL_MODEL)
-t, --target <target>    Migration target (for migrate operation)
-c, --context <context>  Additional context for analysis
-r, --raw                Also print raw streaming output
-y, --yes                Skip cost confirmation prompt
-o, --output <path>      Export report to file (.md or .json)
-h, --help               Display help
```

## Export Reports

```bash
# Export as Markdown
shipwell audit ./my-repo -o report.md

# Export as JSON
shipwell audit ./my-repo -o report.json

# Skip cost confirmation and export
shipwell audit ./my-repo -y -o report.md
```

## Output

The CLI displays:

1. **Ingestion progress** — scanning files, reading with progress indicator
2. **Bundle stats** — files included, token count
3. **Cost estimate** — estimated API cost with confirmation prompt
4. **Live findings** — findings stream in real-time as Claude analyzes
5. **Metrics** — before/after comparisons with color-coded values
6. **Summary** — overall analysis summary
7. **Summary box** — total findings, severity breakdown, cross-file count, timing

Severity levels are color-coded: `CRITICAL` (red), `HIGH` (orange), `MEDIUM` (yellow), `LOW` (blue), `INFO` (dim).

Cross-file issues are marked with `⟷`.

## Environment Variables

| Variable | Description |
|----------|-------------|
| `ANTHROPIC_API_KEY` | Anthropic API key (required if not using --api-key) |
| `SHIPWELL_MODEL` | Default model (default: claude-sonnet-4-5-20250929) |
