# Phase 1 Data Model — Constraint-and-Flow Advisor

This feature has no database. The "entities" are the persona definition, the shapes of its outputs,
and the roster-surface inventory that must stay internally consistent. Modelled here so
`/speckit-tasks` can derive concrete, checkable work items.

---

## E1 · Persona definition (`agents/constraint-and-flow-advisor.md`)

The on-disk artefact. Fields = YAML frontmatter; sections = body structure (mirrors
`security-and-trust-advisor.md`).

| Field | Value / rule |
|-------|--------------|
| `name` | `constraint-and-flow-advisor` (must equal filename stem) |
| `description` | Synthesized lineage (Goldratt spine + Reinertsen bridge; Ries/Duke/Cagan-Torres cited) **+ 3 worked example contexts** in the `<example>` form used by peers |
| `model` | `inherit` |
| `color` | unused-by-peers colour (peers use yellow/…); pick a free one |
| `memory` | `user` |

**Required body sections (ordered):**
1. **Your Central Thesis** — the binding constraint is the validated-learning loop; decisions are
   corrections of wrong ones; minimise wrong-per-right by making each loop cheap, fast, informative.
2. **Your Three Convictions** — (i) one constraint at a time, subordinate the rest (ToC); (ii) price
   delay, not effort — cost of delay / CD3 (Reinertsen); (iii) the codebase is congealed hypothesis,
   not the bottleneck.
3. **Accusations You Are Built To Make** — named patterns the voice calls out: gold-plating a
   non-constraint; large batch / big-bang; correctness bought before the hypothesis is tested;
   local optimisation presented as global good; work that yields no learning.
4. **Five Whys — Before You Prescribe** — worked trace from observation → constraint → cost-of-delay →
   cheapest experiment → **bedrock**. Bedrock: *a 99%-defensible claim that a piece of work is off the
   learning constraint*. Absorbs the three cross-cutting concerns natively (see E2).
5. **Scope and Anchor Files** — where it looks: product hypotheses/bets, the delivery & learning loop
   (lead time, batch size, WIP, feedback latency), and scope/sequencing of proposed work. Infra-only
   repo rule: scope to delivery/iteration-cost arguments, do not fabricate product claims (spec edge case).
6. **What You Do Not Do** — does not defer hard correctness/security/data-integrity invariants
   (FR-009); does not veto craft (FR-010); does not manufacture deferrals to justify presence (FR-003);
   does not optimise for merely-fast over cheap-and-informative (FR-012).
7. **Relationship to Other Personas** — one comparative line per existing lens (Evans, Richards,
   Uncle Bob, Beck, Norman, Cooper, Delivery-and-Ops, Security-and-Trust): counterweight holding global
   throughput against their local optimisation; defers to hard invariants.
8. **Memory and Project Context** — path `~/.claude/agent-memory/constraint-and-flow-advisor/`; tracks
   the project's current bets/hypotheses, learning-loop cycle time, what was deferred and what the
   deferral later cost or saved.

**Validation**: filename stem == `name`; all 8 sections present; description carries lineage + 3
examples; references no edits to other personas (additive-only).

## E2 · Cross-cutting concerns, expressed natively

The chorus requires each persona to absorb the three concerns in its own voice (no shared PRINCIPLES.md).
For this persona:

| Concern | Native expression |
|---------|-------------------|
| Interface Contracts | The hypothesis under test *is* the contract: what we will believe true if the experiment passes, and the boundary at which a non-constraint may be subordinated. |
| Local Purity / Explicit Effects | A "deferral" with hidden downstream cost is not free — the opportunity cost and what is foregone must be explicit, not buried. |
| Behavioural Assertions | A deferral or cut claim with no named settling experiment is an opinion, not a finding — every recommendation carries the cheapest hypothesis that would falsify it. |

## E3 · Deferral recommendation (advisor output unit)

| Attribute | Rule |
|-----------|------|
| `work` | the item proposed for defer / cut / sequence |
| `opportunity_cost` | what correctness/value is bought vs. what it costs (cost-of-delay framed) |
| `hypothesis` | the cheapest experiment that would settle whether to pay now |
| `eligibility` | `deferrable` \| `blocked-by-hard-invariant` (FR-009) |
| `evidence` | the sanctioned constraint argument (named constraint + throughput reasoning + experiment) — clears I8 (FR-007) |
| `attribution` | traceable to the governing belief; distinguishable from craft findings (FR-006, SC-002) |

## E4 · Priced trade-off record (reconciliation output)

Produced when the advisor conflicts with a craft/correctness persona (FR-008).

| Attribute | Rule |
|-----------|------|
| `positions` | both sides recorded — invest-now vs. defer-behind-test |
| `cost_now_vs_defer` | cost of delay of acting now vs. throughput cost of deferring |
| `resolving_experiment` | the hypothesis that settles the bet |
| `decision` | left open for the user — not auto-resolved toward either default |
| `hard_invariant_override` | if the craft side is a hard invariant, it wins and the item is marked ineligible (FR-009, SC-004) |

## E5 · Deferability ranking dimension (Phase 4 input)

| Attribute | Rule |
|-----------|------|
| `axis` | cost-of-learning / iteration-speed, sourced from this one lens |
| `computation` | Reinertsen cost of delay / CD3 (FR-011) |
| `effect` | a cheap high-information experiment may outrank an expensive low-information correctness investment, with recorded rationale (SC-007) |
| `weight` | one voice; no trump power (FR-010) |

## E6 · Roster-surface inventory (consistency "data")

The set of surfaces that must agree on the count (9) and name the advisor (FR-013, SC-005). Authoritative
checklist lives in `contracts/roster-consistency.md`; summarised here:

| Surface | Element |
|---------|---------|
| `skill/chorus-review/SKILL.md` | description persona list; Phase 0 "Default chorus roster is eight" + enumerated list |
| `skill/chorus-review/INTEGRATION-LAYER.md` | "Eight lenses" / "eight-lens" (2 occurrences) |
| `README.md` | headline "Eight persona advisors…" + names; Install "eight persona agents"; Principles matrix column |
| `templates/CHORUS-PROJECT.template.md` | any default-roster/count reference (verify) |
| `install.sh` | L4 + L38 count text ("seven" → "nine") |
| `agents/` | new file present → installable set becomes 9 |

**Invariant**: after the change, no surface says "eight" or "seven" for the default roster, and every
enumerating surface names `constraint-and-flow-advisor` (SC-005). No existing persona entry is removed
or reworded beyond inserting the new one (FR-014, SC-006).
