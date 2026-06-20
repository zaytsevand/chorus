---
name: project-014-suite-decomposition
description: feature 014 chorus suite decomposition (Gate A) — infra; constraint = chorus's own maint/iteration cost + verdict trust; contract is recording-not-inventing (cheap); parity over-rigorous on 3 as-is files
metadata:
  type: project
---

Feature 014 splits single `chorus-review` skill (~1880 lines, 6 files) into `chorus-core` (substrate) + `chorus-review` + `chorus-sdlc`. Build-now: the split + anti-drift (single-source I1-I9 in core) + loud-fail self-check + 3 greppable fitness checks + findings→memory CONTRACT (impl deferred). Future 3 skills + callback wiring = reserved seams, not built.

**Constraint (Gate A, re-validated 2026-06-20):** infra; chorus reviewing itself. Binding constraint = chorus's OWN iteration/maintenance cost + verdict trustworthiness. The split IS on the constraint: it kills the fat-sibling coupling (S1-S7 extend I1-I9; if I1-I9 stayed in review, sdlc depends on review through audit-chain lineage — the exact coupling the suite exists to kill). Anti-drift (FR-007/008), loud-fail (FR-002/edge cases), fitness check #1/#2 are all on-constraint and NOT deferrable.

**Two build-now investments priced:**
- (a) findings→memory CONTRACT (FR-009/010, D7): VERIFIED both artifacts already exist — findings register w/ Summary+tags in SKILL.md Phase-1; two-tier memory + agent-memory/<persona>/ in EXPLORATORY-PHASE.md. So contract = "writing down what's load-bearing," NOT inventing a future interface. Cost to write ≈ cost to defer-then-rediscover. Marginal cost tiny; operator already chose KEEP. My verdict: do not re-litigate — but the FR-009 ADDENDUM-TEMPLATE edit (a new fillable section in CHORUS-PROJECT.md) is the only part with ongoing carry cost (a documented config knob with zero consumer). That, not the core doc, is the demotable sliver.
- (b) maximal parity = full RED-GREEN for EVERY moved/split skill incl. 3 as-is mechanical moves (GATE-PRIMITIVE 161, DECISION-PRIMITIVE 183, EXPLORATORY-PHASE 275 = 619 lines moved byte-identical). GOLD-PLATES A NON-CONSTRAINT. A byte-identical relocation's risk is "did the bytes move + is it still reachable" — a structural/checksum check + the loud-fail reachability self-check settle that. Full behavioral RED-GREEN on unchanged content buys correctness the change cannot justify. Reserve maximal RED-GREEN for the files whose CONTENT changes: INTEGRATION-LAYER split, SKILL slim, SDLC cross-ref rewrite.

**Evaporating cloud (parity rigor):** arm A "prove every skill" assumes content moved=behavior at risk. arm B "structural check suffices for as-is" assumes relocation w/o edit can't change behavior. The assumption that evaporates: for a byte-identical move the only failure is non-reachability — which the loud-fail self-check + fitness check #1 ALREADY cover. So the RED-GREEN adds no signal the cheaper sibling doesn't.

**How to apply:** On 014 impl/later gates — (1) the split, anti-drift, loud-fail, fitness #1/#2 are hard, on-constraint, never defer; (2) push parity rigor to: full RED-GREEN only for content-changed files (INTEGRATION-LAYER, SKILL, SDLC); structural+reachability check for the 3 as-is moves; (3) the findings→memory CORE doc stays (recording reality); the FR-009 addendum-template fillable section is the one demotable sliver if carry cost is questioned. Do NOT defer FR-013 manifest fix (the manifest is already drifted/wrong = a live verdict-trust defect).

Related: [[project-chorus-exploratory-phase]] (same infra constraint; two-tier memory this contract documents).
