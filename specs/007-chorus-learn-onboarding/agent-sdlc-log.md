# Agent-SDLC ledger — feature 007 `chorus learn`

Audit trail for the gated lifecycle of `specs/007-chorus-learn-onboarding`. Schema:
`specs/003-agent-sdlc-workflow/contracts/sdlc-ledger.md`; decision records:
`DECISION-PRIMITIVE.md`.

---

## Gate A — design review (2026-06-12) — **CLEAR**

**Corpus**: `specs/007-chorus-learn-onboarding/{spec,plan,research,data-model,quickstart}.md`
+ `contracts/{learn-mode,navigation,scaffold}.md`, with the touched surfaces
(`skill/chorus-review/SKILL.md`, `install.sh`, `plugin.json`,
`templates/CHORUS-PROJECT.template.md`, `README.md`, `agents/`). No project addendum
exists (`docs/reviews/CHORUS-PROJECT.md` absent — recorded honestly; project-wide
facts come from the spec or the operator interview).

### RSVP (self-declared relevance 0–3; all replies are real dispatches)

| Lens | Decision | Rel. | One-line |
|---|---|---:|---|
| Cooper | JOIN | 3 | tutorial is interaction design end-to-end; my gate question is the spec's subject |
| Norman | JOIN | 3 | pure HCD surface: navigation contract, feedback, resume disclosure |
| Beck | JOIN | 3 | the contracts + C1–C7+C5b are this feature's only test surface |
| Goldratt | JOIN | 3 | cut seat; FR batch vs zero newcomers served — scope/defer terrain |
| Evans | JOIN | 2 | registration + three seam contracts are Published-Language surfaces |
| Richards | JOIN | 2 | coupling and conformance direction |
| Uncle Bob | JOIN | 2 | boundary/contract questions; structural conformance checks |
| D&Ops | JOIN | 2 | release-path surface (install.sh / plugin channel) |
| Security | JOIN | 1 | thin but real: sole-write invariant + consent gate |
| Guido | ABSTAIN | 0 | no Python in scope |

### Seating — DecisionRecord `gateA-seating`

- J = 9 → top 5 by mechanical relevance sort. Four seats at relevance 3 (Cooper,
  Norman, Beck, Goldratt — mandate guardrail satisfied: the scope/deferral lens is
  not out-seated on a new buildout, S3). **Tie at the 5th seat** (Evans / Richards /
  Uncle Bob / D&Ops, all 2) → **surfaced to the operator** (S3 / I9); operator seated
  **Evans**.
- band: 🟢 mechanical sort + 🔴 operator tie-break (owner: operator; recorded).

### Exploratory phase + operator interview (gates first — S10)

Each seated lens named its `[gate]` info-needs before authoring. Two held the gate
open until the operator answered (S10 fired pre-authoring — no inference past an
unmet gate):

| # | Question (owner lens) | Operator answer | Effect |
|---|---|---|---|
| 1 | Audience + count (Cooper gate) | **External/public** via README/plugin; cold-start framing and FR-015/C5b delivery scope correctly priced | Cooper + Goldratt grade at the external-newcomer bar |
| 2 | Core Domain (Evans gate) | **Canon = Core** (tutorial Supporting, deployment Generic) | Evans' modeling-effort pricing anchored |
| 3 | Navigation-contract enforcement (Beck) | **Dogfood-only is intended** — no mechanical nav check | nav conformance rests on the Gate C walkthrough by design |

Open gaps carried with stated defaults (degradation note): Goldratt — cost-of-delay
unpriced (no deadline/inflow named), priced conditionally; Evans — template-staleness
authority (default: installed copy operative); PR #5 merge horizon unstated (R8
serializes 007 behind it) → recorded open operator item in `plan.md`.

### Author + vote + tally

Stage 1: 33 extract records (one Explore agent; one record orchestrator-corrected
against the live `agents/` listing — the 2026-06-12 goldratt rename). Stage 2: **25
findings** (4 🔴 / 14 🟡 / 7 🟢-accepts filed as findings) + 35 recorded accepts.
Stage 3: real votes, 4 non-author voters per finding (S8), several re-verified against
the live repo before voting. I8 evidence gate: **0 demoted**. Stage 4 (symmetric tally,
arithmetic only — S9):

