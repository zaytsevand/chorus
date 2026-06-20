---
name: feedback-tier-verification-by-change-kind
description: Match verification rigor to change-kind — byte-identical relocation needs only structural-equivalence + reachability, not full behavioral RED-GREEN
metadata:
  type: feedback
---

Tier verification rigor by the KIND of change, not uniformly across all touched files.

**Rule:** A byte-identical relocation (move/extract with content unchanged) cannot fail behaviorally — only its *reachability* can break (broken import, dead reference, wrong wiring). So full RED-GREEN behavioral proof on relocated-but-unchanged files is gold-plating; a structural-equivalence + reachability check covers the real risk more cheaply. Reserve maximal behavioral rigor for the files whose CONTENT actually changes.

**Why:** This is the constraint lens applied to test investment. Verification is work; work has cost of delay. Spending behavioral-test budget where no behavior can change is buying correctness the change cannot consume — inventory, not throughput. The risk surface of a pure relocation is narrow and structural; match the check to it.

**How to apply:** When reviewing any refactor/relocation/decomposition, first ask per-file: did CONTENT change, or only LOCATION? Split the verification: structural+reachability tier for byte-identical moves, behavioral tier for content changes. Push back when a plan proposes uniform maximal rigor across both — that over-pays the relocation slice.

Re-groundable at: specs/014-chorus-suite-decomposition/spec.md FR-015 (tiered parity), research.md D4, tests/parity/ (core-primitives.md = structural; live-behavioral-proof.md = behavioral). See also [[project-014-suite-decomposition]].
