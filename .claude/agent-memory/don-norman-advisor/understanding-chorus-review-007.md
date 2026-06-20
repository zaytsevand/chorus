---
name: understanding-chorus-review-007
description: Norman-lens exploratory understanding of chorus-review repo + feature 007 (chorus learn onboarding), Gate A, 2026-06-10 — locators + candidate findings
metadata:
  type: project
---

# Understanding record — chorus-review / feature 007 (Gate A)

**Lens**: human-centred design (Norman). **Date**: 2026-06-10. **Worktree**:
`/home/az/code/chorus-review/.claude/worktrees/007-chorus-learn-onboarding`

## Project-scoped (carry forward across features)

- Repo is a Claude Code skill/persona repo: markdown prompts, no runtime app. "Users" =
  (a) newcomer adopting the chorus in their own project via installed skill, (b)
  developer working in this repo checkout. R6 exists because these two diverge.
- No `docs/reviews/CHORUS-PROJECT.md` addendum in this repo (verified by ls 2026-06-10;
  dir exists, holds prior round artifacts). The skill's own home runs addendum-less.
- No repo CLAUDE.md. Constitution is the unfilled speckit template; operative governance
  = chorus invariants (plan.md §Constitution Check).
- Two addendum-creation paths exist: SKILL.md:66-69 (orchestrator offers to write it at
  round end from inline answers) and, with 007, the learn-mode S2 scaffold (template
  verbatim + TO FILL flags). Differently-shaped outputs for the same artifact — watch
  for system-image drift in future features.
- install.sh deploys ONLY `skill/chorus-review/*.md` (install.sh:36) and refuses to
  overwrite agents without `--force`. Installer "Next:" prose (install.sh:57-60) tells
  users to hand-copy the template from a checkout they may not retain.
- Branch vs installed skill can diverge: this branch lacks DECISION-PRIMITIVE.md;
  `~/.claude/skills/chorus-review/` has it (006 installed). Verified by ls 2026-06-10.

## Feature-007 delta — needs map (locators, not copies)

1. **User + goals** — REFERENCED. spec.md §Context (L11-25), US1 (L29-53: newcomer,
   zero-to-first-round without reading raw docs), US2 (L57-79: expert skip/steer),
   Edge "user already expert" (L137), FR-012 non-expert floor. Goals not tasks; solid.
2. **Entry points / affordances** — REFERENCED. Trigger FR-001 + learn-mode.md §Trigger;
   discoverability FR-013 (SKILL.md mode list + README — README.md L23-43 currently says
   "Two modes", edit planned per plan.md L118); per-stage 4-slot question
   navigation.md L7-25; jump follow-up L19-24; resume question §Resume.
3. **Feedback surface** — REFERENCED with one hole. Scaffold wrap-up (scaffold.md
   "Wrap-up" row: states what was created + sections to fill); FR-011 exit wrap-up on
   every path (learn-mode.md §5). HOLE (inferred): exit wrap-up does not disclose that
   resume is conversation-scoped — see candidate finding A.
4. **Error catalog / recovery** — REFERENCED. scaffold.md §Failure honesty (template
   missing → state plainly, cite repo path, never reconstruct — exemplary); three guards
   (opt-in / no-overwrite / in-repo) are first-class error paths; install sub-step
   routing FR-006. OPEN: install sub-step content/recovery unspecified (data-model stage
   map S1 row names it only).
5. **Conceptual model** — REFERENCED. Three-mode model (learn-mode.md §Trigger &
   registration); LEARN.md as single canonical definition (plan R1); cite-not-restate
   FR-008 keeps one voice; CanonicalPointer entity (data-model.md L77-87).
6. **Cross-component contracts** — REFERENCED. AskUserQuestion 4-option budget sized
   exactly (navigation.md L7-8, plan R3); install.sh template deployment precondition
   (scaffold.md §Deployment, install.sh:36 verified); scaffold source fallback
   installed-skill → repo checkout (scaffold.md Source row).
