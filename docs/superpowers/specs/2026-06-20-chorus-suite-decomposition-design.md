# Chorus Suite Decomposition — design

**Date:** 2026-06-20
**Status:** approved for /speckit-specify
**Topic:** Split the single `chorus-review` skill into a composable suite of
smaller skills over a shared substrate, and reserve the seam for a project-wide
findings→memory configuration callback.

## Problem

Today the chorus is **one** skill (`skill/chorus-review/`, installed as
`chorus`) carrying two distinct workflows plus their shared mechanics in six
files (~1,880 lines):

| File | Role | Shared? |
|---|---|---|
| `SKILL.md` (549) | base project-state round, Phases 0–5 + SDLC pointer | review mode |
| `INTEGRATION-LAYER.md` (461) | orchestrator discipline | **mixed** — shared conductor discipline + round-specific phase gates |
| `SDLC-LAYER.md` (249) | lifecycle gating mode | sdlc mode |
| `GATE-PRIMITIVE.md` (161) | four-stage review mechanic (S8–S10) | **both** |
| `DECISION-PRIMITIVE.md` (183) | decision banding (D1–D5) | **both** |
| `EXPLORATORY-PHASE.md` (275) | persisted per-lens understanding | **both** |

Costs of the single-skill shape:
- **Discovery (SDO).** One `description` does triple duty ("spawn the chorus" /
  "run the agent-SDLC" / "chorus learn"), against the best-practice rule that a
  description names *only* triggering conditions for *one* skill.
- **Per-invocation load.** A plain review pulls SDLC machinery into context and
  vice-versa; nothing loads only what its mode needs.
- **Composition.** Pieces that deserve to be their own skills (the next one
  being review-surface viewpoint/extract) are embedded with no clean seam.

Progressive disclosure already keeps *idle* cost near-zero (only the frontmatter
loads until invoked), so the split's wins are **discovery**, **per-invocation
load**, **independent evolution**, and **room to extract more skills later** —
not idle-context savings.

## Decision

Establish a **chorus suite**: one shared substrate skill plus thin
orchestration/lens skills that compose it. Nothing depends on a fat sibling;
every skill composes `chorus-core`. This makes each future extraction a clean
peel rather than a refactor.

```
skills/
  chorus-core/                  # substrate — referenced by name, not user-triggered
  chorus-review/                # "spawn the chorus" → project-state round
  chorus-sdlc/                  # "run the agent-SDLC on feature 0NN"
  chorus-viewpoint-extraction/  # (future) extract / fixed-viewpoint pass
  chorus-setup/                 # (future) bootstrap agent memory post-install
  chorus-memory-update/         # (future) maintain agents' memory files
```

### Build-now scope

`chorus-core` + `chorus-review` + `chorus-sdlc`, **plus** a project-wide
findings→memory **configuration contract** (a designed seam, impl deferred).
The future three skills are recorded as committed seams, not built.

## Skill boundaries

### chorus-core (substrate; the anti-drift seam)

Single source of truth for every shared mechanic. Files:

- `GATE-PRIMITIVE.md` — moved as-is (stages + S8–S10).
- `DECISION-PRIMITIVE.md` — moved as-is (banding + D1–D5).
- `EXPLORATORY-PHASE.md` — moved as-is.
- `CONDUCTOR.md` — **new**, extracted from today's `INTEGRATION-LAYER.md`: the
  mode-independent discipline — EWD-340 methodology, the Conductor voice/shtick,
  "the chair decides nothing" + slippage table, the discipline cascade, the
  system-boundary refusals, **and the `I1–I9` invariant catalog** (the audit
  points of the discipline cascade). (SDLC already states its "Dijkstra posture
  is unchanged, one level up" — this content is genuinely shared.)
  - **Why the whole `I1–I9` catalog, not just `I9`** (architecture review,
    high-confidence, source-verified): `SDLC-LAYER.md:186,188,197,199,202`
    define `S1/S2/S4/S5/S6` as *"(Extends I1/I2/I7/I8)"*, and `I1–I8` are
    defined in today's `INTEGRATION-LAYER.md:328-353`. If `I1–I8` stayed in
    `chorus-review`, then `chorus-sdlc`'s correctness argument would depend on
    review's invariant catalog — the exact fat-sibling coupling this suite
    exists to kill, relocated from file-reads into the audit-chain lineage
    (invisible to a file-dependency check, but real). Putting the catalog in
    core makes it the single source for the invariant numbering scheme the
    README's "cannot drift" promise rests on; both siblings extend a
    core-resident scheme.
- `SKILL.md` — a **lean router**: invoking the skill loads a small index that
  then directs on-demand `Read`s of the four files above. "Referenced by name"
  must not mean "load 600+ lines every time." Its `description` marks it as
  substrate referenced by sibling skills, not a user trigger.

### chorus-review (base round only)

- `SKILL.md` — Phases 0–5, with the "two modes" framing and the SDLC pointer
  removed (one mode per skill). `REQUIRED: chorus-core`.
- `INTEGRATION-LAYER.md` — slimmed to round-specific content: position-in-system
  for a round, per-phase pre/post for Phases 0–5, the sees / does-not-see lists.
  **References** the `I1–I9` catalog now resident in `chorus-core/CONDUCTOR.md`
  (does not redefine it) and uses it as the round's invariants; references
  `chorus-core/CONDUCTOR.md` for shared discipline instead of restating it.

### chorus-sdlc (lifecycle only)

- `SKILL.md` — promoted from today's `SDLC-LAYER.md` (pipeline, gate mechanics,
  `S1–S7`, ledger, refusals). `REQUIRED: chorus-core`. **No dependency on
  `chorus-review`** — achieved by the catalog move above: `S1–S7` now extend the
  `I1–I9` catalog resident in `chorus-core/CONDUCTOR.md`, not in review. (The
  line-3 "companion to `INTEGRATION-LAYER.md`" framing in today's `SDLC-LAYER.md`
  is rewritten to point at core.) Every other cross-reference in today's
  `SDLC-LAYER.md` already points at the three primitives (core), not review —
  verified.

