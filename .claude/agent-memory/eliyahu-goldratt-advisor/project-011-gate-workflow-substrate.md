---
name: project-011-gate-workflow-substrate
description: chorus-review feature 011 (native Workflow runner for the gate's Author/Vote/Tally + self-heal) — Gate A; constraint re-validated = chorus's own verdict throughput
metadata:
  type: project
---

Feature 011 "Gate Execution on a Native Workflow Substrate": a second execution substrate (Claude Workflow script) for the gate primitive's Author→Vote→Tally + the `cycle<3` self-heal loop. NOT a new gate definition (Principle I) — an alternative *runner* that MUST be tally-equivalent. Motivation: (1) honesty invariants (S1/S9) become structural — a script can't author/vote; (2) parallel fan-out vs serial hand-dispatch.

**Constraint location (Gate A, 2026-06-16) — re-validated, UNCHANGED from 004:** infra-only target (chorus reviewing itself). No market hypothesis → binding constraint = chorus's OWN throughput: verdict quality per round + gate cycle time. Same as [[project-chorus-exploratory-phase]]. Carried that record forward and re-confirmed against the live spec, not on faith.

**My Gate A findings:**
- F1 🟢 — spec DEFERS correctly: riskiest assumption (no-ultracode-mode prior negative verdict) named + fenced behind parity SC-001; wholesale replacement out of scope; operator-in-loop kept inline (FR-008), not degraded. Principle IX practiced.
- F2 🔴 — BATCH TOO BIG: FR-001–011 (11 FRs) built before SC-001 parity verdict returns. Probe needs only FR-001/002/003/004/009. Split: P1 parity slice ships+runs first; FR-006 fault-policy / FR-007 self-heal / FR-011 reconstruction gated behind PASSED SC-001. Same medicine as 004 F2/F4 — make the wrong bet cheap.
  - **CLEARED — self-heal re-verify cycle 1 (rev 2 spec, 2026-06-16):** spec now has explicit "Scope: two slices" (L36-49). Self-heal + extract short-circuit are OUT of the FR list entirely, parked only in "Deferred obligations — Slice 2" (L196-206) behind a PASSED SC-001. Deferral is STRUCTURAL not cosmetic: FR-011 (L189) makes Slice 1 read-only, so self-heal (which writes) cannot smuggle back in. Split lands on clean joint = read-only probe vs write-capable heal. CF-4/CF-11 parked, knowledge not lost. NOTE: my original minimal set (FR-001/002/003/004/009) was one cut too DEEP — the surplus (FR-004a/b, 007, 003a, 006/006a, 013/SC-007/008) is band-integrity + diagnosability the parity VERDICT depends on, correctly priced by other lenses. Conceded.
- F3 🟡 — NOT PRICED ON CONSTRAINT: every SC measures conformance (parity/honesty/determinism), NONE measures cycle-time or verdict-quality lift. Exact 004 trap recurring. Add one CD-facing criterion to P1: wall-clock / operator-minutes Workflow-vs-Agent on the SAME SC-001 run (nearly free — run produces both).
  - **STILL UNDISCHARGED (rev 2, 2026-06-16):** rev 2 added no throughput SC (still SC-001..009, all conformance — L223-248). Spec even concedes parallelism "buys modest wall-clock; load-bearing value is honesty" (L19-26). But SC-001 retires the prior NEGATIVE *adoption* verdict, which was about throughput — so the eventual adoption call is made blind on the very axis it turns on. Carry as standing 🟡 into Slice 2 / adoption decision; NOT a CF-5 blocker.
- F4 🟢 — FR-005 (no script author/vote = S1/S9) + FR-009 (no clock/RNG, args-passed time) are HARD invariants, NOT deferred (Principle IX counter-force). Stay in P1. Watch: SC-002 "0 paths by inspection" has no named conformance check (Beck/SC-008-pattern's catch).
- F5 🟡 — FR-007 self-heal-in-substrate = highest-cost/lowest-info, rides P2 story (US3). Substrate-fact risk: pipeline() null-drops a throwing item → a heal loop silently null-dropping its own re-verify is a WORSE lie than inline (Principle X). CD3 ranks it last. Cut from first buildout; heal inline as today; add after SC-001 passes.

**How to apply (future rounds):** (1) hold the line that SC-001 parity is the verdict that gates adoption — don't let the second slice merge before the probe runs; (2) push for the cycle-time/operator-minute measurement on the parity run — if fan-out doesn't shorten the loop and honesty is the only win, that's a legitimate verdict, just say it; (3) never defer FR-005/FR-009 — substrate-enforced honesty + determinism are on the constraint.

Related: [[project-chorus-exploratory-phase]], [[no-ultracode-mode]] (the prior negative verdict 011 must retire).
