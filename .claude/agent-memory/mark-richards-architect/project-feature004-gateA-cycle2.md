---
name: project-feature004-gateA-cycle2
description: Feature 004 Gate A cycle-2 incorporation verdict — F14/F12 cleared; fingerprint underspecified but acceptable; one new evolvability NIT on coverage-check scope
metadata:
  type: project
---

Feature 004 (advisor exploratory phase) Gate A cycle 2 — incorporation verification of my two cycle-1 gating reds.

**F14 (no executable fitness function) → RESOLVED.** FR-022 + SC-010 + data-model.md "Fitness function (profile coverage)" + exploratory-phase.md step 8 + understanding-record.md fixed section headers (Referenced/Inferred/Operator-confirmed/Cached/Open gaps) make it genuinely grep-able: every profile item must resolve to a tagged record entry, pass/fail per advisor. Not a renamed prose SC — the record schema pins the fields the check reads.

**F12 (one-directional staleness / silent stale refs) → RESOLVED.** FR-012 (reconciliation path) + FR-023 + Source reference entity now carries a `freshness` fingerprint (last-modified/commit marker or content digest), fresh→stale→revalidated transition, addendum-wins. Mechanism is concrete enough to compare.

**Why:** This was my cycle-1 halt. Both reds genuinely closed against revised artefacts, not prose.

**How to apply:** If feature 004 work resumes, my lens is CLEARED at Gate A. Remaining watch-items are non-gating:
- Fingerprint granularity left to planning (commit-hash vs mtime vs digest) — acceptable to defer but the *choice* changes false-stale rate; flag if planning skips it.
- NIT (evolvability): coverage check (step 8) is orchestrator-run per round, not a standing CI fitness function — it decays if the orchestrator step is ever skipped. A grep-based arch-test over agent-memory record headers would make it survive its author. Suggested, not required.
- No NEW coupling/consistency regression from FR-023 cache model: weak/eventual consistency with single write-direction (operator-accepted, scope-tagged) keeps the addendum authoritative; cache is read-locality only.
