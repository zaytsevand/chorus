# Quickstart — Conformance stanzas

The first-class verification surface (constitution Principle V / Authoring Constraints). Each stanza is a human-runnable check over the canon text + a frozen fixture; it maps to a success criterion and is falsifiable. Run after implementation (and at Gate C).

> Fixtures live as worked examples inline (this repo has no runtime). A stanza "passes" when the cited canon text + the fixture trace agree; it "fails" (red) when they diverge.

## CS-001 → SC-001 · inert without exceptional entry
- **Given** a roster where ≤5 lenses JOIN and 0 make an exceptional entry,
- **Check** the seating procedure in `SDLC-LAYER.md` yields the same board as the pre-feature canon.
- **Red**: any divergence from today's seating when no exceptional entry is present.

## CS-002 → SC-002 · board-size formula
- **Fixtures**: (5 JOIN, 0 exc)→5; (7 JOIN, 0 exc)→5; (5 JOIN, 2 exc)→7; (3 JOIN, 4 exc)→7; (9 JOIN, 3 exc)→ min(roster,5+3).
- **Check** `board = min(roster, min(5,|ordinary|)+|exceptional|)`; exceptional seats + cited deltas recorded in the ledger.
- **Red**: an ordinary count >5; an exceptional seat unrecorded; board > roster.

## CS-003 → SC-003 · threshold curve
- **Check** `T = max(1, floor(N/2))` for `N` ∈ {2,3,4,5,6,7,8} → {1,1,2,2,3,3,4}; escalate iff `net≥T`, demote iff `net≤−T`.
- **Red**: any N→T off the table; a tally evaluated at N<2.

## CS-004 → SC-004 · backward-compat at N=4
- **Given** a frozen 5-seat-board vote fixture (N=4) **and a golden severity column captured from the pre-feature canon** (snapshot the old `net≥+2` outcomes *before* editing GATE-PRIMITIVE — do not re-derive from the edited text, or the check compares the new rule to itself and can never go red), **check** every finding's post-edit severity equals its golden value (`T=2` reproduces the old `±2`).
- **Red**: any post-edit severity differing from its frozen golden.

## CS-005 → SC-005 · wider board demands more
- **Given** a board of 7 (N=6): a finding at `net=+2` **holds**; the same at `net=+3` **escalates**.
- **Red**: `net=+2` promotes at N=6.

## CS-006 → SC-006 · reconstructable ledger
- **Given** recorded RSVP answers (incl. exceptional flags + cited deltas) and votes, **check** an independent reader rederives board composition, `N`, `T`, and each final severity with no orchestrator-supplied values beyond formatting.
- **Red**: any tally value not rederivable from recorded inputs.

## CS-007 → SC-007 · side-notes flag-only
- **Check** a side-note fires iff a declared regime is entered (one fixture per regime → exactly one recorded note routed to the operator; a no-regime fixture → none), AND post-tally severities are byte-identical with side-notes enabled vs disabled.
- **Red**: a side-note in a no-regime fixture; a severity that differs with/without side-notes.

## CS-008 → SC-008 · the exceptional bar (no adjudicator)
- **Fixtures**: entry citing a concrete uncovered delta → **seated**; entry citing no uncovered delta (un-anchored) → **refused**; two entries citing the same delta → **at most one** exceptional seat.
- **Check** seating is decided by the cited evidence alone (I8/D5), with no approver in the loop.
- **Red**: an un-anchored claim seated; seating requiring an adjudicator; duplicate-delta double-seat.

## CS-009 → SC-009 · canon hygiene (no stale restatement)
- **Check** after implementation: `grep` the canon for `net ≥ +2` / `net ≤ −2` and standalone cap-5 definitions; the **only** home stating the threshold is `GATE-PRIMITIVE.md` Stage 4; the only home defining seating is `SDLC-LAYER.md`; every other occurrence is a **citation**, not a restatement.
- **Red**: any doc outside the home still asserting `net ≥ +2` or a standalone cap-5 definition (e.g. SKILL.md:507 left un-reconciled).

## CS-010 → FR-002c / FR-012(d) · Goldratt carve-out replaced
- **Check** the canon no longer states a hard "scope/deferral lens is never out-seated on a new buildout" **mandate**: `grep -rn "never out-seated" skill/chorus/` shows the scope lens seating **by exceptional entry** (citation), not a bespoke carve-out; and `INTEGRATION-LAYER.md` declares the regime "new-buildout gate seated without the scope/deferral lens → side-note".
- **Fixture**: a new-buildout gate where the scope/deferral lens exceptional-enters (cites the cut delta) → seated, uncapped; a new-buildout gate where it does **not** enter → a side-note fires (flag-only, no auto-seat).
- **Red**: a surviving hard "never out-seated" mandate clause; the scope lens auto-seated without citing a delta; no side-note when a new-buildout gate lacks the scope lens.

---

**Coverage**: CS-001..009 ↔ SC-001..009; CS-010 ↔ FR-002c/FR-012(d). CS-009 is the FR-016 gate (G2). CS-008 is the evidence-bar gate (G3/G4/G7). CS-004 is the backward-compat regression. CS-010 verifies the Goldratt carve-out replacement.
