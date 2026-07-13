# SOC Docs

SOC docs is a single SvelteKit documentation site that serves four guide collections:

- User Guide
- Administrator Guide
- Technical Guide
- Project Guide

The site is fully prerendered and deployed as static output.

## Requirements

- Node.js 22
- npm 10+

## Development

```bash
npm install
npm run dev
```

## Build and Validation

```bash
npm run check
npm run build
npm run check:links
```

`npm run build` runs SvelteKit production build and then generates the Pagefind index in `build/pagefind`.

## Content Authoring

### File locations

Content lives under:

`content/docs/<guide>/<NN-section>/<NN-page>.md`

Examples:

- `content/docs/user/index.md`
- `content/docs/user/10-getting-started/index.md`
- `content/docs/user/10-getting-started/10-create-your-account.md`

### URL mapping

Number prefixes are used for nav order and stripped from the URL.

- `content/docs/user/10-getting-started/10-create-your-account.md`
- renders at `/docs/user/getting-started/create-your-account`

### Required frontmatter

```yaml
---
title: Create Your Account
description: Set up a resident account and verify access.
status: stub
---
```

Rules:

- `title` is required
- `description` is required
- `status` is optional and defaults to `complete`
- valid statuses: `stub`, `draft`, `complete`

### Images

Store static images in:

`static/images/docs/<guide>/<section>/...`

Reference with absolute paths in markdown:

```md
![SOC screenshot](/images/docs/user/getting-started/example.webp)
```

## Search

Pagefind is loaded lazily by the search modal and available in production builds.

## llms endpoints

The build includes:

- `/llms.txt`
- `/llms-full.txt`

## CI

GitHub Actions workflow runs:

1. `npm ci`
2. `npm run check`
3. `npm run build`
4. `npm run check:links`
