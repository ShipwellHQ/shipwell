<p align="center">
  <img src="https://img.shields.io/badge/Built_with-Claude_Opus_4.6-6366f1?style=for-the-badge" alt="Built with Opus 4.6" />
  <img src="https://img.shields.io/badge/Context-1M_Tokens-6366f1?style=for-the-badge" alt="1M Context" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="MIT License" />
</p>

# ⛵ Shipwell

**Full Codebase Autopilot** — deep cross-file analysis powered by Claude's 1M token context window.

Feed an entire repository into Claude in a single pass. Get security audits, migration plans, refactoring suggestions, documentation, and dependency upgrade paths that understand how your files connect.

---

## Why Shipwell?

Most AI code tools work file-by-file. They miss the big picture — the auth middleware that trusts a header set three packages away, the duplicated validation logic across 12 endpoints, the breaking change that ripples through your entire import graph.

Shipwell ingests your **entire codebase** into Claude's context window and analyzes it as a whole. Cross-file issues that are invisible to file-by-file tools become obvious.

### What it finds

- **Security vulnerabilities** that span multiple files (auth bypass chains, data flow leaks)
- **Migration blockers** with full dependency graphs and ordered change sets
- **Code duplication** across packages, not just within files
- **Architecture issues** like circular dependencies and layering violations
- **Dependency risks** with upgrade paths that account for breaking changes in your code

---

## Operations

| Command | Description |
|---------|-------------|
| `audit` | Security audit — vulnerabilities, auth flaws, data exposure, cryptography issues |
| `migrate` | Migration plan — ordered changes for framework/library upgrades |
| `refactor` | Refactor analysis — duplication, dead code, architecture smells |
| `docs` | Documentation — architecture overview, API docs, data flow diagrams |
| `upgrade` | Dependency upgrade — outdated deps, security advisories, safe upgrade paths |

---

## Quick Start

### Web App

```bash
git clone https://github.com/manasdutta04/shipwell.git
cd shipwell
pnpm install
```

Set up Firebase for authentication — create a `.env.local` in `apps/web/`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

Then start the dev server:

```bash
pnpm dev:web
```

