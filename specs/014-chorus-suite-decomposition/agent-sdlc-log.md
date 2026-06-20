# Agent-SDLC Ledger — Feature 014: chorus-suite-decomposition

**Run started:** 2026-06-20
**Driver:** chorus SDLC lifecycle mode (`SDLC-LAYER.md`)
**Target:** run pipeline through Gate C — `/speckit-plan` → Gate A → `/speckit-tasks`
→ Gate B → `/speckit-implement` → Gate C → memory-update.
**Spec:** `specs/014-chorus-suite-decomposition/spec.md`
**Design:** `docs/superpowers/specs/2026-06-20-chorus-suite-decomposition-design.md`

**Operator constraints (recorded):** run gates via plain Agent dispatches (no
ultracode mode); pin absolute worktree paths in subagent briefs.

**Project addendum:** none at `docs/reviews/CHORUS-PROJECT.md` — scope/topology
interviewed inline at Gate A; an offer to write the addendum is owed at sign-off.

---

## Pipeline progress

- [x] `/speckit-plan` → plan.md (+ research.md, data-model.md, contracts/, quickstart.md)
- [x] Gate A · design review  ← CLEARED (cycle 2): 🔴 F1/F2/F5/F19 resolved+verified; F6 waived; F11 tiered
- [x] `/speckit-tasks` → tasks.md (31 tasks, 8 phases)
- [x] Gate B · plan/tasks review  ← CLEARED: all 🟡 refinements; GB1/GB2/GB6 incorporated; no 🔴
- [x] `/speckit-implement` → code + tests (suite built; FC1/FC2/FC3 pass; parity RED demonstrated)
- [x] Gate C · implementation review  ← CLEARED: GC7 resolved by live behavioral proof; GC6 fixed+verified
- [x] Memory update (sign-off) — 6 personas wrote durable lessons; no project-wide diff
- [x] **RUN COMPLETE** — feature reviewed through Gate C; memory updated

---

## Gate A · design review

**Corpus:** spec.md, plan.md, research.md, data-model.md, contracts/, design doc,
current `skill/chorus-review/*.md`.

### RSVP (two-axis signal)

| Lens | Verdict | Applicability (cited delta) | Stakes |
|---|---|---|---|
| Beck · TDD | JOIN | parity = full RED-GREEN per moved/split skill (FR-015) | 🔴-pot |
| Security | JOIN | findings→memory write surface; secret pre-filter deferred (FR-011) | 🟡 |
| Richards · arch | JOIN | findings→memory deferred seam = static-coupling re-leak | 🟡 |
| Delivery-Ops | JOIN | install.sh `cp -f` over multi-skill; no-migration leftover | 🟡 |
| Norman · HCD | JOIN | FR-002 loud-fail must close action-perception loop | 🟡 |
| Evans · DDD | JOIN | I1–I9 catalog placement across context boundaries | 🟡 |
| Uncle Bob | JOIN | CONDUCTOR.md cohesion (5 responsibilities), DIP | 🟡 |
| Cooper · product | ABSTAIN | insiders only; no end-user cost shifted | 🟢 |
| Goldratt · scope | EXCEPTIONAL-ENTRY | build-now contract w/ no consumer + maximal parity (the cut) | 🟡 |

J(ordinary)=7, exceptional=1, abstain=1 (Cooper). Quorum: full.

### Seating — 🟡 DecisionRecord (tie at 5th seat)

- **Sensor (mechanical sort):** applicability all ✓; Beck sole 🔴 → seat 1. Six 🟡s
  tie for the remaining 4 ordinary seats.
- **Default panel (seated):** Beck, Security, Richards, Delivery-Ops, Norman
  (5 ordinary, by distinct uniquely-held mandate) + **Goldratt** (exceptional, cut
  delta no seated lens covers). Board = 6.
- **Runners-up (out-seated, override open):** Evans, Uncle Bob — invariant/structure
  mandates overlapping Richards' anti-drift seam.
