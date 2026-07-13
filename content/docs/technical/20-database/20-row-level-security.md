---
title: Row-Level Security
description: Access control model enforced in Postgres policies.
status: complete
---

SOC uses row-level security (RLS) as the final authorization boundary.
Application checks improve UX and fail fast, but database policy is the source of truth.

## Security model

- JWT claims are generated at sign-in and refreshed during session lifecycle.
- Policies read claims with auth.jwt() and decide row visibility and write eligibility.
- Unknown access defaults to deny.

## Common claim fields

- user_role: high-level role tier (for example resident, coordinator, admin).
- property_ids: properties the user can access.
- community_slugs: communities the user belongs to.
- permissions: granted permission strings from role mappings.

## Policy patterns

### User-owned rows

Users can read and update only their own profile rows by comparing row user id to auth.uid().

### Property-scoped data

Rows are visible when property_id appears in the JWT property_ids array.
This pattern is used for property records and related spatial features.

### Community-scoped data

Community profile rows are filtered by role and community membership claims.
Admin can view broad sets, coordinator is constrained to assigned communities.

### Permission-scoped admin operations

Sensitive operations validate explicit permission claims inside policy predicates.
RLS checks exact permission strings; hierarchy expansion is handled in application logic.

## Debugging checklist

1. Confirm claims are present in token payload for the test user.
2. Verify the expected row key exists (property_id, community, owner id).
3. Re-run the query with a fresh session if role or property assignments changed.
4. Inspect policy definitions for exact-string permission checks.
5. Validate that table RLS is enabled and no permissive legacy policy remains.

## Common failure modes

- User assignment changed but token still has stale claims.
- Policy expects an exact permission string that differs from app-side hierarchy assumptions.
- Geometry row linked to a property outside claim scope.

## Operational guidance

- Keep policy logic explicit and narrow.
- Prefer claim-driven checks over broad role-only conditions.
- Treat policy changes as production-grade security changes: review, test, and deploy with migrations.
