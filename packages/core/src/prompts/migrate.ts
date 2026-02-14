export function getMigratePrompt(target: string): string {
  return `Perform a comprehensive MIGRATION PLAN for this codebase to ${target}.

Analyze the entire codebase and produce:

1. **Breaking changes** — identify every usage of deprecated/changed APIs across ALL files
2. **Migration steps** — ordered list of changes, grouped by file, with dependencies between steps
3. **Cross-file impacts** — changes in one file that require changes in other files (imports, types, shared state)
4. **Configuration changes** — package.json, tsconfig, config files that need updating
5. **Type changes** — type definitions that need updating and all their downstream consumers
6. **Test updates** — tests that will break and how to fix them

For each change:
- Show exact before/after code as diffs
- Explain why the change is needed
- Note if it's a breaking change
- Mark cross-file dependencies

Provide metrics:
- Total files requiring changes
- Breaking changes count
- Estimated migration completeness (percentage)
- Cross-file dependency chains identified`;
}
