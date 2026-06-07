# Quickstart: Advisor Exploratory Phase

How a round runs the exploratory phase, and how the dogfood validation confirms
the success criteria.

## In a round

1. **RSVP** runs as today; joiners are known.
2. **Exploratory phase** (new), per joiner (`contracts/exploratory-phase.md`):
   - load the lens's profile (from its agent file);
   - reuse the prior record; compute deltas + stale references;
   - harvest references **addendum-first**, then repo docs (record pointers, not
     copies);
   - run bounded analysis for what's undocumented (record as provisional);
   - emit gap-questions for what's still unmet.
3. **One batched operator interview** (orchestrator), delivered in **resumable,
   operator-paced sessions of ≤ 5 questions** (each with a plain-language
   preamble): deduped gap-questions → operator → answers routed (project-wide →
   proposed addendum additions you accept; lens-specific → the asking advisor's
   record). Defer any session and resume later; a left-open interview yields a
   verdict **degradation summary**.
4. **Findings** (Round 1 / the gate's Author stage) are produced **from** the
   records — each lens-critical assumption traces to a reference, an
   operator-confirmed fact, or a flagged inference.

## What you do as operator

- Answer the interview at your own pace — sessions of ≤ 5 questions you can pause
  and resume; you control how much time/budget it spends (only genuine gaps;
  ideally zero on a well-documented project or an unchanged later round). If you
  stop early, the verdict tells you what stayed open.
- **Accept / edit** the proposed additions to the addendum's "Project
  understanding" section. Nothing lands there without your acceptance.

## Dogfood validation (the feature's test)

**Cheapest first probe (do this before any full round):** run **one** lens,
**zero-question**, on this (well-documented) repo — the SC-007 path. It produces a
real understanding record, makes the coverage fitness function runnable, and
exercises SC-001 / SC-005 / SC-007 / SC-010 **without** needing the operator. Only
then scale to a full multi-lens round for the delta/interview criteria (SC-004 /
SC-009).

Run the exploratory phase on this repo (chorus-review itself) and assert:

- **SC-001**: every lens-critical assumption in the ensuing findings traces to a
  record entry (reference / operator-confirmed / flagged inference).
- **SC-002**: records reference docs; no source reproduced beyond a short quote.
- **SC-003**: no interview question whose answer already sat in the addendum or a
  repo doc.
- **SC-004**: a second run asks only about deltas — zero questions when nothing
  relevant changed.
- **SC-005**: every advisor (9 + Guido) has an `Information needs` section.
- **SC-006**: a finding on an open gap / unconfirmed inference is flagged
  provisional.
- **SC-007**: on a fully-documented need, zero operator questions.
- **SC-008**: project-wide facts are authored only in the **authoritative**
  addendum (each write-back operator-accepted); any record copy is a cache with a
  reconciliation locator that yields to the addendum.
- **SC-009**: the interview ran in resumable ≤ 5-question sessions with a
  plain-language preamble; a deferred session produced a degradation summary, not
  a silent quality drop.
- **SC-010**: the **profile-coverage fitness function** passes — every profile
  item resolved to a tagged record entry; every cached project-wide fact carried a
  reconciliation locator.

## Structural smoke checks

```sh
# every persona has an information-needs profile section
for f in agents/*.md; do grep -q "Information needs (exploratory phase)" "$f" \
  || echo "MISSING profile: $f"; done

# the phase mechanic exists and all three layer docs reference it
test -f skill/chorus-review/EXPLORATORY-PHASE.md
grep -l EXPLORATORY-PHASE skill/chorus-review/SKILL.md \
  skill/chorus-review/SDLC-LAYER.md skill/chorus-review/INTEGRATION-LAYER.md

# the addendum template has the new section
grep -q "Project understanding" templates/CHORUS-PROJECT.template.md
```

**Profile-coverage fitness function** (the executable conformance check, FR-022 —
run per advisor after a dogfood round, not a pure smoke check): for each
participating advisor, every item in its `Information needs (exploratory phase)`
profile must resolve to an entry in its understanding record (referenced /
inferred / operator-confirmed / open-gap), and every `Cached (from addendum)`
entry must carry an `addendum:<locator>`. A profile item with no record entry is a
coverage failure.
