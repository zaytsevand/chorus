# Round briefs, register and matrix

Reference for `chorus-review` Phases 1 and 2. Read before dispatching Round 1,
and again before writing the register and dispatching Round 2.

## Contents

- Round 1 brief (Phase 1)
- Findings register (Phase 2, before the vote)
- Round 2 brief (Phase 2)
- Derived findings, count and consolidation matrix

## Round 1 brief (Phase 1)

Brief sections per joiner (continued via `SendMessage`):

1. **Lens identity** — "you are one of N advisors in a chorus review" (N = joiners).
2. **Project topology** — addendum item 1, incl. governance doc location.
3. **Scope-exclusion list** (verbatim) or Security's override
   (`ADDENDUM-AND-SCOPE.md`).
4. **Existing artefacts to re-examine first** — 4–8 paths per lens with
   `file:line` targets, built by the addendum's item 7. Artefacts include code,
   tests, configs, dashboards, SQL, runbooks, ADRs, specs, BDD scenarios,
   contracts. **Specs are starting points, not endpoints**: **do not stop at any
   single artefact unless it is an invariant** — an executable assertion or a
   principle in the project's constitution. Ban *"read whatever seems relevant"*;
   bake in *"chase this artefact until you hit an invariant or run out of
   pointers."*
5. **Prior position to challenge** *(optional)* — a prior consensus, stated
   verbatim, to attack with code-grounded behavioural evidence. **Principles
   (invariants) ARE load-bearing**, but **declared intentions are not
   behaviour**: *"Attack declared intentions with behavioural evidence; respect
   invariants by citing where they are enforced (or surface the absence of
   enforcement as the finding)."*
6. **Numbered questions** — 4–7, through that lens.
7. **Word limit** — 500–700 words. It bounds prose per finding, not the number
   of findings; do not pad or trim to a count.
8. **Evidence rule and pull-quote** — every finding cites `file:line`, or carries
   `[principle]` (existing; cite where established) or `[principle:proposed]`
   (newly named). **Before you write a finding, you MUST have either followed the
   artefact chain to an invariant or run out of pointers, OR tagged it.** For each
   finding, mark **one short sentence in your own words** as its pull-quote, on a
   line beginning `PULL-QUOTE:` with its locator. The conductor relays that span
   verbatim and **selects nothing**.
9. **`NEED_INFO` + confidence axis** — declare `confidence_on_hand` (`high`/`low`)
   per finding; **`low` → `NEED_INFO` is mandatory**. Also raise it when
   remediation or formulation is undecidable: `NEED_INFO: true` plus a one-sentence
   `need_info_reason`. Do not invent past the gap (S11).
10. **Required ending** — "End with [a recommendation, a finding, a persona name]."

## Findings register (Phase 2, before the vote)

The **single human-facing source of truth**, written before the vote; its fields
are the bound schema's `review-record` register. An operator who has not read the
reports must understand each entry alone.

- The pull-quote is the persona's marked span, verbatim and attributed —
  never a conductor paraphrase or excerpt (I6, mechanized); preserve any
  `[principle]` / `[principle:proposed]` / `[unsupported]` tag.
- A row with an open `NEED_INFO` is shown **held**, not graded; resolution goes
  by the two S11 paths (peer or operator provision; the orchestrator routes and
  never invents).
- **Duplicates** are grouped under one entry **only when they cite the same
  locator**; each author and each author's severity is kept on the entry.
- Under each finding, list converging lenses, each with its **own** verbatim
  Round-2 note: *which lenses and in whose words*, not a bare count.

## Round 2 brief (Phase 2)

One per seated joiner that passed the evidence check, within the Round 2 budget.
Each brief carries:

1. **Pointer to the findings register** at the artifact path (with pull-quotes).
2. **Their own finding IDs**, listed — they do not vote on them (S8: the author
   of a finding is never its grader).
3. **Vote** on every finding you did not author and have a view on. First declare
   `confidence_on_hand`, then one of: **PRIORITIZE** (under-rated, escalate),
   **CONFIRM** (correctly rated — agreement, not escalation), **OVER-RATE**
   (over-rated, wrong, out of scope, or too vague to act on — give a `file:line`
   or one-line reason), or **NEED_INFO** (information-gapped). **`low` confidence
   → `NEED_INFO` is mandatory**; do not CONFIRM with hedges. Only PRIORITIZE
   moves a finding up. Held rows are not voted until released.
4. **Derive (the round's primary output).** *Given what other lenses reported,
   what does that imply **in your own territory** that you have not yet
   examined?* Go and look. A derived finding is new ground you examined, not a
   second opinion ("I agree with Security" is not a derive). Name the finding you
   derived from; cite `file:line` for ground read this round. Rationale and
   falsifiers: `docs/round2-derive-evidence.md`.
5. **Convergence note** — for each finding you converge with, one short sentence
   in your own words, marked `PULL-QUOTE:`, relayed verbatim under that entry.
6. **Evidence rule continues.** Votes and derives making project-specific claims
   cite `file:line` ("I read X.py:NN and confirm" is a citation; "Bob is correct"
   is `[unsupported]` at worst). The Phase 1 evidence check runs again on Round 2
   output.

Word limit: 500–600.

## Derived findings, count and consolidation matrix

**Derived findings** enter the register with the prefix **`R2-`** (`R2-1`,
`R2-2`, …). They keep their author's severity and are marked **ungraded**
(`graded: false`, shown as "[ungraded]") in the register, the matrix, and the
ranking: no second lens has voted on them.

**Count.** Route Round-2 `NEED_INFO` flags by S11, then run the **deterministic
stage-4 tally** (`chorus-core/GATE-PRIMITIVE.md` § Stage 4) on every graded
finding with its flag cleared: `net = P − O` over non-author voters (CONFIRM
excluded), compared to the board-scaled threshold `T` defined there. Severity is
arithmetic over real votes, never the orchestrator's judgment (S9).
**Convergence = `P + C`**, computed after the count.

**Consolidation matrix** — produced **after the count**, a projection of the
register plus the tally (fields: the bound schema's `review-record` matrix); it
re-authors nothing. Status is `graded`, `held`, `ungraded` (`R2-`),
`minority-report` (one voter), or `unvoted`.
