# Bindings — what serves the ports

The one place in the suite that knows a provider. `CONDUCTOR.md` § Ports states
every port, its contract and its default; this file says what serves a port when
problem-brief is registered, and how a chorus decision crosses to it and back.
The canon wins where the two disagree.

## Detection

Run `node <root>/bin/bindings.mjs` once at the start of each round or gate
(`<root>` is the installed chorus-core directory). It looks for
`problem-brief/SKILL.md` in, in order: `<project>/.claude/skills`,
`${CLAUDE_HOME:-~/.claude}/skills`, then each directory in `CHORUS_SKILL_PATH`
(colon-separated, for a non-standard skills home such as `~/.dsh/skills`). It
prints the record's `bindings` block; copy it into the record as is and append
recoveries as they happen.

- **Brief found:** the decision sink and ruling lookup route to the brief, by
  the rules below.
- **Not found:** the free-hand form below. The same records, nothing lost.

The free-hand form is about the brief only. Node 20+ is always required: a
round runs through `bin/conduct.mjs`, and without Node it does not run.

## Free-hand form

With no brief registered, the chorus runs on the port defaults, with the same
data:

- Decisions and rulings use the same `decision` and `ruling` JSON. A ruling is
  kept in the chorus record's `local_rulings`, and `ruling_ref` is
  `{id: "R-n", record: "#"}`: the record itself.
- Questions go to chat; a 🔴 ask (an unanswered gate included) goes through
  `AskUserQuestion`, as the decision sink's default says.
- The page is rendered by `bin/render.mjs` either way.

Switching to a brief later loses nothing: a ruling moves between a brief and a
chorus record unchanged, and the ruling lookup still reads the local rulings and
earlier records.

## Bindings

What serves each port when problem-brief is registered. Anything not listed, or
not registered, falls back to the port's default in `CONDUCTOR.md` § Ports. Where a
provider stores answers is internal to its binding, never a chorus port.

| Port | Binding |
|---|---|
| decision sink | a problem-brief entry (Q-n), written by the translation rules below; the answer is kept in the brief's `rulings` and only the reference goes back |
| ruling lookup | the brief's rulings (`R-n`), searched before any new question |
| record validator | `bin/validate.mjs` (chorus-core; always bound) |
| record renderer / publisher | `bin/render.mjs` (chorus-core; always bound); commit `<record>.json` and the page, and a brief links the page from its evidence |
| arbiter | none; the default applies |
| fixed viewpoint | none; the default applies |
| memory recall | a memory-recall skill such as memsearch, when installed |

Each review record names the provider that served each port, or `default`, in
its `bindings` block, shown once at the top of the page.

## Dependencies

| Skill | Provides here | Without it |
|---|---|---|
| [problem-brief](https://github.com/zaytsevand/problem-brief) | the decision sink, the ruling store and lookup, and the publisher for operator-facing pages | each port falls back to its default in CONDUCTOR § Ports: questions are asked in chat and answers kept in the record |

Install it beside the suite:

```sh
git clone https://github.com/zaytsevand/problem-brief
cd problem-brief && ./install.sh   # --dir <skills dir> for a per-project install
```

The suite installer reports whether it is present. Only this file and its
detector (`bin/bindings.mjs`) name problem-brief; the rest of the suite and the
personas never do (`scripts/check-suite-integrity.sh` FC6).

## Default channel

When problem-brief is registered, chorus findings, decisions and questions for
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
