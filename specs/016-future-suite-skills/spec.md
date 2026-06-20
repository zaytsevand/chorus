# Feature Specification: Future Suite Skills (design decision on the three reserved seams)

**Feature Branch**: `016-future-suite-skills`

**Created**: 2026-06-21

**Status**: Draft (design-only; no build)

**Input**: Design — not build — the three skills feature 014 reserved as seams in
`skill/chorus-core/CONDUCTOR.md` (§ *Reserved-seam contracts*):
`chorus-viewpoint-extraction`, `chorus-setup`, `chorus-memory-update`. Decide, for
each, its purpose, extraction surface, composition, trigger, the core contract it
consumes, and whether it is worth building now (YAGNI). Resolve the
`chorus-memory-update` vs. spec-010 memory-update-phase overlap. Companion design:
`docs/superpowers/specs/2026-06-21-future-suite-skills-design.md`.

## One feature or three?

**One feature.** The three skills are not independent: they share the same
substrate, the same two-tier-memory and extract-record contracts, and — critically
— the central decision (build vs. defer-and-record-the-trigger) is the *same*
decision applied three times against the same body of already-shipped code. Their
overlaps interact (`chorus-setup` scaffolds the tree `chorus-memory-update`
maintains; `chorus-memory-update`'s mechanic and `chorus-viewpoint-extraction`'s
record both live in core). Splitting into three features would re-litigate the
shared YAGNI frame three times and risk inconsistent boundary calls. This single
feature delivers **a design + a per-skill build/defer decision with un-defer
triggers** — no skill is built here.

If any one skill is later approved for build, *that* gets its own feature
(`/speckit-specify` per skill), seeded from the relevant section of the companion
design doc.

## Clarifications

### Session 2026-06-21

- Q: Is the deliverable a build, or a design decision? → A: **Design decision.**
  This feature produces the design doc + this spec and a recorded build/defer
  verdict per skill. It implements no skill and changes no existing sibling.
- Q: How is the `chorus-memory-update` vs. spec-010 overlap resolved? → A: Recorded
  as the top open question (FR-009); recommendation is to lift the shared
  write-back *mechanic* into a core-resident primitive that 010 and an optional
  base-round bookend both call — **not** a standalone maintenance skill — preserving
  010's lifecycle anchoring + ledger audit. The execution of that refactor is a
  separate future feature, out of scope here.

## User Scenarios

### US1 — A maintainer deciding what to build next (primary)

A suite maintainer, holding the three reserved seams, needs a defensible answer to
"do we build any of these now?" — with the extraction surface, composition, and
risks made explicit per skill, and the YAGNI call recorded so the decision is
legible, not re-argued each round.

**Acceptance:** the design doc states, per skill, purpose / extraction-with-pointers
/ composition / trigger / consumed-contract / open-questions, and a build-now
verdict with an un-defer trigger.

### US2 — A future builder picking up one of the three

When a skill is later approved, the builder can start from the companion design's
section for that skill without re-deriving the boundary against shipped code.

**Acceptance:** each skill's section names its exact extraction pointers
(`file:line`) into the current suite and the core contract it consumes.

### US3 — Protecting spec-010 from regression

The `chorus-memory-update` design must not propose anything that, if built, would
strip the SDLC memory-update phase's lifecycle bindings or ledger audit.

**Acceptance:** FR-009 records the collision and the regression-safe resolution
shape (mechanic-down, bindings-stay).

## Requirements

- **FR-001**: The feature MUST produce a design doc at
  `docs/superpowers/specs/2026-06-21-future-suite-skills-design.md` covering all
  three reserved-seam skills.
- **FR-002**: For EACH skill the design MUST state: single purpose; exactly what
  it extracts from the current suite with `file:line` pointers; how it composes
  `chorus-core`; its trigger/entry (or that it is substrate); the contract it
  consumes from core; and its key open design questions / risks.
- **FR-003**: The design MUST apply YAGNI honestly and record, per skill, a
  build-now verdict and the concrete trigger that would un-defer it.
- **FR-004**: The design MUST resolve the `chorus-viewpoint-extraction` seam to the
  extract-stage record contract (`CONDUCTOR.md:328-341`; schema
  `GATE-PRIMITIVE.md:32-41`) and name pluggability of a third `source:` as the
  skill's load-bearing value.
