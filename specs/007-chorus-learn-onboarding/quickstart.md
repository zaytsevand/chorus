# Quickstart: `chorus learn` — Interactive Staged Onboarding

**Feature**: 007-chorus-learn-onboarding | **Date**: 2026-06-10

Two parts: a worked walkthrough (what the feature feels like when done) and the
structural conformance checks (research.md R7) that make SC-005/SC-006 mechanically
scannable.

## Worked walkthrough — the newcomer path (US1)

```
user: chorus learn

S1 orient   "The chorus is a multi-lens review… It has three modes: …"
            [probe: skill installed ✓ · addendum ✗ · in a repo ✓]
            Q: Continue → set up | I know the basics (cheat-sheet) |
               Jump to another stage | Exit

user: Continue

S2 set up   "Each project gives the chorus a one-page addendum
            (CHORUS-PROJECT.md): scope exclusions, anchor surface, security
            checklist…"  → offer: "Scaffold it now from the template?"

user: yes → docs/reviews/CHORUS-PROJECT.md created, sections 2/3/5 flagged
            Q: Continue → run a round | Go deeper on the addendum |
               Jump | Exit

user: Continue

S3 run      "Say 'spawn the chorus'. Personas RSVP, then the review runs the
            four-stage flow — extract → author → vote → tally — defined once
            in GATE-PRIMITIVE.md…"
            Q: Continue → agent-SDLC | Deeper | Jump | Exit

user: Continue

S4 SDLC     "To gate a speckit feature: 'run the agent-SDLC on feature 0NN'.
            Three gates (design / plan / implementation); a 🔴 self-heals up
            to 3 cycles before it asks you — SDLC-LAYER.md, DECISION-PRIMITIVE.md…"
            Q: Continue → work with results | Deeper | Jump | Exit

user: Continue

S5 results  "Each round leaves docs/reviews/YYYY-MM-DD-chorus-review.md —
            commit it; it is the next round's baseline. 🟡 decisions queue in
            the ledger's Provisional-decisions section for async override…"
            Q: Finish | Deeper | Jump | Exit

user: Finish → "You can now: fill sections 2/3/5 of your new addendum, then
            say 'spawn the chorus'. Depth: SKILL.md, GATE-PRIMITIVE.md, …"
```

The expert path (US2): at S1, "Jump" → "run a round" lands in S3 in one navigation
choice; setup is not replayed.

## Structural conformance checks

Run from the repo root. All are read-only and runnable with no test harness.

### C1 — mode registered (FR-001/FR-013)

```bash
grep -n "chorus learn" skill/chorus-review/SKILL.md README.md
# expect: ≥1 hit in each — the mode list entry and the README trigger list
```

### C2 — stages present & reachable (FR-002, SC-006)

```bash
grep -nE "^#{2,3} .*(orient|set up|run a round|agent-SDLC|work with results)" \
  skill/chorus-review/LEARN.md
# expect: 5 stage headings, each followed by a navigation-question block
```

### C3 — cite-resolution (FR-008, SC-005: rename ⇒ broken pointer, not drift)

```bash
grep -oE "[A-Z-]+\.md" skill/chorus-review/LEARN.md | sort -u | while read f; do
  test -f "skill/chorus-review/$f" || echo "BROKEN POINTER: $f"
done
# expect: no output (every cited canon doc exists at the cited name)
```

### C4 — no-restatement scan (FR-008, SC-005)

The load-bearing definition blocks must appear **only** in their canonical docs:

```bash
# the tally rule, the band table, the decision catalog, the RSVP quorum table
grep -n "net ≥ +2\|net ≤ −2"             skill/chorus-review/LEARN.md  # expect: none
grep -n "GREEN.*auto-resolve\|🟡 .*recorded default .*async"           \
                                          skill/chorus-review/LEARN.md  # expect: none (summary altitude only, no band table)
grep -n "| 1 | RSVP seating"             skill/chorus-review/LEARN.md  # expect: none (no catalog copy)
# manual: LEARN.md names the four stages in prose but contains no copy of
# GATE-PRIMITIVE.md's stage definitions/tables
```

### C5 — scaffold safety (FR-005/FR-007, SC-004)

```bash
grep -n "TO FILL\|never overwrite\|outside a repo\|opt-in" \
  skill/chorus-review/LEARN.md
# expect: the S2 sub-step names all three guards (opt-in, no-overwrite, in-repo)
test -f templates/CHORUS-PROJECT.template.md && echo "template present"
grep -n "templates" install.sh   # expect: deployment line copying templates/ → $SKILL_DST
```

### C6 — non-mutating default (FR-005)

Manual inspection: `LEARN.md` contains exactly one write instruction (the scaffold);
every other step is read-only (probes, reads, AskUserQuestion).

## Acceptance mapping

| Check | Verifies |
|---|---|
| walkthrough | US1, US2, FR-003/004/011, SC-001/002/003 |
| C1 | FR-001, FR-013 |
| C2 | FR-002, SC-006 |
| C3, C4 | FR-008, US4, SC-005 |
| C5, C6 | FR-005/006/007, US3, SC-004 |
| resume question (navigation.md §Resume) | FR-010, SC-007 |
