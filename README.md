# coryphaeus

In Greek theatre the coryphaeus is the chorus leader who steps forward and speaks
for the chorus to the protagonist. Here the chorus deliberates, you rule, and this
skill carries what the chorus concluded to the place you rule: it checks standing
rulings first, records your answer, and writes the reference back.

A small skill that sits above the chorus review suite and problem-brief so that
neither has to know the other. It holds:

- `schema/`: JSON Schema (2020-12) for every chorus record (`rsvp`,
  `finding-report`, `vote-report`, `review-record`, `sdlc-log`) and for the
  shared `decision` and `ruling` shapes.
- `bin/validate.mjs`: a zero-dependency validator for the schema plus the rules a
  schema cannot express (tally arithmetic, ids, held and ungraded findings,
  `ruling_ref` shape and lookup, recorded recoveries).
- `bin/render.mjs`: renders a review record or a ledger to markdown, and refuses
  invalid input.
- `SKILL.md`: the port bindings and the chorus-to-brief translation rules.

```sh
node bin/validate.mjs review-record examples/review-record.valid.json
node bin/render.mjs review-record examples/review-record.valid.json review.md
node --test test/*.test.mjs
./install.sh            # copies into ${CLAUDE_HOME:-~/.claude}/skills/coryphaeus
```

Requires Node 18 or later. No npm dependencies.

License: CC BY 4.0 (see `LICENSE`).
