---
name: chorus
description: Multi-advisor guardrails across SDLC stages (Evans/Richards/Cooper/Norman/Uncle Bob/Beck/Delivery-and-Ops/security/Goldratt): a panel reviews each stage through their lenses with per-round RSVP self-selection, cross-evaluation, conflict reconciliation, and ranked recommendations. Use when the user asks for a chorus, a project-state review, or to "spawn the regular chorus." Produces a durable artifact at docs/reviews/YYYY-MM-DD-chorus-review.md. Also supports an agent-SDLC lifecycle mode ("run the agent-SDLC on feature 0NN") that interleaves scoped chorus gates with the speckit cycle — see SDLC-LAYER.md — and a "chorus learn" tutorial mode (trigger: "chorus learn" / "/chorus learn"), an interactive staged onboarding that teaches setup and both review modes — see LEARN.md.
---

# Chorus — repeatable procedure

A multi-lens guardrail you can drop onto any SDLC stage — **most often a spec or
a feature's design, occasionally a full-codebase sweep.** A panel of persona
lenses reviews the stage; each round produces a durable artifact future rounds
baseline against, rather than re-derive.

This skill is project-agnostic. Project-specific facts (exclusions, topology,
security data-surface, baseline references) come from an optional per-project
addendum — see "Project addendum" below.

**Before Phase 0, the calling session MUST `Read` the companion file
`INTEGRATION-LAYER.md` in this skill directory.** It defines the integration
layer (the calling session itself) — its position in the system, per-phase
pre/post-conditions, invariants, and refusals. The procedure here describes
*what* the chorus does; the integration-layer file describes *who runs it
and what they are not allowed to do*. Both are load-bearing.

The mechanic of a single review — the four stages **extract → author → vote →
tally** — is defined once in `GATE-PRIMITIVE.md`; Phases 1/2/4 below run it
(this file does not restate the mechanic). For the agent-SDLC lifecycle mode,
read `SDLC-LAYER.md` as well.

Before findings are authored, participating advisors build a persisted,
lens-specific understanding of the target — the **exploratory phase**, defined
once in `EXPLORATORY-PHASE.md` (Phase 0.7 below). Both review modes run it; this
file does not restate it.

When the chorus must involve the operator — seating a capped panel, blocking on a
🔴, confirming scope — the decision is banded by the **decision primitive**, defined
once in `DECISION-PRIMITIVE.md`: 🟢 auto-resolve, 🟡 proceed-with-recorded-default +
async override, 🔴 hard-block + instant ask, by declared catalog predicate (never
orchestrator inference). It makes the workflow **self-unblocking yet balanced** — it
runs forward, stopping the operator only for 🔴. Both review modes reference it;
this file does not restate it.

## Three modes

The chorus has three modes — two *review* modes built on the same gate primitive
(`GATE-PRIMITIVE.md`), plus a navigational tutorial:

- **Project-state round** — a multi-lens review of a scope you choose: most
  often a spec or a feature's design, occasionally the whole codebase (the
  periodic full sweep). Trigger: "spawn the chorus." Output:
  `docs/reviews/YYYY-MM-DD-chorus-review.md`.
- **Agent-SDLC** (lifecycle) — gates the speckit cycle for one feature with
  design, plan/tasks, and implementation reviews. Trigger: "run the agent-SDLC
  on feature 0NN." Driven by `SDLC-LAYER.md`; output:
  `specs/<feature>/agent-sdlc-log.md`. Read `SDLC-LAYER.md` before running it.
- **`chorus learn`** (tutorial) — an interactive staged onboarding that teaches
  setup and both review modes via the AskUserQuestion tool, mutating nothing
  except one opt-in scaffold. Trigger: "chorus learn" / `/chorus learn`. Defined
  once in `LEARN.md` (this file carries only its registration). The two review
  modes are gated; the tutorial is navigational.

## When to use

- **Reviewing a spec or a feature's design** across multiple lenses — the common
  case. Say "spawn the chorus" pointed at the spec, or "run the agent-SDLC on
  feature 0NN" for the gated lifecycle (see `SDLC-LAYER.md`).
- **A full-codebase sweep** for periodic project-state review — the occasional
  case; quarterly or after a major release.