- **Override cost:** swapping in Evans/Uncle Bob displaces a 🟡 of equal stakes; the
  operator may swap async without re-running RSVP. Default holds unless overridden.
- Scope/deferral lens seated (Goldratt) → no new-buildout side-note.

### Round 1 — findings register (author severities; pre-vote)

| ID | Advisor · Lens | Sev | Target (locator) | Pull-quote (verbatim) |
|----|----------------|-----|------------------|------------------------|
| F1 | Security | 🔴 | `findings-to-memory.md:11,23-24` | "The contract commits where verbatim quotes land on disk but leaves the secret filter as an unspecified noun — the deferred callback can ship conforming and unsafe." |
| F2 | Security | 🔴 | `GATE-PRIMITIVE.md:37`; `findings-to-memory.md` | "A verbatim excerpt of a token line becomes a durable, committed memory record — the contract never says the filter must refuse it." |
| F3 | Security | 🟡 | `spec.md:234` | "'Redesignable later' is safe only if the filter precondition is recorded against the deferred spec — today it lives in prose nobody is obliged to honor." |
| F4 | Richards · arch | 🟠 | `data-model.md:42`; `fitness-checks.md:10-17` | "'Fitness check #1 verifies the citation resolves; it does not require S tokens themselves to live in core.'" |
| F5 | Norman · HCD | 🔴 | `chorus-core-substrate.md:10-13`; `design.md:133-136` | "The loud-fail preamble runs only if the router runs; the failure being mitigated is the router not running." |
| F6 | Delivery-Ops | 🔴 | `install.sh:36`; `spec.md:240` | "`cp -f *.md` overwrites the two survivors and silently leaves four orphans behind — including one that redefines all of `I1–I9` in the live skill dir." |
| F7 | Delivery-Ops | 🟡 | `spec.md:31-33` vs `fitness-checks.md:9` | "The safety argument — 'repo source has no stale files' — is silent about the only place the stale files exist: the operator's install." |
| F8 | Beck · TDD | 🟠 | `spec.md:122` | "Reaching the gate is not the same as the gate firing." |
| F9 | Beck · TDD | 🟡 | `spec.md:262` | "A baseline nobody has captured yet is a promise, not a control." |
| F10 | Beck · TDD | 🟡 | `plan.md:67` | "A test that was green the first time it ran pins nothing." |
| F11 | Beck · TDD + Goldratt | 🟡 | `plan.md:97-100`; `spec.md:262`/`research.md:55` | "A byte-identical move and a cross-boundary recomposition are not the same risk and should not get the same test." |
| F12 | Beck · TDD | 🟡 | `spec.md:278` | "Deferring the harness is allowed; deferring the red is not." |
| F13 | Richards · arch | 🟡 | `findings-to-memory.md:24` | "Written so a later spec can implement against a stable shape — but never declares that shape the *only* permitted reach." |
| F14 | Richards · arch | 🟢 | `data-model.md:22` | "Bundling the catalog with the discipline it audits is correct cohesion at this scale — split it into INVARIANTS.md only if it grows." |
| F15 | Richards · arch | 🟡 | `plugin.json:9-16` vs `ls agents/` | "Manifest lists 7 agents; disk has 10 — the agent is present-and-unlisted, not claimed-and-absent (3 missing, not 2)." |
| F16 | Norman · HCD | 🟡 | `chorus-core-substrate.md:11` | "Naming the file is diagnosis; the operator still has to guess the cure." |
| F17 | Norman · HCD | 🟡 | `spec.md:178` | "A check that runs only when a human runs it surfaces nothing to the operator mid-review." |
| F18 | Norman · HCD | 🟡 | `design.md:34`; `spec.md:42-88` | "Discovery for whom — the maintainer reading descriptions, or the operator holding one model of 'the chorus'?" |
| F19 | Norman · HCD | 🟠 | `spec.md:314` | "'Invoking a sibling with chorus-core absent fails loudly' — the cited guard lives in the thing that is absent." |
| F20 | Goldratt | 🟡 | `spec.md:231`; `design.md:228` | "The core contract records what already exists — keep it; the addendum template knob has no reader until the deferred callback ships." |

