export const DOCS_PROMPT = `Generate comprehensive DOCUMENTATION for this codebase.

Analyze the entire codebase and produce:

1. **Architecture overview** — high-level system diagram description, key components and their relationships
2. **API documentation** — all endpoints/functions with parameters, return types, and examples
3. **Cross-file data flows** — how data moves through the system, from input to output
4. **Setup guide** — environment setup, dependencies, configuration
5. **Key patterns** — design patterns used, conventions to follow
6. **Type reference** — important interfaces/types and where they're used

For each documentation section:
- Reference specific files and line numbers
- Include code examples from the actual codebase
- Mark cross-file relationships and data flows
- Note any undocumented or confusing areas

Provide metrics:
- Documentation coverage (percentage of public APIs documented)
- Undocumented public functions count
- Cross-file flows documented`;
