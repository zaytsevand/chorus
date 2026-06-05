# Quickstart — validating the Constraint-and-Flow Advisor

No automated tests exist for personas; validation is **behavioural** (a chorus dry-run) plus a
**consistency grep**. This is the acceptance procedure for the feature, mapped to SC-001…SC-007.

## 0 · Install

```bash
./install.sh --force
# expect: copies skill/chorus-review/*.md and agents/*.md into ~/.claude/;
#         "Installing nine persona agents"; 9 agent files present in ~/.claude/agents/
ls ~/.claude/agents/constraint-and-flow-advisor.md   # exists
```

## 1 · Roster consistency (SC-005, SC-006)

```bash
grep -rniE '\b(seven|eight)\b' \
  skill/chorus-review/SKILL.md skill/chorus-review/INTEGRATION-LAYER.md \
  README.md install.sh templates/CHORUS-PROJECT.template.md
# PASS: no remaining hit refers to the default persona roster count
```
- Confirm every enumerating surface names `constraint-and-flow-advisor` (SC-005).
- Confirm every existing persona entry is unchanged except for the inserted ninth (SC-006, additive-only).

## 2 · The voice participates and defers (SC-001, SC-002)

Run a chorus round (`/chorus-review` or "spawn the regular chorus") on an area where the craft personas
recommend non-trivial investment (new abstractions, tests, or structure).

- **PASS (SC-001)**: the advisor self-selects via RSVP, reads the same anchor files, and emits at least
  one **defer / cut / sequence** recommendation carrying an explicit opportunity cost and a named
  hypothesis test.
- **PASS (SC-002)**: every deferral recommendation in the artifact is attributable to the advisor's
  governing belief and is **not** mis-attributable to a craft persona.

## 3 · Abstention is honest (US1 scenario 2)

Run a round where everything surfaced is genuinely load-bearing.

- **PASS**: the advisor either replies ABSTAIN at RSVP or states "nothing deferrable this round" — it does
  **not** manufacture a cut to justify its presence (FR-003).

## 4 · Priced trade-off in reconciliation (SC-003)

Construct a round with a direct conflict between a craft persona's "invest now" and the advisor's
"defer behind a test."

- **PASS**: the reconciliation output records **both** positions with their costs and the resolving
  experiment, in 100% of such conflicts — it does not auto-resolve toward "more rigor" or "ship it."

## 5 · Hard invariants override (SC-004)

Have the advisor propose deferring something another persona flagged as a hard security / correctness /
data-integrity invariant.

- **PASS**: the artifact marks that item **ineligible for deferral**; the hard invariant wins (FR-009).

## 6 · Deferability ranking (SC-007)

Take a completed round through Phase 4 ranking with two comparable-severity items — one a cheap hypothesis
test, one an expensive correctness investment.

- **PASS**: the ranking reflects a deferability / cost-of-learning dimension (CD3 / cost of delay) and can
  place the cheap experiment higher with a recorded rationale.

## 7 · Reckless-speed guard (FR-012)

- **PASS**: the advisor rejects work that yields no learning (zero throughput), including reckless shipping
  — confirming it optimises for *cheap and informative*, not merely *fast*.

---

### Done-when

All of §1–§7 pass on at least one real target repo, and the coverage map
(`docs/reviews/2026-06-05-chorus-coverage-map.html`) shows the prioritization/deferral axis owned at
level 3 by the new voice.
