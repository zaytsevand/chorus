# Data Model: `chorus learn` — Interactive Staged Onboarding

**Feature**: 007-chorus-learn-onboarding | **Date**: 2026-06-10 (cycle-2 regen)

The feature is a documented interactive procedure; its "data model" is the set of
conceptual entities the procedure manipulates. No runtime schema exists — these shapes
are normative for `LEARN.md`'s authoring and for the contracts.

## Entities

### Step *(formerly "stage" — renamed per Gate A family J; "stage" is reserved for the canon's four-stage review flow)*

One unit of the tutorial.

| Field | Type | Notes |
|---|---|---|
| `id` | enum `S1..S5` | fixed set; no dynamic steps (SC-002) |
| `name` | string | orient · set up · run a round · agent-SDLC · work with results |
| `teaches` | string | the step's single teachable claim (research.md R2 table) |
| `explanation` | prose | concise; ≤ one AskUserQuestion interaction's worth (FR-003) |
| `cites` | CanonicalPointer[] | a structured `Cites:` list; ≥1 per canon-defined mechanic mentioned (FR-008) |
| `sub_steps` | SubStep[] | declared conditional paths (see SubStep) |
| `question` | NavigationChoice | exactly one navigation question per step (FR-003/004) |

**Validation**: every step present and reachable (SC-006); no step's explanation
restates a canonical definition (SC-005/C4); terms introduced before use, with the S3
step/stage disambiguation line (FR-012).

### Step map (the fixed instance set)

| id | name | sub-steps | cites |
|---|---|---|---|
| S1 | orient | install sub-step (instruct-only; FR-006) | `skill/chorus-review/SKILL.md` |
| S2 | set up | scaffold offer (dedicated confirm; FR-007) | `templates/CHORUS-PROJECT.template.md`, `skill/chorus-review/SKILL.md` (addendum + roster sections), `install.sh` |
| S3 | run a round | — | `skill/chorus-review/GATE-PRIMITIVE.md`, `skill/chorus-review/SKILL.md` (procedure) |
| S4 | agent-SDLC | — | `skill/chorus-review/SDLC-LAYER.md`, `skill/chorus-review/DECISION-PRIMITIVE.md` |
| S5 | work with results | — | `skill/chorus-review/SKILL.md` (artifact), `skill/chorus-review/DECISION-PRIMITIVE.md` (review surfaces) |

### SubStep *(new — Gate A family E: every conditional path declares its effects)*

| Field | Type | Notes |
|---|---|---|
| `owner` | Step.id | the step it lives in |
| `trigger` | predicate | the read-only probe result that activates it (R5) |
| `effects` | declared list | **install sub-step: none** (instruct-only — it never executes commands or writes); **scaffold offer: exactly one write** behind the dedicated confirm |
| `contract` | pointer | scaffold → `contracts/scaffold.md`; install → `contracts/learn-mode.md` §install sub-step |

**Validation**: nothing executes or writes outside the declared `effects` list; the
union of all SubStep effects is the tutorial's whole write surface (FR-005, C6).

### NavigationChoice

The per-step question (contracts/navigation.md).

| Field | Type | Notes |
|---|---|---|
| `step` | Step.id | owner |
| `options` | exactly 4 | advance (first, recommended) · deeper/recap · jump · exit — all four at every step incl. S1 (FR-004) |
| `deeper_rule` | rule | after one deeper pass, slot 2 re-presents as **"recap this step"** (depth bounded at one level; no dead option) |
| `jump_followup` | question | fires only when `jump` chosen; lists the other steps; **at S5: S1–S4, no "back" slot** (return rides the built-in Other) |
| `exit_wrapup` | prose | the FR-011 wrap-up: next command + step reached + resume scope + canon pointers; **at S1 it IS the expert cheat-sheet** |

**State transitions**: `advance: Sn → Sn+1` (S5 advances to exit_wrapup) ·
`deeper: Sn → Sn (expanded once) → recap rule` · `jump: Sn → Sm, m ≠ n` (skipped steps
not replayed, US2) · `exit: Sn → end (wrap-up + ResumeState already current)`.

### ResumeState

| Field | Type | Notes |
|---|---|---|
| `last_step` | Step.id | updated at **every step transition**, not only explicit exit (FR-010; silent abandonment resumes correctly) |
| `scope` | conversation | in-conversation only; never written to disk (R4); **disclosed in the wrap-up** (FR-011) |

**Transition**: re-invocation with `last_step` present → offer resume-or-restart
(FR-010, SC-007); absent → start at S1.

### AddendumScaffold

The tutorial's only write (contracts/scaffold.md).

| Field | Type | Notes |
|---|---|---|
| `consent` | dedicated confirm | its own question — never an option on the navigation question (FR-007, family D) |
| `source` | path | inside this repo: the checkout's `templates/CHORUS-PROJECT.template.md` (authoritative); else the running skill's own `templates/` copy, either install channel (R6) |
| `target` | path | `docs/reviews/CHORUS-PROJECT.md` in the user's repo |
| `marker` | first line after title | `<!-- SCAFFOLDED by chorus learn YYYY-MM-DD … -->` — signals structure-without-facts to the Phase-0 consumer (FR-014, R9) |
| `flagged_sections` | {2, 3, 5} | exclusions · anchors · security checklist, marked `<!-- TO FILL -->` |
| `preconditions` | — | explicit confirm · target absent · inside a repo |

**Validation**: decline ⇒ zero writes; existing target ⇒ review/extend offer, never
overwrite; outside a repo ⇒ offer replaced by a stated one-line unavailability notice
(family N), zero writes (SC-004); all four paths recorded in check C7.

### CanonicalPointer

| Field | Type | Notes |
|---|---|---|
| `mechanic` | string | what is being referenced (e.g. "the four-stage review") |
| `summary` | prose | onboarding-altitude paraphrase, **not** the definition |
| `doc` | repo-relative path | listed on the owning step's structured `Cites:` line — the unit check C3 resolves |
| `runtime_failure` | declared behavior | doc missing at runtime → state plainly + continue at summary altitude + point to the repo path; never reconstruct from memory (R10) |

**Validation**: every `Cites:` path resolves (C3); the canon's load-bearing definition
blocks (tally rule, band table, decision catalog, quorum table) appear **only** in
their canonical docs (C4). Resolution is doc-granularity; section renames surface at
re-read (recorded limitation, R7).

## Relationships

```
LEARN.md ──defines──> Step (×5) ──ends with──> NavigationChoice (S1/S5/recap rules)
   │                     │
   │                     ├──Cites:──> CanonicalPointer ──resolves to──> canon doc (C3)
   │                     │                             └─runtime failure─> declared degraded mode (R10)
   │                     └──declares──> SubStep ──S2──> AddendumScaffold ──copies──> template
   │                                            │                        └─emits──> SCAFFOLDED marker ──read by──> SKILL.md Phase-0 note (FR-014)
   │                                            └──S1──> install sub-step (instruct-only)
   └──tracked by──> ResumeState (per-transition, conversation-scoped, disclosed)

SKILL.md ──registers mode──> LEARN.md   (mode list + YAML frontmatter + three-mode heading)
SKILL.md ──Phase-0 note──> scaffolded-addendum consumer behavior (FR-014)
README.md / install.sh "Next:" ──lead with──> `chorus learn` (FR-013)
install.sh ──deploys──> templates/ → installed skill (R6; asserted installed-side by C5)
templates/CHORUS-PROJECT.template.md ──single source of structure for──> S2 scaffold AND the round's Phase-5 offer (FR-007)
```
