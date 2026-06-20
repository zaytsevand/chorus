# Live behavioral parity proof (Gate C · GC7 incorporation)

Operator required a **live behavioral proof** (not grep/file-presence) to satisfy
FR-015 tier-2 for the content-changed skills. Three subagents acted as the calling
session, executing the BUILT skills and reporting observable output. Results below.

## GREEN-1 — review round (chorus-review)

A calling session read `skill/chorus-review/SKILL.md` and followed it literally:
- Substrate guard PASSED (chorus-core reachable); all four core companion files +
  `chorus-review/INTEGRATION-LAYER.md` reachable.
- **Observable phase sequence derived:** Phase 0 → 0.5 → 0.7 → 1 → 2 → 3 → 4 → 5
  (same purposes, gate-primitive staging, I8 evidence discipline as baseline).
- **Artifact path:** `docs/reviews/YYYY-MM-DD-chorus-review.md` (+ abstain fallback
  `…-chorus-abstained.md`).
- **PARITY: MATCH** vs `baseline.md` — same procedure, relocated source.

## GREEN-2 — sdlc gate (chorus-sdlc) + dependency independence

A calling session read `skill/chorus-sdlc/SKILL.md` and followed it literally:
- Substrate guard PASSED; core router self-check passed.
- **Observable gate sequence:** plan → Gate A → tasks → Gate B → implement → Gate C →
  memory-update (no acceptance gate; 3-cycle self-heal bound; S5 incorporation).
- **Ledger path:** `specs/<feature>/agent-sdlc-log.md` (NOT under docs/reviews/).
- **Dependency check (FR-006/SC-002):** the COMPLETE list of files the skill directed
  the session to read contained **zero** files under `skill/chorus-review/`. The only
  occurrences of the string "chorus-review" are independence prose ("independent of",
  "shares no file"). **No fat-sibling dependency — proven behaviorally.**
- **PARITY: MATCH** vs baseline.

## RED — core absent (substrate guard fires)

`skill/chorus-core/` was temporarily moved away; a calling session read
`skill/chorus-review/SKILL.md` and followed the guard:
- `ls skill/` showed only `chorus-review/`, `chorus-sdlc/` — core unreachable.
- **Guard FIRED.** Verbatim message emitted (SKILL.md guard): *"**chorus-core is
  missing.** … This means a broken or partial install of the chorus suite … the round
  cannot run honestly. **Recovery:** re-install the chorus suite (`./install.sh`), or
  check that `chorus-core` was published/copied under its expected name, then retry."*
  — names the missing dep ✓, states broken/partial install ✓, gives recovery ✓.
- **STOPPED** before Phase 0 — did not read INTEGRATION-LAYER, did not run the
  scope-exclusion gate, did not dispatch agents. No silent degradation.
- core restored; FC1/2/3 re-run → PASS.

## Verdict

FR-015 tier-2 met behaviorally: the content-changed skills (chorus-review,
chorus-sdlc) drive the same observable procedure as pre-split (GREEN) and fail loudly
+ halt when the substrate is absent (RED). This supersedes the prior grep-level tier-2
records (GC7). Caveat (honest, carried forward): the guard is honored by the calling
session following the skill text; the loader does not enforce `REQUIRED:` — a runtime
assertion is the deferred-harness spec's job (GC5).
