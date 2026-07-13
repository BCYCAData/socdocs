---
title: KYNG Boundaries
description: Manage KYNG boundary definitions and updates.
status: complete
---

KYNG Boundaries administration manages area definitions used for coordinator scope and map operations.
Boundary updates should follow controlled edit-session workflows with validation gates.

## Boundary update workflow

1. Start an approved edit session.
2. Propose boundary adjustments.
3. Run validation checks and review candidate diffs.
4. Promote only after quality and scope checks pass.

## Key safeguards

- preserve coverage consistency across neighboring areas
- prevent empty or invalid area outcomes
- verify downstream assignment effects before final promote

## Post-update checks

- coordinator scope and map views remain consistent
- affected property mapping context updates as expected
- border review queues are inspected

## Related pages

- Spatial data: /docs/admin/site-administration/spatial-data
- Roles and permissions: /docs/admin/site-administration/roles-and-permissions

