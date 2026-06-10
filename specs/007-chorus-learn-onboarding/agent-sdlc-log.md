# Agent-SDLC ledger — feature 007 `chorus learn`

Audit trail for the gated lifecycle of `specs/007-chorus-learn-onboarding`. Schema:
`specs/003-agent-sdlc-workflow/contracts/sdlc-ledger.md`; decision records:
`DECISION-PRIMITIVE.md`.

## Provisional decisions (review & override)

| id | point | band | sensor (signal → reading) | chosen | alternatives | override + cost |
|---|---|---|---|---|---|---|
| gateA-scope-1 | Phase-0 scope/exclusion (addendum absent) | 🟡 | catalog row 10: `docs/reviews/CHORUS-PROJECT.md` does not exist in this repo → infer defaults + async confirm | anchor = `specs/007-*/**`, `skill/chorus-review/**`, `install.sh`, `templates/`, `README.md`, `agents/`; excluded = `.specify/`, `.memsearch/`, `.claude/`, prior-feature specs as findings-targets | interview the operator inline before the gate (rejected: row 10 declares the default) | name any path to add/remove; cost = re-brief affected lenses, ~1 gate re-run if scope materially shifts |
| gateA-roster-1 | Optional language lens (Guido) at Phase 0 | 🟢 | mechanical: round corpus contains no Python (markdown + bash only) | not invited | invite and let RSVP drop him | say "include Guido"; cost = one extra RSVP dispatch |
| gateA-seating-1 | RSVP seating — tie at the cap (J=9) | 🟡 | catalog row 2: seven lenses tied at (applies=3, stakes=🟡) spanning the 5th seat → non-strict order at the boundary | default panel **norman, unclebob, evans, richards, cooper** by declared sort (applies ↓, stakes ↓, roster-order tiebreak); resolution: default-applied | runner-ups in order: beck, dno, sec, cnf (each tied with the 3 seated tail lenses) | name a lens to swap in (async, any time before sign-off); cost = author+vote dispatch for that lens + tally recompute (~1 lens-cycle) |
| gateA-gaps-1 | Exploratory gaps — operator interview | 🟡 | catalog rows 6/7: 13 gap-questions raised, **0 flagged blocking** (row 8 not triggered) → recorded-assumption defaults, interview deferred | each advisor proceeds on the safest repo-documented assumption, stated inside any finding that rests on it; resolution: default-applied | run a ≤5-question interview session before Author (rejected: no blocking gap; rows 6/7 declare the default) | answer any gap-question async (they are listed below); cost = affected lens re-grounds, possibly 1 re-vote |
| gateA-selfheal-1 | Gating 🔴 set after cycle-1 tally (38 findings) | 🟡→🔴 | catalog row 5: `cycle 1 < 3` → auto-run incorporation cascade + re-run gate; **resolution: ESCALATED** — cycle 1 BLOCKED (38 🔴 / 14 families) → cycle 2 BLOCKED (14 🔴 / 6 clusters) → cycle 3 BLOCKED (6 🔴 / 3 clusters); **`cycle == 3` reached without clearing → row 5 flips to 🔴, hand to operator (D2: no auto-default)** | three self-heal cycles run; convergence monotonic (38→14→6) but not zero | superseded by **gateA-escalation-1** below | — |
| gateA-escalation-1 | Self-heal bound reached: 6 gating 🔴 after cycle-3 tally | 🔴 | catalog row 5 (`cycle == 3`) + S7: hard-block, instant framed ask, **no auto-default** (D2) | **WAIT for operator** — options framed in the cycle-3 verdict below | A waive (per-🔴 rationale, S4) · B one more incorporation cycle (operator-authorized 4th, past the S7 bound) · C amend scope (defer a cluster) | operator selects A/B/C/other; nothing proceeds until then |

---

## Gate A — design review (cycle 1) — 2026-06-10

**Corpus**: `spec.md`, `plan.md`, `research.md` (R1–R8), `data-model.md`,
`contracts/{learn-mode,navigation,scaffold}.md`, `quickstart.md` (C1–C6) + touched
surfaces (`skill/chorus-review/SKILL.md` pre-006, `install.sh`,
`templates/CHORUS-PROJECT.template.md`, `README.md`) + installed 006-era canon.

### RSVP (two-axis signal; all replies are real dispatches)

