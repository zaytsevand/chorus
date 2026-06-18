# Agent-SDLC Ledger — Feature 013 (premise-challenge)

Audit trail for the chorus SDLC gates on this feature. Mechanic: `GATE-PRIMITIVE.md` (extract → author → vote → tally); lifecycle: `SDLC-LAYER.md`; decisions banded by `DECISION-PRIMITIVE.md`.

> **Meta-note.** This feature *adds* a premise-challenge phase because Gate A is observed to develop within the input frame rather than challenge the premise. Running Gate A on this very feature is therefore a live test of its own thesis — recorded honestly below.

---

## Gate A — Design review (spec.md) — 2026-06-18

**Corpus:** `specs/013-premise-challenge/spec.md`. No `plan.md` yet (Gate A reviews the design as the spec, per project practice).

**Scope decision (DECISION-PRIMITIVE row 10 — addendum absent → 🟡):** recorded default: corpus = spec.md + the canon docs it modifies (`SDLC-LAYER.md`, `SKILL.md`, `GATE-PRIMITIVE.md`, `DECISION-PRIMITIVE.md`); markdown methodology repo, no code exclusions. Override: operator may restate scope; re-run.

### Roster (this round) — RSVP

Round-context delta: feature 013 adds a `/chorus:challenge` **mode** + an SDLC **starting phase** that adversarially attacks a spec's *premise* before Gate A (verdict `sound`/`reframe`/`reject`, operator-owned). Motivation: stats show the chorus develops ~69% within-frame; divergence is a ~17% tail; AI-review is circular unless it diverges from input (§4d). Reuses the gate primitive + decision bands; additive; markdown-only.

| Lens | RSVP | Stakes | Note |
|------|------|:--:|------|
| Goldratt · scope/defer | JOIN | 🟢 | premise affirmed; rejects "just re-brief" at RSVP (later reverses on authoring) — mandate-seat |
| Security-and-Trust | JOIN | 🟡 | challenger shares the author's training distribution — circularity may reappear inside it |
| Richards · architecture | JOIN | 🟡 | 4-level→3-band verdict mapping deferred; scope-filter composes |
| Delivery-and-Ops | JOIN | 🟡 | mandatory phase per feature for a 17% tail — cost unearned at scale |
| Beck · TDD/simple | JOIN¹ | 🟡→🔴 | the premise-vs-design boundary may be mechanically untestable (SC-001) |
| Norman · HCD | JOIN | 🟡 | operator may conflate premise vs design feedback — out-seated (runner-up) |
| Evans · DDD | JOIN | 🟢 | premise/design vocabulary carves at a real joint — out-seated |
| Uncle Bob · clean code | JOIN | 🟢 | SRP split is clean — out-seated |
| Cooper · product | ABSTAIN | 🟢 | "Gate A is for design quality; the real vote is the operator's" |

¹ Beck first returned ABSTAIN-with-a-sharp-finding; re-pinged for disambiguation (chair decides nothing) → JOIN.

**Seating: J = 8 ≥ 6 → cap 5 (S3).** Goldratt mandate-seated. Seats: Security, Beck, Richards, Goldratt, Delivery (the lenses carrying the premise/mechanism/cost challenges). 🟡 tie at seat 5 (Delivery vs Norman) → Delivery (expected Gate A attendance); Norman runner-up (async override). Evans/Uncle Bob (🟢) out-seated; Cooper abstained.

### Findings register + Stage 3–4 tally

Votes are non-author (S8). `net = P − O` (CONFIRM/ABSTAIN excluded); `net≥+2` escalate, `≤−2` demote, else hold; gating iff final 🔴.

