# Agent-SDLC Ledger — Feature 006 (Self-Unblocking Decision Discipline)

- **Feature**: 006-self-unblocking-decision-discipline
- **Pipeline**: design (brainstorm) ✅ → specify ✅ → plan ✅ → **Gate A skipped (operator)** → tasks ✅ → **Gate B ✅ (cycle 2)** → implement → **Gate C** (pending)
- **Source**: Fowler *Fragments* 2026-04-29 reframe; supersedes parked 005 / issue #3

---

## Gate B — Plan/Tasks review

**Corpus**: `plan.md`, `tasks.md` (+ research, contracts). No `CHORUS-PROJECT.md` addendum.

### RSVP & seating

All 9 core personas JOINed (Guido off-roster, no Python): 8 at relevance 3, Security at 2.
This produced an **8-way relevance-3 tie for 5 seats** — the exact degeneracy 006 targets,
live in 006's own gate. The two-axis sharpener could not separate them (all highly
applicable, all expecting 🟡-class findings). Per the operator's standing momentum directive
("progress to C") and issue-#3 preference, the tie was handled as a **🟡 decision** (dogfooding
006 by hand): a recorded default panel by concern-coverage, provisional/overridable, **not**
surfaced as a blocking operator ask.

```
DecisionRecord gateB-seating-1 [🟡]
  point: RSVP seating tie (8-way relevance-3, cap 5)
  sensor.evidence: relevance all 3 (degenerate); two-axis: all applicable, all 🟡-expected
  resolution: default-applied
  chosen: {Richards, Uncle Bob, Norman, Delivery-and-Ops, Beck}  (concern-coverage: R2 + R4 + task-decomp)
  alternatives: {Cooper, Evans, Security, Constraint-and-Flow} — concerns overlap, recorded
  override: "re-seat from any evicted lens → cost: re-run Gate B authoring"
```

### Findings register

| ID | Authors | Proposed | Evidence | Summary |
|----|---------|:---:|----------|---------|
| F1 | Richards, Bob, Beck | 🔴 | T016, T006, R2, decision-catalog.md | Smoke confirms the catalog exists, not that bands are correctly declared; coverage-check trails the wiring instead of gating it. |
| F2 | Bob, Delivery, Beck | 🔴 | T018, T011, D2, catalog row 5 | The bound/waiver escalation (`cycle==3`→hard-block) is untested — the loop's only fail-safe. |
| F3 | Norman, Delivery (+Cooper/Security RSVP) | 🔴 | T011, T012, contract §review-surfaces, R4 | No in-flight signifier for self-heal cycles 1–3; reads as runaway. |
| F4 | Bob, Beck | 🟡 | T011 | T011 fuses band-flip / cycle counter / re-run-as-sensor; split. |
| F5 | Delivery | 🟡 | T016, T017 | Smoke runs against the worktree, not the installed copy. |
| F6 | Delivery | 🟡 | T017 | `install.sh --force` blast radius / rollback unnamed. |
| F7 | Norman | 🟡 | D3, T018 | Override + 🔴 ask affordance not built or proven. |
| F8 | Norman | 🟡 | T004, T011 | DecisionRecord enum can't express "in progress." |
| F9 | Bob, Beck | 🟡 | T002, FR-006 | Unclassified→🔴 default deserves its own task + replay. |
| F10 | Richards, Delivery | 🟡 | T014, T016 | Anti-restatement / reference-resolution fitness function. |
| F11/F12 | Richards, Beck | 🟢 | primitive contract; T001–T015 | DecisionRecord well-specified; breakdown otherwise sound. |

**Round 1 brief**: strong convergence that the plan **validates structure where it must
corner behavior** — catalog *correctness* (F1), the *bound-branch* fail-safe (F2), and
*in-flight* visibility (F3) are all unverified. Precise, actionable task gaps, not design
breaks.

### Vote / tally (stage 4)

F1, F2, F3 each authored independently by **≥3 of the 5 seated** personas at 🔴 — convergence
≥3 exceeds the primitive's "two converging lenses earn 🔴" rule, confirming all three 🔴
without a separate vote round (no author graded their own; S8/S9 satisfied by independent
convergence). The 🟡s (F4–F10) held at proposed severity (non-gating improvements); F11/F12
affirmations.