| ID | summary (short) | prop | P | O | A | net | post | gating |
|---|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| COOP-1 | contract names renamed-away agent file | 🔴 | 4 | 0 | 0 | +4 | 🔴 | ✅ |
| COOP-2 | C5b blind to phantom plugin.json entries | 🟡 | 4 | 0 | 0 | +4 | 🔴↑ | ✅ |
| COOP-3 | claimed C5b description assert doesn't exist | 🟡 | 4 | 0 | 0 | +4 | 🔴↑ | ✅ |
| COOP-4 | nav labels lack mechanical floor [challenges recorded decision] | 🟡 | 0 | 4 | 0 | −4 | 🟢↓ | — |
| COOP-5 | FR-013 third staleness surface unchecked | 🟡 | 4 | 0 | 0 | +4 | 🔴↑ | ✅ |
| COOP-6 | C3 granularity recorded accept | 🟢 | 4 | 0 | 0 | +4 | 🟡↑ | — |
| NORM-1 | S2 cites install.sh — unresolvable on either install channel | 🔴 | 4 | 0 | 0 | +4 | 🔴 | ✅ |
| NORM-2 | stale roster enumeration teaches a dead name | 🟡 | 4 | 0 | 0 | +4 | 🔴↑ | ✅ |
| NORM-3 | nav labels unasserted [challenges recorded decision] | 🟡 | 0 | 4 | 0 | −4 | 🟢↓ | — |
| NORM-4 | cite-failure honesty (accept) | 🟢 | 4 | 0 | 0 | +4 | 🟡↑ | — |
| NORM-5 | reds resolved (accept) | 🟢 | 3 | 0 | 1 | +3 | 🟡↑ | — |
| NORM-6 | accepts landed (accept) | 🟢 | 4 | 0 | 0 | +4 | 🟡↑ | — |
| BECK-1 | C5b one-directional | 🔴 | 3 | 1 | 0 | +2 | 🔴 | ✅ |
| BECK-2 | per-step cite cardinality unasserted (C3 global floor) | 🟡 | 3 | 1 | 0 | +2 | 🔴↑ | ✅ |
| BECK-3 | failure-signal polarity inconsistent across suite | 🟡 | 3 | 1 | 0 | +2 | 🔴↑ | ✅ |
| BECK-4 | C6 locality eyeball-judged | 🟡 | 2 | 1 | 1 | +1 | 🟡 | — |
| BECK-5 | roster restated by name — cite-not-restate self-violation | 🟡 | 4 | 0 | 0 | +4 | 🔴↑ | ✅ |
| BECK-6 | dogfood residue recorded (accept) | 🟢 | 4 | 0 | 0 | +4 | 🟡↑ | — |
| GOLD-1 | PR #5 merge horizon unnamed | 🟡 | 1 | 1 | 2 | 0 | 🟡 | — |
| GOLD-2 | verdict-closer unnamed; SCs satisfiable by self-dogfood | 🟡 | 4 | 0 | 0 | +4 | 🔴↑ | ✅ |
| GOLD-3 | dead path ships if implemented as written | 🟡 | 4 | 0 | 0 | +4 | 🔴↑ | ✅ |
| GOLD-4 | cost of delay unpriced [principle-only] | 🟡 | 0 | 2 | 2 | −2 | 🟢↓ | — |
| GOLD-5 | implement is the constraint-shortening move (accept) | 🟢 | 2 | 0 | 2 | +2 | 🟡↑ | — |
| EVAN-1 | named edit surface enumerates nonexistent file | 🔴 | 4 | 0 | 0 | +4 | 🔴 | ✅ |
| EVAN-2 | C5b blind to phantom entries | 🟡 | 4 | 0 | 0 | +4 | 🔴↑ | ✅ |
| EVAN-3 | C1 "ANY phrasing" claim vs two-literal scan | 🟡 | 3 | 1 | 0 | +2 | 🔴↑ | ✅ |
| EVAN-4 | template staleness accepted w/ version-line mitigation | 🟢 | 4 | 0 | 0 | +4 | 🟡↑ | — |