### Convergence clusters (pre-vote)

- **Enforcement-gap** (F4 Richards + F5/F19 Norman + F6/F7 Delivery): the anti-drift
  and loud-fail *guarantees are asserted but not enforced where the failure lives* —
  FC1 checks resolution not core-residence; the self-check sits inside the thing that
  may be absent; install orphans double-define `I1–I9`. **3 lenses, independent.**
- **Secret-filter** (F1/F2/F3 Security + F13 Richards): the findings→memory write
  surface is committed but its control is prose; no "documented shape is the sole
  reach" fence. **2 lenses.**
- **Parity-testing** (F8/F9/F10/F11/F12 Beck + F11 Goldratt): scenarios must corner
  *composed behavior* not file presence; relocation vs recomposition are different
  risks. Beck = test-design correctness; Goldratt = economics. **Converges — but F11
  tension with the operator's recorded clarification (Q1 = full parity for every
  skill).**
- **Manifest drift** (F15 Richards, corroborated by Delivery): `plugin.json` drift is
  real and the spec's narrative of it is backwards.

### Round 2 — vote tally (Stage 4: net = P − O, non-author voters; ±2 threshold)

| ID | Author sev | P | C | O | net | Final | Note |
|----|-----------|---|---|---|-----|-------|------|
| F1 | 🔴 | 0 | 4 | 0 | 0 | 🔴 | held; converged ×4 |
| F2 | 🔴 | 2 | 2 | 0 | +2 | 🔴 | at max; converged ×4 |
| F3 | 🟡 | 0 | 3 | 0 | 0 | 🟡 | |
| F4 | 🟠 | 1 | 2 | 0 | +1 | 🟠 | FC1 residence gap |
| F5 | 🔴 | 1 | 4 | 0 | +1 | 🔴 | converged ×5 |
| F6 | 🔴 | 2 | 2 | 0 | +2 | 🔴 | converged ×4 |
| F7 | 🟡 | 2 | 1 | 0 | +2 | **🟠** | escalated 🟡→🟠 |
| F8 | 🟠 | 1 | 2 | 0 | +1 | 🟠 | |
| F9 | 🟡 | 0 | 0 | 0 | 0 | 🟡 | no votes |
| F10 | 🟡 | 0 | 1 | 0 | 0 | 🟡 | |
| F11 | 🟡 | 0 | 1 | 0 | 0 | 🟡 | **tension w/ operator clarify Q1** |
| F12 | 🟡 | 0 | 0 | 0 | 0 | 🟡 | no votes |
| F13 | 🟡 | 1 | 0 | 0 | +1 | 🟡 | Security wants it; 1 vote |
| F14 | 🟢 | 0 | 0 | 0 | 0 | 🟢 | |
| F15 | 🟡 | 1 | 3 | 0 | +1 | 🟡 | converged ×4 |
| F16 | 🟡 | 0 | 0 | 0 | 0 | 🟡 | |
| F17 | 🟡 | 0 | 0 | 0 | 0 | 🟡 | |
| F18 | 🟡 | 0 | 0 | 1 | −1 | 🟡 | Richards OVER-RATE; held |
| F19 | 🟠 | 2 | 3 | 0 | +2 | **🔴** | escalated 🟠→🔴; converged ×5 |
| F20 | 🟡 | 0 | 3 | 0 | 0 | 🟡 | |

**Gating 🔴 set (post-tally): F1, F2, F5, F6, F19.** Escalations: F7 🟡→🟠, F19 🟠→🔴.

### Round 2 brief

Three structural themes carried the round. **Enforcement-gap** (F4+F5+F6+F7+F19) is
the dominant one — five lenses independently found that the suite's headline
guarantees (anti-drift single-source, loud-fail on missing core) are *asserted in
prose and enforced nowhere in the runtime path*; F19 escalated to 🔴 as "the spec
promises behavior the architecture cannot deliver." **Secret-filter** (F1+F2, both
🔴, +F13) held strong: the findings→memory write surface is committed but its
control is an "unspecified noun," and the only acceptance test checks merely that
no callback code exists. **Parity-testing** (F11) converged (Beck test-design +
Goldratt economics) but stayed 🟡 because it *contradicts the operator's recorded
clarification* — voters honored the recorded choice rather than escalate over it.

