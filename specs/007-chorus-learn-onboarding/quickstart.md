# Quickstart: `chorus learn` — Interactive Staged Onboarding

**Feature**: 007-chorus-learn-onboarding | **Date**: 2026-06-12 (run-2 cycle-1 regen)

**Suite-wide rule (SC-008, run-2 cluster C):** every stanza emits an **explicit
`FAIL:` token** on failure — no silent-output polarity anywhere; an operator greps
the suite output for `FAIL:` and an empty result is a pass.

Two parts: a worked walkthrough (what the feature feels like when done —
**illustrative**; the normative labels/ordering live in `contracts/navigation.md`,
R12) and the structural conformance checks **C1–C7 + C5b** (research.md R7) that make
SC-005/SC-006/SC-008/SC-009 mechanically scannable.

**Ownership (SC-008, G9)**: C1–C7 execute at the **Gate C dogfood and before merge**;
results are recorded in the gate ledger (`agent-sdlc-log.md`). Suite-wide rules: no
dead or vestigial assertions (every line can fail), and checks parse **structural
units** (frontmatter block, tables), never fixed line windows.

## Worked walkthrough — the newcomer path (US1)

```
user: chorus learn

S1 orient   "The chorus is a multi-lens review… It has three modes: two review
            modes (the project-state round and the agent-SDLC lifecycle) and
            this tutorial."
            Cites: skill/chorus/SKILL.md
            [probes: template reachable ✓ (file-path channel) · agents ✓ ·
             addendum ✗ · in a repo ✓]
            Q: Continue → set up | Go deeper on the modes |
               Jump to another step | Exit — get the cheat-sheet

user: Continue

S2 set up   "Each project gives the chorus a one-page addendum
            (CHORUS-PROJECT.md): scope exclusions, anchor surface, security
            checklist…"
            Cites: templates/CHORUS-PROJECT.template.md, skill/chorus/SKILL.md, install.sh (file-path channel)
            → dedicated confirm: "Scaffold docs/reviews/CHORUS-PROJECT.md from
              the template now? (creates one file; sections 2/3/5 left for you)"

user: [dogfood default: decline]  → nothing written, tutorial proceeds
            Q: Continue → run a round | Go deeper on the addendum | Jump | Exit

user: Continue

S3 run      "Say 'spawn the chorus'. Personas RSVP, then the review runs four
            stages — extract → author → vote → tally. (Note: these review
            stages are different from this tutorial's steps.)"
            Cites: skill/chorus/GATE-PRIMITIVE.md, skill/chorus/SKILL.md
            Q: Continue → agent-SDLC | Deeper | Jump | Exit

user: Continue

S4 SDLC     "To gate a speckit feature: 'run the agent-SDLC on feature 0NN'.
            Three gates (design / plan / implementation); a 🔴 self-heals up
            to 3 cycles before it asks you."
            Cites: skill/chorus/SDLC-LAYER.md, skill/chorus/DECISION-PRIMITIVE.md
            Q: Continue → work with results | Deeper | Jump | Exit

user: Deeper → one expanded pass (the block-on-🔴 story at newcomer altitude)
            Q: Continue → work with results | Recap this step | Jump | Exit

user: Continue

S5 results  "Each round leaves docs/reviews/YYYY-MM-DD-chorus-review.md —
            commit it; it is the next round's baseline. 🟡 decisions queue in
            the ledger's Provisional-decisions section for async override…"
            Cites: skill/chorus/SKILL.md, skill/chorus/DECISION-PRIMITIVE.md
            Q: Finish the tutorial | Go deeper on results |
               Jump (→ S1–S4, no "back"; free-text stays here) | Exit
            [depth state is per-step (G24): S4's deeper pass flipped only S4's
             slot — S5 shows "Go deeper", not "Recap". Finish and Exit converge
             on the wrap-up by declaration (G3): Finish marks completion.]

user: Finish → "You reached the end of the tutorial. You can now: create your
            addendum (say 'chorus learn' and jump to set up, or copy the
            template), then say 'spawn the chorus'. Resume note: this offer
            lives in this conversation — in a new session, say 'chorus learn'
            and jump straight to any step. Depth: SKILL.md, GATE-PRIMITIVE.md, …"
```

The expert path (US2): at S1, one navigation action — Jump → "run a round" (two
AskUserQuestion interactions) — lands in S3; setup is not replayed. The expert fast
exit: S1 → Exit, whose wrap-up is the cheat-sheet.

## Structural conformance checks (C1–C7 + C5b)

Run from the repo root. All are read-only except C5's temp-dir install and C7's
matrix (which exercises the scaffold in a scratch repo). **Owner & trigger**: the
Gate C dogfood and the pre-merge pass; results land in the gate ledger (G9).

### C1 — registration & staleness (FR-001/FR-013, families I/J; structural parse per G11)