## Resolved forks

**Fork A — split `INTEGRATION-LAYER`.** Shared discipline **and the `I1–I9`
invariant catalog** → `chorus-core/CONDUCTOR.md`; round-phase gates →
`chorus-review/INTEGRATION-LAYER.md`. Rejected alternative: leave it whole in
review and have sdlc reference it — that recreates the fat-sibling dependency the
suite exists to kill. (The catalog must move with the discipline, not stay in
review — see the "Why the whole `I1–I9` catalog" note above.)

**Fork B — siblings pull core by skill-invoke (reference by name).** Each
sibling carries a `REQUIRED: chorus-core` marker; the orchestrator invokes
`chorus-core` by name. Progressive disclosure is preserved by core's
router-style `SKILL.md` (small index → on-demand reads of its own files), not by
cross-skill file paths. Rejected alternative: path-based `Read` of core files —
cheaper load but fragile cross-skill paths and weaker than best-practice
reference-by-name.

- **Failure mode (architecture review, verified):** `REQUIRED: chorus-core` is
  **advisory body-prose**, not a loader-enforced constraint — per the
  skill-authoring spec only `name`/`description` are enforced frontmatter. If
  `chorus-core` is absent or installed under a different published name (note the
  `chorus` vs `chorus-review` mismatch in Cross-cutting consequences), the marker
  silently no-ops and the sibling degrades quietly rather than failing loudly.
  **Mitigation:** core's router `SKILL.md` opens with a self-check
  preamble that asserts its four files are reachable, and fitness function #1/#3
  (below) make a missing/renamed core a hard CI failure. The answer is to make
  the dependency loud, not to reverse Fork B.

## Reserved seams (designed now, built later)

| Future skill | Extracted from | Seam owned by chorus-core |
|---|---|---|
| `chorus-viewpoint-extraction` | Phase-1 Extract pass + addendum item-7 anchor-discovery + Gate-C `spec-walkthrough` ingestion | the **Extract-stage record contract**: `file:line`-anchored, `source:`-tagged records (already gate-primitive stage 1) |
| `chorus-setup` | `.claude/agent-memory/<persona>/` convention (Phase-1 memory recovery) | the **agent-memory layout** as a named convention |
| `chorus-memory-update` | `EXPLORATORY-PHASE.md` § Gate upkeep + persona memory records | the **two-tier memory model** (addendum = authoritative base; records cache it) |

### Findings → memory configuration callback (the build-now seam)

A **project-wide configuration** by which chorus findings are incorporated into
memory, integrated with how agent/project memory is used today in the dogfooding
project (LinkedInTools: `.claude/agent-memory/<persona>/` + project memory).

- **Config home:** extend the existing `CHORUS-PROJECT.md` addendum (already the
  per-project configuration surface) with a section declaring the
  findings→memory targets and policy.
- **Contract in core:** core documents the **findings artifact shape** and the
  **agent-memory layout** so a later callback/hook can consume them without
  rework.
- **Deferred:** the callback/hook *implementation* (when it fires, how) is
  explicitly redesignable later. This spec designs the seam and the config
  contract, not the wiring.

## Cross-cutting consequences