**Verdict at author/vote/tally: 15 gating 🔴 in 5 clusters** (all spec/check-text
edits; no architectural rework):

| Cluster | Findings | Fix direction (spec-sourced) |
|---|---|---|
| A stale roster name | COOP-1 NORM-2 BECK-5 GOLD-3 EVAN-1 | refresh the 3 stale lines (research.md, plan.md, learn-mode.md) AND declare `agents/` the authoritative roster — enumerations derived, never restated |
| B C5b gaps | COOP-2 BECK-1 EVAN-2 COOP-3 | add the reverse direction (every plugin.json agent path resolves) + the description grep the contract already claims |
| C claim-vs-check | COOP-5 EVAN-3 BECK-2 BECK-3 | C1 gains the spec-refs surface and an honest phrasing-family scope; C3 asserts per-step cardinality; every stanza emits an explicit FAIL token |
| D S2 cite | NORM-1 | make the S2 `install.sh` cite channel-resolvable — the plugin newcomer must not cite-fail on a healthy install |
| E validation loop | GOLD-2 | add a ledger-recorded first-external-newcomer SC (the verdict-closer) |

Working-as-designed notes: the two challenges to the recorded dogfood-only decision
(COOP-4, NORM-3) were demoted 4-0 to 🟢 — the vote defended the operator's recorded
decision rather than re-arming it. GOLD-4 (principle-only, no corpus evidence)
demoted. S10 fired pre-authoring (two gates held the gate until the operator answered).

### Incorporation — DecisionRecord `gateA-incorporate` (band 🟡)

Clusters A–E resolved by revising the **spec** and regenerating downstream artefacts
via `/speckit-clarify` → `/speckit-plan` (S5 — no downstream hand-patch). Commits:

- `a7b53af` — 5 gate-sourced clarifications into spec 007 (FR-008/013/015 revised,
  SC-008/009 revised, SC-010 added).
- `b934dd6` — plan/research/data-model/quickstart/contracts regenerated from the
  revised spec.

Cluster outcomes: **A** `agents/` directory authoritative, no filename enumeration in
any artefact. **B** C5b bidirectional (every `agents/*.md` packaged AND every packaged
path resolves) + description grep. **C** C1 three surfaces + stated phrasing family +
spec normative-text scan; C3 per-step cardinality (awk); explicit FAIL tokens
suite-wide. **D** FR-008 revised, S2 `install.sh` cite annotated file-path-channel-only
in data-model. **E** SC-010 — a real external-newcomer session recorded in this ledger
within 30 days of merge. Non-gating folds: C6 mechanical locality (pinned `#### On
accept` heading); PR #5 merge horizon recorded as an open operator item in `plan.md`.

### Verification (post-incorporation re-grounding)

The seated scope/deferral lens (Goldratt) re-grounded against the regenerated corpus
and confirmed each cluster **resolved-by-reference** with `file:line`; the remaining
clusters' fixes are carried by the commits above:

| Cluster | Resolved | Evidence |
|---|:-:|---|
| A roster | ✅ | spec.md:441 (`agents/` authoritative, no restatement); contracts/learn-mode.md:18; research.md R11 |
| B C5b | ✅ | spec.md:444 (both directions); quickstart.md:174 |
| C claim-check parity | ✅ | spec.md:166-170 (explicit FAIL token per stanza); spec.md:393-395 (per-step cite cardinality); quickstart.md:155 |
| D cite channel | ✅ | spec.md:396 + spec.md:175-179; quickstart.md:142 |
| E verdict-closer | ✅ | spec.md:513-517 (SC-010: 30 days post-merge, one real external newcomer, channel + outcome in this ledger) |

