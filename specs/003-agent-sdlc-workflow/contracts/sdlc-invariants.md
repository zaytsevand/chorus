# Contract: SDLC invariants S1–S9 (checkable assertions)

These extend the existing I1–I8 (`INTEGRATION-LAYER.md`). S1–S7 bind the SDLC
orchestrator; S8–S9 bind the gate primitive and therefore the base round too.
Each is phrased as an assertion an auditor (or a reviewing chorus) can check
against the ledger and the skill docs.

| ID | Scope | Assertion | Extends | Spec ref |
|----|-------|-----------|---------|----------|
| **S1** | lifecycle | The orchestrator authored no spec/plan/tasks/code; every artifact change traces to a speckit phase-runner in the ledger. | I1 | FR-003, SC-001 |
| **S2** | lifecycle | RSVP was collected independently at each gate; no JOIN/ABSTAIN was carried across gates. | I2 | FR-008 |
| **S3** | lifecycle | No panel exceeded 5; any overflow was seated by persona-declared relevance score, ties surfaced to the operator. | I2 | FR-009, SC-008 |
| **S4** | lifecycle | No gate passed with an open 🔴; each 🔴 shows `resolved` or `waived(rationale)` in the ledger. | I7 | FR-010, SC-002 |
| **S5** | lifecycle | Every incorporation revised the spec and regenerated downstream artifacts via speckit; no downstream artifact was hand-patched. | I1/I6 | FR-011 |
| **S6** | lifecycle | Every counted finding satisfies the I8 evidence gate (file:line or principle tag); the rest were demoted and excluded from the tally. | I8 | FR-013 |
| **S7** | lifecycle | No gate loop ran past 3 cycles; the 3rd uncleared cycle escalated to the operator. | — | FR-012 |
| **S8** | gate-primitive | No finding was voted on by its own author; the author of a finding is never its grader. | I1 | FR-006, SC-003 |
| **S9** | gate-primitive | No vote or grade was synthesized by the orchestrator; the tally aggregated real persona votes only. | I1/I6 | FR-007, SC-003 |

## How these get checked

- **Self-audit at run end**: the orchestrator appends an S1–S9 checklist to the
  ledger, each item marked pass with a pointer to the evidence (a ledger row or
  a phase-runner invocation).
- **Dogfood validation** (`quickstart.md`): a real SDLC dry-run exercises S1–S9
  and confirms the ledger lets a reviewer verify each (SC-007).
- **Structural assertions**: exactly one `GATE-PRIMITIVE.md` exists and both
  `INTEGRATION-LAYER.md` and `SDLC-LAYER.md` reference it (SC-006); no
  per-author finding cap remains in `SKILL.md` (FR-005).
