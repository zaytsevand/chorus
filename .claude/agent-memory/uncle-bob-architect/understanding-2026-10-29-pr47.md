---
name: understanding-2026-10-29-pr47
description: Uncle Bob lens understanding record for chorus PR #45 + #47 (fold coryphaeus into chorus-core; scripted spine conduct.mjs/engine.mjs/vocab registry), exploratory phase 2026-10-29
metadata:
  type: project
---

# Understanding record — chorus PR #45 + #47 (clean code / SOLID lens), 2026-10-29

Locators, not copies. Re-ground every item in the live files before authoring.
Tree: worktree `chorus-review-pr47` @ be31e5c; base origin/main. Round context:
the orchestrator's context.md (deltas #45/#47, out-of-scope list).
Prior record [[understanding-chorus-review]] is for an older repo layout (skill/chorus-review only,
no runtime code); its project-wide facts on cite-never-restate still hold, its paths do not.

## Needs resolution

1. **Axes of change** — INFERRED (from CONDUCTOR.md § The conductor loop; spec 018 FR-007/FR-008).
   (a) canon rules (prose in CONDUCTOR/GATE/DECISION primitives) → `bin/engine.mjs` pure functions,
   each naming its section; (b) phase sequencing / which action comes next → `board()` in
   `bin/conduct.mjs:131-269`; (c) record shape → `assembleReview`/`assembleLifecycle`
   (conduct.mjs:430-552) + schemas; (d) closed vocabularies → `schema/vocab.schema.json` + `bin/vocab.mjs`;
   (e) persistence / CLI → `appendTo`, `main` (conduct.mjs:585, 695). (b),(c),(e) share one 764-line file.
2. **Dependency direction** — REFERENCED. Constitution I (cite never restate) — `.specify/memory/constitution.md`;
   CONDUCTOR.md § The conductor loop ("rules stay defined here … engine implements them as pure functions").
   engine.mjs imports only vocab (engine.mjs:9); no fs/process/Date — purity holds.
3. **Contract seams** — REFERENCED. Agent↔script: `schema/run-log.schema.json`; vocab registry
   `schema/vocab.schema.json`; persona replies validated by `bin/validate.mjs` per kind; action table in
   CONDUCTOR.md § The conductor loop. No generated artefacts. Note `appendTo` validates the whole log before
   every write (conduct.mjs:585-590) — "append-only" is a semantic, the file is rewritten whole.
4. **Test strategy** — REFERENCED. `node --test skill/chorus-core/test/*.test.mjs` (spec FR-012);
   engine.test (pure), conduct.test + kit.mjs (scripted e2e), vocab-lint (FR-004..006), canon-drift.
   Known live defect: vocab-lint roster test reads repo-root `.claude-plugin/plugin.json`
   (test/vocab-lint.test.mjs:168) — absent in an install.
5. **Naming / vocabulary** — REFERENCED. vocab.schema.json is the glossary for code; CONDUCTOR.md for prose.
   Watch: `board`, `group`, `outstanding`, `status`, `text`, `pick`, `a` — generic names in conduct.mjs.
6. **Known compromises** — REFERENCED. spec 018 § Known limits (seated-joiner corner vs validator,
   one-held-finding-at-a-time S11, self-audit S1/S9/S10 pass by construction). Do not re-flag as new.
7. **Public vs internal surface** — INFERRED. Public: the `conduct` CLI commands + exit codes 0/1/2/3
   (CONDUCTOR.md), schemas, vocab. conduct.mjs also exports derive/assemble/submit/fail/ack/answer/
   freeStem/initLog — used by tests; whether other skills may import them is unstated (gap Q4).
8. **Effect boundaries** — REFERENCED/INFERRED. Pure: engine.mjs, derive/assemble. Effects: writeFileSync
   at conduct.mjs:589 (appendTo), 717, 753-754 (record); exits in main/usage. submit/fail/ack/answer take
   `file` and write — effect visible at call site via the argument.

## Watch items (candidates for Round 1; re-ground first)

- W1: `board()` ~140 lines with sequential early-returns encodes the whole phase pipeline
  (RSVP → explore → author → gate answers → NEED_INFO → vote); every new phase/gate edits it.
  Five whys: is the linear shape deliberate (mirror of canon order, read top-to-bottom)? (gap Q2)
- W2: conduct.mjs mixes sequencing, record assembly, self-audit, persistence and CLI — several reasons to change in one module.
- W3: vocab-lint roster test couples a canon test to the source-repo layout (need 4 defect) — test-boundary vs packaging.
- W4: CHORUS-PROJECT.md still names skill/coryphaeus as composition root (stale addendum = stale anchor for every lens).
- Good seams to credit: engine purity + section citations; single vocab registry with lint; run log as the one state, record derived by replay (SC-002 determinism).

## Open gaps (sent to orchestrator)
See the gap-question list returned on 2026-10-29 (Q1–Q5).
