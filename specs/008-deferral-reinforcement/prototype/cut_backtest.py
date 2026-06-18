#!/usr/bin/env python3
"""Cut-correctness backtest for a (reinforced) chorus.

Scores keep/cut decisions over an FR corpus against an *external* oracle of
which FRs were genuinely over-build. The fitness function is deliberately NOT
"how many FRs were dropped" -- raw cut count is the production-metric trap
inverted, and maximising it selects for the under-build failure mode. We score a
confusion matrix favouring precision: a wrong cut of a load-bearing FR costs more
than a missed over-build (you can always cut later; you cannot un-ship the gap a
bad cut leaves).

Oracle labels:
    invalidated -> over-build POSITIVE   (should have been cut)
    validated   -> load-bearing NEGATIVE (cutting it is a false positive)
    unknown     -> excluded from precision/recall (no ground truth)

Stdlib only. Input is one JSON file:

    {
      "frs": [ {"id": "FR-001", "oracle": "invalidated", "source": "...", "domain": "..."}, ... ],
      "variants": {
        "baseline":   { "FR-001": "keep", ... },
        "reinforced": { "FR-001": "cut",  ... }
      },
      "baseline_variant": "baseline",   # optional, for the self-delta
      "beta": 0.5                       # optional, <1 favours precision
    }

Usage:
    python3 cut_backtest.py sample_corpus.json
    python3 cut_backtest.py --selftest
"""

import json
import sys

POSITIVE = "invalidated"  # the class we want to catch (over-build)
NEGATIVE = "validated"


def _fbeta(precision, recall, beta):
    if precision is None or recall is None:
        return None
    b2 = beta * beta
    denom = b2 * precision + recall
    if denom == 0:
        return 0.0
    return (1 + b2) * precision * recall / denom


def score_variant(frs, decisions, beta):
    """Confusion matrix + precision/recall/F-beta over oracle-labelled FRs."""
    labels = {f["id"]: f.get("oracle", "unknown") for f in frs}
    tp = fp = fn = tn = 0
    unscored = []       # decision references an FR not in the corpus
    coverage_gap = 0    # labelled FR with no decision (advisor abstained)

    for fr_id, oracle in labels.items():
        if oracle not in (POSITIVE, NEGATIVE):
            continue  # unknown -> excluded from the matrix
        decision = decisions.get(fr_id)
        if decision is None:
            coverage_gap += 1
            continue
        cut = decision == "cut"
        if oracle == POSITIVE:
            tp += cut
            fn += not cut
        else:  # NEGATIVE
            fp += cut
            tn += not cut

    for fr_id in decisions:
        if fr_id not in labels:
            unscored.append(fr_id)

    precision = tp / (tp + fp) if (tp + fp) else None
    recall = tp / (tp + fn) if (tp + fn) else None
    return {
        "tp": tp, "fp": fp, "fn": fn, "tn": tn,
        "precision": precision, "recall": recall,
        "f_beta": _fbeta(precision, recall, beta), "beta": beta,
        "false_positive_cuts": fp,  # the under-build guard number
        "coverage_gap": coverage_gap,
        "unscored_decisions": sorted(unscored),
    }


def self_delta(frs, base, other):
    """Where two variants disagree, split by oracle label.

    The pure variant-vs-variant diff is common-mode blind: over-build no lens is
    sensitive to survives both variants and never shows here. Reported, but as a
    secondary signal under the oracle-labelled matrix.
    """
    labels = {f["id"]: f.get("oracle", "unknown") for f in frs}
    out = {"validated": [], "invalidated": [], "unknown": []}
    for fr_id, lab in labels.items():
        b, o = base.get(fr_id), other.get(fr_id)
        if b != o and b is not None and o is not None:
            bucket = lab if lab in out else "unknown"
            out[bucket].append({"fr": fr_id, "from": b, "to": o})
    return out


def run(doc):
    frs = doc["frs"]
    variants = doc["variants"]
    beta = doc.get("beta", 0.5)
    base_name = doc.get("baseline_variant")

    results = {name: score_variant(frs, dec, beta) for name, dec in variants.items()}
    deltas = {}
    if base_name and base_name in variants:
        for name, dec in variants.items():
            if name != base_name:
                deltas[name] = self_delta(frs, variants[base_name], dec)
    return {"results": results, "self_delta_vs_baseline": deltas,
            "baseline_variant": base_name}


def _fmt(x):
    return "n/a" if x is None else f"{x:.3f}"


