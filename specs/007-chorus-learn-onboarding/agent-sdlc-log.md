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
| gateA-selfheal-1 | Gating 🔴 set after cycle-1 tally (38 findings) | 🟡 | catalog row 5: `cycle 1 < 3` → auto-run incorporation cascade (`/speckit-clarify` → `/speckit-plan`) + re-run gate; **resolution: in-progress** — cycle 1 verdict BLOCKED, cycle 2 of 3 starting | spec-sourced incorporation of the 14 defect families below, then fresh RSVP + primitive cycle | escalate to operator now (rejected: row 5 declares the 🟡 default while cycle < 3) | say "stop the self-heal" to escalate immediately; cost = the gate halts open and Gate A waits on an operator session |

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
