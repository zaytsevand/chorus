# composite-root

A small skill that sits above the chorus review suite and problem-brief so that
neither has to know the other. It holds:

- `schema/`: JSON Schema (2020-12) for every chorus record (`rsvp`,
  `finding-report`, `vote-report`, `review-record`, `sdlc-log`) and for the
  shared `decision` and `ruling` shapes.
- `bin/validate.mjs`: a zero-dependency validator for the schema plus the rules a
  schema cannot express (tally arithmetic, ids, held and ungraded findings,
  `ruling_ref` shape).
- `bin/render.mjs`: renders a review record or a ledger to markdown, and refuses
  invalid input.
- `SKILL.md`: the port bindings and the chorus-to-brief translation rules.

```sh
node bin/validate.mjs review-record examples/review-record.valid.json
node bin/render.mjs review-record examples/review-record.valid.json review.md
node --test test/*.test.mjs
./install.sh            # copies into ${CLAUDE_HOME:-~/.claude}/skills/composite-root
```

Requires Node 18 or later. No npm dependencies.

License: CC BY 4.0 (see `LICENSE`).
