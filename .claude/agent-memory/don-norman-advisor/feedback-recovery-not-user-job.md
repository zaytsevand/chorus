---
name: feedback-recovery-not-user-job
description: Prior chorus principle for LinkedInTools — recovery is not the user's job; monitoring is the user-protection layer
metadata:
  type: feedback
---

Recovery is not the user's job; monitoring is the user-protection layer.

**Why:** Established by a prior LinkedInTools chorus review. Reject "Retry" buttons, multi-state error messages, and user-facing recovery affordances. Observability + release-gate is load-bearing; UI error distinction is cosmetic.

**How to apply:** In HCD findings, distinguish an *informing* signal (legitimate — closes the action-perception loop) from a *recovery task pushed onto the user* (reject — monitoring should carry it). An operator-only log event satisfies the principle only if the user-visible state is honest about what happened; silence is not acceptable, but neither is a recovery chore.
