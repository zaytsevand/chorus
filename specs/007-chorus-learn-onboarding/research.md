# Research: `chorus learn` — Interactive Staged Onboarding

**Feature**: 007-chorus-learn-onboarding | **Date**: 2026-06-10

No `NEEDS CLARIFICATION` markers existed in Technical Context; the research tasks below
resolve the design forks the spec left as planning details, each grounded in the repo
as it stands.

## R1 — Where the mode lives: `LEARN.md` companion, not inline

- **Decision**: Author the tutorial as a new companion doc
  `skill/chorus-review/LEARN.md` — the single canonical definition of the learn mode.
  `SKILL.md` registers the mode in its mode list (trigger: "chorus learn" /
  `/chorus learn`) with a one-paragraph summary and a pointer, exactly the shape used
  for `SDLC-LAYER.md` (lifecycle mode).
- **Rationale**: `SKILL.md` is already ~15 KB and is read in full by the orchestrator
  every round; a ~10 KB tutorial inlined there taxes every non-learn invocation. The
  companion-doc pattern is the repo's established mechanism for a mode
  (`SDLC-LAYER.md`), and the spec's Assumption 1 anticipated it ("or a referenced
  `LEARN.md` companion if it grows" — it grows: 5 stages × explanation + navigation +
  edge-case routing).
- **Alternatives considered**: (a) inline `SKILL.md` section — rejected, bloats the
  hot path and mixes onboarding altitude with operating procedure; (b) a new skill —
  rejected by the spec itself (mode-of-one-skill shape).

## R2 — Stage set: the spec's five, with sub-steps inside stages

- **Decision**: Exactly the five stages of FR-002 — **(1) orient, (2) set up,
  (3) run a round, (4) agent-SDLC, (5) work with results** — with conditional
  sub-steps *inside* stages rather than extra stages: the install check is a sub-step
  of *orient* (FR-006 routes to an install sub-step only when the skill is missing);
  the scaffold offer is a sub-step of *set up* (FR-007).
- **Rationale**: SC-002 caps the count ("small, fixed, ≈5"); sub-steps keep the
  conditional paths (already installed / addendum exists / outside a repo) from
  multiplying stages. Each stage maps to one teachable claim:
  | Stage | Teaches | Cites |
  |---|---|---|
  | 1 orient | what the chorus is; the three modes; what's installed | `SKILL.md` |
  | 2 set up | install; the addendum (sections 2/3/5); the roster | `install.sh` next-steps, `templates/CHORUS-PROJECT.template.md`, `SKILL.md` §addendum |
  | 3 run a round | "spawn the chorus": RSVP → four-stage primitive → artifact | `GATE-PRIMITIVE.md`, `SKILL.md` §procedure |
  | 4 agent-SDLC | gating a speckit feature; block-on-🔴; self-heal | `SDLC-LAYER.md`, `DECISION-PRIMITIVE.md` |
  | 5 work with results | the artifact, baselines, overriding 🟡 defaults, next round | `SKILL.md` §artifact, `DECISION-PRIMITIVE.md` §review surfaces |
- **Alternatives considered**: a 6th "expert fast-exit" stage — rejected; the fast exit
  is an *option on stage 1's question* (edge case "user already expert"), not a stage.

## R3 — Navigation contract within the AskUserQuestion budget

- **Decision**: Each stage ends with **one AskUserQuestion call, one question, exactly
  4 options**: **(a)** advance to the next stage (recommended, listed first), **(b)** go
  deeper on the current topic, **(c)** jump to another stage, **(d)** exit (with the
  "you can now do X" wrap-up of FR-011). Selecting **(c)** triggers one follow-up
  question listing the remaining stages by name (≤4 fit: 5 stages minus current minus
  next-already-offered ≤ 3, plus "back to where I was"). The tool's built-in "Other"
  free-text covers arbitrary asks without costing an option slot.
