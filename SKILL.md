---
name: coryphaeus
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
   of the top five, word limits, recorded recoveries, and each `ruling_ref`
   followed into the record it names.
3. **The renderers** (`bin/render.mjs`): the review page and the ledger page,
   rendered from validated JSON. The JSON is the record; the page is a view.
4. **The bindings**: which provider serves each port the chorus declares, and
   how data crosses from one to the other.

## Finding the tools

`<root>` is the installed skill directory: `.claude/skills/coryphaeus` in
the project if present, else `~/.claude/skills/coryphaeus`.

```
node <root>/bin/validate.mjs <kind> <file.json> [--json]   # 0 valid · 1 invalid · 2 usage
node <root>/bin/render.mjs   <review-record|sdlc-log> <file.json> <out.md>
```

Kinds: `rsvp`, `finding-report`, `vote-report`, `review-record`, `sdlc-log`,
`decision`, `ruling`.

**When to run it.** Validate every persona reply before it is counted. An
invalid reply gets exactly one automatic retry with the validator's reason; if
the retry fails too, the persona counts as ABSTAIN under the one failure rule.
Both are written to the record's `bindings.recoveries`, never asked live.
Validate every record before it is published. The renderer validates again and
refuses invalid input. There is no runtime version check between the chorus and
this skill: releasing both through the real install channel covers version
drift.

**What reaches the operator.** Recoverable failures do not: the operator's
attention is the scarcest thing in the loop. A retry, a fallback to a port's
default and an abstention by failure are recorded and the round goes on. The operator is asked only when the round cannot reach a valid
result alone: it stops for lack of reviewers (quorum), or a lost seat leaves a
🔴 finding without enough voters to count it.

A `ruling_ref` record path is read from the repository root. The validator opens
a local record and checks the id is there: an id it does not hold is an error;
an absent or unreadable record is a warning, so a private brief kept outside the
repository does not break validation.

## Ports

The chorus declares what it needs from outside. Each port has a default that
works when nothing is bound. Where a provider stores answers is internal to its
binding, never a chorus port (the chorus lists only what it needs).

| Port | What the chorus needs | Default (nothing bound) | Binding |
|---|---|---|---|
| Decision sink | somewhere to put a 🟡 card or ask a 🔴 question; returns a ruling reference | ask in chat; keep the answer in the record's `local_rulings`, return `record: "#"` | a problem-brief entry (Q-n), written by the translation rules below; the answer is kept in the brief's `rulings` and only the reference goes back |
| Ruling lookup | standing operator answers, checked before asking | the record's own `local_rulings` and prior records | the brief's rulings (`R-n`), searched before any new question |
| Record renderer / publisher | where the round's record lives | commit `<record>.json` plus the page from `render.mjs` | same; a brief links the page from its evidence |
| Record validator | a program that accepts or refuses a record | `bin/validate.mjs` (this skill) | — |
| Arbiter | a ruling on a framed conflict | `advisor()`; absent → the conflict is recorded unresolved for the operator | — |
| Fixed viewpoint | a spec-to-code digest at Gate C | `spec-walkthrough` headless; absent → skip and log | — |
| Memory recall | earlier understanding before a round | `.claude/agent-memory/<persona>/` and the addendum; absent → skip and log | a memory-recall skill such as memsearch |

Each review record names the provider that served each port, or `default`, in
its `bindings` block, shown once at the top of the page. A port that falls back
to its default is a recorded recovery, never a question and never silent.

## Who owns which fact

- **Operator rulings** (answers, waivers, sign-offs, preferences) live wherever the
  decision sink's provider keeps them (the chorus never sees where). A chorus record cites them as `ruling_ref: {id, record}` and
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
   posed. The brief's banned coinages never reach the page. Words the two sides
   could read differently:
   - **held** (tally status): NEED_INFO open, not counted.
   - **unmoved** (tally movement, was `hold`): counted, but the vote left the
     authored severity where it was.
   - **hard-block** (decision resolution, was `escalated`): a 🔴 the chorus
     cannot pass until the operator rules. In the brief this is
     `bearing: blocks-goal`; the brief's `escalated` means the opposite (a real
     decision that does not block), and the chorus never uses the word.
   - **bound-reached** (gate result, was `escalated`): three cycles left a 🔴
     uncleared, so it goes to the operator as a hard-block.
2. **Count first, group second.** Group findings by root cause only after the
   vote count. The grouped entry lists every finding it absorbed in `rolledUp`,
   each with its id and final severity.
3. **The recommendation comes from the vote.** The recommended option is the
   one the vote supports (the highest-convergence remedy, or the chorus default
   for a 🟡). The translation never picks its own favourite.
4. **Bearing.** A 🔴 decision (`hard-block`) is `bearing: blocks-goal`; a 🟡
   is `escalated` in the brief's sense.
5. **Write the ids back.** Once the entry exists, set the chorus decision's
   `entry_ref` to `{id: "Q-n", record: "<brief.json>"}`. Once the operator rules,
   set `ruling_ref` to the brief's `R-n`, and move `status` and `decision` to
   match. Re-validate the chorus record. Ids are written exactly as the brief
   writes them (`R-4`, `Q-7`), never with a subject prefix: `record` already
   says which brief.

## Reading back from the brief

What the brief does to an entry or ruling after publication comes back to the
chorus record as follows. Chorus records are history: an old record is never
rewritten to match; the next record, or the open decision, follows.

- **Entry decided or complete.** Rule 5 above.
- **Entry reopened** (set back to `open` under the same id with new evidence).
  The chorus decision returns to `open`, loses its `decision` and `ruling_ref`,
  and a 🔴 blocks again.
- **Entry superseded** (the problem went away; nothing was carried out). The
  chorus decision becomes `superseded`. It needs no ruling. A record citing the
  entry as a ruling gets a validator warning.
- **Ruling replaced** (`status: replaced`, `replacedBy: R-m`). New records cite
  `R-m`. The validator warns on any citation of the replaced ruling and names
  the ruling that holds now, following the chain. A decision settled by the old
  ruling is checked against the new one; if the new ruling no longer supports
  the choice, the decision reopens.

A ruling moves between a brief and a chorus fallback record unchanged: the
`ruling` schema is field-for-field the brief's.

## Out of scope

Converting old markdown reviews and ledgers. New records are JSON from the
start.
