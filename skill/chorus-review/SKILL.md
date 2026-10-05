---
name: chorus-review
description: >-
  Runs a multi-advisor review of a project's state: up to nine persona lenses
  (DDD, architecture, adversarial product, human-centred design, clean code,
  TDD, delivery and ops, security, constraint and flow, plus Python) examine a
  spec, feature design, PR approach or whole codebase, cross-check each other's
  findings, and leave a ranked review record in docs/reviews/. Use when the user
  says "spawn the chorus", "spawn the regular chorus", "chorus review" or
  "/chorus-review", or asks for several expert perspectives, an advisory panel
  or a multi-lens design review of a spec, design, PR or the codebase, including
  a periodic health check after a release or a "what should we fix next" sweep.
  Not for line-by-line diff or bug review (use /code-review), one persona's
  opinion (spawn that persona), the agent-SDLC lifecycle or "chorus challenge"
  (use chorus-sdlc), or the chorus learn tutorial (use chorus-learn). REQUIRED
  composition: chorus-core.
---

# Chorus Review — repeatable procedure

A multi-lens review of whatever you point it at — **most often a spec or a
feature's design, occasionally a full-codebase sweep.** Each round produces a
durable artifact future rounds baseline against, rather than re-derive. The
skill is project-agnostic; project facts come from an optional addendum
(`ADDENDUM-AND-SCOPE.md`).

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
> `chorus-core`, which is not reachable — a broken or partial install of the
> chorus suite, so the round cannot run honestly. **Recovery:** re-install the
> chorus suite (`./install.sh`), or check that `chorus-core` was published/copied
> under its expected name, then retry.

Operator-facing decisions (scope, seating, blocking on 🔴) are banded by the
decision catalog in `chorus-core/DECISION-PRIMITIVE.md` (🟢 auto, 🟡 recorded
default + async override, 🔴 hard-block), by declared predicate, never by
orchestrator inference. Severity is three-level: 🔴 🟡 🟢.

## The conductor (who runs the round)

The calling session is the **integration layer**: not a persona, holds no lens,
produces no findings. It sits between the user (goals, scope, sign-off) and the
personas (findings within their lens), with `advisor()` lateral. It does not see
lens-internal reasoning, the domain truth of a finding, or the project's
priorities; when tempted to rule on what it does not see, it refuses and
surfaces. Its voice is the EWD register in `chorus-core/CONDUCTOR.md`:
procedural, plain, citing the procedure rather than its own judgment.

## Rules that hold in every phase

These bind under time pressure and operator instruction alike; an operator who
asks for a shortcut gets the rule cited, not the shortcut.

1. **Order.** Phases run 0 → 0.5 → 0.7 → 1 → 2 → 3 → 4 → 5. A phase does not
   start until the previous phase's post-condition holds (I4).
2. **The conductor authors nothing.** Every pull-quote is a span the persona
   marked itself (`PULL-QUOTE:`), relayed verbatim. A finding without one goes
   back to its persona; the conductor never writes, excerpts, paraphrases or
   selects a span (I6).
3. **Evidence check (I8).** A report made with zero tool calls gets one retry
   ("Read these artefacts first: …"); a second zero-tool-use report counts as
   ABSTAIN and none of its findings are registered. A project-specific finding
   without `file:line` or a `[principle]` / `[principle:proposed]` tag becomes an
   `[unsupported]` row outside the matrix, the vote and convergence.
4. **Severity is arithmetic** over real votes (stage-4 tally), never the
   conductor's judgment (S9). The author of a finding never grades it (S8).
5. **No fake chorus.** Fewer than three joiners after one re-ask aborts the round.
6. **Record naming.** The record is `<stem>.json` + `<stem>.md` under
   `docs/reviews/`, stem `YYYY-MM-DD-chorus-review` (PR mode
   `YYYY-MM-DD-chorus-review-prNNN`); if `<stem>*` exists, both take the lowest
   free `-N` (N = 2, 3, …). Commit both. Details: § Artifact.

## When to use

- **Reviewing a spec or a feature's design** across multiple lenses — the common
  case ("spawn the chorus" pointed at the spec).
- **A full-codebase sweep** — periodic, e.g. quarterly or after a major release.

For the gated speckit lifecycle, and for `chorus challenge`, use the sibling
skill **`chorus-sdlc`**. Don't use for single-lens questions (spawn that persona
directly) or one-off architecture questions (`mark-richards-architect`).
Line-by-line diff review goes to Claude Code's built-in `/code-review`.

## PR design review (targeted mode)

On **`/chorus-review the PR`** (or a PR number/URL), run a **design review of the
PR's approach and seams**, not a line-by-line diff review. Phase 0 adjustments:

