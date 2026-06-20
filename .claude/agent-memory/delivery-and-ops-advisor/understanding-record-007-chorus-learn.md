---
name: understanding-record-007-chorus-learn
description: D&O lens understanding record for chorus-review feature 007 (chorus learn) — Gate A; needs ledger + cycle-2 findings + cycle-3 verification (all 4 D&O seeds healed; 7/7 referenced, 0 gaps)
metadata:
  type: project
---

# Understanding record — Delivery-and-Ops lens — feature 007 `chorus learn`

Repo root (worktree): `/home/az/code/chorus-review/.claude/worktrees/007-chorus-learn-onboarding`
No record existed before cycle 2 (D&O was unseated at Gate A cycle 1 — tied RSVP;
seated lenses were Norman/Uncle Bob/Evans/Richards/Cooper). Needs derived fresh from
the lens + cycle-2 deltas. Cycle-1 ledger: `specs/007-chorus-learn-onboarding/agent-sdlc-log.md`
(38 reds, families A-N; my cycle-1 RSVP topics — R6 FR-007-dead-outside-repo, R8
drift window, C1-C6 real-or-decorative — were carried by families E/F/G/H/K/M).

## Needs ledger

| # | Need | Status | Locator |
|---|---|---|---|
| 1 | Release path, file-path channel (repo → `$SKILL_DST`) | referenced | `install.sh:36` (`cp -f "$SKILL_SRC"/*.md` — top-level only, no subdirs, additive-only); heal: `contracts/scaffold.md` §Deployment precondition; asserted by quickstart C5 installed-side mktemp test |
| 2 | Plugin-channel template delivery (the "both channels" claim) | referenced *(was open-gap; healed cycle 3)* | spec FR-015 (:383) + SC-009 (:447); `research.md` R11 (:243) names `plugin.json` as the edit surface (templates/ + 3 missing agents + stale description refresh); quickstart C5b (:149) asserts packaging — loop's `"agents/x.md"` quote style verified to match plugin.json format. plugin.json itself still 7/10+no-templates (implementation pending; C5b will catch) |
| 3 | Checks C1-C7+C5b real-vs-decorative | referenced *(healed cycle 3)* | `quickstart.md` — C6 alternation fixed + fixture self-test mandated by SC-008, **empirically verified alive 6/6** (2026-06-10); C5 dead stanza removed, repo grep anchored `^cp .*templates` (:142); C1 awk whole-frontmatter-block parse replaces sed 1,6p (:92); C3 cardinality floor ≥5 fails-on-zero (:113-114); C2/C3 vacuous-pass class closed (G26) |
| 4 | Repo/installed drift window + runtime cite-failure | referenced | `research.md` R8 (corrected per F25: 007 itself performs two→three reframe; merge-after-006 order named) + R10 (cite-failure: state plainly, summary altitude, never reconstruct — `contracts/learn-mode.md` §Refusals) |
| 5 | Effect surface declared at call site | referenced | `data-model.md` §SubStep (install: effects **none**, instruct-only; scaffold: exactly one write behind dedicated confirm); SCAFFOLDED marker + SKILL.md Phase-0 consumer note (spec FR-014, R9); dogfood declines by default (F61) — correct operational caution |
| 6 | Check execution ownership (who runs C1-C7, when) | referenced *(was inferred; healed cycle 3)* | SC-008 (:437) + quickstart preamble (:85-87): "Owner & trigger: the Gate C dogfood and the pre-merge pass; results land in the gate ledger (G9)" — manual gate-time discipline, named, no CI needed at this scale |
| 7 | Failure history | referenced | cycle-1 ledger families A-N; convergence-escalation watch-signal noted at I7 |

## Cycle-2 delta — 2026-06-10 (Gate A cycle 2, commits 5e15677 → 33ccdcb)

**Healed clean from my lens (no finding):**
- Family E/F detection side: dual-channel artefact-grounded read-only probes
  (R5); install sub-step instruct-only with declared empty effects list — hidden-effect
  surface eliminated by design.
