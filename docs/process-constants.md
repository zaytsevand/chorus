# Process constants

What stays fixed in software development while the tools change, and which
practices those fixed points keep relevant. A reference for lenses, the
conductor and the operator when a finding or a recommendation says "this
practice matters" or "this practice is obsolete".

Not to be confused with the I1–I9 invariants in `skill/chorus-core/CONDUCTOR.md`.
Those are rules the suite enforces on itself. These are properties of the
people and the world the suite works in, which no rule can change.

## The frame

- **Amara's law.** We overestimate the effect of a technology in the short run
  and underestimate it in the long run.
- **Braudel's three speeds.** Events (fast), cycles (decades), structures
  (barely move). A practice worth investing in lives at the second speed: it
  has already outlived several tool generations and will outlive this one.
- **The test.** If producing code got 10× cheaper tomorrow, would the practice
  still make sense? If it exists because code is expensive to write, it is a
  derivative and will be rewritten. If it exists because of a constant below,
  it stays, and usually matters more.
- **The second test.** Can a tool remove this cost, or only move it? A cost a
  tool removes (recall, typing, boilerplate) is a temporary bottleneck. A cost
  a tool only moves is a constant.

## The constants

| # | Constant | Why tools don't remove it |
|---|---|---|
| C1 | **Attention** for decisions that can't be delegated | Tools cut how many things need it, not how much there is in a day. When generation gets cheap, the bottleneck becomes what to read. |
| C2 | **Working-memory slots** (about 4) | Training grows what fits in a slot (chunk size), never the slot count. A system that doesn't fit in one head can't be validated, however fast it was written. |
| C3 | **Accountability** | Someone answers for the outcome; a tool cannot. What you are accountable for is what you can't stop paying attention to. |
| C4 | **Communication bandwidth between people** | Unchanged since speech. Coordination cost grows with n², and the system copies the organisation (Conway). Agents make nodes faster, not edges. |
| C5 | **Essential complexity** | Tools strip accidental complexity; the domain's own complexity remains and becomes a larger share of the work (Brooks). |
| C6 | **Not knowing what you want** | Requirements are hypotheses. Generating options got cheap; learning which one was right did not. |
| C7 | **Feedback latency from reality** | Users, markets and incidents respond on their own schedule. That sets the pace of the learning loop. |
| C8 | **Validation** (did we reach the goal) | Verification against a spec keeps getting cheaper. Validation closes only against reality and ends with a person (C3) spending attention (C1). Every check needs an oracle, and a spec is just another hypothesis about the goal. |
| C9 | **Software in use must change** (Lehman) | The environment moves, so the software moves or decays. Maintenance never reaches zero. |

One asymmetry follows from C8: generation gets cheaper faster than validation,
so the share of effort spent defining and confirming the goal keeps rising.

## Practices that rest on the constants

| Practice | Constants | Age |
|---|---|---|
| Information hiding and modularity: a module fits in one head | C2, C5 | Parnas 1972 |
| Naming and domain language: one chunk instead of five | C2, C4 | DDD 2003, older in spirit |
| Limits on work in progress, small batches | C1, C7 | Toyota 1950s; Reinertsen |
| Explicit ranking: one item on top, not a list of equals | C1 | Pareto, Drucker |
| Decisions written down so nobody pays for the same question twice (ADR, a ruling in the brief) | C1, C3 | decades |
| A named owner for each decision and each result | C3 | older than software |
| Blameless postmortems | C3, C7 | aviation, medicine |
| Team boundaries matching system boundaries, explicit contracts between them | C4 | Conway 1968 |
| Domain modelling: separate essential from accidental | C5 | Brooks 1986 |
| Iteration: build, show, learn | C6, C7 | Deming's PDSA, 1950s |
| Small, reversible delivery; observability in production | C7, C9 | continuous delivery, PDSA again |
| The goal stated as an observation before work starts ("we'll know it worked when we see X") | C8 | acceptance criteria, test-first at the goal level |
| Refactoring: keep the cost of change low | C9, C2 | Opdyke 1992, Fowler 1999 |
| Problem management: restore service (incident) apart from removing the cause (problem); a known-error database; problem ownership; proactive trend analysis | C1, C3, C7, C9 | ITIL; incident vs problem is Braudel's first and second speed |

The known-error database matters more with agents, not less. An agent with no
memory hits the same known error on every run. A list of known errors with
their workarounds and permanent fixes is the operational memory both people
and agents read.

As code gets cheaper, modularity and naming become more important: an agent
writes any volume, and the person accepting it still has four slots.

## Derivatives

Packages of rituals tuned to one cost structure. Their principles came from the
constants and survive; their forms came from the cost ratios and change when the
ratios flip.

| Derivative | What it was tuned to | What survives |
|---|---|---|
| Agile rituals | Expensive code change, small co-located team | Iteration, small batches, working software as the measure |
| Story points, estimates in hours | The cost of producing code, which is the cost that is falling | Estimating the cost of validation and of the decision |
| Sprint cadence | Team bandwidth | A cadence set by how often a decision is made |
| Line-by-line code review | Code small enough for a person to read all of it | Review of intent and risk |
| Test-pyramid proportions | What each test type cost to write and run | "Which risk does this catch that nothing cheaper would?" |
| Pair programming between two people | Two heads only available as two people | A second head on the hard part |
| ITIL bureaucracy: tickets for their own sake, change advisory boards, sign-offs | Ops apart from dev, rare and expensive changes (DORA found CAB approval doesn't improve stability) | The incident/problem split and the KEDB |
| "Root cause" in the singular | A linear model of failure | Contributing factors and conditions (Cook, Allspaw) |
| Process maturity as a goal | — | Goodhart applies: count incidents that didn't come back, not problem tickets closed |

## What this means for chorus

- **A review's output is measured in the operator's attention (C1), not in the
  number of findings.** Ranking, one recommended way out per question, and
  rulings recorded so nothing is asked twice all follow from that.
- **A gate can confirm verification; closing validation is the operator's
  ruling (C3, C8).** Keep the person who closes it named in the record.
- **When a lens calls a practice obsolete or essential, it names the constant
  it rests on, or applies the 10× test.** A recommendation that rests on a
  derivative says so, and its expected lifetime is a few years.
- **Findings that recur across rounds are problems, not incidents.** They want
  an owner and a permanent fix, and their known workaround belongs where the
  next round reads it.
