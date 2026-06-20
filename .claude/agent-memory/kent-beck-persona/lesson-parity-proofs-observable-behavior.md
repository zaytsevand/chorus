---
name: lesson-parity-proofs-observable-behavior
description: Durable TDD lesson — parity/characterization proofs for RELOCATED docs/skills/code must assert on observable behavior and demonstrate their own RED, never grep source text for the error string they expect
metadata:
  type: feedback
---

A parity/characterization proof that greps source text for the error string it expects is "checking spelling, not behavior." It is green-by-coincidence: the assertion passes because the literal is present, not because the contract holds.

**Rule:** A proof for a RELOCATED artifact (moved doc / extracted skill / refactored module) must (a) assert on OBSERVABLE BEHAVIOR — phase sequence produced, artifact written, ledger appended, guard-STOP fired — and (b) demonstrate its OWN red: deliberately break the composition, watch the proof bite, revert, watch it recover. A proof that never ran the thing it claims to verify has asserted output it never observed.

**Why:** Relocation tempts a shortcut — "the text moved intact, so grep the text." But the whole risk of relocation is that the *wired-up behavior* broke while the text survived (dangling reference, residence violation, unloaded skill). Grepping the source confirms the spelling moved; only executing the built artifact confirms the behavior moved. The live behavioral proof (calling-session executes the built skill against a broken-then-clean composition) is the real test; a source-text grep is its stand-in that pins nothing.

**Watch for the own-file blind spot:** a no-dangling check that only looks for tokens referenced *elsewhere* will miss a token defined-and-referenced only within its own file — deleting that file removes definition and reference together, so the token never enters the check. The proof can then document output (e.g. "I1..I9") it never actually produced.

**How to apply:** At any parity/Gate-C/characterization step, ask: does this proof EXECUTE the relocated thing, or does it grep for a literal? If grep-only, that resistance is the finding — surface it before approving, and ask for one live composition run (break it, see red; revert, see green) to pin the real contract. Re-groundable in this repo at `tests/parity/live-behavioral-proof.md`, `tests/parity/core-conductor.md` (catalog-completeness RED), `scripts/check-suite-integrity.sh`.

Recurs as the same green-by-coincidence smell across gates: see [[project-014-gateC-parity]], [[project-094-f4-characterization-gate]], [[project-060-consent-snapshot-noop-multiply]].