| ID | Lens | Proposed | net | Final | Title (pull-quote abbrev) |
|----|------|:--:|:--:|:--:|---|
| F1 | Security | 🔴 | +0 | 🔴 | "A panel cannot steelman past a blind spot it shares with the author" — FR-006 relocates circularity, doesn't escape it |
| F2 | Security | 🔴 | +3 | 🔴 | honest-null unauditable — "'Non-empty' is not 'genuine'" (SC-005 checks form, not sincerity) |
| F3 | Security | 🟡 | −1 | 🟡 | out-of-distribution challenger (red-team checklist) never weighed |
| F4 | Security | 🟡 | +1 | 🟡 | "structural divergence" oversold — markdown mandates form, not conviction |
| F5 | Beck | 🔴 | +1 | 🔴 | "a test for the plumbing, called a test for the premise" — SC-001 |
| F6 | Beck | 🔴 | +4 | 🔴 | "the boundary is a judgment — seat it in the vote, not a regex" (move classification to Stage 3) |
| F7 | Beck | 🟡 | +0 | 🟡 | SC-005 satisfiable by boilerplate — bind to a lens + steelman shape |
| F8 | Beck | 🟡 | +2 | **🔴** | "012 proves the mechanic fits inside Gate A — prove the new phase earns its weight" (re-brief, YAGNI) |
| F9 | Beck | 🟢 | +0 | 🟢 | SC-002 tests an undefined mapping; SC-003/006/007 clean |
| F10 | Richards | 🟡 | +2 | **🔴** | "a verdict the spec calls arithmetic cannot leave its own arithmetic to a later phase" (4→3 mapping) |
| F11 | Richards | 🟢 | +0 | 🟢 | scope-filter composes cleanly (credit) |
| F12 | Richards | 🟡 | +1 | 🟡 | parked-findings hand-off to Gate A is an unmodeled dependency; needs a contract |
| F13 | Richards | 🟢 | +0 | 🟢 | mapping must live in DECISION-PRIMITIVE (credit/low-risk) |
| F14 | Richards | 🟡 | +0 | 🟡 | premise-challenge has no single canonical home named |
| F15 | Goldratt | 🟡 | +3 | **🔴** | "why build a second room before testing whether re-briefing the first plugs the leak?" |
| F16 | Goldratt | 🟡 | +1 | 🟡 | default-on is inventory ahead of evidence — opt-in first, then promote |
| F17 | Goldratt | 🟢 | +0 | 🟢 | the honest-null + divergence guarantee IS the hard invariant — keep (credit) |
| F18 | Goldratt | 🔴 | +3 | 🔴 | "a feature that mandates challenging every premise must survive challenging its own" |
| F19 | Delivery | 🔴 | +1 | 🔴 | "a full panel cycle on every feature to catch a 17% tail is complexity the scale has not earned" |
| F20 | Delivery | 🟡 | +0 | 🟡 | "default-on but skippable" expensive default; skip friction unspecified |
| F21 | Delivery | 🟡 | +1 | 🟡 | second verdict + parked list adds triage on the ~83% sound path; hand-off unspecified |
| F22 | Delivery | 🟢 | +0 | 🟢 | conformance/reconstructability cheap + well-specified (credit) |

**Gating 🔴 set (9): F1, F2, F5, F6, F8, F10, F15, F18, F19.** Grouped:

- **K1 · 013's own premise is shaky — a re-brief, not a new mandatory phase (and default-on is premature):** F18, F15, F8, F19 (four 🔴) + F16 🟡. The dominant verdict. The cheaper experiment (re-brief Gate A to run a premise pass first, as 012 showed it can) was never ruled out; default-on every feature taxes 100% to harvest a ~17% tail.
- **K2 · the mechanism may not work / not be verifiable:** F6 (unanimous — move premise/design classification into the *vote stage*, not a text stanza), F5 (SC-001 tests plumbing), F2 (honest-null unauditable).
- **K3 · it may not escape the circularity it's built to fix:** F1 (same-model panel shares the author's blind spots; FR-006 relocates, doesn't escape).
- **K4 · architecture:** F10 (4→3 verdict mapping deferred — escalated), F12/F14 🟡 (parked hand-off contract; no canonical home).
- **Kept (credits):** F17 (the divergence guarantee is the load-bearing invariant — keep it), F11, F22.

### Round brief — the dogfood result

A highly convergent gate, and self-referential. Seated and **adversarially briefed**, Gate A *did* diverge from the frame — it challenged 013's premise hard. The dominant finding (K1) is that **013 may not need to exist as a separate mandatory phase**: the same divergence is reachable by *re-briefing Gate A* (which 012 demonstrated, and which this very gate demonstrates — it challenged the premise because it was briefed to). That cuts both ways:

