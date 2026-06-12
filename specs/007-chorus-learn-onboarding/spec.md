# Feature Specification: `chorus learn` — Interactive Staged Onboarding

**Feature Branch**: `007-chorus-learn-onboarding`

**Created**: 2026-06-09

**Status**: Draft (Gate A cycle-3 revision)

**Input**: User description — "chorus learn subcommand. ask questions tool explaining in a few stages how to set up chorus and work with it"

## Context

The chorus-review skill is powerful but has a steep cold-start: a new user faces several
dense companion docs (`SKILL.md`, `INTEGRATION-LAYER.md`, `SDLC-LAYER.md`,
`GATE-PRIMITIVE.md`, `EXPLORATORY-PHASE.md`, `DECISION-PRIMITIVE.md`), a per-project
addendum to author, and two review modes. There is no guided on-ramp. `chorus learn`
adds one: an **interactive, staged tutorial** that teaches a newcomer — in a few
self-paced **steps**, using the **AskUserQuestion tool** as the interaction primitive —
how to **set up** the chorus and how to **work with** it, without making them read the
raw docs first.

It is a **mode of the existing chorus-review skill** (trigger: "chorus learn" /
`/chorus learn`), not a new skill. It is explanatory and navigational; it mutates nothing
except one **opt-in** scaffolding action the user explicitly confirms. Markdown
skill/prompt authoring — no runtime code.

> **Terminology.** A tutorial unit is a **step** (S1–S5; formerly referred to as
> "stage"). The word *stage* is reserved for the review canon's four-stage gate flow
> (extract → author → vote → tally), which step S3 teaches — the tutorial explicitly
> disambiguates the two when both appear (FR-012).

## Clarifications

### Session 2026-06-10 — Gate A cycle 1 (spec-sourced self-heal; findings register in `agent-sdlc-log.md`)

- Q: FR-004's universal four-affordance MUST and the S1 expert fast-exit cannot both fit
  the 4-option budget (F1/F18/F34/F40/F51). → A: FR-004 holds universally; the fast-exit
  **rides the exit affordance**: S1's exit wrap-up IS the cheat-sheet. No step ever
  substitutes away an affordance.
- Q: SC-003's unit "one navigation choice" is undefined and unsatisfiable as contracted
  (F2/F19/F35/F41/F50). → A: defined — **one navigation action = one selection on the
  navigation question plus its follow-up if any (≤2 AskUserQuestion interactions)**;
  SC-003 and US2's test restated in that unit.
- Q: Resume is conversation-scoped but never disclosed; SC-007 promises it
  unconditionally (F3/F52). → A: scope qualified to the conversation everywhere;
  the wrap-up **must disclose** the step reached, the scope, and the recovery path.
- Q: Scaffold consent placement left as a fork; consent could sit in a navigation slot
  (F4/F53). → A: a **dedicated confirmation question**, never an option on the
  navigation question.
- Q: The install sub-step has no contract and its write surface is ambiguous (F5/F21).
  → A: install sub-step is **instruct-only** — it never executes commands and never
  writes; the write surface remains exactly one.
- Q: Detection knows only the file-path install channel; plugin installs probe as
  broken (F6/F44/F55). → A: "installed" is evidenced by the mode running; probes verify
  **template availability across both documented channels** and route accordingly.
- Q: The scaffold manufactures a present-but-unfilled addendum state the round's binary
  present/absent contract does not define; the template preamble reads wrong post-copy
  (F7/F33/F61/F12). → A: the scaffold writes an explicit **SCAFFOLDED marker**; the
  registration edit defines Phase-0 consumer behavior for that state
  (present-but-unfilled = structure, not facts); the preamble is made copy-safe; the
  in-repo dogfood declines the scaffold by default.
- Q: The cite-resolution check false-positives on the scaffold target and misses
  renames; in-session cite failure has no specified behavior (F8/F17/F30/F43/F56).
  → A: every step carries a structured **Cites:** list the check resolves; non-canon
  names are excluded; a **cite-failure clause** mirrors the scaffold's failure honesty.
- Q: The SKILL.md frontmatter description — the harness's actual routing surface — is
  unregistered (F16). → A: registration includes the frontmatter trigger; the
  conformance check asserts it.
