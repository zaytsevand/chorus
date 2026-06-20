---
name: project-feature010-gate-vote
description: Feature 010 (cycle-end memory update phase) chorus VOTE stage — arch lens cross-votes on other lenses' findings; no-runtime design-stage bar
metadata:
  type: project
---

Feature 010 = cycle-end memory update phase: write-side bookend of the two-tier memory (read-side = spec 004 exploratory phase). Fires once per lifecycle at sign-off; per-lens autonomous write to `~/.claude/agent-memory/<persona>/`, project-wide facts surfaced as single operator accept/reject diff to `docs/reviews/CHORUS-PROJECT.md`. NO RUNTIME (spec.md:311) — Markdown/prompt-orchestration; `quickstart.md` worked examples are the conformance surface.

**Why:** Stage 3 VOTE cross-vote (chorus gate). Bar = design-stage, no runtime; ranking sourced from spec's own constitution check: evolvability/canon-integrity > security (secret boundary absolute) > simplicity > operability.

**How to apply:** On any future 010 cycle or related two-tier-memory work, reuse these runtime-grounded facts rather than re-deriving:
- Spec 004 (read-side) is itself still **Draft** as of 2026-06-12; FR-004/FR-010 depend on its unratified fingerprint/locator schema. `EXPLORATORY-PHASE.md` lives at `skill/chorus/`, wired into `SDLC-LAYER.md:107,184` as prompt-orchestration (not executed code).
- Persona memory dir is `~/.claude/agent-memory/<persona>/` — OUTSIDE the repo tree. Repo `.gitignore` (only `.memsearch/`) was never its control surface.
- Spec already ran a prior 5-lens chorus and resolved 4 reds + TOC-3/DDD-2 (spec.md:71-104). Several voted findings are re-raises of closed items — check the spec's resolution text before rating.

**My votes:** PRIORITIZE SEC-1 (no runtime ⇒ "mechanical pre-filter" is persona self-attestation; rename + don't over-trust the guarantee), PRIORITIZE TOC-2 (read-side never exercised by a real round-trip; 004 still Draft; one manual two-cycle run is the cheapest fitness function — adopted the closer-to-runtime lens over my own "contract-sound" static read). CONFIRM SEC-2/4, TOC-3, COOP-2, clean bills. OVER-RATE SEC-6 (wrong control surface), DDD-2 (re-coins the vocabulary 004's prior Evans pass closed — regresses ubiquitous language), COOP-3 (out-of-band review surface unearned at solo-operator/simplicity ranking).

**Most-PRIORITIZE = TOC-2** (cheapest FF for whole memory bet; SC-006 should become a performed not authored conformance run). **Most-OVER-RATE = DDD-2.**
ADR worth writing: "secret boundary is persona-applied discipline, not mechanical enforcement, because skill has no runtime" — records SEC-1 trade-off.
