---
name: chorus-review
description: >-
  Multi-advisor project state review
  (Evans/Richards/Cooper/Norman/Uncle Bob/Beck/Delivery-and-Ops/security/Goldratt)
  with per-round RSVP self-selection, cross-evaluation, conflict reconciliation,
  and ranked recommendations. Use when the user asks to "spawn the chorus" /
  "spawn the regular chorus" or for a project-state review of a spec, design,
  PR, or codebase. Not for chorus challenge mode or the agent-SDLC lifecycle
  (use chorus-sdlc) or the chorus learn tutorial (use chorus-learn). Produces a
  durable artifact at docs/reviews/YYYY-MM-DD-chorus-review.md. REQUIRED
  composition: chorus-core (shared substrate).
---

# Chorus Review — repeatable procedure

A multi-lens review of whatever you point it at — **most often a spec or a
feature's design, occasionally a full-codebase sweep.** Each round produces a
durable artifact future rounds baseline against, rather than re-derive.

This skill is project-agnostic. Project-specific facts come from an optional
per-project addendum (see "Project addendum").

## REQUIRED: chorus-core — substrate guard (run BEFORE anything else)

This skill composes the shared substrate skill **`chorus-core`**: the four-stage
gate (`GATE-PRIMITIVE.md`, stages **extract → author → vote → tally**, S8–S11),
decision banding (`DECISION-PRIMITIVE.md`, D1–D5), the exploratory phase
(`EXPLORATORY-PHASE.md`), and the conductor discipline + `I1–I9` invariant catalog
(`CONDUCTOR.md`). This file cites those mechanics and does not restate them.

The loader does not enforce `REQUIRED:`, so the calling session MUST assert that
the `chorus-core` directory and its four files are reachable. **If it is not,
STOP and fail loudly** — do not improvise the missing mechanics. Emit:

> **chorus-core is missing.** `chorus-review` requires the shared substrate skill
> `chorus-core`, which is not reachable. This means a broken or partial install of
> the chorus suite — the shared mechanics (the four-stage gate, decision banding,
> exploratory phase, and the `I1–I9` invariant catalog) cannot be loaded, so the
> round cannot run honestly. **Recovery:** re-install the chorus suite
> (`./install.sh`), or check that `chorus-core` was published/copied under its
> expected name, then retry.

Operator-facing decisions (scope, seating, blocking on 🔴) are banded by the
decision catalog in `chorus-core/DECISION-PRIMITIVE.md` (🟢 auto, 🟡 recorded
default + async override, 🔴 hard-block), by declared predicate, never by
orchestrator inference. Severity is three-level: 🔴 🟡 🟢.

## The conductor (who runs the round)

The calling session is the **integration layer**: not a persona, holds no lens,
produces no findings. It sits between the user (N+1: goals, scope, sign-off) and
the personas (N−1: findings within their lens), with `advisor()` lateral. It
speaks to the user in procedure (gates, quorum, abort, ranking), to personas in
briefs, and to `advisor()` only with framed conflicts. It sees the round context,
the addendum, RSVP replies, reports, the register and matrix it assembles, and
`advisor()`'s rulings; it does not see lens-internal reasoning, the domain truth
of a finding, or the project's priorities, and it reads the codebase only as far
as the procedure requires. When tempted to rule on what it does not see, it
refuses and surfaces.

Its voice is the EWD register defined in `chorus-core/CONDUCTOR.md`: procedural,
plain, declarative about state, citing the procedure rather than its own
judgment, with Dijkstra's dry side-notes as non-binding marginalia. Brief upward
short and choice-shaped; brief downward complete; ask "why?" along the cascade
("cite the artefact; chase the chain; show me where it terminates in an invariant
or a named principle"). **A phase does not start until the previous phase's
post-condition holds** (I4).

## When to use

- **Reviewing a spec or a feature's design** across multiple lenses — the common
  case ("spawn the chorus" pointed at the spec).
- **A full-codebase sweep** — periodic, e.g. quarterly or after a major release.

For the gated speckit lifecycle, and for `chorus challenge`, use the sibling
skill **`chorus-sdlc`**. Don't use for single-lens questions (spawn that persona
directly), line-by-line diff review (`superpowers:code-reviewer` or
`/ultrareview`), or one-off architecture questions (`mark-richards-architect`).