```bash
grep -q "chorus learn" README.md   || echo "FAIL: README missing the mode"
grep -q "chorus learn" install.sh  || echo "FAIL: install.sh Next: missing the mode"
# frontmatter parsed as the whole ----delimited block, not a fixed line window (G11):
awk '/^---$/{n++; next} n==1' skill/chorus/SKILL.md | grep -q "chorus learn" \
  || echo "FAIL: frontmatter description missing the trigger"
grep -q "chorus learn" skill/chorus/SKILL.md || echo "FAIL: SKILL.md mode list missing the entry"
# staleness: the STATED phrasing family on ALL THREE named surfaces (FR-013 — claim-check
# parity; the family below IS the claim's scope, run-2 cluster C):
STALE='[Tt]wo modes|[Bb]oth modes|two operating modes|either mode|2 modes'
for f in skill/chorus/SKILL.md README.md; do
  grep -nE "$STALE" "$f" && echo "FAIL: residual two-mode phrasing in $f"
done
# the spec's own references — normative text only (the Clarifications section quotes the
# old phrasing by design and is excluded as a structural unit):
awk '/^## Clarifications/{skip=1} /^## User Scenarios/{skip=0} !skip' \
  specs/007-chorus-learn-onboarding/spec.md | grep -nE "$STALE" \
  && echo "FAIL: residual two-mode phrasing in spec normative text"
# expect: no FAIL: lines
```

### C2 — steps present & reachable (FR-002, SC-006)

```bash
# absent LEARN.md is a FAIL:, not a silent stderr error (run-2 Gate B cluster α):
test -f skill/chorus/LEARN.md || echo "FAIL: LEARN.md missing"
# exactly the five step headings present (per-step Cites resolution is C3's job; the
# navigation-question block is exercised by the Gate C dogfood / T026, not here — C2's
# claim is scoped to what it scans, run-2 Gate B BECK-3):
n=$(grep -cE "^#{2,3} .*(orient|set up|run a round|agent-SDLC|work with results)" \
      skill/chorus/LEARN.md 2>/dev/null)
[ "$n" -eq 5 ] || echo "FAIL: expected 5 step headings, found $n"
# expect: no FAIL: lines
```

### C3 — structured cite-resolution + cardinality (FR-008, SC-005, family H + G26)

Scoped to the structured notation — never a bare-filename regex (the scaffold target
`CHORUS-PROJECT.md` in prose must NOT trip it):

```bash
# absent LEARN.md is a FAIL:, not a silent stderr error (run-2 Gate B cluster α):
test -f skill/chorus/LEARN.md || echo "FAIL: LEARN.md missing"
# PER-STEP cardinality (FR-008, run-2 cluster C): each step heading is followed by its
# own Cites: line — a global floor would pass five cites clumped in S1:
awk '/^#{2,3} .*(orient|set up|run a round|agent-SDLC|work with results)/{
       if (h && !c) print "FAIL: step without Cites: " h; h=$0; c=0 }
     /^Cites:/{c=1}
     END{ if (h && !c) print "FAIL: step without Cites: " h }' skill/chorus/LEARN.md 2>/dev/null
n=$(grep -c "^Cites:" skill/chorus/LEARN.md 2>/dev/null)
[ "$n" -ge 5 ] || echo "FAIL: only $n Cites: lines (expect ≥5)"
grep -n "^Cites:" skill/chorus/LEARN.md | sed 's/^[0-9]*:Cites: *//' | tr ',' '\n' \
  | sed 's/^ *//; s/ *$//; s/ (.*)//' | sort -u | while read p; do
  test -e "$p" || echo "FAIL: broken pointer $p"
done
# channel-resolvable cites (FR-008, run-2 cluster D): channel-conditional entries
# (install.sh — file-path/checkout channel only) carry their channel annotation in
# LEARN.md and resolve repo-relative here; the plugin-channel S2 cite resolves to the
# packaged template + SKILL.md, exercised by the C7 dogfood on that channel.
# expect: no FAIL: lines
# recorded limitation: doc granularity — section renames surface at re-read, not here
```

### C4 — no-restatement, pinned delimiters (FR-008, SC-005/SC-008, family K)

The canon's load-bearing definition blocks appear **only** in their canonical docs:

```bash
# explicit FAIL tokens (run-2 cluster C — no silent-output polarity):
grep -n "net ≥ +2\|net ≤ −2"             skill/chorus/LEARN.md && echo "FAIL: tally rule restated"
grep -n "auto-resolve · audit"           skill/chorus/LEARN.md && echo "FAIL: band table restated"
grep -n "| 1 | RSVP seating"             skill/chorus/LEARN.md && echo "FAIL: decision catalog restated"
grep -n "J ∈ {3, 4}\|J ≥ 5.*full chorus" skill/chorus/LEARN.md && echo "FAIL: quorum table restated"
# expect: no FAIL: lines
```

