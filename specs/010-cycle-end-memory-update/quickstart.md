# Quickstart & Conformance: Cycle-End Memory Update Phase (spec 010)

Verification surface (Principle V) for the sign-off memory-update bookend. There is no
runtime; conformance is these worked examples plus the inspectable artifacts they name
(the ledger's `## Memory update (sign-off)` section, per-persona records, the addendum).
Each example maps to a Success Criterion.

## The rule

At **sign-off** (after Gate C clears, once per lifecycle, never on an aborted run — FR-001),
the orchestrator **dispatches each seated persona** to write back this cycle's durable
learnings. It authors nothing itself (S1/S9). Routing:

| Scope | Decision band | Where it goes |
|-------|---------------|---------------|
| `lens-specific` | 🟢 auto (mechanically decidable) | the persona's own `~/.claude/agent-memory/<persona>/` record |
| `project-wide` | operator-owned | a **single accept/reject diff** to `docs/reviews/CHORUS-PROJECT.md` — never auto-written |

A learning is **durable** (FR-003a) iff it BOTH (a) carries a re-groundable locator into a
live source and (b) generalizes beyond this run's spec delta. Persisted text is a locator +
≤~2-sentence hint, never a verdict. A **secret pre-filter** (FR-007) runs on every candidate
*before* any write or proposal, independent of the operator answer.

---

## Worked example 1 — the closed loop across two runs (SC-006, the headline)

The whole point: run 2 starts from what run 1 learned instead of re-deriving it.

**Run 1 — feature 010 itself, at sign-off.** The architecture lens (Richards) learned during
Gate A that the chorus's two-tier memory has a single write path (spec 004 FR-005/FR-017). It
distills *its own* Gate-A ledger rows and writes a `lens-specific` fact to its record:

```
~/.claude/agent-memory/mark-richards-architect/record.md
  ## Project: chorus-review — feature/spec deltas
  - [ref] single addendum write-path = scope-tagged operator-accepted write-back
    → EXPLORATORY-PHASE.md §Confirmed-fact scope  (fp: <digest of cited span>)
    hint: "only write-direction into the operator-owned addendum is the accepted write-back"
```

This is a **locator + hint**, not the conclusion itself (FR-003 — memory is an index).

**Run 2 — a later feature, Gate A exploratory phase.** Richards' read-side harvest
(`EXPLORATORY-PHASE.md` step 2 "reuse prior record") finds the fact already present,
re-validates the fingerprint against the cited span, and **does not re-derive it**. The loop
opened on read in run 1 is closed on write — and reused on read in run 2.

✅ **SC-006**: run 2's exploratory phase reads a fact run 1's memory-update phase persisted.

---

## Worked example 2 — `lens-specific` auto, `project-wide` proposed (SC-001, SC-002)

Two learnings reach sign-off:

- **L1 (`lens-specific`, Cooper):** "this project's 'user' is a solo operator, so terminal
  exit-with-no-recovery is a real gulf here" → locator into the gate's ledger row.
- **L2 (`project-wide`, Goldratt):** "the project's binding constraint is validated-learning
  cycle time, not code correctness" → would change the shared *Project understanding*.

```
L1  scope=lens-specific  → 🟢 auto → written to cooper's record. Orchestrator authored 0.
L2  scope=project-wide   → collated as ONE accept/reject diff to CHORUS-PROJECT.md
                           "Project understanding" → surfaced to operator. NOT auto-written.
```

✅ **SC-001**: every seated persona with a memory dir has its `lens-specific` deltas persisted
as locators; orchestrator authored 0.
✅ **SC-002**: 0 auto-writes to `CHORUS-PROJECT.md` — L2 lands iff the operator accepts.

---

## Worked example 3 — reject vs no-response are distinct (SC-003, SC-003a)

L2 from example 2 is surfaced. Three operator outcomes, three results:

```
ACCEPT       → write-back applied via spec-004 path; addendum gains the scope-tagged fact.
              DecisionRecord: accepted. Sign-off proceeds.
REJECT       → addendum BYTE-UNCHANGED. DecisionRecord: rejected (default = unchanged).
              Fact discarded, NOT re-offered. Sign-off proceeds.
NO-RESPONSE  → addendum BYTE-UNCHANGED. Proposal QUEUED in ledger pending-proposals list,
              RE-OFFERED at next sign-off / read by next exploratory phase. Sign-off proceeds.
```

The two non-accept outcomes must not collapse (FR-006): reject *discards*, no-response *defers*.

**Bounded re-offer (COOP-2).** No-response is not re-offered forever:

```
sign-off 1 no-response → deferred, queued
sign-off 2 no-response → re-offered, still queued
sign-off 3 no-response → re-offered, still queued
sign-off 4            → LAPSED: moved to passively-readable pending list, NOT re-offered.
                        terminal state (≠ reject); re-activatable only on operator initiative.
```

So "defer" cannot become a standing tax that re-asks at every future sign-off until the operator
capitulates — the queue is bounded and the proposal aggregate has a terminal state for chronic
non-response.

✅ **SC-003**: rejected/unanswered proposal leaves the addendum byte-identical and never blocks
sign-off.
✅ **SC-003a**: an unanswered `project-wide` learning is re-offered next sign-off — 0 silent
losses to inattention.
✅ **SC-003b**: after N=3 unanswered sign-offs the proposal lapses; the 4th sign-off is not
interrupted by it.

---

## Worked example 4 — secret pre-filter runs before the confirm (SC-005)

Two candidate facts reach the pre-filter — one credential-shaped, one a low-entropy private fact:

```
C1 (project-wide): "DB_PASSWORD=hunter2-..."            → credential-shaped class
C2 (lens-specific): "prod API is at internal-billing.acme.corp, on-call is Jane Doe"
                                                         → structured-private-fact class (low entropy!)

both → SECRET PRE-FILTER (FR-007, agent-applied + ledger-audited):
       C1 matches credential prefix/high-entropy token  → DROPPED + logged (proposal path)
       C2 matches internal-hostname + personal-name      → DROPPED + logged (auto lens-specific path)
     both dropped BEFORE any record write or proposal; outcome identical with/without operator answer.
```

C2 is the point: a low-entropy private fact (internal hostname + name) sails past an entropy check,
so the detector names it as its **own class** — credentials are not the whole boundary (the
constitution scopes "private project facts" into a committed `CHORUS-PROJECT.md`). The drop is logged
on **both** paths, including the unwatched auto `lens-specific` path (SEC-4).

The pre-filter is **persona-applied discipline made verifiable by the ledger drop-record** — this
skill has no runtime, so the audit is the guard, not the word "mechanical." The operator-confirm
(FR-005) governs only whether an *already-secret-free* `project-wide` fact is written — it is **not**
the secrets gate.

✅ **SC-005**: 0 credential-shaped AND 0 structured-private-fact candidates persisted or proposed;
every match dropped before any write/proposal on both paths, independent of the confirm.

---

## Worked example 5 — recorded no-op, not a silent miss (FR-009)

A short polish-only run produces nothing durable: every candidate fact either lacks a locator
or merely restates this run's spec delta (fails FR-003a).

```
phase runs → no durable learnings → records in ledger:
  ## Memory update (sign-off)
  - mark-richards-architect: no-op (does-not-generalize)
  - guido-python-reviewer:   no-op (no memory dir)
  → no empty operator proposal surfaced. Sign-off proceeds.
```

A reviewer can tell a correct no-op (named reason) from a miss. ✅ **SC-004** (ledger
reconstructable): the `## Memory update (sign-off)` section alone says what entered memory.

---

## Conformance checklist

- [ ] Phase fires once, at sign-off, after Gate C — never per gate, per self-heal, or on abort (FR-001).
- [ ] N dispatch calls for N seated personas; orchestrator authors no record, synthesizes no learning (FR-002 / S1/S9 / SC-001).
- [ ] Persisted facts are locators + ≤~2-sentence hints, scope-tagged, with a fingerprint (FR-003/FR-004).
- [ ] Durable predicate (locator AND generalizes) gates persistence; no-op names its reason (FR-003a/FR-009).
- [ ] `project-wide` → single accept/reject diff; never auto-written; addendum byte-unchanged unless accepted (FR-005/SC-002).
- [ ] Reject discards; no-response defers + re-offers; sign-off never blocked (FR-006 / SC-003 / SC-003a).
- [ ] Re-offer bounded: N=3 unanswered sign-offs → lapsed (terminal, passive list); queue cannot grow without limit (FR-006 / SC-003b).
- [ ] Secret pre-filter (agent-applied, ledger-audited) drops BOTH credential-shaped AND structured-private-fact matches, on both paths, before any write/proposal, independent of the confirm; not labeled "mechanical" (FR-007 / SC-005).
- [ ] Ledger `## Memory update (sign-off)` reconstructable; self-audit asserts "orchestrator authored no record" (FR-008 / SC-004).
- [ ] No new fingerprint mechanic; staleness rides spec 004's read-side re-validation (FR-010).