### Gate A verdict — 🔴 HALT (operator decision required)

Five gating 🔴s. Per the self-heal loop, 🔴s normally auto-incorporate (clarify →
plan) and re-run while cycle < 3. **But two findings collide with decisions the
operator already recorded in `/speckit-clarify`, so the conductor must not
auto-incorporate over them (D2 — 🔴 never auto-proceeds; chair decides nothing):**

- **F6 (🔴) vs clarify Q3.** The operator chose "installer does nothing; stale-file
  cleanup out-of-band." Four lenses find that choice lets a re-install double-define
  the `I1–I9` catalog in the live dir — defeating the feature's anti-drift purpose.
  This 🔴 cannot be auto-incorporated without reversing a recorded operator decision.
- **F11 (🟡) vs clarify Q1.** Beck+Goldratt converge that byte-identical moves want a
  structural check, not full RED-GREEN; the operator chose "full parity for every
  skill." Held 🟡 (not gating), routed as a decision, not auto-changed.

**Auto-incorporable 🔴s (consistent with operator intent, queued):** F1, F2 (specify
the secret pre-filter as a deny-default behavioral contract + hard precondition on
the deferred callback + a negative acceptance test), F5, F19 (move the loud-fail
guard sibling-side, or state honestly that the fitness check — not a runtime marker —
is the enforcer; make SC-007 deliverable). Strongly recommended to fold in the
coupled 🟠s: F4 (FC1 "I-tokens reside in core" residence clause) and F7 (FC1/installed
-dir gap) — they are the enforcement half of F6.

Pipeline halts at Gate A pending operator direction on F6 + F11.

### Gate A · incorporation (cycle 2) — operator decisions applied

**Operator decisions (2026-06-20):** F6 → **keep no-migration, waive with
rationale**; F11 → **tier the parity testing**.

| Finding | Disposition | Where incorporated |
|---|---|---|
| F1, F2 (🔴) | resolved | FR-010a (secret pre-filter = deny-default + named detector + audit + hard precondition); SC-006 negative test; `contracts/findings-to-memory.md` |
| F5, F19 (🔴) | resolved | FR-002a (sibling-side substrate guard); SC-007 reworded; `contracts/chorus-core-substrate.md` |
| F4, F7 (🟠) | resolved | FR-008a residence clause; SC-001; `contracts/fitness-checks.md`; data-model FC1 note |
| F13 (🟡) | resolved | FR-010b sole-reach fence; `contracts/findings-to-memory.md` |
| F15 (🟡) | resolved | FR-013 wording corrected (3 on-disk agents unlisted) |
| F11 (🟡) | **operator: tiered** | FR-015 two-tier parity + F8 observable-output clause; plan Testing |
| F6 (🔴) | **operator: WAIVED** | FR-012 waiver note + quickstart manual upgrade step; rationale recorded (S4 — waived, not silently passed) |

Self-audit on the incorporation: no downstream artefact hand-patched in place of a
spec change (S5) — every fix lives in spec/contracts first, with plan/data-model
realigned to match. The 🔴 set is now {resolved: F1,F2,F5,F19} ∪ {waived w/ rationale:
F6}. Verification dispatch (below) is the re-run sensor for the resolved set.

### Gate A verification (re-run sensor) — CLEARED

| Finding | Author | Verdict | Residual (non-gating) |
|---|---|---|---|
| F1, F2 | Security | CLEARED | negative case is *documented* not yet executable — owed to the deferred-callback spec as a real test |
| F5, F19 | Norman | CLEARED | exact loud-fail message string to pin at authoring; SC-007's test must assert message content |
| F4, F7, F13 | Richards | CLEARED | 🟢 residence rule now restated in FC1 + FR-008a + SC-001 — canonicalize to one cited statement to avoid future drift |

