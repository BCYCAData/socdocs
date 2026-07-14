# SOC Documentation Site (`socdocs`) — Concept, Design & Implementation Strategy

## Context

Four stale repos on the BCYCAData account (`socdocs-userguides`, `socdocs-administratorguides`,
`socdocs-technicalguides`, `socdocs-projectguide`) were meant to become the SOC platform's support
documentation, mimicking svelte.dev/docs. They stalled: built on the abandoned
`@svelteness/kit-docs` library (Svelte 4), split across four repos, content mostly template stubs
(administratorguides is 100% placeholder).

The svelte.dev site is actually **one** SvelteKit app serving four doc collections from numbered
markdown folders (`content/docs/{product}/NN-section/NN-page.md`), with a product switcher,
generated sidebar, on-this-page TOC, prev/next, search, and llms.txt endpoints. That is the model
to replicate.

**Confirmed decisions (user):**

1. One new consolidated repo `socdocs` — single site, four sections. Old repos archived after launch.
2. Everything public → fully prerendered static site, no auth.
3. Scaffold all four guides as skeleton IA with stub pages first; fill content iteratively.

**Key discovery:** soc-dev already has an in-app contextual help system —
`src/lib/help/content/{personal-profile-help,admin-help,kyng-coordinator-help}.ts` (per-route
title/sections copy) rendered by `src/components/page/help/HelpPanel.svelte`. This is the seed
corpus for the User/Admin guides and the Phase 3 integration point (help panel → "Learn more"
deep links into the docs site).

## Concept

| Section | URL | Audience | Seed material |
| - | - | - | - |
| User Guide | `/docs/user` | Residents | help-content maps + old userguides IA + app routes |
| Administrator Guide | `/docs/admin` | Site admins, KYNG coordinators | admin/kyng help maps + admin routes |
| Technical Guide | `/docs/technical` | Developers/maintainers | soc-dev `docs/design/*` (near-free port) |
| Project Guide | `/docs/project` | Public / funders | old projectguide IA (history, grants, components) |

Landing page `/` = hero + four guide cards. `/docs/<guide>` = guide landing (index.md body +
section list). Route→permission map in `docs/design/auth-and-session.md:197-257` defines which
guide documents which routes.

## Design — technology decisions

| Decision | Choice | Rationale |
| - | - | - |
| Framework | SvelteKit 2 + Svelte 5, Node 22 | Owner's stack |
| UI | Plain Tailwind v4 + `@tailwindcss/typography` — **no Skeleton** | Docs site is 95% prose; brand match achieved by porting SOC color tokens from `soc-dev/soc-theme.css` into `@theme` in app.css + same @fontsource fonts. Avoids Skeleton version churn |
| Adapter | `@sveltejs/adapter-static` (`strict: true`) | Everything public/prerenderable incl. llms.txt endpoints; strict mode fails the build if anything escapes prerender. Zero functions on Vercel |
| Markdown | Custom unified pipeline in `+page.server.ts` (remark-parse → remark-gfm → remark-rehype → rehype-slug → rehype-autolink-headings → custom TOC/figure steps → `@shikijs/rehype` → rehype-stringify), **not mdsvex** | Mirrors svelte.dev (custom renderer); content stays plain portable .md that feeds llms-full.txt directly; no markdown JS ships to client. mdsvex remains an escape hatch for interactive islands later |
| Frontmatter | `gray-matter`; schema: `title` (req), `description` (req), `status: stub\|draft\|complete` (default complete) | Loader validates; build error on missing keys or duplicate slugs |
| Code highlighting | shiki dual themes (github-light/github-dark, CSS-variable output) | Dark mode "just works" with class toggle |
| Mermaid | Client-side island: ```` ```mermaid ```` fences → `<pre class="mermaid" data-diagram>`; `Mermaid.svelte` dynamic-imports mermaid@11 only on pages containing diagrams; theme-aware, re-renders on navigate | Mermaid can't SSR; keeps base payload tiny. Needed for technical-guide architecture diagrams |
| Search | **Pagefind** — `"build": "vite build && pagefind --site build"`; lazy-loaded SearchModal (Cmd/Ctrl+K), dev-mode guard; `data-pagefind-meta="guide:…"` for grouping; stubs get `data-pagefind-ignore` | Indexes built HTML post-build, zero index code to maintain (simpler than svelte.dev's flexsearch) |
| Icons | `lucide-svelte` | Already used in soc-dev |
| Hosting | New Vercel project `socdocs`, output `build/` | Domain wiring deferred to Phase 3 (`socdocs.vercel.app` until then) |

## Design — repo scaffold

Local path: `/home/akeown/projects/javascript/bcycadata_git/socdocs` (sibling of soc-dev — needs
workspace access outside current working dirs during implementation).

Bootstrap: `npx sv create socdocs` (minimal, TS, prettier, eslint) → `npx sv add tailwindcss` →
add deps: `@sveltejs/adapter-static @tailwindcss/typography unified remark-parse remark-gfm
remark-rehype rehype-slug rehype-autolink-headings rehype-stringify @shikijs/rehype shiki
gray-matter unist-util-visit hastscript pagefind mermaid lucide-svelte`.

```text
socdocs/
├── .github/workflows/ci.yml          # npm ci → check → build → check:links on PR
├── svelte.config.js                  # adapter-static({ strict: true })
├── vite.config.ts                    # sveltekit() + tailwindcss(); server.fs.allow: ['content']
├── README.md                         # authoring guide (content convention, how to add a page)
├── content/docs/{user,admin,technical,project}/   # numbered markdown (IA below)
├── scripts/check-links.mjs           # walk build/**/*.html, verify internal href/src resolve
├── static/images/brand/SOCLogo*.png  # copied from socdocs-userguides/static/
├── static/images/docs/<guide>/<section>/*.webp    # screenshots, mirrors content tree
└── src/
    ├── app.html                      # inline theme-init script (no dark-mode FOUC)
    ├── app.css                       # tailwind + typography plugin + @custom-variant dark + SOC @theme tokens
    ├── lib/
    │   ├── guides.ts                 # registry of the 4 guides (slug/title/description/icon)
    │   ├── types.ts                  # Frontmatter, NavSection, NavPage, TocEntry, DocPage
    │   ├── server/content/index.ts   # loader: eager raw import.meta.glob('/content/docs/**/*.md'),
    │   │                             #   nav tree per guide, slug map, prev/next; module-cached;
    │   │                             #   throws on missing title/description, dup slug, section w/o index.md
    │   ├── server/content/markdown.ts# unified pipeline + shiki singleton + mermaid plugin + TOC extraction
    │   └── components/               # Header, Sidebar, MobileDrawer, OnThisPage, PrevNext,
    │                                 # ThemeToggle, SearchModal, GuideCard, StubBanner, Mermaid
    └── routes/
        ├── +layout.ts                # export const prerender = true
        ├── +layout.svelte  +page.svelte (landing)  +error.svelte
        ├── docs/[...path]/+page.server.ts   # resolve guide-landing|page; entries() = all paths
        ├── docs/[...path]/+page.svelte      # grid lg:[16rem_1fr_14rem]: Sidebar | prose article | OnThisPage
        ├── llms.txt/+server.ts       # prerendered index (guide → - [title](url): description)
        └── llms-full.txt/+server.ts  # prerendered concatenated raw markdown in nav order
