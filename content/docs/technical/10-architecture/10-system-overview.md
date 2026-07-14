---
title: System Overview
description: High-level structure of SOC platform components.
status: draft
screenshots: none
---

The SOC platform consists of a web client, static documentation site, and managed backend services.

```mermaid
flowchart LR
  user[Resident or Admin Browser] --> app[SOC App: SvelteKit]
  app --> db[(Supabase Postgres)]
  app --> docs[SOC Docs: Static SvelteKit]
  docs --> search[Pagefind Index]
```

## Why this matters

This architecture keeps the docs site fully static while preserving a clear bridge to in-app help.