Don't use for:
- Single-lens questions (just spawn the relevant persona agent directly)
- Line-by-line review of a PR diff (use `superpowers:code-reviewer` or
  `/ultrareview` — the chorus reviews specs and design, not diffs)
- One-off architecture questions (use `mark-richards-architect` solo)

## Project addendum

Each project that runs the chorus should provide a per-project addendum at:

    docs/reviews/CHORUS-PROJECT.md

If present, the orchestrator reads it before Phase 0 and uses its contents to
fill the project-specific slots in the procedure. If absent, the orchestrator
asks the user inline at Phase 0 and offers to write the file at the end of
the round.

**Phase-0 note — the scaffolded-but-unfilled addendum (FR-014).** The `chorus
learn` tutorial can scaffold this addendum (see `LEARN.md` S2), producing a file
that bears a **SCAFFOLDED marker** on its first content line and carries sections
2/3/5 flagged `<!-- TO FILL -->`. A marker-bearing addendum is **structure, not
facts**, and both of its consumers MUST treat it so:

- the **Phase-0 orchestrator** confirms the flagged sections with the operator
  (as if those sections were absent but pre-structured) and never consumes their
  placeholder text as operator-confirmed project facts;
- the **per-advisor exploratory cache** (`EXPLORATORY-PHASE.md`) caches a
  marker-bearing addendum's content as structure only — never as
  operator-confirmed facts.

As defense-in-depth, both consumers also treat any section still bearing a
`<!-- TO FILL -->` flag (or visibly templated `<placeholder>` text) as unfilled
structure **even if the marker is absent** — so a marker accidentally stripped
before the sections are filled cannot silently promote placeholder text to
operator-confirmed facts (Gate C SEC-1).

Removing the marker is the operator's "this is now real" signal. The tutorial's
end-of-round addendum offer (Phase 5 — Sign-off) and this scaffold are the two
creation paths; the template is the single source of structure for both (F22).

The addendum should contain:

1. **Project summary** — 2–3 sentences. Topology (monolith / services / clients),
   primary languages, where the constitutional or governance docs live (if any).
2. **Default scope exclusions** — paths the chorus must not produce findings
   about (legacy directories, runtime data dirs, generated code). One bullet
   per path with a one-line justification.
3. **Default anchor surface** — the actively-developed paths the chorus
   *should* focus on (e.g., `webapp/`, `app/`, `specs/` for a layered repo).
4. **Constitutional / governance principles** (if any) — numbered or named
   principles the project anchors trade-offs against. Used by Phase 4 ranking
   under "Constitutional ROI." If none exist, that ranking dimension is
   skipped.
5. **Security data-surface checklist** — project-specific items (token storage,
   PII flows, key exposure, log redaction, callback validation). Passed
   verbatim to the Security-and-Trust persona's brief on top of its default
   anchor list.
6. **Baseline references** — paths to prior chorus artifacts the next round
   should treat as already-accounted-for. The most recent artifact is the
   primary baseline.
7. **Anchor-discovery procedure** — project-specific shape of the lightweight
   procedure the orchestrator uses each round to build Phase 1's "existing
   artefacts to re-examine first" list dynamically. Static anchor lists go
   stale; a procedure stays current. Typical components:
   - **Architecture doc** — the single index of truth-pointers (e.g.,
     `docs/architecture.md`); the orchestrator reads it as the first anchor.
   - **Spec head-scan** — instead of reading every spec fully, the orchestrator
     does `head -n 20 specs/<NNN-slug>/spec.md` per relevant spec to know
     what it covers. Specs are starting points; the head-scan is the cheapest
     way to identify which spec(s) the round touches.
   - **Memory recall** — `memsearch` or the project's memory recall surface,
     for prior context on the round's deltas (what did the team learn last
     time? what was deferred? what's a known fragile area?).
   - **Spec-slug grep** — `rg "specs/0[0-9]+" --type <lang>` to find code
     that references specs explicitly; each match is a pointer from code →
     spec → invariant chain. Follow the chain; do not stop at the spec.
   The output of the procedure IS the per-lens anchor list that Phase 1
   section 4 of the brief consumes. Item 3 (Default anchor surface) gives
   the static fallback when discovery yields nothing; item 7 is the dynamic
   first move.

