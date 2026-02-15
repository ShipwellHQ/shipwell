<p align="center">
  <img src="https://img.shields.io/badge/Built_with-Claude_Opus_4.6-6366f1?style=for-the-badge" alt="Built with Opus 4.6" />
  <img src="https://img.shields.io/badge/Context-1M_Tokens-6366f1?style=for-the-badge" alt="1M Context" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="MIT License" />
</p>

# Shipwell

**Full Codebase Autopilot** — deep cross-file analysis powered by Claude's 1M token context window.

Feed an entire repository into Claude in a single pass. Get security audits, migration plans, refactoring suggestions, documentation, and dependency upgrade paths that understand how your files connect.

**[shipwell.app](https://shipwell.app)** | **[npm](https://www.npmjs.com/package/@shipwellapp/cli)** | **[GitHub](https://github.com/manasdutta04/shipwell)**

---

## Why Shipwell?

Most AI code tools work file-by-file. They miss the big picture — the auth middleware that trusts a header set three packages away, the duplicated validation logic across 12 endpoints, the breaking change that ripples through your entire import graph.

Shipwell ingests your **entire codebase** into Claude's context window and analyzes it as a whole. Cross-file issues that are invisible to other tools become obvious.

---

## What It Finds

- **Security vulnerabilities** that span multiple files — auth bypass chains, unsanitized data flows, hardcoded secrets
- **Migration blockers** with full dependency graphs and ordered change sets
- **Code duplication** across packages, not just within files
- **Architecture issues** — circular dependencies, layering violations, dead code
- **Dependency risks** with upgrade paths that account for breaking changes in your code

---

## Features

| Feature | Description |
|---------|-------------|
| **Cross-file analysis** | Detects issues spanning multiple files that single-file tools completely miss |
| **5 analysis modes** | Security audit, migration plan, refactor analysis, docs generation, dependency upgrade |
| **Real-time streaming** | Findings appear live as Claude analyzes — no waiting for completion |
| **1M token context** | Hundreds of files ingested in a single prompt, no chunking or context loss |
| **Actionable output** | Severity scores, before/after metrics, suggested diffs, not just vague suggestions |
| **Privacy first** | Your API key never touches our servers — passed directly to Anthropic's API |
| **GitHub integration** | Paste any public GitHub URL — cloned, ingested, and analyzed automatically |
| **Export results** | Download findings as Markdown for sharing or tracking |
| **Web + CLI** | Full web dashboard at [shipwell.app](https://shipwell.app) and a terminal CLI |

---

## Analysis Modes

| Mode | What it does |
|------|-------------|
| **Security Audit** | Vulnerabilities, auth flaws, data exposure, cryptography issues, cross-file attack chains |
| **Migration Plan** | Ordered changes for framework/library upgrades with full diffs |
| **Refactor Analysis** | Duplication, dead code, complexity hotspots, architecture smells |
| **Documentation** | Architecture overview, API docs, data flow diagrams, module guides |
| **Dep. Upgrade** | Outdated deps, security advisories, breaking change analysis, safe upgrade paths |

---

## Using the Web App

### 1. Sign in

Go to [shipwell.app](https://shipwell.app) and sign in with Google.

### 2. Connect your API key

Navigate to **Settings** and enter your Anthropic API key. It's stored only in your browser's localStorage and never sent to our servers.

Don't have one? Get it from the [Anthropic Console](https://console.anthropic.com/settings/keys).

### 3. Run an analysis

On the **Analysis** page:
1. Paste a **GitHub URL** (e.g. `https://github.com/acme/api`) or a local path
2. Choose an **operation** (Security Audit, Migration, Refactor, Docs, or Dep. Upgrade)
3. Optionally add **context** to focus the analysis (e.g. "focus on authentication")
4. Click **Start Analysis**

### 4. View results

Findings stream in real-time as Claude analyzes your code:
- **Dashboard** — health score gauge, severity distribution bar, most impacted files
- **Findings tab** — each finding with severity, description, affected files, and suggested diffs
- **Cross-file graph** — visual map of issues that span multiple files
- **Metrics tab** — before/after scores for code quality dimensions
- **Raw output** — full Claude response for reference

Filter by severity or cross-file status. Export results as Markdown when done.

### Demo mode

Visit [shipwell.app/analysis?demo=true](https://shipwell.app/analysis?demo=true) to see a sample analysis without an API key.

---

## Using the CLI

### Install

```bash
npm install -g @shipwellapp/cli
```

### Authenticate

```bash
shipwell login
```

This opens your browser to sign in with the same Google account you use on the web app.

### Run an analysis

```bash
# Security audit on a GitHub repo
shipwell audit https://github.com/acme/api

# Migration plan for a local project
shipwell migrate ./my-project --target "React 19"

# Refactor analysis
shipwell refactor ./my-project

# Generate documentation
shipwell docs ./my-project

# Dependency upgrade plan
shipwell upgrade ./my-project
```

### More commands

```bash
# Interactive guided mode
shipwell interactive

# Remove stored API key
shipwell delete-key

# View config / account info
shipwell whoami
shipwell config
```

### CLI options

```
-k, --api-key <key>      Anthropic API key (or set ANTHROPIC_API_KEY env var)
-m, --model <model>      Claude model to use
-t, --target <target>    Migration target (for migrate command)
-c, --context <context>  Additional context to focus the analysis
-r, --raw                Print raw streaming output
-y, --yes                Skip cost confirmation prompt
-o, --output <path>      Export report to file (.md or .json)
```

### Export reports

```bash
# Export as Markdown
shipwell audit ./my-project -o report.md

# Export as JSON
shipwell audit ./my-project -o report.json

# Skip confirmation and export
shipwell audit ./my-project -y -o report.md
```

### Example output

```
$ shipwell audit https://github.com/acme/api

  ⛵ Shipwell — Full Codebase Autopilot
  Security Audit · claude-sonnet-4-5-20250929

  ✔ Read 342 files (58 skipped, ~187K tokens)
  ✔ Bundled 342 files (~187K tokens)

  Estimated cost: ~$0.68 (187K input + ~8K output tokens)
  Proceed? [Y/n] y

  ─── Findings ────────────────────────────────────────────

   1. SQL injection in queries.ts [CRITICAL] ⟷
      src/db/queries.ts, src/routes/api.ts
      Unsanitized user input flows to db.raw() via 3 files...

   2. Hardcoded secret in auth config [HIGH]
      src/config/auth.ts
      API secret is committed directly in source code...

  ╭────────────────────────────────────────────────────────╮
  │ Analysis Complete                                      │
  │                                                        │
  │ 12 findings: 2 critical / 4 high / 3 medium / 3 low   │
  │ 3 cross-file issues detected                           │
  │ 342 files analyzed | 187K tokens | 23.4s               │
  ╰────────────────────────────────────────────────────────╯

  Export full report with detailed findings:
  shipwell audit https://github.com/acme/api -o report.md
  shipwell audit https://github.com/acme/api -o report.json
```

---

## Supported Models

| Model | ID | Notes |
|-------|----|-------|
| Claude Sonnet 4.5 | `claude-sonnet-4-5-20250929` | Default — best balance of speed and quality |
| Claude Opus 4.6 | `claude-opus-4-6` | Most capable, deeper analysis |
| Claude Haiku 4.5 | `claude-haiku-4-5-20251001` | Fastest, good for quick scans |

Select your model in **Settings** on the web app, or pass `--model` to the CLI.

---

## How It Works

1. **Ingest** — Recursively reads all files, respects `.gitignore`, skips binaries and lock files (80+ file types supported)
2. **Prioritize** — Scores files by importance: configs > entry points > core logic > tests
3. **Bundle** — Fits as many files as possible within the token budget, highest priority first
4. **Analyze** — Sends the entire bundled codebase to Claude with an operation-specific prompt
5. **Stream** — Findings, metrics, and diffs are parsed and displayed in real-time as Claude responds

Cross-file issues are automatically flagged when a finding references multiple files — these are the issues that file-by-file tools miss entirely.

---

## Security & Privacy

- **Your API key stays in your browser** — it's stored in localStorage and passed directly to the Anthropic API. Our servers never see it.
- **No database** — analysis results exist only in your browser session. Nothing is stored server-side.
- **Google auth only** — no password storage, Firebase authentication.
- **Open source** — inspect the code yourself.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| AI | Anthropic Claude API (Sonnet 4.5 / Opus 4.6 / Haiku 4.5) |
| Web | Next.js 15, React 19, Tailwind CSS v4, Framer Motion |
| Auth | Firebase (Google sign-in) |
| CLI | Commander.js, Ora, Chalk |
| Monorepo | pnpm workspaces + Turborepo, TypeScript |

---

## License

[MIT](LICENSE)

---

<p align="center">
  Built for the <strong>Built with Opus 4.6</strong> Hackathon by Manas Dutta
</p>
