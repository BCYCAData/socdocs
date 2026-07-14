---
title: Authorization and Permissions
description: Role-based access model for residents, coordinators, and admins.
status: complete
screenshots: none
---

Authorization in SOC is defense-in-depth: route guards, action checks, and database RLS all participate.
Each layer can deny access independently, with RLS as the final boundary.

## Role tiers

- Resident: access to own profile and property-scoped features.
- KYNG coordinator: broader visibility for assigned area operations.
- Admin: site, community, emergency, and user-management operations by permission.

## Permission model

Permissions use dot-notation namespaces (for example admin.site.messages).
Application checks support hierarchical matching, while RLS policy checks exact strings.

## Enforcement layers

1. Layout route guards enforce route-level entry rules.
2. Server actions validate operation-level permissions.
3. UI filtering hides controls not granted for the current user.
4. RLS policies enforce row-level access in database queries.

## Protected route families

- personal-profile paths require authenticated user scope.
- kyng-coordinator paths require coordinator scope and area validation.
- admin paths require admin-level permission sets, often feature-specific.

## Practical guidance

- Treat route guards as UX and fast-fail controls, not sole security.
- Keep permission naming consistent and composable.
- Add or update RLS policies when introducing new privileged data paths.
- Include permission tests for both allow and deny paths.

## Common mistakes

- Granting parent-like permissions without matching app hierarchy logic.
- Assuming UI hiding alone is sufficient for security.
- Forgetting to refresh claims after role or property assignment changes.

## Related pages

- [Authentication Flow](/docs/technical/auth-and-sessions/authentication-flow)
- [Row-Level Security](/docs/technical/database/row-level-security)