7. **Spec/interface/runtime agreement** — INFERRED divergences: candidates A-D below.
   Also: C3 cite-resolution (quickstart.md L76-83) fails on THIS branch today
   (DECISION-PRIMITIVE.md absent pre-006 merge) — acknowledged as R8 sequencing.
8. **Operator vs user** — REFERENCED. The tutorial converts user→operator; checkout-dev
   vs installed-skill user split handled by scaffold source fallback + R6.

## Candidate findings (Gate A, my lens; authorable from document evidence)

- **A. Resume scope undisclosed at exit** — spec US2-sc3 (L77-79) + SC-007 (L221)
  promise resume unconditionally; Assumption 5 (L236-237) + R4 + data-model ResumeState
  scope it to the conversation. Cross-session re-invoke = silent restart, no disclosure
  in the FR-011 wrap-up. Gulf of evaluation / broken promise in system image. Deferral
  deliberate; non-disclosure is the finding.
- **B. N1 vs N5** — navigation.md N1 "every stage offers all four affordances" vs N5
  "S1 may substitute fast-exit for deeper". Contract contradicts itself; pick one voice.
- **C. Unit of "one choice"** — SC-003 "one navigation choice" vs navigation.md N2 "≤2
  interactions" vs quickstart L54 calling the jump+followup path "one navigation
  choice". Define the unit at the boundary.
- **D. One-question-per-stage vs dedicated scaffold confirm** — navigation.md L7
  "Exactly one AskUserQuestion call" per stage vs scaffold.md Offer row "via the
  navigation question or a dedicated confirm". Does a sub-step confirm count? Unstated.
- **E. Scaffold copies the template's meta-preamble verbatim** — scaffold.md Content row
  ("template verbatim") × template L9-13 ("Copy this template to ...") ⇒ the created
  addendum opens with instructions for an already-completed action. Signifier addressed
  to the wrong moment.
- **F (praise)** — R6 closes a real gulf of execution (verified install.sh:36); failure
  honesty clause; three scaffold guards; cite-not-restate; choose-your-path navigation
  sized to the tool budget with zero compression. Name these as done-right.
- **G (low)** — stale installed skill (pre-006) hits broken canonical pointers at
  runtime, not just at C3 authoring time; consider generalizing scaffold's failure-
  honesty stance to all CanonicalPointers.

## Files read this round (11)

spec.md, plan.md, data-model.md, quickstart.md, contracts/{learn-mode,navigation,
scaffold}.md (all under specs/007-chorus-learn-onboarding/), skill/chorus-review/
SKILL.md (L1-80), install.sh, README.md (L1-60), templates/CHORUS-PROJECT.template.md
(L1-60). research.md not read — R-decisions carried via plan.md + contracts' citations.

## Cycle-2 delta (Gate A cycle 2, 2026-06-10 — incremental re-validation after self-heal, commits 5e15677→33ccdcb)

Re-read this cycle (7): spec.md (full, revised), contracts/{navigation,scaffold,
learn-mode}.md, data-model.md, quickstart.md (all regen), template L1-20. plan.md /
research.md regen NOT re-read — R3-R10 carried via contracts' citations, as cycle 1.

### Candidate-finding resolution status (A-G → cycle-2 text)

- **A RESOLVED** — resume scope disclosed everywhere: FR-010 (per-transition tracking,
  scope named), FR-011 (wrap-up must state step reached + scope + new-session jump),
  US2-sc3 (spec.md L138-141), navigation.md §Resume, walkthrough Finish text
  (quickstart.md L62-66). Spec/contract/walkthrough now one voice.
- **B RESOLVED** — N5 struck (navigation.md L47-48); N1 universal; FR-004 universal,
  fast-exit rides exit affordance, S1 wrap-up IS the cheat-sheet (spec L249-254).
- **C RESOLVED** — SC-003 unit defined (one selection + follow-up, ≤2 interactions,
  spec L338-341); N2 restated in that unit; US2 Independent Test restated (L127-129);
  quickstart expert path matches (L69-71). Boundary unit now explicit.
