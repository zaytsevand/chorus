# Quickstart: `chorus learn` — Interactive Staged Onboarding

**Feature**: 007-chorus-learn-onboarding | **Date**: 2026-06-10 (cycle-2 regen)

Two parts: a worked walkthrough (what the feature feels like when done) and the
structural conformance checks **C1–C7** (research.md R7) that make
SC-005/SC-006/SC-008 mechanically scannable.

## Worked walkthrough — the newcomer path (US1)

```
user: chorus learn

S1 orient   "The chorus is a multi-lens review… It has three modes: two review
            modes (the project-state round and the agent-SDLC lifecycle) and
            this tutorial."
            Cites: skill/chorus-review/SKILL.md
            [probes: template reachable ✓ (file-path channel) · agents ✓ ·
             addendum ✗ · in a repo ✓]
            Q: Continue → set up | Go deeper on the modes |
               Jump to another step | Exit (wrap-up = cheat-sheet)

user: Continue

S2 set up   "Each project gives the chorus a one-page addendum
            (CHORUS-PROJECT.md): scope exclusions, anchor surface, security
            checklist…"
            Cites: templates/CHORUS-PROJECT.template.md, skill/chorus-review/SKILL.md, install.sh
            → dedicated confirm: "Scaffold docs/reviews/CHORUS-PROJECT.md from
              the template now? (creates one file; sections 2/3/5 left for you)"

user: [dogfood default: decline]  → nothing written, tutorial proceeds
            Q: Continue → run a round | Go deeper on the addendum | Jump | Exit

user: Continue

S3 run      "Say 'spawn the chorus'. Personas RSVP, then the review runs four
            stages — extract → author → vote → tally. (Note: these review
            stages are different from this tutorial's steps.)"
            Cites: skill/chorus-review/GATE-PRIMITIVE.md, skill/chorus-review/SKILL.md
            Q: Continue → agent-SDLC | Deeper | Jump | Exit

user: Continue

S4 SDLC     "To gate a speckit feature: 'run the agent-SDLC on feature 0NN'.
            Three gates (design / plan / implementation); a 🔴 self-heals up
            to 3 cycles before it asks you."
            Cites: skill/chorus-review/SDLC-LAYER.md, skill/chorus-review/DECISION-PRIMITIVE.md
            Q: Continue → work with results | Deeper | Jump | Exit

user: Deeper → one expanded pass (the block-on-🔴 story at newcomer altitude)
            Q: Continue → work with results | Recap this step | Jump | Exit

user: Continue

S5 results  "Each round leaves docs/reviews/YYYY-MM-DD-chorus-review.md —
            commit it; it is the next round's baseline. 🟡 decisions queue in
            the ledger's Provisional-decisions section for async override…"
            Cites: skill/chorus-review/SKILL.md, skill/chorus-review/DECISION-PRIMITIVE.md
            Q: Finish | Recap this step | Jump (→ S1–S4, no "back") | Exit

user: Finish → "You reached the end of the tutorial. You can now: create your
            addendum (say 'chorus learn' and jump to set up, or copy the
            template), then say 'spawn the chorus'. Resume note: this offer
            lives in this conversation — in a new session, say 'chorus learn'
            and jump straight to any step. Depth: SKILL.md, GATE-PRIMITIVE.md, …"
```

The expert path (US2): at S1, one navigation action — Jump → "run a round" (two
AskUserQuestion interactions) — lands in S3; setup is not replayed. The expert fast
exit: S1 → Exit, whose wrap-up is the cheat-sheet.

## Structural conformance checks (C1–C7)

Run from the repo root. All are read-only except C5's temp-dir install and C7's
matrix (which exercises the scaffold in a scratch repo).

### C1 — registration & staleness (FR-001/FR-013, families I/J)

```bash
grep -n "chorus learn" README.md install.sh                       # both surfaces name the mode
sed -n '1,6p' skill/chorus-review/SKILL.md | grep "chorus learn"  # YAML frontmatter description (the routing surface)
grep -n "chorus learn" skill/chorus-review/SKILL.md               # mode-list entry → LEARN.md
grep -n "^## Two modes\|Both modes are built" skill/chorus-review/SKILL.md README.md
# expect: first three hit; the staleness grep returns NOTHING (three-mode reframe done)
```

