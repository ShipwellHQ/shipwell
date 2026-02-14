# Contributing to Shipwell

## Getting Started

```bash
git clone https://github.com/manasdutta04/shipwell.git
cd shipwell
pnpm install
pnpm build
```

## Development

```bash
# Web app with hot reload
pnpm dev:web

# Build everything
pnpm build

# Build individual packages
pnpm build:core
pnpm build:web
pnpm build:cli
```

## Project Structure

This is a pnpm monorepo managed with Turborepo:

- **`packages/core`** — Shared analysis engine. Changes here require rebuilding before web/cli pick them up.
- **`apps/web`** — Next.js web app. Uses `@shipwell/core` as a workspace dependency.
- **`apps/cli`** — CLI tool. Uses `@shipwell/core` as a workspace dependency.

## Build Order

Turborepo handles this automatically, but the dependency graph is:

```
@shipwell/core → @shipwell/web
@shipwell/core → @shipwell/cli
```

Always build core first if making changes to it:

```bash
pnpm build:core
```

## Code Style

- TypeScript strict mode everywhere
- ES modules (`"type": "module"`)
- No default exports (except Next.js pages)

## Adding a New Operation

1. Create `packages/core/src/prompts/<operation>.ts` with the prompt template
2. Export it from `packages/core/src/prompts/index.ts`
3. Add the operation to the `Operation` type in `packages/core/src/types.ts`
4. Add the operation to `packages/core/src/engine/client.ts` prompt selection
5. Register the CLI command in `apps/cli/src/index.ts`
6. Add the operation card in `apps/web/src/app/analysis/page.tsx`

## License

MIT
