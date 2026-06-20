---
name: feedback-fail-loud-guard-placement-and-message
description: A fail-loudly guard for a missing dependency must fire from the sibling/caller side (not the missing module's own entry point) AND its message must close the gulf of evaluation
metadata:
  type: feedback
---

A "fail loudly" guard for a missing dependency has two independent requirements, both of which I check:

1. **Placement** — the guard must live where it can still fire when the dependency is absent. A guard inside the missing module's own entry point cannot run if that module never loads; it must be sibling-side (the caller/composer self-asserts the dependency is reachable). A guard that can't execute in the failure it guards against is no guard at all.

2. **Message content** — "fail loudly" names the DECISION (stop, don't degrade silently), not the message. The emitted text must close the gulf of evaluation: (a) name what is missing, (b) state what its absence means (e.g. "broken/partial install"), (c) give a recovery action. A bare "fail loudly" is a terminal state the user can't tell from a slip — the loud-fail must gate an actionable block, not become it.

**Why:** the action-perception loop requires perception; a guard that fails silently (wrong placement) or fails uninformatively (bad message) leaves the operator unable to form an accurate mental model of why they're stuck. Both are feedback failures, not stylistic preferences.

**How to apply:** when reviewing any "must fail loudly if X missing" requirement — for a missing skill, module, service, config, or env var — verify both axes separately. Grounded this run at: skill/chorus-review/SKILL.md + skill/chorus-sdlc/SKILL.md (sibling-side substrate guard), specs/014-chorus-suite-decomposition/spec.md FR-002a, tests/parity/live-behavioral-proof.md (the emit-on-missing assertion). Residual watch: prose-instruction guards often lack a runtime test pinning that the message actually emits — unasserted behaviour. See project record [[project-014-substrate-guard-gatec]] and tension with [[feedback-recovery-not-user-job]] (loud-fail is correct only where no monitoring layer sits between operator and the broken state).
