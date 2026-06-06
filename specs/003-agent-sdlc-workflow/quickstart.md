# Quickstart: Agent-SDLC Workflow

How an operator runs a feature through the agent-SDLC, and how the dogfood
validation confirms the invariants.

## Running an SDLC round

1. **Start the lifecycle.** In Claude Code, say:

   > run the agent-SDLC on feature 0NN

   The orchestrator confirms the feature directory and the scope-exclusion list
   (as the base chorus does), then begins.

2. **Specify / clarify / plan.** The orchestrator invokes `/speckit-specify`
   (if the spec does not exist), pauses for an optional operator
   `/speckit-clarify`, then `/speckit-plan`.

3. **Gate A — design review.** The orchestrator:
   - sends each roster persona a per-gate RSVP (`contracts/rsvp-and-panel.md`);
   - seats ≤ 5 by relevance;
   - runs the four-stage primitive (`contracts/gate-primitive.md`): Extract →
     uncapped Author → real Vote → deterministic Tally;
   - writes the Gate-A ledger section;
   - **if any 🔴**, halts and surfaces it; you resolve via incorporation
     (`/speckit-clarify` → `/speckit-plan`) and the gate re-runs (≤ 3 cycles);
   - **if none**, proceeds.

4. **Tasks → Gate B → implement → Gate C.** Same pattern: `/speckit-tasks`,
   then Gate B (incorporation = clarify → plan → tasks), then
   `/speckit-implement`, then Gate C (incorporation = code fix, or clarify →
   re-implement for a spec gap). Gate C additionally feeds the headless
   `spec-walkthrough` reconciliation into Extract as a non-authoritative
   viewpoint.

5. **Read the ledger.** `specs/0NN-.../agent-sdlc-log.md` holds every gate's
   RSVP, findings, votes, 🔴 dispositions, and loop counts, plus the S1–S9
   self-audit.

## What "done" looks like

- The run's `Status` is `complete`.
- Every gating 🔴 in the ledger is `resolved` or `waived(rationale)` (S4/SC-002).
- The S1–S9 self-audit at the end of the ledger is all-pass with evidence
  pointers.

## Dogfood validation (the feature's test)

This feature has no unit tests; it is validated procedurally by running itself
on a **small real feature** and asserting:

- **SC-001 / S1**: every artifact change in the ledger points to a speckit
  phase-runner; none was authored by the orchestrator.
- **SC-002 / S4**: no gate section shows a passed gate with an open 🔴.
- **SC-003 / S8,S9**: no finding's vote list includes its author; every vote
  names a real persona.
- **SC-004 / FR-005**: across two authoring runs the finding count tracks the
  artifact, not a fixed number.
- **SC-006**: exactly one `GATE-PRIMITIVE.md`; `INTEGRATION-LAYER.md` and
  `SDLC-LAYER.md` both reference it; `grep` finds no per-author finding cap in
  `SKILL.md`.
- **SC-007**: a reviewer reconstructs the whole run from the ledger alone.
- **SC-008 / S3**: no gate seated more than 5; overflow seating reproduces from
  the recorded relevance scores.

## Structural smoke checks (cheap, repeatable)

```sh
# exactly one canonical primitive, referenced by both layers
test -f skill/chorus-review/GATE-PRIMITIVE.md
grep -l GATE-PRIMITIVE skill/chorus-review/INTEGRATION-LAYER.md skill/chorus-review/SDLC-LAYER.md

# no per-author finding cap survives in the base round
! grep -Ein '3[-–]6 findings|limit .* findings|max .* findings' skill/chorus-review/SKILL.md
```

## Worked example — a sample Gate-A ledger section

Illustrative (not a recorded run): shows how the four-stage primitive and the
symmetric tally produce a gating decision, and how the ledger makes it auditable.
Demonstrates SC-002 (no silent 🔴), SC-003 (author excluded from its own vote),
SC-004 (uncapped — counts differ per lens), SC-007 (reconstructable), SC-008
(≤ 5 seated).

```markdown
## Gate A — design review — cycle 1

**Corpus**: specs/0NN-example/spec.md, plan.md

### RSVP
| Lens | Decision | Relevance | Reason |
|------|----------|-----------|--------|
| constraint-and-flow | JOIN | 3 | scope/sequencing is the live question |
| delivery-and-ops    | JOIN | 2 | release-path implications |
| security-and-trust  | JOIN | 2 | new external surface |
| architecture        | JOIN | 2 | seam choice |
| product (Cooper)    | JOIN | 1 | who benefits |
| domain (Evans)      | ABSTAIN | — | no model change this round |

Seated: 5 (cap reached; product seated at the 5th slot, no tie). Quorum: ok.

### Findings register
| ID | Lens | Evidence | Proposed | Post-tally | Gating? | Summary |
|----|------|----------|----------|-----------|---------|---------|
| F1 | constraint-and-flow | plan.md:40-58 | 🟡 | 🔴 | yes | Repo layer built before any user has exercised the flow |
| F2 | security-and-trust  | spec.md:88   | 🟡 | 🟡 | no  | Callback URL has no allowlist named |
| F3 | architecture        | plan.md:31   | 🟢 | 🟢 | no  | Seam is fine; one naming nit |

### Vote tally
| ID | PRIORITIZE | OVER-RATE | Abstain | net | Result |
|----|-----------|-----------|---------|-----|--------|
| F1 | 3 (sec, arch, deliv) | 0 | 1 (Cooper) | +3 | escalate 🟡→🔴 |
| F2 | 1 | 1 | 2 | 0 | hold 🟡 |
| F3 | 0 | 0 | 4 | 0 | hold 🟢 (unvoted) |

### 🔴 resolution log
| ID | Disposition | Detail |
|----|-------------|--------|
| F1 | resolved (incorporation) | spec clarified to defer the repo layer; /speckit-plan regenerated |

### Outcome
cycle 1: HALT on F1 → incorporation (/speckit-clarify → /speckit-plan) →
cycle 2 re-run: F1 no longer raised → PASS, proceeding to /speckit-tasks.
```

Note F1: the *author* (constraint-and-flow) proposed 🟡; three **other** lenses
converged PRIORITIZE (`net +3`) and the tally escalated it to a gating 🔴 — the
"converging lenses earn 🔴" rule as deterministic arithmetic, with the author
excluded from its own vote (S8). The end-of-run ledger also appends the S1–S9
self-audit, each line pointing at the row that evidences it.
