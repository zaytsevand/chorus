# Contributing

Thanks for considering a contribution.

## What's in scope

- **Skill prose** (`skill/chorus-review/SKILL.md`, `INTEGRATION-LAYER.md`) —
  procedure refinements, phase-gate tightening, new failure-mode entries,
  clearer briefs.
- **Persona agents** (`agents/*.md`) — sharpening voice, fixing calibration
  notes, updating relationship sections.
- **Templates** (`templates/CHORUS-PROJECT.template.md`) — better prompts in
  the fillable sections.
- **Install scripts** (`install.sh`, `uninstall.sh`) and `plugin.json` —
  platform compatibility, idempotency fixes.

## What's out of scope

- New personas beyond the roster of seven without prior discussion. The
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

CI runs an equivalent check; PRs with project-specific markers will be
asked to scrub.

## Procedure for substantive changes

For anything beyond a typo or small clarity edit:

1. Open an issue describing what you want to change and why.
2. If the change affects the procedure (phases, gates, quorum, refusals),
   read `INTEGRATION-LAYER.md` first — the invariants there are
   load-bearing.
3. PR with the diff and a short rationale.

## License of contributions

By contributing you agree your contribution is licensed under CC BY 4.0
(the same license as the project). See `LICENSE`.