## PR design review (targeted mode)

On **`/chorus-review the PR`** (or a PR number/URL), run a **design review of the
PR's approach and seams**, not a line-by-line diff review. Phase 0 adjustments:

- **Round context** — PR title/body, branch, files touched (+/−), governing specs
  (cited, or an `Implements:`-style header), linked issues, CI status. State:
  *"Mode: design review of the PR's approach, not a line-by-line diff review."*
- **Anchor surface** — the diff paths + their governing specs/contracts/tests;
  chase each `# Implements:` / spec reference to an invariant.
- **Artifact path** — `docs/reviews/YYYY-MM-DD-chorus-review-prNNN.md`.
- **Exclusions** — unchanged; Security-and-Trust still overrides on attacker surface.

When the operator asks for coding discipline / architecture / DDD, **weight the
briefs toward** Evans, Richards, Uncle Bob, Beck, and Guido (if Python touched) —
seam placement, bounded-context honesty, SOLID, TDD evidence, Python idiom.
Seating still follows the RSVP and the cap (Phase 0.5).

## Project addendum

Each project may provide `docs/reviews/CHORUS-PROJECT.md`, read before Phase 0:

1. **Project summary** — 2–3 sentences: topology, primary languages, where the
   constitutional / governance docs live.
2. **Default scope exclusions** — paths the chorus must not produce findings
   about (legacy, runtime data, generated code), each with a one-line reason.
3. **Default anchor surface** — the actively-developed paths to focus on.
4. **Constitutional / governance principles** (if any) — used by Phase 4's
   Constitutional ROI; if none, that dimension is skipped.
5. **Security data-surface checklist** — project-specific items (token storage,
   PII flows, key exposure, log redaction, callback validation), passed verbatim
   to Security-and-Trust.
6. **Baseline references** — prior chorus artifacts; the most recent is the
   primary baseline.
7. **Anchor-discovery procedure** — how the orchestrator builds each lens's
   anchor list per round: architecture doc first, spec head-scan
   (`head -n 20 specs/<NNN-slug>/spec.md`), memory recall, spec-slug grep
   (`rg "specs/0[0-9]+"`) followed code → spec → invariant. Item 3 is the static
   fallback when discovery yields nothing.

**Scope confirmation follows catalog rows 9–10 only.** Addendum present → 🟢:
use its exclusions and anchors, no ask. Addendum absent → 🟡: infer defaults
from `CLAUDE.md` / `AGENTS.md` / repo layout, record them, proceed, and confirm
asynchronously with the operator; an override applies from the next dispatch.

## Scope exclusions in every brief

Bake the exclusion list into every persona brief except Security-and-Trust's:

> **Out of scope for this review:** the following paths are legacy POC code,
> runtime data directories, or generated code the team is not investing in. Do
> not produce findings about them; redirect that energy to the active surface.
>
> [verbatim exclusion list with one-line justifications]
>
> The boundary between active code and these paths is in scope; their internals
> are not.

**Security-and-Trust lens (scope override).** Security joins via RSVP like every
other persona, but the general exclusion list does NOT apply to it: exfil risk
does not care about tech-debt labels. Its brief omits the verbatim list and
states instead that **legacy paths are in scope when they expose attacker
surface**, the exclusion list applying only to non-security concerns; pass the
addendum's item 5 verbatim on top of its default anchors (auth surfaces, trust
boundaries, supply chain, secrets, egress, log redaction). Its findings take the
next `Fn` IDs under the same severity scheme and evidence rule (I8). When it
abstains, no separate security pass runs; the abstention is recorded.

## Dispatch rules (all phases)

