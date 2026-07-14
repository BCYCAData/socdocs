---
title: In-App Help System
description: How contextual help content is structured and maintained in SOC.
status: complete
screenshots: none
---

SOC includes a route-contextual help panel driven by structured help-content maps.
Help content is keyed by normalized route paths and rendered through a shared panel component.

## Architecture overview

- Help content lives in role/domain-specific map files.
- A utility layer resolves current path to matching help content.
- A store publishes the resolved help payload to the UI.
- The help panel renders sections, emphasis states, and collapse behavior.

## Content model

Typical help entries include:

- hasHelp flag
- title
- one or more sections
- optional importance markers for warning or tip emphasis

This allows lightweight contextual guidance without requiring a full docs page for every route.

## Route resolution behavior

- Paths are normalized before map lookup.
- Dynamic route segments are matched through patterned keys.
- Unmatched routes return a no-help fallback state.

## Authoring guidelines

- Keep panel content concise and action-oriented.
- Prefer task guidance over long explanatory prose.
- Use one clear warning at most when risk is high.
- Keep terminology aligned with on-screen labels.

## Relationship to docs site

The help panel should be a quick, in-context assistant.
The docs site should be the durable source for full workflows, policy details, and screenshots.

Planned integration pattern:

- add optional docs path metadata to help entries
- render a Learn more deep link when docs path is available
- keep docs base URL configurable via environment variable

## Maintenance workflow

- Update help maps alongside route behavior changes.
- Review for stale route keys after navigation refactors.
- Spot-check collapsed and expanded panel behavior on desktop and smaller widths.

## Related pages

- [Writing Docs](/docs/technical/documentation/writing-docs)
- [Quality Checks](/docs/technical/conventions/quality-checks)