When an addendum is missing, the orchestrator MUST ask the user for items
(2), (3), and (5) at minimum before launching agents. Items (1), (4), (6),
(7) can be inferred from `CLAUDE.md` / `AGENTS.md` / repo layout if not
provided.

## Required scope-exclusion gate (run BEFORE spawning agents)

Prior chorus rounds have been dominated by findings about legacy or
out-of-investment code, crowding out signal from actively-developed surface.
The exclusion gate prevents this.

**Before launching any agents, the orchestrator MUST:**

1. **Load the project addendum** (or ask the user inline if absent) for the
   default exclusion list. Typical exclusions:
   - Legacy directories the team has consciously labeled as tech debt
   - Runtime data directories (no source code to review)
   - Generated code (auto-generated headers / `# AUTO-GENERATED` markers)
   - Anything `CLAUDE.md` or equivalent explicitly names as
     "do not replicate; do not extend"

2. **Confirm the exclusion list with the user before launching.** Ask: "Which
   legacy / POC paths should the chorus exclude? Default exclusions are X, Y, Z
   — should I add or remove any?" One question, one answer, then launch.

3. **Bake the exclusion list into every agent brief.** Each persona agent's
   prompt MUST include a section like:

   > **Out of scope for this review:** the following paths are legacy POC code,
   > runtime data directories, or generated code — the team has consciously
   > labeled them as tech debt or non-source and is not currently investing in
   > them. Do not produce findings about these paths; do not let them dominate
   > your findings. If you would have ranked a legacy-only finding highly,
   > redirect that energy to the actively-developed surface.
   >
   > [verbatim exclusion list with one-line justifications]
   >
   > Findings about the *active* code (per addendum's anchor surface) are in
   > scope, including findings about how active code interacts with the legacy
   > boundary (the boundary itself is in scope; the legacy module's internals
   > are not).

4. The Security-and-Trust persona has different scope rules — see
   "Security-and-Trust lens" below. Security IS in scope on legacy paths
   because exfil risk doesn't care about tech-debt labels.

## The procedure

### Phase 0 — Brief

- Load the project addendum (or interview the user inline if absent).
- Confirm scope-exclusion list with the user (above).
- Confirm any *additional* lenses to include or omit. Default chorus roster is nine:
  - Evans (DDD), Richards (architecture), Cooper (adversarial product),
    Norman (HCD), Uncle Bob (clean code/SOLID), Beck (TDD/simple design),
    Delivery-and-Ops (CD discipline / operability / observability / cost),
    Security-and-Trust (trust boundaries / threat modeling / security poverty line),
    Goldratt (constraint & flow — deferral / opportunity cost / learning-loop throughput).
  - Per-round participation is decided by the Phase 0.5 RSVP step;
    the default *roster* is nine, the actual quorum each round may be smaller.
- **Optional language lenses** — not part of the default nine; include one at Phase 0 when the
  round's anchor surface is in its language, and let the Phase 0.5 RSVP drop it otherwise:
  - Guido (Python — idiom, PEP 8/20, type-hint correctness, stdlib-first). Joins only when the
    target has recently-changed Python; abstains on non-Python rounds.
- Confirm date stamp for the artifact (`docs/reviews/YYYY-MM-DD-chorus-review.md`).

### Phase 0.5 — RSVP (per-round self-selection)

Between the brief and Round 1, each persona on the roster decides whether to
weigh in on this round. Personas self-select; the orchestrator balances for
quorum. The point is to avoid low-signal filler when the round's deltas don't
touch a given lens, without letting the orchestrator pre-decide whose voice
matters.

#### Inputs

Orchestrator drafts a one-paragraph **round context** capturing the
since-last-chorus delta:
- commits and PRs landed
- specs created or completed
- infra changes (new IaC, deployment, release-path edits)
- known incidents or user-visible events
- anything the user has explicitly excluded this round

This paragraph is the body of the RSVP prompt. It MUST contain concrete
deltas, not "general project state" — vague inputs produce performative joins.

#### Mechanism

Dispatch all roster personas in parallel (`run_in_background: true`). Each
agent receives a short, self-contained brief:
1. Their lens identity
2. The round-context paragraph
3. The scope-exclusion list (verbatim, as in Phase 1 below)
4. RSVP instructions: reply in ≤80 words with `JOIN` or `ABSTAIN`, plus the
   **two-axis signal** (`DECISION-PRIMITIVE.md` §RSVP signal) — **applicability**
   (cite ≥1 concrete round-context delta your lens touches; no citable delta →
   ABSTAIN) and **expected stakes** (🟢/🟡/🔴-potential + a one-line hook) — and a
   one-sentence reason. (This replaces the old relevance 0–3 score, which degenerated
   to all-3s; seating ties on it are now a self-unblocking 🟡, not an operator ask.)

Cost: ~7 small parallel calls, ~30s wall time, ~3K tokens total. Cheap
relative to a saved Phase 1 round.

#### Quorum rules

Let `J` be the count of joiners.

- **`J ≥ 5`** — proceed; full chorus.
- **`J ∈ {3, 4}`** — proceed with reduced quorum. The artifact records which
  lenses abstained and why.
- **`J < 3`** — orchestrator picks the most-relevant abstainer(s) using the
  round-context paragraph and re-pings them with one extra paragraph of
  context (e.g., "the round includes the new release pipeline; your lens is
  the only one likely to surface release-path risk"). If they still abstain,
  **abort the chorus** for this round. Write
  `docs/reviews/YYYY-MM-DD-chorus-abstained.md` containing each lens's RSVP
  reply, and revisit at next cadence. Do not fake a chorus.

**Why odd numbers (3, 5):** Phase 3 conflict reconciliation can produce
lens-vs-lens splits. An odd quorum avoids 2-vs-2 deadlocks that force every
conflict to `advisor()`.

**Why agent-call, not heuristic:** the orchestrator pre-deciding which
personas are relevant defeats the purpose of independent voices. RSVP cost
is small relative to one persona's saved Phase 1 round.

#### RSVP record

Append the joiners/abstainers list (with one-line reasons) to the artifact
under a `## Roster (this round)` heading. Future chorus rounds use this to
detect drift — if a persona has abstained four rounds running, the round-
context paragraph may not be surfacing relevant deltas honestly.

### Phase 0.7 — Exploratory phase (joiners build understanding)

Between RSVP and Round 1, each joiner runs the **exploratory phase** — defined
once in `EXPLORATORY-PHASE.md`, run cheapest-subset-first. In brief: load the
lens's `Information needs (exploratory phase)` profile → reuse the prior record +
compute deltas / stale refs → harvest **reference-first, addendum-first** (record
locators, not copies) → bounded, operator-budget-controlled analysis for what's
undocumented → emit gap-questions. The orchestrator then runs **one batched
operator interview**, delivered in **resumable, operator-paced sessions of ≤ 5
questions** (deferring a session leaves open gaps plus a verdict **degradation
summary**); project-wide answers are written back to the addendum
(operator-accepted), lens-specific answers to the asking advisor's record. A
**profile-coverage fitness function** confirms every profile need resolved before
findings are authored.

This **supersedes the per-round cold read**: Round 1 (the Author stage below) is
produced *from* the persisted understanding. Persisted memory is an **index of
locators, never a finding's evidentiary endpoint** — findings re-ground in the
live material. Abstainers do not run the phase. See `EXPLORATORY-PHASE.md` for the
full mechanic, the two-tier memory (the addendum is the authoritative base; records
may cache it), and staleness/reconciliation rules.

### Phase 1 — Round 1 (parallel persona agents — joiners only)

Spawn all Phase-0.5 joiners in a single message, `run_in_background: true`.
Each agent's brief must be **self-contained** (the agent doesn't see this
conversation). Abstainers are skipped entirely — do not brief them, do not
include their findings as `[no comment]` rows; just record their RSVP reply
in the round roster (see Phase 0.5).

Round 1 is **stages 1–2 of the gate primitive** (`GATE-PRIMITIVE.md`): an
optional read-only Extract pass (a bounded `Explore`) may pre-build structured
`file:line`-anchored records the personas author from, then each persona
authors findings **uncapped** (stage 2). The Extract pass is invisible to the
operator and never assigns severity.

Required brief sections per agent:

1. **Lens identity** — "you are one of N advisors in a chorus review" (where
   N is the joiner count).
2. **Project topology** — pulled from the project addendum's "Project summary"
   item; include constitution / governance doc location if any.
3. **Scope-exclusion list** (verbatim, see above).
4. **Existing artefacts to re-examine first** — the load-bearing brief
   section. Artefacts come in many forms: code, tests, configs, dashboards,
   SQL, runbooks, ADRs, specs, BDD scenarios, AsyncAPI/OpenAPI contracts.
   **Specs are starting points, not endpoints** — every `specs/<NNN-slug>`
   reference in the codebase is a pointer; follow it. Apply the why-why-why
   mantra: **do not stop at any single artefact unless it is an invariant**
   — an executable assertion (BDD, fitness function, architectural test) or
   a principle stated in the project's constitution/governance doc. A spec
   that has no executable assertion is intermediate; chase it down to the
   test or principle it implements, OR surface the gap as the finding.

   Build the anchor list using the project addendum's item 7 (Anchor-
   discovery procedure) — architecture doc, spec head-scan, memory recall,
   spec-slug grep. Yields 4–8 specific paths per lens with `file:line`
   targets where known. Mix artefact types where appropriate. The phrase
   to ban is *"read whatever seems relevant"*; the phrase to bake in is
   *"chase this artefact until you hit an invariant or run out of pointers."*

   Section 4 closes with the mandate: **"Before you write a finding, you
   MUST have either followed the artefact chain to an invariant or runs-
   out-of-pointers, OR tagged your finding `[principle]` (existing,
   cited) / `[principle:proposed]` (newly named)."**
