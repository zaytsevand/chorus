# Phase 0 Research — 011 Slice 1

Unknowns extracted from Technical Context, resolved against the **Claude Code Workflow substrate
contract** (the live source for "what a runner can do") and `GATE-PRIMITIVE.md`. No NEEDS
CLARIFICATION remains open as a blocker; U3 carries a bounded residual flagged for Gate B.

## U1 — How do canon thresholds reach the runner as cited data, not transcribed literals? (FR-004a, CF-1)

- **Decision**: The inline orchestrator reads the band thresholds from `GATE-PRIMITIVE.md` and passes
  them to the runner via `args` (e.g. `args.bands = { escalateAt: +2, demoteAt: −2 }` + the one-level cap
  and CONFIRM-excluded-from-net rule). The runner applies them; it hardcodes none. A **conformance
  fixture** (quickstart) re-reads the canon band table and asserts the args-table equals it, byte-for-byte,
  on every CI run and on every change to the runner *or* the primitive.
- **Rationale**: The script has no filesystem access, so it cannot read canon directly. Injection +
  continuous fixture-lock keeps the single source of truth in canon (Principle I) while letting the runner
  compute the band in code (CF-10, affirmed). The transient copy in `args` is the *verified* copy, not an
  unguarded second authority — which is exactly the difference Gate A demanded (spec 009 proved the
  primitive moves).
- **Alternatives rejected**: (a) hardcoded literals in the script — the CF-1 defect, no drift guard;
  (b) a dispatched agent reads canon and returns the table — adds a non-deterministic LLM hop into a
  deterministic arithmetic path (breaks SC-006) and is needless when the orchestrator already reads canon.

## U2 — What is the per-agent transcript handle? (FR-013, CF-6)

- **Decision**: The runner labels every dispatch (`author:<lens>`, `vote:<lens>`) and returns, per
  finding and per vote, the pair `{ runId, agentLabel }`. The substrate persists each subagent transcript
  under the workflow run's transcript dir; `{runId, agentLabel}` resolves to that path. The orchestrator
  opens it to diagnose a parity divergence.
- **Rationale**: The substrate already addresses runs (resume-by-run-id; transcript dirs are emitted at
  launch), so a stable `{runId, label}` handle exists without inventing storage. This restores the
  per-agent deliberation that hand-dispatched Agent calls expose directly (the CF-6 regression).
- **Alternatives rejected**: embedding each agent's full reasoning text in the return — bloats the
  structured payload, duplicates what the transcript already holds, and tempts the orchestrator to
  re-author from prose (an S1 leak).

## U3 — How is a per-stage timeout bounded when the script has no clock? (FR-006a, CF-7) — bounded residual

- **Decision**: The script **cannot self-time** (`Date.now()` throws). The timeout bound is therefore
  **delegated to the substrate's own per-agent infra timeout**: a hung author that never returns surfaces
  as `agent() → null` after the substrate's terminal handling, which FR-006's null-isolation already
  records as a gap. The orchestrator additionally owns a run-level abort (it launched the workflow). The
  recorded outcome for a hang is thus a recorded `null`-gap; a *distinct* `stage-timeout` label is only
  achievable **if** the substrate signals "timed out" vs "errored" in the null.
- **Residual (flag for Gate B)**: whether the substrate distinguishes timeout-null from error-null is not
  guaranteed by the documented contract. If it does not, FR-006a's *named* `stage-timeout` outcome
  collapses into the generic recorded `null`-gap (still fail-safe, never silent — FR-006/FR-007 hold), but
  the diagnostic granularity FR-006a implies is unmet. **This does not block Slice 1** (the gate still
  fails safe and records the gap); it is a precision gap for Gate B to accept or to push to substrate
  config. Recorded here rather than hand-patched into the spec (Principle VIII).
- **Alternatives rejected**: an in-script timer (impossible without a clock); a "heartbeat" agent
  (adds cost and still cannot interrupt a peer mid-flight — `parallel()` has no early-cancel).

## U4 — How does the orchestrator re-derive bands without re-tallying? (FR-004b, CF-16)

- **Decision**: After the runner returns, the orchestrator recomputes each finding's band from the
  returned `votes[]` using the **same `args` threshold table** it passed in (U1), and asserts equality
  with the runner's claimed `band`. A mismatch fails the gate. This is an *audit of the runner's
  arithmetic against the runner's own data* — it never substitutes a different answer (which FR-004 forbids
  as a re-tally / S1 authority grab).
- **Rationale**: Cheap (pure arithmetic over the returned ballot), catches a buggy runner inverting a band
  (CF-16), and — by reading the same cited thresholds (FR-004b clause added post-Gate-A) — does not
  reintroduce CF-1 at the auditor layer (Richards' re-verify residual).
- **Alternatives rejected**: trusting the return verbatim (CF-16, the defect); the orchestrator
  independently re-tallying with its own rule copy (a second uncontrolled authority — CF-1 redux).

## Cross-cutting confirmations (no open question)

- **S1/S9 structural** (FR-005): a Workflow script can only invoke `agent()` and compute on returns — it
  has no tool to author a finding or cast a vote. Holds by substrate construction; SC-002 inspects it.
- **Determinism** (FR-010, SC-006): no clock/RNG in-script; bands are a pure function of `{findings,votes}`
  + injected thresholds → byte-identical on resume with fixed `args`. Author *prose* is not byte-stable;
  SC-006 is scoped to the bands accordingly (CF-15).
- **Runner writes nothing** (FR-011): in Slice 1 there is no incorporate/edit step (self-heal is Slice 2),
  so neither the script nor its dispatched agents write files. The orchestrator persists the ledger inline.
