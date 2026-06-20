---
name: project-feature011-gateA-selfheal-cycle1
description: Feature 011 (gate on Workflow substrate) Gate A self-heal cycle 1 re-verify of band-integrity cluster I co-authored — CF-1/CF-16/CF-9 all CLEAR
metadata:
  type: project
---

Feature 011 = native Claude Workflow runner as a SECOND executor for the gate primitive's Author→Vote→Tally (not a new gate definition). Honesty invariants S1/S9 become STRUCTURAL because a Workflow script only runs JS + dispatches agent()s — cannot author/vote. Slice 1 only (parity experiment); self-heal + extract short-circuit deferred to Slice 2 (CF-4/CF-11 parked as obligations).

Spec: specs/011-gate-workflow-execution/spec.md (rev 2, 9 🔴 incorporated).

Band-integrity cluster I co-authored — self-heal cycle 1 verdicts:
- CF-1 CLEAR: FR-004a (spec:158-161) = thresholds as CITED DATA not transcribed literals + frozen-vote conformance fixture in CI on every change to runner OR primitive (bidirectional trigger is load-bearing); spec-009 drift precedent cited.
- CF-16 CLEAR: FR-004b (spec:163-165) + SC-007 = orchestrator re-derives band from returned votes[] and asserts == runner's claim before persist. KEY: correctly distinguished from FR-004-forbidden re-tally — audit (recompute+compare) vs authority (override=S1 leak). Distinction drawn precisely, not fudged.
- CF-9 CLEAR: FR-008 (spec:179-183) = finding-centric return (each finding owns votes[]/tally/band/evidence/pull_quote/transcript handle), NOT five parallel arrays; names re-correlation as the S1 leak it forecloses. Aggregate-root model.
- R-F1 CLEAR: ranking explicit+sourced (spec:28-34): dev tooling, single operator, no SLA → (1) decision-integrity (2) honesty-by-construction (3) operability/diagnosability (4) evolvability; parallelism subordinated. Correct BAR (dev tool not prod service).

NEW residual (bounded 🟢 frame note, NOT gating, did NOT reopen cluster): FR-004b makes ORCHESTRATOR re-derive band, but spec is silent on where the orchestrator's band RULE comes from. FR-004a binds the RUNNER's thresholds to cited canon; the auditor's copy could reintroduce the CF-1 second-copy one layer up. Cheapest close = one clause on FR-004b: "re-derivation reads the same cited canon thresholds as FR-004a, never a transcribed copy." Keeps single-source invariant across executor AND auditor.

No S1/S9 leak back to discipline: FR-005 structural, FR-003a executable S8 assertion (CF-12), FR-008 parenthetical forecloses re-correlation. Honesty carried by substrate+tests, not reviewer inspection — the point of the feature.
