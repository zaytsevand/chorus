# Contributing

Thanks for considering a contribution to **chorus**, the multi-advisor review
suite (four skills: `chorus-core`, the substrate that also holds the schema,
validator, renderer and provider bindings, `chorus-review`, `chorus-sdlc` and
`chorus-learn`).

## What's in scope

- **Skill prose** (`skill/<name>/SKILL.md` and the files beside it, e.g.
  `skill/chorus-core/GATE-PRIMITIVE.md`) — procedure refinements, phase-gate
  tightening, new failure-mode entries, clearer briefs.
- **Persona agents** (`agents/*.md`) — sharpening voice, fixing calibration
  notes. A persona speaks to its own remit and names no other lens; the seams
  between lenses live once, in `skill/chorus-core/ROSTER.md` (FC7 checks it).
- **Schema and tooling** (`skill/chorus-core/schema/`, `bin/`, `test/`): Node,
  zero npm dependencies. A rule lives in one file: the canon (the markdown in
  `skill/chorus-core/`) owns the ports, the failure policy and the vote-count
  rule; the validator encodes them. When they disagree, fix the code;
  `test/canon-drift.test.mjs` should have caught it. Only
  `skill/chorus-core/BINDINGS.md` (and its detector `bin/bindings.mjs`) names a
  provider such as problem-brief (FC6).
- **Templates** (`skill/chorus-learn/templates/CHORUS-PROJECT.template.md`, the
  only copy; both install channels ship it with the skill) — better prompts in
  the fillable sections.
- **Packaging** (`install.sh`, `uninstall.sh`, `.claude-plugin/plugin.json`) —
  platform compatibility, idempotency fixes.

## What's out of scope

- New personas beyond the roster in `skill/chorus-core/ROSTER.md` without prior discussion. The
  roster is balanced deliberately; additions affect quorum math and brief
  templates.
- Tooling for *running* the chorus outside Claude Code. The chorus
  procedure is platform-agnostic on paper but the agent and skill loaders
  are Claude Code-specific.

## Project-specific content — do not commit

Persona agent descriptions and skill prose **must not** contain
project-specific identifiers: paths to private repos, hostnames, user
names, email addresses, specific company names, or examples drawn from a
single real project without genericizing them.

Examples in the YAML `description` `<example>` blocks should use
placeholder names like `<your-service>`, `<api-module>`, `OrderProcessor`,
or fictional projects. If you draw from a real round, scrub before you PR.

Before submitting, run:

```sh
rg -i '<list of project-marker patterns you happen to know about>' .
```

Reviewers check for project-specific markers; PRs that carry them will be
asked to scrub.

## Checks

```sh
scripts/check-suite-integrity.sh     # FC1–FC7: invariants, sibling isolation,
                                     # manifest (incl. claude plugin validate),
                                     # references, stale content, port boundary,
                                     # roster
scripts/test-install-roundtrip.sh    # install -> verify -> uninstall -> verify
node --test skill/chorus-core/test/*.test.mjs  # validator, renderer, bindings, canon drift,
                                               # conductor scenarios, vocabulary lint
```

A new token in a closed set (a status, a vote, a gate result, a persona) goes in
`skill/chorus-core/schema/vocab.schema.json` first; schemas `$ref` it and code
imports it from `bin/vocab.mjs`. The vocabulary lint fails on anything spelled by
hand.

CI (`.github/workflows/integrity.yml`) runs all three, and validates the
committed review records, on every pull request and on pushes to `main`. The runner has no `claude` CLI, so CI skips
`claude plugin validate`; run the integrity script locally before a release.

## Procedure for substantive changes

For anything beyond a typo or small clarity edit:

1. Open an issue describing what you want to change and why.
2. If the change affects the procedure (phases, gates, quorum, refusals),
   read `skill/chorus-core/CONDUCTOR.md` first — the invariant catalog there
   (`I1–I9`) is load-bearing.
3. PR with the diff and a short rationale.

## Releasing

A version is released only after it has been **dogfooded**:

1. Merge to `main` with CI green, and run `scripts/check-suite-integrity.sh`
   locally (it includes `claude plugin validate`).
2. Install that version into the dogfooding project **the way a user would** —
   through the plugin (`claude --plugin-dir <repo>`) or `install.sh`
   (e.g. `CLAUDE_HOME=$PWD/.claude <repo>/install.sh` from the project root).
3. Run one chorus round (or chorus-sdlc gate) on real work in that project.

The version counts as released only once that round has run. Until then it is
merged, not released. There is no symlink install mode and no installed-copy
drift check: dogfooding through the real channel is what keeps the installed
copy current and catches packaging breakage.

## License of contributions

By contributing you agree your contribution is licensed under CC BY 4.0
(the same license as the project). See `LICENSE`.
