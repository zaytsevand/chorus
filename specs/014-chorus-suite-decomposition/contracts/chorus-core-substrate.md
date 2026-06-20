# Contract — chorus-core substrate

## Router SKILL.md

- **Description**: marks core as substrate referenced by sibling skills; carries
  **no operator trigger phrase** (it is not user-invoked directly).
- **Body**: a lean index of the four substrate files with one-line summaries and
  on-demand `Read` directions — MUST NOT inline the full content of the four files.
- **Reachability self-check (opens the body)**: before directing any read, assert
  the four substrate files (`GATE-PRIMITIVE.md`, `DECISION-PRIMITIVE.md`,
  `EXPLORATORY-PHASE.md`, `CONDUCTOR.md`) are present in this skill dir; if any is
  missing, **fail loudly** with a message naming the missing file — never proceed
  silently. (Mitigates the advisory-`REQUIRED:` failure mode.)

## Substrate files (single source of shared mechanics)

| File | Owns | Moved/new |
|---|---|---|
| GATE-PRIMITIVE.md | four-stage mechanic; `S8–S10` | moved as-is |
| DECISION-PRIMITIVE.md | decision banding; `D1–D5` | moved as-is |
| EXPLORATORY-PHASE.md | per-lens persisted understanding; two-tier memory | moved as-is |
| CONDUCTOR.md | EWD-340 methodology, conductor voice, "chair decides nothing" + slippage table, discipline cascade, system-boundary refusals, **full `I1–I9` catalog** | new (extracted from review's INTEGRATION-LAYER) |

## Composition contract (consumed by siblings)

- A sibling declares `REQUIRED: chorus-core` and invokes it by name.
- Every `I/S/D` token a sibling references MUST resolve to its single definition in
  core via this composition (fitness check #1).
- Siblings reference core's `I1–I9`; they never redefine them.

## Sibling-side substrate guard (Gate A F5/F19 — REQUIRED)

The core-side reachability self-check above guards "core ran but a file is missing."
It **cannot** guard "core was never reached" — when `chorus-core` is absent/renamed,
the advisory `REQUIRED:` marker no-ops and the router never runs. Therefore:

- Each **sibling** (`chorus-review`, `chorus-sdlc`) MUST, before relying on any core
  mechanic, assert `chorus-core` is reachable and **fail loudly** if not — naming
  the missing skill AND the recovery action (re-install / check the published name).
- This sibling-side guard is what satisfies SC-007; the core-side self-check is
  defense-in-depth for the file-missing case only.
- Drift detection (renamed/duplicated core) is the job of fitness checks #1/#3
  (out-of-band), not of the advisory marker.
