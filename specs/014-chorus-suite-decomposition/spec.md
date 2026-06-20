# Feature Specification: Chorus Suite Decomposition

**Feature Branch**: `014-chorus-suite-decomposition`

**Created**: 2026-06-20

**Status**: Draft

**Input**: Decompose the single `chorus-review` skill into a composable chorus
suite over a shared substrate (`chorus-core`) plus `chorus-review` and
`chorus-sdlc`, with a findings→memory configuration contract as a designed seam.
Approved design: `docs/superpowers/specs/2026-06-20-chorus-suite-decomposition-design.md`
(includes an incorporated high-effort architecture review).

## Clarifications

### Session 2026-06-20

- Q: How rigorously must behavior parity be proven across the split? → A: Full
  writing-skills RED-GREEN pressure/application scenarios for every moved or
  split skill (`chorus-core`, `chorus-review`, `chorus-sdlc`) — maximal rigor,
  not just structural equivalence.
- Q: Where do the three fitness checks execute (CI / script / hook)? → A: Defer
  the automated execution harness to the next spec (introduction of Jest/TS
  tests). This feature specifies the three checks as contracts and provides them
  as greppable, manually-runnable checks; wiring them into an automated test
  harness is out of scope here.
- Q: Should the installer migrate/clean stale files from existing installs? → A:
  No. The installer keeps its copy/iterate behavior (FR-012); obsolete-file
  cleanup on existing installs is handled out-of-band via Claude at integration
  time, not codified in `install.sh`. (The invariant-resolution check operates on
  the repo source, which has no stale files, so this does not affect correctness
  of the deliverable.)

## User Scenarios & Testing *(mandatory)*

The "users" of this feature are the **operator** who invokes the chorus and the
**suite maintainer** who evolves it. The chorus's reviewing behavior must be
unchanged; what changes is how the skill is packaged, discovered, loaded, and
extended.

### User Story 1 - Run a project-state review without lifecycle baggage (Priority: P1)

An operator says "spawn the chorus" to review a spec or feature. The review skill
loads its own round procedure and the shared substrate it needs — and nothing
from the lifecycle-gating mode. The round runs exactly as it does today.

**Why this priority**: This is the most common chorus invocation and the primary
driver of the split (discovery + per-invocation load). If a plain review still
pulls SDLC machinery, the split has not delivered its main value.

**Independent Test**: Invoke the review skill; confirm the round runs through all
its phases and that no SDLC-only artefact (pipeline, gate mechanics, `S1–S7`) is
loaded into the working context to do so.

**Acceptance Scenarios**:

1. **Given** the suite is installed, **When** the operator triggers a
   project-state review, **Then** the review skill executes its full round
   procedure and produces the same durable artifact it produces today.
2. **Given** a review is running, **When** the operator inspects what was loaded,
   **Then** no lifecycle-only content is present beyond the shared substrate the
   round legitimately uses.

---

### User Story 2 - Run the agent-SDLC lifecycle, composing only the substrate (Priority: P1)

An operator says "run the agent-SDLC on feature 0NN". The lifecycle skill runs
its three gates exactly as today, composing the shared substrate by name — and
without depending on the review skill in any way.

**Why this priority**: The lifecycle mode must keep working identically, and the
split's structural promise ("nothing depends on a fat sibling") is only real if
the lifecycle skill is genuinely free of the review skill.

**Independent Test**: With only `chorus-sdlc` and `chorus-core` present (review
skill absent), run a lifecycle gate end to end; confirm it completes and that no
reference resolves into the review skill.

**Acceptance Scenarios**:

1. **Given** the suite is installed, **When** the operator runs the agent-SDLC on
   a feature, **Then** all three gates fire with the same mechanics and ledger as
   today.
2. **Given** the review skill is absent but `chorus-core` is present, **When** a
   lifecycle gate runs, **Then** it still completes — proving no dependency on the
   review skill.

