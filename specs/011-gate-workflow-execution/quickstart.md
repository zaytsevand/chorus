# Quickstart & Conformance — 011 Slice 1 (Gate Workflow Runner)

Verification surface (Principle V/X). There is no application runtime; conformance is these stanzas plus
the inspectable artefacts they name (the `gate-runner.mjs` script, a frozen gate-return fixture, the
rendered ledger). Each stanza maps to a Success Criterion and is a falsifiable red.

## The runner in one paragraph

The inline orchestrator seats a panel, builds the brief, reads the canon band thresholds, and invokes
`skill/chorus/workflows/gate-runner.mjs` with `args = { runId, bands, brief, corpusLocators, seated[] }`.
The runner fans out one author `agent()` per seated lens (schema = canon finding shape), routes each
finding to author-excluded voters (S8), fans out the vote, computes `P−O` and the band **in code** with
the injected `bands`, and returns the finding-centric `GateReturn` (see `contracts/gate-return.md`). The
orchestrator re-derives each band, then persists the ledger. The runner writes nothing.

## Conformance stanzas

### C1 — Tally parity on a frozen fixture (SC-001, the experiment)
Feed the runner's **tally function** a frozen `{findings, votes}` fixture (no `agent()` dispatch). Assert
the band for every finding equals the `GATE-PRIMITIVE.md` band table. **Red**: any band ≠ the canon table.
*No author-variance escape hatch — inputs are frozen.*

### C2 — Threshold table is canon-locked (FR-004a, CF-1)
Assert the `args.bands` table equals the `GATE-PRIMITIVE.md` band table byte-for-byte; assert the runner
source contains **no** hardcoded threshold literal. **Red**: drift between injected table and canon, or a
literal `+2`/`−2` band threshold in the script.

### C3 — Executable S8 (SC-002, CF-12)
Over a fixture with known authorship, assert **no** `votes[].voter == findings[].lens`. Pure code over
data, no `agent()`. **Red**: any finding on its own author's ballot.

### C4 — Structural honesty (SC-002)
Static check: `gate-runner.mjs` contains no code path that writes a finding or a ballot value — it only
invokes `agent()` and computes on returns. **Red**: any orchestrator-authored finding/vote path.

### C5 — Fail-closed default (SC-003, CF-3)
Inject a finding with `band: null`. Assert the orchestrator consumes it as **gating** and does not release
it. **Red**: a `null`/absent band released as a pass.

### C6 — Fault recorded, quorum floor (SC-004, CF-6)
Inject an author failure (→ `null`). Assert it appears in `gaps[]` and the gate completes if ≥3 authors
survive; with <3, assert `stageOutcomes.author == quorum-failed`. **Red**: a silent drop, or a hollow
gate below floor.

### C7 — Hang is bounded (SC-004, CF-7; see research U3)
Inject a non-returning author. Assert it surfaces as a recorded `gaps[]` entry (substrate infra timeout →
`null`), never an indefinite hang. **Residual (Gate B)**: a distinct `reason: "timeout"` requires the
substrate to signal timeout-vs-error; if unavailable it records as `null-isolated` (still fail-safe).

### C8 — Determinism on resume (SC-006, CF-15)
Invoke the tally twice with identical frozen `{findings, votes}` and `args`. Assert **byte-identical
bands**. **Red**: any band differs. *(Scope: bands, not agent prose — prose is not byte-stable.)*

### C9 — Re-derive consistency (SC-007, CF-16)
Orchestrator recomputes each band from `votes[]` using the **same injected thresholds** and asserts it
equals the returned `band`. **Red**: any mismatch (catches a buggy runner inverting a band).

### C10 — Diagnosable (SC-008, CF-6)
Assert every finding and vote carries a `transcriptHandle {runId, agentLabel}` that resolves to a
subagent transcript. **Red**: any finding/vote with an unresolvable or missing handle.

### C11 — Ledger reconstructable (SC-009, post-Gate-A red)
From a frozen `GateReturn`, render the `agent-sdlc-log.md` body; assert every register/tally/band value is
byte-traceable to a return field and 0 values were orchestrator-supplied beyond formatting (headings,
scaffolding, dates from `args`). **Red**: any untraceable or divergent ledger value.

## Conformance checklist

- [ ] C1 tally parity (frozen fixture, no escape hatch) — SC-001
- [ ] C2 thresholds canon-locked, no literals — FR-004a
- [ ] C3 executable S8 — SC-002 / FR-003a
- [ ] C4 structural honesty (no author/vote path) — SC-002 / FR-005
- [ ] C5 fail-closed on null band — SC-003 / FR-007
- [ ] C6 fault recorded + quorum floor — SC-004 / FR-006
- [ ] C7 hang bounded (residual flagged) — SC-004 / FR-006a
- [ ] C8 determinism on resume (bands) — SC-006
- [ ] C9 re-derive consistency (same thresholds) — SC-007 / FR-004b
- [ ] C10 diagnosable transcript handles — SC-008 / FR-013
- [ ] C11 ledger reconstructable — SC-009

## Out of scope (Slice 2)

Self-heal re-verify loop (with CF-4 diff/hash + CF-11 in-flight signifier) and the Extract pre-pass +
short-circuit — deferred behind a passed SC-001.
