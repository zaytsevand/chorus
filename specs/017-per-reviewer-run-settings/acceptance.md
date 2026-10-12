# Acceptance — 017 per-reviewer run settings through the host's own agent files

**Walked**: 2026-10-12 · **Verdict**: ACCEPTED (one waived drift, author-ruled)

## TL;DR

The spec started as a chorus-side config layer and, over the walk, became a documented recipe for the host's own mechanism: a project-level agent file of the same name. Chorus adds no code, canon, schema, validator, renderer or installer change. The one drift against issue #10 (the copy forks the persona voice) was ruled on by the author and is stated as a cost in the spec.

## US→code traceability map

| US (handle) | Logical | Edges | Process | Observability | Value | Verdict |
|---|---|---|---|---|---|---|
| «no-exceptions default» | MATCH «session settings unstored» | MATCH «no service edges» | MATCH «dispatch unchanged» | MATCH «docs-only diff» | MATCH «silent default» | accepted |
| «retune-one-reviewer» | MATCH «agent file is source» | MATCH «host owns resolution» | GAP «recipe never run» | GAP «observing the setting» | DRIFT «voice fork» | accepted-with-note |
| «find-the-recipe» | MATCH «recipe in one place» | MATCH «pointer location» | GAP «README section» | GAP «reader check has no task» | MATCH «pointer location» | accepted |

## Spec refinements folded

- Clarify pass on «agent-file actor» — a new story (installer alert) added, later removed when run settings left chorus-shipped files.
- Clarify pass on «delivery and override sequence» — exceptions in one place (the project file), later superseded.
- Clarify pass on «source of truth» — native only: a project-level agent file; no table the conductor reads.
- Clarify pass on «project-level override issues» — chorus does not solve or document host resolution; verification shrinks to one smoke run of the recipe.

## Notes — post-walk action items (threaded by artefact handle)

- «reader check has no task» — ✎ SC-003 has no task behind it: add a fresh-reader task or drop SC-003.
- «dispatch by name» — ✎ confirmed only on the real call in T001.
- «Q-33 narrowed» — ✎ exceptions are not in `CHORUS-PROJECT.md`, and the review record no longer shows who ran differently; recorded in the spec's Clarifications because the brief is retired.
- «host field names» — ✎ the vendor-lock question is answered by native-only (Claude Code only, R-14).
- «voice fork» — ✎ the copy forks the persona and the installer will not update it; stated in FR-004.

## Open drifts blocking acceptance

None. «voice fork» was waived by the author's ruling (see Clarifications, 2026-10-12).

## Code-reality map (Phase 0 substrate)

<details><summary>What existed at walk time</summary>

- All ten `agents/*.md` carry `model: inherit` (line 4) and `memory: project`; none uses `tools` or `effort`. Eight have `color`.
- Dispatch rules: `skill/chorus-review/SKILL.md:112–135` (no model, effort or tools wording); `skill/chorus-sdlc/SKILL.md` matching. `CONDUCTOR.md` has no run-settings text.
- `ADDENDUM-AND-SCOPE.md:9–24` lists seven project-file items; `skill/chorus-learn/templates/CHORUS-PROJECT.template.md` numbers differently (7 "Project understanding", 8 "Findings → memory").
- `rsvp_row` (`common.schema.json:176–200`) rejects unknown keys; `failure` forces ABSTAIN (`validate.mjs:402`, `:544–564`); the ledger reuses `rsvp_row` (`sdlc-log.schema.json:29`).
- `install.sh` hashes what it writes and keeps edited files ("differs, kept … pass --force"); `scripts/check-suite-integrity.sh` never parses agent frontmatter.
- Host facts (sub-agents documentation, read 2026-10-12): project agent files outrank user and plugin ones; the dispatch call takes per-call `model` and `effort` but not `tools`; unknown frontmatter keys are ignored. Cited, not tested by chorus.

</details>
