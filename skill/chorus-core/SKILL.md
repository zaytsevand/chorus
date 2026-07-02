---
name: chorus-core
description: Shared substrate for the chorus suite — the gate / decision / exploratory primitives, the conductor discipline, and the single I1–I9 invariant catalog. Referenced by chorus-review and chorus-sdlc by name; it is not invoked directly by an operator and carries no trigger phrase. Composing skills declare REQUIRED chorus-core.
---

# chorus-core — substrate router

This skill is **substrate**, not a user-facing procedure. It holds nothing an
operator triggers. The sibling skills `chorus-review` (project-state rounds) and
`chorus-sdlc` (lifecycle gates) declare `REQUIRED: chorus-core` and read the four
files below on demand. This SKILL.md is a lean index — it does **not** inline the
content of the four files; it directs reads to them.

## Reachability self-check (run this FIRST — fail loudly)

Before directing any read, the composing session MUST assert that all four
substrate files are present in this skill directory:

- `GATE-PRIMITIVE.md`
- `DECISION-PRIMITIVE.md`
- `EXPLORATORY-PHASE.md`
- `CONDUCTOR.md`

If **any** of these is missing, **STOP and fail loudly** — do not proceed
silently and do not improvise the missing mechanic. Emit:

> **chorus-core substrate is incomplete.** The required file `<name>` is missing
> from the `chorus-core` skill directory. This is a broken or partial install of
> the chorus suite — the shared mechanics it defines (the four-stage gate, the
> decision banding, the exploratory phase, or the I1–I9 invariant catalog) cannot
> be reached. **Recovery:** re-install the chorus suite (`./install.sh`) or check
> that `chorus-core` was published/copied under its expected name, then retry.

(This self-check guards "core ran but a file is missing." It cannot guard "core
was never reached" — when `chorus-core` is absent/renamed the loader's advisory
`REQUIRED:` marker no-ops and this router never runs. That case is the
**sibling-side substrate guard** carried in each sibling's SKILL.md, plus the
out-of-band fitness checks `scripts/check-suite-integrity.sh` FC1/FC3.)

## Index — the four substrate files

Read the file whose mechanic you need; do not read all four eagerly.

| File | What it defines | Tokens it owns |
|---|---|---|
| `GATE-PRIMITIVE.md` | the four-stage review mechanic (extract → uncapped author → real vote → deterministic tally) + `NEED_INFO` resolution | `S8–S11` |
| `DECISION-PRIMITIVE.md` | operator-facing decision banding (🟢 auto / 🟡 default+async override / 🔴 hard-block), by declared catalog predicate | `D1–D5` |
| `EXPLORATORY-PHASE.md` | per-lens persisted understanding; reference-first harvest; two-tier memory | — |
| `CONDUCTOR.md` | EWD-340 methodology; conductor voice; "the chair decides nothing" + slippage table; discipline cascade; system-boundary refusals; **the single `I1–I9` invariant catalog**; reserved-seam + findings→memory contracts | `I1–I9` (single source) |

## Invariant residence (the single-source rule)

`chorus-core` is the **single home** of `I1–I9` (CONDUCTOR.md), `S8–S11`
(GATE-PRIMITIVE.md), and `D1–D5` (DECISION-PRIMITIVE.md). No suite skill may
**define** any `I` / `D` / `S8–S11` token outside this directory; siblings only
**reference** them via composition. The sole tokens permitted to live outside
core are the lifecycle `S1–S7` (defined in `chorus-sdlc/SKILL.md`), and only as
references that extend core's `I1–I9`. `scripts/check-suite-integrity.sh` FC1
enforces this residence rule.

## Composition contract (what a sibling does)

1. Declare `REQUIRED: chorus-core` in its frontmatter/body.
2. Carry the **sibling-side substrate guard** (fail loudly if core is
   unreachable — naming the missing skill + recovery action; see CONDUCTOR.md /
   the contract).
3. Reference core's tokens and mechanics by file name; never redefine them.

The reserved-seam contracts (extract-stage record, agent-memory layout, two-tier
memory model) and the findings→memory contract that future skills compose are
documented in `CONDUCTOR.md`.