5. **Prior position to challenge** *(optional but high-leverage when
   applicable)* — if a multi-turn design chat or a prior chorus has produced
   a consensus, state it verbatim and direct the persona to attack it with
   code-grounded behavioural evidence, not re-derive from principles.

   Framing the persona must carry into Round 1: **principles (invariants)
   ARE load-bearing** — they are the Platonic foundation the system is
   built on; a lens-internal principle is not "just opinion." HOWEVER,
   **declared intentions are not behaviour** — a documented invariant
   that no executable assertion enforces is a claim, not a fact. Code is
   the final truth on what the system actually does. The brief instructs:
   *"Attack declared intentions with behavioural evidence; respect
   invariants by citing where they are enforced (or surface the absence
   of enforcement as the finding)."*
6. **Numbered questions** — 4–7 questions through that lens.
7. **Word limit** — 500–700 words. This bounds *prose density per finding*,
   not the *number of findings*: authoring is **uncapped** (primitive stage 2).
   Do not pad to a count, and do not trim findings to fit — let the count fall
   where the evidence lands.
8. **Evidence rule** — every finding either cites `file:line` (claims
   about THIS project's artefacts) OR carries an explicit `[principle]`
   tag (existing principle — MUST cite where established: constitution
   clause, prior chorus finding, project doc) OR `[principle:proposed]`
   tag (genuinely new principle being named for the first time).
   Findings making project-specific claims without `file:line` and not
   principle-grounded are unsupported and demoted at the Phase-1 evidence-
   check gate (see below).
9. **Required ending** — "End with [specific call-to-action: a
   recommendation, a finding, a persona name]."
