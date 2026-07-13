---
title: Migrations Workflow
description: Safe process for creating, reviewing, and applying schema changes.
status: complete
---

SOC follows a forward-only migration workflow.
Schema changes are tracked in SQL migration files and replayed by CI and deployment pipelines.

## Principles

- Forward-only: never rewrite already-applied migrations.
- Deterministic: migrations must run cleanly on fresh databases and existing environments.
- Auditable: migration intent and risk should be clear in reviews.

## Authoring workflow

1. Create a new migration file with a timestamped name.
2. Add DDL and required data-shape adjustments for compatibility.
3. Keep changes small and composable when possible.
4. Run local checks and validate affected paths.

## Review checklist

- Does the migration preserve existing data semantics?
- Are indexes and constraints updated for new query paths?
- Are RLS policies included for new tables or views?
- Are default values and nullability changes safe for live data?
- Is there a clear rollback strategy if deployment must be halted?

## Deployment expectations

- CI replays the migration line as part of quality gates.
- Production applies new migrations in order only.
- Failures are handled by shipping a corrective migration rather than editing historical files.

## Rollback and incident response

- Avoid destructive down-migration assumptions on production data.
- Prefer fix-forward migrations with explicit data repair steps.
- For high-risk changes, stage rollout with verification queries and post-deploy checks.

## Related pages

- Schema model context: /docs/technical/database/schema-overview
- Type synchronization after schema change: /docs/technical/database/generated-types
