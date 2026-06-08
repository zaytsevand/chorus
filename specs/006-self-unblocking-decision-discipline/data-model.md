# Phase 1 Data Model: Self-Unblocking Decision Discipline

Conceptual entities in the orchestration procedure — no runtime types. Each maps to a
section of an RSVP reply, the decision catalog, or the Markdown ledger.

## Entity: Band

The sensor's classification of one decision instance.

| Value | Meaning | Behavior |
|-------|---------|----------|
| 🟢 GREEN | mechanically decidable | auto-resolve, audit-log, proceed |
| 🟡 YELLOW | reversible judgment | proceed with recorded default, queue for async override |
| 🔴 RED | irreducible judgment (irreversible/high-stakes) | hard-block, instant minimal ask |

Reuses the chorus 🔴🟡🟢 vocabulary, applied to a **decision** (distinct from a *finding's*
severity — a severity-🔴 finding yields a 🟡 *decision* first, per FR-011).

## Entity: Decision catalog entry

The declared band per decision **type** — the load-bearing artefact (research R2).

| Field | Description |
|-------|-------------|
| `point` | the decision type (e.g. "RSVP seating tie", "gating 🔴 finding", "exploratory gap") |
| `band` | the declared default band |
| `predicate` | the mechanical test or persona-flag that refines an instance |
| `reversibility` | one-line justification for the band (why 🟡 is safe, or why 🔴) |

Unclassified point (no entry) → 🔴 by rule (FR-006).

## Entity: RSVP signal (two evidence-anchored axes)

Replaces the single `relevance: 0–3` on each JOIN reply.

| Field | Type | Rule |
|-------|------|------|
| `decision` | JOIN \| ABSTAIN | unchanged |
| `applies` | list of cited deltas | **Axis A** — ≥1 concrete round-context delta the lens touches; empty → not-applicable (abstain-eligible) |
| `expected` | 🟢\|🟡\|🔴-potential + hook | **Axis B** — finding class expected if seated, with a one-line evidence hook |
| `reason` | ≤1 sentence | unchanged |

Seating sensor sort key: `(quality/count of applies, then expected)`. Orchestrator counts;
never assigns axes (I2/D5).

## Entity: DecisionRecord

The per-decision audit object; the generalization of the 005-affirmed provenance ledger.

| Field | Description |
|-------|-------------|
| `id` | `<gate/phase>-<point>-<n>` |
| `point` | which decision |
| `band` | 🟢 / 🟡 / 🔴 |
| `sensor.signal` | the rule that fired (e.g. "two-axis sort tie at seat 5", "cycle 2/3") |
| `sensor.evidence` | the anchors (cited deltas, cycle count, persona flag, addendum presence) |
| `sensor.reading` | the mechanical outcome |
| `resolution` | auto-resolved \| default-applied \| escalated |
| `chosen` | the selected option |
| `alternatives` | runner-up(s) the sensor weighed |
| `override` | (🟡 only) how to reverse + cost (e.g. "re-run gate from seating: 1 cycle") |

## Entity: Review surface

Where DecisionRecords are presented, **scaled by band**:

| Band | Surface |
|------|---------|
| 🟢 | one-line **audit row** in the ledger |
| 🟡 | a card in the ledger's new `## Provisional decisions (review & override)` section: default + runner-up + evidence + one-action override + cost |
| 🔴 | a **live framed card**: the judgment, 2–4 options + consequences, evidence, default highlighted |

## State / flow

```text
decision reached ─▶ catalog lookup ─ unclassified? ─yes─▶ 🔴 (ask)        [FR-006]
                         │ classified
                         ▼
                 evaluate predicate (mechanical | persona-flag)           [D1/D4]
                  ├─ 🟢 ▶ auto-resolve · audit row · proceed              [FR-002]
                  ├─ 🟡 ▶ apply recorded default · queue card · proceed   [FR-003, D3]
                  │        └─ operator may override async ▶ re-run @ cost [FR-009]
                  └─ 🔴 ▶ hard-block · live card · WAIT (no default)      [FR-004, D2]
```

Self-heal specialization of the gating-🔴 point:

```text
gating 🔴 finding ─▶ cycle<3 ? ─yes─▶ 🟡: auto-incorporate + RE-RUN gate ─▶ cleared? ─yes─▶ proceed
                          │no                    (queue card per cycle)        │no
                          ▼                                                    └─▶ (cycle++)
                   🔴: ask {escalate | waive}   ◀── also reached if waiver is the only path   [FR-011/012]
```

Determinism & safety: 🟢/🟡 outcomes are reproducible from `(catalog, predicate inputs)`;
only 🔴 depends on a human, and only genuine-judgment instances reach it. Every band
assignment traces to a declared predicate or persona flag (SC-009).
