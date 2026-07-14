---
title: Generated Types
description: Managing generated database types for application correctness.
status: complete
screenshots: none
---

Database types are generated from the live schema and committed for compile-time safety.
This ensures TypeScript catches schema drift early in development and CI.

## Why this matters

- Application code relies on generated table and RPC typings.
- New columns, enums, and function signatures should fail fast when code is outdated.
- Type generation makes schema changes visible in pull requests.

## Typical workflow

1. Apply or pull latest migrations in your working environment.
2. Regenerate database types from the target Supabase project.
3. Replace the checked-in generated types file.
4. Run check and build before opening a pull request.

## Example command pattern

Use your project scripts to generate types via the Supabase CLI and write them into the repository type file.

```bash
npx supabase gen types typescript --project-id "$SUPABASE_PROJECT_REF" > src/lib/db.types.ts
```

Prefer script wrappers in package scripts for consistency across contributors.

## Guardrails

- Do not hand-edit generated type files.
- Regenerate after any migration that changes tables, enums, views, or RPC signatures.
- Keep generation target explicit so dev/staging/prod confusion is avoided.
- Fail CI if type generation output is stale relative to migrations.

## Drift indicators

- Type errors in query selections after schema changes.
- Missing enum variants in application unions.
- RPC call signatures mismatching generated function types.

## Related pages

- [Migrations Workflow](/docs/technical/database/migrations-workflow)
- [Authorization and Permissions](/docs/technical/auth-and-sessions/authorization-and-permissions)