- **FR-005**: The design MUST resolve the `chorus-setup` seam to the agent-memory
  layout contract (`CONDUCTOR.md:343-349`) and acknowledge the read-side's graceful
  cold-start (`EXPLORATORY-PHASE.md:46-50,227-244`) as the YAGNI counter-pressure.
- **FR-006**: The design MUST resolve the `chorus-memory-update` seam to the
  two-tier memory model (`CONDUCTOR.md:351-361`) and the gate-upkeep mechanic
  (`EXPLORATORY-PHASE.md:149-182`).
- **FR-007**: The design MUST identify and address the `chorus-memory-update` vs.
  the spec-010 SDLC memory-update phase overlap (`chorus-sdlc/SKILL.md:240-291`),
  stating explicitly whether one is absorbed into the other and whether extraction
  regresses 010.
- **FR-008**: The design MUST carry the FR-010a secret-pre-filter (deny-default,
  two-part detector, audit-every-drop, `CONDUCTOR.md:393-418`) as a hard
  precondition on any proposed memory write-side.
- **FR-009**: The design MUST NOT build any of the three skills, MUST NOT change
  any existing sibling skill, and MUST NOT alter the reserved-seam contracts in
  `chorus-core/CONDUCTOR.md`.
- **FR-010**: The feature MUST state whether the three are one feature or three
  (decided: one feature; per-skill build gets its own future feature).

## Reserved seams (the subject of this spec)

| Future skill | Consumes (core contract) | Extracts from (current suite) |
|---|---|---|
| `chorus-viewpoint-extraction` | extract-stage record `CONDUCTOR.md:328-341` | `SKILL.md:300-313` (Phase-1 Extract); `GATE-PRIMITIVE.md:25-51` (schema); `chorus-sdlc/SKILL.md:227-238` (spec-walkthrough); `SKILL.md:118-137` (anchor-discovery) |
| `chorus-setup` | agent-memory layout `CONDUCTOR.md:343-349` | `EXPLORATORY-PHASE.md:89-91`; `SKILL.md:389-393` (memory-recovery); install seam |
| `chorus-memory-update` | two-tier memory `CONDUCTOR.md:351-361` | `EXPLORATORY-PHASE.md:149-182` (gate-upkeep); **collides with** `chorus-sdlc/SKILL.md:240-291` (spec 010); findings→memory callback `CONDUCTOR.md:363-418` |

## Build-now scope

- The design doc (FR-001..FR-008) and this spec (the build/defer decision record).
- A recorded verdict: **none of the three is built now**; all three seams stay
  reserved; per-skill un-defer triggers are documented.

## Out of scope

- Building `chorus-viewpoint-extraction`, `chorus-setup`, or `chorus-memory-update`.
- Implementing the findings→memory callback/hook wiring (still deferred, 014
  FR-011 / `CONDUCTOR.md:363-367`).
- Executing the recommended write-back-primitive refactor of spec-010 (a separate
  future feature if approved).
- Any change to existing sibling skills, the reserved-seam contracts, persona-agent
  content, or the roster.

## Success Criteria

- **SC-001**: A maintainer can read the design and, per skill, state its purpose,
  extraction surface, and build/defer verdict without opening the source files.
- **SC-002**: The `chorus-memory-update` vs. spec-010 overlap is resolved in
  writing, with the regression risk to 010 named and a regression-safe shape
  recommended (FR-007).
- **SC-003**: Each skill carries an un-defer trigger — a concrete future condition
  that would make the build worthwhile (FR-003).
- **SC-004**: No existing sibling skill or core contract is modified by this
  feature (FR-009).

## Key open questions (carried from the design, one per skill)

- **`chorus-viewpoint-extraction`** — Is this a skill or just a source registry?
  Without a concrete third `source:`, it relocates `GATE-PRIMITIVE.md` Stage-1
  prose and buys no new capability.
- **`chorus-setup`** — Does anything break without it? The read-side cold-starts
  gracefully by design, so its honest value (template seed + install validation)
  may be install plumbing, not a skill.
- **`chorus-memory-update`** — Absorb spec-010 or coexist with it? Recommendation:
  lift the shared write-back *mechanic* into core; keep 010's lifecycle bindings +
  ledger audit in `chorus-sdlc` — do not build a standalone maintenance skill, and
  do not regress 010.
</content>
</invoke>
