---
name: project-feature011-gateA-vote
description: Feature 011 (gate-on-Workflow-substrate) Gate A ARCH vote — fault-path underspecification is the spine; CF-10 split as compliant
metadata:
  type: project
---

Feature 011: a JS Claude **Workflow** runner as a *second execution substrate* for the gate primitive's Author→Vote→Tally(+Extract pre-pass, +self-heal cycle<3). Hybrid: orchestrator scouts inline, invokes runner for fan-out, resumes inline for operator bands. SC-001 parity is the riskiest-assumption experiment that must retire the standing "ultra/orchestration strictly negative" prior before adoption.

**My Gate A vote (authored CF-1/2/9/11, skipped per S8):**
- PRIORITIZE CF-3 (null escalation/self-heal outcome has no fail-closed rule → silently-passed 🔴 = Principle VII "clean artifact hides skipped gate" lie)
- PRIORITIZE CF-4 (self-heal mutates the cited artefact, re-verify judges new text, trail stores band-not-diff → 🔴 cleared by erasing its own evidence = integrity defect, worse than quality-🔴)
- CONFIRM CF-5,6,7,8,12,14,15,16
- OVER-RATE CF-10 (net=P−O + fixed thresholds is the mechanical 🟢 case under Principle VI, NOT orchestrator inference; a deterministic computed band is compliant)

**Architecture spine:** the feature's risk is not the fan-out — it's that every *non-positive* terminal path (null escalation, evidence-mutating self-heal, hung barrier w/ no early-cancel, transcript collapsed to conclusions-struct) is underspecified. Those are the distributed-workflow failure modes that turn "structural honesty" into a clean-looking lie.

**Verified against runtime (constitution.md):**
- CF-8 TRUE verbatim: constitution:296-298 "Markdown-only, no runtime code… A feature that proposes runtime code is out of shape." Spec's canon check (spec:47-58) audits gate/decision canon but never reconciles this collision. Still 🟡 because spec openly calls JS a "second substrate" (spec:12) — frame gap, not build-stop.
- CF-10 refuted: Principle VI (:182-199) = band from declared catalog predicate, mechanical = 🟢; "never from orchestrator INFERENCE." Computing a fixed threshold is not inference. FR-004 forbids orchestrator re-tally — so re-deriving is CF-16's consistency check, NOT a band re-assignment.

Spec is 228 lines, Status Draft. Files: specs/011-gate-workflow-execution/spec.md; .specify/memory/constitution.md (VI/VII :182-210, Authoring Constraints :296-298).