- **Round context** — PR title/body, branch, files touched (+/−), governing specs
  (cited, or an `Implements:`-style header), linked issues, CI status. State:
  *"Mode: design review of the PR's approach, not a line-by-line diff review."*
- **Anchor surface** — the diff paths + their governing specs/contracts/tests;
  chase each `# Implements:` / spec reference to an invariant.
- **Artifact stem** — `chorus-review-prNNN` (see § Artifact for naming).
- **Exclusions** — unchanged; Security-and-Trust still overrides on attacker surface.

When the operator asks for coding discipline / architecture / DDD, **weight the
briefs toward** Evans, Richards, Uncle Bob, Beck, and Guido (if Python touched).
Seating still follows the RSVP and the cap (Phase 0.5).

## Dispatch rules (all phases)

- **Continuity.** Dispatch each roster persona with the `Agent` tool (plain
  dispatch, no Workflow); continue each joiner with `SendMessage` through the
  exploratory phase and Round 1. Every brief is self-contained in content.
- **Wall-clock budget** per phase, stated in the round context (defaults: RSVP
  3 min, exploratory 15 min, Round 1 15 min, Round 2 10 min,
  operator-overridable). A dispatch past its budget is stopped.
- **One failure rule.** A persona that is silent, past budget, or returns
  malformed, over-length, or validator-rejected output gets **one automatic
  retry** with the reason; if that fails too, or the persona is not installed, it
  **counts as ABSTAIN, reason recorded in the roster**. No substitute lens.
  Retries, fallbacks and abstentions go in the record's bindings and are never
  asked live. The operator is asked only when the round cannot reach a valid
  result alone: quorum (≥3) fails after the Phase 1 evidence check, or a lost
  seat leaves a 🔴 finding without enough voters. A "version mismatch" is
  reported once for the round (`CONDUCTOR.md` § Ports).
- **Memory recovery.** After each dispatch, `Read` any new files in
  `.claude/agent-memory/<persona-name>/` — they are the report, and go through
  the record validator like any other reply.
- **Output format.** Each persona returns JSON of the kind its phase names —
  `rsvp` (0.5), `finding-report` (1, and Round-2 derives), `vote-report` (2) —
  checked by the bound record validator (`chorus-core/CONDUCTOR.md` § Ports)
  before it counts. Field shapes are the bound schema's.

## The procedure

### Phase 0 — Brief

- **Pre:** the user invoked the skill; the addendum
  (`docs/reviews/CHORUS-PROJECT.md`) is located or its absence confirmed.
- **Post:** scope banded per catalog rows 9–10 (🟢 or 🟡-with-recorded-defaults);
  date stamp chosen; round context drafted with phase budgets.

Read `ADDENDUM-AND-SCOPE.md` for the addendum's items, the exclusion text baked
into every brief, and Security-and-Trust's scope override.

The roster is the persona agents in `agents/`: Evans (DDD), Richards
(architecture), Cooper (adversarial product), Norman (HCD), Uncle Bob (clean
code/SOLID), Beck (TDD/simple design), Delivery-and-Ops, Security-and-Trust,
Goldratt (constraint & flow), and the **optional language lens** Guido (Python),
included when the anchor surface has recently-changed Python.

The **round context** is one paragraph of concrete since-last-chorus deltas
(commits/PRs, specs, infra and release-path changes, incidents, anything excluded
this round). It MUST name concrete deltas, not "general project state".

### Phase 0.5 — RSVP (per-round self-selection)

- **Pre:** Phase 0 post holds.
- **Post:** every roster member has replied `JOIN`, **exceptional entry**, or
  `ABSTAIN` with a one-line reason (or counts as ABSTAIN under the failure rule);
  seating is resolved; joiner count `J` and the quorum branch are recorded.