| Lens | Decision | Applies (cited deltas) | Expected stakes | Reason (1-line) |
|---|---|---|---|---|
| Norman (HCD) | JOIN | onboarding-as-conceptual-model; R4 resume vs "resumable"; R3 4-option budget; scaffold consent + R6 | 🟡 | spec-voice vs runtime-voice mismatch on resumability is a system-image gulf |
| Uncle Bob (clean code) | JOIN | R6 install seam; R8 unmerged-006 dependency; cite-not-restate (DRY); single opt-in write | 🟡 | install seam silently strips a dependency of the new mode |
| Evans (DDD) | JOIN | CanonicalPointer as Published Language; R8 dangling cites; R6 contract divergence | 🟡 | single-source-of-truth across repo/installed/006 is where DDD cuts |
| Richards (architecture) | JOIN | R6 deployment-seam coupling; R8 cite-resolution drift; R7 fitness-function status of C1–C6 | 🟡 | whether C3 validates repo vs installed decides if R8 is enforced or asserted |
| Cooper (adversarial product) | JOIN | R3 contract sized to tool not learner; R4 resume promise; scaffold consent unreachable pre-R6 | 🟡 | promises without proof at the new user's first contact |
| Beck (TDD) | JOIN | C1–C6 as the design's only test suite; R6 needs own pinned check; R8 | 🟡 | C3 cannot go green pre-006-merge — deferred feedback loop |
| Delivery-and-Ops | JOIN | R6 (FR-007 dead outside repo); R8 repo/installed drift window; C1–C6 real-or-decorative | 🟡 | install.sh is the entire release path |
| Security-and-Trust | JOIN | scaffold write into foreign repo; install.sh widened deploy set; C6 non-mutating claim | 🟡 | scaffolded addendum becomes trusted instruction input to future rounds |
| Constraint-and-Flow | JOIN | 13-FR batch before audience evidence; R8 WIP stacking on open PR #5; R6 separable slice | 🟡 | onboarding mode is a bet on an audience not yet evidenced |

**Quorum**: J=9 → cap-5 seating (S3). **Seated (🟡 default panel, see decision card)**:
Norman, Uncle Bob, Evans, Richards, Cooper. Beck/D&O/Security/C&F unseated as tied
runner-ups — their RSVP hooks are recorded above and available to the vote-stage
override. Guido not invited (🟢 card). Note: 9/9 JOIN with uniform 🟡 stakes is a
performative-join watch signal; applicability held (every JOIN cited concrete deltas),
recorded for the next round-context tightening.

### Exploratory phase (EXPLORATORY-PHASE.md; joiners seated only)

| Lens | Record | Needs coverage | Gaps raised |
|---|---|---|---|
| Norman | `~/.claude/agent-memory/don-norman-advisor/understanding-chorus-review-007.md` | 6 referenced / 2 inferred / 1 open-gap | 5 (0 blocking) |
| Uncle Bob | `~/.claude/agent-memory/uncle-bob-architect/understanding_chorus-review.md` | 9 referenced / 1 inferred | 3 (0 blocking) |
| Evans | `<worktree>/.claude/agent-memory/eric-evans-advisor/understanding_record.md` | 3 referenced / 5 inferred / 1 operator-confirmed | 3 (0 blocking) |
| Richards | `~/.claude/agent-memory/mark-richards-architect/understanding-project.md` | 9 referenced / 2 inferred | 4 (0 blocking) |
| Cooper | `~/.claude/agent-memory/alan-cooper-advisor/understanding-chorus-review.md` | 6 referenced / 2 inferred | 3 (0 blocking) |

**Interview**: deferred (gateA-gaps-1 🟡) — no blocking gap; 13 questions carried as
recorded assumptions. **Degradation note**: findings that rest on an assumption state it
inline; the gap pool is available for an async session at any time. Highlights of the
pool (likely to surface as findings): SC-003 "one navigation choice" vs the two-interaction
jump; the resume promise vs in-conversation scope; two addendum-creation paths
(round-end offer vs S2 scaffold); SKILL.md YAML frontmatter as the real routing surface;
no post-install assertion for the deployed template; "Stage" homonym (tutorial stages vs
gate-primitive stages); installed-vs-repo template authority on divergence.

**Extract**: 54 records over the design artefacts + touched surfaces (2 read-only
agents); records held at `/tmp/gate-a-007-extract.json` for the Author stage.

### Findings register & tally (cycle 1)

Author stage uncapped; I8 evidence gate: **0 demoted** (every finding carries
`file:line` or a cited principle tag). Votes are real dispatches; each finding's author
excluded (S8). Tally is the symmetric stage-4 rule; severity below is **post-tally**.

