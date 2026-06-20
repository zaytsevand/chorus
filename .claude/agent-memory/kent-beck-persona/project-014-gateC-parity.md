---
name: project-014-gateC-parity
description: Feature 014 chorus-suite-decomposition Gate C — parity proofs verified by re-running check-suite-integrity.sh; core RED real, tier-2 is grep-c file-presence not observable behavior
metadata:
  type: project
---

Feature 014 (chorus-suite-decomposition) Gate C, parity-proof scrutiny through TDD lens. I re-ran `scripts/check-suite-integrity.sh` myself.

**Real (credit):** GREEN executes (exit 0). Both core-conductor RED demos bite against deliberately-broken compositions and recover on clean revert (delete CONDUCTOR → FC1 dangling; sibling-local I1 → residence violation). Honest red-green-refactor. core-primitives tier-1 (diff + FC1) genuinely sufficient for byte-identical moves.

**Finding 1 (🟠):** core-conductor.md documents RED output as "I1 … I9" but actual run OMITS I3. FC1's no-dangling loop only checks a token if it's referenced *elsewhere* in the suite (`grep -rqE "\bI$n\b"`). I3 is referenced only inside CONDUCTOR.md itself → deleting CONDUCTOR removes reference+definition together → I3 never enters the loop. **Blind spot: a token defined-and-referenced only within its own file is invisible to the dangling check.** Proof asserted output it never ran.

**Finding 2 (🟠, PRIORITIZED) — confirms Gate-A F8 worry:** review-round.md / sdlc-gate.md bill themselves "full RED-GREEN asserting on observable output, not file presence (Beck F8)" but every verification is `grep -c` over source text (`'chorus-core is missing' → 1`; `'agent-sdlc-log.md' → 2`; phase headers present). FC suite never fires guard, never runs phase sequence, never writes ledger. Subagent admitted no live agent run. A test that greps for the error string it expects = checking spelling, not behavior. Guard-STOP / phase-reaches-Phase-1 / ledger-appends contracts are UNPINNED. Fix: run one live core-absent composition to pin guard, or stop labeling these "observable."

**Baseline (non-blocking):** can't prove from artifacts that baseline.md captured pre-move; reads as pre-split, corroborated by core-primitives diff against `HEAD:`, but capture order unproven.

RSVP JOIN. Pattern: same green-by-coincidence smell I flag every gate — falsifiable claim asserted but not observed. Generalized into [[lesson-parity-proofs-observable-behavior]]. See also [[project-060-consent-snapshot-noop-multiply]], [[project-094-f4-characterization-gate]].
