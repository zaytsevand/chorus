#!/usr/bin/env python3
"""Metric-agnostic fitness gate for a target repo.

The cut backtest scores whether the chorus cut the *right* FRs. This answers the
other half: did the cuts buy down real cost, and does the system stay within its
budget as it evolves -- an evolutionary-architecture fitness function in the
Richards/Ford sense, run on the product repo.

It is deliberately metric-agnostic. It does not measure anything itself; it
consumes a metrics snapshot the target repo's own run produced (a benchmark, a
static-analysis pass, a cost report) and gates it. So the same harness serves:

    runtime perf     : p95_latency_ms, rss_mb, cost_per_req_usd, cold_start_ms
    carrying cost    : dead_code_loc, unused_fr_count, cyclomatic_total, bundle_kb

Each budget declares an explicit better-direction; the gate never assumes one.
Non-zero exit on any breach, so it drops into CI as a gate.

Stdlib only. Inputs are JSON:

    budgets.json   { "p95_latency_ms": {"max": 250, "direction": "lower_better"},
                     "unused_fr_count": {"max": 0, "direction": "lower_better"},
                     "throughput_rps":  {"min": 100, "direction": "higher_better"} }
    metrics.json   { "p95_latency_ms": 240, "unused_fr_count": 3, "throughput_rps": 120 }
    baseline.json  (optional) same shape as metrics.json, a prior snapshot

Usage:
    python3 fitness_gate.py metrics.json budgets.json [baseline.json]
    python3 fitness_gate.py --selftest
"""

import json
import sys

LOWER, HIGHER = "lower_better", "higher_better"


def evaluate(metrics, budgets, baseline=None):
    rows = []
    missing = []
    for name, spec in budgets.items():
        direction = spec.get("direction")
        if direction not in (LOWER, HIGHER):
            raise ValueError(f"budget '{name}' needs an explicit direction "
                             f"({LOWER} or {HIGHER}); none assumed")
        if name not in metrics:
            missing.append(name)
            continue
        value = metrics[name]
        bound_key = "max" if direction == LOWER else "min"
        limit = spec.get(bound_key)
        if limit is None:
            raise ValueError(f"budget '{name}' missing the bound ('{bound_key}')")
        passed = value <= limit if direction == LOWER else value >= limit
        # headroom: positive == inside budget, normalised by the limit.
        if limit != 0:
            headroom = (limit - value) / abs(limit) if direction == LOWER \
                else (value - limit) / abs(limit)
        else:
            headroom = 0.0 if value == 0 else -1.0

        regression = None
        if baseline and name in baseline:
            prev = baseline[name]
            worse = value > prev if direction == LOWER else value < prev
            if value != prev:
                regression = {"from": prev, "to": value, "worse": bool(worse)}

        rows.append({"metric": name, "value": value, "limit": limit,
                     "direction": direction, "passed": passed,
                     "headroom": headroom, "regression": regression})

    passed_all = all(r["passed"] for r in rows) and not missing
    # aggregate fitness: mean headroom over evaluated metrics (>=0 is healthy).
    score = sum(r["headroom"] for r in rows) / len(rows) if rows else 0.0
    return {"rows": rows, "missing_metrics": missing,
            "passed": passed_all, "fitness_score": score}


def render(report):
    lines = ["== Fitness gate =="]
    for r in report["rows"]:
        mark = "PASS" if r["passed"] else "FAIL"
        bound = "<=" if r["direction"] == LOWER else ">="
        line = (f"  [{mark}] {r['metric']}: {r['value']} {bound} {r['limit']} "
                f"(headroom {r['headroom']:+.2%})")
        if r["regression"] and r["regression"]["worse"]:
            reg = r["regression"]
            line += f"  REGRESSED {reg['from']}->{reg['to']}"
        elif r["regression"]:
            reg = r["regression"]
            line += f"  improved {reg['from']}->{reg['to']}"
        lines.append(line)
    if report["missing_metrics"]:
        lines.append(f"  MISSING (budgeted but not in snapshot): {report['missing_metrics']}")
    lines.append(f"\n  aggregate fitness score: {report['fitness_score']:+.3f} "
                 f"(mean headroom; >=0 healthy)")
    lines.append(f"  VERDICT: {'PASS' if report['passed'] else 'FAIL'}")
    return "\n".join(lines)


SAMPLE_BUDGETS = {
    "p95_latency_ms": {"max": 250, "direction": LOWER},
    "rss_mb": {"max": 512, "direction": LOWER},
    "unused_fr_count": {"max": 0, "direction": LOWER},
    "throughput_rps": {"min": 100, "direction": HIGHER},
}
SAMPLE_METRICS = {
    "p95_latency_ms": 240, "rss_mb": 300,
    "unused_fr_count": 3, "throughput_rps": 120,
}
SAMPLE_BASELINE = {
    "p95_latency_ms": 210, "rss_mb": 300,
    "unused_fr_count": 5, "throughput_rps": 118,
}


def selftest():
    rep = evaluate(SAMPLE_METRICS, SAMPLE_BUDGETS, SAMPLE_BASELINE)
    by = {r["metric"]: r for r in rep["rows"]}
    assert by["unused_fr_count"]["passed"] is False, "3 unused FRs must breach max=0"
    assert by["p95_latency_ms"]["passed"] is True
    assert by["p95_latency_ms"]["regression"]["worse"] is True, "210->240 is a regression"
    assert by["unused_fr_count"]["regression"]["worse"] is False, "5->3 is an improvement"
    assert rep["passed"] is False, "any breach fails the gate"
    # direction must be explicit.
    try:
        evaluate({"x": 1}, {"x": {"max": 2}})
    except ValueError:
        pass
    else:
        raise AssertionError("missing direction must raise")
    print("selftest OK")
    print()
    print(render(rep))


def main(argv):
    if "--selftest" in argv:
        selftest()
        return 0
    if len(argv) not in (3, 4):
        print(__doc__)
        return 2
    with open(argv[1]) as fh:
        metrics = json.load(fh)
    with open(argv[2]) as fh:
        budgets = json.load(fh)
    baseline = None
    if len(argv) == 4:
        with open(argv[3]) as fh:
            baseline = json.load(fh)
    report = evaluate(metrics, budgets, baseline)
    print(render(report))
    return 0 if report["passed"] else 1


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