10. **Pull-quote mark (per finding)** — "For each finding, mark **one short
    sentence in your own words** as its pull-quote — the line that best
    characterizes the finding as *you* see it — and give its evidence locator
    (`file:line` or principle tag). Format the mark so the integration layer can
    lift it verbatim, e.g. a line beginning `PULL-QUOTE:` directly under the
    finding." This is the voice the artifact relays unedited (spec
    `008-detail-rich-relay`, FR-002): the integration layer **selects nothing** —
    it relays the span you marked. A finding with no marked pull-quote is routed
    back to you; the conductor never excerpts or paraphrases one for you.

**Persona-agent failure mode (hung-on-enumeration pattern):** if an agent goes
silent for >5 minutes with a substantial transcript already written, it has
hung on "enumerate everything" mode. Kill it. Substitute with a bounded
`Explore` agent that asks the same questions but with hard sampling rules
("read no more than 15 files; pick 2 randomly; do not enumerate"). Mark in
the doc that the lens was substituted, not delivered.

**Memory recovery:** some personas (notably Evans) tend to write their actual
report to `.claude/agent-memory/<persona-name>/` and return only a summary.
After each agent completes, check that path and `Read` any new memory files —
those ARE the report content.

#### Phase 1 evidence check (gate before writing the register)

Before writing the findings register, the integration layer scans each
Round-1 report and verifies:

1. **Tool-use count > 0** — the agent opened at least one artefact. Zero-
   tool-use reports are re-dispatched ONCE with an explicit "Read these
   artefacts first: …" amendment. A second zero-tool-use round → mark the
   lens **substituted-without-evidence** in the artifact; do not register
   findings from that lens.

2. **Project-specific findings carry `file:line`.** Findings making claims
   about THIS project without `file:line` and without a principle tag get
   demoted to `[unsupported]` rows in the register — they appear with the
   tag visible, do not enter the matrix, and do not contribute to
   convergence counts. Pure `[principle]` findings (existing, cited) and
   `[principle:proposed]` findings (newly named) are accepted as-is.

3. **A pull-quote was marked** (Phase-1 brief item 10). A finding whose persona
   marked no pull-quote is routed back to that persona to mark one; the
   integration layer never selects or authors a span itself. The register's
   pull-quote cell preserves the `[principle]` / `[principle:proposed]` /
   `[unsupported]` tag alongside the verbatim line so future readers can
   distinguish evidence-grounded findings from declarative or unsupported ones at
   a glance.

The gate is enforced by I8 in `INTEGRATION-LAYER.md`. The integration layer
never accepts a report whose project-specific findings lack `file:line` or
a principle tag.

### Phase 2 — Cross-evaluation (parallel reactions, one per joiner)

Once all Round 1 reports are in, write a **findings register** — the **single
human-facing source of truth** for every finding — followed by a **consolidation
matrix** that is a *projection* of it (spec `008-detail-rich-relay`).

**Findings register** — one entry per finding, written BEFORE the matrix. Each
entry carries enough that an operator who has **not** read the Round-1 reports can
understand it from the entry alone (FR-004/FR-007):

