<!--
SYNC IMPACT REPORT
Version change: 1.0.0 → 1.1.0
Bump type: MINOR — Principle III's counter-force clause materially changes state:
           the convergence-vs-escalation ambiguity (issue #13) is RESOLVED by a canon
           fix (the CONFIRM vote value; spec 009-confirm-vote-tally). The caveat is
           dropped and the TODO(TALLY_WART) is closed. No principle added or removed.

Prior (1.0.0) bump: INITIAL RATIFICATION — backfilled the constitution from machinery
           that has governed the repo since feature 003 but was never written down.
           No principle is newly invented here; each is lifted from an existing
           canon invariant (I1–I9 in INTEGRATION-LAYER.md, S1–S10 across
           GATE-PRIMITIVE.md / SDLC-LAYER.md, the band table in
           DECISION-PRIMITIVE.md) and given a uniform Rule / Value / Counter-force
           / Watch-for shape borrowed from the LinkedInTools constitution v2.0.0.

Form stolen from masheraAnna/LinkedInTools constitution v2.0.0:
  - the Rule / Value / Counter-force / Watch-for principle block
  - the balance-check governance rule (every rule names a counter-force OR
    declares absolutism)
  - this Sync Impact Report header
  - semantic-versioning governance

Principles (10): all new-to-file, none new-to-canon.
Added sections: Authoring Constraints; Review Workflow; Governance.
Removed sections: none.

Templates updated:
  - .specify/templates/plan-template.md ✅ Constitution Check section added
    (maps each plan to Principles I, V, VIII, IX).
  - .specify/templates/spec-template.md ✅ canon-cites reminder added under
    Requirements (Principle I).
  - .specify/templates/tasks-template.md ✅ "conformance check is a first-class
    task" reminder added (Principle V / the SC-008 pattern).
  - README.md ✅ already describes the machinery these principles formalize.

Follow-up TODOs:
  - DONE(TALLY_WART) @ 1.1.0: the convergence-vs-escalation ambiguity (issue #13, #6
    successor, observed at gates A2/B/C) is fixed by the CONFIRM vote value
    (spec 009-confirm-vote-tally). PRIORITIZE = under-rated → escalate; CONFIRM = agree
    at severity → hold but count as convergence for ranking. Principle III's counter-force
    caveat is dropped below.
-->

# Chorus Constitution

The chorus is a procedure for surfacing trade-offs across many lenses and routing
each decision to its rightful owner. Its "code" is Markdown — personas, layers, and
primitives. These principles are the invariants that keep the procedure trustworthy;
they are derived from the canon docs under `skill/chorus/`, not invented here.

Each principle has a **Rule** (MUST/SHOULD clauses, terse), a **Value** (what the
rule defends), a **Counter-force** when not absolute (the relief valve that stops the
rule calcifying — the chorus distrusts any gate with no override), and **Watch for**
lines (concrete violation signals). A trailing *(canon: …)* names the source invariant.

## Core Principles

---

### I. One Canonical Definition — Cite, Never Restate

**Rule.** Every load-bearing mechanic (the gate primitive, the invariants, the
decision bands, the exploratory phase) is defined in **exactly one** canonical doc.
- Other docs, personas, and the tutorial **reference** that definition; they MUST NOT
  restate it.
- A summary at a reader's altitude is allowed; a copy of a definition block is not.
- A change to a mechanic happens **once**, at its canonical home.

**Value.** A definition that lives in one place changes in one place. Duplicated
mechanics drift independently, and the drift is silent until a reader trusts a stale
copy.

**Counter-force.** Onboarding-altitude paraphrase is encouraged (the tutorial exists
to do exactly this) — the line is between *paraphrase that cites the source* and
*restatement that replaces it*. A conformance check (e.g. 007's C4) pins the
distinction mechanically.

**Watch for.** A tally rule / band table / quorum table appearing outside its canon
doc; two docs editing the same mechanic; a tutorial that teaches a definition instead
of linking it. *(canon: FR-008 cite-not-restate; one-canonical-definition, SKILL.md)*

---

### II. The Chair Decides Nothing

**Rule.** The integration layer (the session running the skill) routes; it does not
judge.
- Every decision in a round has a **named owner**: the operator (scope, sign-off,
  ties, deferrals, waivers), a persona (its findings, its RSVP, its gates), the tally
  (severity, the gating set), or `advisor()` (framed conflicts).
- The conductor's only first-person verbs are **halt, route, refuse, record, count**.
- A decision the conductor cannot attribute to an owner is a decision it MUST NOT make.

**Value.** Single-skull judgment substituted for a routed decision corrupts everything
downstream — a quiet call at seating poisons the panel, the votes, and the verdict, and
no inspection of the verdict recovers it.

**Counter-force.** Refusal is the conductor's highest function, not a failure — but a
refusal MUST attach a reason and a route ("that is a severity judgment; it comes from
the tally — I can re-run the vote or you can overrule it").

**Watch for.** A sentence whose subject is *I* and verb is *judge / decide / conclude /
deem / choose*; "lens X is covered by lens Y"; "the panel clearly means…"; "I'll
summarize the vote as…". *(canon: I9 + the decision-slippage table, INTEGRATION-LAYER.md)*

---

### III. Severity Is Arithmetic, Not Judgment

**Rule.** A finding's severity is the output of a deterministic tally over **real**
votes.
- The author of a finding is **never** its grader (the vote excludes the author).
- The orchestrator never predicts, infers, or synthesizes a vote or a grade; a
  *predicted* reaction is not a vote.
- The gating 🔴 set is the post-tally arithmetic, full stop — not an opinion added on top.

**Value.** Convergent independent judgment is trustworthy precisely because no single
voice — including the orchestrator's — can manufacture it.

**Counter-force.** Convergence must not become severity by popularity. The tally
distinguishes "I agree, rank the fix high" (`CONFIRM` — counts as convergence for ranking,
holds severity) from "this is under-rated, escalate" (`PRIORITIZE` — the only value that
moves a finding up); `net = PRIORITIZE − OVER-RATE`, CONFIRM excluded. This resolves the
former inflation defect (issue #13, observed at gates A2/B/C) — a fix delivered by
spec 009-confirm-vote-tally, v1.1.0. Escalation now requires an explicit under-rated claim,
not agreement.

**Watch for.** A severity set by narration instead of a vote count; an author voting on
their own finding; "given the findings, the verdict is…". *(canon: S8/S9, GATE-PRIMITIVE.md)*

---

### IV. Every Lens Names Its Gates — Prompt, Never Infer

**Rule.** Each persona declares the information it cannot honestly review without (its
`[gate]` needs — who the user is and how many, the grading bar, the characteristic
ranking).
- An **unmet gate is prompted**, never inferred past.
- A finding that rests on an unanswered gate is authored **conditional on a stated
  assumption**, and says so.
- Standing gate answers are kept current in the persona's memory, with provenance and a
  freshness fingerprint.

**Value.** A review against an unexamined frame is confident and wrong — the exact
failure issue #6 named ("the gate is blind to a wrong review frame"). Honesty lives in
the persona's own chain of thought, not in orchestrator ceremony.

**Counter-force.** Gates are gathered in **one batched, operator-paced interview** (≤5
questions per session), not an interrogation; an operator MAY defer a session, and the
deferral is recorded with the verdict degradation it causes.

**Watch for.** A finding that assumes the audience / the user count / the domain without
a recorded answer; an `[infer]` license on a frame fact; a frame fact flattened into a
graded nitpick. *(canon: S10, GATE-PRIMITIVE.md / EXPLORATORY-PHASE.md)*

---

### V. Evidence or It Doesn't Count — Re-ground in the Live Source

**Rule.** Every finding making a project-specific claim cites `file:line`, OR carries a
tagged principle (`[principle]` cited where established / `[principle:proposed]` newly
named). Untagged unsupported claims are demoted and excluded from the tally.
- Persisted memory is an **index of locators, never a finding's evidentiary endpoint**;
  findings re-ground in the live material before they are authored.
- A claim that rests on *not finding* something is only as strong as the search; it is
  surfaced for confirmation, never asserted as fact.

**Value.** A review reasoning from training ("DDD usually says…") instead of the
artefact has skipped the cascade. Code is the final truth on what the system does.

**Counter-force.** A named, cited principle (an invariant, a governance clause) is
load-bearing evidence on its own — a lens-internal principle is not "just opinion." The
demotion targets *unsupported project claims*, not principled reasoning.

**Watch for.** A finding about this repo with no `file:line` and no principle tag; a
verdict citing a memory record instead of the live file; a zero-tool-use report.
*(canon: I8, INTEGRATION-LAYER.md; re-grounding, EXPLORATORY-PHASE.md)*

---

### VI. Operator Decisions Are Banded, Never Assumed

**Rule.** Every decision routed to the operator is banded by the decision primitive:
- **🟢** auto-resolve (mechanical, no ask);
- **🟡** proceed on a **recorded default** with async override open;
- **🔴** hard-block, instant framed ask, **no auto-default**.
- The band comes from a declared catalog predicate, never from orchestrator inference.

**Value.** The workflow is **self-unblocking yet balanced** — it runs forward, stopping
the operator only where their judgment is genuinely required, and never silently assumes
their answer.

**Counter-force.** 🟡 is the balance itself: it neither blocks nor decides for the
operator — it proceeds visibly and stays overridable. The relief valve is built into the
band.

**Watch for.** "The operator probably wants…"; a 🔴 proceeding without an ask; a 🟡
default applied without being recorded. *(canon: the band table, DECISION-PRIMITIVE.md)*

---

### VII. Block on 🔴, Never Silently

**Rule.** A gate halts the pipeline on an unresolved post-tally 🔴.
- 🟡/🟢 are recorded and the operator proceeds at will.
- A 🔴 is **resolved** (revise + re-run) or **waived** with recorded rationale — a waived
  🔴 is never a silently-passed 🔴.
- A "clean" artifact that hides an aborted or skipped gate is a lie.

**Value.** The artifact is trustworthy by construction only if every gate fired honestly;
if any gate was skipped, no later inspection recovers what was lost.

**Counter-force.** The operator holds sign-off (N+1) and MAY waive any 🔴 to proceed —
the gate informs the decision, it does not seize it. The waiver + its reason are the
record that keeps the override honest.

**Watch for.** A gate marked clear with an open 🔴; a verdict that reads green while a
phase was aborted; a 🔴 downgraded by narration rather than a re-vote or a recorded
waiver. *(canon: S4, SDLC-LAYER.md; I7, INTEGRATION-LAYER.md)*

---

### VIII. The Spec Is the Source of Truth — Regenerate, Don't Hand-Patch

**Rule.** A finding is resolved by revising the **spec** and regenerating downstream
artefacts via the speckit phase-runners — never by hand-patching a downstream artefact.
- The orchestrator authors no spec/plan/tasks/code itself; every artefact change traces
  to a phase-runner.
- After incorporation the gate **re-runs** (fresh RSVP + primitive cycle).

**Value.** Hand-patching a downstream artefact to satisfy a gate makes the spec and the
artefact drift — the very divergence the chorus exists to catch.

**Counter-force.** When the spec is **already correct** and only a downstream artefact is
non-compliant, converging the artefact toward the spec is not the drift this principle
forbids — it is allowed, recorded as a deliberate, operator-authorized departure from
canonical regeneration (observed at 007 gates B and C).

**Watch for.** A quietly-edited `quickstart.md`/`tasks.md` that makes a gate pass without
a spec change or a recorded rationale; the orchestrator writing a spec section itself.
*(canon: S1/S5, SDLC-LAYER.md)*

---

### IX. Build on the Constraint — Defer the Rest

**Rule.** Effort goes to the binding constraint — the cycle time of the validated-learning
loop — first.
- Each gate locates the constraint **today, with evidence**, before endorsing investment.
- Correctness bought before the hypothesis it de-risks is tested is **inventory, not
  throughput**, and is deferred unless it is a hard invariant.
- The scope/deferral lens is never out-seated on a new buildout; out-seat coverage is
  judged by **mandate, not overlapping findings**.

**Value.** Over-investing in correctness is most expensive exactly when no real user has
exercised the feature; the chorus prices the cut so it is legible, not asserted.

**Counter-force.** A hard correctness invariant (a security boundary, a data-integrity
rule) is **never** deferred — the deferral lens distinguishes optional robustness from
non-negotiable correctness, and only the former is on the table.

**Watch for.** Robustness armoring a feature no user has run; a heal cycle that grows
scope past the findings it closes; the cut seat out-seated as "covered." *(canon: the
constraint-location gate + mandate guardrail, SDLC-LAYER.md / the Goldratt advisor)*

---

### X. Validate the Procedure, Not the Artifact

**Rule.** The product is the **durable procedure** that produces good rounds; this round's
doc is a side-effect.
- The integration layer audits that each phase's gate **fired**, not that the findings
  *look* right (testing shows the presence of bugs, never their absence).
- Each round produces a committed artifact the next round **baselines against** rather
  than re-derives.
- Self-heal loops are **bounded** (N=3 cycles); the bound escalates to the operator, it
  never runs forever.

**Value.** Trust comes from the discipline of the procedure, not from spot-checking
output. A procedure honest about what it cannot see beats a polished artifact that hides a
skipped step.

**Counter-force.** Humility here is engineering posture, not deference — the layer is
plain, declarative, and **refusal-capable**, not chatty or self-effacing. Bounded heal +
honest escalation is the balance against both infinite looping and premature give-up.

**Watch for.** An artifact optimized at the procedure's expense; a round with no durable
baseline; a heal loop past its bound; a verdict defended by narration instead of a gate
trail. *(canon: I1–I7 + the Dijkstra posture, INTEGRATION-LAYER.md; S7, SDLC-LAYER.md)*

---

## Authoring Constraints

- **Markdown-only, no runtime code.** The repo is Claude Code skill/prompt authoring; the
  only executable surfaces are `install.sh` (deployment) and the conformance-check stanzas
  in a feature's `quickstart.md`. A feature that proposes runtime code is out of shape.
- **Mode of one skill, not many skills.** New capability is registered as a mode of the
  `chorus` skill (e.g. "spawn the chorus" / "run the agent-SDLC" / "chorus learn"), not a
  new skill — registered across every cold-start surface (`SKILL.md` mode list + YAML
  frontmatter, `README.md`, `install.sh`).
- **The canon layout is fixed.** Definitions live under `skill/chorus/`:
  `SKILL.md` (procedure), `INTEGRATION-LAYER.md` (the conductor), `SDLC-LAYER.md`
  (lifecycle), `GATE-PRIMITIVE.md` (the four stages), `EXPLORATORY-PHASE.md`,
  `DECISION-PRIMITIVE.md`. Personas live under `agents/` — the directory is the
  **authoritative roster**; no artefact enumerates agent filenames.
- **No secrets, ever (absolute).** No credential, token, session cookie, or
  `CHORUS-PROJECT.md` carrying private project facts is committed. A committed secret is a
  one-way door; there is no legitimate case. *(form borrowed from LinkedInTools V)*

## Review Workflow

- A review runs the four-stage gate primitive: **extract → author (uncapped) → vote
  (real, author-excluded) → tally (deterministic, symmetric)**.
- **RSVP per round** (Principle II): personas self-select; the orchestrator never decides
  participation for a persona. Panels cap at five; ties at the cap go to the operator,
  never to orchestrator lens-merit judgment.
- **Exploratory phase first**: each joiner builds a persisted, lens-specific understanding
  (reference-first, addendum-first), and gates lead the operator interview (Principle IV).
- The **agent-SDLC** mode gates a speckit feature through design → plan/tasks →
  implementation, blocking only on 🔴 (Principle VII), driven by `SDLC-LAYER.md`.
- Each round commits its artifact (`docs/reviews/…` or `specs/<feature>/agent-sdlc-log.md`)
  as the next round's baseline (Principle X).
- Never push directly to `main`; never pass a 🔴 with `--no-verify`-style silence.

## Governance

This constitution supersedes ad-hoc practice. It records machinery already in force; where
the two disagree, the canon doc named in a principle's *(canon: …)* tag is authoritative
and this file is corrected to match.

Amendments MUST:

1. Update `.specify/memory/constitution.md` with a new version and amended date.
2. Increment `CONSTITUTION_VERSION` per semantic versioning:
   - **MAJOR** — a principle removed or redefined, or a governance rule changed.
   - **MINOR** — a principle or section added, or material expansion.
   - **PATCH** — clarification, wording, or typo.
3. Propagate to dependent templates (`plan-template.md`, `spec-template.md`,
   `tasks-template.md`) and update the Sync Impact Report.
4. **Balance check — every rule names a counter-force OR declares absolutism.** An
   amendment introducing a normative rule records either the relief valve that prevents
   calcification, or one sentence justifying genuine absolutism (e.g. "No secrets is
   absolute"). An unbalanced rule is an unconsidered rule — and a chorus that gates
   without overrides is exactly the failure this repo was built to resist.
5. **Amendment template.** Every principle is structured **Rule / Value / Counter-force /
   Watch for**, with a *(canon: …)* provenance tag — a principle whose machinery is not
   traceable to a canon doc has no source of truth (Principle I applied to this file).
6. **Procedure over artifact (Principle X).** An amendment is ratified by the operator
   (N+1), recorded in git history, and never back-dated to look cleaner than it was.

**Version**: 1.1.0 | **Ratified**: 2026-06-12 | **Last Amended**: 2026-06-12
