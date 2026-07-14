---
title: Quality Checks
description: Required checks for type safety, links, and production readiness.
status: complete
screenshots: none
---

SOC documentation changes must pass local validation and CI gates before merge.
Quality checks ensure content integrity, type safety, static build correctness, and link reliability.

## Required local commands

Run these before opening or updating a pull request:

```bash
npm run check
npm run build
npm run check:links
npm run check:status
npm run lint
```

## What each check protects

- check: Svelte and TypeScript diagnostics.
- build: static prerender pipeline plus search index generation.
- check:links: internal link integrity in generated HTML output.
- check:status: frontmatter status/screenshots consistency and the screenshot backlog report.
- lint: formatting and code-style consistency.

## CI gate expectations

Continuous integration runs the same core gate sequence on pull requests and main-branch pushes:

1. install dependencies
2. run check
3. run build
4. run link check

Treat CI failures as merge blockers until resolved.

## Common failure modes

- Missing required frontmatter fields in markdown content.
- Broken internal links after slug/path changes.
- Prerender failures introduced by route or loader assumptions.
- Formatting or lint drift in edited files.

## Remediation workflow

1. Reproduce locally with the failing command.
2. Fix the underlying issue instead of suppressing diagnostics.
3. Re-run full local check sequence.
4. Push only when all gates pass.

## Done criteria for content pages

- status is set appropriately for prose maturity.
- screenshots is done, or none for pages with no UI to show.
- page builds successfully in static output.
- links resolve and search indexing includes the new page content.

## Related pages

- [Writing Docs](/docs/technical/documentation/writing-docs)
- [Screenshot Workflow](/docs/technical/documentation/screenshot-workflow)
