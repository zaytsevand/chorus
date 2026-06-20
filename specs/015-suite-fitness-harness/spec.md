# Feature Specification: Chorus Suite Fitness Harness

**Feature Branch**: `015-suite-fitness-harness`

**Created**: 2026-06-21

**Status**: Draft

**Input**: Discharge the test-harness seam that feature 014 deferred (FR-019)
and its two recorded carry-forwards (GC3, GC5). Feature 014 built three
greppable fitness checks in `scripts/check-suite-integrity.sh` (FC1
invariant residence + completeness, FC2 no-fat-sibling-import, FC3
manifest/roster sync) and explicitly deferred wiring them into an automated
test harness, plus two gaps it could not close in-scope: a congruence gate for
the triplicated secret pre-filter (GC3) and a behavioral test that the
sibling-side substrate guard actually emits its message on a missing-core path
(GC5). This feature establishes the repo's first automated test harness (and
CI entry point), wraps FC1–FC3, and adds the GC3 and GC5 tests — while keeping
the existing script the source of truth.

## Clarifications

### Session 2026-06-21

- Q: Does the harness reimplement the FC1–FC3 logic in TypeScript? → A: **No.**
  `scripts/check-suite-integrity.sh` remains the **source of truth**. The
  harness *invokes* the script as a subprocess and asserts on its exit code and
  emitted locators; it *extends* coverage (GC3, GC5) rather than re-deriving the
  existing checks. This keeps a single grep authority and avoids two
  divergent definitions of "integral."
- Q: How does the GC3 congruence gate handle phrasing variance? → A: The three
  copies of the secret pre-filter are **not byte-identical today** (e.g. "every
  drop is audited" is verbatim only in the template; CONDUCTOR.md says
  "recorded (visible, not silent)"; chorus-sdlc says "ledger-audited"). So GC3
  asserts the **load-bearing semantic anchors** are present in every copy — a
  per-anchor regex set tolerant of wording — not string-for-string identity.
  The anchors are the obligation's invariants: deny-default ("dropped unless it
  passes"), a named detector class including structured private facts, and an
  audit-on-drop line. (See FR-005.)
- Q: How is GC5 (the substrate-guard emit) tested without a real loader? → A:
  Reproduce the `tests/parity/live-behavioral-proof.md` RED procedure
  mechanically: temporarily hide `skill/chorus-core/`, drive the sibling's
  guard path, and assert the **exact guard message anchors** are emitted and
  that execution halts before the round/gate begins — then restore core. The
  loader still does not enforce `REQUIRED:`; the test pins the *authored guard
  text and its halt semantics*, which is the load-bearing contract the prose
  could silently lose. (See FR-006.)
- Q: Is a CI provider mandated? → A: The spec mandates a **single declarative CI
  entry point** that runs the harness on push/PR and fails the build on any
  non-zero check; the concrete provider (GitHub Actions) is the obvious default
  given the repo's `gh` usage but is an implementation choice, not a contract.

## User Scenarios & Testing *(mandatory)*

The "users" of this feature are the **suite maintainer** who evolves the chorus
skills and the **CI system** that gates merges. The maintainer must be able to
break an invariant (drift a token, fat-couple a sibling, desync the manifest,
diverge a secret-filter copy, weaken the substrate guard) and have an automated
run catch it — without manually remembering to run a shell script.

### User Story 1 - The fitness checks run automatically on every change (Priority: P1)

A maintainer opens a pull request that drifts an invariant token (or
fat-couples a sibling, or desyncs the manifest). Today that only surfaces if
someone remembers to run `scripts/check-suite-integrity.sh` by hand. With this
feature, an automated test suite runs the script in CI and fails the build,
naming the offending locator.

**Why this priority**: This is the whole point of FR-019 — the greppable checks
are only a safety net if something pulls the net taut on every change. An
un-invoked check is a check that rots.

**Independent Test**: Introduce a deliberate FC1/FC2/FC3 violation on a branch;
confirm the harness run exits non-zero and the CI job fails, surfacing the
script's locator output. Revert; confirm green.

**Acceptance Scenarios**:

1. **Given** the harness is installed, **When** `npm test` (or the documented
   command) runs, **Then** it invokes `scripts/check-suite-integrity.sh` and
   passes iff the script exits 0.
2. **Given** a branch with an injected FC1 residence violation, **When** the CI
   job runs on push/PR, **Then** the job fails and the script's offending
   locator appears in the test output.
