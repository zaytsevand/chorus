# Process constants

**Advisory.** Nothing here binds a lens or the conductor. A lens may cite a
constant as the reason a practice matters or will fade; it never has to. The
rules the suite enforces on itself are the I1–I9 invariants in `CONDUCTOR.md`;
these are something else: properties of the people and the world a project works
in, which no rule changes.

Cite a constant by its id and name, e.g. "PC1 attention". Ids are never reused or
renumbered; a retired constant keeps its number. `scripts/check-suite-integrity.sh`
FC8 checks that each id is defined once, here, and that every citation resolves.

## Two tests

- **What cost does the practice pay down?** Name it, then ask whether that cost
  falls as writing code gets cheaper. If it does, the practice is a cost-tuned
  form (below) and its shape will change. If the cost is one of the constants,
  the practice stays, and usually matters more.
- **Can a tool remove this cost, or only move it?** A cost a tool removes
  (recall, typing, boilerplate) is a temporary bottleneck. A cost a tool only
  moves is a constant.

Both say where to look first, not where a project's constraint is. Find that in
the project's own evidence before a finding leans on a constant.

## The constants

| Id | Constant | Why tools don't remove it |
|---|---|---|
| PC1 | **Attention** for decisions that can't be delegated | Tools cut how many things need it, not how much there is in a day. When writing gets cheap, the bottleneck becomes what to read. |
| PC2 | **Working-memory slots** (about four) | Training grows what fits in a slot (chunk size), never the slot count. A system that doesn't fit in one head can't be checked by one person, however fast it was written. |
| PC3 | **Accountability** | Someone answers for the outcome; a tool cannot. What you are accountable for is what you can't stop paying attention to. |
| PC4 | **Communication bandwidth between people** | Unchanged since speech. Coordination cost grows with the square of the team, and the system copies the organisation (Conway). Agents make each person faster, not the links between people. |
| PC5 | **Essential complexity** | Tools strip accidental complexity; the domain's own complexity remains and becomes a larger share of the work (Brooks). |
| PC6 | **Not knowing what you want** | Requirements are hypotheses. Generating options got cheap; learning which one was right did not. |
| PC7 | **Feedback latency from reality** | Users, markets and production failures respond on their own schedule. That sets the pace of the learning loop. |
| PC8 | **Goal confirmation** (did the result reach its goal) | Checking against a spec keeps getting cheaper. Confirming the goal closes only against reality, or an oracle the project declares, and ends with a person (PC3) spending attention (PC1). A spec is itself a hypothesis about the goal. |
| PC9 | **Software in use must change** (Lehman) | The environment moves, so the software moves or decays. Maintenance never reaches zero. |

One asymmetry follows from PC8: writing gets cheaper faster than confirming the
goal, so the share of effort spent stating and confirming the goal keeps rising.
That is a direction of travel, not a measurement of any one project.

## Practices that rest on the constants

| Practice | Constants |
|---|---|
| Information hiding and modularity: a module fits in one head | PC2, PC5 |
| Naming and domain language: one chunk instead of five | PC2, PC4 |
| Limits on work in progress, small batches | PC1, PC7 |
| Explicit ranking: one item on top, not a list of equals | PC1 |
| Decisions written down so nobody pays for the same question twice (an ADR, a recorded operator ruling) | PC1, PC3 |
| A named owner for each decision and each result | PC3 |
| Blameless postmortems | PC3, PC7 |
| Team boundaries matching system boundaries, explicit contracts between them | PC4 |
| Domain modelling: separate essential from accidental | PC5 |
| Iteration: build, show, learn | PC6, PC7 |
| Small, reversible delivery; observability in production | PC7, PC9 |
| The goal stated as an observation before work starts ("we'll know it worked when we see X") | PC8 |
| Automated checks as the fast oracle for verification: a failure arrives quickly and names its cause; they never confirm the goal | PC7, PC2, PC8 |
| Refactoring: keep the cost of change low | PC9, PC2 |
| Recurring findings get an owner and a permanent fix (what ITIL calls a problem, as distinct from an incident) | PC3 |

As code gets cheaper, modularity and naming matter more: an agent writes any
volume, and the person accepting it still has four slots.

## Cost-tuned forms

A form tuned to one cost structure. Its purpose came from a constant and
survives; its shape came from a cost that is falling, and changes.

| Form | What it was tuned to | What survives |
|---|---|---|
| Line-by-line code review | Code small enough for a person to read all of it | Review of intent and risk (PC1, PC2) |
| Test-pyramid proportions | Partly what each kind of test cost to write, which is falling | How fast a failure arrives (PC7) and how precisely it names the cause (PC2): "which risk does this catch that nothing cheaper would?" |
| "Root cause" in the singular | A linear model of failure | Contributing factors and conditions (Cook, Allspaw) |

## Why chorus works the way it does

Rationale for rules that live elsewhere; each points at its rule.

- **A review's output is measured in the operator's attention (PC1).** This is
  why rounds rank, offer one recommended way out per question and record rulings
  so nothing is asked twice (`CONDUCTOR.md`, the EWD-340 methodology).
- **The chorus signs its advice, never the result (PC8, PC3).** I9 in
  `CONDUCTOR.md` holds the rule; the record's `goal_reached` field shows whether
  the goal is still open, confirmed by a declared oracle, or ruled by the operator.
- **A constant can serve as a finding's principle** because it states a reason
  that holds across projects. The rule for when it may (no project code
  contradicts it) is in the chorus-review round brief, item 8.
- **Recurring findings want an owner (PC3).** The next round reads them in the
  record's baseline.
