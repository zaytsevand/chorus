# Feature Specification: `chorus learn` — Interactive Staged Onboarding

**Feature Branch**: `007-chorus-learn-onboarding`

**Created**: 2026-06-09

**Status**: Draft

**Input**: User description — "chorus learn subcommand. ask questions tool explaining in a few stages how to set up chorus and work with it"

## Context

The chorus-review skill is powerful but has a steep cold-start: a new user faces several
dense companion docs (`SKILL.md`, `INTEGRATION-LAYER.md`, `SDLC-LAYER.md`,
`GATE-PRIMITIVE.md`, `EXPLORATORY-PHASE.md`, `DECISION-PRIMITIVE.md`), a per-project
addendum to author, and two operating modes. There is no guided on-ramp. `chorus learn`
adds one: an **interactive, staged tutorial** that teaches a newcomer — in a few
self-paced stages, using the **AskUserQuestion tool** as the interaction primitive — how
to **set up** the chorus and how to **work with** it, without making them read the raw
docs first.

It is a **mode of the existing chorus-review skill** (trigger: "chorus learn" /
`/chorus learn`), not a new skill. It is explanatory and navigational; it mutates nothing
except one **opt-in** scaffolding action the user explicitly confirms. Markdown
skill/prompt authoring — no runtime code.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Zero-to-first-round, guided in stages (Priority: P1)

A newcomer says "chorus learn" and is walked from never-having-used-chorus to a working
setup and a first review, one stage at a time, each stage a short explanation plus a
choice of where to go next — without reading the companion docs.

**Why this priority**: This is the feature's reason to exist — collapse the cold-start.
It is independently demonstrable: a user who has never run the chorus completes setup and
understands how to spawn a round, using only the subcommand.

**Independent Test**: A user who has not read any skill doc invokes "chorus learn",
proceeds through the stages, and ends able to (a) install/locate the skill, (b) author or
scaffold the project addendum, and (c) spawn a first round and read its artifact.

**Acceptance Scenarios**:

1. **Given** a user invokes "chorus learn", **When** the tutorial starts, **Then** it
   presents a short orientation (what the chorus is, the two modes) and asks, via the
   question tool, where they want to start.
2. **Given** the user proceeds through the stages, **When** each stage runs, **Then** it
   delivers a concise explanation **and** a question-tool choice for the next step — never
   a wall of text.
3. **Given** the user completes the stages, **When** the tutorial ends, **Then** it states
   plainly what they can now do ("say 'spawn the chorus'") and points to the canonical
   docs for depth.

---

### User Story 2 - Self-paced, choose-your-path navigation (Priority: P2)

The user is not marched through a fixed script: at each stage the question tool lets them
skip what they already know, jump to the topic they need, or go deeper — so an
experienced user and a newcomer both get a useful, non-redundant path.

**Why this priority**: Onboarding that can't be skipped or steered is abandoned. The
navigation is what makes the staged format respectful of the user's existing knowledge.

**Independent Test**: A user who already has the skill installed chooses "skip setup → how
to run a round" at the first question and lands directly in the run-a-round stage, setup
not re-explained.

**Acceptance Scenarios**:

1. **Given** any stage, **When** its question is presented, **Then** the options include
   advancing, jumping to another named stage, going deeper on the current topic, and
   exiting.
2. **Given** the user selects "skip ahead to X", **When** the tutorial advances, **Then**
   it resumes at stage X without replaying skipped stages.
3. **Given** the user exits mid-tutorial, **When** they re-invoke "chorus learn", **Then**
   it offers to resume where they left off or restart.

---

### User Story 3 - Setup is optionally *done*, not only explained (Priority: P2)

At the setup stage, after explaining the project addendum (`CHORUS-PROJECT.md` — scope
exclusions, anchors, security checklist), the tutorial **offers to scaffold it** from the
template — an opt-in action the user confirms — so the user leaves setup with a real
starting file, not just instructions.

**Why this priority**: The single biggest setup friction is authoring the addendum. Doing
it (on request) converts a tutorial into an on-ramp. It is opt-in so the tutorial stays
non-mutating by default.

