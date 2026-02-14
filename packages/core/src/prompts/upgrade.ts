export const UPGRADE_PROMPT = `Perform a comprehensive DEPENDENCY UPGRADE analysis for this codebase.

Analyze all dependencies and their usage across the entire codebase:

1. **Outdated dependencies** — identify packages that need upgrading, check for major version bumps
2. **Breaking changes** — for each upgrade, list every file that uses changed APIs
3. **Security advisories** — known vulnerable versions in use
4. **Unused dependencies** — packages in package.json that aren't imported anywhere
5. **Missing types** — @types packages needed but not installed
6. **Cross-file upgrade impacts** — how upgrading one dependency affects usage across multiple files
7. **Peer dependency conflicts** — potential version conflicts between packages

For each upgrade:
- Show current vs recommended version
- List all files that import/use the package
- Show code changes needed as diffs
- Mark cross-file impacts

Provide metrics:
- Dependencies needing upgrade
- Security vulnerabilities fixed
- Unused dependencies to remove
- Breaking changes requiring code updates`;
