export const AUDIT_PROMPT = `Perform a comprehensive SECURITY AUDIT of this codebase.

Focus on:
1. **Injection vulnerabilities** — SQL injection, XSS, command injection, path traversal
2. **Authentication & authorization flaws** — missing auth checks, insecure session handling, broken access control
3. **Data exposure** — hardcoded secrets, sensitive data in logs, unencrypted PII
4. **Cross-file security issues** — middleware bypasses, inconsistent validation across endpoints, shared state vulnerabilities
5. **Dependency risks** — known vulnerable patterns, insecure configurations
6. **Cryptographic issues** — weak algorithms, improper random generation
7. **API security** — missing rate limiting, CORS misconfiguration, insecure headers

For each finding:
- Assign a severity (critical/high/medium/low/info)
- Explain the attack vector
- Show the vulnerable code
- Provide a fixed version as a diff
- Mark cross-file issues that span multiple files

Provide metrics:
- Security score (0-100, before and after your suggested fixes)
- Total vulnerabilities by severity
- Cross-file issues count`;