**Independent Test**: At the setup stage the user accepts "scaffold my addendum"; a
`docs/reviews/CHORUS-PROJECT.md` is created from the template with the to-fill sections
marked; declining leaves the workspace untouched.

**Acceptance Scenarios**:

1. **Given** the setup stage, **When** the user is offered the scaffold and accepts,
   **Then** the addendum is created from the template with sections 2/3/5 flagged for the
   user to fill.
2. **Given** the same offer, **When** the user declines, **Then** nothing is written and
   the tutorial proceeds.
3. **Given** an addendum already exists, **When** the setup stage runs, **Then** the
   tutorial detects it and offers to review/extend rather than overwrite.

---

### User Story 4 - Teaches both modes, cites the canon (Priority: P3)

The tutorial covers both operating modes — the **project-state round** ("spawn the
chorus") and the **agent-SDLC** lifecycle (gating a speckit feature) — and for mechanics
it **cites the canonical docs rather than restating them**, so the tutorial cannot drift
from the source of truth as the skill evolves.

**Why this priority**: Completeness and durability. A tutorial that silently duplicates
the gate primitive or the invariants will rot; citing keeps it correct for free.

**Independent Test**: The run-a-round and agent-SDLC stages each summarize the flow at a
newcomer's altitude and link to `GATE-PRIMITIVE.md` / `SDLC-LAYER.md` for the mechanics;
an inspection finds no restated canonical definition.

**Acceptance Scenarios**:

1. **Given** the run-a-round stage, **When** it explains a review, **Then** it summarizes
   the four-stage flow at onboarding altitude and points to `GATE-PRIMITIVE.md` for the
   mechanic.
2. **Given** the agent-SDLC stage, **When** it explains gating a feature, **Then** it
   summarizes the pipeline and block-on-🔴 and points to `SDLC-LAYER.md`.
3. **Given** any mechanic the canon defines, **When** the tutorial mentions it, **Then**
   it links rather than copies (no duplicated definition that can drift).

---

### Edge Cases

- **User already expert**: first question offers "I know the basics — just show me the
  addendum checklist / a command cheat-sheet" as a fast exit.
- **Skill not yet installed**: the orientation stage detects this and routes to an
  install sub-step first.
- **User picks a topic out of order** (e.g. agent-SDLC before understanding a round): the
  tutorial proceeds but notes the prerequisite and offers a one-line primer link.
- **No project context** (run outside a repo): the scaffold offer is suppressed; the
  tutorial stays explanatory.
- **User exits at stage 1**: re-invoking offers resume-or-restart; no partial state is
  left in the workspace (the only write is the opt-in scaffold).
- **Docs the tutorial cites are renamed**: because mechanics are cited not copied, a
  rename surfaces as a broken pointer (caught by the cite-resolution check), not as silent
  staleness.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The skill MUST add a **`chorus learn` mode** (trigger: "chorus learn" /
  `/chorus learn`) distinct from the project-state round and the agent-SDLC mode.
- **FR-002**: The tutorial MUST be **staged** — a small, fixed set of stages covering, at
  minimum: (1) orient (what the chorus is + the two modes), (2) set up (install + the
  project addendum + roster), (3) run a round ("spawn the chorus": RSVP → the four-stage
  primitive → read the artifact), (4) agent-SDLC (gating a speckit feature, block-on-🔴),
  (5) work with results (the durable artifact, baselines, next round).
- **FR-003**: Each stage MUST use the **AskUserQuestion tool** to present a concise
  explanation followed by a navigation choice; it MUST NOT dump long prose.
- **FR-004**: Every stage's question MUST offer navigation: **advance**, **jump to a named
  stage**, **go deeper** on the current topic, and **exit**. The user MUST be able to skip
  stages they know and reach any stage directly (US2).
- **FR-005**: The tutorial MUST be **non-mutating by default**. The only permitted write is
  the **opt-in addendum scaffold** (FR-007), which the user explicitly confirms.
- **FR-006**: The orientation stage MUST detect whether the skill is installed and whether
  a project addendum exists, and route accordingly (install sub-step; review-vs-scaffold).
- **FR-007**: At the setup stage the tutorial MUST **offer to scaffold**
  `docs/reviews/CHORUS-PROJECT.md` from the template (sections 2/3/5 flagged to fill).
  Accepting creates it; declining writes nothing; an existing addendum is offered for
  review/extension, never overwritten.
- **FR-008**: For any mechanic the canonical docs define (the gate primitive, the
  invariants, the exploratory phase, the decision discipline), the tutorial MUST **cite /
  link** the canonical doc, not restate it (no duplicated definition that can drift).
- **FR-009**: The tutorial MUST cover **both modes** — the project-state round and the
  agent-SDLC lifecycle — at a newcomer's altitude.
- **FR-010**: The tutorial MUST be **resumable**: on re-invocation it offers to resume at
  the last stage reached or restart. (Resume state is lightweight and need not persist
  across machines.)
- **FR-011**: The tutorial MUST **conclude** each completed path with a plain "you can now
  do X" (the concrete next command) plus pointers to the canonical docs for depth.
- **FR-012**: The tutorial MUST be usable by a **non-expert** — it MUST NOT assume prior
  knowledge of the invariants, the roster, or the speckit pipeline; terms are introduced
  before use.
- **FR-013**: `chorus learn` MUST be discoverable — named in `SKILL.md`'s mode list and
  the README, alongside "spawn the chorus" and the agent-SDLC trigger.

### Key Entities

- **Stage**: one unit of the tutorial (orient / set up / run a round / agent-SDLC / work
  with results) — a concise explanation + a navigation question.
- **Navigation choice**: the per-stage options (advance / jump / deeper / exit) presented
  via the AskUserQuestion tool.
- **Resume state**: the last stage reached, used to offer resume-or-restart.
- **Addendum scaffold**: the opt-in `docs/reviews/CHORUS-PROJECT.md` created from the
  template — the tutorial's only write.
- **Canonical pointer**: a link from a stage to the source-of-truth doc for a mechanic
  (cite-not-restate).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A user who has never used the chorus can, guided **only** by `chorus learn`,
  reach a state where they can spawn a first round — completing setup with **zero** reading
  of the raw companion docs.
- **SC-002**: The tutorial completes in a **small, fixed number of stages** (≈5); no stage
  presents more than one AskUserQuestion interaction's worth of content at a time (FR-003).
- **SC-003**: From any stage the user can **skip to any other stage** and **exit**; a user
  who knows setup reaches "run a round" in **one** navigation choice (US2).
- **SC-004**: The setup stage can **scaffold** `CHORUS-PROJECT.md` on request, and writes
  **nothing** when declined or when run outside a repo (FR-005/007).
- **SC-005**: An inspection finds **no** canonical mechanic restated in the tutorial — every
  mechanic is cited/linked (FR-008); a renamed doc surfaces as a broken pointer, not silent
  drift.
- **SC-006**: The tutorial covers **both** modes and the full setup→run→results arc; a
  reviewer confirms each of the ≈5 stages is present and reachable.
- **SC-007**: Re-invoking after an exit offers **resume-or-restart** (FR-010).

## Assumptions

- **Mode, not a new skill**: `chorus learn` is a mode of chorus-review (like "spawn the
  chorus" and the agent-SDLC trigger), authored in `SKILL.md` (or a referenced
  `LEARN.md` companion if it grows), consistent with the project's one-skill-many-modes
  shape.
- **Stage set** ≈ 5 (orient / set up / run a round / agent-SDLC / work with results); the
  exact split is a planning detail, bounded to "a few" per the request.
- **The AskUserQuestion tool is the interaction primitive** ("ask questions tool" in the
  request) — used to teach + navigate, not to quiz/assess.
- **Opt-in scaffold only**: the tutorial's sole write is the user-confirmed
  `CHORUS-PROJECT.md` from `templates/CHORUS-PROJECT.template.md`; everything else is
  explanatory. This keeps it safe to run anytime.
- **Resume state is lightweight** (the last stage reached); it need not persist across
  sessions or machines — a best-effort within the conversation is sufficient.
- **Cite-not-restate** follows the project's established discipline (one canonical
  definition, referenced) so the tutorial cannot drift from the evolving skill.
- This is Markdown skill/prompt authoring — no runtime code, test harness, or deployment
  beyond `install.sh` redeploying the skill.
