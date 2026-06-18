# Phase 1 — Data model: premise-pass entities

This is a markdown methodology feature; "entities" are the **prose constructs** the canon edit introduces and the attributes they carry. No runtime types, no storage.

## Entities

### Premise
The spec's frame, distinct from its *design*. Four elements the pass attacks:
- **stated problem** — what the spec claims is wrong;
- **necessity-now** — why it must be solved now (vs deferred);
- **framing/approach** — the chosen cut of the problem;
- **load-bearing assumptions** — claims the design rests on.

### Premise pass
The adversarial pass at the front of Gate A (and the standalone `challenge` mode). Inputs: the spec/target + the seated panel + the red-team checklist. Runs the gate primitive's author→vote→tally over **premise-scoped** findings, then records an honest-null if the premise survives.

### Finding (scope attribute — the new field)
Reuses the existing Gate-A finding register. **New attribute: `scope ∈ { premise, within-frame }`.**
- **declared by** the authoring persona;
- **confirmed by** the non-author vote (S8/S9) — same authority as severity;
- a `within-frame` finding is **parked** (routed to Gate A's within-frame review), not counted as premise divergence.

Each premise finding MUST carry ≥1 of: a steelman-for-not-building, a reframe, a root-cause doubt, or a named unvalidated assumption + cheapest test (FR-003).

### Red-team checklist (fixed, author-independent)
A prior-free question set applied every premise pass; each item's outcome recorded. The §4d divergence floor beneath same-model persona attacks. **Canonical content (finalized):**

| # | Item | What it surfaces |
|---|------|------------------|
| RT-1 | Is the problem **observed or forecast**? | premises built on speculation, not evidence |
| RT-2 | **Symptom or root cause**? | a fix aimed at a symptom of a deeper cause |
| RT-3 | Does the feature **manufacture its own need**? | self-justifying scope |
| RT-4 | What is the **cheapest experiment** that settles this instead of building? | inventory-ahead-of-evidence (the deferral cut) |
| RT-5 | Who is **harmed if we do nothing** — is that harm evidenced? | absent/weak cost-of-inaction |
| RT-6 | Is the premise **falsifiable** — what would prove it wrong? | unfalsifiable framing |

The list is fixed prose in `SDLC-LAYER.md` (not model-generated — that would share the panel's priors). Items are *questions answered*, not a classifier (distinct from the F6 regex).

### Honest-null
The substantive record when the premise survives. MUST contain: each attempted attack tied to a **lens + a steelman/reframe/doubt** (same evidence shape as a real finding) **and** the RT-1..RT-6 outcomes. A pass in which the panel did not genuinely attack the premise is a **failed pass**, re-run — bounded at **N = 3** then escalate (research D5). A bare/boilerplate `sound` fails (SC-004).

### Premise outcome
**Not a new entity** — it is the **existing gate tally** (`GATE-PRIMITIVE.md` Stage 4) over premise-tagged findings. A premise finding that tallies to 🔴 is a **premise-level block**: operator-owned, self-unblocking (`DECISION-PRIMITIVE.md`) — reframe / recorded override / stop. No new verdict, no severity→band mapping, no new doc (FR-007).

## State / ordering (ledger)
Per FR-010, recorded in order within the Gate-A ledger entry:
1. premise pass: RSVP → premise-tagged findings → RT-1..RT-6 outcomes → tally → honest-null;
2. within-frame findings;
3. parked-from-premise findings.
Reconstructable end-to-end. Reuses the existing register/tally schema — no schema change.
