---
name: composite-root
description: >-
  Binds the chorus suite to its providers (problem-brief by default) without
  either knowing the other. Owns the shared JSON schema for all chorus data and
  for decisions and rulings, the validator and renderers that enforce it, the
  port bindings, and the rules for translating a chorus decision into a brief
  entry. Use whenever a chorus skill emits a persona reply, a record, a decision
  or an operator question, or when a session has findings, decisions or
  questions for the operator.
---

# Composite root

The chorus and problem-brief stay ignorant of each other. This skill sits above
both. It owns four things:

1. **The schema** (`schema/`, JSON Schema 2020-12): every chorus datum, and the
   shared `decision` and `ruling` shapes.
2. **The validator** (`bin/validate.mjs`): a program, never a model reading
   JSON. It checks the schema plus what a schema cannot express: the Stage-4
   tally arithmetic, unique ids, ungraded R2- findings, held findings kept out
   of the top five, word limits, and well-formed `ruling_ref`s.
3. **The renderers** (`bin/render.mjs`): the review page and the ledger page,
   rendered from validated JSON. The JSON is the record; the page is a view.
4. **The bindings**: which provider serves each port the chorus declares, and
   how data crosses from one to the other.

## Finding the tools

`<root>` is the installed skill directory: `.claude/skills/composite-root` in
the project if present, else `~/.claude/skills/composite-root`.

```
node <root>/bin/validate.mjs <kind> <file.json> [--json]   # 0 valid · 1 invalid · 2 usage
node <root>/bin/render.mjs   <review-record|sdlc-log> <file.json> <out.md>
```

Kinds: `rsvp`, `finding-report`, `vote-report`, `review-record`, `sdlc-log`,
`decision`, `ruling`.

**When to run it.** Validate every persona reply before it is counted (an
invalid reply is malformed output: it goes back to the persona once, then counts
as ABSTAIN under the one failure rule). Validate every record before it is
published. The renderer validates again and refuses invalid input.

## Ports

The chorus declares what it needs from outside. Each port has a default that
works when nothing is bound.

| Port | What the chorus needs | Default (nothing bound) | Binding |
|---|---|---|---|
| Decision sink | somewhere to put a 🟡 card or ask a 🔴 question | ask in chat; record the decision in the chorus record | a problem-brief entry (Q-n), written by the translation rules below |
| Ruling lookup | standing operator answers, checked before asking | the record's own `local_rulings` and prior records | the brief's rulings (`R-n`), searched before any new question |
| Ruling sink | where an operator answer is kept | `local_rulings` in the chorus record, cited as `record: "#"` | the brief's `rulings`; the chorus record keeps only a `ruling_ref` |
| Record publisher | where the round's record lives | commit `<record>.json` plus the page from `render.mjs` | same; a brief links the page from its evidence |
| Record validator | a program that accepts or refuses a record | `bin/validate.mjs` (this skill) | — |
| Arbiter | a ruling on a framed conflict | `advisor()`; absent → the conflict is recorded unresolved for the operator | — |
| Fixed viewpoint | a spec-to-code digest at Gate C | `spec-walkthrough` headless; absent → skip and log | — |
| Memory recall | earlier understanding before a round | `.claude/agent-memory/<persona>/` and the addendum; absent → skip and log | a memory-recall skill such as memsearch |

A port that falls back to its default says so in the record (a side-note or
the gate outcome), never silently.

## Who owns which fact

- **Operator rulings** (answers, waivers, sign-offs, preferences) live in the
  ruling sink. A chorus record cites them as `ruling_ref: {id, record}` and
  never restates them.
- **Vote arithmetic** (seating, P/C/O, net, severities, cycles) lives only in the
  chorus record. A brief cites it and never re-decides it.
- **Project-wide facts** stay in the chorus addendum's project-understanding
  section.

## Default channel

Findings, open decisions and questions for the operator go to a brief by
default, not only when asked for one. Chat carries the short summary of what
changed and the link. Every answer the operator gives, in chat or in a comment
on the page, is recorded as a ruling in the brief in the same turn.

## Translating a chorus decision into a brief entry

The `decision` schema uses the brief's field names, so the mapping is
mechanical: `title`, `problem`, `brief`, `evidence`, `solutions` (with
`recommended`, `reversible`, `summary`, `cost`), `status` and `decision` carry
over unchanged. `point`, `band`, `sensor`, `resolution`, `override` and
`catalog_row` stay in the chorus record. On top of the mapping:

1. **Plain language.** Rewrite titles and prose for someone who has not read the
   reports. Chorus terms get their plain meaning first, with the term trailing
   as a pointer: tally → vote count, gate → review stage, lens → reviewer,
   held → waiting on information, park → set aside, frame → the question as
   posed. The brief's banned coinages never reach the page.
2. **Count first, group second.** Group findings by root cause only after the
   vote count. The grouped entry lists every finding it absorbed in `rolledUp`,
   each with its id and final severity.
3. **The recommendation comes from the vote.** The recommended option is the
   one the vote supports (the highest-convergence remedy, or the chorus default
   for a 🟡). The translation never picks its own favourite.
4. **Bearing.** A 🔴 decision is `bearing: blocks-goal`; a 🟡 is `escalated`.
5. **Write the ids back.** Once the entry exists, set the chorus decision's
   `entry_ref` to `{id: "Q-n", record: "<brief.json>"}`. Once the operator rules,
   set `ruling_ref` to the brief's `R-n`, and move `status` and `decision` to
   match. Re-validate the chorus record.

A ruling moves between a brief and a chorus fallback record unchanged: the
`ruling` schema is field-for-field the brief's.

## Out of scope

Converting old markdown reviews and ledgers. New records are JSON from the
start.