3. **Given** a clean tree, **When** the CI job runs, **Then** all checks pass
   and the job is green.

---

### User Story 2 - The triplicated secret pre-filter cannot silently diverge (Priority: P1)

A maintainer edits the secret pre-filter language in one of its three homes —
`skill/chorus-core/CONDUCTOR.md`, `templates/CHORUS-PROJECT.template.md`, or
`skill/chorus-sdlc/SKILL.md` — and drops one of the load-bearing obligations
(say, removes the deny-default clause from the template). A congruence test
fails, naming the file and the missing anchor.

**Why this priority**: GC3 — the secret pre-filter is the FR-010a hard
precondition on the deferred findings→memory callback. It exists in three
places with no check that they stay congruent; a divergence that weakens one
copy is a silent security regression. This is the highest-value new coverage in
the feature.

**Independent Test**: Delete a deny-default / detector-class / audit-on-drop
anchor from any one of the three copies; confirm the congruence test fails and
names the file + the missing anchor. Restore; confirm green.

**Acceptance Scenarios**:

1. **Given** all three copies carry the deny-default, detector-class (including
   structured private facts), and audit-on-drop anchors, **When** the
   congruence test runs, **Then** it passes.
2. **Given** any one copy is missing one anchor, **When** the test runs,
   **Then** it fails and reports which file lacks which anchor.
3. **Given** a fourth file is later added as a copy of the pre-filter (out of
   scope to enumerate dynamically), **Then** the test's authored file list is
   the documented place a maintainer registers it. *(The set of homes is a
   small, named constant; widening it is a one-line edit, recorded as an
   assumption.)*

---

### User Story 3 - The substrate guard is proven to fire, not merely written (Priority: P2)

A maintainer (or an over-zealous refactor) weakens the sibling-side substrate
guard in `chorus-review` or `chorus-sdlc` so that a missing `chorus-core` no
longer halts loudly. A behavioral test that hides core and drives the guard
path fails, because the expected guard-message anchors are absent or execution
did not halt.

**Why this priority**: GC5 — the guard is the FR-002a runtime enforcement of
"fail loudly on absent core," but feature 014 could only assert it via prose +
a one-off manual live proof. This pins it as a repeatable test. P2 (not P1)
because the live-behavioral-proof already demonstrated it once and the loader
limitation means this remains a guard-text/halt assertion, not a true loader
enforcement test.

**Independent Test**: Run the GC5 test with core present (guard quiescent, round
proceeds) and with core hidden (guard fires, halts) — assert both branches.
Weaken the guard text on a branch; confirm the test goes RED.

**Acceptance Scenarios**:

1. **Given** `skill/chorus-core/` is reachable, **When** the GC5 test drives the
   sibling guard path, **Then** the guard is quiescent and the test records the
   round/gate would proceed.
2. **Given** `skill/chorus-core/` is hidden, **When** the GC5 test drives the
   sibling guard path, **Then** the guard's message anchors (names the missing
   skill, states broken/partial install, gives a recovery action) are emitted
   AND execution halts before Phase 0 / Gate A.
3. **Given** core was hidden during the test, **When** the test finishes
   (including on failure), **Then** `skill/chorus-core/` is restored — the test
   leaves the tree as it found it.

---

### User Story 4 - The harness stays proportional to a markdown skill suite (Priority: P3)

A maintainer adds the harness and finds it is a thin, readable wrapper — a small
test file per concern, one dev dependency surface, one CI file — not a framework
that out-masses the thing it guards.

**Why this priority**: The suite is markdown skills maintained by a small team.
An over-built harness is itself a liability (the Goldratt/Beck lens at 014's
gates). The proportionality bar is a first-class requirement, not an afterthought.

**Independent Test**: Count the harness surface (test files, dev deps, CI files);
confirm it is a small, auditable wrapper and that the shell script — not TS — is
still where check logic lives.

**Acceptance Scenarios**:

1. **Given** the harness, **When** a maintainer reads it, **Then** check logic
   for FC1–FC3 is not duplicated in TypeScript — the tests invoke the script.
2. **Given** the harness, **When** its dependency surface is inspected, **Then**
   it is limited to a test runner + its types (no incidental framework sprawl).

---

### Edge Cases

- **Script absent / not executable**: the harness must fail with a clear message
  (not a false green) if `scripts/check-suite-integrity.sh` is missing or
  non-executable.
