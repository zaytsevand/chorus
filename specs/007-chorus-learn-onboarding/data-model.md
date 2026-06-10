# Data Model: `chorus learn` — Interactive Staged Onboarding

**Feature**: 007-chorus-learn-onboarding | **Date**: 2026-06-10

The feature is a documented interactive procedure; its "data model" is the set of
conceptual entities the procedure manipulates. No runtime schema exists — these shapes
are normative for `LEARN.md`'s authoring and for the contracts.

## Entities

### Stage

One unit of the tutorial.

| Field | Type | Notes |
|---|---|---|
| `id` | enum `S1..S5` | fixed set; no dynamic stages (SC-002) |
| `name` | string | orient · set up · run a round · agent-SDLC · work with results |
| `teaches` | string | the stage's single teachable claim (research.md R2 table) |
| `explanation` | prose | concise; ≤ one AskUserQuestion interaction's worth (FR-003) |
| `cites` | CanonicalPointer[] | ≥1 per canon-defined mechanic mentioned (FR-008) |
| `sub_steps` | SubStep[] | conditional paths inside the stage (install; scaffold offer) |
| `question` | NavigationChoice | exactly one per stage (FR-003/004) |

**Validation**: every stage present and reachable (SC-006); no stage's explanation
restates a canonical definition (SC-005); terms introduced before use (FR-012).

### Stage map (the fixed instance set)

| id | name | sub-steps | cites |
|---|---|---|---|
| S1 | orient | install check → install sub-step (FR-006) | `SKILL.md` |
| S2 | set up | addendum check → scaffold offer / review-extend (FR-007) | `templates/CHORUS-PROJECT.template.md`, `SKILL.md` §addendum |
| S3 | run a round | — | `GATE-PRIMITIVE.md`, `SKILL.md` §procedure |
| S4 | agent-SDLC | — | `SDLC-LAYER.md`, `DECISION-PRIMITIVE.md` |
| S5 | work with results | — | `SKILL.md` §artifact, `DECISION-PRIMITIVE.md` §review surfaces |

### NavigationChoice

The per-stage question (contracts/navigation.md).

| Field | Type | Notes |
|---|---|---|
| `stage` | Stage.id | owner |
| `options` | exactly 4 | advance (first, recommended) · deeper · jump · exit (FR-004) |
| `jump_followup` | question | fires only when `jump` chosen; lists other stages + "back" |
| `exit_wrapup` | prose | the "you can now do X" + canon pointers (FR-011) |

**State transitions**: `advance: Sn → Sn+1` (S5 advances to exit_wrapup) ·
`deeper: Sn → Sn (expanded)` — at most one deeper level, then options re-presented ·
`jump: Sn → Sm, m ≠ n` (skipped stages are not replayed, US2) · `exit: Sn → end`.

### ResumeState

| Field | Type | Notes |
|---|---|---|
| `last_stage` | Stage.id | the stage the user last reached |
| `scope` | conversation | in-conversation only; never written to disk (R4) |

**Transition**: on re-invocation with `last_stage` present → offer resume-or-restart
(FR-010); absent → start at S1.

### AddendumScaffold

The tutorial's only write (contracts/scaffold.md).

| Field | Type | Notes |
|---|---|---|
| `source` | path | `<installed skill>/templates/CHORUS-PROJECT.template.md` (R6) |
| `target` | path | `docs/reviews/CHORUS-PROJECT.md` in the user's repo |
| `flagged_sections` | {2, 3, 5} | exclusions · anchors · security checklist, marked to-fill |
| `preconditions` | — | explicit opt-in confirm · target absent · inside a repo |

**Validation**: decline ⇒ zero writes; existing target ⇒ review/extend offer, never
overwrite; outside a repo ⇒ offer suppressed (SC-004).

### CanonicalPointer

| Field | Type | Notes |
|---|---|---|
| `mechanic` | string | what is being referenced (e.g. "the four-stage review") |
| `summary` | prose | onboarding-altitude paraphrase, **not** the definition |
| `doc` | path | the canonical doc that owns the mechanic |

**Validation**: every pointer's `doc` resolves (cite-resolution check, R7); the
load-bearing definition blocks (tally table, band table, decision catalog, stage list)
appear **only** in their canonical docs, never in `LEARN.md`.

## Relationships

```
LEARN.md ──defines──> Stage (×5) ──ends with──> NavigationChoice
   │                     │
   │                     ├──cites──> CanonicalPointer ──resolves to──> canon doc
   │                     └──S2 sub-step──> AddendumScaffold ──copies──> template
   └──tracked by──> ResumeState (conversation-scoped)

SKILL.md ──registers mode──> LEARN.md          (one-line trigger + pointer)
README.md ──names mode──> "chorus learn"        (FR-013)
install.sh ──deploys──> templates/ → installed skill (R6)
```