### C5 — scaffold deployment, repo + installed side (FR-007, R6, F46; dead stanza removed per G2/G8/G25)

```bash
# explicit FAIL: on absence — no success-only / silent polarity (run-2 Gate B cluster α):
test -f templates/CHORUS-PROJECT.template.md || echo "FAIL: repo template missing"
grep -qE "^cp .*templates" install.sh || echo "FAIL: install.sh missing the templates deploy idiom"
# installed-side assertion (one clean stanza; no leaked tempdir; FAIL: on non-deploy):
CH=$(mktemp -d); CLAUDE_HOME="$CH" ./install.sh >/dev/null 2>&1
test -f "$CH/skills/chorus/templates/CHORUS-PROJECT.template.md" \
  || echo "FAIL: template not deployed (installed side)"
rm -rf "$CH"
# expect: no FAIL: lines
```

### C5b — plugin-side packaging, both directions (FR-015/SC-009, R11; run-2 clusters A+B)

```bash
# the plugin channel must DELIVER, not merely probe:
grep -q '"templates' plugin.json || echo "FAIL: plugin.json does not package templates/"
# direction 1 — every file in agents/ (the authoritative roster) is packaged:
for a in agents/*.md; do
  grep -q "\"$a\"" plugin.json || echo "FAIL: missing from plugin: $a"
done
# direction 2 — every packaged agent path resolves to a file (no phantom entries;
# the 2026-06-12 rename is the recorded incident this direction exists to catch):
grep -oE '"agents/[^"]+"' plugin.json | tr -d '"' | while read -r p; do
  test -f "$p" || echo "FAIL: phantom plugin entry: $p"
done
# the refreshed description — no stale advisor count (the claim learn-mode.md makes):
grep -n '"description".*[Ss]even' plugin.json && echo "FAIL: stale plugin description"
# expect: no FAIL: lines
```

### C6 — write surface, mechanical + self-tested (FR-005, SC-008, family K; alternation fixed per G7/G13/G23)

```bash
# corrected ERE — one alternation, no escaped pipes (the cycle-2 scan's \| matched a
# literal pipe and its cp/tee/mkdir branches could never fire):
SCAN='Write tool|Edit tool|\bcp |\btee |\bmkdir |> docs/|>> '
# fixture self-test FIRST — the scan must fire on every known-bad line or the suite fails:
printf '%s\n' 'use the Write tool here' 'cp templates/x docs/' 'tee docs/out.md' \
  'mkdir docs/reviews' 'echo hi > docs/x.md' 'cat <<EOF >> docs/x.md' \
  | grep -cE "$SCAN" | grep -qx 6 || echo "FAIL: write-idiom scan is dead on a fixture"
# the real scan — hits may appear ONLY inside the scaffold sub-step's accept branch,
# asserted MECHANICALLY (run-2 BECK-4): extract the accept-branch section (its heading
# is pinned: "#### On accept" inside S2) and assert every hit falls inside it:
ACC=$(mktemp)
awk '/^#### On accept/{inA=1; next} /^#{1,4} /{inA=0} inA' skill/chorus/LEARN.md > "$ACC"
grep -E "$SCAN" skill/chorus/LEARN.md | while IFS= read -r line; do
  grep -qF -- "$line" "$ACC" || echo "FAIL: write idiom outside the accept branch: $line"
done
rm -f "$ACC"
# expect: no FAIL: lines (fixture self-test above must also stay silent)
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
| walkthrough | US1, US2, FR-003/004/011, SC-001/002/003 (illustrative; navigation.md is normative — R12) |
| C1 | FR-001, FR-013 (frontmatter as structural block + any-two-mode-phrasing staleness) |
| C2 | FR-002, SC-006 |
| C3, C4 | FR-008, US4, SC-005 (per-step cardinality + channel-resolvable cites + quorum-table pin; FAIL tokens) |
| C5 | FR-007 deployment, repo + installed side (single clean stanza) |
| C5b | FR-015, SC-009 — plugin packaging **both directions** (roster = agents/ directory; no phantom entries) + refreshed description |
| C6 | FR-005, SC-008 (fixture-self-tested scan) |
| C7 | FR-005/006/007/014, US3, SC-004, SC-008 |
| resume question (navigation.md §Resume) | FR-010, SC-007 (incl. silent abandonment; outside SC-003's unit — G4) |
| S1 exit wrap-up | FR-004's fast-exit-rides-exit + FR-011 disclosure (label pinned — G19) |
| ownership binding (header) | SC-008's named owner + trigger: Gate C dogfood + pre-merge, ledger-recorded (G9) |
| first-newcomer record (post-merge) | SC-010 — within 30 days of merge, one real external newcomer session in the gate ledger (channel + outcome); until then the ledger says the loop is open |
