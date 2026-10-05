---
name: coryphaeus
description: >-
  Validates, renders and routes chorus-suite data: the JSON schema and
  validator for persona replies (RSVP, finding report, vote report), review
  records and agent-SDLC ledgers; the renderers that turn those records into
  pages; and the rules for turning a chorus decision into a problem-brief entry
  and writing the operator's ruling back into the chorus record. Use whenever a
  chorus-review round or an agent-SDLC gate produces a persona reply, a record,
  a decision or a question for the operator; when a chorus decision has to
  become a brief entry, or a brief ruling has to flow back into a chorus
  record; or when a chorus JSON file needs checking or rendering, even if the
  user only says "check Beck's reply" or "re-render the ledger". Findings that
  did not come out of a chorus round belong to problem-brief, not here.
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

## What the canon owns

The rules this skill enforces are written once, in the chorus canon, and this
file refers to them instead of restating them:

- **The ports**, their contracts and their defaults when nothing is bound:
  [`../chorus-core/CONDUCTOR.md`](../chorus-core/CONDUCTOR.md) § Ports.
- **The failure policy** (one automatic retry, then ABSTAIN; fall back to a
  port's default; record every recovery; when the operator is asked; a
  version mismatch is install drift): the same section, the record validator
  row and "Recover quietly".
- **The vote-count rule** (`net`, the threshold, movement, gating and the
  settled cases): [`../chorus-core/GATE-PRIMITIVE.md`](../chorus-core/GATE-PRIMITIVE.md)
  § Stage 4.
- **Who owns which fact** (rulings cited, never restated; vote arithmetic only
  in chorus records): CONDUCTOR § Ports, "Cite, don't copy".

Where this skill and the canon disagree, the canon wins and this skill is the
one to fix. `test/canon-drift.test.mjs` fails when the validator or the schema
stops matching the canon's port names, schema major, threshold rule or list of
settled cases, or when the exit-code table below stops quoting the canon's
record validator row.

## Finding the tools

`<root>` is the installed skill directory: `.claude/skills/coryphaeus` in
the project if present, else `~/.claude/skills/coryphaeus`.

```
node <root>/bin/validate.mjs <kind> <file.json> [--json]   # 0 valid · 1 invalid · 2 usage · 3 version mismatch
node <root>/bin/render.mjs   <review-record|sdlc-log> <file.json> <out.md>
```

Kinds: `rsvp`, `finding-report`, `vote-report`, `review-record`, `sdlc-log`,
`decision`, `ruling`.

**When to run it.** Validate every persona reply before it is counted and every
record before it is published. The renderer validates again and refuses
invalid input. What each exit code means for a persona reply (CONDUCTOR §
Ports, record validator row):

| Exit | Meaning | Do |
|---|---|---|
| 0 | valid | count it |
| 1 | invalid | one retry, then counts as ABSTAIN with the validator's reason logged; the retry is automatic and carries the reason |
| 2 | usage | fix the command; the persona is not charged |
| 3 | "version mismatch": the reply declares a schema major other than 1; nothing else is checked | install drift, reported once and never retried or counted against a persona |

Write every retry, fallback and abstention to the record's
`bindings.recoveries`; none of them is asked live.

**Ruling references.** A `ruling_ref` record path is read from the repository
root. The validator opens a local record and checks the id is there: an id it
does not hold is an error; an absent or unreadable record is a warning, so a
private brief kept outside the repository does not break validation.

## Bindings

What serves each port when problem-brief is installed. Anything not listed, or
not installed, falls back to the port's default in CONDUCTOR § Ports. Where a
provider stores answers is internal to its binding, never a chorus port.

| Port | Binding |
|---|---|
| decision sink | a problem-brief entry (Q-n), written by the translation rules below; the answer is kept in the brief's `rulings` and only the reference goes back |
| ruling lookup | the brief's rulings (`R-n`), searched before any new question |
| record validator | `bin/validate.mjs` (this skill) |
| record renderer / publisher | `bin/render.mjs` (this skill); commit `<record>.json` and the page, and a brief links the page from its evidence |
| arbiter | none; the default applies |
| fixed viewpoint | none; the default applies |
| memory recall | a memory-recall skill such as memsearch, when installed |

Each review record names the provider that served each port, or `default`, in
its `bindings` block, shown once at the top of the page.

## Dependencies

| Skill | Provides here | Without it |
|---|---|---|
| [problem-brief](https://github.com/zaytsevand/problem-brief) | the decision sink, the ruling store and lookup, and the publisher for operator-facing pages | each port falls back to its default in CONDUCTOR § Ports: questions are asked in chat and answers kept in the record |

Install it beside this skill:

```sh
git clone https://github.com/zaytsevand/problem-brief
cd problem-brief && ./install.sh   # --dir <skills dir> for a per-project install
```

The suite installer reports whether it is present. Only coryphaeus names
problem-brief; the chorus skills and personas never do.

## Default channel

When problem-brief is installed, chorus findings, decisions and questions for
the operator go to a brief by default, as problem-brief describes.

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
   for a 🟡). The translation never picks its own favourite. Exactly one
   solution is `recommended: true` and it is listed first; the validator
   rejects a decision that lists it anywhere else.
4. **Raise by need, not severity.** Before any entry is raised, check whether
   the operator has anything to choose:
   - A decision becomes a question only when its options differ in values or
     priorities that no standing ruling settles.
   - A decision with one sensible option, or a cheap fix whose only
     alternative is doing nothing, is taken as recommended. It goes on the
     brief's `mechanical` list once applied, or `outstanding` while not yet
     done, never as an entry. The chorus record keeps its default and override
     path.
   - A recoverable failure is never raised.
   - An unanswered gate question is always raised, as `bearing: blocks-goal`,
     and asked interactively with `AskUserQuestion`; never `escalated`. So is a
     🔴 (`hard-block`): the chorus gives it no default to take
     (DECISION-PRIMITIVE D2).
   - A genuine value choice that does not block is `escalated` in the brief's
     sense. A 🟡 that passes the check lands here; one that does not is settled
     work, as above.
5. **Write the ids back.** Once the entry exists, set the chorus decision's
   `entry_ref` to `{id: "Q-n", record: "<brief.json>"}`. Once the operator rules,
   set:
   - `ruling_ref`: `{id: "R-n", record: "<brief.json>"}`
   - `status`: `decided` (`complete` once carried out)
   - `decision`: `{chose: "<solution id>", date: "<YYYY-MM-DD>"}`, an object
     like the brief entry's, never a bare string

   Re-validate the chorus record. Ids are written exactly as the brief
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
