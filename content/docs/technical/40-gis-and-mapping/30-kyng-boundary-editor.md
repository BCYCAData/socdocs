---
title: KYNG Boundary Editor
description: Editing workflow and constraints for KYNG boundary management.
status: complete
---

The KYNG boundary editor uses a fabric-assignment model rather than freehand polygon editing.
Editors reassign cadastral fabric polygons between neighboring KYNG areas, then boundaries are re-derived from assignments.

## Why this model

- Structural no-overlap: each fabric face belongs to exactly one KYNG.
- Shared edges remain topologically consistent by construction.
- Boundaries survive source refreshes because assignments are persisted.

## Data model

- cadastre_fabric_src: harvested source primitives.
- cadastre_fabric: noded, polygonized coverage faces.
- kyng_fabric_assignment: canonical face-to-KYNG assignment.
- kyng_edit_session: lifecycle for draft/validate/promote flow.
- kyng_fabric_assignment_candidate: session-scoped candidate moves.

## Edit workflow

1. Start an edit session for target KYNG areas.
2. Draw one or more control lines using snapped polyline editing.
3. Propose candidate assignments from line-derived regions.
4. Review preview diff (moved faces, affected properties, warnings).
5. Validate and promote to canonical assignment.

## Validation gates

- Coverage integrity in affected extent (no unintentional holes).
- Boundary consistency with neighboring areas.
- Property/address reassignment sanity checks.
- Empty-area blocking gate to prevent invalid promote outcomes.

## Permission and security

- Editing is an admin capability gated by dedicated permission.
- Session and mutation RPCs are security-definer functions with in-body permission checks.
- RLS remains enabled on editor tables for defense in depth.

## Promote effects

- Canonical KYNG geometry is re-derived from assignments.
- Affected property-to-KYNG relationships are recomputed for consistency.
- Candidate session data is finalized and draft state cleared.

## Operational notes

- Monthly fabric refresh can be skipped while an active edit session exists.
- Border review queues should be checked after refreshes and promotions.
- Keep geometry editing constrained to assignment changes, not ad-hoc shape drawing.

## Related pages

- Mapping architecture: /docs/technical/gis-and-mapping/mapping-stack
- Source-data lifecycle and refresh model: /docs/technical/gis-and-mapping/spatial-data-pipeline
