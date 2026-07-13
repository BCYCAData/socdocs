---
title: Styling Conventions
description: UI styling standards, token usage, and consistency rules.
status: complete
---

SOC styling conventions prioritize semantic tokens, reusable presets, and predictable dark-mode behavior.
Treat design tokens as the default language for UI styling and avoid ad-hoc visual values.

## Core principles

- Prefer semantic color tokens over raw palette classes.
- Prefer shared component presets over repeated utility bundles.
- Keep style intent obvious at the call site.
- Keep dark-mode behavior explicit and testable.

## Token-first color usage

Use semantic token families such as primary, secondary, tertiary, success, warning, error, and surface.
Avoid one-off raw color classes for product UI states.

For filled controls, ensure readable contrast text is applied by preset conventions rather than manual per-button choices.

## Reusable component presets

- Use shared preset classes for repeat patterns such as nav links, chips, and button styles.
- Add new presets in one place and consume them across components.
- Keep bespoke CSS for true exceptions only.

## Dark mode conventions

- Use the project dark-mode strategy consistently.
- Avoid mixing multiple dark-mode approaches in the same component.
- Verify that each token pairing has generated output and is visually legible.

## CSS and utility boundaries

- Prefer utility classes and tokenized presets for common UI.
- Use component-scoped style blocks when structural CSS is clearer than utility composition.
- Avoid using important flags to override framework defaults unless there is no viable layered alternative.

## What to avoid

- Hardcoded hex values in regular component markup.
- Legacy utility patterns removed by current tooling versions.
- Repeated long class strings where a named preset should exist.

## Verification

- Run formatting and lint checks before merge.
- Spot-check both light and dark theme rendering for changed components.
- Validate responsive behavior at key breakpoints.

## Related pages

- Documentation authoring and consistency: /docs/technical/documentation/writing-docs
- Validation expectations and gates: /docs/technical/conventions/quality-checks
