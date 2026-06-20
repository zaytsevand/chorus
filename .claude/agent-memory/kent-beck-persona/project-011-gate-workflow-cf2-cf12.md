---
name: project-011-gate-workflow-cf2-cf12
description: Spec 011 Gate A self-heal cycle 1 — CF-2 and CF-12 both cleared on rev 2; SC-009 left as a non-blocking falsifiability gap
metadata:
  type: project
---

Spec 011 (Gate Execution on Workflow substrate), Gate A self-heal re-verify cycle 1, verified 2026-06-16.

CF-2 (SC-001 parity unfalsifiable) — CLEARED. SC-001 now measures pure `band(frozen {findings,votes})` against the canon band table; "or author-variance" escape hatch removed and named-as-removed (spec.md:228). Author-stage non-determinism separated out as plumbing/US1, not parity (line 229). Falsifiable because band is pure code over frozen data, no clock/RNG (FR-010 line 186).

CF-12 (S8 by inspection) — CLEARED. FR-003a (spec.md:152-154) ships pure-code-over-data unit assertion "no finding on its author's ballot"; SC-002 requires it to pass by test not inspection.

**Why:** the distinguishing principle — S8 is a runtime routing property of data the script produces, so it needs a runtime assertion; S1/S9 are a static substrate-capability property (a Workflow script can only run JS + dispatch agent(), structurally cannot author/vote), so S1/S9-by-inspection in SC-002 line 231 is defensible where S8-by-inspection was not.

**How to apply:** if cycle 2 reopens, both are settled; do not re-litigate.

OPEN non-blocking 🟡: SC-009 (reconstructable ledger, spec.md:247-248) names no falsification — "rebuildable... only formatting" has no named red, unlike the other 8 SCs. FR-012 (line 190) gives it a testable spine. Same species of gap CF-12 just fixed for S8, one criterion over. Held as observation, not gate — out of original CF scope, P-low vs the parity experiment.