| ID | Lens | Proposed | Votes P–O | Post | Summary |
|---|---|:--:|:--:|:--:|---|
| F1 | Norman | 🔴 | 4–0 | 🔴 | FR-004 and N1 contradict N5's S1 fast-exit substitution; two MUST-level statements cannot both hold. |
| F2 | Norman | 🔴 | 3–1 | 🔴 | SC-003's unit "one navigation choice" is undefined; US2's independent test unsatisfiable as written. |
| F3 | Norman | 🟡 | 4–0 | 🔴 | Exit wrap-up never discloses conversation-scoped resume; SC-007's promise breaks silently across sessions. |
| F4 | Norman | 🟡 | 4–0 | 🔴 | Scaffold confirm placement ("via the navigation question or a dedicated confirm") contradicts the exactly-one rule; invites slips. |
| F5 | Norman | 🟡 | 4–0 | 🔴 | Install sub-step — the least-capable user's path — has no contract; its write surface is ambiguous. |
| F6 | Norman | 🟡 | 4–0 | 🔴 | Installed-skill probe false-negatives the README's plugin install path, telling working users their setup is broken. |
| F7 | Norman | 🟡 | 4–0 | 🔴 | Scaffolded addendum opens by instructing the user to copy a template the tutorial just copied. |
| F8 | Norman | 🟡 | 4–0 | 🔴 | Failure honesty covers only the missing template; a missing cited canon doc at runtime has no specified behavior. |
| F9 | Norman | 🟢 | 4–0 | 🟡 | Artifacts say "two modes", "both modes", and "three modes" in different places; pick one framing. |
| F10 | Norman | 🟢 | 4–0 | 🟡 | ResumeState recorded only at explicit exit; silent abandonment is the commoner path FR-010 must serve. |
| F11 | Norman | 🟢 | 4–0 | 🟡 | After one deeper pass N1 forces "Go deeper" to reappear, but selecting it again is unspecified. |
| F12 | Norman | 🟢 | 4–0 | 🟡 | Template says sections 2/3/5 block launch; README says the round interviews inline; the tutorial inherits one story. |
| F13 | Norman | 🟢 | 4–0 | 🟡 | README's run-a-round walkthrough leads with a hardcoded cp path, competing with the tutorial. |
| F14 | Norman | 🟢 | 4–0 | 🟡 | Several error-path designs are exemplary; protect them through implementation. |
| F15 | Uncle Bob | 🔴 | 1–3 | 🟡 | Jump follow-up overflows the four-option budget at S5 (demoted to match F42's grade). |
| F16 | Uncle Bob | 🔴 | 4–0 | 🔴 | Registration contract omits the SKILL.md frontmatter description — the harness's actual routing surface for the trigger. |
| F17 | Uncle Bob | 🔴 | 4–0 | 🔴 | Check C3 is guaranteed to false-positive on FR-007-conforming content (CHORUS-PROJECT.md matches the regex). |
| F18 | Uncle Bob | 🟡 | 4–0 | 🔴 | FR-004, the expert fast-exit, and the four-option budget are jointly unsatisfiable at S1. |
| F19 | Uncle Bob | 🟡 | 4–0 | 🔴 | SC-003 contradicts the two-interaction jump; N2's fast-exit claim is false. |
| F20 | Uncle Bob | 🟡 | 3–1 | 🔴 | After one go-deeper pass the re-presented question cannot satisfy both N1 and the one-level cap. |
| F21 | Uncle Bob | 🟡 | 4–0 | 🔴 | Install sub-step's effects unspecified, threatening the no-writes-except-scaffold claim. |
| F22 | Uncle Bob | 🟡 | 3–0 | 🔴 | Two unreconciled creation paths target docs/reviews/CHORUS-PROJECT.md with different content semantics. |
| F23 | Uncle Bob | 🟡 | 1–3 | 🟢 | C3 verifies file names only; heading renames drift silently (right-sized as a note). |
| F24 | Uncle Bob | 🟡 | 3–0 | 🔴 | C4's comment names the RSVP quorum table but no grep covers it; R7 and C4 list different blocks. |
| F25 | Uncle Bob | 🟡 | 1–2 | 🟡 | plan.md claims 006 delivers a three-mode-aware SKILL.md; the 006 canon still lists two (007 adds the third). |
| F26 | Uncle Bob | 🟡 | 4–0 | 🔴 | The most load-bearing invariant — one write surface — gets the weakest check: manual inspection. |
| F27 | Uncle Bob | 🟢 | 4–0 | 🟡 | Closed write surface + three guards + failure honesty is the design's best seam; preserve verbatim. |
| F28 | Uncle Bob | 🟢 | 3–0 | 🟡 | R1/R6 honor the one-canonical-definition rule; the rejected alternatives were the real DRY violations. |
| F29 | Uncle Bob | 🟢 | 4–0 | 🟡 | Two-modes framing survives in SKILL.md/README/FR-002; the registration contract does not name those edits. |
| F30 | Evans | 🔴 | 4–0 | 🔴 | C3 false-positives on CHORUS-PROJECT.md; no FR-007-conforming LEARN.md can pass the anti-drift check. |
| F31 | Evans | 🟡 | 4–0 | 🔴 | SKILL.md and README registries will assert two modes while listing three; no check catches it. |
| F32 | Evans | 🟡 | 4–0 | 🔴 | "Stage" means both a tutorial unit and a gate phase, colliding inside S3 for the zero-vocabulary newcomer. |
| F33 | Evans | 🟡 | 4–0 | 🔴 | The scaffold creates a present-but-unfilled addendum state the round orchestrator's binary contract does not define. |
| F34 | Evans | 🟡 | 4–0 | 🔴 | FR-004's universal four-affordance MUST contradicts N5 (same family as F1/F18/F40/F51). |
| F35 | Evans | 🟡 | 4–0 | 🔴 | SC-003's one-navigation-choice criterion unmeetable; jump costs two selections (family of F2). |
| F36 | Evans | 🟡 | 4–0 | 🔴 | The two central invariants — sole-write and no-restatement — receive the weakest, partly manual checks. |
| F37 | Evans | 🟢 | 4–0 | 🟡 | Section-anchored cites and the template path escape C3's reach; section renames stay silent. |
| F38 | Evans | 🟢 | 4–0 | 🟡 | Seam work is exemplary: install deployment, 006 sequencing, failure honesty all protect the canon. |
| F39 | Evans | 🟢 | 4–0 | 🟡 | data-model's S2 cites drop research R2's install.sh pointer and omit a cite for the roster S2 teaches. |
| F40 | Richards | 🔴 | 4–0 | 🔴 | FR-004 mandates four affordances on every stage but the S1 contract substitutes the fast-exit — spec self-over-constrained. |
| F41 | Richards | 🟡 | 4–0 | 🔴 | SC-003's one-choice skip is unsatisfiable; three corpus locations each redefine it as two interactions. |
| F42 | Richards | 🟡 | 4–0 | 🔴 | Jump follow-up overflows the four-option budget at S5, where no next-stage slot exists to subtract. |
| F43 | Richards | 🟡 | 4–0 | 🔴 | C3 false-positives every run and cannot see a template rename — both failure directions reach the user. |
| F44 | Richards | 🟡 | 4–0 | 🔴 | Plugin-channel installs probe as not-installed and cannot source the template; one documented channel degrades. |
| F45 | Richards | 🟢 | 4–0 | 🟡 | Section-level citations (§addendum, §review surfaces) enforced only at file granularity. |
| F46 | Richards | 🟢 | 3–0 | 🟡 | No check asserts the installed-side template after install.sh runs; C5 verifies repo-side only. |
| F47 | Richards | 🟢 | 4–0 | 🟡 | Scaffold prefers the installed template copy over the repo source even inside this repo, inverting ownership. |
| F48 | Richards | 🟢 | 4–0 | 🟡 | Spec says orientation teaches "the two modes"; research and quickstart say three — drift inside the corpus. |
| F49 | Richards | 🟢 | 4–0 | 🟡 | The design's two riskiest claims — template-deployment gap and 006 sequencing — verify true at runtime. |
| F50 | Cooper | 🔴 | 3–1 | 🔴 | SC-003 promise vs two-interaction jump; the quickstart redefines the metric to pass (family of F2). |
| F51 | Cooper | 🔴 | 4–0 | 🔴 | S1 oversubscribed: four mandatory affordances + mandated fast-exit cannot fit four slots (family of F1). |
| F52 | Cooper | 🟡 | 4–0 | 🔴 | The resume promise dies with the conversation and the user is never told; artifacts disagree on scope. |
| F53 | Cooper | 🟡 | 4–0 | 🔴 | Scaffold consent left as a fork; write-consent may be folded into a navigation slot (family of F4). |
| F54 | Cooper | 🟡 | 4–0 | 🔴 | The feature's only write ships with the weakest verification: guards checked by grepping for guard words. |
| F55 | Cooper | 🟡 | 4–0 | 🔴 | Installed-skill probe recognizes one of two documented install routes (family of F6/F44). |
| F56 | Cooper | 🟡 | 4–0 | 🔴 | Broken canonical pointers surface to the newcomer mid-tutorial; no in-session cite-failure behavior specified. |
| F57 | Cooper | 🟡 | 4–0 | 🔴 | The cold-start surfaces newcomers hit first still teach a manual copy from the author's home directory. |
| F58 | Cooper | 🟡 | 3–1 | 🔴 | Outside a repo the scaffold offer is suppressed silently; the user never learns the affordance exists. |
| F59 | Cooper | 🟢 | 4–0 | 🟡 | Spec artifacts disagree whether orientation teaches "the two modes" or "three modes" (family of F9). |
| F60 | Cooper | 🟢 | 4–0 | 🟡 | The write-surface consent design is correct: closed list, fail-safe guards, effects visible at the call site. |
| F61 | Cooper | 🟢 | 4–0 | 🟡 | The in-repo dogfood walkthrough's scaffold decision is undefined; accepting leaves this repo a behavior-changing addendum. |

**Vote-pattern note (recorded honestly):** 49/61 findings drew 4–0 PRIORITIZE; under the
symmetric tally, convergent agreement escalates one level, which lifted 26 🟡→🔴 and
12 🟢→🟡. Discrimination did occur (F15 🔴→🟡, F23 🟡→🟢, F25 held), and the two
top defect families were independently authored by **5/5 lenses** — the escalations are
convergence, amplified by duplicate authorship of shared defects. Watch signal for the
primitive: convergence-escalation plus uncapped duplicate authoring compounds; flagged
for a future canon round, not patched mid-gate (I7).

### Cycle-1 verdict: **BLOCKED** — 38 gating 🔴 in 14 defect families

| Family | Findings | Defect | Resolution direction (spec-sourced) |
|---|---|---|---|
| A | F1 F18 F34 F40 F51 | S1 slot budget: FR-004's universal MUST + expert fast-exit cannot both fit 4 options | Fast-exit rides the **exit affordance** — S1's exit wrap-up IS the cheat-sheet; N5 substitution struck; FR-004 holds universally |
| B | F2 F19 F35 F41 F50 | SC-003 unit undefined; US2 test unsatisfiable; N2's fast-exit disjunct false | Define **one navigation action = one selection + its follow-up (≤2 interactions)**; restate SC-003/US2; delete N2's disjunct |
| C | F3 F52 | Resume scope undisclosed; SC-007 unconditional | Wrap-up disclosure (stage reached + scope + "any stage is one jump away"); qualify FR-010/SC-007/US2-sc3 to the conversation |
| D | F4 F53 | Scaffold consent placement fork; consent adjacent to navigation | Dedicated confirm question mandated; "exactly one" scoped to the navigation question; sub-step confirms sanctioned |
| E | F5 F21 | Install sub-step uncontracted; execute-vs-recite ambiguity | Install sub-step is **instruct-only** (never executes, never writes); SubStep entity defined |
| F | F6 F44 F55 | Detection knows one of two documented install channels | "Installed" = mode-is-running evidence; probes verify template availability across both channels; install sub-step cohort named |
| G | F7 F33 F61 (+F12) | Scaffold manufactures a present-but-unfilled addendum state the round's binary contract doesn't define; template preamble reads wrong post-copy | Scaffold writes an explicit `SCAFFOLDED — sections unfilled` marker; Phase-0 consumer behavior for that state defined in the registration edit; preamble made copy-safe; dogfood declines by default |
| H | F8 F17 F30 F43 F56 | C3 false-positives on the scaffold target, misses renames; no in-session cite-failure behavior | Structured per-step `Cites:` lines; C3 resolves those (not a bare regex), allowlists non-canon names; cite-failure clause mirroring scaffold failure-honesty |
| I | F16 | Frontmatter description (the real routing surface) unregistered | Registration includes the frontmatter trigger; C1 asserts it |
| J | F31 F32 (+F9 F29 F48 F59) | Mode-count registry staleness; "stage" homonym at first contact | "Three modes" reframe named as explicit edit surfaces + C1 staleness assert; tutorial units renamed **steps**, S3 disambiguates the four review stages |
| K | F24 F26 F36 F54 | Strongest invariants get weakest checks | C6 gains a mechanical write-idiom scan; C4 pins canon-table delimiters incl. quorum; new C7 four-path scaffold matrix |
| L | F42 (+F15 F20 F11) | Jump follow-up overflows at S5; second-deeper unspecified | Explicit S5 rule (no "back" slot; rides Other); post-deeper re-present rule (slot 2 → "recap this step") |
| M | F57 (+F13) | Cold-start surfaces still teach the manual copy | README step 1 + installer "Next:" lead with `chorus learn`; manual fallback cites installed template path |
| N | F58 | Outside-repo suppression is silent | S2 states why the offer is absent and how to enable it |

**Self-heal cycle 2 of 3 starting** (gateA-selfheal-1, in-progress): incorporation
cascade `/speckit-clarify` → `/speckit-plan`, then a fresh RSVP + primitive cycle.

---

## Gate A — design review (cycle 2) — 2026-06-10

**Corpus**: the cycle-1-revised artefacts (spec +14 clarifications/FR-014/SC-008,
plan/research R1–R10, contracts regen, quickstart C1–C7; commits `5e15677` → `33ccdcb`).

### RSVP (fresh, S2)

All nine JOINed again, each citing the **revisions** (fix-verification, not
performance): Evans 4 deltas / Richards 5 / Cooper 8 / Norman 5 / Uncle Bob 5 / Beck 4 /
D&O 6 (**red-potential** — pre-verified C6's grep is dead before seating) / Security 4 /
C&F 3.

**Seating: 🟢 (strict two-axis order at the cap)** — applies-count sort:
**Cooper (8), D&O (6), Richards (5), Norman (5), Uncle Bob (5)**; Evans/Beck/Security
(4) and C&F (3) out on a strict boundary — no tie, no 🟡 card needed. The panel rotated
on evidence: D&O in (release-path findings), Evans out (his cycle-1 families verified
by others' verdicts).

### Exploratory (incremental)

5 records updated (delta sections); 9 new gap-questions, **0 blocking** → recorded
assumptions again (rows 6/7).

### Family verdicts (the cycle-1 🔴 set, verified per lens against the revised corpus)

**12 of 14 families RESOLVED** — A, B, C, D, E, G, H, I, J, L, M, N each confirmed
unanimously by the seated lenses with `file:line`-cited notes. Residues:

- **Family F (partial)** — detection identity healed (R5), but the **delivery half is
  unbacked on the plugin channel**: `install.sh` never runs there, and
  `<skill-base>/templates/` does not exist in the plugin layout (plugin.json roots the
  skill at `skill/chorus-review/`; `templates/` lives at repo root).
- **Family K (partial)** — C4/C7 verified real (the quorum pin checked non-vacuous
  against installed canon), but **C6's write-idiom scan is empirically dead** for
  cp/tee/mkdir (`\|` in ERE = literal pipe; verified by three lenses with test lines).

### Findings register & tally (cycle 2 — new findings only; resolved cycle-1 findings not re-filed)

I8: **0 demoted**. Votes real, authors excluded (S8); severities post-tally.

| ID | Lens | Proposed | Votes P–O | Post | Summary |
|---|---|:--:|:--:|:--:|---|
| G1 | Cooper | 🟡 | 4–0 | 🔴 | The cite-failure recovery pointer is repo-relative, but the user who hits it has no repo. |
| G2 | Cooper | 🟡 | 4–0 | 🔴 | Check C5 ships a dead first line that installs into a discarded temp dir and asserts nothing. |
| G3 | Cooper | 🟢 | 4–0 | 🟡 | S5 presents two terminal verbs, Finish and Exit, with identical consequence — a fake choice. |
| G4 | Cooper | 🟢 | 4–0 | 🟡 | Same-conversation re-entry to a different step costs three interactions; SC-003's unit honestly excludes the resume question. |
| G5 | Cooper | 🟢 | 4–0 | 🟡 | The README's manual-fallback path is contract-unpinned; the author's home directory could survive implementation. |
| G6 | D&O | 🔴 | 4–0 | 🔴 | Plugin-channel template delivery is unbacked: install.sh never runs there; pick one of three named designs. |
| G7 | D&O | 🔴 | 3–1 | 🔴 | C6's write-idiom scan is mechanically dead for cp, tee, and mkdir; SC-008 would certify on a decorative gate. |
| G8 | D&O | 🟡 | 4–0 | 🔴 | C5's first half is vestigial dead code, and its repo-side grep false-positives on installer prose. |
| G9 | D&O | 🟡 | 3–1 | 🔴 | No artifact names who runs C1–C7 or when; an unowned check is decorative by default. |
| G10 | D&O | 🟢 | 4–0 | 🟡 | The additive-only installer leaves stale-present canon that R10's missing-doc clause cannot detect. |
| G11 | D&O | 🟢 | 4–0 | 🟡 | C1's frontmatter assertion pins a six-line sed window and false-negatives if frontmatter grows. |
| G12 | Richards | 🔴 | 4–0 | 🔴 | Scaffold's plugin-channel template path does not exist; the "both install channels work" claim is unsubstantiated. |
| G13 | Richards | 🟡 | 4–0 | 🔴 | C6's dead cp/tee/mkdir branches: the sole-write invariant's mechanical guard partly cannot fire. |
| G14 | Richards | 🟢 | 4–0 | 🟡 | C1's staleness grep misses SKILL.md:30 "Both modes run it", which goes ambiguous post-reframe. |
| G15 | Richards | 🟢 | 4–0 | 🟡 | C5 contains a half-finished draft: an undefined variable and a duplicate, leaked install run. |
| G16 | Richards | 🟢 | 4–0 | 🟡 | plugin.json packages 7 of 10 persona agents; 007's S1 probe makes that gap user-visible. |
| G17 | Richards | 🟢 | 4–0 | 🟡 | FR-014 names only the Phase-0 orchestrator; the per-advisor exploratory cache is a second addendum consumer. |
| G18 | Norman | 🟡 | 4–0 | 🔴 | The install remedy is single-channel while detection is dual-channel, mismatching the plugin user's mental model. |
| G19 | Norman | 🟡 | 4–0 | 🔴 | The S1 exit signifier is unpinned, so family A's fast-exit resolution is invisible before selection. |
| G20 | Norman | 🟢 | 4–0 | 🟡 | The S2 confirm-before-navigation ordering is pinned only by the non-normative walkthrough. |
| G21 | Norman | 🟢 | 4–0 | 🟡 | At S5 the jump follow-up's stay-here escape depends on knowing the tool's built-in Other. |
| G22 | Norman | 🟢 | 4–0 | 🟡 | Check C5's dead script lines blur which assertions in the new check layer are load-bearing. |
| G23 | Uncle Bob | 🔴 | 3–1 | 🔴 | C6's write-idiom regex can never match its cp, tee, or mkdir branches. |
| G24 | Uncle Bob | 🟡 | 4–0 | 🔴 | Walkthrough S5 shows "Recap this step" though no deeper pass happened at S5 (depth state is per-step). |
| G25 | Uncle Bob | 🟡 | 4–0 | 🔴 | C5's first stanza is dead code: undefined variable, redundant install, leaked tempdir. |
| G26 | Uncle Bob | 🟡 | 4–0 | 🔴 | C2 and C3 both pass vacuously if LEARN.md ships zero Cites: lines. |
| G27 | Uncle Bob | 🟢 | 4–0 | 🟡 | S5's advance label is uncontracted; the walkthrough invents "Finish". |

### Cycle-2 verdict: **BLOCKED** — 14 gating 🔴 in 6 clusters (all narrower than cycle 1's)

| Cluster | Findings | Defect | Resolution direction |
|---|---|---|---|
| F′ plugin delivery | G6 G12 G18 (+G16) | template + remedy text don't exist/branch on the plugin channel | resolution order `<skill-base>/templates/` → plugin root; templates + missing agents into plugin packaging (named edit surface); channel-branched instruct text; C5b plugin-side assertion |
| K′ C6 dead regex | G7 G13 G23 | `\|` in ERE is a literal pipe — cp/tee/mkdir branches can't fire | corrected alternation + a self-test of the scan against known-bad fixture lines |
| C5 dead draft | G2 G8 G25 (+G15 G22) | undefined `$CLAUDE_HOME_TMP_CHECK`, leaked tempdir, prose-matching grep | delete the dead stanza; tighten to `^cp .*templates`; keep the clean mktemp assertion |
| Check ownership | G9 | nobody named to run C1–C7 | bind: "C1–C7 execute at Gate C dogfood and before merge; results recorded in the gate ledger" |
| Runtime coordinates | G1 | cite-failure recovery pointer is repo-relative; the user who hits it has no repo | runtime pointers resolve via the running skill's base path (same rule as R6) |
| Rendering/normativity | G19 G24 G26 | S1 exit label doesn't signify the cheat-sheet; S5 walkthrough/contract drift; vacuous-pass C2/C3 | pin the S1 exit label + S5 "Finish → wrap-up" (declared convergence with Exit) in navigation.md; per-step depth state; Cites: cardinality assert |

**Self-heal cycle 3 of 3 starting** (gateA-selfheal-1, in-progress — **last cycle
before the S7 bound escalates to the operator**): incorporation cascade, then a fresh
RSVP + primitive cycle. Non-gating 🟡s (G3/G4/G5/G10/G11/G14/G16/G17/G20/G21/G27) are
folded into the same incorporation where one-line-cheap; G10 (stale-present installed
canon) is recorded as a future-round candidate, out of 007's scope.

---

## Gate A — design review (cycle 3, final self-heal) — 2026-06-10

**Corpus**: the cycle-2-revised artefacts (spec +10 clarifications/FR-015/SC-009,
plan/research R1–R12, contracts regen incl. navigation.md as the normative surface,
quickstart C1–C7+C5b with C6 fixture self-test; commits `57e5008` → `045f540`).

### RSVP (fresh, S2) — all 9 JOIN

Every lens JOINed citing the **cycle-3 fix deltas** (fix-verification, not performance):
the five whose own cycle-2 🔴s were under verification cited their authored findings
(D&O G6/G9, Richards G12–G17, Cooper G1–G5, Uncle Bob G23–G26, Norman G19/G20/G21);
Beck cited the check-suite overhaul (C6 fixture self-test, C3 cardinality), Security the
FR-015-widened plugin artefact set (resolution-order shadowing of the SCAFFOLDED trust
surface), C&F the heal-cycle scope growth (13→15 FRs, C1–C6→C1–C7+C5b on an unshipped
feature), Evans the "one resolution rule" Published-Language seam.

**Seating: 🟢 (strict two-axis order at the cap)** — applicability-count sort seats the
five fix-verifiers whose own reds are under test: **D&O, Richards, Cooper, Uncle Bob,
Norman** — which exactly covers all six cycle-2 clusters. Beck/Evans/Security/C&F out on
a strict boundary (they cite general deltas, not authored cycle-2 reds); their hooks are
recorded and available to vote-stage override. **Recorded runner-up concerns** (not
authored this cycle, available async): Security — resolution-order shadowing could let a
repo-local template displace the packaged one seeding an operator-trusted addendum;
C&F — three heal cycles on a feature that has served zero newcomers is correctness bought
before the learning loop is tested (🔴-potential on the *escalation* decision itself,
which is now live below).

### Exploratory (incremental; EXPLORATORY-PHASE.md)

5 seated records refreshed against the live corpus (4 incremental delta sections; C&F a
fresh build, first seating). Each lens **re-ran its own checks live** (re-grounding, not
replay): D&O + Uncle Bob executed the corrected C6 fixture block (fires 6/6; old `\|`
regex demonstrated dead 0/2 on cp/tee), Richards verified `plugin.json` is still 7/10
agents with no `templates` key (the expected pre-implementation state C5b is meant to
gate). Gap-questions: 5 raised across joiners, **0 blocking** (rows 6/7) → recorded
assumptions; interview deferred.

### Findings register & tally (cycle 3)

Author stage uncapped; I8 evidence gate: **0 demoted** (every finding cites `file:line`
or a tagged principle). Votes are real dispatches, each finding's author excluded (S8);
tally is the symmetric stage-4 rule; severity below is **post-tally**.

**Cluster A — the six cycle-2 🔴 clusters: all VERIFIED-HEALED.** Each original author
re-grounded against the revised corpus and confirmed closure with `file:line`: F′ plugin
*detection* + agent-set + channel-branched remedy (FR-015/SC-009/C5b agent-loop fires
live on 7/10), K′ C6 corrected + fixture-self-tested (6/6), C5 dead stanza deleted,
check ownership named (Gate C dogfood + pre-merge, quickstart.md:86), G1 runtime pointers
via base path, navigation.md normative (S1 exit label, S5 Finish convergence, per-step
depth, S2 ordering, S5 free-text disclosure). These are recorded 🟢 (heal-confirmations:
DNO-3/4/5, RICH-1–6, COOP-2/3, BOB-1/2/3/6/8, NORM-1/2/3/4/6) and do not re-gate.

**Cluster B — six NEW gating 🔴 the heal introduced/left** (mostly: the conformance
checks do not assert what they claim):

| ID | Lens | Proposed | Votes P–O–A | Post | Summary |
|---|---|:--:|:--:|:--:|---|
| DNO-1 | D&O | 🔴 | 4–0–0 | 🔴 | C5b greps `"templates` in plugin.json, but the plugin schema defines no such asset key — the headline plugin-delivery gate is inert. |
| DNO-2 | D&O | 🟡 | 2–0–2 | 🔴 | R11 hedges "or the packaging mechanism demonstrably carries it" — the plugin-delivery mechanism is named nowhere (root of DNO-1). |
| COOP-1 | Cooper | 🟡 | 2–0–2 | 🔴 | Cite-failure recovery sends the newcomer to read the raw canon SC-001 promised they'd never need — no "install broken, not your fault" framing. |
| BOB-4 | Uncle Bob | 🟡 | 4–0–0 | 🔴 | C3 asserts TOTAL `Cites:` ≥5, not ≥1 PER step (FR-008/data-model.md:21) — clustered cites pass while a step ships uncited. |
| BOB-7 | Uncle Bob | 🟡 | 2–0–2 | 🔴 | C6's fixture self-test proves green-on-presence but never asserts RED-on-absence outside the S2 accept branch — SC-008's real claim stays human-inspected. |
| NORM-5 | Norman | 🔴 | 4–0–0 | 🔴 | navigation.md is normative for nav labels but no check C1–C7+C5b binds LEARN.md to them — the normative contract is unenforced against its artifact. |

Non-gating this cycle: **RICH-7** 🟡 (held, 2–1–1 — failure/detection clauses paraphrase
the 3-tier resolution order down to tier-2 only; DRY/restatement, fold with a
no-restatement assert); **BOB-5** 🟢 (demoted 1–3 — same defect as BOB-4 from the other
direction; merge).

**Vote-pattern note (honest):** convergence again — DNO-1, BOB-4, NORM-5 drew 4–0; the
three 🟡→🔴 escalations (DNO-2/COOP-1/BOB-7) each rode a clean +2 with two abstentions,
the abstainers ceding to the owning lens's authority (architecture/UX/test-rigor) rather
than dissenting. No OVER-RATE on any gating finding. BOB-5's 1–3 demotion shows the panel
discriminated (it folded a duplicate rather than rubber-stamping). Five of six 🔴s are
about **check rigor** — the same defect class as cycle-1 family K and cycle-2 K′
(strongest invariants, weakest checks), now one level deeper: the checks added to fix K
are themselves decorative. Three (DNO-1, BOB-4, NORM-5) trace partly to **this
orchestrator's own incorporation** (C5b's non-schema grep, C3's total-vs-per-step
contradiction against data-model.md:21, the un-checked normative labels) — recorded as an
incorporation-quality watch signal (I7), not patched mid-gate.

### Cycle-3 verdict: **BLOCKED — 6 gating 🔴 in 3 clusters** (narrower again than cycle 2's 6)

| Cluster | Findings | Defect | Resolution direction (spec-sourced, for a 4th cycle if authorized) |
|---|---|---|---|
| α plugin delivery still hollow | DNO-1 DNO-2 | C5b checks a non-schema manifest key; the actual plugin→`templates/` delivery mechanism is unnamed | name the real plugin packaging/delivery mechanism in R11; C5b asserts the template's *delivered presence* under the plugin root post-install, not a manifest substring |
| β checks don't assert their invariant | BOB-4 BOB-7 NORM-5 | C3 asserts a total not a per-step floor; C6 self-test is one-directional; no check binds LEARN.md to navigation.md's normative labels | C3 iterates per step heading (collapses BOB-4/5/6/8); C6 adds a negative fixture (idiom outside accept branch ⇒ RED); new C8 greps LEARN.md for each pinned nav label |
| γ cite-failure UX | COOP-1 | the broken-install recovery re-imposes SC-001's abolished cost and reads as the user's fault | the cite-failure clause adds "your installation is incomplete — not an error you caused" framing before pointing to canon |

**S7 BOUND REACHED — escalating to the operator (gateA-escalation-1, 🔴).** Three
self-heal cycles have run (catalog row 5; D2: 🔴 never auto-proceeds, no auto-default).
Convergence is monotonic — 38 → 14 → 6 gating 🔴, clusters narrowing each cycle (14
families → 6 clusters → 3 clusters) — and every cycle's 🔴s genuinely closed; but the
gate has not reached zero, and the loop bound forbids a self-authorized 4th cycle. The
operator decides; options framed in the response. C&F's runner-up concern is now live: a
4th correctness cycle on a feature that has served **zero** newcomers is itself a
cost-of-delay bet against the learning loop the feature exists to shorten.
