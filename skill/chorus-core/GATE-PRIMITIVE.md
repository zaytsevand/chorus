# Chorus Gate Primitive

This is the **single canonical definition** of how a chorus conducts one review.
Both the periodic project-state round (`INTEGRATION-LAYER.md`, Phases 1/2/4) and
the per-feature SDLC gates (`SDLC-LAYER.md`, Gates A/B/C) run *this* mechanic.
There is exactly one copy; neither layer restates it.

A review is four **separable, specialized stages**, each with a distinct actor
and a distinct success criterion. Running them blended is the failure mode this
file exists to prevent: a 2026-06-06 back-test of the constraint-and-flow lens
(today's Goldratt advisor)
showed that when one agent both **authored and graded** findings it ranked the
new lens dead last; when authoring was split from a **real adversarial vote** the
same lens came back mid-pack. Stage separation changed the answer. The stage you
cheap out on is the stage that lies to you — and stage 3 is load-bearing.

```mermaid
flowchart TD
    corpus([corpus]) -->|"Stage 1 · Extract — read-only agents → file:line records"| records([records])
    records -->|"Stage 2 · Author — seated personas → findings, uncapped"| findings([findings])
    findings -->|"Stage 3 · Vote — OTHER personas → PRIORITIZE / CONFIRM / OVER-RATE"| votes([votes])
    votes -->|"Stage 4 · Tally — orchestrator → deterministic severity + gating"| verdict([verdict])
```

## Stage 1 — Extract

- **Actor**: read-only `Explore` / general-purpose agents, in parallel.
- **Input**: the review corpus (for the base round, the artefacts named in the
  brief; for an SDLC gate, the gate's corpus per `SDLC-LAYER.md`).
- **Output**: structured **extract records** — one factual observation each:

  ```
  {
    "artifact":       "<path>",
    "location":       "<file>:<line>" | "<file>:<lineStart>-<lineEnd>",
    "observation":    "<one factual sentence, no judgment>",
    "raw_excerpt":    "<verbatim quote>",
    "candidate_lens": "<lens this most concerns>" | "unassigned",
    "source":         "explore" | "spec-walkthrough"
  }
  ```

- **Success criterion**: coverage of the corpus; every record carries a real
  `file:line` anchor. These anchors are what later satisfy the I8 evidence gate.
- **Must not**: assign severity or author findings (that is stages 2–4).
- **Fixed viewpoint (SDLC Gate C only)**: the headless `spec-walkthrough` digest
  (`Skill(skill: "spec-walkthrough", args: "<NNN> headless")`) is ingested as
  records with `source: "spec-walkthrough"`. It is **not authoritative** — a
  persona must author a record into a finding for it to face the vote; any
  DRIFT/SURPRISE no persona claims is logged as an unclaimed record (visible,
  non-gating). See `SDLC-LAYER.md`.

## Stage 2 — Author

- **Actor**: the seated persona itself, one per lens (in the base round, the
  Round-1 agent; in an SDLC gate, the gate's seated panel).
- **Input**: the extract records plus the persona's own reading of the corpus —
  with the persona's own **gates** satisfied (`EXPLORATORY-PHASE.md`): the
  answers it has declared it cannot honestly review without (who the user is and
  how many, the grading bar, the characteristic ranking, …), each resolved by
  reference or operator confirmation, never invented.
- **Output**: **findings**, each:
  `{id, lens, evidence (file:line | [principle] | [principle:proposed]),
  proposed_severity (🔴/🟡/🟢), pull_quote (one short verbatim sentence in the
  persona's own words — the line the human-facing register relays unedited;
  spec 008-detail-rich-relay)}`. The persona marks this line itself; the
  orchestrator relays it and never paraphrases or excerpts one for the persona.
- **Success criterion**: **uncapped**. The finding count is whatever the corpus
  honestly warrants — there is **no per-author target or quota** (no "3–6", no
  "limit to N"). A word limit, where one exists, bounds the *prose density per
  finding*, never the *number of findings*.
- **Must not**: pad to hit a number; file a project-specific claim with no
  `file:line` and no principle tag (such a finding is demoted to
  `[unsupported]` per I8 and excluded from the tally); **author past an unmet
  gate** — when one of the persona's declared gates is unanswered, the honest
  output is the question itself, with any dependent findings marked
  **conditional on the stated assumption** rather than graded as if the answer
  were known (S10).

## Stage 3 — Vote

- **Actor**: the **real** seated personas, in character — **never** the author of
  the finding, **never** a synthetic grader (S8, S9). In the base round this is
  the Phase-2 cross-evaluation; in an SDLC gate it is the gate's vote stage.
- **Input**: the findings register.
- **Output**: per non-author persona, one **declared vote** on each finding it has a
  view on — one of three values:
  - `PRIORITIZE` — **under-rated**: more severe than the author proposed → counts toward escalation.
  - `CONFIRM` — **correctly rated**: agree at the proposed severity → holds; counts as
    convergence for ranking, but **not** toward escalation.
  - `OVER-RATE` — **over-rated**: less severe than proposed → counts toward demotion.

  The value is **declared by the voter**, never inferred by the orchestrator from prose
  (S9). Abstention on a finding is allowed. The `CONFIRM` value exists so the tally can tell
  "I agree, rank it high" apart from "this is under-rated, escalate" — the ambiguity that
  inflated convergent agreement into gating severity (issue #13; spec `009-confirm-vote-tally`).
- **Success criterion**: adversarial and real — each vote traces to a dispatched
  persona, and no finding is voted on by its own author.
- **Must not**: be predicted, inferred, or summarized by the orchestrator. A
  *predicted* reaction is not a vote.

## Stage 4 — Tally

- **Actor**: the orchestrator, deterministic.
- **Input**: the votes.
- **Output**: each finding's **post-tally severity** and **gating flag**, by the
  fixed **symmetric**, **board-scaled** rule. Let `P` = PRIORITIZE count, `C` = CONFIRM
  count, and `O` = OVER-RATE count among **non-author** voters; `net = P − O` (**CONFIRM
  is excluded from `net`** — agreement-at-severity does not move severity). Let `N` be
  the count of **non-author voters** on the finding and `T = max(1, floor(N / 2))` the
  **board-scaled threshold** (a wider board demands proportionally more agreement, so
  exceptional entry — `SDLC-LAYER.md` seating — cannot make escalation cheaper):

  | Condition | Effect |
  |---|---|
  | `net ≥ T` | escalate one level (🟢→🟡→🔴, capped at 🔴) |
  | `net ≤ −T` | demote one level (🔴→🟡→🟢, 🟢→drop) |
  | `\|net\| < T` | hold author-proposed severity |

  - At the standard full board of 5 (`N = 4`), `T = floor(4/2) = 2` — the rule reduces
    **exactly** to the prior fixed `±2`, so this change is backward-compatible at the
    size the canon was calibrated for. The floor `T ≥ 1` holds for any voted finding; a
    tally **MUST NOT** run at `N < 2`.
  - `net = 0` (all-abstain, or all-CONFIRM, or balanced) holds; an all-abstain
    finding is marked **unvoted** (non-gating, surfaced). A finding held by CONFIRM
    is **agreed-at-severity**, not unvoted — it has real votes, they just don't move it.
  - Movement is **one level per tally**, regardless of margin (a 4–0 OVER-RATE
    demotes 🔴→🟡, not to nothing — the finding survives in the record).
  - A finding is **gating** iff its post-tally severity is 🔴 — full stop. No
    additional judgment clause: the vote is the confirmation.
  - **Convergence count** (for Phase-4 ranking) is `P + C` — all agreement, used to
    *rank*, never to *escalate*. Severity escalation counts only `P`. This decouples
    the two meanings of "convergence" that issue #13 conflated: a finding many lenses
    agree on can rank in the top-5 while honestly holding at 🟡.
- **Success criterion**: arithmetic only — no judgment added. Identical votes at an
  identical `N` always yield identical severities; there are **no tally ties**, and no
  seat's vote is re-weighted (severity is presence-blind — entry buys a voice, not
  weight). (Operator tie-breaking exists only for SDLC **ordinary-seat** cap seating,
  never in the tally.)
- **Must not**: re-weight by lens, author, or orchestrator preference; add a
  judgment clause to the gating decision.
- **Rendered, never re-authored**: this post-tally severity is the value the
  human-facing findings register and its derived matrix display (spec
  `008-detail-rich-relay`, FR-007). Severity lives authoritatively here, in the
  tally; the register renders it, the matrix projects it — neither re-computes it.

Symmetry is deliberate: convergent `PRIORITIZE` escalates just as clear `OVER-RATE`
demotes; a demote-only tally would silently let an author-under-rated finding through.
The older rule was "two lenses converging on a concern earn 🔴" — **amended** by spec
`009-confirm-vote-tally` (closing issue #13): two lenses **both claiming under-rated**
(`PRIORITIZE`) earn the escalation; two lenses merely **agreeing** at the proposed
severity (`CONFIRM`) hold it. Agreement is convergence for *ranking*, not a force on
*severity* — escalation now requires an explicit under-rated claim, not popularity.

## Invariants this primitive carries

These bind every review — the base round and every SDLC gate. They extend the
integration layer’s I1–I9.

- **S8.** The author of a finding is never its grader. Stage 3 dispatches to
  personas *other than* the author; a persona never votes on its own finding.
  (The back-test failure mode: author-grades-self buried the new lens last.)
- **S9.** The orchestrator never synthesizes a vote or a grade. Stage 3 is a real
  dispatch to seated personas; stage 4 aggregates real votes only. A predicted
  reaction is not a vote. (Extends I1/I6 to the voting and tally stages.)
- **S10.** Every persona **names its gates explicitly** — the information needs
  it cannot honestly review without (`[gate]` entries in its profile,
  `EXPLORATORY-PHASE.md`) — and **prompts for an unmet gate instead of inferring
  past it**. A gate resolves only as *referenced* or *operator-confirmed*; while
  it is open, the persona leads with the question and marks dependent findings
  conditional on the stated assumption. The later stages cannot catch a
  wrong-bar review — every vote asks "is this severe *within the frame*," so
  convergent PRIORITIZE amplifies an altitude error rather than correcting it.
  Honesty about the frame lives in each persona's own chain of thought, before
  authoring. (Provenance: a 2026-06-11 gate reviewed single-operator dev tooling
  against an inferred production bar; 13 manufactured gating 🔴 had to be
  operator-overridden wholesale — issue #6.)

## Adoption note

`INTEGRATION-LAYER.md` (base round Phases 1/2/4) and `SDLC-LAYER.md` (gates
A/B/C) **reference this file** for the mechanic; they do not restate it. Any
change to extract/author/vote/tally happens here, once, so the two modes cannot
drift. The lifecycle-specific invariants S1–S7 live in `SDLC-LAYER.md`; the
gate-primitive invariants S8–S10 live here because they bind both modes.

## Provenance

Designed in `docs/superpowers/specs/2026-06-06-agent-sdlc-workflow-design.md`
and specified in `specs/003-agent-sdlc-workflow/` (see
`contracts/gate-primitive.md` and `contracts/sdlc-invariants.md`). The
stage-separation rule and S8/S9 come from a 2026-06-06 back-test of the
constraint-and-flow lens.