- **D RESOLVED** — "Consent is not navigation" (navigation.md L21-24) scopes
  exactly-one to the navigation question; scaffold confirm is a dedicated question
  (scaffold.md Offer row, data-model AddendumScaffold.consent, FR-007).
- **E DESIGN-RESOLVED, IMPL-PENDING** — scaffold.md Content row: preamble
  "comment-wrapped in the template itself"; Binds line names the template as a 007
  edit surface. Branch template L9-13 still bare (verified this cycle) — the wrap is
  a planned edit. C7 accept-path expected outcome asserts "preamble reads correctly".
  → Gate C verification target.
- **F praise STRENGTHENED** — add: SCAFFOLDED marker is self-describing in-file
  (state + consumer rule + exit condition co-located in one comment, scaffold.md
  Content row); Phase-0 marker behavior = graceful confirm-with-operator, never
  silent consumption (FR-014); outside-repo notice replaces silent suppression
  (guard 3); dual-channel probes; SC-008 turns the strongest invariants mechanical.
- **G RESOLVED** — runtime cite-failure clause generalized: FR-008 final sentence,
  CanonicalPointer.runtime_failure (data-model L101), learn-mode.md Refusals (R10),
  scaffold.md §Failure honesty last line.

### New cycle-2 candidates (mine to author)

- **H (yellow-low, NEW)** — detection went dual-channel but the remedy stayed
  single-channel: FR-006 + learn-mode.md §4 instruct only "clone + ./install.sh".
  A plugin-channel user with a partial install (e.g. pre-R6 plugin lacking the
  template) is handed the file-path remedy — mismatched mental model ("I installed
  via plugin; why am I cloning a repo?") and a path to two competing installs whose
  precedence they can't predict. Probe knows the channel; the instruction should
  branch on it (plugin → update/reinstall plugin; file-path → clone + install.sh).
- **I (UPGRADED green→yellow at verdict, NEW)** — S1 exit signifier not pinned
  normatively: quickstart L21 labels the option "Exit (wrap-up = cheat-sheet)", but
  navigation.md:16 pins the label as bare "Exit the tutorial" (cheat-sheet only in
  the behavior column). Upgraded because family A's entire resolution rides this
  affordance being *discoverable at selection time* — an expert wanting the fast
  path sees no option that signifies it. Benign runtime failure (wrap-up always
  arrives); the gulf is pre-selection intention-forming. Fix: make the quickstart
  rendering normative in navigation.md slot 4.
- **J (green, NEW)** — S5 jump follow-up: changed-my-mind has no listed escape
  (S1-S4 only; "back" rides built-in Other free-text). Resolution by rule is
  recorded and consistent; residual is that the escape depends on the user knowing
  the tool's free-text affordance. Note, not a defect.

- **K (green, NEW at verdict)** — S2 intra-step ordering (dedicated confirm BEFORE
  the navigation question) is pinned only by the non-normative walkthrough
  (quickstart L29-33); learn-mode.md §2's step shape (explanation → Cites →
  navigation question) names no confirm slot. If the confirm lands after the
  navigation question, "Continue" silently bypasses the offer (US3 lost). One
  normative line fixes it.

### Carried, unchanged

- C3 cite-resolution fails on THIS branch today (S4 cites DECISION-PRIMITIVE.md,
  absent pre-006 merge) — known R8 sequencing, 007 lands after PR #5.
- Two addendum-creation paths now explicitly cross-referenced (scaffold.md
  §Consumer behavior, FR-007) — the cycle-1 watch item is addressed by design.
- Quickstart C5 bash carries a vestigial dangling test line (L128) — checker
  hygiene, Beck's domain, noted for cross-eval only.

### Verdict through my lens (cycle 2)

All 38-red families that touched HCD ground (A resume, B/C navigation unit, D
consent placement, E/F effects, G preamble, L dead option, N silent suppression)
read as resolved in the cycle-2 text. Residuals H/I/J are yellow-low/green —
none gating. Gate B/C carry-forwards: template preamble wrap lands in impl (E);
exit-label signifier (I); install remedy channel-match (H).

