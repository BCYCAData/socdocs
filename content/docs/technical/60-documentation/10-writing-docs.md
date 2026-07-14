---
title: Writing Docs
description: Authoring standards for clear, maintainable SOC documentation.
status: complete
---

SOC documentation is authored as structured markdown with strict frontmatter and predictable URL mapping.
The goal is fast contribution, stable navigation, and durable content quality over time.

## Authoring model

- One guide lives under content/docs/<guide>/.
- Sections and pages use numeric prefixes for ordering.
- Prefixes are removed from public URLs at build time.

Example mapping:

- content/docs/user/10-getting-started/10-create-your-account.md
- [Create Your Account](/docs/user/getting-started/create-your-account)

## Required frontmatter

Every page must include:

- title
- description
- optional status (defaults to complete)

Accepted status values:

- stub
- draft
- complete

Missing required frontmatter should be treated as a build-time correctness issue.

## Writing style conventions

- Prefer concise, task-oriented headings.
- Start with what the reader can do, then add context.
- Use short paragraphs and explicit action steps.
- Keep terminology aligned with the product UI labels.

## Cross-linking and structure

- Link to related pages for deeper detail instead of duplicating long explanations.
- Keep each page focused on one operational topic.
- Use section pages for orientation and leaf pages for actionable guidance.

## Code and command examples

- Use fenced blocks for shell, JSON, SQL, and configuration examples.
- Keep examples runnable where practical.
- Prefer stable command patterns over environment-specific shortcuts.

## Images and media

- Store docs images under static/images/docs/<guide>/<section>/.
- Use absolute image references in markdown.
- Keep screenshots relevant and up to date with current UI.

## Content lifecycle

- Use stub for skeleton placeholders.
- Use draft when content exists but needs review or completion.
- Use complete when content has been verified and passes quality gates.

## Pre-merge checklist

Run the validation sequence before merge:

```bash
npm run check
npm run build
npm run check:links
npm run lint
```

## Related pages

- [Quality Checks](/docs/technical/conventions/quality-checks)
- [Screenshot Workflow](/docs/technical/documentation/screenshot-workflow)
