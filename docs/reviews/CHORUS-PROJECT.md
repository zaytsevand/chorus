# Chorus Project Addendum: `chorus`

Project-specific facts for chorus rounds and chorus-sdlc gates run on this
repository, the chorus suite itself. Read by the orchestrator at Phase 0 of
every round. The suite stays generic; this file is what it knows about this
repo.

## 1. Project summary

`chorus` is a Claude Code plugin: a suite of five skills and ten persona agents
that run structured multi-lens reviews. `skill/chorus-core/` is the canon (the
conductor's procedure, the gate, decision and exploratory primitives, the
I1 to I9 catalog, the ports); `chorus-review`, `chorus-sdlc` and `chorus-learn`
compose it; `skill/coryphaeus/` is the composition root (JSON schema, validator,
renderer, provider bindings). Canon and personas are markdown; tooling is Node
with zero npm dependencies (`skill/coryphaeus/bin/`) plus bash scripts.
Governance doc: `.specify/memory/constitution.md`.

## 2. Default scope exclusions

- `specs/`: speckit feature history (001 to 016). Background for how a rule
  came to be, not a target; a finding belongs on the canon file the spec
  produced.
- `tests/parity/`: older parity notes from the suite decomposition. The
  current checks are `scripts/` and `skill/coryphaeus/test/`.
- `docs/reviews/` past rounds (`2026-06-06-chorus-review.md`,
  `2026-09-27-chorus-review-pr32.*`, `pr32/`): baseline, not target. They
  record what was said at the time and are never rewritten.
- `docs/superpowers/`, `docs/round2-derive-evidence.md`: working notes and
  evidence behind past redesigns.
- `.claude/agent-memory/`: persona memory. Tracked and published, but written by
  the personas; review the memory contract in `CONDUCTOR.md`, not the entries.
- `.specify/` templates and scripts: speckit tooling, vendored.
- `skill/coryphaeus/examples/`: fixtures for the validator tests, including
  deliberately invalid ones.

## 3. Default anchor surface

- `skill/chorus-core/`: the canon (`CONDUCTOR.md`, `GATE-PRIMITIVE.md`,
  `DECISION-PRIMITIVE.md`, `EXPLORATORY-PHASE.md`, `SKILL.md`)
- `skill/chorus-review/SKILL.md`, `skill/chorus-sdlc/SKILL.md`,
  `skill/chorus-learn/` (with `templates/`)
- `skill/coryphaeus/`: `SKILL.md`, `schema/`, `bin/validate.mjs`,
  `bin/render.mjs`, `test/` (including `canon-drift.test.mjs`)
- `agents/`: the ten persona definitions
- `install.sh`, `uninstall.sh`, `.claude-plugin/plugin.json`: packaging and
  onboarding
- `scripts/check-suite-integrity.sh`, `scripts/test-install-roundtrip.sh`,
  `.github/workflows/integrity.yml`: fitness checks and CI
- `README.md`, `CONTRIBUTING.md`: the first thing a new user reads
- `.specify/memory/constitution.md`: the principles below

## 4. Constitutional / governance principles

Defined in `.specify/memory/constitution.md`. Frequently cited:

- **I. One Canonical Definition: Cite, Never Restate**
- **II. The Chair Decides Nothing**
- **III. Severity Is Arithmetic, Not Judgment**
- **IV. Every Lens Names Its Gates: Prompt, Never Infer**
- **V. Evidence or It Doesn't Count**
- **VI. Operator Decisions Are Banded, Never Assumed**
- **VII. Block on 🔴, Never Silently**
- **X. Validate the Procedure, Not the Artifact**

## 5. Security data-surface checklist

On top of the Security-and-Trust defaults:

- **Installer writes into the user's config**: `install.sh` and `uninstall.sh`
  write and delete under `$CLAUDE_HOME`. Manifest paths must stay inside it;
  files the installer did not write, or the user edited, must survive.
- **Persona memory is public**: `.claude/agent-memory/` is committed and
  published with the repository. Nothing private (hostnames, names, private repo paths,
  operator briefs) may land there; the secret pre-filter contract in
  `CONDUCTOR.md` applies.
- **Records cite private material by reference**: review records may cite a
  ruling kept in a private brief outside the repo. Only the reference is
  committed, never the brief or its content.
- **Supply chain**: zero npm dependencies is a rule, not a habit; any `import`
  outside `node:` in `skill/coryphaeus/bin/` is a finding.
- **Prompt surface**: persona and skill prose is executed by a model with the
  user's tools; an instruction in canon is a capability grant.

## 6. Baseline references

- `docs/reviews/2026-06-06-chorus-review.md`: first chorus round on this repo.
- `docs/reviews/2026-09-27-chorus-review-pr32.json` (page:
  `2026-09-27-chorus-review-pr32.md`): the PR 32 round, the first JSON record.

## 7. Project understanding

> Operator-confirmed, project-wide facts. Advisors reference these rather than
> re-asking. A changed fact supersedes its line, with the new date.

### Product
- Who it is for: a published plugin installed by people the operator does not
  know. Installer and onboarding findings count at full severity.
  [operator-confirmed 2026-09-27]

### Architecture
- Ranked qualities: 1 conformance and reliability, 2 portability, 3 ease of
  change, 4 simplicity. [operator-confirmed 2026-09-27]
- Shape: one repository, several skills. Each rule lives in one file and others
  refer to it by path; the chorus canon owns the rules and coryphaeus binds and
  checks them, the canon winning on disagreement. [operator-confirmed 2026-09-28]

### Domain
- Core: the conductor's procedure and invariants (phase gates, I1 to I9,
  refusals). Vote rules, personas, packaging and rendering support it.
  [operator-confirmed 2026-09-27]

### Hard constraints
- Canon stays markdown; tooling is Node with zero npm dependencies.
  [operator-confirmed 2026-09-27]
- Claude Code only. [operator-confirmed 2026-09-27]
- The chorus never names the brief: it composes with problem-brief only through
  coryphaeus. The chorus skills and personas name no provider.
  [operator-confirmed 2026-09-27]
- No hosted or long-running services. [operator-confirmed 2026-09-27]
- Persona memory is hand-written or pluggable into any store (memsearch or
  another) and exists to keep personas distinct. [operator-confirmed 2026-09-28]

## 8. Findings → memory

Defaults apply: lens-specific findings to `.claude/agent-memory/<persona>/`,
project-wide facts to section 7 only with operator acceptance, locator plus a
short hint only, and the deny-default secret filter from `CONDUCTOR.md`. No
project-specific target.

## Maintenance

Update this file when a skill is added or removed, a directory moves, or the
operator changes a fact in section 7.
