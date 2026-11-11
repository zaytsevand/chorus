# Understanding — Mark Richards — PR #45 + #47 (round 2026-10-29)
Built: 2026-10-29 · Base: `docs/reviews/CHORUS-PROJECT.md` (addendum; stale on coryphaeus) · Prior: [[understanding-project]] (2026-06-10)
Target: branch `chorus-review-pr47` @ be31e5c vs origin/main 7eea2c2. Design review of approach and seams.

## Gates
- **#1 Ranked characteristics** → REFERENCED. `docs/reviews/CHORUS-PROJECT.md` § Architecture (~L102):
  1 conformance/reliability, 2 portability, 3 ease of change, 4 simplicity [operator-confirmed 2026-09-27].
  Bar: published plugin installed by strangers; installer/onboarding at full severity (§ Product ~L97).
  Freshness: 1 month old, but #47 changes the style (prose orchestration → program in the hot path), so a re-confirm is asked (gap Q2).
  Supersedes my 2026-06 *inferred* ranking in [[understanding-project]], which is now retired.
- **#2 Constraints** → REFERENCED, partly stale. § Hard constraints (~L113): markdown canon, Node with zero npm deps, Claude Code only, no hosted/long-running services, provider named only via the binding layer.
  STALE: the shape line (~L104, 2026-09-28) says "coryphaeus binds and checks; canon wins". #45 deleted coryphaeus; #47 adds code that *computes* outcomes as well as checking them. Whether the shape rule extends to that code is gap Q1.

## Referenced (locators)
- Style as built: prose canon `skill/chorus-core/{CONDUCTOR,GATE-PRIMITIVE,DECISION-PRIMITIVE,EXPLORATORY-PHASE}.md`. The procedure is now driven by a CLI loop: `CONDUCTOR.md` § The conductor loop (~L334); spec `specs/018-scripted-spine/spec.md` § Outcome, § Clarifications.
- Seams and contracts:
  (a) agent↔script, sync CLI: `schema/run-log.schema.json`, plus `conduct next` emitting one JSON action; exit codes 0/1/2/3 (`CONDUCTOR.md` ~L318).
  (b) persona↔conductor: rsvp/finding/vote schemas, checked by `bin/validate.mjs`.
  (c) code↔vocabulary: `schema/vocab.schema.json` → `bin/vocab.mjs`.
  (d) binding↔problem-brief: `BINDINGS.md`, `bin/bindings.mjs` (path probe).
- Dependency direction (runtime-checked): `validate.mjs` imports `QUORUM, SEAT_CAP, CYCLE_BOUND, tally` from `engine.mjs` (validate.mjs:41). That consolidates the tally/threshold authority in one module. `conduct.mjs` imports engine, vocab, validate and bindings.
- Fitness functions: `test/canon-drift.test.mjs` (canon prose ↔ code parity, Stage-4 tally); `test/vocab-lint.test.mjs` (inline enum, bare literal, prose near-miss, roster sync); `scripts/check-suite-integrity.sh` (residence; BINDERS_RE ~L338).
- Prior decisions: spec 018 Clarifications (2026-10-28, "assumptions taken without a live round-trip"); § Known limits (seat-drop corner, S11 one-at-a-time, self-audit S1/S9/S10 pass by construction).
- Change rate: engine.mjs and conduct.mjs exist in a single commit (be31e5c). There is no churn history yet, and this round is the first live run.

## Inferred (provisional, to verify in Round 1)
- **Duplicate authority, canon prose ↔ engine.mjs.** Constants with prose twins: SEAT_CAP=5, QUORUM=3, CYCLE_BOUND=3, RETRIES=1 (engine.mjs:15-21). The canon-drift parity test visibly covers the Stage-4 tally. I saw no parity assertion for seating cap, quorum, S7 bound, retries or S11 routing. Candidate ruling: SANCTIONED DIVERGENCE (code must exist; canon stays markdown) with incomplete drift detection. Validator messages also hard-code "five" and "J ≥ 3" (validate.mjs:409,480).
- **Portability coupling.** vocab-lint's roster test reads `<REPO>/.claude-plugin/plugin.json` (vocab-lint.test.mjs:168), which binds a test to the repo layout and fails inside an install (the operator saw this in dogfood). This is a deployment-topology assumption sitting in the fitness function.
- **Contract evolution of run.json.** The log is committed in the user's repo, and state is `derive(log)`. Any change to engine rules re-derives old logs differently. Nothing I saw versions the rule set in the log.

## Open gaps → questions raised this round
See handback (Q1–Q5).