Open [http://localhost:3000](http://localhost:3000), sign in with Google, enter your Anthropic API key in Settings, and run your first analysis.

### CLI

```bash
pnpm build
```

```bash
# Security audit
node apps/cli/dist/index.js audit ./my-repo --api-key sk-ant-...

# Migration plan
node apps/cli/dist/index.js migrate ./my-repo --target "React 19"

# Refactor analysis
node apps/cli/dist/index.js refactor ./my-repo

# Generate docs
node apps/cli/dist/index.js docs ./my-repo

# Dependency upgrade plan
node apps/cli/dist/index.js upgrade ./my-repo
```

Set `ANTHROPIC_API_KEY` as an environment variable to skip the `--api-key` flag:

```bash
export ANTHROPIC_API_KEY=sk-ant-...
node apps/cli/dist/index.js audit ./my-repo
```

---

## Architecture

```
shipwell/
├── packages/
│   └── core/               # @shipwell/core — shared analysis engine
│       └── src/
│           ├── ingest/      # File reader, filters, token counter, bundler
│           ├── prompts/     # Operation-specific prompt templates
│           ├── engine/      # Anthropic API client with streaming
│           └── output/      # Streaming XML parser
├── apps/
│   ├── web/                 # Next.js 15 web app
│   │   └── src/
│   │       ├── app/         # App Router (pages + API routes)
│   │       ├── components/  # React components
│   │       └── hooks/       # SSE streaming hook
│   └── cli/                 # Commander.js CLI
│       └── src/
│           ├── index.ts     # Entry point + command registration
│           └── commands/    # analyze command
```

### Data Flow

```
Repository (local path or GitHub URL)
  → Ingest (read files, filter, estimate tokens, prioritize)
  → Bundle (XML-structured codebase, smart token budgeting)
  → Prompt (operation-specific system + user prompt)
  → Claude API (streaming, up to 200K context)
  → Parse (streaming XML → findings, metrics, diffs)
  → Present (Web: real-time SSE | CLI: colored terminal output)
```

### How Ingestion Works

1. **Read** — Recursively reads all files, respecting `.gitignore`
2. **Filter** — Skips binaries, lock files, `node_modules`, build artifacts (80+ supported file types)
3. **Prioritize** — Scores files by importance: configs (100) > entry points (90) > core logic (70) > tests (30)
4. **Budget** — Fits as many files as possible within the token budget, highest priority first
5. **Bundle** — Wraps files in XML: `<file path="src/auth.ts" language="typescript">...</file>`

### Why XML?

Claude excels at structured XML parsing. The XML format lets the model precisely reference file paths and produce structured output (findings, metrics, diffs) that can be parsed in real-time as it streams.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Monorepo | pnpm workspaces + Turborepo |
| Language | TypeScript 5.7+ |
| AI | Anthropic Claude API (Sonnet 4.5 / Opus 4.6 / Haiku 4.5) |
| Web | Next.js 15, React 19, Tailwind CSS v4 |
| Auth | Firebase (Google sign-in) |
| Animations | Framer Motion |
| Icons | Lucide React |
| CLI | Commander.js, Ora, Chalk |

---

## Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `ANTHROPIC_API_KEY` | Anthropic API key (CLI) | CLI only |
| `SHIPWELL_MODEL` | Default Claude model | No |
| `NEXT_PUBLIC_FIREBASE_*` | Firebase config (6 vars) | Web only |

### Supported Models

| Model | ID |
|-------|----|
| Claude Sonnet 4.5 (default) | `claude-sonnet-4-5-20250929` |
| Claude Opus 4.6 | `claude-opus-4-6` |
| Claude Haiku 4.5 | `claude-haiku-4-5-20251001` |

### CLI Flags

```
-k, --api-key <key>      Anthropic API key
-m, --model <model>      Claude model to use
-t, --target <target>    Migration target (for migrate)
-c, --context <context>  Additional context for analysis
-r, --raw                Print raw streaming output
```

---

## Development

```bash
# Install dependencies
pnpm install

# Build everything
pnpm build

# Dev mode (web app with hot reload)
pnpm dev:web

# Build individual packages
pnpm build:core
pnpm build:web
pnpm build:cli
```

### Project Structure

- **`packages/core`** — Zero-dependency analysis engine (except Anthropic SDK, glob, ignore, simple-git). Shared between web and CLI.
- **`apps/web`** — Next.js app. API route proxies requests to core engine via SSE. Client renders streaming results.
- **`apps/cli`** — Thin wrapper around core engine with terminal formatting.

---

## How It Works (Under the Hood)

### Streaming Analysis

The web app uses Server-Sent Events (SSE) over POST:

1. Client sends repo path + operation + API key to `/api/analyze`
2. Server ingests the repo, bundles it, and starts streaming from Claude
3. Each chunk is forwarded to the client as an SSE event
4. Client-side `StreamingParser` extracts findings and metrics in real-time
5. UI updates live — findings appear as Claude discovers them

### Cross-File Detection

Findings that reference multiple files are flagged as **cross-file issues**. These are the findings that file-by-file tools miss entirely — auth chains, data flow vulnerabilities, shared state bugs, and import cycles.

### Token Budgeting

For repositories larger than the context window, Shipwell uses smart prioritization:

- Configuration files get the highest priority (they define the project)
- Entry points and API routes come next (they define behavior)
- Core source files follow (business logic)
- Tests and docs get lowest priority (useful but expendable)

Files are included in priority order until the token budget is exhausted.

---

## Security

- **API keys never touch our servers** — in the web app, your Anthropic API key is stored in your browser's localStorage and sent directly to the Anthropic API via the Next.js API route
- **Firebase auth** — Google sign-in only, no password storage
- **No database** — analysis results exist only in your browser session

---

## License

[MIT](LICENSE)

---

<p align="center">
  Built for the <strong>Built with Opus 4.6</strong> Hackathon by Manas Dutta
</p>
