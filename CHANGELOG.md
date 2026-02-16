# Changelog

All notable changes to Shipwell are documented here.

---

## 0.4.2

- Added `shipwell help` command with full reference for all commands, flags, and examples
- Added `shipwell help <command>` for per-command detailed help
- Consolidated `/cli` and `/github-app` pages into `/docs` with `#hash` navigation
- Minimal footer on `/docs`, `/profile`, `/settings`, `/privacy`, `/terms`
- Cleaned terminal demo in docs for better readability

## 0.4.1

- npm publish workflow for automated releases
- CLI documentation updates for `--create-pr` flag

## 0.4.0

- GitHub App PR creation via `--create-pr` flag on all analysis commands
- PRs authored by ShipwellHQ[bot] through the web API
- Added `/github-app` page with setup guide, PR preview, permissions, and FAQ
- Updated `/cli` page with Auto-Fix PRs section

## 0.3.1

- Updated Claude model context window and max output values
- Full descriptions in prompts and CLI output (removed line limits)
- Streaming analysis findings and metrics in real-time
- Redesigned analysis summary box with word wrapping and markdown stripping
- Report export hints in CLI output

## 0.3.0

- Interactive CLI mode with guided prompts (`shipwell interactive`)
- Enhanced output formatting with compact finding cards
- Export functionality for analysis results (`.md` and `.json`)
- Centralized reusable footer component across web pages

## 0.2.9

- Fixed stale VERSION constant in CLI build
- Auto-exit after login flow
- Red dot indicator for missing API key

## 0.2.3

- Redirect-based auth flow (localhost to shipwell.app)
- Fixed HTTPS mixed content block on login
- Kept login flow on shipwell.app

## 0.2.0

- CLI authentication: `login`, `logout`, `whoami`, `config` commands
- Migrated CLI build to tsup
- Renamed package to `@shipwellapp/cli`
- Box-drawing welcome banner with model info display

## 0.1.0

- Initial release
- Five analysis operations: `audit`, `migrate`, `refactor`, `docs`, `upgrade`
- Full codebase ingestion with Claude Opus (1M token context)
- Web app with analysis dashboard, health score, severity distribution
- Firebase authentication with Google sign-in
- CLI and web interfaces
