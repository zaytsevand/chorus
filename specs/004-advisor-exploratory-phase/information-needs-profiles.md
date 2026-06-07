# Advisor Information-Needs Profiles (nominated round, 2026-06-07)

Each advisor nominated its **own** distinctive information-needs profile for the
exploratory phase (FR-001) — not a template imposed from outside. Source tags:
**[ref]** typically found in a repo artefact to reference · **[infer]** usually
requires the advisor's analysis · **[op]** usually requires an operator
interview. ★ marks the single need each advisor named as most load-bearing.

**Cross-cutting finding:** nearly every advisor's ★ need is **[infer]/[op]**, not
[ref] — the most decision-critical thing each lens needs is the thing least
likely to be written down. This is why the analysis-then-interview path
(FR-006/007) is load-bearing, not a fallback, and why reference-first harvesting
(FR-003/004) alone is insufficient.

## Eric Evans — DDD / domain model
1. ★ Ubiquitous language — the terms experts use, and whether code speaks them [ref glossary/model/tests · else op]
2. The Core Domain (which part, if mediocre, makes the product mediocre) [op/infer]
3. Subdomain classification — Core / Supporting / Generic [infer · op]
4. Bounded contexts and their boundaries (where a term changes meaning) [infer]
5. Context map + seam contracts (who conforms, who translates) [ref API/schema · else infer]
6. Aggregates and the invariant each protects [ref tests/guards · else op]
7. Domain events that should exist [ref event types/schemas/logs · else infer]
8. Architectural outer constraints (layering, ORM-only, API-first) [ref CLAUDE.md/ADRs/constitution]

## Mark Richards — architecture / the -ilities
1. ★ Ranked architectural characteristics (top 3–7 -ilities) [infer + op · sometimes NFR doc]
2. Architecture style as-built, not as-named [ref arch doc/C4 · else infer]
3. Seams and the contract type pinned at each [ref OpenAPI/AsyncAPI/typed ifaces · absence is a finding]
4. Data ownership & transactional boundaries [infer schema · confirm op]
5. Distributed-workflow shape — orchestration vs choreography, where state lives [infer · ref sequence diagram]
6. Existing fitness functions / governance gates [ref CI/arch-tests]
7. Real change rate & load profile [ref git churn/metrics · else op]
8. Prior decisions and their drivers [ref docs/adr]

## Alan Cooper — adversarial product
1. ★ The named user and the goal that brings them [ref brief/personas/user-stories · else op]
2. Operator vs end-user, and how they differ [infer · op]
3. What the user knows vs what the system assumes they know [infer]
4. Which actions are irreversible / touch the real world [ref spec side-effects · else infer]
5. What each error / terminal state leaves the user able to do next [infer]
6. Whether a contract is written at all, and if it matches behaviour [ref flag docs/API · else infer]
7. Who honestly benefits from each contested decision [infer]

## Don Norman — human-centred design / UX
1. ★ Who the user is and what they came to do (goals, not tasks) [README/persona · else infer/op]
2. All entry points and the actions they afford [ref CLI help/UI inventory]
3. The feedback surface for every state change [ref strings/status · infer]
4. Error catalog and its recovery paths [ref error strings/exit codes · infer]
5. The conceptual model the system intends to project [ref docs/onboarding/naming · infer]
6. Cross-component contracts the user crosses [ref specs/schemas · infer]
7. Where spec / interface / runtime disagree (three voices) [cross-read]
8. Operator vs user (distinct mental models) [infer/op]

## Uncle Bob — clean code / SOLID / boundaries
1. ★ The axes of change (what varies independently) [infer/op · roadmap]
2. The intended dependency-direction rule [ref boundaries doc/lint config]
3. Contract seams, and which are hand-edited generated artefacts [ref schema/IDL/codegen]
4. Test strategy and its seams (what "tested" means here) [ref test dirs/CI]
5. Naming & domain vocabulary (load-bearing names) [ref glossary · infer]
6. Known pragmatic compromises (knowingly accepted violations) [op · ADRs/comments]
7. Public API vs internal surface [ref exports/__all__/semver]
8. Effect boundaries — where I/O is sanctioned vs pure logic [ref arch doc · infer]

