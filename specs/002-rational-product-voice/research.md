# Phase 0 Research — Constraint-and-Flow Advisor

All open questions from the spec's "Persona synthesis (working default)" assumption were resolved
during brainstorming (see the spec's confirmed assumption block). There are **no remaining
NEEDS CLARIFICATION**. This file records the decisions in Decision / Rationale / Alternatives form.

---

## D1 — Persona spine: Goldratt's Theory of Constraints

**Decision**: The persona's first-principles spine is Eliyahu Goldratt's Theory of Constraints —
one binding constraint at a time; total throughput is governed by it alone; the sum of local optima
is not the global optimum; identify → exploit → subordinate → elevate → repeat; never let yesterday's
policy become today's constraint.

**Rationale**: ToC names the chorus's disbalance more precisely than any other framework: every craft
persona is a *local optimizer* (Evans the model, Uncle Bob the structure, Richards the -ilities), and
their sum is not the global optimum. Holding global throughput is the new voice's whole remit. It also
converts the persona's core move from weak ("is this item deferrable?") to sharp ("is this on the
constraint?"), and restates the user's motto operationally ("aggressively trim side branches that could
be deferred" = "subordinate the non-constraint").

**Alternatives considered**:
- *Ries / Duke / Cagan only* (the spec's original default): strong on epistemics (validated learning,
  thinking in bets, outcome over output) but thin on the **mechanism** for deciding what to cut first.
  Kept as cited lineage, not the spine.
- *Beck's YAGNI / simple design*: already represented by Kent Beck; it is craft-deferral, not
  product/throughput economics. Rejected as redundant and under-scoped.

## D2 — Modernization bridge: Reinertsen's product-development flow economics

**Decision**: Donald Reinertsen's *Principles of Product Development Flow* is the load-bearing
modernization — cost of delay, **CD3** (cost-of-delay ÷ duration), WIP limits, small batches, queueing
theory — and is named as the second pillar alongside Goldratt.

**Rationale**: Reinertsen translates Goldratt's factory into software product development and supplies
real math for two spec mechanics that were otherwise hand-wavy: the deferability ranking dimension
(FR-011, via CD3) and the priced trade-off in reconciliation (FR-008, via cost of delay). This is what
keeps the persona "foundational yet up to date" rather than a 1984 manufacturing metaphor.

**Alternatives considered**:
- *DORA / Accelerate only*: useful as throughput proxies (lead time, deploy frequency, MTTR) and
  retained as a cited measurement vocabulary, but DORA describes delivery health, not the prioritisation
  calculus. Insufficient as the bridge.
- *No second named thinker (pure first-principles)*: leanest, but leaves "modernized" implicit; the user
  explicitly asked for grounding in up-to-date technique. Rejected.

## D3 — Naming the constraint: the validated-learning loop, not the codebase

**Decision**: The binding constraint of a software product is the **cycle time of the validated-learning
loop** — how fast the team can pose a hypothesis and get a trustworthy verdict. The codebase is
*congealed hypothesis*; its only economic meaning is whether it speeds up or slows down the next verdict.

**Rationale**: This is the single move that prevents naïve ToC application. It answers the spec's
"what's the bottleneck of the codebase?" edge case head-on (the bottleneck is never the codebase) and
the "reckless-speed" edge case (a loop that yields no learning has zero throughput, so it is rejected,
not rushed). First principles are transferable; naïveté comes from mis-naming the constraint.

**Alternatives considered**: naming the constraint as code quality, team capacity, or deployment
frequency — each re-introduces a local-optimum trap the persona exists to refute. Rejected.

## D4 — Persona name: `constraint-and-flow-advisor`

**Decision**: Published as `constraint-and-flow-advisor`, following the synthesized-concept naming of
`delivery-and-ops-advisor` and `security-and-trust-advisor`.

**Rationale**: Names the two pillars (constraint = Goldratt, flow = Reinertsen) at a glance; parallel in
form to the existing synthesized personas; signals the spine without cosplaying a single thinker.

**Alternatives considered**: `learning-velocity-advisor` (centers the metric, reads less like a craft
counterweight); `rational-product-advisor` (continuity with the spec title, but undersells the ToC/flow
spine). Both rejected in favour of the pillar-naming.

## D5 — Sanctioned evidence form (clears I8 without a `file:line` anchor)

**Decision**: The advisor satisfies the I8 evidence gate via a **falsifiable constraint argument**:
named constraint + throughput / cost-of-delay reasoning + the cheapest experiment that would settle it.

**Rationale**: Deferral arguments rarely have a single line of code to point at. This form is a *stronger*
bar than a vague opportunity-cost statement — it is falsifiable — so the gate is extended, not weakened
(FR-007). Tagged in the chorus as a `[principle]`-class evidence the persona carries.

**Alternatives considered**: exempting the persona from the evidence gate (rejected — erodes I8);
forcing a `file:line` anchor (rejected — would suppress legitimate deferral findings).

## D6 — Deferability ranking: CD3 / cost-of-delay

**Decision**: The persona's contribution to Phase 4 ranking is a cost-of-learning / iteration-speed
dimension computed via Reinertsen's cost of delay and CD3, so a cheap high-information experiment can
outrank an expensive low-information correctness investment by economics rather than assertion (FR-011).

**Rationale**: Makes US3 concrete and gives the existing Cost/Value/Convergence scoring an explicit
opportunity-cost axis sourced from one lens, without changing the ranking machinery.

## D7 — Persona file structure follows `security-and-trust-advisor.md`

**Decision**: Author the new agent file with the same anatomy as the most-recent persona:
YAML frontmatter (`name`, `description` with lineage + 3 worked example contexts, `model: inherit`,
`color`, `memory: user`) and body sections — Central Thesis · Three Convictions · Accusations You Are
Built To Make · Five Whys (with worked examples + a bedrock statement) · Scope and Anchor Files ·
What You Do Not Do · Relationship to Other Personas · Memory and Project Context.

**Rationale**: Matches the deliberate authoring convention (cross-cutting concerns absorbed natively in
each persona's own voice; full Five-Whys with worked examples; bedrock statement). A prior thinning of
personas to one-line stubs was judged a regression and reversed — individuality is required.

**Bedrock (Five-Whys terminus)**: *a 99%-defensible claim that a given piece of work is off the learning
constraint* — named constraint, throughput/cost-of-delay reasoning, and the cheapest settling experiment.

## D8 — Roster-surface inventory (8 → 9)

**Decision**: Update every surface that counts or enumerates personas, plus the stale installer text.
See `contracts/roster-consistency.md` for the authoritative checklist. Surfaces: `skill/chorus-review/
SKILL.md` (description list + Phase 0 "roster is eight"), `skill/chorus-review/INTEGRATION-LAYER.md`
("Eight lenses"/"eight-lens", 2 spots), `README.md` (headline count + name list, Install line,
Principles matrix new column), `templates/CHORUS-PROJECT.template.md` (verify), `install.sh` (L4/L38
"seven" → "nine").

**Rationale**: FR-013 / SC-005 require all enumeration surfaces to agree on the new total and name the
advisor. The `install.sh` text was already stale ("seven" while 8 agent files existed); correcting it to
"nine" fixes the pre-existing drift in the same pass.

**Note**: `install.sh` loops over all `agents/*.md`, so it functionally installs whatever files exist —
the count text is cosmetic but must still be correct per SC-005.