---

### User Story 3 - Extend the suite without touching existing siblings (Priority: P2)

A maintainer adds a new chorus skill (e.g., a future viewpoint-extraction skill)
that builds on `chorus-core`. They add it as a peer without editing
`chorus-review` or `chorus-sdlc`, and the shared mechanics it relies on already
have a documented contract in `chorus-core`.

**Why this priority**: Composition/expansion is an explicit goal — the suite must
make the next extraction a clean peel, not a refactor. The reserved seams for the
future three skills + the findings→memory contract are validated here.

**Independent Test**: Confirm the substrate documents the seams the future skills
will consume (extract-stage record contract, agent-memory layout, two-tier memory
model) without those skills being built.

**Acceptance Scenarios**:

1. **Given** `chorus-core` exists, **When** a maintainer reads it, **Then** the
   reserved seams (extract-stage record contract, agent-memory layout, two-tier
   memory model, findings→memory contract) are documented as committed contracts.
2. **Given** a new peer skill is added, **When** it composes `chorus-core`,
   **Then** no edit to `chorus-review` or `chorus-sdlc` is required for it to
   function.

---

### User Story 4 - Behavior parity across the split (Priority: P2)

A maintainer needs assurance the decomposition relocated source without changing
behavior. Each load-bearing behavior (a sibling correctly composing core; a
review round firing every phase gate; an SDLC gate running the primitive from
core) is demonstrated, not asserted.

**Why this priority**: "Same procedure, relocated source" is the safety contract
of the whole change. Per the skill-authoring Iron Law, structural skill edits are
gated by pressure/application scenarios before being called done.

**Independent Test**: Run the parity scenarios for review and lifecycle against
the pre-split baseline; confirm equivalent procedure execution.

**Acceptance Scenarios**:

1. **Given** a pre-split RED-GREEN baseline captured for each moved/split skill,
   **When** the same pressure/application scenarios are re-run post-split,
   **Then** every skill (`chorus-core`, `chorus-review`, `chorus-sdlc`) passes
   equivalently and produces equivalent artifacts/ledgers.
2. **Given** any moved or split skill, **When** it is called complete, **Then** a
   passing full RED-GREEN pressure/application scenario backs the claim — not a
   structural diff alone.

---

### User Story 5 - Configure how findings flow into memory (Priority: P3)

A project declares, in its `CHORUS-PROJECT.md` addendum, the targets and policy
for incorporating chorus findings into memory. The contract (findings-artifact
shape + agent-memory layout) is documented in `chorus-core` so a later callback
can consume it. The callback/hook implementation is **not** built in this
feature.

**Why this priority**: This is a designed seam, not runnable wiring. It records
load-bearing reality (the memory layout and findings shape already exist) as an
explicit contract, so the future callback is a clean addition.

**Independent Test**: Confirm `CHORUS-PROJECT.md` has a findings→memory
configuration section and `chorus-core` documents the consuming contract; confirm
no callback/hook execution code is added.

**Acceptance Scenarios**:

1. **Given** the addendum template, **When** a project fills the findings→memory
   section, **Then** it can declare targets/policy without any callback being
   implemented.
2. **Given** `chorus-core`, **When** read, **Then** it documents the
   findings-artifact shape and agent-memory layout the future callback will use.

---

### Edge Cases

