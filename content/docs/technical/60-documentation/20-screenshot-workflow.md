---
title: Screenshot Workflow
description: Process for capturing and maintaining documentation screenshots.
status: complete
screenshots: none
---

Screenshots are a core part of SOC documentation quality and should be captured with a repeatable workflow.
Treat screenshots as versioned documentation assets, not one-off visual aids.

## Tracking the backlog

Each page declares its capture state in frontmatter via the screenshots field
(none, pending, or done), separate from prose status. The current backlog is
every page with screenshots set to pending:

```bash
npm run check:status
```

When a page's captures are embedded, flip its screenshots value to done.
The check fails if a page claims done without embedded images, or none while
embedding images.

## Capture goals

- Show the exact UI state described in the page text.
- Keep visual clarity in both light and dark themes when relevant.
- Minimize noise so readers can focus on the documented action.

## File locations and naming

- Store files in static/images/docs/<guide>/<section>/.
- Name the primary capture after the socdocs page it illustrates; supplementary captures add a kebab-case suffix.
- Keep naming stable so links remain readable and maintainable.

Example:

- /images/docs/user/getting-started/create-your-account.webp

## Capture standards

- Prefer desktop baseline captures for workflow clarity.
- Include mobile captures when layout or interaction differs materially.
- Capture at consistent resolution for comparable page presentation.
- Crop to the relevant UI area while preserving necessary context.

## Theme and role coverage

- Capture in the theme that best demonstrates contrast and readability.
- Add dark-theme variants when visuals or instructions differ.
- Use the correct role/account context (resident, coordinator, admin) for each feature.

## Format and optimization

- Use webp for delivery efficiency.
- Keep dimensions within practical max width for documentation layouts.
- Avoid oversized files that do not improve legibility.

## Authoring integration

- Add images with absolute paths in markdown.
- Place image references near the step they illustrate.
- Update or remove screenshots when UI changes invalidate them.

## Quality checks

Before merge:

1. verify screenshot text is legible at normal reading zoom
2. verify dark/light contrast where applicable
3. run build and link checks to confirm image paths resolve
4. run check:status to confirm the page's screenshots frontmatter matches its embedded images

## Automated capture script

The capture workflow is scripted: scripts/docs-screenshots.ts in the soc-dev repository drives a
Playwright browser over a fixed manifest that maps each socdocs page to its app route, captures at
1440x900, and writes webp files straight into this site's static/images/docs/ tree.

```bash
# in the soc-dev repository, with the dev server running
npm run docs:screenshots            # capture everything credentials allow
npm run docs:screenshots -- --list  # show the manifest and credential status
npm run docs:screenshots -- --only your-property
```

- Public pages (sign-in, create account, reset password) capture with no setup.
- Authenticated pages need demo-account credentials via DOCS_SHOTS_RESIDENT/COORDINATOR/ADMIN_EMAIL and \_PASSWORD env vars.
- The script refuses authenticated captures while the app points at the production Supabase project; use seeded demo accounts in the dev project so no real resident data appears in documentation.

## Related pages

- [Writing Docs](/docs/technical/documentation/writing-docs)
- [Quality Checks](/docs/technical/conventions/quality-checks)