- **Non-zero for a non-violation reason**: if the script errors for an
  environmental reason (e.g. `grep` missing), the harness surfaces the script's
  stderr rather than masking it as a violation.
- **GC5 cleanup on crash**: if the GC5 test aborts mid-run with core hidden, the
  restore MUST still run (teardown/`finally`), or the working tree is corrupted.
- **Anchor present-but-defanged**: GC3 can only assert the anchor *phrases* are
  present; a maintainer could keep the words and gut the meaning. The test
  closes the *deletion* hole, not semantic sabotage — recorded as a known limit.
- **CI on forks / no secrets**: the harness must run with zero secrets/network
  (it only greps local files), so it works on fork PRs and offline.

## Requirements *(mandatory)*

### Functional Requirements

**Harness & CI entry point**

- **FR-001**: The feature MUST introduce an automated test suite (Jest/TypeScript)
  as the repository's first test harness, runnable via a single documented
  command (e.g. `npm test`).
- **FR-002**: The test suite MUST invoke `scripts/check-suite-integrity.sh` as a
  subprocess and assert the suite passes **iff** the script exits 0; on non-zero
  it MUST surface the script's emitted locators in the test failure output. The
  script remains the **source of truth** for FC1–FC3 logic — the harness MUST
  NOT reimplement FC1/FC2/FC3 check logic in TypeScript.
- **FR-003**: The feature MUST establish a single declarative CI entry point that
  runs the harness on push and pull request and fails the build on any non-zero
  result. The harness MUST require no secrets and no network (it operates only
  on local repo files), so it runs on fork PRs and offline.
- **FR-004**: The harness MUST fail loudly (not false-green) if
  `scripts/check-suite-integrity.sh` is absent or non-executable, and MUST
  distinguish a check **violation** (script reports a fitness failure) from an
  **environmental** error (script could not run), surfacing the latter's stderr.

**GC3 — secret-pre-filter congruence gate**

- **FR-005**: The harness MUST add a congruence test asserting that the secret
  pre-filter's load-bearing anchors are present in **all three** of its homes —
  `skill/chorus-core/CONDUCTOR.md`, `templates/CHORUS-PROJECT.template.md`, and
  `skill/chorus-sdlc/SKILL.md`. The anchors (asserted per-file via wording-tolerant
  regexes, since the three copies are not byte-identical) are the obligation's
  invariants:
  - **deny-default** — the "dropped unless it passes" semantics (an excerpt is
    dropped unless it clears the filter; uncertainty defaults to drop);
  - **named detector class** — credential-shaped / high-entropy tokens AND
    **structured private facts** (internal hostnames, personal/customer names,
    ticket IDs);
  - **audit-on-drop** — every drop is recorded/audited (visible, not silent).
  The test MUST fail naming the offending file and the missing anchor. The
  authored three-file list is the single documented place a maintainer registers
  a new copy (FR-005 assumption).
- **FR-005a**: Where this gate can live in the shell script instead of TS at
  equal or lower complexity, it SHOULD be added to
  `scripts/check-suite-integrity.sh` (as "FC4 — secret-filter congruence") and
  invoked through FR-002, keeping all greppable check logic in the one source of
  truth. The harness then asserts on the script's FC4 result rather than
  re-grepping in TypeScript. *(The TS layer owns only what the shell cannot do
  cheaply, e.g. process orchestration and the GC5 behavioral run.)*

**GC5 — substrate-guard behavioral emit test**

- **FR-006**: The harness MUST add a behavioral test that, drawing on the
  `tests/parity/live-behavioral-proof.md` RED procedure, asserts the sibling-side
  substrate guard (FR-002a) actually fires on a missing-core path. The test MUST:
  - run a **GREEN** branch (core present → guard quiescent, round/gate would
    proceed) and a **RED** branch (core hidden → guard fires);
  - on the RED branch assert the guard **message anchors** are emitted — names
    the missing `chorus-core`, states broken/partial install, gives a recovery
    action — AND that execution **halts before Phase 0 / Gate A** (no silent
    degradation);
  - assert the guard text is sourced from the sibling `SKILL.md` files (so a
    maintainer weakening the authored guard turns the test RED).
- **FR-007**: The GC5 test MUST restore `skill/chorus-core/` in teardown even on
  failure or crash (the working tree is left exactly as found). It MUST operate
  on a copy/restore or move/restore that is safe to interrupt.