- **Anti-drift preserved by construction.** Each `Sn` / `In` / `Dn` invariant is
  defined in exactly one file, all resident in `chorus-core`: `S8–S10` in
  `GATE-PRIMITIVE.md`, `D1–D5` in `DECISION-PRIMITIVE.md`, the **`I1–I9` catalog**
  in `CONDUCTOR.md`. `chorus-review` *uses* `I1–I9` as its round invariants
  (by reference); `chorus-sdlc`'s lifecycle `S1–S7` *extend* the core-resident
  `I1–I9`. No invariant is defined outside core, so no cross-skill reference
  dangles. **This single-source property is asserted by the design and enforced
  by fitness function #1 — not left to prose.**
- **Packaging.** `install.sh` loops over `skill/*/` → `~/.claude/skills/<name>/`
  (today it hardcodes one dir). `plugin.json` lists the suite skills. Persona
  agents already install to `~/.claude/agents/` (shared, outside any skill dir) —
  no change. **`plugin.json` is already drifted** and must be corrected as part
  of this work: it claims "Seven persona advisors plus a security agent" but
  lists 7 agents with *no* security agent, and omits Goldratt and the optional
  Guido lens against a nine-lens roster. Going to a multi-skill `skills: [...]`
  array multiplies this drift class — hence fitness function #3.
- **Naming reconciliation.** This environment lists the installed skill as
  `chorus`; repo frontmatter is `chorus-review`. Keep `chorus-review` for the
  review skill; flag the published-name reconciliation as an explicit task, do
  not silently rename.

## Fitness functions (keep them greppable, not a framework)

Proportional to a markdown skill suite — defend the seams that prose can't.

1. **Invariant resolution check (the anti-drift guard).** Scan every suite skill
   for `I\d` / `S\d` / `D\d` tokens; assert each resolves to exactly one
   definition reachable via that skill's declared `REQUIRED:` composition.
   Cheapest version: fail if any `In` token in `chorus-sdlc` lacks a definition
   in `chorus-sdlc` or `chorus-core`. This check would **fail today** against the
   pre-fix design — which is why it is worth having. Converts the README's
   "cannot drift" promise from assertion to enforcement.
2. **No-fat-sibling-import check.** Assert neither `chorus-review` nor
   `chorus-sdlc` references the other's files by name or path. Makes the suite's
   founding constraint ("nothing depends on a fat sibling") executable. ~5 lines.
3. **Packaging-manifest sync check.** Assert `plugin.json`'s `skills`/`agents`
   arrays match the directories/files on disk (and that the prose description's
   advisor count matches the roster). Justified by the existing `plugin.json`
   drift; pays for itself the moment `skills` becomes a multi-entry array.

## Architecture review (Mark Richards, high-effort, 2026-06-20)

Verdict: **yes — with the invariant-lineage fix above**, now incorporated.
Source-verified findings folded into this revision: the `I1–I9` catalog moves to
core (was the design's false "no fat-sibling dependency" claim); Fork B's
advisory-`REQUIRED:` failure mode + loud-failure mitigation; the three fitness
functions; the `plugin.json` drift. The three reserved future skills were
endorsed as cheap insurance (correct YAGNI). One humility caveat carried forward:
the Fork B failure-mode rests on the inference that the loader does not enforce
`REQUIRED:` — confirmed against the skill-authoring spec (only `name`/
`description` are enforced), so the mitigation stands.

### Open decision routed to the operator

The findings→memory **configuration callback contract** is the one build-now item
the review flags for reconsideration (YAGNI): its memory layout and findings
shape *already exist* in the running system (`EXPLORATORY-PHASE.md` two-tier
memory; `SKILL.md` findings register), so naming them as a committed contract is
"writing down what's load-bearing" — but nothing observably breaks if the
contract is demoted to the same *reserved-seam* tier as the other three future
skills. **You already chose to include it as a designed seam (impl deferred);
this records the review's challenge so the choice is legible.** Confirm keep, or
demote to reserved-seam — either is coherent.

## Out of scope

- Building `chorus-viewpoint-extraction`, `chorus-setup`, `chorus-memory-update`.
- Implementing the findings→memory callback/hook wiring.
- Any change to persona-agent content or the persona roster.
- `chorus learn` / `LEARN.md` (not present in repo source; revisit separately).

## Validation posture

Per the skill-authoring Iron Law, structural edits to skills are TDD-gated:
each moved/split file's load-bearing behavior (a sibling correctly invoking
`chorus-core`; a review round still firing all phase gates; an SDLC gate still
running the primitive from core) is verified by a pressure/application scenario
before the change is called done. The decomposition must not change *behavior* —
only where the behavior's definition lives — so the bar is "same procedure,
relocated source," demonstrated, not asserted.

## Next step

Run `/speckit-specify` for **one suite-decomposition feature**: core+review+sdlc
split + the findings→memory configuration contract as a designed seam, with the
future three skills and the callback impl recorded as committed seams /
out-of-scope.
