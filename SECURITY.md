# Security policy

## Reporting a vulnerability

Report privately through GitHub's [Security Advisories](https://github.com/shaibs3/math-sheets/security/advisories/new).
Do not open a public issue for a vulnerability.

Expect an acknowledgement within a week. There is no bounty — this is a side project.

## Scope

This is a static site. It has no backend, no database, no accounts, and no server-side
user data. Practice history is kept in the visitor's own browser (`localStorage`) and is
never transmitted anywhere.

That shapes what is worth reporting:

**In scope**

- Supply-chain issues: a malicious or vulnerable npm dependency, a compromised GitHub Action.
- Cross-site scripting, or any way to make the site execute attacker-controlled script.
- CI weaknesses: workflow injection, token or permission escalation in `.github/workflows`.

**Out of scope**

- Anything requiring access to the visitor's own device or browser profile. Local progress
  data is deliberately readable by whoever controls the browser.
- Missing security headers with no demonstrated impact on a site that stores no credentials.
- Denial of service against the hosting provider.
- A wrong answer on a worksheet. That is a bug — file an issue instead, and it matters to us.