### C2 — steps present & reachable (FR-002, SC-006)

```bash
grep -nE "^#{2,3} .*(orient|set up|run a round|agent-SDLC|work with results)" \
  skill/chorus-review/LEARN.md
# expect: 5 step headings, each followed by a Cites: line and a navigation-question block
```

### C3 — structured cite-resolution (FR-008, SC-005, family H)

Scoped to the structured notation — never a bare-filename regex (the scaffold target
`CHORUS-PROJECT.md` in prose must NOT trip it):

```bash
grep -n "^Cites:" skill/chorus-review/LEARN.md | sed 's/^[0-9]*:Cites: *//' | tr ',' '\n' \
  | sed 's/^ *//; s/ *$//; s/ (.*)//' | sort -u | while read p; do
  test -e "$p" || echo "BROKEN POINTER: $p"
done
# expect: no output (every Cites: path resolves repo-relative)
# recorded limitation: doc granularity — section renames surface at re-read, not here
```

### C4 — no-restatement, pinned delimiters (FR-008, SC-005/SC-008, family K)

The canon's load-bearing definition blocks appear **only** in their canonical docs:

```bash
grep -n "net ≥ +2\|net ≤ −2"            skill/chorus-review/LEARN.md  # tally rule       — expect none
grep -n "auto-resolve · audit"          skill/chorus-review/LEARN.md  # band table       — expect none
grep -n "| 1 | RSVP seating"            skill/chorus-review/LEARN.md  # decision catalog — expect none
grep -n "J ∈ {3, 4}\|J ≥ 5.*full chorus" skill/chorus-review/LEARN.md # quorum table     — expect none
```

### C5 — scaffold deployment, both sides (FR-007, R6, F46)

```bash
test -f templates/CHORUS-PROJECT.template.md && echo "template present (repo)"
grep -n "templates" install.sh        # deployment line copying templates/ → $SKILL_DST
# installed-side assertion:
CLAUDE_HOME=$(mktemp -d) ./install.sh >/dev/null \
  && test -f "$CLAUDE_HOME_TMP_CHECK" 2>/dev/null \
  ; CH=$(mktemp -d); CLAUDE_HOME="$CH" ./install.sh >/dev/null \
  && test -f "$CH/skills/chorus-review/templates/CHORUS-PROJECT.template.md" \
  && echo "template deployed (installed side)"; rm -rf "$CH"
```

### C6 — write surface, mechanical (FR-005, SC-008, family K)

```bash
# write idioms may appear ONLY inside the scaffold sub-step's accept branch:
grep -nE "Write tool|Edit tool|\bcp \|\btee \|mkdir |> docs/|>> " skill/chorus-review/LEARN.md
# expect: hits only within the S2 scaffold accept-branch section; manual review is backstop
```

### C7 — four-path scaffold matrix (SC-004/SC-008, family K)

Dogfood in a scratch repo; each path's outcome recorded:

| Path | Action | Expected outcome |
|---|---|---|
| accept | dedicated confirm → yes | `docs/reviews/CHORUS-PROJECT.md` created: SCAFFOLDED marker first line after title, sections 2/3/5 `<!-- TO FILL -->`, preamble reads correctly |
| decline | dedicated confirm → no | zero writes; tutorial proceeds |
| existing-target | addendum already present | review/extend offer; file untouched (byte-identical) |
| outside-repo | run from a non-repo dir | one-line stated unavailability (what + why + how to enable); zero writes |

## Acceptance mapping

| Check | Verifies |
|---|---|
| walkthrough | US1, US2, FR-003/004/011, SC-001/002/003 |
| C1 | FR-001, FR-013 (frontmatter + staleness) |
| C2 | FR-002, SC-006 |
| C3, C4 | FR-008, US4, SC-005 (+ quorum-table pin) |
| C5 | FR-007 deployment, both sides |
| C6 | FR-005, SC-008 |
| C7 | FR-005/006/007/014, US3, SC-004, SC-008 |
| resume question (navigation.md §Resume) | FR-010, SC-007 (incl. silent abandonment) |
| S1 exit wrap-up | FR-004's fast-exit-rides-exit + FR-011 disclosure |
