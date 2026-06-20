---
name: chorus-review-domain
description: Domain shape of the chorus-review skill — bounded contexts, ubiquitous language, ownership/aggregate seams, recurring language drift
metadata:
  type: project
---

The chorus-review skill is a multi-advisor design/code review procedure (markdown
prompts, no runtime code). The "model" under review is the conceptual model the
prompts define, not classes.

**What the business is:** a panel of named advisor personas (Evans, Richards, Cooper,
Norman, Uncle Bob, Beck, Delivery-and-Ops, Security-and-Trust, Constraint-and-Flow,
+ opt-in language lens) review a target across rounds. RSVP self-selection picks
joiners each round. Findings → votes → tally (GATE-PRIMITIVE.md). Also an
agent-SDLC lifecycle mode (SDLC-LAYER.md) interleaving gates with speckit.

**Two-tier memory seam (feature 004, "advisor exploratory phase"):**
- **Project base = the addendum** (`docs/reviews/CHORUS-PROJECT.md`) — operator-owned,
  shared across all advisors. Gains a "Project understanding" section (section 7)
  holding operator-confirmed PROJECT-WIDE facts only.
- **Per-advisor understanding record** (lens layer) — advisor-owned, lives in
  `~/.claude/agent-memory/<persona>/understanding-<scope>.md`. References the base,
  never copies. Holds lens inferences, lens-specific operator-confirmed facts,
  open gaps. Layered: project record + feature/NNN deltas.
- **Operator interview batch** — orchestrator-owned, one per round. Advisors never
  interview the operator directly (the N+1 / "orchestrator owns operator interaction"
  invariant).

**Canonical-home rule (the load-bearing tier invariant):** project-wide
operator-confirmed facts live ONCE in the addendum (SC-008). Lens-specific
operator-confirmed facts live in the advisor record. The word "operator-confirmed"
denotes BOTH homes — watch for this conflation.

**Ubiquitous Language drift observed in 004 design (Gate A):** one concept wears
several names — "understanding record"/"lens layer"/"per-advisor record";
"project base"/"addendum"/"shared project base"/"project-level base layer". Two
parallel tag vocabularies: profile items use `ref|infer|op` (expected source);
record entries use `Referenced|Inferred|Operator-confirmed` (realized source) —
legitimately distinct but mapping unstated; a stray third spelling "operator-gathered"
appears in data-model.md. "Project understanding" section name overpromises: it holds
facts, not synthesis (synthesis stays in the record by design).

**Ownership is stated consistently** across files — a genuine strength of this design.
