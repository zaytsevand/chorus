# Quickstart & Conformance — premise pass in Gate A

The project's first-class verification surface (Principle V). Each `C-*` stanza is a **falsifiable check** an operator (or a future gate) runs against the canon after `/speckit-implement`. Checks map to the spec's Success Criteria.

## Walkthrough (what the feature does)

1. A spec enters Gate A. **Before** the within-frame design review, the seated panel runs the **premise pass**: it attacks the premise and steelmans the null/an alternative, applies the fixed red-team checklist RT-1..RT-6, and authors premise-tagged findings.
2. The vote confirms each finding's **scope** (premise vs within-frame); within-frame findings are **parked** for the normal review.
3. Premise findings run Gate A's **existing tally**. A premise 🔴 surfaces to the operator as a **premise-level block** (reframe / recorded override / stop).
4. If the premise survives, a **substantive honest-null** is recorded (each attack: lens + steelman; + RT outcomes). A no-attack pass re-runs (bounded N=3, then escalate).
5. The same brief is invocable standalone: `chorus challenge <target>`.

## Conformance stanzas

| ID | Check | Falsified by | SC |
|----|-------|--------------|----|
| **C-001** | `SDLC-LAYER.md` § "Gate A — premise pass" exists and states the pass runs **before** the within-frame review; ledger ordering note records premise findings **first**. | within-frame review precedes the premise pass, or no ordering note | SC-001 |
| **C-002** | The premise-pass subsection sets finding **scope by author declaration + vote** (cites `GATE-PRIMITIVE.md` S8/S9), and **no regex/stanza** classifies scope; within-frame findings are **parked**. | a stanza/regex decides scope, or a within-frame finding counts as premise divergence | SC-002 |
| **C-003** | The **fixed red-team checklist RT-1..RT-6** is present verbatim and the brief requires each item's outcome **recorded** every pass. | a premise pass with no checklist record; checklist is model-generated/variable | SC-003 |
| **C-004** | The honest-null rule requires **substantive entries** (each a lens + steelman/reframe/doubt) + RT outcomes; a no-attack pass is a **failed pass, re-run** (bounded N=3, then escalate). | a bare/boilerplate `sound` is accepted; re-run is unbounded | SC-004 |
| **C-005** | The premise outcome is the **existing gate tally** over premise-tagged findings — **no new verdict mechanic, no severity→band mapping, no new canon file**. | any new tally/band rule, a 4→3 mapping, or a `CHALLENGE-LAYER.md` | SC-005 |
| **C-006** | A premise 🔴 is **operator-owned & self-unblocking** (cites `DECISION-PRIMITIVE.md`); it never hard-blocks with no operator path. | the lifecycle halts on a premise 🔴 with no recorded-override route | SC-006 |
| **C-007** | On the **shaky-premise fixture** (a feature that manufactures its own downstream need), the premise pass surfaces a 🔴/reframe with a stated steelman — it diverges. | the fixture run returns `sound` | SC-007 |
| **C-008** | On the **sound-premise contrapositive fixture** (an evidently-sound premise), the pass records a **substantive honest-null** — it does NOT manufacture a red. Proves the pass *discriminates* rather than reflexively attacks. | the sound fixture yields a manufactured premise 🔴/reframe | SC-004, SC-007 (Gate B Beck+Goldratt) |
| **C-CITE** | `GATE-PRIMITIVE.md` and `DECISION-PRIMITIVE.md` are **byte-unchanged**; Gates B/C in `SDLC-LAYER.md` unchanged; the brief/checklist/honest-null are defined **once** (SDLC-LAYER) and **cited** from `SKILL.md` (not restated). | any edit to the tally / Gates B/C; the brief restated in `SKILL.md` | SC-008, Principle I |
| **C-MODE** | `chorus challenge` is registered as a **mode** of `chorus` (SKILL three-modes list + frontmatter, README, install surfaces) — not a new skill — and **cites** the SDLC-LAYER brief. | a new skill/file for challenge; the mode restates the brief | FR-002 |

### Fixtures (referenced by C-007 / R3)

- **shaky-premise fixture** (C-007): a one-paragraph spec premise that manufactures its own downstream need (e.g. "we must build X to solve a problem X itself introduces"). Expected: ≥1 premise 🔴/reframe + steelman.
- **sound-premise contrapositive** (C-008, **mandatory** — promoted at Gate B on Beck+Goldratt convergence): an evidently-sound one-paragraph premise. Expected: a **substantive honest-null** (not a manufactured red) — guards the green-by-coincidence risk and the R2 asymptotic-sincerity admission. The two fixtures together prove the pass *discriminates* (fires on shaky, holds on sound) rather than reflexively attacking.

## Dogfood (the recursion)

The strongest conformance is already on record: running the agent-SDLC on **this** feature made the unmodified Gate A challenge 013's own premise (cycle 0, 9 reds), the operator rescoped to the re-brief (option A), and cycle 1 verified the rescope clears. `agent-sdlc-log.md` is the executable trace that the premise-pass charter produces divergence — on itself.