- **Continuity.** Dispatch each roster persona with the `Agent` tool (plain
  dispatch, no Workflow). Continue each joiner with `SendMessage` through the
  exploratory phase and Round 1 rather than spawning it cold each phase; every
  brief is still self-contained in content.
- **Wall-clock budget.** The round context states a wall-clock budget per phase
  (defaults: RSVP 3 min, exploratory 15 min, Round 1 15 min, Round 2 10 min,
  operator-overridable). It applies to every dispatch, Round 2 included. A
  dispatch past its budget is stopped.
- **One failure rule.** A persona that is silent, past budget, or returns
  malformed, over-length, or validator-rejected output gets **one automatic
  retry** with the reason. If the retry fails too, or the persona is not
  installed, it **counts as ABSTAIN, with the reason recorded in the roster**.
  There is no substitute lens. A missing optional tool falls back to its port's
  recorded default. Retries, fallbacks and abstentions go in the record's
  bindings and are never asked live. The operator is asked only when the round
  cannot reach a valid result alone: quorum (≥3) fails, re-evaluated after the
  Phase 1 evidence check (the round then aborts as in Phase 0.5), or a lost seat
  leaves a 🔴 finding without enough voters to count it.
- **Memory recovery.** Some personas write their report to
  `.claude/agent-memory/<persona-name>/` and return a summary; after each
  dispatch, `Read` any new files there — they are the report.
- **Output format.** Each persona returns JSON of the kind its phase names —
  `rsvp` (Phase 0.5), `finding-report` (Phase 1, and Round-2 derives),
  `vote-report` (Phase 2) — checked by the bound record validator
  (`chorus-core/CONDUCTOR.md` § Ports) before it counts; a failing reply is
  retried once, then counts as ABSTAIN, under the rule above. Field shapes
  are the bound schema's, not restated here.

## The procedure

### Phase 0 — Brief

- **Pre:** the user invoked the skill; the addendum is located or its absence
  confirmed.
- **Post:** scope banded per rows 9–10 (🟢 or 🟡-with-recorded-defaults); date
  stamp chosen; round context drafted with phase budgets.

The roster is the persona agents in `agents/`: Evans (DDD), Richards
(architecture), Cooper (adversarial product), Norman (HCD), Uncle Bob (clean
code/SOLID), Beck (TDD/simple design), Delivery-and-Ops (CD / operability /
observability / cost), Security-and-Trust (trust boundaries / threat modeling),
Goldratt (constraint & flow), and the **optional language lens** Guido (Python),
included when the anchor surface has recently-changed Python and dropped by the
RSVP otherwise.

The **round context** is one paragraph of concrete since-last-chorus deltas:
commits/PRs landed, specs created or completed, infra and release-path changes,
incidents or user-visible events, anything excluded this round. It MUST name
concrete deltas, not "general project state" — vague inputs produce performative
joins.

### Phase 0.5 — RSVP (per-round self-selection)

- **Pre:** Phase 0 post holds.
- **Post:** every roster member has replied `JOIN`, **exceptional entry**, or
  `ABSTAIN` with a one-line reason (or counts as ABSTAIN under the failure rule);
  seating is resolved; joiner count `J` and the quorum branch are recorded.