## Kent Beck — TDD / simple design / feedback loops
1. ★ The feedback loop and its length (change → know-if-broken) [ref CI/runner config · timing infer/op]
2. Whether tests assert behaviour or merely exercise code [ref suite · infer assertions]
3. What coverage actually protects — which behaviours are pinned [ref coverage report]
4. What can be cornered by a unit test vs resists (hidden effects) [infer]
5. Cross-component contracts; any enforced only by a test [infer]
6. Whether structural and behavioural changes are tangled in history [ref git log/PRs]
7. The project's own "done" and TDD stance [ref constitution/CONTRIBUTING/CLAUDE.md · infer]

## Delivery-and-Ops — Farley · Hightower · Majors
1. ★ The release path, end to end (commit → running thing) [ref workflows/deploy/scripts]
2. Rollback mechanism and its cost [ref deploy scripts/tags · infer]
3. Behavioural assertions shipped with changes (real gate vs decorative) [ref CI/smoke]
4. Boundary contracts at process/network/storage lines [ref OpenAPI/schema · infer]
5. Hidden effects bundled into deploy steps (migrate, rotate, invalidate) [ref scripts · infer/op]
6. Observability surface and its run cost [ref dashboards/alerts/log config · op]
7. Complexity-vs-scale fit (actual team size & traffic) [op]
8. Known failure history (what has paged/surprised the team) [ref incidents/runbooks · op]

## Security-and-Trust — Schneier · Shostack · Nather
1. ★ Trust boundaries, drawn or undrawn (where trust changes hands) [ref DFD/arch · mostly infer]
2. What crosses each boundary, and what it's meant to enforce [ref API contracts · infer]
3. Authn/authz surfaces and the principal model [ref auth config/middleware/IdP]
4. Data surfaces with regulatory/reputational consequence [ref schema/env · op for regime]
5. Supply-chain entry points and their trust assumptions [ref manifests/lockfiles · infer]
6. Egress surfaces — where data leaves the boundary [infer network/client code]
7. Secret/key handling and rotation reality [ref env/secret wrappers · op]
8. Team operating capacity — the security poverty line [op]
9. Existing threat model, written vs actually used [ref threat-model doc · op]

## Constraint-and-Flow — Goldratt · Reinertsen
1. ★ Are there real users yet, or only operator/test accounts? [infer + op · roadmap/analytics]
2. The current bets — hypothesis + target metric per in-flight feature [ref roadmap/spec intent/CHORUS-PROJECT.md]
3. The validated-learning loop's shape and cycle time [ref release path/flags/telemetry · infer latency]
4. The slowest serialized verdict path specifically [infer CI/e2e/manual]
5. Batch size & WIP (PR size, branch age, unverified queue) [ref git history/open PRs/CI scope]
6. Cost-of-delay surfaces (deadlines, market windows) [op · roadmap milestones]
7. Hard invariants already flagged (not mine to defer) [ref peer findings/FRs/constitution]
8. Other personas' "invest now" findings, read for deferability [ref prior artefacts]
9. Constraint history — where the bottleneck sat before, did it move [ref own memory/past artefacts]

## Guido — Python language lens (opt-in; joins only Python rounds)
1. ★ Supported Python version floor, and whether it's enforced [ref requires-python/CI/ruff target] — *language-lens-only*
2. Type checker in CI, which, and strictness [ref mypy/pyright/CI] — *language-lens-only*
3. Lint/format regime already in force [ref ruff/flake8/black/isort] — *language-lens-only*
4. Public API surface vs internal code [ref __all__/exports · infer]
5. Declared dependencies (what's already on the path) [ref pyproject/requirements/lock]
6. Stdlib-vs-handroll house decisions [infer · op]
7. Runtime / concurrency model (async/threads/loop) [infer/op]
8. Packaging shape — app vs library [ref build-system/entry points]
