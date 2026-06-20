---
name: project-007-learn-gatea-findings
description: 007 chorus-learn Gate A — run-1 (2026-06-10) 2 red resolved by cycle-3 regen; run-2 (2026-06-12) 1 red (S2 install.sh cite unresolvable for plugin cohort), 2 yellow
metadata:
  type: project
---

Gate A (design) findings authored for feature 007 from [[understanding-chorus-review-007]].

**Red**: (1) FR-004/N1 "every stage offers all four affordances" contradicts N5's S1
fast-exit substitution (quickstart confirms S1 has no deeper) — pick one voice.
(2) SC-003/US2-Independent-Test "one navigation choice" vs N2 "≤2 interactions" vs
quickstart's relabeling; contract's S1 slot table cannot deliver the spec's literal
"skip setup → run a round at the first question".

**Yellow**: resume scope undisclosed at exit wrap-up (SC-007 reads unconditional, state
is conversation-scoped); S2 write-confirm placement ambiguous ("or" in scaffold.md Offer
vs navigation.md exactly-one) + slip risk of co-locating the write with navigation;
install sub-step unspecified (no SubStep entity, R5.1 "(clone + ./install.sh)" ambiguous
against learn-mode's "no writes — whole list"); R5.1 probe false-negatives plugin
installs (README documents two install paths); scaffold copies template meta-preamble
verbatim (stale "copy this template" instruction in the created file); failure honesty
not generalized to runtime CanonicalPointers (spec edge case overstates C3 coverage).

**Green** incl. praise: two-vs-three modes vocabulary wobble; ResumeState recording
trigger (exit-only vs continuous); second "deeper" select unspecified; template
"required before launch" vs README "interviews inline if incomplete" — tutorial will
inherit one story; README Run-a-round hardcoded cp path competes with the tutorial;
praise for failure-honesty clause, three scaffold guards, truthful R5 probes,
zero-compression navigation budget, R6 closing the template gulf.

**How to apply**: at Gate B/C verify the reds were reconciled in spec/contract text, the
exit wrap-up discloses resume scope + names the reached stage, and the S2 confirm became
a dedicated question.

**Cycle 2 RSVP (2026-06-10)**: JOINED. Spot-checked revised artifacts: N5 struck in
navigation.md (N1 universal), FR-011 resume wrap-up disclosure landed, scaffold confirm
is a dedicated question, SC-003 unit defined. New verification target for cycle-2 review:
slot 4 is now polymorphic by state (exit=cheat-sheet at S1; deeper→"recap this step"
after one pass; no back at S5) — context-dependent signifier, classic mode-error surface.
Check whether the user can predict slot 4's meaning before selecting it at each step.

**Cycle 2 exploratory verdict (2026-06-10)**: both reds + all my yellows resolved in the
revised text (full ledger in [[understanding-chorus-review-007]] §Cycle-2 delta). The
slot-4 verification target resolved mostly clean: deeper→recap is predictable and
labeled; the one residual is the S1 exit label — quickstart renders "Exit (wrap-up =
cheat-sheet)" but no contract pins the label, only the behavior (green). New yellow-low:
install sub-step remedy is single-channel (clone+install.sh) while detection is
dual-channel — plugin-cohort mismatch. Gate B/C carry-forwards: template preamble
comment-wrap is impl-pending (branch template still bare, C7 asserts it), exit-label
signifier, remedy channel-match.

**Cycle-2 VERDICT delivered (2026-06-10, Gate A cycle 2)**: all 14 families A-N
resolved=true through my lens (G and M design-resolved, branch edits impl-pending —
template L9-13 preamble still bare, README L22 still "Two modes"; C1/C7 are the
catch-nets). Filed 2 yellow + 3 green NEW: (y1) FR-006 remedy single-channel vs
dual-channel detection; (y2) S1 exit signifier unpinned — upgraded from green because
family A's resolution depends on pre-selection discoverability; (g) S2 confirm-ordering
normative gap, S5 stay-here rides Other, C5 dead lines (quickstart.md:127-128).

**Cycle-2 cross-eval (2026-06-10)**: 22 peer findings (cooper/dno/richards/unclebob),
all PRIORITIZE — every citation verified against the corpus (empirical grep test of C6's
dead \| branches; ls of plugin.json vs skill/chorus-review/ confirming no templates/ on
the plugin channel; install.sh:36 additive cp; SKILL.md:30 'Both modes run it' residue).
Folded UP from my own green on C5's dead lines (q:127-128): peers found the behavioral
consequence (leaked duplicate install per run + suite-authority erosion + G8's
prose-matching grep, a family-H recurrence) — yellow is right. Backed red over Richards'
yellow on C6: a manual backstop doesn't rescue an SC that claims 'mechanically checked.'
Two reds real: plugin-channel template gap (G6/G12 — probe falsely reports working
plugin installs broken, F6 misrouting reborn) and C6 decorative write-scan (G7/G23).

**Run-2 Gate A authored (2026-06-12, cycle-3 corpus)**: prior reds confirmed resolved in
text (navigation.md normative R12, S1 exit label pinned "Exit — get the cheat-sheet",
SC-003 unit defined, FR-004 universal). NEW red NORM-1: S2 Cites: includes `install.sh`
(data-model.md:34, research.md:30) — never deployed to either channel (install.sh:36
ships only skill md; plugin.json has no install entry), so every plugin/installed
newcomer (the priced audience) hits FR-008's cite-failure path at S2 on a healthy
install; C3 resolves repo-relative and passes, so no check catches it. Yellow NORM-2:
learn-mode.md:18/plan.md:154/research.md:248 enumerate `constraint-and-flow` — renamed
eliyahu-goldratt-advisor.md 2026-06-12; C5b is data-driven (rename-proof net) but prose
teaches implementer a stale model, caught only at Gate C. Yellow NORM-3 (flagged
challenge to recorded operator decision): pinned nav labels have zero mechanical
assertion — dogfood-only verifies once at Gate C; post-merge label drift has no net.
Greens: cite-failure honesty, outside-repo stated unavailability, resume disclosure,
C3 cardinality floor + C6 fixture self-test, FR-014 two-consumer marker, S5 declared
convergence. Verify at Gate B/C: S2 cite made channel-resolvable; agent enumeration
refreshed.

**Prior cross-eval calibration (cycle 1, 2026-06-10)**: voted PRIORITIZE on 46/47 peer findings; sole
OVER-RATE was uncle-bob's yellow on §-anchor cite granularity (green-level; data-model
honestly scopes validation to doc resolution). Folded UP from my greens where peers found
the behavioral consequence I'd filed as vocabulary residue: Evans' TO-FILL third state
(scaffolded placeholders read as content by SKILL.md's binary present/absent contract),
Evans' registry framing ("both modes built on the gate primitive" becomes false prose),
Cooper's cold-start surfaces (README step 1 cp from the author's home path). New defects
peers caught that I missed: S5 jump-overflow (navigation formula false at the terminal
stage), C3 false-positive on CHORUS-PROJECT.md (the harness cries wolf by construction),
frontmatter-description routing surface unnamed in the registration contract, deeper
re-present vs N1 contradiction. Lesson: I checked the navigation budget at S1 but not at
the terminal boundary — check invariants at BOTH edges, and trace every spec-mandated
token through every check that scans for tokens.
