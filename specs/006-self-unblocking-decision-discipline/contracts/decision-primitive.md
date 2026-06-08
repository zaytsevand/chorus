# Contract: Decision primitive (canonical)

The single authoritative definition of the three-band decision discipline. Authored once
in `skill/chorus-review/DECISION-PRIMITIVE.md`; **referenced** (not restated) by
`SDLC-LAYER.md`, `SKILL.md`, and `INTEGRATION-LAYER.md` (FR-016 / SC-007).

## The sensor

Every operator-facing decision is routed through the sensor, which assigns a band:

1. **Catalog lookup** by decision `point`. No entry → **🔴** (FR-006).
2. **Predicate evaluation** — mechanical (sort strictness, cycle counter, artefact
   presence) or a **persona-declared flag**. The orchestrator never *infers* the band
   (D1/D4).
3. **Act by band**: 🟢 auto-resolve + audit; 🟡 default + queue; 🔴 hard-block + ask.

## DecisionRecord (emitted for every decision)

```
DecisionRecord {
  id · point · band(🟢|🟡|🔴)
  sensor: { signal, evidence, reading }
  resolution: auto-resolved | default-applied | escalated
  chosen · alternatives
  override: <reverse + cost>        // 🟡 only
}
```

## Review surfaces (render by band)

- 🟢 → audit row in the ledger.
- 🟡 → card in `## Provisional decisions (review & override)`: default, runner-up(s),
  `sensor.evidence`, one-action override + cost.
- 🔴 → live framed card: judgment, 2–4 options + consequences, evidence, default
  highlighted.

## Invariants (D1–D5) — extend I1–I8 / S1–S9

- **D1** — band by declared predicate, never inference. (I2/S3/S9)
- **D2** — 🔴 never auto-proceeds; no default applied. (S4)
- **D3** — every 🟡 default is recorded and reversible (an override + cost). 
- **D4** — classification is mechanical (predicate or persona flag); no merit/"feel". (S9)
- **D5** — signals are evidence-anchored; un-anchored claims demoted. (I8)

## Acceptance checks

- Unclassified decision → 🔴 (no auto-resolve).
- A 🟡 decision produces a queue card with a working override; a 🔴 produces a hard-block
  with no default.
- The primitive text exists in exactly one file; the three layer docs reference it.
- Every decision in a run has exactly one DecisionRecord; band traces to a declared
  predicate or persona flag.
