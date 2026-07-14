---
title: Session Lifetime
description: Session duration, refresh behavior, and timeout handling.
status: complete
---

SOC applies role-tiered session controls using two windows: idle timeout and absolute lifetime.
The effective deadline is the earlier of those windows for the current role tier.

## Design goals

- Reduce walk-up risk when a signed-in device is left unattended.
- Keep resident UX practical while tightening coordinator and admin sessions.
- Enforce server-side so browser-side bypass is not possible.

## Enforcement architecture

- Shared policy module defines role-tier windows.
- Server hook enforces timeout boundaries and clears session state on breach.
- Client warning component provides countdown UX and keep-alive behavior.
- Tracking cookies record session start and last activity for evaluation.

## Timeout behavior

- Idle timeout is sliding and extends with activity.
- Absolute lifetime is fixed from session start and cannot be extended.
- Breach of either window ends the session and redirects to sign-in with reason context.

## Operational notes

- Keep timeout values in one constants module to avoid client/server drift.
- Expose policy values to UI for accurate warnings only; server remains source of truth.
- Ensure sign-out paths clear timeout tracking cookies to prevent stale state.

## Testing guidance

- Provide short-lived override values in non-production environments for verification.
- Validate cross-tab behavior for warning visibility and activity synchronization.
- Test explicit reasons for idle expiry, absolute expiry, and refresh failure flows.

## Security tradeoffs

- Timeouts mitigate unattended-session misuse, not all remote threats.
- Maintain refresh-token rotation, secure cookies, and XSS controls as primary remote defenses.
- Prefer balanced values by role rather than one global timeout.

## Related pages

- [Authentication Flow](/docs/technical/auth-and-sessions/authentication-flow)
- [Authorization and Permissions](/docs/technical/auth-and-sessions/authorization-and-permissions)