- **For 013's thesis:** an adversarial premise-challenge charter *does* produce divergence (the ~17% tail showed up as 9 reds here).
- **Against 013's solution:** that charter can be a *re-brief* of Gate A, not a new default-on phase — and getting the divergence still required the orchestrator to brief adversarially and re-ping an abstaining lens (Beck). The feature designed to systematize premise-challenge had its own premise challenged by the unmodified mechanism.

Plus: the core classification (premise vs design) is judgment that belongs in the **vote stage**, not a conformance stanza (F6, unanimous); the challenger may not escape §4d circularity (F1); the verdict mapping + canonical home are unspecified (F10/F14).

### S1–S9 self-audit (Gate A)

S1 ✅ (personas authored; conductor tallied) · S2 ✅ (RSVP fired) · S3 ✅ (cap 5; Goldratt seated; 🟡 seat-5 tie recorded) · **S4 ✅ — escalating, not passing** · S5 ✅ (no hand-patch) · S6/I8 ✅ (all 22 findings cite spec.md/canon lines) · S7 ✅ (cycle 0; escalating pre-loop) · S8 ✅ (no author graded own finding) · S9 ✅ (arithmetic tally, reproducible).

### Block on 🔴 → operator escalation

> **DecisionRecord** `gateA-block-1` · band 🔴 · point: 9 gating 🔴 dominated by a **premise reversal of the feature itself** (K1: re-brief vs new phase; default-on premature) plus a **mechanism-relocation** (K2/F6: classification belongs in the vote stage) — both are scope/design decisions the operator owns, not auto-incorporable. · resolution: **escalated** (D2 — 🔴 never auto-proceeds). · cycle: 0 (escalating before the self-heal loop, because the dominant fix questions whether the feature should exist as specced — the operator's call). · note: mirrors 012's Gate-A escalation pattern.

**Awaiting operator decision** (options in session).

### Operator decision — resolves `gateA-block-1`

> **DecisionRecord** `gateA-block-1` · band 🔴 · resolution: **operator-decided — option A (reframe to a Gate-A premise pass)** · 2026-06-18. The gate's dominant verdict is honored: deliver the divergence charter as a **re-brief of Gate A** (a premise pass run first, premise findings tagged), not a separate default-on phase.

The 9 🔴 are cleared **without a waiver** by spec v2:

- **K1 (F18/F15/F8/F19/F16 — re-brief vs new phase; default-on premature) → resolved.** v2 is a Gate-A re-brief: the premise pass is added to Gate A's brief + a scope tag; **no new pipeline phase, no default-on-every-feature mandatory gate** (it rides Gate A's existing cadence). FR-001, Assumptions.
- **K2 (F6/F5/F2 — mechanism untestable) → resolved.** Classification (premise-scoped vs within-frame) moves into the **vote stage** (personas own scope, S8/S9), not a conformance stanza; honest-null entries must each carry a lens + steelman (substantive, re-run if not). FR-004, FR-006, SC-002/SC-004.
- **K3 (F1 — circularity reappears) → resolved.** A **fixed, author-independent red-team checklist** (prior-free premise questions) is the divergence floor beneath same-model persona attacks. FR-005, SC-003.
- **K4 (F10/F14/F12 — mapping/home/contract) → dissolved.** By reusing Gate A's **existing tally** over premise-tagged findings, v2 introduces **no new verdict mechanic, no 4→3 mapping, and no new canonical doc** — the architecture reds disappear. FR-007, SC-005.
- **Kept (F17):** the divergence guarantee + honest-null — the panel's one firm "keep" — is the load-bearing invariant of v2 (US3).

**Incorporation:** spec rewritten to **v2** (Gate-A premise pass) in-session, operator-authorized. Recorded under the v2 note + Assumptions.

**The recursion, for the record:** running the SDLC on 013 made Gate A challenge 013's own premise; the verdict (re-brief, not a new phase) both validated the thesis (an adversarial charter produces divergence — 9 reds) and rescoped the solution. 013's premise was challenged by the very mechanism it sought to augment, and the augmentation is now *a brief change to that mechanism*.