**Gate A verdict: CLEAR (cycle 2).** Gating 🔴 set empty. Carry-forward 🟡/🟢 residuals
recorded above for Gate B / implementation; none blocks. Next: `/speckit-tasks` → Gate B.

---

## Gate B · plan/tasks review

**Corpus:** plan.md + tasks.md (31 tasks, 8 phases). No code yet → `spec-walkthrough`
skipped (greenfield, nothing to reconcile).

### RSVP (two-axis signal)

| Lens | Verdict | Applicability (cited) | Stakes |
|---|---|---|---|
| Richards · arch | JOIN | FC2 acyclicity (T020/T021) trails in Phase 6, after T015/T016 build sdlc | 🟡 |
| Beck · TDD | JOIN | T002 baseline-before-move + T010/14/18 demonstrate RED — Iron Law sequenced in | 🟢 |
| Delivery-Ops | JOIN | T028 manual upgrade step skippable → stale skill runs silently | 🟡 |
| Security | JOIN | T025 secret-filter is doc-of-contract, not executable; verifiability seam | 🟡 |
| Evans · DDD | JOIN | T019 reserved-seam contracts should be named contracts (Published Language) | 🟢 |
| Uncle Bob | JOIN | T006 CONDUCTOR.md = 5 concerns + catalog → god-doc watch | 🟡 |
| Norman · HCD | JOIN | T013/T017 name the guard but not message content / where operator reads it | 🟡 |
| Goldratt · scope | ABSTAIN | critical path minimal; no gold-plating before MVP — "honest no is a finding" | 🟢 |
| Cooper · product | ABSTAIN | still internal packaging; no end-user cost shifted | 🟢 |

J=7, abstain=2, exceptional=0. Seated (cap 5, mandate-distinct): Richards, Security,
Delivery, Norman, Uncle Bob. Out-seated (recorded default, override open): Beck, Evans
(both 🟢, confirming/low-new-signal).

### Findings register (RSVP-cited; self-rated; tally)

All findings single-lens, evidence-cited, self-rated 🟡/🟢. No two lenses converge to
PRIORITIZE any one finding → no escalation; severities hold. **No 🔴.**

| ID | Lens | Sev | Pull-quote (verbatim) | Disposition |
|----|------|-----|------------------------|-------------|
| GB1 | Richards | 🟡 | "Dependency-direction check should bracket the moves, not trail them." | **incorporated** — FC2 bracketed into T013/T017 |
| GB2 | Norman | 🟡 | "'fail loudly' is a signifier without text; the recovery action named in prose isn't asserted by any task." | **incorporated** — T013/T017 now require exact message content |
| GB3 | Security | 🟡 | "the obligation is documentation-of-contract, not executable code… verifiability is the open seam." | accepted — executable enforcement is the deferred harness (FR-019) + callback spec; contract+negative-case correct here |
| GB4 | Delivery | 🟡 | "the upgrade hazard lives in a doc step a hurried operator skips, not in code." | accepted — known F6-waiver residual (operator-chosen); sibling guard partially mitigates |
| GB5 | Uncle Bob | 🟡 | "that file risks becoming a multi-axis god-document." | watch — Gate-A-settled (F14: acceptable cohesion at scale; future INVARIANTS.md split) |
| GB6 | Evans | 🟢 | "the reserved-seam contracts are the Published Language across the new boundary; ensure they're named as contracts." | **incorporated** — T019 names them contracts |

### Gate B verdict — CLEAR

No 🔴. Three actionable 🟡/🟢s incorporated into tasks.md (GB1, GB2, GB6); three
recorded as accepted/deferred/settled (GB3, GB4, GB5). Goldratt's abstention affirms
the critical path is minimal. Proceed to `/speckit-implement`.

---

## Gate C · implementation review