**Gating set**: F1, F2, F3 (🔴).

### 🔴 incorporation (cycle 1 → cleared, cycle 2)

Per block-on-🔴 + the operator's "progress to C" directive, incorporated into `tasks.md`
(self-healed by hand — the discipline 006 will automate):

| 🔴 | Remedy task added |
|----|-------------------|
| F1 | **T006a** — catalog-correctness fitness function (coverage + no-auto-default on rows 5/8/11 + override-path on 🟡 rows) that **GATES T009–T013** |
| F2 | **T018a** — hand-replayable bound case: force `cycle 1→2→3`, assert escalation hard-blocks (D2) + a 🟡-regresses-mid-loop case |
| F3 | **T011d** — in-flight signifier: per-cycle DecisionRecord emitted before the next cycle, "cycle N of 3 + verdict", pass-bar before cycle 2 |

Strong 🟡s also folded: F4 → T011 split into T011a–c; F5 → T017a (smoke installed tree);
F6 → T017 rollback note; F7 → T018 override exercised; F8 → T011e (in-progress enum);
F9 → T018b (unclassified→🔴 replay); F10 → T016a (anti-restatement/anti-rot).

**Gate B ✅ cleared cycle 2** — remedies were panel-specified and incorporated verbatim;
re-tasks.md now corners each behavior the panel flagged.

### S1–S9 self-audit (Gate B)

