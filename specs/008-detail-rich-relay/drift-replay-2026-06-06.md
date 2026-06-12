# Drift-check replay — 2026-06-06 round through the spec-008 format

**What this is.** An empirical run of the `008-detail-rich-relay` drift check
(FR-009 / FR-011 / SC-004) against a real recorded round
(`docs/reviews/2026-06-06-chorus-review.md`). The round's ten findings were
re-rendered into the new format, with each **pull-quote marked by the authoring
persona itself** (dispatched live — the conductor authored none), and the
severity/gating projection diffed against the baseline.

**Result: 0 drift.** Every finding's severity and gating flag is byte-identical to
the baseline. The presentation changed; the decision did not.

## New-format findings register (persona-marked pull-quotes)

| ID | Advisor · Lens | Sev | Target (locator) | Pull-quote (verbatim — the persona's own words) |
|----|----------------|-----|------------------|--------------------------------------------------|
| F1 | Richards · Architecture | 🔴 | `uninstall.sh:18-28` vs `install.sh:41` | "One roster expressed as two artifacts — install globs, uninstall hard-codes — is duplicated source of truth, and it has already silently orphaned a persona once." |
| F2 | Richards · Architecture | 🟠 | `install.sh:38` | "A count you can derive from `ls agents/*.md \| wc -l` should never be frozen as the literal 'nine' across six prose sites — and it already drifted, because the directory now holds ten." |
| F3 | Norman · HCD | 🟠 | `install.sh:44-45,55` | "A deploy that does nothing yet prints `Skipped` is a stove with no flame behind a lit knob — the operator forms a confident, wrong model and the stale brief burns the next round off-screen." |
| F4 | Norman · HCD | 🟠 | `uninstall.sh:35-45` | "`Removed: N` reports only the action it took, not the world it found, so a destructive operation closes the loop with feedback the operator cannot trust." |
| F5 | Norman · HCD | 🟡 | `…coverage-map.html:71-72,128` | "The chart was honest the day it was drawn, but `seated:false`/PROPOSED and `8 seated voices` now tell a story the shipped system contradicts — three voices, one confused reader." |
| F6 | Goldratt · Constraint-and-Flow | 🟠 | `tasks.md:175-187` `[principle:proposed]` | "Seven artifacts, nearly a thousand lines, congealed before a single verdict returned — that is inventory bought ahead of throughput, not progress." |
| F7 | Goldratt · Constraint-and-Flow | 🟠 | chart "Reading of the whole" `[principle:proposed]` | "An empty cell in your chart is not a user waiting; it is a local optimum begging to be filled — gate the tenth persona on a need a real round actually surfaced." |
| F8 | Evans · DDD | 🟡 | `agents/eliyahu-goldratt-advisor.md:85-94` | "The new persona names all eight of us, yet none of us name it back — a Context Map with every edge pointing one direction is not a relationship, it is a list of strangers." |
| F9 | Evans · DDD | 🟢 | `README.md:183` | "In the Interface-contracts row this cell quietly trades *contract* for *betting line* — a promise that binds becomes a wager that may not, and the shared word now hides two different concepts at one seam." |
| F10 | Security-and-Trust | 🟡 | `constraint-and-flow-advisor.md:87` `[principle:proposed]` | "A persona told to write its own memory while reading an untrusted repo has no boundary between data and instruction — that seam is an attacker's persistence foothold." |

> **F1 converging** (named lenses, each its own note — FR-005): Richards · *"this
> is contract drift between two scripts with no fitness function holding them to
> one source — the cheapest possible CI gate is missing, and the runtime already
> proved the drift bites."* (Uncle Bob, Beck, Delivery-and-Ops also converged; in a
> live round each marks its own note.)

**Consolidation matrix (projection):** severity + convergence carried from the
entries above, not re-authored — `F1 🔴 conv4 · F2 🟠 conv4 · F3 🟠 conv2 ·
F6 🟠 conv3 · F7 🟠 conv2 · F4 🟠 conv1 · F5 🟡 conv1 · F8 🟡 conv1 · F10 🟡 conv1 ·
F9 🟢 conv1`.

## The drift diff (SC-004)

| Finding | Baseline sev/gate | Replay sev/gate | Drift |
|---------|-------------------|-----------------|-------|
| F1 | 🔴 **gating** | 🔴 **gating** | none |
| F2 | 🟠 | 🟠 | none |
| F3 | 🟠 | 🟠 | none |
| F4 | 🟠 | 🟠 | none |
| F5 | 🟡 | 🟡 | none |
| F6 | 🟠 | 🟠 | none |
| F7 | 🟠 | 🟠 | none |
| F8 | 🟡 | 🟡 | none |
| F9 | 🟢 | 🟢 | none |
| F10 | 🟡 | 🟡 | none |

**Gating set:** `{F1}` baseline → `{F1}` replay. Identical. **0 rounds with drift.**

## Why this had to come out clean

Severity is produced by the Stage-4 tally (`GATE-PRIMITIVE.md`), whose arithmetic
the spec-008 edits left byte-unchanged. The personas re-marked pull-quotes and
explicitly touched no severity; the register *renders* the tally's severity and the
matrix *projects* it (FR-007). There is no path by which a pull-quote can move a
severity. The replay confirms in practice what the structure guarantees.

## Side-discoveries (not drift — staleness the replay surfaced)

Re-grounding in the live source turned up real bit-rot in the *baseline*, which a
fresh round would now log as findings (and which the I8 re-grounding rule is meant
to catch):

- **F2 is now live, not latent.** `ls agents/*.md | wc -l` returns **10**, while
  prose still says "nine." The duplication F2 named has drifted for real.
- **Locators moved.** The persona shipped as `eliyahu-goldratt-advisor.md` (working
  title "constraint-and-flow"); its Relationship section is now `:85-94` (F8 cited
  `:74-81`), and the README Principles row is `README.md:183` (F9 cited `:129`).

These do not affect the drift result — they are evidence that the new format's
persona-marked, re-grounded pull-quotes catch staleness a conductor paraphrase
would have silently carried forward.
