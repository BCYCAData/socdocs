---
title: Roles and Access
description: Plain-language summary of resident, coordinator, and admin roles.
status: complete
---

SOC uses role-based access so users only see routes and actions relevant to their responsibilities.
Understanding role scope helps prevent permission confusion and support escalation delays.

## Role summary

- resident: manages own profile, property, and community-facing resident pages
- KYNG coordinator: supports assigned KYNG areas and coordinator operations
- administrator: manages platform-wide community, site, emergency, and user-management workflows

## Access behavior

- protected routes require sign-in
- admin and coordinator routes require matching permission scope
- users without permission should receive a clear denied state instead of partial access

## Practical examples

- resident users cannot access admin route families
- coordinators can only access assigned KYNG areas
- admin users may have full or feature-specific permissions depending on role mapping

## Operational guidance

- verify role assignment before troubleshooting missing UI options
- after role updates, have users sign out/in to refresh claims
- use least-privilege assignments wherever possible

## Related pages

- The admin dashboard: /docs/admin/introduction/the-admin-dashboard
- KYNG coordinators: /docs/admin/kyng-coordinators
- Site administration: /docs/admin/site-administration

