# Parity — chorus-core CONDUCTOR + router (T010, FR-015 tier 2)

**Tier 2: content-changed** (`CONDUCTOR.md` newly extracted from review's
INTEGRATION-LAYER; `chorus-core/SKILL.md` new router) → full RED-GREEN, asserting
on observable composed behavior, not file presence.

## (a) Observable behavior preserved vs baseline

The discipline an agent reaches through `chorus-core` is the *same* discipline it
reached pre-split — relocated, not changed:

- **Methodology, conductor voice, "the chair decides nothing" + slippage table,
  the discipline cascade, the refusals, and the full `I1–I9` catalog** were moved
  **verbatim** from `skill/chorus-review/INTEGRATION-LAYER.md` (pre-split) into
  `skill/chorus-core/CONDUCTOR.md`. The `S8–S10` and `D1–D5` reference paragraphs
  were carried with them (still references, with paths re-pointed to the
  co-resident core files).
- The phase sequences and artifact/ledger paths in `tests/parity/baseline.md`
  are unchanged: a composing agent that reads the router then `CONDUCTOR.md`
  reaches I1–I9 and the conductor discipline exactly as it reached them from the
  single INTEGRATION-LAYER before.
- **Residence** moved correctly: `I1–I9` are now defined **only** in
  `chorus-core/CONDUCTOR.md`; zero `I`/`D`/`S8–S10` definitions remain in any
  sibling (verified by FC1 + `grep -cE '^\s*-?\s*\*\*I[1-9]\.'
  skill/chorus-review/INTEGRATION-LAYER.md` → 0).

## (b) RED demonstrations (cannot pass green-by-coincidence)

### RED 1 — substrate absent / catalog missing (router self-check + FC1 dangling)

Pressure scenario: an agent invoking `chorus-core` must reach the I1–I9 catalog
through the router. Delete `CONDUCTOR.md` (the single source) and the composition
breaks loudly:

```bash
mv skill/chorus-core/CONDUCTOR.md /tmp/CONDUCTOR.bak
bash scripts/check-suite-integrity.sh   # FC1
mv /tmp/CONDUCTOR.bak skill/chorus-core/CONDUCTOR.md
```

Observed (RED):

```
DANGLING TOKEN: I1 is referenced but has no definition in chorus-core
DANGLING TOKEN: I2 ... I4 ... I5 ... I6 ... I7 ... I8 ... I9 ...
FAIL — ... (exit 1)
```

**Honest limit (Gate C GC6 — Beck):** the dangling check flags only tokens that are
*referenced from another file but undefined*. `I3` is **not** in the list above —
it is referenced only within `CONDUCTOR.md` itself, so when `CONDUCTOR.md` is deleted
there is no surviving reference to dangle. The dangling check therefore does **not**
prove catalog completeness on its own. Two other guards close that gap:
1. the **router reachability self-check** in `chorus-core/SKILL.md` catches a missing
   `CONDUCTOR.md` by **file presence** (names the file, STOPs) — this is the real RED
   for "catalog gone";
2. FC1's **catalog-completeness** assertion (added per GC6) fails if any of `I1–I9`
   lacks a definition line in `chorus-core`, catching a token that vanishes without an
   external reference.

After restore, FC1 returns `PASS` (exit 0) — the GREEN.

### RED 2 — residence violation (sibling-local redefinition)

Deliberately introduce a sibling-local `I1` *definition* and confirm the
residence check fails, then revert:

```bash
printf '\n- **I1.** (sibling-local redefinition)\n' >> skill/chorus-review/INTEGRATION-LAYER.md
bash scripts/check-suite-integrity.sh   # FC1 residence
git checkout -- ...                      # (revert — restore the slim file)
```

Observed (RED):

```
RESIDENCE VIOLATION: I/D/S8–S10 token defined outside chorus-core:
    skill/chorus-review/INTEGRATION-LAYER.md:NN:- **I1.** (sibling-local redefinition)
FAIL — ... (exit 1)
```

After revert, FC1 returns PASS — a sibling can never pass by resolving a token to
its own local redefinition (FR-008a residence).

## Result

GREEN post-split (FC1 exit 0; catalog reachable through the router); both RED
demonstrations fired against deliberately-broken compositions and recovered on
revert. The router does not inline the four files (FR-002 — lean index), its
description carries no operator trigger (FR-003), and it opens with the loud
reachability self-check (FR-002).
