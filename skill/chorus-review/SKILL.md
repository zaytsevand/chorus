---
name: chorus-review
description: Multi-advisor project state review (Evans/Richards/Cooper/Norman/Uncle Bob/Beck/Delivery-and-Ops/security) with per-round RSVP self-selection, cross-evaluation, conflict reconciliation, and ranked recommendations. Use when the user asks for a chorus, a project-state review, or to "spawn the regular chorus." Produces a durable artifact at docs/reviews/YYYY-MM-DD-chorus-review.md.
---

# Chorus Review — repeatable procedure

A periodic multi-lens review of project state. Each round produces a durable
artifact future rounds baseline against, rather than re-derive.

This skill is project-agnostic. Project-specific facts (exclusions, topology,
security data-surface, baseline references) come from an optional per-project
addendum — see "Project addendum" below.

**Before Phase 0, the calling session MUST `Read` the companion file
`INTEGRATION-LAYER.md` in this skill directory.** It defines the integration
layer (the calling session itself) — its position in the system, per-phase
pre/post-conditions, invariants, and refusals. The procedure here describes
*what* the chorus does; the integration-layer file describes *who runs it
and what they are not allowed to do*. Both are load-bearing.

## When to use

- User says "spawn the chorus", "chorus review", "Evans/Richards/etc. round"
- User asks for a project-state evaluation across multiple lenses
- Quarterly cadence (or after a major release, before a quarter-end)

Don't use for:
- Single-lens questions (just spawn the relevant persona agent directly)
- Code review of a specific PR (use `superpowers:code-reviewer` or `/ultrareview`)
- One-off architecture questions (use `mark-richards-architect` solo)

## Project addendum

Each project that runs the chorus should provide a per-project addendum at:

    docs/reviews/CHORUS-PROJECT.md

If present, the orchestrator reads it before Phase 0 and uses its contents to
fill the project-specific slots in the procedure. If absent, the orchestrator
asks the user inline at Phase 0 and offers to write the file at the end of
the round.

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
   PII flows, key exposure, log redaction, callback validation). Layered on
   top of the generic checklist in the Security addendum below.
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

4. The security review pass has different rules — see "Security addendum" below.
   Security IS in scope on legacy paths because exfil risk doesn't care about
   tech-debt labels.

## The procedure

### Phase 0 — Brief

- Load the project addendum (or interview the user inline if absent).
- Confirm scope-exclusion list with the user (above).
- Confirm any *additional* lenses to include or omit. Default chorus roster is seven:
  - Evans (DDD), Richards (architecture), Cooper (adversarial product),
    Norman (HCD), Uncle Bob (clean code/SOLID), Beck (TDD/simple design),
    Delivery-and-Ops (CD discipline / operability / observability / cost).
  - Per-round participation is decided by the Phase 0.5 RSVP step;
    the default *roster* is seven, the actual quorum each round may be smaller.
- Confirm whether the security addendum runs (default: yes).
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
4. RSVP instructions: reply in ≤80 words with `JOIN` or `ABSTAIN`, plus a
   one-sentence reason.

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

### Phase 1 — Round 1 (parallel persona agents — joiners only)

Spawn all Phase-0.5 joiners in a single message, `run_in_background: true`.
Each agent's brief must be **self-contained** (the agent doesn't see this
conversation). Abstainers are skipped entirely — do not brief them, do not
include their findings as `[no comment]` rows; just record their RSVP reply
in the round roster (see Phase 0.5).

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
7. **Word limit** — 500–700 words.
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

3. **The register Summary column** preserves the `[principle]` /
   `[principle:proposed]` / `[unsupported]` tag so future readers can
   distinguish evidence-grounded findings from declarative or unsupported
   ones at a glance.

The gate is enforced by I8 in `INTEGRATION-LAYER.md`. The integration layer
never accepts a report whose project-specific findings lack `file:line` or
a principle tag.

### Phase 2 — Cross-evaluation (parallel reactions, one per joiner)

Once all Round 1 reports are in, write a **findings register** followed by a
**consolidation matrix** as Phase 1 artifact.

**Findings register** — one row per finding, written BEFORE the matrix:

| ID | Advisor | Lens | Severity | Target | Summary |
|----|---------|------|----------|--------|---------|
| F1 | Evans | DDD | 🔴 | `webapp/data/models.py` | Aggregate root has no invariant enforcement; Order can be saved in illegal state |
| … | | | | | |

Every cell in the Summary column must be a complete sentence readable without
context — someone skimming the artifact at next chorus should understand the
finding without reading the Round 1 report. One sentence, ≤20 words.

**Consolidation matrix** — one row per finding, columns = `[ID, severity (🔴🟠🟡🟢),
convergence count, lenses converged]`. Cite finding IDs `F1`, `F2`, ... so they're
referenceable. The matrix is for scoring/ranking; the register is for reading.

After appending the matrix, add a `### Round 1 brief` subsection (3–5 sentences)
summarizing the dominant themes across all findings — what the round found as a
whole, not a per-finding list. This is the entry point for future readers.

Then spawn one Round-2 agent per Phase-1 joiner (skip abstainers entirely;
skip any persona whose Round 1 was substituted with a bounded `Explore` —
no original report to react with). Each gets:

1. **Pointer to the matrix** at the artifact path (they `Read` it).
2. **Their Round 1 findings IDs** explicitly listed (so they don't react to
   their own).
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

Word limit: 500–600.

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

## Security addendum (default-on)

Security review is **in scope on legacy paths** — exfil risk doesn't care about
tech-debt labels, so the general scope-exclusion list does not apply here. Run
as a single `general-purpose` agent (not a persona) with an explicit
data-surface checklist.

**Generic checklist (always applies):**
- Token / credential storage, hash algorithm, transmission (URL, body, headers)
- Session / cookie storage and permissions
- API-key exposure (server-side vs reachable from client)
- PII handling — what data flows to LLMs, third-party APIs, logs, telemetry
- Log redaction — present and symmetric across server, client, tray
- File permissions on directories holding user-supplied data
- Open-redirect / callback / OAuth-state validation
- Cross-context leakage where layer-boundary contracts (e.g., import-linter)
  are not enforced

**Project-specific items** come from the project addendum's "Security
data-surface checklist" item. Layer those on top of the generic list.

Findings land in the matrix as the next available `Fn` IDs after the persona
findings, with the same severity scheme. Re-rank top-5 after security findings
arrive — security 🔴 frequently re-orders the top.

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
| Artifact references Fn/Cn that have no description | Findings register omitted; matrix-only artifact | Phase 2 requires findings register with Summary column before the matrix |

## Artifact path

`docs/reviews/YYYY-MM-DD-chorus-review.md` — **commit it.** The point is the
durable baseline. The most recent artifact in that directory is the next
round's primary baseline reference.
