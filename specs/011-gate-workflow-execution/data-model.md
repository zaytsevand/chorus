# Phase 1 Data Model — 011 Slice 1

Entities the runner produces and the orchestrator consumes. Shapes are **modeled on the canon finding
shape by reference** (`GATE-PRIMITIVE.md`), not invented (FR-008, CF-9). "Validation" rules are the
falsifiable reds the conformance suite asserts (quickstart).

## Finding (the aggregate root of the return)

| Field | Type | Notes / validation |
|-------|------|--------------------|
| `id` | string | stable within a gate run (e.g. `CF-3`) |
| `lens` | string | the seated persona that authored it (the S8 exclusion key) |
| `evidence` | string | `file:line` OR a `[principle]` tag — required (Principle V); empty → reject |
| `pull_quote` | string | verbatim; the orchestrator relays it, never paraphrases (S6 / Principle I) |
| `proposed_severity` | enum `🟢\|🟡\|🔴` | the author's proposal (pre-tally) |
| `votes` | Vote[] | author-excluded (S8); see below |
| `tally` | Tally | `{P, O, net}` computed in code |
| `band` | enum `🟢\|🟡\|🔴` OR `null` | post-tally; **`null`/absent ⇒ treated as gating** (FR-007) |
| `transcriptHandle` | `{runId, agentLabel}` | resolves to the author's subagent transcript (FR-013) |

**Relationships**: a Finding has 0..N Votes (one per non-author seated lens) and exactly one Tally.
**Invariant (S8)**: no `Vote.voter == Finding.lens` (executable assertion, FR-003a).
**State**: `proposed_severity` →(votes + tally)→ `band`. The one-level escalate/demote/hold transition is
the canon rule (`GATE-PRIMITIVE.md`), applied with injected thresholds (research U1).

## Vote

| Field | Type | Notes |
|-------|------|-------|
| `voter` | string | seated lens; MUST differ from the finding's `lens` (S8) |
| `ballot` | enum `PRIORITIZE\|CONFIRM\|OVER-RATE` | the only legal values |
| `reason` | string | one line; carried for diagnosability, not used in arithmetic |
| `transcriptHandle` | `{runId, agentLabel}` | the voter's transcript (FR-013) |

**Arithmetic**: `P = count(PRIORITIZE)`, `O = count(OVER-RATE)`, `CONFIRM` is neutral; `net = P − O`
(`GATE-PRIMITIVE.md`, injected thresholds).

## Tally

`{ P: int, O: int, net: int }` — pure function of the finding's `votes`. Deterministic; byte-identical on
resume with fixed inputs (SC-006).

## GateReturn (what the runner returns; what the orchestrator persists)

| Field | Type | Notes |
|-------|------|-------|
| `findings` | Finding[] | the register, each carrying its own votes/tally/band (finding-centric, not parallel arrays — CF-9) |
| `gaps` | Gap[] | recorded `null`-isolated authors/voters (FR-006) — never silently dropped |
| `stageOutcomes` | `{author, vote}` each `ok\|stage-timeout\|quorum-failed` | per-stage health (FR-006/006a) |
| `runId` | string | passed in via `args` (FR-010); roots every `transcriptHandle` |

**Invariant (reconstructable, SC-009)**: every register/tally/band value in the rendered ledger is
byte-traceable to a field here; 0 orchestrator-supplied values beyond formatting.
**Invariant (consistency, FR-004b/SC-007)**: orchestrator-re-derived band (same injected thresholds) ==
`Finding.band` for every finding.

## Gap

`{ stage: author|vote, lens: string, reason: null-isolated|timeout-if-signalled }` — a recorded absence.
Quorum floor: if surviving authors < 3, `stageOutcomes.author = quorum-failed` (FR-006), not a hollow gate.

## Out of model (Slice 2, deferred)

`SelfHealTrail` (per-cycle `{cycle, findingId, artefactDiffHash, reVerifyBand}`) and the `extract` pre-pass
output — specced when Slice 2 is, with the CF-4 diff/hash + CF-11 in-flight-signifier obligations
(spec § Deferred obligations).
