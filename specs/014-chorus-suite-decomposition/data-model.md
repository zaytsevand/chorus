# Data Model — Chorus Suite Decomposition

The "entities" here are skill artifacts, the invariant catalog, and the documented
contracts. No runtime data model.

## Entity: Skill (suite member)

| Field | Description |
|---|---|
| name | `chorus-core` \| `chorus-review` \| `chorus-sdlc` (+ future peers) |
| kind | `substrate` (referenced by name, no user trigger) \| `orchestration` (user-triggered) |
| trigger | review: "spawn the chorus"; sdlc: "run the agent-SDLC on feature 0NN"; core: none |
| composes | set of REQUIRED sibling skills (review→core, sdlc→core; core→∅) |
| files | the `.md` files in `skill/<name>/` |

**Relationships**: `chorus-review` →REQUIRED→ `chorus-core`; `chorus-sdlc`
→REQUIRED→ `chorus-core`. `chorus-review` ⊥ `chorus-sdlc` (no edge — enforced by
fitness check #2).

## Entity: Invariant token

| Field | Description |
|---|---|
| id | `I1–I9` (orchestrator discipline) / `S1–S7` (lifecycle) / `S8–S10` (gate primitive) / `D1–D5` (decision primitive) |
| defined_in | exactly one file, all resident in `chorus-core` |
| referenced_by | any suite skill; must resolve via that skill's REQUIRED composition |
| relation | `S1–S7` *extend* `I1–I9`; all extensions resolve into core |

**Single-source rule (FR-007/FR-008)**: every token has exactly one `defined_in`,
and `defined_in ∈ chorus-core`. Enforced by fitness check #1.

**Placement**:
- `I1–I9` → `chorus-core/CONDUCTOR.md`
- `S8–S10` → `chorus-core/GATE-PRIMITIVE.md`
- `D1–D5` → `chorus-core/DECISION-PRIMITIVE.md`
- `S1–S7` → `chorus-sdlc/SKILL.md` *(referenced, extending core's `I1–I9`; the `S`
  tokens are lifecycle-local but their definitions live with the lifecycle skill;
  they reference — never redefine — core's `I` tokens)*

> Note: `S1–S7` are defined in the lifecycle skill (their natural home) but every
> `I`-token they cite resolves into core. Fitness check #1 verifies the citation
> resolves **AND enforces residence** (Gate A F4/F7, FR-008a): it fails if any
> `I`/`D`/`S8–S10` token is *defined* outside `chorus-core`, so a sibling-local
> redefinition cannot pass by resolving to itself. `S1–S7` are the only tokens
> permitted outside core, and only as references.

## Entity: Findings→memory contract (seam)

| Field | Description |
|---|---|
| findings_artifact_shape | the register/row schema chorus findings are emitted in (documented in core) |
| agent_memory_layout | `~/.claude/agent-memory/<persona>/` two-tier model (addendum = base, records cache) |
| project_config | `CHORUS-PROJECT.md` findings→memory section: targets + policy |
| status | contract documented; callback/hook implementation deferred (FR-011) |

## Entity: Fitness check

| id | Check | Operates on |
|---|---|---|
| FC1 | invariant-resolution — every `I/S/D` token resolves to one definition via REQUIRED composition | `skill/*/` source |
| FC2 | no-fat-sibling-import — neither review nor sdlc references the other's files | `skill/chorus-review/`, `skill/chorus-sdlc/` |
| FC3 | packaging-manifest sync — `plugin.json` arrays match disk; advisor count matches roster | `plugin.json`, `skill/`, `agents/` |

## Entity: Reserved seam (future, not built)

| seam | future skill | contract owned by core |
|---|---|---|
| extract-stage record contract | chorus-viewpoint-extraction | `file:line`-anchored, `source:`-tagged records |
| agent-memory layout | chorus-setup | the named memory-dir convention |
| two-tier memory model | chorus-memory-update | addendum=base, records cache |
