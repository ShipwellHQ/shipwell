export const REFACTOR_PROMPT = `Perform a comprehensive REFACTORING ANALYSIS of this codebase.

Analyze the entire codebase for:

1. **Code duplication** — identical or near-identical code across files, extract shared utilities
2. **Architecture issues** — circular dependencies, god classes/modules, misplaced logic
3. **Dead code** — unused exports, unreachable code paths, orphaned files
4. **Naming inconsistencies** — inconsistent naming conventions across the codebase
5. **Type safety gaps** — any casts, implicit any, missing generics
6. **Cross-cutting concerns** — logging, error handling, validation that should be centralized
7. **Pattern violations** — deviations from the codebase's own patterns/conventions

For each finding:
- Show the current code across all affected files
- Provide refactored code as diffs
- Explain the improvement and its impact
- Mark cross-file refactors that touch multiple files

Provide metrics:
- Code quality score (0-100, before and after)
- Duplicated code blocks found
- Dead code instances
- Cross-file refactoring opportunities`;
