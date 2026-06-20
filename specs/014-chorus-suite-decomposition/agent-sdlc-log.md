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
- [ ] `/speckit-tasks` → tasks.md  ← next

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



- [ ] `/speckit-tasks` → tasks.md
- [ ] Gate B · plan/tasks review
- [ ] `/speckit-implement` → code + tests
- [ ] Gate C · implementation review
- [ ] Memory update (sign-off)

---
