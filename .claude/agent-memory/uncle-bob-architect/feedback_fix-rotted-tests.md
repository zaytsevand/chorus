---
name: fix-rotted-tests
description: User prefers refreshing stale/rotted tests to current spec behavior as part of the work, not working around them
metadata:
  type: feedback
---

When a refactor surfaces stale tests (asserting superseded behavior), the user
prefers to REFRESH them to the current, spec-backed contract so the suite goes
fully green — rather than route around them or leave them known-red.

**Why:** Confirmed on a views.py refactor: given the choice between "treat 5 rotted
integration tests as known-red" vs "refresh them to current behavior," the user
chose to refresh. Wants the suite to actually mean something.

**How to apply:** When refreshing a stale test, assert the behavior the code
*should* have per spec/companion unit tests — not whatever it happens to emit
(don't rubber-stamp). Preserve the test's original INTENT where possible (fix the
setup so the intended path runs) instead of weakening assertions. Keep the
test-refresh as a clearly separate commit from any pure-move refactor, and flag any
latent design smell the rot exposed. See [[differential-baseline]].