**Next:** re-run Gate A cycle 1 on v2 to verify the 9 reds cleared (the verifying sensor), or proceed to `/speckit-plan`.

_Gate A cycle 0 closed; incorporated to v2; awaiting go-ahead for cycle 1._

---

## Gate A — cycle 1 (verifying sensor on v2) — 2026-06-18

**Purpose:** re-run the gate over spec **v2** to verify the 9 gating 🔴 from cycle 0 are resolved (S4 — a 🔴 is *resolved and verified*, never passed silently). Seated the five cycle-0 red-carriers (Security, Beck, Richards, Goldratt, Delivery) and dispatched each to re-test its own reds against v2 + author any new gating concern. Single author pass; no vote round needed (empty gating set — nothing to escalate/demote).

### Verification tally — cycle-0 reds against v2

| ID | Lens | Cycle-0 🔴 (abbrev) | v2 verdict | Resolving FR/SC (v2) |
|----|------|---|:--:|---|
| F1 | Security | panel can't steelman past a shared blind spot (circularity relocated) | **CLEARED** (🟡 residual) | FR-005 / SC-003 — fixed author-independent red-team checklist as prior-free divergence floor |
| F2 | Security | honest-null unauditable — "non-empty ≠ genuine" | **CLEARED** (🟡 residual) | FR-006 / SC-004 — each entry lens+steelman; no-attack pass fails & re-runs |
| F5 | Beck | "a test for the plumbing, called a test for the premise" | **CLEARED** (🟡 residual) | SC-001 owns plumbing; SC-007 pins divergence *behavior* on a shaky fixture |
| F6 | Beck | "seat the boundary in the vote, not a regex" (net +4) | **CLEARED** | FR-004 / SC-002 — scope author-declared + vote-confirmed (S8/S9) |
| F8 | Beck | "prove the new phase earns its weight" (YAGNI) | **CLEARED** | FR-001 / Assumptions — added pass + brief, not a new phase |
| F10 | Richards | "arithmetic can't leave its arithmetic to a later phase" (4→3 map) | **CLEARED** | FR-007 / SC-005 — reuse existing Stage-4 tally; no separate verdict to map |
| F15 | Goldratt | "why build a second room before re-briefing the first?" | **CLEARED** | FR-001 / Assumptions — v2 *is* the cheaper experiment (re-brief) |
| F18 | Goldratt | "must survive challenging its own premise" | **CLEARED** | spec.md provenance — 013's premise was challenged & rescoped; honored |
| F19 | Delivery | "a panel cycle per feature for a 17% tail is unearned" | **CLEARED** | FR-001 / FR-009 — no second convening; rides Gate A's existing cadence |

**Gating 🔴 set after cycle 1: ∅ (empty).** All 9 resolved without a waiver. No seated lens authored a new gating concern.

Also resolved (cycle-0 ambers re-tested): **F12** (parked hand-off) → contract named in FR-004 + FR-010; **F14** (no canonical home) → moot (no new mechanic ⇒ home is Gate A / SDLC-LAYER + the cited primitive); **F20** (skip friction) → moot (skippable like any gate step, no separate phase).

### Residual 🟡 (recorded, non-gating — carry to plan/tasks)

- **R1 (Security, ex-F1):** the red-team checklist lowers the §4d blind-spot floor but a same-model panel still *reads* it with the author's eyes — an inherent limit of same-model review, not a fixable bug. spec.md:97 slightly overclaims ("directly addressing"); soften to "lowers the floor for".
- **R2 (Security, ex-F2):** sincerity is asymptotic — SC-004 falsifies the *floor* case (bare `sound`), not a panel emitting plausible-but-shallow lens+steelman entries. Re-run discipline degrades gracefully; no detector for shallow-but-formatted.
- **R3 (Beck):** SC-007 pins divergence on a shaky fixture but nothing pins the **contrapositive** at behavior level (a genuinely sound premise yields honest-null, not a manufactured red — green-by-coincidence risk). SC-003 records the checklist *ran*, not that it *bit*.
- **R4 (Goldratt, ex-F16):** default-on still taxes 100% of Gate A runs to harvest a ~17% divergence tail — but cost *collapsed* to a brief change, and the floor is defensible as *buying the §4d invariant* rather than hoping for divergence. Watch per-run honest-null authoring cost on the ~83% sound path.
- **R5 (Delivery, ex-F21):** every-run red-team checklist + substantive honest-null is a standing common-path attention cost (honestly priced, not unearned). Planner note: **SC-004's re-run has no ceiling** — cap at N cycles, then operator-override like any 🔴 (cheap to close in tasks).

