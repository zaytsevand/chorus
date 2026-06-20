---
name: suite-decomposition-residence-coupling
description: In skill/module-suite splits, "extend"-relationships across a skill boundary are static coupling invisible to file-dependency checks; the anti-drift fitness function must enforce token RESIDENCE, not mere resolution.
metadata:
  type: project
---

In a skill/module-suite decomposition, lifecycle invariants that *extend* base invariants across a skill boundary (e.g. S1–S7 extend I1–I9) are a hidden **static coupling** that a file-dependency / import-graph check cannot see — the extension is by token reference in prose, not an import. The anti-drift fitness check must therefore enforce token **RESIDENCE** (each token defined-only-in-its-owning-module), not just that references *resolve*: resolution passes even after a token is duplicated or migrated, which is exactly the drift you're trying to catch.

**Why:** feature 014 (chorus-suite-decomposition). The original "sdlc has no dependency on review" claim was runtime-false precisely because S-invariants extend I-invariants — a coupling no file-dep check surfaced. The fix was a residence check, not a resolution check.

**How to apply:** when reviewing any decomposition where one module's contract "builds on" / "extends" another's catalog, ask where the catalog tokens are *defined* and demand a CI check asserting single-residence per token. Re-groundable at: `skill/chorus-core/CONDUCTOR.md` (I1–I9 catalog, ~L190–250; L250 states sub-suites reference, not redefine), `scripts/check-suite-integrity.sh` (FC1: 1a residence for I/D/S8–S10 in core, 1b for S1–S7 in sdlc + catalog-completeness), `specs/014-chorus-suite-decomposition/spec.md` FR-008a (residence check). Related: [[understanding-project]].