Dispatch all roster personas in parallel (`run_in_background: true`). Each brief:
lens identity, the round context, the exclusion list (or Security's override),
and RSVP instructions — ≤80 words, `JOIN` / `ABSTAIN` / exceptional entry, plus
the two-axis signal (`chorus-core/DECISION-PRIMITIVE.md` § The RSVP signal):
**applicability** (cite ≥1 concrete delta; none → ABSTAIN) and **expected
stakes** (🟢/🟡/🔴-potential + hook). The orchestrator counts; it never
pre-decides whose voice matters.

**Seating.** A cap of five, plus exceptional entry, per
`chorus-core/DECISION-PRIMITIVE.md` § Seating (a tie at the cap is 🟡, row 2).
An exceptional entry cites a concrete uncovered delta no seated lens covers; it
is rare and confers a voice, not weight.

**Quorum.** `J ≥ 3` → proceed, recording who abstained and why. `J < 3` →
re-ask **all** abstainers once with the same added context; still `J < 3` →
**abort**: write `docs/reviews/YYYY-MM-DD-chorus-abstained.md` with each RSVP
reply and revisit at next cadence. Record joiners and abstainers under
`## Roster (this round)` with one-line reasons.

### Phase 0.7 — Exploratory phase (joiners build understanding)

- **Pre:** Phase 0.5 post holds; quorum branch is "proceed".
- **Post:** every joiner has a persisted understanding record; the **one
  batched, sessioned operator interview** has run, every `[gate]` need answered
  (an unanswered gate blocks the round; non-gate gaps may be deferred with a
  recorded degradation summary); project-wide facts went to the addendum **only
  with operator acceptance**; the profile-coverage fitness function passes (or
  its failures are recorded).

The mechanic is `chorus-core/EXPLORATORY-PHASE.md`. The conductor owns the
interview in resumable sessions of ≤ 5 questions; advisors never interview
directly. Persisted memory is an index of locators, never a finding's evidence —
findings re-ground in the live source. Abstainers skip this phase.

### Phase 1 — Round 1 (joiners only)

- **Pre:** Phase 0.7 post holds.
- **Post:** every joiner has a report that passed the evidence check (rule 3)
  or counts as ABSTAIN, each finding carrying its **persona-marked pull-quote**;
  reports are referenceable by file or memory-dir path; `J ≥ 3` re-checked.

Round 1 is **stages 1–2 of the gate primitive**: an optional read-only Extract
pass (a bounded `Explore`) may pre-build `file:line` records, never assigning
severity; then each joiner authors findings **uncapped**. **Read `BRIEFS.md`
§ Round 1 brief before dispatching** — it holds the ten brief sections (anchors,
evidence rule, `PULL-QUOTE:`, `NEED_INFO` + confidence, word limit). Then run the
evidence check (rule 3; a missing pull-quote routes the finding back) and
re-evaluate quorum.

### Phase 2 — Cross-evaluation (Vote and Tally)

- **Pre:** Phase 1 post holds; the findings register is written, every
  pull-quote relayed; `NEED_INFO` flags routed and still-open rows marked held.
- **Post:** every seated joiner that passed the evidence check has voted (or
  counts as ABSTAIN); every flag is resolved or recorded open; the stage-4 count
  has run; the consolidation matrix is written from the count.

Write the **findings register** (the single human-facing source of truth) before
the vote; dispatch one Round 2 brief per seated joiner (vote PRIORITIZE /
CONFIRM / OVER-RATE / NEED_INFO on others' findings, derive `R2-` findings in
their own territory, convergence notes as `PULL-QUOTE:`); then count
(`chorus-core/GATE-PRIMITIVE.md` § Stage 4) and write the matrix. **Read
`BRIEFS.md` for the register rules, the Round 2 brief, and the matrix.**

### Phase 3 — Conflict reconciliation

- **Pre:** Phase 2 post holds.
- **Post:** genuine conflicts are framed as `Cn` and each is resolved by an
  `advisor()` ruling or recorded **unresolved for the operator**; skipped with a
  one-line note when there are none.

Genuine conflicts only (not emphasis differences): who disagrees, over what, and
how the user-visible outcome differs. State them in one brief and call
`advisor()` once. Its rulings **annotate the ranking and never change counted
severity**. If `advisor()` is unavailable, record each conflict unresolved.

### Phase 4 — Ranking

- **Pre:** Phase 3 post holds.
- **Post:** a top five drafted by the conductor (not delegated), each entry
  resolved to its pull-quote and traced to its register entry; held findings
  listed separately.

Score on **Cost**, **Value** (risk reduced + friction removed + decisions
unblocked), **Constitutional ROI** (only if the addendum lists principles), and
**Convergence** (`P + C`). Open-`NEED_INFO` findings are **held** and excluded
from the top five, as are minority reports; `R2-` findings carry "[ungraded]".
Each top-five entry carries ID, pull-quote, locator and final severity — a bare
`Fn` + score is a dead end.

### Phase 5 — Sign-off

- **Pre:** Phase 4 post holds.
- **Post:** the record is complete and committed (both files, § Artifact); an
  optional `advisor()` sanity pass is recorded if run; if no addendum existed,
  an offer to write `docs/reviews/CHORUS-PROJECT.md` is on record.

## Artifact

The record is a `review-record` JSON, validated and rendered by the bound ports
(`chorus-core/CONDUCTOR.md` § Ports) to a sibling `.md` page — **commit both.**

Name: `<stem>.json` + `<stem>.md`, stem `YYYY-MM-DD-chorus-review` (PR mode
`YYYY-MM-DD-chorus-review-prNNN`). If `docs/reviews/<stem>*` already exists, both
take the lowest free `-N` (N = 2, 3, …).

The most recent record is the next round's primary baseline; older markdown-only
records stay as they are. The rendered page's section order and the failure-mode
table are in `RECORD.md`.