- Family G/R9: SCAFFOLDED marker + Phase-0 consumer behavior — the third state
  defined for its consumer; "effects visible at the call site" extended to the
  artifact's downstream reader. Dogfood-declines default is right: accepting would
  change this repo's Phase-0 behavior for every future round.
- Family H/R10: runtime cite-failure clause is exactly the declared-degraded-mode
  behavior my lens asks for. Authoring-time C3 + runtime honesty = both ends of the
  contract covered.
- Family J/M + FR-013: every cold-start surface named as an edit surface with C1
  staleness assert.
- R8 corrected per F25; merge-order conflict surface (SKILL.md mode region) named.

**Finding seeds I would author (cycle 2):**
1. **Plugin-channel template gap (residual of families F/G — the deployment half).**
   Detection was healed (probe honestly reports template-unreachable) but the
   *delivery* claim is unbacked: `plugin.json` ships `skill/chorus-review/` + agents;
   repo-root `templates/` is not in the set, and no design artifact names a
   plugin-side edit (template copy under `skill/chorus-review/templates/`, a
   plugin.json asset entry, or an explicit downgrade of the claim). As designed,
   FR-007 remains unimplementable on the plugin channel while `contracts/scaffold.md`
   §Source asserts "both install channels work (R5/R6)". Remedy is cheap: name the
   plugin-channel edit surface or state honestly that plugin installs get the
   degraded (instruct/fallback) path; extend C5 or C7 with a plugin-layout assertion.
2. **C6 write-idiom scan regex is dead for 3 of its idioms** (family K re-instantiated
   inside its own heal). `grep -nE "Write tool|Edit tool|\bcp \|\btee \|mkdir |> docs/|>> "`
   — the `\|` inside `-E` makes literal pipes; verified empirically: `mkdir foo`,
   `cp a b`, `tee x` all pass unflagged. SC-008 binds to this exact scan. One-line fix:
   `grep -nE "Write tool|Edit tool|\bcp |\btee |\bmkdir |> docs/|>> "`.
3. **C5 first half is vestigial dead code**: `CLAUDE_HOME=$(mktemp -d) ./install.sh`
   leaks an orphaned temp dir, then `test -f "$CLAUDE_HOME_TMP_CHECK"` references an
   undefined var and is swallowed by `;`. The second half (`CH=$(mktemp -d)…`) is the
   real assertion. Also the repo-side `grep -n "templates" install.sh` false-positives
   today on install.sh:58's "Next:" prose — same bare-substring class family H removed
   from C3; tighten to `grep -nE '^cp .*templates' install.sh` or drop (the mktemp
   half is decisive anyway).

**Non-gating observations (recorded, not 007 findings):**
- `install.sh` is additive-only (`cp -f *.md`, no clean): docs renamed/removed in the
  repo persist stale in `$SKILL_DST`. R10 covers missing-at-runtime; stale-PRESENT-at-
  runtime (old content under a cited name) stays silent. Pre-existing installer
  property, not introduced by 007 — candidate for a future round, not this gate.
- C1's frontmatter check pins `sed -n '1,6p'` — false-negatives if frontmatter grows
  past 6 lines. Trivial brittleness.
- C6 even when fixed is semi-mechanical (placement-in-accept-branch is eyeballed);
  R7 admits manual backstop honestly. Acceptable.

**Gaps emitted (both non-blocking):** plugin-channel ship-set question (lens);
C1-C7 run-point naming (project-wide). Safe defaults exist for both.

## Cycle-2 verdict filed — 2026-06-10 (commit 33ccdcb)