| ID | Advisor · Lens | Severity | Target (locator) | Pull-quote (verbatim — the persona's own words) |
|----|----------------|----------|------------------|--------------------------------------------------|
| F1 | Evans · DDD | 🔴 | `webapp/data/models.py:42` | "The Order aggregate has no root to enforce its invariants — it can be persisted in a state the domain forbids." |
| … | | | | |

- The **Pull-quote** cell is the persona-marked span (Phase-1 brief item 10),
  lifted **verbatim** and attributed — never a conductor paraphrase and never a
  conductor-chosen excerpt (this is the I6 / "speak in a persona's voice" refusal,
  mechanized). Preserve any `[principle]` / `[principle:proposed]` / `[unsupported]`
  tag in the cell.
- For each **convergent** finding, list the converging lenses directly under its
  entry, each with its **own** one-line verbatim note (marked in Round 2, below) —
  so "3 lenses converged" reads as *which three and in whose words*, not a bare
  count:
  > **Converging:** Richards · *"this is the same seam I flagged — the model leaks
  > persistence concerns"*; Beck · *"agreed, and the duplication makes it worse"*.
- A finding with no persona-marked pull-quote is routed back, not summarized by the
  conductor (Phase-1 evidence check item 3).

**Consolidation matrix** — a **derived projection** of the register for
scoring/ranking, columns = `[ID, severity (🔴🟠🟡🟢), convergence count, lenses
converged]`. Severity and the convergence set come **from the register entries** —
the matrix re-authors nothing, so severity appears authoritatively in exactly one
place and the two surfaces cannot drift (FR-007). Cite finding IDs `F1`, `F2`, …
so they remain referenceable.

After appending the matrix, add a `### Round 1 brief` subsection (3–5 sentences)
summarizing the dominant themes across all findings — what the round found as a
whole, not a per-finding list. This is the entry point for future readers.

Then spawn one Round-2 agent per Phase-1 joiner (skip abstainers entirely;
skip any persona whose Round 1 was substituted with a bounded `Explore` —
no original report to react with). Each gets:

1. **Pointer to the matrix** at the artifact path (they `Read` it).
2. **Their Round 1 findings IDs** explicitly listed (so they don't react to
   their own — S8: the author of a finding is never its grader).
3. **Five questions through their lens:**
   - Agreements you'd sharpen (especially blind spots others caught)
   - Pushbacks (where the matrix mis-frames, in your lens)
   - Overreach (where another lens spoke outside its authority)
   - Retract or sharpen anything from your Round 1
   - Cross-cutting themes the matrix flagged
4. **Evidence rule continues in Round 2.** Agreements, pushbacks, overreach
   claims, and retractions that make project-specific assertions cite
   `file:line`. "I read X.py:NN and confirm Bob's claim" is a citation.
   "Bob is correct" with no file reference is `[principle]` at best
   (existing, cited) or `[unsupported]` at worst. Genuinely new principles
   introduced in Round 2 carry `[principle:proposed]`. The same
   evidence-check gate that ran post-Round-1 runs post-Round-2: unsupported
   project-specific assertions are demoted, not registered as findings.
5. **End with:** "which finding does YOUR-LENS want PRIORITIZED, and which
   does YOUR-LENS think is over-rated?"
6. **Convergence note (per agreement)** — "For any finding you converge with,
   mark **one short sentence in your own words** as your agreement note (same
   `PULL-QUOTE:`-style mark as Round 1). This is relayed verbatim under the
   finding's register entry; the integration layer never writes it for you."

Word limit: 500–600.

Phase 2 is **stage 3 (Vote)** of the gate primitive: PRIORITIZE / OVER-RATE are
the votes. After the reactions arrive, finalize each finding's severity with the
primitive's **deterministic stage-4 tally** (`GATE-PRIMITIVE.md`): among
non-author voters, `net = P − O`; `net ≥ +2` escalates one level, `net ≤ −2`
demotes one level, otherwise hold. The long-standing "two converging lenses earn
🔴" rule *is* this tally (a convergent PRIORITIZE escalation). Severity is
arithmetic over real votes — never the orchestrator's judgment (S9).

After Round 2 reactions arrive, append a `### Round 2 brief` subsection to the
artifact (2–4 sentences): which findings were sharpened, which were pushed back
or retracted, and what net movement the round produced. One sentence per
significant change is sufficient — future readers need to know what changed, not
a full replay.

### Phase 3 — Conflict reconciliation (one `advisor()` call)

After Round 2 reactions arrive, identify *genuine* conflicts (not just
emphasis differences). Frame each as `Cn`: which advisors disagree, what the
disagreement is, what the user-visible outcome differs across.

State the conflicts in a brief and call `advisor()` (no parameters; it sees the
full transcript). Advisor will return tiebreaker reasoning per conflict.

Single advisor pass beats another agent round here: conflicts converge faster
when one stronger reviewer arbitrates than when multiple lenses re-litigate.

Append a `### Phase 3 brief` subsection to the artifact: one bullet per conflict
(`C1`, `C2`, …) stating what was disputed, how it was resolved, and which finding
ID carries the outcome. Future readers must be able to follow the reasoning chain
from `Fn` in the top-5 back through to how any conflicts touching it were settled.

### Phase 4 — Ranking

Score surviving recommendations on:

- **Cost** — low / medium / high (LOC, sessions, dependencies)
- **Value** — risk reduced + friction removed + decisions unblocked
- **Constitutional ROI** *(only if the project addendum lists governance
  principles)* — does the recommendation advance enforcement of those
  principles, or paper over them? Skip this dimension entirely if the project
  has no codified governance doc.
- **Convergence** — how many lenses landed on it independently?

Produce a top-5. Prefer drafting yourself rather than spawning yet another
ranking agent — by Phase 4 the keystones are explicit and a fresh agent will
mostly restate. Use `advisor()` for sanity-check after drafting if the
ordering is non-obvious.

Each top-5 entry MUST carry enough to be understood in place — its `Fn` anchor,
the persona-marked pull-quote, and the locator — and MUST trace back to the
finding's register entry (FR-008). An entry that is a bare `Fn` + score is a
dead-end reference; resolve it to its pull-quote. Conflicts (`Cn`) in the Phase 3
brief carry the same: enough detail to follow in place, traced to the findings
they touch.

### Phase 5 — Sign-off

Add three sections to the artifact before publishing:

1. **TL;DR / executive summary** at the top — 3 sentences: chorus found *what*,
   top-5 prioritizes *X/Y/Z*, public rollout is blocked by *Fa/Fb/Fc* (if any).
2. **Pre-public-rollout gate** subsection — any 🔴 findings that block ship,
   tracked as a unit even if some are not in top-5.
3. **Next-chorus baseline** section — what the next round should *assume*
   closed/in-progress vs re-evaluate. Without this, the next chorus
   re-derives everything.

Then call `advisor()` once for the final sanity pass.

If no project addendum exists, **also offer to write
`docs/reviews/CHORUS-PROJECT.md`** distilling the answers the user gave at
Phase 0 so the next round starts from a baseline, not from interview again.

## Security-and-Trust lens (scope override)

The Security-and-Trust persona participates via RSVP like the other eight personas, but
its scope rule is different: **the general scope-exclusion list does NOT
apply to this lens**. Exfil risk does not care about tech-debt labels — a
legacy module that touches credentials, runs in production, and is reachable
from the network is in scope for Security-and-Trust regardless of whether the
rest of the chorus excludes it.

This rule lives in the persona's brief (the agent file's "A note on legacy"
section). The orchestrator's Phase 1 brief for Security-and-Trust must NOT
include the scope-exclusion list verbatim the way it does for the other
eight personas; instead, brief Security-and-Trust that **legacy paths are
in scope when they expose attacker surface**, and that the general
scope-exclusion list applies only to non-security concerns.