- **Rationale**: FR-004 names exactly four affordances; the AskUserQuestion tool
  presents up to 4 options per question — the contract fits the primitive with zero
  compression. The two-step jump keeps every question scannable (FR-003: never a wall
  of text) while still reaching any stage in ≤2 interactions (SC-003's "one navigation
  choice" is satisfied by stage 1's question offering the jump directly).
- **Alternatives considered**: (a) flattening all stage names into the per-stage
  question — rejected, would need >4 options; (b) multiSelect — rejected, navigation is
  mutually exclusive; (c) free-text-only navigation — rejected, undiscoverable for the
  newcomer the feature exists for.

## R4 — Resume state: in-conversation, zero writes

- **Decision**: The orchestrator tracks the last stage reached **in conversation
  state only**. Re-invoking "chorus learn" in a session where a tutorial was exited
  offers resume-or-restart (FR-010). Across sessions there is no persisted marker; a
  fresh session starts at orientation, which is itself skippable in one choice.
- **Rationale**: The spec's assumption says lightweight, best-effort-within-conversation
  suffices; any persisted marker (a state file) would violate the non-mutating default
  (FR-005) for a convenience the navigation already provides (any stage reachable in
  ≤2 choices).
- **Alternatives considered**: a `.claude/`-side state file — rejected (a write the
  user never asked for, and cross-machine persistence is explicitly out of scope).

## R5 — Detection mechanics (orientation routing), all read-only

- **Decision**: Stage 1 performs three read-only checks and routes on them (FR-006):
  1. **Skill installed** — `$CLAUDE_HOME/skills/chorus-review/SKILL.md` exists (default
     `~/.claude`), else route to the install sub-step (clone + `./install.sh`).
  2. **Project addendum** — `docs/reviews/CHORUS-PROJECT.md` exists in the cwd repo →
     setup stage offers review/extend instead of scaffold (US3 scenario 3).
  3. **Repo context** — `git rev-parse --is-inside-work-tree` succeeds; outside a repo
     the scaffold offer is suppressed and the tutorial stays explanatory (edge case).
- **Rationale**: All three are one-command, side-effect-free probes; they make the
  tutorial truthful about the user's actual state instead of assuming a fresh machine.
- **Alternatives considered**: asking the user "is the skill installed?" — rejected;
  the newcomer often doesn't know, and the probe is free.

## R6 — Scaffold source: deploy the template with the skill

- **Decision**: Extend `install.sh` to copy `templates/` into the installed skill dir
  (`$SKILL_DST/templates/CHORUS-PROJECT.template.md`). The scaffold action (FR-007)
  copies **from the installed skill location** into the user project's
  `docs/reviews/CHORUS-PROJECT.md`, flagging sections 2/3/5 as to-fill. Existing
  addendum → review/extend offer, never overwrite (US3); outside a repo → suppressed
  (R5.3).
- **Rationale**: Today `install.sh:36` deploys only `skill/chorus-review/*.md`; the
  template exists **only in the source repo** (`templates/CHORUS-PROJECT.template.md`),
  which an installed skill running in an arbitrary user project cannot reach. Without
  this edit, FR-007 is unimplementable everywhere except this repo. The installer's own
  "Next:" text (install.sh:57-60) already tells humans to copy this template — the
  scaffold automates exactly that documented step.
- **Alternatives considered**: (a) embedding the template's content inside `LEARN.md` —
  rejected, duplicates a canonical artefact (violates the cite-not-restate discipline
  the feature itself enforces, FR-008); (b) fetching from GitHub at scaffold time —
  rejected, network dependency + supply-chain surface for a local file we can ship.

## R7 — Cite-not-restate enforcement: structural checks in quickstart

- **Decision**: `quickstart.md` carries the feature's conformance checks, runnable
  against the repo as-is: **(1) mode registered** — `SKILL.md` mode list and README name
  "chorus learn"; **(2) stages present** — `LEARN.md` contains the five stage headings;
  **(3) cite-resolution** — every canonical doc `LEARN.md` references exists at the
  cited path (a rename surfaces as a broken pointer, SC-005); **(4) no-restatement
  scan** — `LEARN.md` contains none of the canon's load-bearing definition blocks (the
  tally table, the band table, the catalog, the four-stage list verbatim); **(5)
  scaffold safety** — the scaffold contract names its three preconditions (opt-in
  confirm, no-overwrite, in-repo).
- **Rationale**: This mirrors how 004/006 made prose specs checkable (structural smoke
  checks that run with no runtime); SC-005's "inspection finds no restated mechanic"
  becomes mechanically scannable instead of a judgment call.
- **Alternatives considered**: prose-only review — rejected; drift is exactly the
  failure the spec calls out (US4).

## R8 — Sequencing on feature 006 (PR #5, open)

- **Decision**: 007 **lands after 006 merges**. Before `/speckit-implement`, merge
  `main` (containing 006) into this branch — or rebase — and author `LEARN.md` against
  the 006-era canon (three-band decision discipline, two-axis RSVP signal,
  `DECISION-PRIMITIVE.md` present). Tutorial stages 3–5 cite `DECISION-PRIMITIVE.md`,
  which exists only post-006.
- **Rationale**: This branch was cut from main before PR #5; its
  `skill/chorus-review/` lacks `DECISION-PRIMITIVE.md` and its `SKILL.md` predates the
  decision-discipline edits. The spec's own Context paragraph lists
  `DECISION-PRIMITIVE.md` among the docs the tutorial mediates — the dependency is in
  the spec, not optional. Both branches edit `SKILL.md`'s mode-area text, so merging
  006 first also localizes the conflict to one known edit site.
- **Alternatives considered**: authoring against pre-006 canon and patching later —
  rejected; it guarantees the tutorial teaches a roster of mechanics that is stale on
  arrival (the exact drift FR-008 exists to prevent).
