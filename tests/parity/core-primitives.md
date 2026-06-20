# Parity — core primitive moves (T009, FR-015 tier 1)

**Tier 1: byte-identical moves** → structural-equivalence + reachability.
(Per Gate A F11: a full behavioral scenario here re-proves what `diff` + FC1
already cover, so the bar is structural equivalence + composition reachability.)

## Structural equivalence (the GREEN)

Run (the exact command, reproducible):

```bash
for f in GATE-PRIMITIVE DECISION-PRIMITIVE EXPLORATORY-PHASE; do
  git show HEAD:skill/chorus-review/$f.md | diff - skill/chorus-core/$f.md \
    && echo "IDENTICAL: $f.md"
done
```

Result (T009 run):

```
IDENTICAL: GATE-PRIMITIVE.md
IDENTICAL: DECISION-PRIMITIVE.md
IDENTICAL: EXPLORATORY-PHASE.md
```

Each moved primitive is byte-for-byte identical to its pre-split content at
HEAD **at the moment of the move** (T009 ran before any pointer fix). The move
was performed with `git mv` so git tracks it as a rename (history + content
preserved). Token residence preserved: `S8–S10` (GATE-PRIMITIVE), `D1–D5`
(DECISION-PRIMITIVE) now live in `chorus-core`.

### Post-move pointer correction (recorded deviation)

The three primitives carried, verbatim, consumer-pointer references to
`` `INTEGRATION-LAYER.md` `` and `` `SDLC-LAYER.md` `` (their pre-split sibling
filenames). After the move, `SDLC-LAYER.md` no longer exists (promoted to
`chorus-sdlc/SKILL.md`) and `INTEGRATION-LAYER.md` is now in `chorus-review/`.
Leaving the bare names would dangle. They were therefore re-pointed:
`` `SDLC-LAYER.md` `` → `` `chorus-sdlc/SKILL.md` ``, `` `INTEGRATION-LAYER.md` ``
→ `` `chorus-review/INTEGRATION-LAYER.md` ``. These are **documentation pointers
to consumers**, not invariant definitions (FC1 unaffected) and not a dependency
cycle (core naming its consumers is descriptive, not a load). This is a
deliberate correctness fix layered *after* the byte-identical proof above, which
is recorded against HEAD. The token *content* (S8–S10, D1–D5) is unchanged.

## Reachability (definition resolves via composition)

- `chorus-core/SKILL.md` (router) indexes all three files and self-checks their
  presence before directing reads.
- Siblings declare `REQUIRED: chorus-core` and reach `S8–S10` / `D1–D5` through
  it. FC1 (invariant-resolution + residence) asserts each token resolves to its
  single definition in core and fails on any definition outside core.

Verified: `scripts/check-suite-integrity.sh` FC1 exits 0 (see
`tests/parity/sdlc-gate.md` / `review-round.md` for the FC runs).

## RED demonstration (cannot pass green-by-coincidence)

The structural check is RED-capable: if a primitive's content drifted in the
move, `diff` prints the delta and the loop's `&&` short-circuits (no "IDENTICAL"
line). Reachability is RED-capable via FC1: a deliberately-introduced
sibling-local redefinition of any `S8–S10`/`D1–D5` token makes FC1 exit
non-zero (demonstrated in `tests/parity/core-conductor.md` residence RED).
