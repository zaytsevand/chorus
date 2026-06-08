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
