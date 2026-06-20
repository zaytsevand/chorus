---
name: project-chorus-011-gate-workflow
description: Feature 011 (gate execution on native Workflow substrate) Gate A self-heal cycle 1 — CF-6/CF-7 verdicts and Slice-1 operability
metadata:
  type: project
---

Feature 011 = a second executor for the chorus gate primitive (extract→author→vote→tally): a native Claude Workflow runner that fans out Author+Vote and tallies in code. Honesty invariants (S1/S8/S9) become structural because a script can't author/vote. Slice 1 = parity-experiment only, WRITES NO FILES/edits no artefacts (FR-011); risky self-heal + extract short-circuit deferred to Slice 2 behind a passed SC-001.

**Gate A self-heal cycle 1 (2026-06-16): my two findings CLEARED.**
- CF-6 (diagnosability regression — structured return loses per-agent deliberation): CLEARED by FR-013 + SC-008 — resolvable per-agent transcript handle/run-id on every finding AND vote, carried in the finding-centric return (FR-008). Divergence traces to the author, not just detected.
- CF-7 (barrier latency unbounded; hung author holds fan-out hostage; non-interruptible): CLEARED by FR-006a — per-stage timeout → recorded `stage-timeout` naming the unresponsive agent. Honestly acknowledges run is non-interruptible mid-flight; timeout is the substitute bound. SC-004 asserts via injected hang.

Fault policy now honestly split + CI-assertable: FR-006 isolate (null-gap recorded, quorum floor ≥3 surviving authors, else `quorum-failed`) / FR-006a timeout / FR-007 fail-closed (null band → gating, never released). SC-003/004/007 cover them with injected faults.

**Why:** these were 2 of 9 gating 🔴 from Gate A rev 1; spec revised to rev 2 incorporating all 9.

**How to apply:** open residue (sub-gating, for tasks.md not spec): FR-006a mandates a per-stage timeout but pins NO value. Pin the timeout value + its owner/tuning knob in tasks.md (sensible default single-digit minutes via args) so the bound is concrete not aspirational. Conformance fixture FR-004a runs on every change to runner OR primitive — earned because spec 009 proved the primitive moves [[project-chorus-exploratory-phase]].