def render(report):
    lines = []
    lines.append("== Cut-correctness backtest (oracle-labelled; primary signal) ==")
    for name, r in report["results"].items():
        lines.append(f"\nvariant: {name}")
        lines.append(f"  confusion  TP={r['tp']} FP={r['fp']} FN={r['fn']} TN={r['tn']}")
        lines.append(f"  precision={_fmt(r['precision'])}  recall={_fmt(r['recall'])}  "
                     f"F{r['beta']}={_fmt(r['f_beta'])}")
        lines.append(f"  false-positive cuts (under-build guard): {r['false_positive_cuts']}")
        if r["coverage_gap"]:
            lines.append(f"  coverage gap (labelled FRs with no decision): {r['coverage_gap']}")
        if r["unscored_decisions"]:
            lines.append(f"  unscored decisions (FR absent from corpus): {r['unscored_decisions']}")

    if report["self_delta_vs_baseline"]:
        lines.append("\n== Self-delta vs baseline (secondary; common-mode blind) ==")
        for name, d in report["self_delta_vs_baseline"].items():
            lines.append(f"\n{name} differs from {report['baseline_variant']} on:")
            for bucket in ("invalidated", "validated", "unknown"):
                items = d[bucket]
                if items:
                    tag = {"invalidated": "good cuts" if all(i["to"] == "cut" for i in items) else "mixed",
                           "validated": "DESTRUCTIVE if cut", "unknown": "unvalidated exploration"}[bucket]
                    lines.append(f"  [{bucket}] ({tag}): "
                                 + ", ".join(f"{i['fr']} {i['from']}->{i['to']}" for i in items))

    lines.append("\n== Verdict ==")
    lines.append("  Better == higher precision-favouring F-score on the oracle set,")
    lines.append("  NOT more cuts. A variant that lifts recall by raising false-positive")
    lines.append("  cuts is the under-build over-correction, not an improvement.")
    return "\n".join(lines)


SAMPLE = {
    "frs": [
        {"id": "FR-001", "oracle": "invalidated", "source": "interview", "domain": "onboarding"},
        {"id": "FR-002", "oracle": "invalidated", "source": "interview", "domain": "exports"},
        {"id": "FR-003", "oracle": "invalidated", "source": "interview", "domain": "exports"},
        {"id": "FR-004", "oracle": "validated", "source": "interview", "domain": "core"},
        {"id": "FR-005", "oracle": "validated", "source": "interview", "domain": "core"},
        {"id": "FR-006", "oracle": "validated", "source": "interview", "domain": "auth"},
        {"id": "FR-007", "oracle": "unknown", "domain": "reporting"},
        {"id": "FR-008", "oracle": "unknown", "domain": "reporting"},
    ],
    "variants": {
        # current chorus: timid -- cuts almost nothing, misses real over-build.
        "baseline": {
            "FR-001": "cut", "FR-002": "keep", "FR-003": "keep",
            "FR-004": "keep", "FR-005": "keep", "FR-006": "keep",
            "FR-007": "keep", "FR-008": "keep",
        },
        # reinforced (good): catches all 3 over-build FRs, no load-bearing cut.
        "reinforced": {
            "FR-001": "cut", "FR-002": "cut", "FR-003": "cut",
            "FR-004": "keep", "FR-005": "keep", "FR-006": "keep",
            "FR-007": "cut", "FR-008": "keep",
        },
        # over-corrected: cuts more, but slices a load-bearing FR -> precision drops.
        "over_corrected": {
            "FR-001": "cut", "FR-002": "cut", "FR-003": "cut",
            "FR-004": "cut", "FR-005": "keep", "FR-006": "keep",
            "FR-007": "cut", "FR-008": "cut",
        },
    },
    "baseline_variant": "baseline",
    "beta": 0.5,
}


def selftest():
    rep = run(SAMPLE)
    r = rep["results"]
    # reinforced: caught all 3 over-build, no false positive -> precision 1, recall 1.
    assert r["reinforced"]["precision"] == 1.0, r["reinforced"]
    assert r["reinforced"]["recall"] == 1.0, r["reinforced"]
    # over_corrected cuts more (higher TP impossible -- already 3) but adds a FP,
    # so precision and F-score MUST fall below reinforced despite >= cuts.
    assert r["over_corrected"]["recall"] == 1.0
    assert r["over_corrected"]["precision"] < 1.0
    assert r["over_corrected"]["f_beta"] < r["reinforced"]["f_beta"], \
        "more cuts must not beat correct cuts"
    # baseline under-catches -> low recall.
    assert r["baseline"]["recall"] < r["reinforced"]["recall"]
    print("selftest OK")
    print()
    print(render(rep))


def main(argv):
    if "--selftest" in argv:
        selftest()
        return 0
    if len(argv) != 2:
        print(__doc__)
        return 2
    with open(argv[1]) as fh:
        doc = json.load(fh)
    print(render(run(doc)))
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