- Q: Mode-count registries go stale ("two modes" vs three) and "stage" collides with
  the canon's four-stage flow (F31/F32 + F9/F29/F48/F59). → A: the **three-modes
  reframe** is a named edit surface with a staleness assert; tutorial units renamed
  **steps**, with explicit disambiguation in S3.
- Q: The strongest invariants (sole-write, no-restatement, scaffold guards) get the
  weakest, manual-only checks (F24/F26/F36/F54). → A: mechanical scans added — a
  write-idiom scan, pinned canon-table delimiters incl. the quorum table, and a
  **four-path scaffold matrix** (accept / decline / existing-target / outside-repo).
- Q: The jump follow-up overflows the 4-option budget at S5; a second "deeper" is
  unspecified (F42/F15/F20/F11). → A: explicit S5 rule (no "back" slot at S5; it rides
  the built-in Other) and a post-deeper re-present rule (the deeper slot becomes
  "recap this step").
- Q: The cold-start surfaces newcomers meet first still teach the manual template copy
  (F57/F13). → A: README step 1 and the installer's "Next:" lead with `chorus learn`;
  the manual copy remains as the cited fallback.
- Q: Outside a repo the scaffold offer disappears silently (F58). → A: S2 states why
  the offer is unavailable and how to enable it (re-run inside a project repo).

### Session 2026-06-10 — Gate A cycle 2 (spec-sourced self-heal; findings register in `agent-sdlc-log.md`)

- Q: Detection is dual-channel but delivery is single-channel: `install.sh` never runs on
  the plugin channel, `<skill-base>/templates/` does not exist in the plugin layout, and
  the plugin packaging ships 7 of 10 persona agents (G6/G12/G18/G16). → A: delivery gains
  **channel parity** — the template resolves via the **running skill's base path**
  (`<skill-base>/templates/`, falling back to the plugin root); the plugin packaging
  (`plugin.json`) is a **named edit surface** gaining the template and the full
  persona-agent set; the install remedy text **branches by detected channel**; a
  plugin-side template assertion (C5b) joins the conformance suite.
- Q: The write-idiom scan's alternation is mechanically dead for cp/tee/mkdir (`\|` in
  ERE is a literal pipe) — SC-008 would certify on a decorative gate (G7/G13/G23).
  → A: corrected alternation, **and the scan is self-tested against known-bad fixture
  lines** containing each write idiom — a scan that fails to fire on its fixtures fails
  the suite.
- Q: Check C5 ships a dead first stanza — an undefined variable, a redundant install into
  a discarded temp dir, a prose-matching grep (G2/G8/G25/G15/G22). → A: the dead stanza
  is deleted; the repo-side grep is tightened to the actual deploy idiom
  (`^cp .*templates`); the clean mktemp assertion stays. Conformance checks MUST contain
  **no dead or vestigial assertions** and MUST parse **structural units** (frontmatter
  block, tables), never fixed line windows (also G11).
- Q: No artifact names who runs C1–C7 or when — an unowned check is decorative by
  default (G9). → A: **ownership bound** — C1–C7 execute at the **Gate C dogfood and
  before merge**; results are recorded in the gate ledger.
- Q: The cite-failure recovery pointer is repo-relative, but the user who hits it has no
  repo (G1). → A: runtime pointers resolve via the **running skill's base path** (the
  same rule as the template) — repo path in-repo, installed/plugin base otherwise.
