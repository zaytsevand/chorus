# Quickstart & Conformance: Human-Facing Relay (spec 008)

This is the verification surface for `008-detail-rich-relay` (Principle V). It
defines the **drift check** any reviewer or gate runs on a round, and a **worked
example** proving the presentation change leaves the decision (severity + gating)
byte-identical.

## The drift check (FR-009 / FR-011 / SC-004)

The feature is presentation-only. The check that proves it:

1. Take a recorded baseline round's artifact (pre-change).
2. Re-render it through the new format (verbatim pull-quotes + detail-rich
   register + projected matrix).
3. Extract the **severity + gating** for every finding from each version.
4. **Assert the two sets are byte-identical.** Any difference is a defect in the
   presentation layer, not an allowed outcome.

Run it on **every** recorded round in `docs/reviews/` and every SDLC ledger, not
just the example below. Expected result: **0 rounds with drift.**

```
# severity/gating projection (the only thing the check compares)
F1 🔴 gating
F2 🟡 non-gating
F3 🟢 non-gating
```

If `diff <old-projection> <new-projection>` is empty for every round, SC-004 holds.

## Worked example

A 3-finding round. Evans (DDD) authors F1; Richards (architecture) and Beck
(simple-design) converge on it in Round 2. Cooper authors F2; Goldratt OVER-RATEs
it. F3 is a lone 🟢.

### Before (today's format)

**Findings register** — `Summary` written by the conductor:

| ID | Advisor | Lens | Severity | Target | Summary |
|----|---------|------|----------|--------|---------|
| F1 | Evans | DDD | 🔴 | `models.py` | Aggregate root has no invariant enforcement; Order can be saved illegal |
| F2 | Cooper | Product | 🟡 | `cli.py:88` | Error path exits with no recovery guidance for the user |
| F3 | Beck | Simple | 🟢 | `util.py:12` | Helper is mildly over-abstracted for one caller |

**Consolidation matrix:** `[F1 🔴 conv=3 (Evans,Richards,Beck)] [F2 🟡 conv=1] [F3 🟢 conv=1]`

### After (this spec)

**Findings register** — the single source of truth; `Pull-quote` is the
persona's own marked words, relayed verbatim:

| ID | Advisor · Lens | Severity | Target (locator) | Pull-quote (verbatim) |
|----|----------------|----------|------------------|------------------------|
| F1 | Evans · DDD | 🔴 | `webapp/data/models.py:42` | "The Order aggregate has no root to enforce its invariants — it can be persisted in a state the domain forbids." |
| F2 | Cooper · Product | 🟡 | `cli.py:88` | "Exit-with-no-recovery is convenient for the developer and a dead end for the user." |
| F3 | Beck · Simple | 🟢 | `util.py:12` | "One caller, three layers of indirection — the helper costs more than it saves." |

> **F1 converging:** Richards · *"same seam I flagged — the model leaks
> persistence concerns"*; Beck · *"agreed, and the duplication makes it worse."*

**Consolidation matrix (projection):** `[F1 🔴 conv=3 (Evans,Richards,Beck)]
[F2 🟡 conv=1] [F3 🟢 conv=1]` — severity and convergence carried from the
register entries above, not re-authored here.

### What the check confirms

| Finding | Before sev/gate | After sev/gate | Drift? |
|---------|-----------------|----------------|--------|
| F1 | 🔴 gating | 🔴 gating | none |
| F2 | 🟡 non-gating | 🟡 non-gating | none |
| F3 | 🟢 non-gating | 🟢 non-gating | none |

Severity and gating are identical. What changed: the conductor's paraphrase is
gone (each line is now the persona's own words, attributed); convergence reads as
named lenses with their own notes rather than a bare `conv=3`; and the matrix is a
projection, so severity is authoritative in exactly one place.

## Conformance checklist

- [ ] **FR-001 / SC-001** — every pull-quote is word-for-word the authoring
      persona's; none in the conductor's register.
- [ ] **FR-002** — every pull-quote was *marked by its persona*; the conductor
      selected/trimmed none; unmarked findings were routed back, not summarized.
- [ ] **FR-003** — exactly one short pull-quote per finding; deeper reasoning
      linked to the report, not inlined.
- [ ] **FR-004 / SC-002** — each entry carries lens, pull-quote, locator,
      severity, named convergence set; a reader needs no Round-1 report.
- [ ] **FR-005** — convergence shown as named lenses each with their own verbatim
      note, not a bare count.
- [ ] **FR-006 / SC-003** — every `Fn`/`Cn` resolves to a detail-rich entry; 0
      dead-end references.
- [ ] **FR-007** — the matrix is a projection of the register; severity appears
      authoritatively in one place; the two cannot drift.
- [ ] **FR-008** — top-5 entries and conflicts carry pull-quote + locator and
      trace to their register entries.
- [ ] **FR-009 / FR-011 / SC-004** — the drift check passes on every recorded
      round (0 drift).
- [ ] **FR-010** — prior committed artifacts still parse; absence of the new
      fields degrades to the old behavior.