- **Missing substrate**: a sibling is invoked but `chorus-core` is absent. The
  sibling must fail loudly (via core's reachability self-check / fitness checks),
  not degrade silently — because the `REQUIRED:` marker is advisory, not enforced
  by the loader.
- **Renamed/duplicated substrate**: `chorus-core` installed under a different
  published name, or the `chorus` vs `chorus-review` published-name mismatch — the
  manifest-sync fitness check must surface it.
- **Dangling invariant token**: a skill references an `In`/`Sn`/`Dn` token whose
  definition is not reachable through its declared composition. The
  invariant-resolution fitness check must fail.
- **Fat-sibling import**: a future edit makes `chorus-review` or `chorus-sdlc`
  reference the other's files. The no-fat-sibling-import check must fail.
- **Partial install**: only some suite skills copied. Packaging/manifest checks
  must detect the mismatch against disk.

## Requirements *(mandatory)*

### Functional Requirements

**Decomposition structure**

- **FR-001**: The suite MUST provide a substrate skill `chorus-core` containing
  the three shared primitives (gate, decision, exploratory) moved without
  behavioral change, plus a `CONDUCTOR.md` carrying the mode-independent
  discipline (methodology, conductor voice, "the chair decides nothing" +
  slippage table, discipline cascade, system-boundary refusals) **and the full
  `I1–I9` invariant catalog**.
- **FR-002**: `chorus-core`'s entry point MUST be a lean router that loads a small
  index and directs on-demand reads of its four substrate files (it MUST NOT load
  all substrate content on every reference), and MUST open with a reachability
  self-check that fails loudly if its files are not reachable.
- **FR-003**: `chorus-core` MUST be marked as substrate referenced by sibling
  skills, not as a user-triggered skill (its description carries no operator
  trigger phrase).
- **FR-004**: The suite MUST provide `chorus-review` containing only the base
  project-state round (the phases procedure with the "two modes" framing and the
  SDLC pointer removed) plus a round-specific integration layer (position,
  per-phase pre/post, sees/does-not-see) that references the `I1–I9` catalog in
  `chorus-core` rather than redefining it. It MUST declare `chorus-core` as a
  required composition.
- **FR-005**: The suite MUST provide `chorus-sdlc` containing only the lifecycle
  gating procedure (pipeline, gate mechanics, `S1–S7`, ledger, refusals), with
  `S1–S7` extending the core-resident `I1–I9` catalog, and MUST declare
  `chorus-core` as a required composition.
- **FR-006**: `chorus-sdlc` MUST NOT depend on `chorus-review` — no reference in
  `chorus-sdlc` may resolve into the review skill's files or invariants.

**Anti-drift (load-bearing)**

- **FR-007**: Every invariant token (`In`, `Sn`, `Dn`) MUST be defined in exactly
  one file, and every such definition MUST reside in `chorus-core`.
- **FR-008**: Every invariant token referenced by any suite skill MUST resolve to
  its single definition through that skill's declared composition (no dangling
  cross-skill references).

**Findings→memory seam (contract only)**

- **FR-009**: The `CHORUS-PROJECT.md` addendum (and its template) MUST gain a
  findings→memory section by which a project declares targets and policy for
  incorporating chorus findings into memory.
- **FR-010**: `chorus-core` MUST document the findings-artifact shape and the
  agent-memory layout as a contract a future callback can consume.
- **FR-011**: The feature MUST NOT implement the findings→memory callback/hook
  wiring (explicitly deferred and redesignable later).

**Packaging & integrity**

- **FR-012**: The installer MUST install every suite skill directory (iterating
  over the skills source, not a single hardcoded directory) into the Claude
  configuration; persona agents continue to install to the shared agents
  directory unchanged. It does NOT perform stale-file migration on existing
  installs — obsolete-file cleanup is handled out-of-band via Claude, not codified
  in `install.sh`.
- **FR-013**: The plugin manifest MUST list all suite skills and MUST be
  corrected for its existing drift (it currently claims a security agent it does
  not list and omits Goldratt and the optional Guido lens against the nine-lens
  roster).
- **FR-014**: The feature MUST provide three greppable, manually-runnable fitness
  checks: (a) invariant-resolution (FR-008), (b) no-fat-sibling-import (FR-006),
  (c) packaging-manifest sync (manifest arrays match disk and the advisor count
  matches the roster). It MUST NOT wire them into an automated test harness —
  that (a Jest/TS test suite invoking these checks) is deferred to a follow-up
  spec. The checks here are the source-of-truth contracts a later harness will
  call.