## Cycle-3 delta (Gate A cycle 3 fix-verification, 2026-06-10, commits 96218cc+045f540)

Re-read: navigation.md (whole, 67L — reshaped), spec.md FR-004/-006/-008/-011/-015
(L306-388) + SC-003/-005/-009 (L417-451), quickstart.md L1-72 + traceability L191.

### H/I/J/K resolution (all four resolved in cycle-3 text)

- **H RESOLVED** — FR-006 (spec L322-330): remedy text branches by detected channel
  (file-path → clone+install.sh; plugin → reinstall/update plugin); SC-009 asserts
  "no documented channel degrades silently". New FR-015 (L383-388) closes the deeper
  cause: plugin channel must DELIVER artefacts (plugin.json named edit surface —
  exists at repo root, verified; plan.md L25/44/92).
- **I RESOLVED** — navigation.md is now THE normative surface (R12, header L6-9);
  slot 4 pins "Exit — get the cheat-sheet" at S1 (L21); FR-004 restates "label
  signifies that before selection"; quickstart self-declares illustrative (L6-7)
  and conforms (L27).
- **J RESOLVED** — S5 jump follow-up question text discloses the free-text escape
  ("free-text/Other stays here at S5", navigation.md L37-40, G21); stated, not
  assumed tool knowledge. Quickstart L67 conforms.
- **K RESOLVED** — S2 confirm-before-navigation ordering pinned normatively
  (navigation.md L26-31, G20: "decides the write, then where to go"); walkthrough
  conforms (quickstart L35-39).

### New cycle-3 surfaces, read clean through my lens

- S5 advance "Finish the tutorial" / Exit convergence is DECLARED (slot 1, G3/G27)
  — a deliberate convergence named at the contract, not a hidden duplicate. Good.
- Per-step depth state (G24, slot 2): recap label only after that step's own deeper
  pass; quickstart L68-70 demonstrates (S4 deeper does not flip S5). Good.
- Cite-failure pointer resolves via running skill's base path (FR-008 L347-349) —
  channel-correct recovery pointer; pairs with H's fix. Good.
- SC-003 excludes resume question from the unit (L420-422, navigation.md L65-67)
  "stated honestly rather than folded into the metric". Honest measurement. Good.
- Cycle-1 OPEN (need 4, install sub-step content) now closed by FR-006 branched
  remedy text. Needs map: 7 referenced / 1 inferred / 0 operator-confirmed /
  0 open-gap.

## Run-2 clean-slate revalidation (Gate A run 2 exploratory, 2026-06-12)

Corpus UNCHANGED since cycle-3 self-heal (only agent-sdlc-log.md committed after
045f540; verified via git show b6a2028). Re-read and re-confirmed: navigation.md
whole (matches record), spec.md L1-54 Context/terminology, L55-129 clarifications,
L336-388 FR-008/-010/-011/-012/-013/-014/-015, section map (US1 L143, US2 L171,
US3 L199, US4 L232, SC block L408+). Canon facts still true: README L22 "Two modes"
(impl-pending), template L9-13 preamble bare (Gate C target E), install.sh:36
additive `cp *.md`, plugin.json at repo root. Needs map carried: 7 referenced /
1 inferred / 0 open-gap; gate (user+goals) REFERENCED at spec §Context L13-25 + US1-US4.
Run-1 cycle-3 escalation named 6 gating reds against this text (5 conformance-rigor:
C5b inert manifest grep, C3 total-not-per-step, C6 one-directional self-test,
unenforced normative nav labels; 1 cite-failure UX) — clean-slate: re-derive at
authoring, do not import. "Unenforced normative nav labels" and "cite-failure UX"
touch my lens; check at authoring whether navigation.md's pinned labels have a
conformance assertion and whether FR-008's runtime clause fully covers the UX.

### Verdict through my lens (cycle 3)

No open HCD candidates remain at spec level. Gate B/C carry-forwards only:
template preamble wrap (E, impl); C3 cite-resolution on this branch pre-006 merge
(R8 sequencing); SC-008/SC-009 assertions land at Gate C.