Family verdicts returned: C/D/E/G/H/I/J/M/N resolved; **F false** (plugin-channel
template delivery asserted at scaffold.md:32 but unspecified+unasserted — probe per
R5 looks at `<skill-base>/templates/` which nothing populates on the plugin channel);
**K false** (C6 ERE+`\|` scan empirically dead for cp/tee/mkdir at quickstart.md:138;
C1/C4 BRE greps verified working — asymmetry confirmed by test). Findings filed:
2 red (plugin delivery, C6 regex), 2 yellow (C5 vestigial half + bare-substring grep,
quickstart.md:125-128; C1-C7 run-point unnamed — no CI, Gate C canon names only
spec-walkthrough), 2 green (additive-only installer stale-present vs R10
missing-only; C1 sed 1,6p frontmatter window). A/B/L left to interaction lenses.

## Cycle-2 cross-vote — 2026-06-10

Voted on 21 peer findings (G1-G5, G12-G27). PRIORITIZE on all 21 — every
claim verified against the corpus (C6 regex re-confirmed empirically); held
my filed severities on the duplicates (G12 plugin-template red, G13/G23
C6-regex red-class, G2/G15/G22/G25 C5-dead-stanza yellow-class). Newly
verified facts worth keeping:
- **plugin.json ships 7 of 10 agents** (security-and-trust, constraint-and-flow,
  guido absent from plugin.json:10-18 vs agents/ on disk) — packaging drift
  predating 007; S1's FR-006 agent probe makes it user-visible on the plugin
  channel and routes to a channel-wrong remedy (clone+install.sh). Fold into
  the plugin-channel red's fix surface.
- **README.md:272 hardcodes `~/code/chorus-review/`** in the manual-fallback cp —
  author's-home path in a first-touch surface; learn-mode.md:16 pins only
  ordering for the README (vs :17 pinning installed location for install.sh).
- **SKILL.md:30 "Both modes run it"** (exploratory phase) escapes C1's staleness
  pins (quickstart.md:84) and goes ambiguous post-three-mode reframe.
- Vacuous-check class extends beyond C6: **C2/C3 pass on zero `Cites:` lines**
  (quickstart.md:91-93, 102-105) — cite-existence unasserted; cardinality
  assert is the cheap fix.

## Cycle-3 delta — 2026-06-10 (fix-verification, commits 96218cc + 045f540)

All four D&O seeds + all cross-vote facts healed at spec/plan level; ledger now
7 referenced / 0 inferred / 0 open-gap. Verification anchors:

- **Plugin delivery (red 1)**: FR-015 spec.md:383; R11 research.md:243 (plugin.json
  named edit surface — templates/ + constraint-and-flow + security-and-trust + guido
  + description refresh; rejected alternatives include channel-downgrade = F44 class
  and runtime GitHub fetch = supply-chain); SC-009 spec.md:447; C5b quickstart.md:149.
- **C6 regex (red 2)**: quickstart.md:161-174 — single-quoted SCAN var, no `\|`;
  fixture self-test of all 6 idioms required to fire before the real scan; I ran the
  fixture block verbatim: ALIVE 6/6. SC-008 makes self-testing normative.
- **C5 vestigial (yellow)**: dead stanza gone (G2/G8/G25), one clean mktemp stanza
  with `rm -rf "$CH"`, repo-side grep anchored `^cp .*templates` quickstart.md:142.
- **Run-point (yellow)**: SC-008 + quickstart.md:85-87 — Gate C dogfood + pre-merge,
  ledger-recorded.
- **Greens/cross-vote**: C1 awk frontmatter-block (G11) quickstart.md:92; staleness
  grep widened to `Two modes|[Bb]oth modes` over SKILL.md+README (G14); C3 cardinality
  floor ≥5 fails-on-zero (G26) quickstart.md:113; README author-path literal pinned out
  by learn-mode.md:16 "no environment-specific literals" (G5); R12 makes navigation.md
  normative over the walkthrough (labels, S2 confirm ordering, per-step depth state,
  Finish/Exit declared convergence).

Residual (non-blocking, lens): plugin-channel *propagation* — C5b asserts the
manifest repo-side, but no artifact names whether a version bump / publish step is
needed for existing plugin installs to receive the new packaged files. Pre-existing
channel mechanics; safe default = Gate C/implementation concern.