**Behavior parity & naming**

- **FR-015**: The decomposition MUST NOT change reviewing behavior; review and
  lifecycle MUST execute the same procedure as before. Parity MUST be proven by
  **full writing-skills RED-GREEN pressure/application scenarios for every moved
  or split skill** (`chorus-core`, `chorus-review`, `chorus-sdlc`) — a baseline
  captured pre-split, the scenarios re-run post-split, and equivalence
  demonstrated — not by structural equivalence alone and never merely asserted.
- **FR-016**: The work MUST keep the review skill named `chorus-review` and MUST
  record the published `chorus` vs source `chorus-review` name mismatch as an
  explicit reconciliation task; it MUST NOT silently rename the published skill.

**Out of scope (recorded as committed seams, not built)**

- **FR-017**: The feature MUST NOT build the `chorus-viewpoint-extraction`,
  `chorus-setup`, or `chorus-memory-update` skills; it MUST record their
  extraction seams in `chorus-core` (extract-stage record contract, agent-memory
  layout, two-tier memory model).
- **FR-018**: The feature MUST NOT change persona-agent content or the roster, and
  MUST NOT address `chorus learn` / `LEARN.md`.
- **FR-019**: The feature MUST NOT introduce an automated test harness for the
  fitness checks (FR-014); the Jest/TS test suite that runs them is a committed
  seam for the next spec.

### Key Entities

- **chorus-core**: the shared substrate skill; single source of all invariants
  and shared mechanics; router entry + four substrate files.
- **chorus-review**: the project-state-round skill; composes core.
- **chorus-sdlc**: the lifecycle-gating skill; composes core; independent of
  review.
- **Invariant catalog**: the `I1–I9` / `S1–S7` / `S8–S10` / `D1–D5` token set,
  each defined once, all resident in core.
- **CHORUS-PROJECT.md addendum**: per-project configuration surface; gains the
  findings→memory section.
- **Findings→memory contract**: the documented findings-artifact shape +
  agent-memory layout a future callback will consume.
- **Fitness checks**: the three greppable integrity guards.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of invariant tokens are defined in exactly one file, all in
  `chorus-core` (invariant-resolution check passes with zero dangling tokens).
- **SC-002**: Neither `chorus-review` nor `chorus-sdlc` contains any reference
  resolving into the other (no-fat-sibling-import check passes), and the
  lifecycle gate completes with the review skill absent.
- **SC-003**: A project-state review runs to a complete artifact without loading
  any lifecycle-only content beyond the shared substrate.
- **SC-004**: Review and lifecycle behavior match the pre-split baseline on the
  parity scenarios (same procedure executed, equivalent artifact/ledger
  produced).
- **SC-005**: The packaging-manifest sync check passes — manifest skill/agent
  arrays match disk and the stated advisor count matches the nine-lens roster.
- **SC-006**: A project can declare a findings→memory policy in
  `CHORUS-PROJECT.md` with zero callback/hook code present in the feature.
- **SC-007**: Invoking a sibling with `chorus-core` absent fails loudly rather
  than degrading silently.

## Assumptions

- The skill loader does **not** enforce the `REQUIRED:` composition marker (only
  `name`/`description` are enforced frontmatter); hence the reachability
  self-check and fitness checks are the real enforcement. (Confirmed against the
  skill-authoring spec; carried as the single residual inference from the
  architecture review.)
- Persona agents remain installed in the shared agents directory, outside any
  skill directory; the split does not touch them.
- "Same procedure, relocated source" is the parity bar — the feature relocates
  where behavior is defined, not what it does.
- The fitness checks are greppable scripts proportional to a markdown skill
  suite, not a framework.
- The findings-artifact shape and agent-memory layout already exist in the
  running system; documenting them as a contract records load-bearing reality
  rather than inventing a future interface.
