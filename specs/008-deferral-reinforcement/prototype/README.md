# Prototype — deferral-reinforcement measurement substrate

Two stdlib-only harnesses. Measurement only: they decide whether the
reinforcement (band-scaled five-whys + cut-convergence cross-examination) earns
its place before any of it is wired into the live chorus. Nothing here runs the
chorus or changes a persona.

## 1. `cut_backtest.py` — did the chorus cut the *right* FRs?

Scores keep/cut decisions over an FR corpus against an **external oracle**
(your user interviews). The fitness function is **not** cut count — that is the
production-metric trap inverted, and maximising it tunes the chorus into the
under-build over-correction. It is a precision-favouring confusion matrix:

| oracle label | meaning | a `cut` here is |
|---|---|---|
| `invalidated` | interviews killed it (over-build) | a **correct cut** (TP) |
| `validated`   | interviews confirmed it (load-bearing) | a **destructive cut** (FP) |
| `unknown`     | no external signal | excluded from precision/recall |

`F-beta` defaults to β=0.5 (precision favoured: a wrong cut of a load-bearing FR
costs more than a missed over-build). The variant-vs-variant **self-delta** is
reported separately and flagged common-mode blind — over-build *no* lens sees
survives both variants and never appears there, so the oracle-labelled matrix is
the primary signal.

```sh
python3 cut_backtest.py --selftest
python3 cut_backtest.py sample_corpus.json
```

The sample shows the key property: `over_corrected` cuts *more* than
`reinforced` but slices one `validated` FR, so its precision and F-score fall
below `reinforced` — more cuts lose to correct cuts.

## 2. `fitness_gate.py` — did the cuts buy down real cost?

A metric-agnostic, evolutionary-architecture fitness function you run **on the
product repo**. It does not measure anything itself; it gates a metrics snapshot
your own run produced against per-metric budgets (+ an optional baseline for
regression detection). Same harness, either axis:

- runtime perf — `p95_latency_ms`, `rss_mb`, `cost_per_req_usd`, `cold_start_ms`
- carrying cost — `dead_code_loc`, `unused_fr_count`, `cyclomatic_total`, `bundle_kb`

Every budget declares an explicit `direction` (`lower_better` / `higher_better`);
the gate never assumes one. Non-zero exit on any breach, so it drops into CI.

```sh
python3 fitness_gate.py --selftest
# real use: point it at snapshots your perf/analysis run emits
python3 fitness_gate.py metrics.json budgets.json baseline.json
```

## Why two harnesses

They are the two halves of the same question. The backtest scores **correctness
of the cut** (did we drop the right FRs); the gate scores **the payoff** (did
dropping them reduce real cost, and does the system stay in budget). A
reinforcement that improves the first but not the second cut accurately for no
gain; one that improves the second but not the first bought its savings by
cutting load-bearing work. You want both to move.