The verification priced the incorporation as **holding the line**: zero new FRs, the
sole addition is the verdict-closer SC-010 (GOLD-7 🟢). One non-gating residue carried:

- **GOLD-6 🟡** — SC-010's day-30 expiry names no reader and no decision; the
  ledger-says-open clause prevents a silent *record*, not silent *inaction*. One-sentence
  post-merge fix (a named reader logs continue/extend/retire at day 30); **not** a design
  change, does **not** block Gate A.

### Gate A verdict: **CLEAR** (no open 🔴; one 🟡 carried)

All gating 🔴 resolved in the spec and verified resolved-by-reference; GOLD-6 🟡 and
GOLD-1 🟡 are non-gating and recorded for the operator. Gate A does not block (S4).

### S1–S10 self-audit

| # | Invariant | Pass | Evidence |
|---|---|:-:|---|
| S1 | orchestrator authored no artefact | ✅ | every spec/plan change traces to `a7b53af`/`b934dd6` via speckit runners |
| S2 | RSVP fired this gate | ✅ | RSVP table above (9 replies, real dispatches) |
| S3 | cap-5; tie surfaced to operator; scope lens not out-seated | ✅ | `gateA-seating` (Evans seated by operator; Goldratt seated under the mandate guardrail) |
| S4 | no 🔴 passed silently; none waived | ✅ | 15 gating 🔴 all resolved in-spec; verdict CLEAR |
| S5 | incorporation via speckit; no hand-patch | ✅ | `gateA-incorporate` (clarify → plan; commits) |
| S6 / I8 | every counted finding cites file:line or a principle tag | ✅ | I8 gate: 0 demoted |
| S7 | within loop bound | ✅ | single incorporation + verification; no escalation |
| S8 | author excluded from own finding's vote | ✅ | tally: 4 non-author voters per finding |
| S9 | severity is tally arithmetic, not synthesis | ✅ | post column = symmetric net rule, verbatim |
| S10 | gates named; unmet gates prompted, never inferred | ✅ | interview Q1/Q2 held Cooper + Evans gates until operator answered |
| I9 | every decision routed to a named owner | ✅ | seating tie → operator; verdict-closer → operator interview; severity → tally |

**Watch signal (recorded, not patched mid-gate — I7):** under the symmetric tally a
convergent agreement vote and an escalation vote are indistinguishable (PRIORITIZE =
"at least as severe as proposed"), so unanimous agreement lifts 🟡→🔴 and the 🟢-accepts
to 🟡 even when vote notes read as endorsements. Candidate canon fix for a future
round: a third vote value (CONFIRM = severity is right), or escalation requiring an
explicit "under-rated" claim. Successor to issue #6.

### Next-gate baseline (Gate B — plan/tasks)

