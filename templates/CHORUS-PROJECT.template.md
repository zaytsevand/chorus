# Chorus Project Addendum — `<your-project-name>`

This file feeds the global `chorus` skill with project-specific facts.
The skill itself is generic; this addendum carries everything that would
otherwise be hard-coded for this repo.

Read by the orchestrator at Phase 0 of every chorus round.

<!-- Copy-safe preamble (comment-wrapped so a scaffolded copy reads correctly —
007 family G / F7): To use this template, copy it to
`docs/reviews/CHORUS-PROJECT.md` in your project and fill in the sections below.
Sections (2), (3), and (5) are required before the chorus can launch. Sections
(1), (4), and (6) can be inferred from your project layout / `CLAUDE.md` /
governance docs if you leave them empty, but filling them in speeds up every
round. (`chorus learn` can scaffold this file for you — say "chorus learn".) -->

## 1. Project summary

Two or three sentences describing:
- The project's purpose and topology (monolith / services / clients).
- Primary languages and frameworks.
- Where the governance / constitutional / architecture rulebook lives (if any).

Example shape:

> `<project>` is a `<one-line purpose>`. Three layers share `<one>` data store:
> `<layer A>` — `<role>`. `<layer B>` — `<role>`. `<layer C>` — `<role>`.
> Primary language: `<language>`. Governance doc: `<path or "none">`.

## 2. Default scope exclusions

Paths the chorus must **not** produce findings about (general lens — the
Security-and-Trust lens still covers them when they expose attacker
surface).

One bullet per path with a one-line justification. Typical exclusions:

- `<path/to/legacy>` — `<why: tech debt, planned removal, do not invest>`
- `<path/to/generated>` — auto-generated from `<source>`; carries
  `# AUTO-GENERATED` headers; never hand-edited.
- `<path/to/runtime-data>` — runtime data directory; no source code.
- Any module marked `# LEGACY:` or `# POC:` in its docstring.

If your project has nothing to exclude, write "None — full repo in scope."
But check first: most projects have *something* the chorus would otherwise
crowd onto.

## 3. Default anchor surface

The actively-developed paths the chorus *should* focus on. Each persona will
pick 3–6 anchors from this list at briefing time.

Examples:

- `src/` or your equivalent active code root
- `specs/` if you have spec-first contracts
- `<governance-doc-path>` if applicable
- `scripts/` and `deploy/` — tooling and deployment surface
- `.github/workflows/` or equivalent CI configuration
- Repo-root dotfiles — `.env*` templates, lockfiles, `pyproject.toml`,
  `.pre-commit-config.yaml`, etc.

## 4. Constitutional / governance principles

If your project has codified principles (numbered, named, or otherwise
referenceable), list the ones the chorus's Phase 4 ranking should score
"Constitutional ROI" against — does a recommendation advance enforcement of
those principles, or paper over them?

If you do not have a governance doc, leave this section empty and the
Constitutional ROI ranking dimension will be skipped.

Example shape:

> Defined in `<path/to/principles>`. Frequently-cited:
> - **`<I>`** — `<one-line summary>`
> - **`<II>`** — `<one-line summary>`

## 5. Security data-surface checklist

Project-specific items, passed to the Security-and-Trust persona's brief
on top of its default anchor list (auth surfaces, trust boundaries,
supply chain, secrets, egress, log redaction). The persona's defaults
already cover tokens, sessions, API keys, PII flows, log redaction, file
permissions on user-data dirs, and OAuth callbacks — list **additional**
items unique to your system.

Example shape:

- **Token handling for `<external service>`** — storage location, hash
  algorithm, transmission channel (URL query string = 🔴; body/headers OK).
- **LLM key exposure** — `<where keys live; what's allowed to reach an LLM
  with them>`.
- **PII flow** — `<which data flows to which third-party / log / telemetry;
  consent recording>`.
- **`<your specific concern>`** — `<scope>`.

## 6. Baseline references

Start empty. After your first chorus round, list the artifact path here so
the next round knows which findings to assume closed (or re-evaluated):

- `docs/reviews/YYYY-MM-DD-chorus-review.md` — first chorus.

When a new chorus artifact is added under `docs/reviews/`, update this list
so the next round knows which baseline to load.

## 7. Project understanding

> Operator-confirmed, project-wide facts gathered by the advisor **exploratory
> phase** (`skill/chorus/EXPLORATORY-PHASE.md`). This section is the
> **authoritative system of record** for these facts — advisors reference it (and
> may cache from it, reconciling on change) rather than re-asking. Each entry was
> **accepted by you**: advisors propose additions, you accept or edit them.
> Nothing lands here without your acceptance.

Start empty; it fills as advisors confirm facts with you. One line per fact;
reference longer material elsewhere rather than pasting it. A changed fact
**supersedes** the prior line (with the new accepted date). Absence of a topic
group = not yet gathered (an open gap, surfaced — not silently "n/a").

### Architecture
- Ranked architectural characteristics: `<…>`  [accepted <date>]
- Architecture style (as built): `<…>`

### Product
- Real users yet?: `<yes / no / …>` · Primary user & goal: `<…>`

### Security
- Trust boundaries: `<…>`

### Delivery
- Release path (commit → prod): `<…>` · Rollback: `<…>`

### Domain
- Core domain / ubiquitous-language pointers: `<… or → reference>`

<!-- add topic groups as lenses confirm facts; one line per fact -->

## Maintenance

When project facts change (a layer is absorbed, a directory moves, a new
governance principle is codified), update this file. The skill itself stays
generic; this addendum is the project's contract with it.