Dispatch all roster personas in parallel (`run_in_background: true`). Each brief:
lens identity, the round context, the exclusion list (or Security's override),
and RSVP instructions — reply in ≤80 words with `JOIN`, `ABSTAIN`, or an
exceptional entry, plus the two-axis signal (`chorus-core/DECISION-PRIMITIVE.md`
§ The RSVP signal): **applicability** (cite ≥1 concrete round-context delta; none
→ ABSTAIN) and **expected stakes** (🟢/🟡/🔴-potential + one-line hook), with a
one-sentence reason. The orchestrator counts; it never pre-decides whose voice
matters.

**Seating.** The round seats a cap of five, plus exceptional entry, per
`chorus-core/DECISION-PRIMITIVE.md` § Seating (a tie at the cap is 🟡, catalog
row 2). An exceptional entry cites a concrete uncovered delta no seated lens
covers; it is evidence-gated, rare, and confers a voice, not weight.

**Quorum.**
- **`J ≥ 3`** — proceed. The artifact records who abstained and why.
- **`J < 3`** — re-ask **all** abstainers once, each with the same added context
  paragraph. If still `J < 3`, **abort the chorus**: write
  `docs/reviews/YYYY-MM-DD-chorus-abstained.md` with each lens's RSVP reply and
  revisit at next cadence. Do not fake a chorus.

**RSVP record.** Joiners, abstainers, and failure-rule abstentions go under
`## Roster (this round)` with one-line reasons. A persona abstaining four rounds
running suggests the round context is not surfacing its deltas honestly.

### Phase 0.7 — Exploratory phase (joiners build understanding)

- **Pre:** Phase 0.5 post holds; quorum branch is "proceed".
- **Post:** every joiner has a persisted understanding record whose profile needs
  are each referenced / inferred / operator-confirmed / open-gap; the **one
  batched, sessioned operator interview** has run (or was deferred with a
  recorded degradation summary); project-wide facts were written to the addendum
  **only with operator acceptance**; the **profile-coverage fitness function**
  passes (or its failures are recorded).

The mechanic is `chorus-core/EXPLORATORY-PHASE.md`. The conductor owns the
interview (N+1): it dedupes joiners' gap-questions and runs them in **resumable,
operator-paced sessions of ≤ 5 questions**; advisors never interview directly.
Round 1 is authored *from* the persisted understanding, but persisted memory is
an **index of locators, never a finding's evidentiary endpoint** — findings
re-ground in the live source (I8 upstream of Round 1). Abstainers skip this phase.

### Phase 1 — Round 1 (joiners only)

- **Pre:** Phase 0.7 post holds; quorum branch is "proceed".
- **Post:** every joiner has a report that passed the evidence check (or counts
  as ABSTAIN), each finding carrying its **persona-marked pull-quote**; reports
  are referenceable by file or memory-dir path; `J ≥ 3` re-checked.

Round 1 is **stages 1–2 of the gate primitive**: an optional read-only Extract
pass (a bounded `Explore`) may pre-build `file:line`-anchored records, invisible
to the operator and never assigning severity; then each joiner authors findings
**uncapped**. Abstainers are not briefed and get no `[no comment]` rows.

Brief sections per joiner (continued via `SendMessage`):

1. **Lens identity** — "you are one of N advisors in a chorus review" (N = joiners).
2. **Project topology** — addendum item 1, incl. governance doc location.
3. **Scope-exclusion list** (verbatim) or Security's override.
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

#### Phase 1 evidence check (gate before the register; I8)

1. **Tool-use count > 0.** A zero-tool-use report gets its one retry with
   "Read these artefacts first: …". A second zero-tool-use report counts as
   ABSTAIN (reason: no evidence); none of its findings are registered. Both are
   recorded as recoveries.
2. **Project-specific findings carry `file:line` or a principle tag.** Otherwise
   they become `[unsupported]` rows: visible, but outside the matrix, the vote,
   and convergence.
3. **A pull-quote was marked.** If not, the finding is routed back to its persona;
   the conductor never selects or authors a span.

Then re-evaluate quorum.

### Phase 2 — Cross-evaluation (Vote and Tally)

- **Pre:** Phase 1 post holds; the findings register is written, every finding's
  pull-quote relayed; Phase 1 `NEED_INFO` flags are routed for resolution and
  still-open rows are marked held.
- **Post:** every seated joiner that passed the evidence check has voted (or
  counts as ABSTAIN); every flag is resolved or recorded open; the stage-4 count
  has run; the consolidation matrix is written from the count.

**Findings register** — the **single human-facing source of truth**, written
before the vote; its fields are the bound schema's `review-record` register. An
operator who has not read the reports must understand each entry alone.

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

**Round 2 dispatch** — one per seated joiner that passed the evidence check,
within the Round 2 budget. Each brief carries:

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
re-authors nothing. Status is `graded`, `held`, `ungraded` (`R2-`), `minority-report` (one voter), or `unvoted`.

### Phase 3 — Conflict reconciliation

- **Pre:** Phase 2 post holds.
- **Post:** genuine conflicts are framed as `Cn` and each is resolved by an
  `advisor()` ruling or recorded **unresolved for the operator**; skipped with a
  one-line note when there are no conflicts.

Identify *genuine* conflicts (not emphasis differences): which advisors disagree,
over what, and how the user-visible outcome differs. If there are none, skip the
phase. Otherwise state them in one brief and call `advisor()` once (it sees the
full transcript). Its rulings **annotate the ranking and never change counted
severity**. If `advisor()` is unavailable, record each conflict unresolved for the
operator. The Conflicts section gives each `Cn` what was disputed, the ruling (or
"unresolved"), and the finding IDs it touches.

### Phase 4 — Ranking

- **Pre:** Phase 3 post holds.
- **Post:** a top five drafted by the conductor (not delegated to a fresh agent),
  each entry resolved to its pull-quote and traced to its register entry; held
  findings listed separately.

Score findings on **Cost** (low / medium / high), **Value** (risk reduced +
friction removed + decisions unblocked), **Constitutional ROI** (only if the
addendum lists principles), and **Convergence** (`P + C` from the matrix). A
finding whose `NEED_INFO` is still open at ranking is listed as **held** and
**excluded from the top five**; the round does not stall on it. Minority reports are
listed apart and excluded too. `R2-` findings
carry "[ungraded]" wherever they appear. `advisor()` may sanity-check a
non-obvious ordering (optional).

Each top-five entry carries its ID, pull-quote, locator, and final severity, and
traces to its register entry; a bare `Fn` + score is a dead end.

### Phase 5 — Sign-off

- **Pre:** Phase 4 post holds.
- **Post:** the artifact is complete in skeleton order and committed; an optional
  `advisor()` sanity pass is recorded if run; if no addendum existed, an offer to
  write `docs/reviews/CHORUS-PROJECT.md` from the inferred and confirmed facts is
  on record.

## Artifact

The record is a `review-record` JSON at `docs/reviews/YYYY-MM-DD-chorus-review.json`,
validated and rendered by the bound ports (`chorus-core/CONDUCTOR.md` § Ports) to
the sibling `.md` page — **commit both.** On a collision, suffix `-N` (N = 2, 3, …).
The most recent artifact is the next round's primary baseline. Older markdown-only
records stay as they are.

The rendered page's order (after the header, the bindings: which provider
served each port, and every retry, fallback and abstention by failure):

1. **TL;DR** — 3 sentences: what the chorus found, what the top five
   prioritizes, and which 🔴 findings block public rollout (tracked as a unit
   even when outside the top five).
2. **Roster (this round)** — joiners, seating, abstainers with reasons.
3. **Findings register.**
4. **Consolidation matrix** — with the tally columns.
5. **Conflicts** — `Cn` entries.
6. **Top five.**
7. **Held findings and minority reports** — open `NEED_INFO` with reasons; one-voter findings, uncounted.
8. **Next-chorus baseline** — what the next round should assume closed or
   in progress vs re-evaluate.

Appendix: each lens's report, or links to it (file or memory-dir path).

## Failure modes not covered above

| Symptom | Fix |
|---|---|
| Findings dominated by legacy code | Scope exclusions in every brief (rows 9–10) |
| All personas join every round | Tighten the round context: concrete deltas only |
| Phase 2 takes longer than Phase 1 | Tighter numbered questions; own finding IDs listed explicitly |
| Project-fact inference every round | Phase 5 offers to write `CHORUS-PROJECT.md` |
| Artifact cites `Fn`/`Cn` with no description | Register (with pull-quotes) precedes the matrix; top five resolves to pull-quotes |
