# Contract: Per-feature SDLC ledger

One file per feature at `specs/<feature>/agent-sdlc-log.md`. Appended once per
gate execution. It is the audit trail proving each gate fired honestly; a
reviewer must be able to reconstruct the run from this file alone (SC-007).

## File header (written once, at run start)

```markdown
# Agent-SDLC Ledger: <feature name>

- **Feature**: specs/<feature>/
- **Run started**: <date>
- **Mode**: agent-SDLC (lifecycle)
- **Status**: in-progress | halted-awaiting-operator | complete
```

## Per-gate section (appended each time a gate executes)

```markdown
## Gate <A|B|C> — <design | plan/tasks | implementation> — cycle <n>

**Corpus**: <artifacts reviewed>

### RSVP
| Lens | Decision | Relevance | Reason |
|------|----------|-----------|--------|
| ...  | JOIN/ABSTAIN | 0–3 / — | ... |

Seated: <≤5 lenses>.  Overflow ties surfaced: <yes/no — detail>.
Quorum: <ok | re-pinged | aborted>.

### Findings register
| ID | Lens | Evidence | Proposed | Post-tally | Gating? | Summary |
|----|------|----------|----------|-----------|---------|---------|
| F1 | ...  | file:line / [principle] | 🔴/🟡/🟢 | 🔴/🟡/🟢 | yes/no | ≤20 words |

### Vote tally
| ID | PRIORITIZE | OVER-RATE | Abstain | Result |
|----|-----------|-----------|---------|--------|
| F1 | n | n | n | hold/demote/unvoted |

### 🔴 resolution log
| ID | Disposition | Detail |
|----|-------------|--------|
| F1 | resolved (incorporation) / waived | how it was resolved, or the waiver rationale |

### Outcome
<pass → proceeding to <next phase>> | <halt → awaiting operator on F#> | <escalated: loop bound reached after 3 cycles>
```

## Rules

- **Every gating 🔴 has a row in the resolution log** before the run can show
  `complete` — either `resolved` or `waived` with a rationale (S4: no silent
  pass).
- **Loop cycles are numbered**; the third cycle without clearing a 🔴 records
  `escalated` (S7).
- **Append-only**: a re-run of a gate adds a new `cycle <n>` section; prior
  cycles are not edited away (audit integrity / I7).
- The ledger is **not** placed under `docs/reviews/` — that directory is for
  periodic project-state rounds, not per-feature lifecycle runs.
- **Unclaimed fixed-viewpoint records** (e.g. a `spec-walkthrough` DRIFT or
  SURPRISE that no persona authored into a finding) are listed in a short
  "Unclaimed extract records" subsection of the gate — visible, non-gating, so a
  real spec↔code divergence cannot silently vanish (I7).
