# Contract: Gate Primitive (four stages)

The single canonical mechanic for conducting a review, shared by the base
project-state round (`INTEGRATION-LAYER.md`) and every SDLC gate
(`SDLC-LAYER.md`). One definition (SC-006). Each stage has a distinct actor and
a distinct success criterion; running them blended is the failure mode this
contract exists to prevent.

## Stage 1 — Extract

- **Actor**: read-only `Explore` / general-purpose agents, in parallel.
- **Input**: the gate's corpus (Gate A: spec; Gate B: plan + tasks; Gate C:
  code + tests + spec, plus the `spec-walkthrough` reconciliation).
- **Output**: structured **extract records**:

  ```
  {
    "artifact":       "<path>",
    "location":       "<file>:<line>"   | "<file>:<lineStart>-<lineEnd>",
    "observation":    "<one factual sentence, no judgment>",
    "raw_excerpt":    "<verbatim quote>",
    "candidate_lens": "<lens this most concerns>" | "unassigned",
    "source":         "explore" | "spec-walkthrough"
  }
  ```

- **Success criterion**: coverage of the corpus; every record carries a real
  `file:line` anchor (these anchors are what later satisfy I8 / S6).
- **Must not**: assign severity or author findings (that is stages 2–4).
- **Fixed viewpoint (Gate C only)**: the headless `spec-walkthrough` digest
  (`Skill(skill: "spec-walkthrough", args: "<NNN> headless")`) is ingested as
  extract records with `source: "spec-walkthrough"`. It is non-authoritative: a
  persona must author a record into a finding for it to face the vote; any
  DRIFT/SURPRISE no persona claims is still logged in the ledger as an unclaimed
  record (visible, non-gating). Gate B invokes it only when substantial
  pre-existing code is in scope.

## Stage 2 — Author

- **Actor**: the seated persona itself (one per lens).
- **Input**: extract records + the persona's own reading of the corpus.
- **Output**: **findings**, each `{id, lens, evidence(file:line | principle
  tag), proposed_severity(🔴/🟡/🟢), summary(≤20 words)}`.
- **Success criterion**: **uncapped** — the finding count is whatever the corpus
  honestly warrants. No per-author target or quota (FR-005). A word limit, if
  any, bounds prose density per finding, never the number of findings.
- **Must not**: pad to hit a number; cite nothing (such findings are demoted to
  `[unsupported]` per I8/S6).

## Stage 3 — Vote

- **Actor**: the **real** seated personas, in character — **never** the author
  of the finding, **never** a synthetic grader (S8, S9).
- **Input**: the findings register.
- **Output**: per non-author persona, one **vote** per finding it has an opinion
  on: `PRIORITIZE` (≥ proposed severity) or `OVER-RATE` (< proposed severity),
  with optional rationale; abstention allowed.
- **Success criterion**: adversarial and real — each vote traces to a dispatched
  persona; no finding is voted on by its author.
- **Must not**: be predicted, inferred, or summarized by the orchestrator.

## Stage 4 — Tally

- **Actor**: the orchestrator, deterministic.
- **Input**: the votes.
- **Output**: each finding's **post-tally severity** and **gating flag**, by the
  fixed **symmetric** rule. Let `P` = PRIORITIZE count, `O` = OVER-RATE count
  among **non-author** voters, and `net = P − O`:
  - `net ≥ +2` → escalate one level (🟢→🟡→🔴, capped at 🔴).
  - `net ≤ −2` → demote one level (🔴→🟡→🟢, 🟢→drop).
  - `|net| < 2` → hold author-proposed severity. (`net = 0` from all-abstain is
    held and marked **unvoted**: non-gating, surfaced.)
  - Movement is **one level per tally**, regardless of margin.
  - **Gating** iff post-tally severity is 🔴 — full stop (no extra clause).
- **Success criterion**: arithmetic only — no judgment added (S9). Same inputs
  always yield the same severities; there are **no tally ties** (operator
  tie-breaking applies only to cap-5 seating).
- **Must not**: re-weight by lens, author, or orchestrator preference; add a
  judgment clause to the gating decision.

## Adoption note

Both `INTEGRATION-LAYER.md` (base round Phases 1/2/4) and `SDLC-LAYER.md` (gates
A/B/C) MUST reference this file rather than restating the mechanic. Any change to
the mechanic happens here once.