**Corpus:** the built artifacts (staged, uncommitted) — `skill/chorus-core/*`,
`skill/chorus-review/*`, `skill/chorus-sdlc/SKILL.md`, `scripts/check-suite-integrity.sh`,
`tests/parity/*`, `install.sh`, `plugin.json`, `templates/CHORUS-PROJECT.template.md`.
**Fixed viewpoint:** `spec-walkthrough` skipped (designed for spec↔*code*; the artifacts
are markdown skills and anti-drift is already FC-verified) — orchestrator did a light
FR→artifact traceability instead (recorded proportionality deviation). **Self-audit of
build run by orchestrator:** FC1/FC2/FC3 re-run → EXIT 0; structure confirmed.
**Vote round:** not run — findings are single-authored and none self-rated 🔴
(proportionality deviation, recorded); author severities stand.

### Findings register

| ID | Lens | Sev | Pull-quote (verbatim) | Disposition |
|----|------|-----|------------------------|-------------|
| GC1 | Richards | 🟢 | "This is the rare Gate C where the design's own warnings were closed by the implementation." | confirmed — split faithful, I1–I9 intact, acyclic |
| GC2 | Richards | 🟢 | "FC2 guards chorus-sdlc by directory path only… a future file importing a chorus-sdlc concept token by name would slip it." | latent; ADR note (no current violation) |
| GC3 | Security | 🟡 | "the secret pre-filter is now triplicated… no fitness function asserts the three remain congruent." | carry-forward — add a grep-gate for the four anchor phrases |
| GC4 | Norman | 🟢 | "the guard message closes the gulf of evaluation in both siblings." | CLEARED |
| GC5 | Norman | 🟡 | "the guard is prose instruction… no behavioural test pins that this message actually emits on a missing-core path." | carry-forward — unasserted-emit (deferred to harness spec) |
| GC6 | Beck | 🟠 | "documents 'I1 … I9', actual run omits I3, because FC1 only checks tokens referenced outside their own file." | **fix now** — correct the doc claim + add catalog-completeness to FC1 |
| GC7 | Beck | 🟠 | "A test that greps for the error string it expects to fire is checking spelling, not behavior." | **routed to operator** — tier-2 proofs are grep file-presence, not the observable-behavior bar FR-015 set |

### Round 1 brief

The implementation is faithful: Richards verified (by `git diff`) the catalog moved
intact and the graph is acyclic; Security confirmed the Gate-A secret-filter 🔴 landed
as an enforced obligation in all three artifacts; Norman confirmed the guard message is
operator-actionable. The residual risk is **proof rigor, not code soundness** — Beck,
re-running the proofs himself, found the core RED demonstrations genuinely bite but the
*tier-2* parity proofs (content-changed skills) verify by `grep -c` over source text
rather than by observing the procedure run, which is the F8 gap he flagged at Gate A and
which FR-015 explicitly requires closed.

### Gate C verdict — CLEAR of 🔴 (GC7 routed)

No gating 🔴. GC6 fixed inline (honesty: the parity doc must not overclaim). GC7 routed
to the operator.

### Gate C incorporation — operator chose "require live behavioral proof now"

**GC7 resolved + verified** via three live subagent runs (calling-session executes the
built skills, observes real output) — recorded in `tests/parity/live-behavioral-proof.md`:
- **GREEN** review round: same 8-phase sequence + artifact path as baseline.
- **GREEN** sdlc gate: same gate sequence + ledger path; read-list contains **zero**
  `skill/chorus-review/` files (FR-006/SC-002 proven behaviorally, not by grep).
- **RED** core-absent: sibling guard fired, emitted the actionable message, STOPPED
  before Phase 0; core restored, FC1/2/3 re-pass.

**GC6 fixed + verified**: corrected the `core-conductor.md` overclaim (the dangling
check misses a within-file-only token like I3); added an unconditional
**catalog-completeness** assertion to FC1 — demonstrated RED (`CATALOG-INCOMPLETE: I3`,
exit 1 with CONDUCTOR.md hidden) then GREEN on restore.