The project addendum's section 5 (Security data-surface checklist) carries
project-specific items the Security-and-Trust persona should layer on top of
its default anchor list (auth surfaces, trust boundaries, supply chain,
secrets, egress, log redaction). Pass that checklist verbatim in the brief.

When Security-and-Trust RSVPs JOIN, its findings land in the matrix as the
next available `Fn` IDs alongside the other personas — same severity scheme,
same evidence rule (I8). When it ABSTAINS, no separate security pass runs;
the round proceeds without security findings, recorded honestly in the round
roster like any other abstention.

## Failure modes (collected from prior runs)

| Symptom | Cause | Fix |
|---|---|---|
| Persona agent silent >5 min with large transcript | "Enumerate everything" mode | Kill, substitute with bounded `Explore` scan |
| Findings dominated by legacy code | No exclusion gate | Phase 0 scope confirmation |
| Reports return summaries only, no content | Agent wrote to its memory dir | Check `.claude/agent-memory/<persona>/`, `Read` any new files |
| Agent opined without reading (project-specific claims with no `file:line` and not principle-grounded) | Brief did not mandate artefact-chain following, OR persona reasoned purely from training | Re-dispatch once with explicit "Read these artefacts first: …" amendment. Existing principles the persona invokes MUST cite where established (constitution clause, prior chorus finding, doc); new principles tag `[principle:proposed]`. Pure unsupported claims about the project get demoted to `[unsupported]` and excluded from the matrix. |
| Phase 2 takes longer than Phase 1 | Briefs too open-ended | Tighter numbered questions, finding-IDs listed explicitly |
| Conflicts unresolved after Phase 2 | Lens-vs-lens disagreement won't self-resolve | Single `advisor()` call beats another round |
| All personas join every round | RSVP became performative; round context too vague | Tighten round-context paragraph; require concrete deltas, not "general project state" |
| Project-fact interview every round | Missing project addendum | Phase 5 offers to write `CHORUS-PROJECT.md` |
| Artifact references Fn/Cn that have no description | Findings register omitted; matrix-only artifact | Phase 2 requires the detail-rich findings register (with persona-marked pull-quotes) before the matrix; the matrix is a projection of it |

## Artifact path

`docs/reviews/YYYY-MM-DD-chorus-review.md` — **commit it.** The point is the
durable baseline. The most recent artifact in that directory is the next
round's primary baseline reference.