### S1–S9 self-audit (Gate A cycle 1)

S1 ✅ (personas authored verdicts; conductor tallied, authored nothing) · S2 ✅ (RSVP/seating from cycle 0 carried within the same gate's self-heal loop; lenses are the red-carriers being verified) · S3 ✅ (5 seated, cap respected) · **S4 ✅ — the 9 🔴 are resolved *and verified* by a re-run, not passed silently** · S5 ✅ (resolution was spec v2 via reframe, not a hand-patch) · S6/I8 ✅ (every verdict cites spec.md:line / canon) · **S7 ✅ — cleared at cycle 1, well inside the 3-cycle bound** · S8 ✅ (each lens re-tested its *own* cycle-0 reds for clearance — a self-heal verification, not grading-own-finding-for-severity; no new findings entered a tally) · S9 ✅ (no synthesized vote; empty gating set is the honest output, not an orchestrator opinion).

### Gate A — verdict

> **DecisionRecord** `gateA-clear` · band 🟢 · Gate A **CLEARS** on spec v2 at cycle 1. Zero open 🔴; 5 🟡 residuals recorded (R1–R5) for the plan/tasks phases. The self-heal loop closed in one verifying cycle.

**The recursion, closed:** cycle 0 had Gate A challenge 013's own premise (9 reds); the operator rescoped to the cheaper re-brief (option A); cycle 1 confirms the rescope holds. 013's thesis — *an adversarially-briefed Gate A diverges from the frame* — was demonstrated **on 013 itself**, and the divergence it produced has now been absorbed and verified clear.

_Gate A closed (cleared, cycle 1). Next: `/speckit-plan` → Gate B._

---

## Gate B — Plan/tasks review (plan.md + tasks.md) — 2026-06-18

**Corpus:** `plan.md`, `tasks.md`, `contracts/canon-edits.md`, `research.md`, `data-model.md`, `quickstart.md` + the cleared `spec.md` and the canon being edited/cited (`SDLC-LAYER.md`, `SKILL.md`, `GATE-PRIMITIVE.md`, `DECISION-PRIMITIVE.md`).

**Seating (sized-down per no-ultracode, single author pass):** the four most-applicable lenses for a markdown plan/tasks review — Richards (architecture), Beck (simple design), Goldratt (scope/defer), Delivery (ops). Security/domain/language lenses not seated (no new trust boundary — prose only; no code/Python; the §4d circularity is a *known recorded residual*, not a new surface introduced by the plan).

### Findings register + tally

21 findings; votes not run (empty 🔴 set — nothing to escalate/demote; S9 — the empty gating set is the honest output).

| ID | Lens | Sev | Title (pull-quote abbrev) |
|----|------|:--:|---|
| B1 | Richards | 🟢 | cite-not-restate correctly designed — premise outcome is Stage-4 *scoped by a finding attribute*, not a new mechanic |
| B2 | Richards | 🟡 | five-part subsection is a de-facto sub-document — name the locality trade-off so no one "tidies" it into the forbidden CHALLENGE-LAYER.md |
| B3 | Richards | 🟢→🟡 | T002 baseline-hash sound, but Gate B/C "section unchanged" needs an **anchored section extract**, not a whole-file hash of an edited file |
| B4 | Richards | 🟢 | US1/US3 same-file sequential ordering correct; skeleton-first (T003) prevents drift |
| B5 | Richards | 🟡 | T010 cites `Loop bound`/S7 for the N=3 re-run — T001 must verify that anchor pre-exists, else the cite is unverified |
| BK1 | Beck | 🟢 | T008 faithfully implements F6 — scope seated in the vote, no regex |
| BK2 | Beck | 🟢 | RT-1..RT-6 do **not** reintroduce the F6 stanza-smell — questions answered, not a classifier |
| BK3 | Beck | 🟡 | five parts in one home is fine (decomposed by task); parts 2 & 5 lean on GATE-PRIMITIVE — C-CITE catches any restatement |
| BK4 | Beck | 🟡 | **the missing sound-premise contrapositive (R3/T017) is the one gap to close now** — a brief that always fires red also passes C-007 |
| BK5 | Beck | 🟢 | R5 re-run ceiling closed in-task (N=3); conformance tests behavior not plumbing |
| G1 | Goldratt | 🟡 | R4 default-on tax honestly carried (priced + watched), not growing silently |
| G2 | Goldratt | 🟢 | R5/D5 bound reuse sound — same disposition (bounded retry→operator 🔴), different trigger; no new mechanic |
| G3 | Goldratt | 🟡 | **R3 is the one questionable deferral** — the false-red is the adversarial brief's riskiest failure; the contrapositive is *on* the constraint — promote T017 |
| G4 | Goldratt | 🟢 | R1/R2 correctly deferred (inherent limits, not buildable now); R1 spec-softening is the right disposition |
| G5 | Goldratt | 🟢 | effort is on the constraint — the red-team checklist IS the §4d floor; nothing gold-plates |
| G6 | Goldratt | 🟢 | constitution IX seating-debt correctly scoped OUT of 013 |
| D1 | Delivery | 🟢 | E5/T013 deploy **verified** — `install.sh:36` globs `*.md`; edited canon ships with zero new steps |
| D2 | Delivery | 🟡 | C-CITE Gate B/C check needs a scoped baseline or it's eyeball-grade (converges with B3) |
| D3 | Delivery | 🟢 | same-file sequencing correctly marked; one minor same-file [P] pair (T011/T012, disjoint regions) |
| D4 | Delivery | 🟡 | N=3 bounds the re-run loop, not the per-pass honest-null floor cost — honestly priced + operator skip-valve |
| D5 | Delivery | 🟢 | C-007 fixture + the dogfood trail are live divergence evidence in the right place |

**Gating 🔴 set: ∅.** Gate B clears at cycle 1.

### Convergent 🟡 incorporated (Principle VIII counter-force — spec correct, tasks converged toward it; recorded)

- **K-B1 · promote T017 (sound-premise contrapositive) optional → mandatory.** Convergence: **BK4 + G3** (Beck + Goldratt, independent) — the false-red is the adversarial brief's signature failure; the contrapositive is on the constraint. Added **C-008** (mandatory) + sound-premise fixture; plan R3 row flipped to CLOSED.
- **K-B2 · section-scoped C-CITE baseline.** Convergence: **B3 + D2** (Richards + Delivery). T002/T015 now capture an anchored-section extract of the SDLC-LAYER Gate B/C slice (whole-file hash breaks on an edited file).
- **K-B3 · T001 verifies the `Loop bound`/S7 anchor** before T010 cites it (B5).
- **K-B4 · fat-subsection trade-off recorded** in plan Structure Decision so no future editor splits it into the SC-005-forbidden CHALLENGE-LAYER.md (B2).

Remaining 🟡 (B-residuals, recorded, non-gating): R4/D4 per-run honest-null floor cost (priced, watched, operator skip-valve); BK3 parts-2/5 restatement risk (C-CITE guards). No action owed.

### S1–S7 self-audit (Gate B)

S1 ✅ (personas authored; conductor tallied + incorporated via task edits, authored no spec) · S2 ✅ (fresh seating for Gate B) · S3 ✅ (4 seated, cap respected) · **S4 ✅ — empty 🔴 set, nothing passed silently** · **S5 ✅ — incorporation refined `tasks.md`/`plan.md`/`quickstart.md` (the spec is correct; converging downstream artefacts toward it is the Principle VIII counter-force, recorded here), no spec hand-patch** · S6/I8 ✅ (every finding cites a plan/tasks/canon line) · S7 ✅ (cleared cycle 1).

> **DecisionRecord** `gateB-clear` · band 🟢 · Gate B **CLEARS** on plan+tasks at cycle 1. Zero 🔴; 4 convergent 🟡 incorporated; 2 🟡 residuals recorded.

_Gate B closed (cleared, cycle 1). Next: `/speckit-implement` → Gate C._

---

## Implementation (`/speckit-implement`) — 2026-06-18

Executed all 18 tasks. Canon edits (markdown-only): `skill/chorus/SDLC-LAYER.md` (new `### Gate A — premise pass (runs first)` subsection — the single canonical home: brief, scope-in-vote, RT-1..RT-6 checklist, honest-null+N=3 bound, outcome=existing tally; + ledger-ordering note; + attendance clause), `skill/chorus/SKILL.md` (Four modes + `chorus challenge` + frontmatter), `README.md` (mode list). `install.sh` unchanged (its `*.md` glob — line 36 — deploys edited canon automatically; D1 verified). `GATE-PRIMITIVE.md` / `DECISION-PRIMITIVE.md` **byte-unchanged**. Spec FR-005 softened (R1, T014).

**T001 re-grounding caught real drift** — the insertion anchor was at line 123, not the 144 the stale plan assumed (Principle V working). **Discrimination test (C-007 + C-008)** run on two fixtures: the authored brief **fired** on a shaky premise (notification-center-reminding-about-mutes → premise 🔴, 6 RT items bit + steelman) and **held** on a sound premise (payment idempotency keys, measured 0.3% dup rate → substantive honest-null, no manufactured red). The brief **discriminates** — it does not reflexively attack.

## Gate C — Implementation review (canon edits) — 2026-06-18

**Corpus:** the live `git diff` of `skill/chorus/SDLC-LAYER.md`, `skill/chorus/SKILL.md`, `README.md` vs spec/contract/quickstart. Seated (sized-down): a spec↔impl walkthrough pass (the `spec-walkthrough` role, general-purpose) + Richards (cite-not-restate / citation integrity) + Beck (prose executability). Security/domain/language not seated (prose-only, no code/Python, no new trust surface).

### Walkthrough (spec↔implementation reconciliation)

**FR covered 10/10 · SC covered 8/8 · DRIFT 0 · GAP 0 · SURPRISE 1** (non-canon: `.specify/feature.json` branch pointer flipped 010→013 — mechanical speckit artifact, no canon effect). Every FR-001..010 and SC-001..008 maps to a shipped canon locator. High-risk claims verified against the prose: FR-007/SC-005 (no new mechanic/mapping/doc — reuses Stage-4 as a finding-attribute scope), FR-009/SC-008 (primitives + Gates B/C byte-unchanged, confirmed via diff), Principle I (SKILL cites, does not restate).

### Findings register + tally

| ID | Lens | Sev | Title (pull-quote abbrev) |
|----|------|:--:|---|
| C1 | Richards | 🟠 | **dangling citation** — canon cited `chorus-and-repo-stats-v2.md §4d` (an uncommitted tmp evidence file) 3× as its evidentiary spine; no reader of the installed canon can open it |
| C2 | Richards | 🟢 | cite-not-restate clean — SKILL cites the subsection; Stage-4/S8/S9 pointed-to not copied; primitives byte-unchanged |
| C3 | Richards | 🟢 | internal citation integrity — S8/S9, Stage 4, Loop bound/S7, DECISION-PRIMITIVE all resolve |
| C4 | Richards | 🟢 | composition sound — subsection sits correctly between Exploratory phase and Block-on-🔴; no duplication |
| C5 | Richards | 🟢 | contract fidelity — E1–E5 matched, no over-reach, SC-005 honored |
| C6 | Beck | 🟢 | honest-null forces substance (lens+attack-form + RT outcomes; bare `sound` fails) — can't be satisfied by boilerplate |
| C7 | Beck | 🟢 | scope-in-vote (the F6 win) shipped faithfully — author-declared + vote-confirmed, no regex |
| C8 | Beck | 🟢 | RT-1..RT-6 table executable cold — one falsifiable question per row |
| C9 | Beck | 🟡 | "cited, not a new mechanic" reassurance repeats 4× — defensive duplication of intent |
| C10 | Beck | 🟡 | §1 says "four" attack forms; §4 honest-null listed "three" — minor asymmetry |

**Gating 🔴 set: ∅.** Gate C clears.

### Incorporated (Principle VIII counter-force — converging the shipped canon, spec correct; recorded)

- **C1 (🟠 dangling citation) → fixed.** The canon rationale is rewritten as a **self-contained durable principle** ("a multi-lens review develops within the frame far more readily than it challenges it; same-distribution review is circular unless it diverges") — the point-in-time 69%/17% stats and the tmp-file reference are **removed from the canon** (they remain in the spec's Motivation as feature provenance, where feature-historical evidence belongs). The §4d ref in part 3 also dropped. Verified: zero `chorus-and-repo-stats`/`§4d` refs remain under `skill/`; primitives still byte-unchanged.
- **C9 (🟡) → trimmed.** Removed the redundant "; cited, not a new mechanic" from the honest-null bound (the SC-005-falsifiable "no new mechanic" assertions in §5 are kept — they are C-CITE-checkable).
- **C10 (🟡) → fixed.** Honest-null now reads "lens + one of the four attack forms of §1 (steelman / reframe / root-cause doubt / named assumption + cheapest experiment)" — the §1/§4 count now agrees.

### S1–S7 self-audit (Gate C)

S1 ✅ (personas authored findings; conductor incorporated via canon edits traceable to tasks/contract, synthesized no finding) · S2 ✅ (fresh Gate-C seating) · S3 ✅ (3 seated, cap respected) · **S4 ✅ — empty 🔴 set; the 🟠 + 2 🟡 incorporated, nothing passed silently** · **S5 ✅ — the spec is correct; the incorporations converged the *implementation* (canon) toward it, the Principle VIII counter-force, recorded here (no spec hand-patch to force a pass)** · S6/I8 ✅ (every finding cites a canon line) · S7 ✅ (cleared cycle 1).

> **DecisionRecord** `gateC-clear` · band 🟢 · Gate C **CLEARS** on the canon implementation at cycle 1. Zero 🔴; FR 10/10, SC 8/8, DRIFT 0, GAP 0; one 🟠 + two 🟡 incorporated.

## Memory update (sign-off)

Sign-off bookend (`SDLC-LAYER.md` § Memory update phase). **Sized-down per the no-ultracode operating constraint** (gates run as plain dispatches, no per-persona memory-write fan-out this run). Recorded honestly:

- **Per-persona `agent-memory` write-backs:** no-op this run — reason: the seated lenses were dispatched as ephemeral gate reviewers without persistent `~/.claude/agent-memory/<persona>/` records to update; no durable lens-specific locator generalized beyond this feature's delta (010 FR-009 no-op, "does-not-generalize / no memory dir").
- **`project-wide` proposal → `docs/reviews/CHORUS-PROJECT.md`:** none — this repo has no chorus addendum (the chorus reviews its *own* canon); no operator-owned project fact surfaced.
- **Secret pre-filter:** clean — no candidate facts; nothing dropped.
- **Durable learning (feature-historical, captured in this ledger, not a memory write):** the recursion — running the SDLC on a premise-challenge feature made the unmodified Gate A challenge 013's own premise (cycle 0, 9 reds), the operator rescoped to a re-brief (option A), and cycles 1 + Gates B/C verified the rescope holds; the shipped brief discriminates (C-007/C-008). 013's thesis was demonstrated on itself.
- Orchestrator self-check: **authored no spec/persona-memory record; synthesized no learning or vote.** ✅

---

## SDLC run — complete

All three gates cleared (each at cycle 1, no waivers): **Gate A** (design, on v2 after the cycle-0 reframe) · **Gate B** (plan/tasks) · **Gate C** (implementation). The feature is implemented in canon and conformance-verified (C-001..C-008, C-CITE, C-MODE). Residuals carried (non-gating, recorded): R4 (default-on per-run honest-null cost — priced, watched, operator skip-valve), R1/R2 (same-model floor limits — inherent), plus the flagged **constitution debt** (Principle IX line still says "scope/deferral lens never out-seated" — superseded by 012's exceptional entry; a follow-up amendment, out of scope for 013).

_SDLC run closed. Feature 013 ready for PR (uncommitted)._