**Carry-forwards (non-gating, recorded):** GC3 (secret-filter triplicated — add a
congruence grep-gate) and GC5 (guard is prose, not a runtime-asserted emit) → deferred
Jest/TS harness spec (FR-019). GC2 (FC2 path-only guard) → suite ADR note.

### Gate C verdict — CLEAR

Gating 🔴 set empty; GC7 (operator-elevated) resolved + verified by live behavioral
proof; GC6 fixed + verified. Suite built, behaviorally parity-proven, FC1/2/3 pass.
Proceed to memory-update (sign-off bookend).

---

## Memory update (sign-off)

Dispatched each seated persona to distill its OWN durable, generalizable learning
(orchestrator authored none — S1/S9). Durable-only rule applied (re-groundable locator
+ generalizes); secret pre-filter run by each persona; all learnings `lens-specific` →
🟢 auto-write to the persona's own record.

| Persona | Write-back | Durable lesson (one line) |
|---|---|---|
| Richards | `mark-richards-architect/project-suite-decomposition-residence-coupling.md` | extend-across-boundary invariants are static coupling; enforce token RESIDENCE not mere resolution |
| Security | `security-and-trust-advisor/feedback-contract-now-control-later-trap.md` | a write-surface contract ahead of its filter ships conforming-but-unsafe; deny-default + hard precondition |
| Beck | `kent-beck-persona/lesson-parity-proofs-observable-behavior.md` | parity proofs must execute the artifact + demonstrate RED; grep-for-error-string is checking spelling |
| Norman | `don-norman-advisor/feedback-fail-loud-guard-placement-and-message.md` | fail-loud guard must fire from the caller side + close the gulf of evaluation |
| Delivery-Ops | `delivery-and-ops-advisor/op-copy-installer-orphan-double-define.md` | copy-without-prune orphans a relocated invariant; source-only checks are blind to install-dir drift |
| Goldratt | `eliyahu-goldratt-advisor/feedback-tier-verification-by-change-kind.md` | match verification rigor to change-kind; behavioral tests on unchanged content buy inventory not throughput |

- **`project-wide` diff:** none surfaced (all learnings lens-specific) → no
  `CHORUS-PROJECT.md` write-back proposal owed; addendum byte-unchanged.
- **Secret-filter drops:** none reported on either path.
- **No-ops:** Uncle Bob, Evans, Cooper not dispatched (no durable cross-run learning
  beyond their recorded findings; Cooper/Evans largely abstained).

## End-of-run self-audit (S1–S9 + I/D)

| Inv | Holds? | Evidence |
|---|---|---|
| S1 | ✓ | every artefact via a phase-runner; orchestrator authored only the ledger; code built by the implement dispatch |
| S2 | ✓ | RSVP fired fresh at Gate A, B, C — no JOIN/ABSTAIN carried across gates |
| S3 | ✓ | no ordinary panel exceeded 5 (Gate A: 5 + Goldratt exceptional; Gate B: 5; Gate C: 4 reviewers); seating ties banded 🟡 with recorded default |
| S4 | ✓ | no gate passed with an open 🔴 — Gate A 🔴s resolved+verified or waived-with-rationale (F6); Gate C GC7 resolved+verified |
| S5 | ✓ | incorporations revised spec/contracts first; no downstream artefact hand-patched in place of a spec change |
| S6 | ✓ | every counted finding cited file:line or a principle tag (I8 gate) |
| S7 | ✓ | no gate loop exceeded 3 cycles (Gate A cleared cycle 2; B cycle 1; C cycle 2) |
| S8 | ✓ | author never graded own finding — Round-2 votes dispatched to non-authors |
| S9 | ✓ | severities from the deterministic tally over real votes; orchestrator synthesized no vote/severity |
| I9 / D1–D5 | ✓ | every operator-facing decision routed to the operator (F6, F11, GC7) or banded by declared predicate; chair decided nothing |

**Run complete.** Pipeline driven plan → Gate A → tasks → Gate B → implement → Gate C
→ memory-update. Suite built, behaviorally parity-proven, FC1/2/3 pass. Artifacts staged
for commit.