```

**Content convention** (documented in socdocs README):

- `content/docs/<guide>/<NN-section>/<NN-page>.md`; `index.md` per guide + per section (title/description).
- `NN-` prefixes (steps of 10) order sidebar + prev/next; stripped from URLs:
  `user/10-getting-started/50-the-onboarding-survey.md` → `/docs/user/getting-started/the-onboarding-survey`.
- Images: `static/images/docs/<guide>/<section>/name.webp`, absolute refs, rehype adds lazy-loading + figure/figcaption; capture 2x, webp, ≤1600px.
- Internal links absolute; verified by `check:links` post-build.

## Skeleton IA (Phase 1 deliverable — every page a stub: frontmatter + 2-4 sentence "what goes here")

~103 files: 79 pages + 20 section index + 4 guide index.

**User Guide** (5 sections / 21 pages):

- `10-getting-started/`: what-is-soc, create-your-account, sign-in-and-out, reset-your-password, the-onboarding-survey (21-step wizard)
- `20-your-profile/`: profile-overview, about-me, settings, privacy-and-your-data
- `30-your-property/`: property-overview, assets, hazards, my-map (seed: largest help entry), resources
- `40-your-community/`: community-overview, events, information, community-map, workshops
- `50-faqs/`: account-faqs, data-and-privacy-faqs, general-faqs

**Administrator Guide** (6 sections / 24 pages):

- `10-introduction/`: roles-and-access (resident/coordinator/admin plain-language), the-admin-dashboard
- `20-kyng-coordinators/`: your-dashboard, area-map, unregistered-addresses, resident-admin
- `30-community-administration/`: overview, managing-events, managing-information, community-map, managing-workshops (write once generically — help map near-duplicates per community)
- `40-emergency-tools/`: reports (RFS property/street + PDF), service-map
- `50-site-administration/`: address-data, spatial-data, kyng-boundaries, messages, roles-and-permissions, profile-requirements
- `60-user-management/`: adding-users, kits, kyng-coordinator-assignment

**Technical Guide** (6 sections / 21 pages):

- `10-architecture/`: system-overview (mermaid stack diagram), repository-structure, environments-and-deployment
- `20-database/` (seed `docs/design/database.md`): schema-overview, row-level-security, migrations-workflow, generated-types
- `30-auth-and-sessions/` (seed auth-and-session.md, split): authentication-flow, authorization-and-permissions, session-lifetime (mermaid sequence)
- `40-gis-and-mapping/` (seed gis-mapping.md + kyng-boundary-editor.md): mapping-stack, spatial-data-pipeline, kyng-boundary-editor, geoscape-tiles
- `50-conventions/`: styling-conventions (port), in-app-help-system, quality-checks
- `60-documentation/`: writing-docs, screenshot-workflow

**Project Guide** (3 sections / 13 pages):

- `10-the-soc-project/`: history, grant-2021, grant-2022, project-team
- `20-project-components/`: overview, community-hub-burrell-creek, community-hub-mondrook, kyngs, digital-mapping, workshops
- `30-project-news/`: documentation-site-launch

## Implementation strategy (phases)

**Phase 0 — Scaffold + engine** (one PR-sized chunk)

1. Bootstrap repo + config (adapter-static strict, prerender=true, CI workflow).
2. Theming: app.css tokens from `soc-dev/soc-theme.css`, fonts, ThemeToggle, no-FOUC init.
3. Content loader (`src/lib/server/content/index.ts`) — the heart of the engine.
4. Markdown renderer (`markdown.ts`) — unified + shiki singleton (langs: bash, ts, js, svelte, html, css, json, yaml, sql) + mermaid fence plugin + TOC collection.
5. `docs/[...path]` route: `+page.server.ts` (resolution + `entries()`), `+page.svelte` (3-column layout, StubBanner, PrevNext, Mermaid island).
6. Sidebar + Header guide tabs + MobileDrawer (<lg breakpoint).
7. Landing `/` + guide landings.
8. Pagefind wiring + SearchModal.
9. llms.txt + llms-full.txt endpoints.
10. `scripts/check-links.mjs`.
11. New Vercel project `socdocs`, deploy immediately.
Seed with 3 sample pages (one code-fences, one mermaid, one images) to exercise the pipeline.

**Phase 1 — Skeleton IA**: create the ~103 files above; wire `guides.ts`; remove Phase 0 samples.

**Phase 2 — Content fill** (priority order):

1. Technical Guide §20-50 — near-free port of `docs/design/*` + diagrams. **Scrub pass required**: remove Supabase project ids, internal URLs, session-timeout specifics.
2. User Guide getting-started/profile/property — seed from `personal-profile-help.ts` + old userguides prose (skim before archival); screenshot workflow starts here.
3. Administrator Guide — seed `kyng-coordinator-help.ts` then `admin-help.ts`.
4. Project Guide — needs owner-supplied history/grant text; lowest urgency.
Definition of done per page: `status: complete` (prose finished and accurate), screenshots settled, check:links + check:status green. Prose and screenshots are tracked separately: the `screenshots` frontmatter field is `none` (page needs no captures — conceptual/technical/index pages), `pending` (captures needed, not yet taken), or `done` (captures embedded). A page is fully done when status is `complete` and screenshots is `done` or `none`; `complete`+`pending` is a valid interim state — finished prose is not demoted while the screenshot workflow catches up. `npm run check:status` reports the backlog and fails on inconsistencies.

**Phase 3 — Integration + decommission** (touches soc-dev):

1. Extend `HelpContent` type with optional `docsPath?: string`; populate the three help maps; render "Learn more →" link in `HelpPanel.svelte`; docs links in footer + `/about`. Use a `PUBLIC_DOCS_URL` env, not hardcoded.
2. Domain: attach chosen domain to Vercel project (open question: `docs.<main-domain>` vs keep socdocs.vercel.app; nothing in the build depends on it).
3. Archive the four old repos (`gh repo archive`) after salvaging SOCLogo assets + skimming old prose; delete their Vercel projects. **Confirm with user before archiving.**
4. Add docs link + llms.txt reference to soc-dev README/CLAUDE.md; "docs impact?" line in PR checklist.

## Verification

- **Phase 0**: `npm run check` + `npm run build` green; build emits `docs/<sample>/index.html`, `llms.txt`, `llms-full.txt`, `pagefind/pagefind.js`; strict prerender passes; preview: dark toggle no-FOUC, drawer at 375px, mermaid renders both themes, search finds sample; check-links exits 0.
- **Phase 1**: emitted `build/docs/**/index.html` count == content file count; every sidebar entry navigates; prev/next unbroken; llms.txt lists all pages; CI green.
- **Phase 2** (per PR): check:links; check:status (no violations; backlog only shrinks); no StubBanner on complete pages; screenshots legible in dark mode (figure border); pagefind finds new copy.
- **Phase 3**: HelpPanel "Learn more" opens correct docs page (spot-check 5 routes across 3 help maps); domain + `/llms.txt` return 200; old repos show archived badge.

## Risks / open questions

1. **Screenshots are the biggest ongoing cost.** Recommend a Playwright script in soc-dev (`scripts/docs-screenshots.ts`) signing into dev with a seeded demo account, capturing a named route list at 1440×900 into `socdocs/static/images/docs/`. Open: does a seeded demo resident/coordinator/admin exist in dev? Wizard shots need a fresh account per run. The capture backlog is the `screenshots: pending` pages listed by `npm run check:status` (38 at time of audit); flip each to `done` as its captures land.
2. **Docs drift** — route map is today's snapshot (fabric editor mid-build). Mitigations: PR-checklist line, `status` demotion to draft, periodic review.
3. **Two help-copy sources** (in-app maps vs docs) will diverge; Phase 3 links them; generating HelpPanel copy from docs is deliberately out of scope, flagged in technical/conventions page.
4. **Domain naming** — owner decision at Phase 3.