Assume closed: clusters A–E (roster derivation, C5b bidirectional, claim-check parity +
FAIL tokens, channel-resolvable cites, SC-010). Re-evaluate at Gate B: GOLD-6 (SC-010
day-30 owner), GOLD-1 (PR #5 merge horizon), and whether `/speckit-tasks` preserves the
per-step C3 cardinality and the bidirectional C5b in the task breakdown.

---

## Gate B — plan/tasks review (cycle 1) — 2026-06-12 — **BLOCKED (5 🔴 in 2 clusters)**

**Corpus**: `tasks.md` (28 tasks, generated by `/speckit-tasks` — commit `f9c0f74`),
`plan.md`, `quickstart.md` (the C1–C7+C5b checks the tasks invoke), `contracts/`.

### RSVP (fresh, S2 — relevance 0–3)

| Lens | Decision | Rel. | One-line |
|---|---|---:|---|
| Richards | JOIN | 3 | sequencing, dependency-correctness, Gate A resolutions-as-tasks |
| Beck | JOIN | 3 | whether the SC-008 checks actually gate the work they verify |
| D&Ops | JOIN | 3 | release path (T018/T019) + suite-as-delivery-gate |
| Uncle Bob | JOIN | 3 | task single-responsibility, [P]/dependency correctness |
| Goldratt | JOIN | 3 | cut seat; MVP-first sequencing vs the first-newcomer constraint |
| Evans | JOIN | 3 | Published Language surviving into tasks (no restatement drift) |
| Security | JOIN | 3 | consent gate + SCAFFOLDED-marker trust surviving decomposition |
| Cooper | JOIN | 2 | tasks-list review is mostly Beck/Richards turf; gate question closed at A |
| Norman | ABSTAIN | 1 | HCD surface settled at Gate A; a Gate C catch, not a JOIN here |

### Seating — DecisionRecord `gateB-seating-1`

- J = 8 → cap 5. Goldratt auto-seated (mandate guardrail — cut seat, new buildout).
  Six lenses tied at relevance 3 for the remaining 4 seats → **tie spanning the cap,
  surfaced to the operator (S3/I9)**.
- Operator chose **"Swap Bob → Evans"**: panel = **Beck, Richards, D&Ops, Evans,
  Goldratt** (prioritizing Published-Language/cite-not-restate fidelity in the task plan;
  Uncle Bob + Security + Cooper to runner-up). band: 🟢 mechanical + 🔴 operator tie-break.

### Exploratory + author + vote + tally

Project base reused from Gate A; delta = `tasks.md` + the regenerated `quickstart.md`.
Several lenses **executed check stanzas empirically** (D&Ops ran the suite against the
current tree; Richards verified the plugin.json 7-vs-10 agent gap and install.sh
double-edit; Beck traced check placement). I8: 0 demoted. Votes real, author-excluded
(S8); tally is the symmetric stage-4 rule (S9). See the tally table in the gate response.

### Cycle-1 verdict: **BLOCKED — 5 gating 🔴 in 2 clusters**

| Cluster | Findings | Defect | Resolution direction |
|---|---|---|---|
| α red-baseline / FAIL-token integrity | BECK-1, DNO-1, DNO-2, DNO-5 | C2 and C5 (and C2/C3 against an absent `LEARN.md`) emit **no `FAIL:` token** — they print on success / error to stderr, violating the suite's own SC-008 rule (`quickstart.md:5`). T002's red baseline is unmeetable; an operator grepping `FAIL:` sees clean while the checks are silently inconclusive. **Root: Gate A cluster C's "FAIL tokens suite-wide" was not applied to C2/C5** (incorporation-quality miss — the watch signal made live). | bring C2/C5 into SC-008 compliance: every stanza emits `FAIL:` on failure incl. absent-file guards (`test -f LEARN.md \|\| echo FAIL:`); T002 asserts expected-absent paths by name (DNO-5); align C2's stated "followed by Cites + nav block" claim with what it scans (BECK-3 fold) |
| β [P] marker race | RICH-1 | T009 and T018 both carry `[P]` yet both edit `install.sh`; the prose caveat (`tasks.md:158`) names the collision but the machine-readable marker contradicts it — two parallel agents would race on one file | drop `[P]` from T018 (or T009) so the marker matches the dependency caveat |

**Non-gating 🟡 (recorded; fold where cheap):** BECK-2 (T020 Phase-0 consumer note has
no check, absent from T026 dogfood scope → add to T026 checklist); BECK-3 (C2
under-verifies its stated claim → folded into α); RICH-2 (T001 records the PR #5 merge
horizon but gates nothing — C3's `test -e` would FAIL on `DECISION-PRIMITIVE.md` if 007
implements before PR #5 merges; ordering-protected by "007 lands after 006" but
un-enforced → operator item); EVAN-1 (F22 cross-reference — the template as single
source of structure for both the S2 scaffold AND the Phase-5 end-of-round offer — lands
in no task/check → add an anchoring task); GOLD-1 (split T026 for an early US1+US2
walkthrough — Evans OVER-RATEd, challenging the premise that T026 is scoped US3+US4;
held 🟡).

**Working-as-designed notes:** EVAN-1 drew 4 abstentions — every non-author voter ceded
to Evans' domain-model authority rather than rubber-stamping (honest S8). GOLD-1's
OVER-RATE (Evans) shows discrimination. **Tally-wart recurrence (I7, recorded not
patched):** DNO-5 escalated 🟡→🔴 on a 4–0 PRIORITIZE though two voters' notes read
"correctly rated 🟡" — the same convergence-agreement-vs-escalation ambiguity flagged at
Gate A; DNO-5 is the ordering instance of cluster α and folds into the same fix, so the
escalation changes no resolution.

**DecisionRecord `gateB-redloop-1`** · band 🟡 (catalog row 5, cycle 1 < 3). The gating
clusters are **artifact-compliance defects against an already-correct spec** (SC-008
already mandates suite-wide `FAIL:` tokens; the `[P]` collision is a tasks-artifact
defect) — not a spec gap. Incorporation owner: operator (per I9, incorporation depth is
operator-owned; the user has steered away from full re-run cycles). Options framed in
the gate response.

### Incorporation + re-verify (lean) — **Gate B CLEAR**

**Operator selected: lean fix + targeted re-verify** (not the full spec→regen→re-run
cascade — the gating clusters are artifact-compliance against an already-correct spec, so
converging the artifacts toward the spec is not the spec↔artifact drift S5 guards against;
recorded as a deliberate, operator-authorized departure from canonical regen).

Cluster α (`quickstart.md`): C2 rewritten to guard absent `LEARN.md` with a `FAIL:` token
and assert exactly 5 step headings (claim scoped to what it scans — BECK-3); C3 gains the
same absent-file guard + `2>/dev/null` on its `LEARN.md` reads; C5 rewritten to emit
explicit `FAIL:` on every failure (repo template, deploy idiom, installed-side) — no more
success-only/silent polarity, and the deploy-idiom grep now names the missing idiom so the
baseline distinguishes not-yet-built from check-broken (DNO-5).

Cluster β (`tasks.md`): `[P]` dropped from T018 (shares `install.sh` with T009); the US3
parallel example and dependency note corrected (RICH-1).

Folded 🟡: BECK-2 (T020 Phase-0 consumer note added to T026's dogfood checklist).

**Targeted re-verify (empirical, 2026-06-12):** ran the patched C2/C3/C5 stanzas against
the current pre-implementation tree (`LEARN.md` absent, deploy idiom not yet in
`install.sh`). All three now emit explicit `FAIL:` tokens — `FAIL: LEARN.md missing`,
`FAIL: expected 5 step headings`, `FAIL: only 0 Cites: lines`,
`FAIL: install.sh missing the templates deploy idiom` — with **no leaked stderr**. The red
baseline goes red as designed. The five gating 🔴 (BECK-1, RICH-1, DNO-1, DNO-2, DNO-5) are
resolved.

**Carried 🟡 (non-gating, operator items / Gate C):** RICH-2 (PR #5 merge horizon gates
nothing mechanically — ordering-protected by "007 lands after 006" but un-enforced; revisit
when the horizon is known, with GOLD-1/GOLD-6); EVAN-1 (F22 — anchor the Phase-5
end-of-round offer to the template as the single source of structure; candidate task for
implementation); GOLD-1 (optional: split T026 for an early US1+US2 walkthrough — Evans
challenged the premise; operator's call).

### Gate B verdict: **CLEAR** (5 🔴 resolved + re-verified; 3 🟡 carried, non-gating)

### S1–S9 self-audit (Gate B)

| # | Invariant | Pass | Evidence |
|---|---|:-:|---|
| S1 | orchestrator authored no spec; tasks via `/speckit-tasks` | ✅ | `tasks.md` from the phase-runner (commit `f9c0f74`); fixes are artifact-compliance edits, operator-authorized |
| S2 | RSVP fired fresh at this gate | ✅ | Gate B RSVP table (8 replies, real dispatches) |
| S3 | cap-5; tie surfaced to operator; Goldratt not out-seated | ✅ | `gateB-seating-1` (operator swap Bob→Evans; Goldratt mandate-seated) |
| S4 | no 🔴 passed silently; all resolved | ✅ | 5 gating 🔴 fixed + empirically re-verified; none waived |
| S5 | incorporation converges artifacts toward the (correct) spec | ✅ | lean fix authorized by operator; recorded as a deliberate departure from canonical regen, not a hand-patch hiding spec drift |
| S6 / I8 | every counted finding cites file:line | ✅ | 0 demoted; findings cite `tasks.md`/`quickstart.md` lines |
| S7 | within loop bound | ✅ | cycle 1 + targeted re-verify; no escalation |
| S8 | author excluded from own finding's vote | ✅ | tally: 4 non-author voters per finding |
| S9 | severity is tally arithmetic | ✅ | post column = symmetric net rule, verbatim |

### Next-gate baseline (Gate C — implementation)

`/speckit-implement` authors `LEARN.md` + the edit-surface changes per `tasks.md`. Gate C
reviews the code's own soundness + the `spec-walkthrough` headless reconciliation, and runs
the **full** C1–C7+C5b suite (now FAIL-token-clean) as the SC-008 dogfood. Watch at Gate C:
RICH-2 (PR #5 horizon before the cite-checks can pass — `DECISION-PRIMITIVE.md` must be
present), EVAN-1 (F22 single-source), and the per-step C3 / bidirectional C5b actually
passing against the authored `LEARN.md`/`plugin.json`.

---

## Implementation (`/speckit-implement`) — 2026-06-12

**Precondition cleared:** the branch was rebased onto `origin/main`, pulling in **PR #5
(feature 006)** — `DECISION-PRIMITIVE.md` is now present, so RICH-2/GOLD-1 are resolved
(`plan.md` updated). All 28 tasks executed (`tasks.md` marked `[X]`).

**Authored:** `skill/chorus-review/LEARN.md` (new — the canonical mode definition: 5
steps, navigation per `contracts/navigation.md`, the S1 instruct-only install sub-step,
the S2 opt-in scaffold under the pinned `#### On accept` heading, per-step channel-
resolvable `Cites:`, the FR-011 wrap-up / S1 cheat-sheet). **Edited:** `SKILL.md`
(frontmatter trigger + three-mode reframe + FR-014 Phase-0 note, both consumers),
`README.md` (three modes; quick-start leads with `chorus learn`; installed-template-path
fallback, no author-machine literal), `install.sh` (deploys `templates/`; "Next:" leads
with `chorus learn`), `plugin.json` (packages `templates/` + all 10 `agents/*.md`,
refreshed description), `templates/CHORUS-PROJECT.template.md` (copy-safe preamble),
`spec.md` (GOLD-6: SC-010 day-30 owner named).

**Conformance suite (the SC-008 dogfood, run from repo root):** C1–C6 + C5b all pass —
**0 `FAIL:` tokens**. C1 again caught two live staleness items ("Both modes run it" /
"Both modes reference it" in `SKILL.md`) — fixed to "Both review modes". C5 installed-side
verified (template deploys under a temp `CLAUDE_HOME`). C5b both directions green (10/10
agents packaged, no phantom entries, no stale count in the description). C6 fixture
self-test fires 6/6 and no write idiom appears outside the `#### On accept` branch. C2/C3
green against the authored `LEARN.md` (5 steps, ≥1 `Cites:` per step, all pointers resolve
incl. `DECISION-PRIMITIVE.md`). C4 finds no restated canon block. C7's four paths
(accept/decline/existing/outside-repo) are defined in `LEARN.md` S2 and exercised at the
live dogfood.

**Carried obligation — SC-010 (T027, post-merge):** within **30 days of merge**, one real
external-newcomer `chorus learn` session must be recorded here (install channel + outcome).
**Until that row exists, this loop is OPEN.** At day 30 without it, the operator records a
ledger entry deciding continue / extend / retire (GOLD-6, now in SC-010). _[awaiting first
external newcomer — no row yet]_

**Ready for Gate C** (implementation review): reviews `LEARN.md` + the edit surfaces for
their own soundness, ingests the `spec-walkthrough` headless reconciliation, and treats
the now-green suite as the dogfood.
