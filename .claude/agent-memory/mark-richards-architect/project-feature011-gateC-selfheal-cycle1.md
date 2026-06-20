---
name: project-feature011-gateC-selfheal-cycle1
description: Feature 011 Slice 1 Gate C self-heal re-verify — co-authored CF-A (shell zero executed coverage) CLEARED
metadata:
  type: project
---

Feature 011 Slice 1, chorus Gate C self-heal re-verification (cycle 1). I had co-authored gating 🔴 CF-A: the Workflow shell had zero executed coverage (fan-out / S8 wiring / gaps recording only ran in live Workflow runtime).

VERDICT: CLEARED.

**Why:** the fix changed the coupling type at the seam, not just added a test. Shell logic extracted from gate-runner.mjs into `skill/chorus/workflows/gate-shell.mjs` as `runGate({args, agent, parallel, phase})` — runtime primitives now INJECTED (DI), so importable+mockable in plain node. gate-runner.mjs is now a ~3-line Workflow ENTRY that binds ambient globals and forwards. Coupling went from "operational, live-only" → "in-process, typed signature." That's the right cut.

C12 (conformance/run-all.mjs:142-182) imports runGate and executes it end-to-end with mock agent/parallel/phase backed by frozen-gate.json. Genuinely drives the real branches (only the 3 primitives are mocked; runGate unmodified). The 4-gap assertion for F5 is EARNED by live s8Voters() fan-out against a fixture where F5's voters are absent — not asserted in isolation. Ran it: 11 pass / 0 fail / 1 skip, exit 0.

**Residual (acceptable, NOT gating):** the Workflow binding itself (import resolution + 4 global bindings, gate-runner.mjs:13,26) is still only exercised by a live SC-001 run; C7 stays an honest SKIP. Irreducible — it's a 3-line forwarder with no logic; a wiring typo throws loudly on first live run. Don't gate Slice 1 on a CI Workflow-runtime harness; name it in ADR as a known live-only seam. Operator-gated SC-001 IS the smoke run.

**NEW issue: none gating.** One 🟢 nit: C4 now lint-checks shellSrc TEXT (comment/string-stripping regex) for authoring violations while C12 checks behavior — belt-and-suspenders, fine. The strip regex is itself untested guard logic; optional one-line self-test (feed known-bad snippet, assert trips) would close the who-tests-the-test gap.

**How to apply:** CF-A is closed. If a later slice automates the live binding check, that retires the C7 skip — until then the skip is correct, not debt. The DI seam is the durable fitness function; future shell logic must stay behind runGate (C4 + C12 enforce it).

Related: [[project-feature011-gateA-selfheal-cycle1]], [[project-feature011-gateA-vote]]