- Q: The S1 exit signifier, the S5 advance label, and the S2 confirm ordering are pinned
  only by the non-normative walkthrough; depth state is ambiguous at S5; the cite checks
  pass vacuously on zero Cites: lines (G19/G24/G26 + G3/G20/G27). → A: the **navigation
  contract is the normative surface**: it pins the S1 exit label (signifying the
  cheat-sheet), the S5 advance label **Finish** with its **declared convergence** with
  exit (both reach the wrap-up; Finish marks completion), and the S2
  scaffold-confirm-before-navigation ordering. Depth state is **per-step** ("recap this
  step" appears only on a step whose own deeper pass happened). The cite check asserts
  **cardinality**: every step carries ≥1 Cites: entry; zero total lines fail.
- Q: Same-conversation re-entry costs an extra resume interaction that SC-003's unit
  silently excluded (G4). → A: stated explicitly — the resume-or-restart question on
  re-invocation is **outside the navigation-action unit**; SC-003 measures navigation
  from a presented step.
- Q: The README's manual-fallback path is contract-unpinned; an author-machine literal
  could survive implementation (G5). → A: the fallback cites the **installed template
  path as deployed** — no environment-specific literals; the staleness check covers it.
- Q: The two-mode staleness scan and the scaffold-state consumer list are each one item
  short (G14/G17). → A: the staleness check scans for **any residual two-mode phrasing**
  on the named surfaces (not a single literal); FR-014 names **both** addendum
  consumers — the Phase-0 orchestrator and the per-advisor exploratory cache (a
  marker-bearing addendum caches as structure only, never as operator-confirmed facts).
- Q: The S5 jump follow-up's stay-here escape depends on knowing the tool's built-in
  free-text (G21). → A: the follow-up's question text **discloses** that free-text input
  stays at S5 — the escape is stated, not assumed.
- Out of 007 scope (recorded): stale-present installed canon left by the additive-only
  installer (G10) — future-round candidate, logged in the ledger.

### Session 2026-06-12 — Gate A run 2, cycle 1 (clean-slate rerun; findings register in `agent-sdlc-log.md`)

Operator-confirmed frame (interview session 1): the audience is **external/public
newcomers** via the README/plugin channel; the canon is the **Core Domain**
(tutorial Supporting, deployment Generic); run-1's ledger is context only; the
navigation contract is enforced by the **Gate C dogfood only** (recorded decision —
the panel's challenges to it were demoted 4-0).

- Q: Three corpus surfaces enumerate persona agents by filename, and the
  2026-06-12 agent rename already made that list stale (cluster A — COOP-1/NORM-2/
  BECK-5/GOLD-3/EVAN-1). → A: the **`agents/` directory is the authoritative
  roster**; spec, plan, research, and contracts **derive** roster facts from it and
  never restate filenames (the feature's own cite-not-restate discipline, applied
  to itself). The plugin.json edit is specified as "package every file in
  `agents/`", not as a name list.
- Q: C5b asserts directory ⊆ plugin.json but is blind to phantom packaged paths,
  and the description refresh it claims to assert has no check (cluster B —
  COOP-2/BECK-1/EVAN-2/COOP-3). → A: C5b asserts **both directions** (every
  `agents/*.md` is packaged AND every packaged agent path resolves to a file) and
  greps the refreshed plugin description; a claim with no check exactly as strong
  as the claim is a spec defect by this spec's own SC-008.
- Q: Three checks are weaker than the claims they assert: C1 scans two of FR-013's
  three named staleness surfaces with two literals under an "any phrasing" claim;
  C3 asserts a global cite floor where FR-008 pins per-step cardinality; C1/C4
  signal failure by silent output while C3/C5b/C6 emit FAIL tokens (cluster C —
  COOP-5/EVAN-3/BECK-2/BECK-3). → A: **claim-check parity** is the rule: C1 covers
  all three named surfaces and scopes its scan to a **stated phrasing family**
  (the family is enumerated in the check, and the claim says "the stated family",
  not "any"); C3 iterates per step heading and asserts ≥1 Cites: per step; every
  conformance stanza emits an **explicit FAIL token** on failure — silent-output
  polarity is retired suite-wide.
- Q: S2's Cites: list names `install.sh`, which is neither deployed by install.sh
  nor packaged by plugin.json — the operator-confirmed primary audience would hit
  a cite-failure on a healthy install (cluster D — NORM-1, proposed 🔴 held).
  → A: Cites: entries MUST be **channel-resolvable**: a channel-specific artefact
  is cited **conditionally on the channel that carries it** (install.sh on the
  file-path/checkout channel only); the plugin-channel S2 cite resolves to the
  packaged template and SKILL.md. The cite-resolution check (C3) gains a
  channel-awareness note.
- Q: Every success criterion was satisfiable by self-dogfood; no SC required a
  real external newcomer despite the operator-confirmed external audience
  (cluster E — GOLD-2). → A: **new SC-010** (operator-selected 2026-06-12): within
  30 days of merge, **one real external newcomer session** is recorded in the gate
  ledger — channel used and outcome — closing the validated-learning loop on a
  real user, not a simulation.
- Folded non-gating 🟡s: C6's locality assertion is made mechanical (extract the
  S2 accept-branch section, assert hits ⊆ it — BECK-4); the plan's R8 sequencing
  note records the PR #5 merge horizon as an open operator item (GOLD-1).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Zero-to-first-round, guided in steps (Priority: P1)

A newcomer says "chorus learn" and is walked from never-having-used-chorus to a working
setup and a first review, one step at a time, each step a short explanation plus a
choice of where to go next — without reading the companion docs.

**Why this priority**: This is the feature's reason to exist — collapse the cold-start.
It is independently demonstrable: a user who has never run the chorus completes setup and
understands how to spawn a round, using only the subcommand.

**Independent Test**: A user who has not read any skill doc invokes "chorus learn",
proceeds through the steps, and ends able to (a) install/locate the skill, (b) author or
scaffold the project addendum, and (c) spawn a first round and read its artifact.

**Acceptance Scenarios**:

1. **Given** a user invokes "chorus learn", **When** the tutorial starts, **Then** it
   presents a short orientation (what the chorus is, the three modes) and asks, via the
   question tool, where they want to start.
2. **Given** the user proceeds through the steps, **When** each step runs, **Then** it
   delivers a concise explanation **and** a question-tool choice for the next move — never
   a wall of text.
3. **Given** the user completes the steps, **When** the tutorial ends, **Then** it states
   plainly what they can now do ("say 'spawn the chorus'"), names the step reached and the
   resume scope, and points to the canonical docs for depth.

---

### User Story 2 - Self-paced, choose-your-path navigation (Priority: P2)

The user is not marched through a fixed script: at each step the question tool lets them
skip what they already know, jump to the topic they need, or go deeper — so an
experienced user and a newcomer both get a useful, non-redundant path.

**Why this priority**: Onboarding that can't be skipped or steered is abandoned. The
navigation is what makes the staged format respectful of the user's existing knowledge.

**Independent Test**: A user who already has the skill installed performs **one
navigation action** at the first question (selecting "jump", then "run a round" on its
follow-up — ≤2 AskUserQuestion interactions) and lands directly in the run-a-round step,
setup not re-explained.

**Acceptance Scenarios**:

1. **Given** any step, **When** its question is presented, **Then** the options include
   advancing, jumping to another named step, going deeper on the current topic, and
   exiting — all four, at every step including S1.
2. **Given** the user selects "jump to X", **When** the tutorial advances, **Then** it
   resumes at step X without replaying skipped steps.
3. **Given** the user exits mid-tutorial, **When** they re-invoke "chorus learn" **in the
   same conversation**, **Then** it offers to resume where they left off or restart; the
   exit wrap-up has already told them this offer is conversation-scoped and that in a new
   session any step is one jump away.

---

### User Story 3 - Setup is optionally *done*, not only explained (Priority: P2)

At the setup step, after explaining the project addendum (`CHORUS-PROJECT.md` — scope
exclusions, anchors, security checklist), the tutorial **offers to scaffold it** from the
template — an opt-in action the user confirms on a **dedicated confirmation question** —
so the user leaves setup with a real starting file, not just instructions.

**Why this priority**: The single biggest setup friction is authoring the addendum. Doing
it (on request) converts a tutorial into an on-ramp. It is opt-in so the tutorial stays
non-mutating by default.

**Independent Test**: At the setup step the user accepts "scaffold my addendum" on the
dedicated confirm; a `docs/reviews/CHORUS-PROJECT.md` is created from the template with
the to-fill sections marked and a SCAFFOLDED marker; declining leaves the workspace
untouched.

**Acceptance Scenarios**:

1. **Given** the setup step, **When** the user is offered the scaffold and accepts on the
   dedicated confirm, **Then** the addendum is created from the template with sections
   2/3/5 flagged for the user to fill, a machine-readable SCAFFOLDED marker, and a
   preamble that reads correctly post-copy.
2. **Given** the same offer, **When** the user declines, **Then** nothing is written and
   the tutorial proceeds.
3. **Given** an addendum already exists, **When** the setup step runs, **Then** the
   tutorial detects it and offers to review/extend rather than overwrite.
4. **Given** a scaffolded-but-unfilled addendum exists, **When** a chorus round later
   reads it at Phase 0, **Then** the round treats it as structure-without-facts (the
   SCAFFOLDED marker is the signal), not as operator-confirmed project facts — and the
   tutorial's wrap-up has told the user which sections to fill before their first round.

---

### User Story 4 - Teaches both review modes, cites the canon (Priority: P3)

The tutorial covers both review modes — the **project-state round** ("spawn the
chorus") and the **agent-SDLC** lifecycle (gating a speckit feature) — and for mechanics
it **cites the canonical docs rather than restating them**, so the tutorial cannot drift
from the source of truth as the skill evolves.

**Why this priority**: Completeness and durability. A tutorial that silently duplicates
the gate primitive or the invariants will rot; citing keeps it correct for free.

**Independent Test**: The run-a-round and agent-SDLC steps each summarize the flow at a
newcomer's altitude and link to `GATE-PRIMITIVE.md` / `SDLC-LAYER.md` for the mechanics;
the structured Cites: lists resolve; an inspection finds no restated canonical
definition.

**Acceptance Scenarios**:

1. **Given** the run-a-round step, **When** it explains a review, **Then** it summarizes
   the four-stage flow at onboarding altitude — explicitly noting that these review
   *stages* are not tutorial *steps* — and points to `GATE-PRIMITIVE.md` for the
   mechanic.
2. **Given** the agent-SDLC step, **When** it explains gating a feature, **Then** it
   summarizes the pipeline and block-on-🔴 and points to `SDLC-LAYER.md` and
   `DECISION-PRIMITIVE.md`.
3. **Given** any mechanic the canon defines, **When** the tutorial mentions it, **Then**
   it links via its Cites: list rather than copies (no duplicated definition that can
   drift).

---

### Edge Cases

- **User already expert**: S1's **exit** affordance delivers the fast exit — its wrap-up
  IS the cheat-sheet (addendum checklist + command list + "any step is one jump away").
  No affordance is displaced to provide it.
- **Skill not yet installed / partially reachable**: the orientation step's probes
  verify what the mode actually needs (template availability, persona agents) across
  **both documented install channels** (file-path `install.sh` and plugin). Only a user
  whose installation genuinely lacks a needed artefact is routed to the install
  sub-step — which **instructs**, never executes, with remedy text matched to the
  detected channel (file-path: clone + `./install.sh`; plugin: reinstall/update the
  plugin).
- **User picks a topic out of order** (e.g. agent-SDLC before understanding a round): the
  tutorial proceeds but notes the prerequisite and offers a one-line primer link.
- **No project context** (run outside a repo): the scaffold offer is replaced by a
  one-line notice — what the scaffold would do, why it is unavailable here, and that
  re-running inside a project repo enables it. The tutorial stays explanatory.
- **User exits at step 1**: re-invoking in the same conversation offers resume-or-restart;
  no partial state is left in the workspace (the only write is the opt-in scaffold).
- **User abandons silently** (no explicit exit): the resume offer still works — the
  tutorial tracks the last step reached at every transition, not only at explicit exit.
- **Second "go deeper" on the same step**: after one deeper pass, the deeper slot
  re-presents as "recap this step" — depth is bounded at one level, with no dead option.
- **Docs the tutorial cites are renamed**: cites are structured and resolved by the
  conformance check, so a rename surfaces as a broken pointer at authoring time. If a
  cited doc is missing **at runtime** (e.g. a stale installed copy), the tutorial states
  that plainly, continues at summary altitude, and points to the canonical source
  resolved via the **running skill's base path** — a pointer the no-repo user can
  follow — and never reconstructs the missing content from memory.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The skill MUST add a **`chorus learn` mode** (trigger: "chorus learn" /
  `/chorus learn`) distinct from the project-state round and the agent-SDLC mode —
  making three modes in total.
- **FR-002**: The tutorial MUST proceed in a small, fixed set of **steps** covering, at
  minimum: (1) orient (what the chorus is + the three modes), (2) set up (install + the
  project addendum + roster), (3) run a round ("spawn the chorus": RSVP → the four-stage
  review → read the artifact), (4) agent-SDLC (gating a speckit feature, block-on-🔴),
  (5) work with results (the durable artifact, baselines, next round).
- **FR-003**: Each step MUST use the **AskUserQuestion tool** to present a concise
  explanation followed by a navigation choice; it MUST NOT dump long prose.
- **FR-004**: Every step's navigation question MUST offer all four affordances:
  **advance**, **jump to a named step**, **go deeper** on the current topic, and
  **exit** — at every step, S1 included. The expert fast-exit is delivered through the
  exit affordance (S1's exit wrap-up is the cheat-sheet, and the S1 exit option's
  **label signifies that** before selection); after one deeper pass **on that step**
  the deeper slot re-presents as "recap this step" — depth state is **per-step**, so a
  step with no deeper pass never shows the recap label. At S5 the advance affordance is
  labeled **Finish** and converges, by declaration, with exit on the wrap-up (Finish
  marks completion); the jump follow-up lists S1–S4 with no "back" slot, and its
  question text discloses that free-text input stays at S5. These labels, orderings,
  and per-step rules are **pinned by the navigation contract** (normative), not by
  walkthrough examples. The user MUST be able to skip steps they know and reach any
  step directly (US2).
- **FR-005**: The tutorial MUST be **non-mutating by default**. The only permitted write
  is the **opt-in addendum scaffold** (FR-007), which the user explicitly confirms. The
  install sub-step and all detection probes are read-only.
- **FR-006**: The orientation step MUST detect, via read-only probes that cover **both
  documented install channels** (file-path and plugin), whether the artefacts the mode
  needs are reachable (the addendum template, the persona agents) and whether a project
  addendum exists, and route accordingly. The install sub-step **instructs** the
  missing-artefact user with remedy text that **branches by the detected channel**
  (file-path: clone + `./install.sh`; plugin: reinstall/update the plugin so its
  packaged artefacts deploy); it never executes commands and never writes. The mode
  running at all is itself evidence the skill is reachable — probes test artefact
  availability, not bare skill presence.
- **FR-007**: At the setup step the tutorial MUST **offer to scaffold**
  `docs/reviews/CHORUS-PROJECT.md` from the template, with consent collected on a
  **dedicated confirmation question** (never an option on the navigation question).
  Accepting creates it with sections 2/3/5 flagged to fill, a machine-readable
  **SCAFFOLDED marker**, and a copy-safe preamble; declining writes nothing; an existing
  addendum is offered for review/extension, never overwritten. The scaffold and the
  round's end-of-round addendum offer (SKILL.md Phase 5) are cross-referenced as the two
  creation paths: the scaffold produces the pre-round structural form, the Phase-5 offer
  a post-interview distillation — the template is the single source of structure for
  both.
- **FR-008**: For any mechanic the canonical docs define (the gate primitive, the
  invariants, the exploratory phase, the decision discipline), the tutorial MUST **cite /
  link** the canonical doc, not restate it. Each step carries a structured **Cites:**
  list (**≥1 entry per step** — the conformance check asserts cardinality **per
  step**, so a tutorial with zero Cites: lines, or with all its cites clumped in one
  step, fails rather than passing vacuously) of paths the
  conformance check resolves. Cites: entries MUST be **channel-resolvable**: a
  channel-specific artefact (e.g. `install.sh`) is cited only on the channel that
  carries it; no healthy install may cite-fail on its own channel. If a cited doc is missing at runtime, the tutorial states
  that plainly, continues at summary altitude, and points to the canonical source
  **resolved via the running skill's base path** (repo path in-repo, installed/plugin
  base otherwise) — it never reconstructs canon from memory.
- **FR-009**: The tutorial MUST cover **both review modes** — the project-state round and
  the agent-SDLC lifecycle — at a newcomer's altitude.
- **FR-010**: The tutorial MUST be **resumable within the conversation**: the last step
  reached is tracked at **every step transition** (not only at explicit exit), and
  re-invocation offers resume-or-restart. Resume state does not persist across sessions
  or machines; the wrap-up disclosure (FR-011) makes that scope explicit.
- **FR-011**: The tutorial MUST **conclude** each completed or exited path with a plain
  wrap-up: what the user can now do (the concrete next command), **the step reached and
  the resume scope** ("in a new session, say 'chorus learn' and jump straight to any
  step"), and pointers to the canonical docs for depth. At S1, this wrap-up doubles as
  the expert cheat-sheet (FR-004).
- **FR-012**: The tutorial MUST be usable by a **non-expert** — it MUST NOT assume prior
  knowledge of the invariants, the roster, or the speckit pipeline; terms are introduced
  before use. Vocabulary MUST NOT collide: tutorial units are **steps**; the review
  canon's four **stages** (extract → author → vote → tally) are introduced in S3 with an
  explicit one-line disambiguation.
- **FR-013**: `chorus learn` MUST be discoverable at every cold-start surface: named in
  `SKILL.md`'s mode list **and its YAML frontmatter description** (the harness routing
  surface), in the README — whose quick-start leads with `chorus learn` before the
  manual template copy (which remains as the cited fallback, citing the **installed
  template path as deployed** — no environment-specific literals) — and in
  `install.sh`'s "Next:" text. The mode-registry edits (the stale two-mode heading
  region → three-mode framing in SKILL.md, README, and this spec's own references) are named edit surfaces
  with a staleness check that scans **all three named surfaces** for a **stated
  phrasing family** (the family is enumerated in the check itself — claim and check
  exactly as strong as each other, never a broad claim over a narrow scan).
- **FR-014**: The scaffolded-but-unfilled addendum state MUST be defined for **both of
  its consumers**: the SCAFFOLDED marker signals structure-without-facts, and the
  registration edit to `SKILL.md` MUST instruct (a) the **Phase-0 orchestrator** to
  treat a marker-bearing addendum as needing its flagged sections confirmed (not as
  operator-confirmed project facts), and (b) the **per-advisor exploratory cache** to
  cache a marker-bearing addendum's content as structure only — never as
  operator-confirmed facts. The tutorial's wrap-up names the sections to fill before
  the first round.
- **FR-015**: Both documented install channels MUST **deliver** the artefacts the mode
  needs, not merely be probed: the addendum template resolves via the running skill's
  base path (`<skill-base>/templates/`, falling back to the plugin root), and the
  plugin packaging (`plugin.json`) is a **named edit surface** gaining the template and
  the **full persona-agent set — specified as "every file in `agents/`", the
  authoritative roster; no artefact restates agent filenames** (the rename that
  stale-ified three corpus surfaces is the recorded evidence). The conformance suite
  asserts delivery on both channels: repo-side deploy assertion + plugin-side
  packaging assertion **in both directions** (every `agents/*.md` packaged AND every
  packaged agent path resolves) plus the refreshed plugin description.

### Key Entities

- **Step** *(formerly "stage")*: one unit of the tutorial (orient / set up / run a round /
  agent-SDLC / work with results) — a concise explanation + a navigation question.
- **Sub-step**: a conditional path inside a step (the S1 install sub-step — instruct-only;
  the S2 scaffold offer — the sole write, behind a dedicated confirm). Each sub-step's
  effects are declared; nothing executes or writes outside the declared list.
- **Navigation choice**: the per-step four affordances (advance / jump / deeper / exit)
  presented via the AskUserQuestion tool, with the declared S1/S5/post-deeper rules.
- **Resume state**: the last step reached, updated at every transition,
  conversation-scoped, used to offer resume-or-restart.
- **Addendum scaffold**: the opt-in `docs/reviews/CHORUS-PROJECT.md` created from the
  template — the tutorial's only write — carrying TO-FILL flags and the SCAFFOLDED
  marker.
- **Canonical pointer**: a structured Cites: entry from a step to the source-of-truth doc
  for a mechanic (cite-not-restate), resolvable by the conformance check, with a declared
  runtime-failure behavior.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A user who has never used the chorus can, guided **only** by `chorus learn`,
  reach a state where they can spawn a first round — completing setup with **zero** reading
  of the raw companion docs.
- **SC-002**: The tutorial completes in a **small, fixed number of steps** (≈5); no step
  presents more than one AskUserQuestion interaction's worth of content at a time (FR-003).
- **SC-003**: From any step the user can reach any other step in **one navigation action**
  (one selection on the navigation question plus its follow-up if any — ≤2
  AskUserQuestion interactions) and can always exit; a user who knows setup reaches
  "run a round" from S1 in one navigation action (US2). The resume-or-restart question
  on same-conversation re-invocation is **outside this unit** — SC-003 measures
  navigation from a presented step.
- **SC-004**: The setup step can **scaffold** `CHORUS-PROJECT.md` on request via the
  dedicated confirm, and writes **nothing** when declined or when run outside a repo
  (FR-005/007); outside a repo the unavailability is stated, not silent.
- **SC-005**: An inspection finds **no** canonical mechanic restated in the tutorial —
  every mechanic resolves through a structured Cites: entry (FR-008); the cite check
  asserts **cardinality** (every step ≥1 entry; zero total Cites: lines fail, never
  pass vacuously); a renamed doc surfaces as a broken pointer at authoring time, and a
  missing doc at runtime triggers the declared failure behavior, not silent
  reconstruction.
- **SC-006**: The tutorial covers **both** review modes and the full setup→run→results
  arc; a reviewer confirms each of the ≈5 steps is present and reachable.
- **SC-007**: Re-invoking after an exit **in the same conversation** offers
  resume-or-restart (FR-010), including after silent abandonment; the wrap-up has
  disclosed this scope (FR-011).
- **SC-008**: The write surface and the guards are **mechanically checked**: a write-idiom
  scan over the tutorial doc — **self-tested against known-bad fixture lines** for every
  idiom it claims to catch (a scan that fails to fire on its fixtures fails the suite) —
  pinned canon-table delimiters (including the RSVP quorum table) in the no-restatement
  scan, and a **four-path scaffold matrix** (accept / decline / existing-target /
  outside-repo) each with a recorded expected outcome. The conformance suite carries
  **no dead or vestigial assertions**, parses structural units (frontmatter block,
  tables) rather than fixed line windows, emits an **explicit FAIL token on every
  failing stanza** (no silent-output polarity anywhere in the suite), makes the C6
  locality assertion mechanical (hits ⊆ the extracted S2 accept-branch section, not
  eyeball-judged), and has a **named owner and trigger**: C1–C7
  execute at the Gate C dogfood and before merge, with results recorded in the gate
  ledger.
- **SC-009**: **Both install channels deliver**: a repo-side assertion verifies the
  template deploys via `install.sh`, and a plugin-side assertion verifies the plugin
  packaging carries the template and the full persona-agent set **in both directions**
  (FR-015); the install
  remedy text branches by detected channel (FR-006), so no documented channel degrades
  silently.
- **SC-010**: **The loop closes on a real user** (operator-selected 2026-06-12): within
  **30 days of merge**, one session by a **real external newcomer** (not the operator,
  not a team simulation) running `chorus learn` is recorded in the gate ledger —
  install channel used and outcome reached. Until that record exists, the feature's
  validated-learning loop is open and the ledger says so.

## Assumptions

- **Mode, not a new skill**: `chorus learn` is a mode of chorus-review (like "spawn the
  chorus" and the agent-SDLC trigger), authored in a referenced `LEARN.md` companion and
  registered in `SKILL.md` (mode list + frontmatter), consistent with the project's
  one-skill-many-modes shape.
- **Step set** ≈ 5 (orient / set up / run a round / agent-SDLC / work with results); the
  exact split is a planning detail, bounded to "a few" per the request.
- **The AskUserQuestion tool is the interaction primitive** ("ask questions tool" in the
  request) — used to teach + navigate, not to quiz/assess. Its 4-option budget is a hard
  constraint the navigation rules (FR-004) are designed against.
- **Opt-in scaffold only**: the tutorial's sole write is the user-confirmed
  `CHORUS-PROJECT.md` from the template, resolved via the running skill's base path
  (`<skill-base>/templates/CHORUS-PROJECT.template.md`, plugin-root fallback — FR-015);
  everything else is explanatory. This keeps it safe to run anytime. **Dogfood note**:
  the walkthrough run in this repo declines the scaffold by default — accepting would
  change this repo's Phase-0 behavior for every future round, which is a separate
  operator decision.
- **Resume state is lightweight** (the last step reached, updated per transition); it
  does not persist across sessions or machines — conversation-scoped by design, with the
  scope disclosed to the user (FR-010/011).
- **Cite-not-restate** follows the project's established discipline (one canonical
  definition, referenced) so the tutorial cannot drift from the evolving skill.
- This is Markdown skill/prompt authoring — no runtime code, test harness, or deployment
  beyond `install.sh` redeploying the skill (extended to deploy the template) and the
  plugin packaging carrying the same artefacts on the plugin channel (FR-015).