- **FR-008**: The spec MUST record GC5's honest limit: because the loader does
  not enforce `REQUIRED:`, this test pins the **authored guard text and halt
  semantics**, not loader-level enforcement. It supersedes the one-off manual
  live proof for that contract by making it repeatable, but does not change what
  is being asserted.

**Proportionality & scope**

- **FR-009**: The harness MUST be proportional to a markdown skill suite: a small
  number of focused test files, a minimal dev-dependency surface (a test runner +
  its types), and a single CI file. It MUST NOT grow a framework that out-masses
  the suite it guards.
- **FR-010**: The feature MUST NOT alter the reviewing/lifecycle behavior of any
  chorus skill, MUST NOT change persona-agent content or the roster, and MUST NOT
  build the deferred findings→memory callback (still FR-011-of-014's seam).
- **FR-011**: The feature MUST keep `scripts/check-suite-integrity.sh` as the
  canonical, still-manually-runnable check; the harness is an additive caller,
  not a replacement. Removing the harness MUST leave the script fully functional.

### Key Entities

- **Test harness**: the Jest/TS suite; the repo's first automated tests; invokes
  the shell script and adds the GC3/GC5 coverage.
- **CI entry point**: the single declarative pipeline file that runs the harness
  on push/PR and gates merges; secret-free and network-free.
- **`scripts/check-suite-integrity.sh`**: the existing source-of-truth fitness
  script (FC1–FC3, optionally gaining FC4 per FR-005a); the harness wraps it.
- **Secret-pre-filter anchors**: the deny-default / detector-class / audit-on-drop
  invariants that GC3 asserts congruent across the three homes.
- **Substrate guard**: the sibling-side FR-002a fail-loud-on-absent-core text in
  `chorus-review` / `chorus-sdlc` SKILL.md that GC5 proves emits + halts.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A single documented command runs the full harness; on a clean tree
  it exits 0, and an injected FC1/FC2/FC3 violation makes it exit non-zero with
  the script's locator surfaced — demonstrated RED then GREEN.
- **SC-002**: The CI entry point runs the harness on push and PR and fails the
  build on any non-zero result, with no secrets and no network required (passes
  on a fork/offline run).
- **SC-003**: The GC3 congruence gate passes when all three secret-filter copies
  carry the deny-default, detector-class (incl. structured private facts), and
  audit-on-drop anchors, and fails — naming file + missing anchor — when any one
  copy drops an anchor (demonstrated by a deletion negative case).
- **SC-004**: The GC5 behavioral test passes with core present (guard quiescent)
  and with core hidden asserts the guard's message anchors emit AND execution
  halts before Phase 0 / Gate A; it leaves `skill/chorus-core/` restored after
  the run (including on failure). Weakening the authored guard text turns it RED.
- **SC-005**: FC1–FC3 check logic is not duplicated in TypeScript — the harness
  invokes `scripts/check-suite-integrity.sh`; removing the harness leaves the
  script fully functional (verified by running the script standalone).
- **SC-006**: The harness surface is proportional — a small set of test files, a
  minimal dev-dependency footprint, one CI file — auditable in a single read.

## Assumptions

- `scripts/check-suite-integrity.sh` stays the source of truth; the harness
  invokes and extends it rather than re-deriving FC1–FC3. (Two definitions of
  "integral" would themselves be a drift surface.)
- The set of secret-pre-filter homes is a small named constant (three files
  today). Widening it is a recorded one-line edit to the gate's file list, not a
  dynamic discovery problem at this scale.
- The three secret-filter copies are not byte-identical; GC3 asserts semantic
  anchors via wording-tolerant regexes, closing the **deletion** hole — it cannot
  catch semantic sabotage that keeps the words and guts the meaning (recorded
  limit, mirrors 014's honesty posture).
- GC5 pins authored guard text + halt semantics, not loader enforcement (the
  loader does not enforce `REQUIRED:` — carried from 014's assumptions and the
  live-behavioral-proof caveat). The test makes the manual live proof repeatable.
- A test runner with TypeScript support is acceptable as the repo's first dev
  dependency; the harness needs only local file access (no secrets/network),
  consistent with a markdown skill suite at small-team scale.
- GitHub Actions is the natural CI provider given the repo's `gh` usage, but the
  contract is "a single declarative CI entry point," not a specific provider.