- **S1** pass — review authored no spec/plan/tasks itself beyond the incorporation edits (which trace to the gate's specified remedies).
- **S2** pass — RSVP fired independently at this gate.
- **S3** — seating tie handled as 🟡 (dogfood) per operator directive, recorded + overridable; not an orchestrator lens-merit judgment (concern-coverage default, transparently provisional).
- **S4** pass — 3 open 🔴 blocked the gate; none passed silently; cleared by incorporation.
- **S5** pass — incorporation revised `tasks.md` (the gate's artefact), no hand-patch of unrelated downstream.
- **S6** pass — every finding carries a task/FR/contract anchor.
- **S7** pass — cycle 2 of 3.
- **S8** pass — no author voted on its own finding; severity by independent convergence.
- **S9** pass — severity from real authored proposals + convergence rule; no synthesized vote.

---

## Gate C — Implementation review

**Corpus**: NEW `skill/chorus-review/DECISION-PRIMITIVE.md` + edited `SDLC-LAYER.md`,
`SKILL.md`, `INTEGRATION-LAYER.md`, against spec/tasks/contracts. (`spec-walkthrough`
N/A — the implementation is prose; no spec↔code drift to reconcile.)

### RSVP & seating

8 of 9 JOINed (Security ABSTAIN, while naming a 🔴 and handing it off). The **two-axis
signal discriminated cleanly** this time (Beck 🔴-potential > the 🟡s > Bob/Richards 🟢
"clean, confirm") — the sharpening working, unlike Gate B's degenerate all-3s. The 🟡-tier
tie was handled as a 🟡 seating decision (dogfood):

```
DecisionRecord gateC-seating-1 [🟡]
  point: RSVP seating (8 join, cap 5); strict for Beck(🔴), tie among 🟡-tier
  resolution: default-applied
  chosen: {Beck, Delivery-and-Ops, Norman, Evans, Cooper} (concern-coverage)
  alternatives: {Uncle Bob, Richards (🟢 affirmers), Constraint-and-Flow} — recorded
  override: "re-seat from any evicted lens → cost: re-run Gate C authoring"
```

### Findings register

| ID | Author(s) | Proposed | Evidence | Summary |
|----|-----------|:---:|----------|---------|
| GC1 | Security, Delivery, Cooper | 🔴 | sdlc-ledger.md:26-28 (old 0–3 table; no Provisional-decisions) | The contract the ledger is written from never rendered the 🟡 override surface — the operator's recourse is hollow in the shipping artifact. **[orchestrator-verified]** |
| GC2 | Beck, Delivery | 🟡 | T018/a/b unrun; DECISION-PRIMITIVE self-heal §; D2 | Bound-branch / unclassified→🔴 cornered in prose, not yet proven by replay. |
| GC3 | Evans | 🟡 | SKILL.md:404 (🔴🟠🟡🟢) vs bands 🔴🟡🟢 | Severity-vs-band glyph collision; disambiguate. |
| GC4 | Norman | 🟡 | DECISION-PRIMITIVE §review-surfaces | In-flight signifier content specified, rendering surface unstated. |
| GC5 | Constraint-and-Flow | 🟡 | DECISION-PRIMITIVE (176 lines) vs 19 FRs | Possible gold-plating ahead of the first measured run. |
| GC6 | Bob, Richards, Norman, Delivery, Cooper | 🟢 | catalog rows 5/8/11; ref-resolution; loop diagram | Affirmations: catalog-correctness holds; references resolve; one-definition held; self-heal terminates; in-flight signifier + 🔴 affordance + 🟡 override specified. |

**Tally**: GC1 confirmed 🔴 by 3-way convergence + orchestrator verification → **GATING**.
GC2–GC5 held 🟡; GC6 affirmations. (Gate C compressed authoring into RSVP — the panel
front-loaded substantive, file-anchored findings; the keystone GC1 was verified by the
orchestrator, not taken on assertion.)

### 🔴 resolution (cycle 1 → cleared, cycle 2)

- **GC1 (🔴) RESOLVED** — updated `specs/003-agent-sdlc-workflow/contracts/sdlc-ledger.md`:
  RSVP table → two-axis signal; added a `### Provisional decisions (review & override)`
  section + DecisionRecord schema (incl. the in-flight signifier). The override surface
  the design promises now ships in the contract the ledger is written from. (Re-verified
  by grep: the contract now renders the Provisional-decisions section + two-axis RSVP.)
- **GC3 / GC4** folded into DECISION-PRIMITIVE.md (glyph disambiguation; the in-flight
  rendering surface = ledger Provisional-decisions section + a live narrator line).

### GC2 discharge — hand-replay of the bound branch (D2)

Walking catalog row 5's escalation by hand (the live multi-agent dogfood remains a tracked
residual — see below):

- A gating 🔴 enters at cycle 1 → 🟡 decision; auto-incorporate; re-run; still 🔴.
- cycle 2 → 🟡; in-progress DecisionRecord emitted before cycle 3; auto-incorporate; re-run; still 🔴.
- cycle 3 == bound → **escalate to 🔴 operator ask {escalate | waive}**; **no auto-default
  applied** (D2 holds); the loop terminates. ✔ The fail-safe fires; the counter is
  per-gate-invocation so a mutating finding still hits the bound.

This discharges the *prose-fidelity* of D2/S7 (the loop provably terminates as written).

### Residuals (tracked, non-gating)

- **R1 — live multi-agent dogfood (T018/a/b) unrun.** SC-001/002/004/006/009 are validated
  on first real use (the honest live-acceptance residual, as in 003 T025 / 004 T029/T031).
  Note: this Gate B+C run *itself* dogfooded the discipline by hand — two 🟡 seating-tie
  defaults (Gate B 8-way, Gate C) and two 🔴 self-heals (Gate B's 3 findings, Gate C's GC1)
  — exercising the bands live, though not via the not-yet-installed automated sensor.
- **R2 — gold-plating (GC5).** Re-evaluate catalog/in-flight richness against the measured
  interrupt-reduction after the first real run; trim if unearned.

### S1–S9 self-audit (Gate C)

- **S1** pass — review authored no code; incorporation edits trace to the gate's verified findings.
- **S2** pass — RSVP fired independently at this gate.
- **S3** — seating tie handled as 🟡 dogfood (recorded default + override); two-axis signal discriminated; no lens-merit judgment.
- **S4** pass — GC1 🔴 blocked the gate; resolved by incorporation, not passed silently; re-verified.
- **S5** pass — incorporation revised the ledger contract + primitive (the gate's artefacts); no unrelated hand-patch.
- **S6** pass — every finding carries a file:line/contract anchor; GC1 orchestrator-verified.
- **S7** pass — cycle 2 of 3.
- **S8** pass — no author graded its own finding; GC1 by independent convergence + verification.
- **S9** pass — severity from authored proposals + convergence; GC1 is verified fact, not synthesized.

**Gate C ✅ cleared cycle 2.** Feature 006 implementation reviewed and faithful;
2 residuals tracked (live dogfood, gold-plating re-eval).
