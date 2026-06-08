# Contract: Capped-seating cascade (canonical)

The single authoritative definition of how a capped panel is seated. Authored once in
`skill/chorus-review/SDLC-LAYER.md`; referenced (not restated) by `SKILL.md`
Phase 0.5 (R2). Both the agent-SDLC per-gate seating and any capped round-mode seating
use this exact cascade (FR-010 / SC-006).

## Preconditions

- A set of JOIN replies, each `{lens, relevance 0–3, primary_axes[]}`.
- A cap `C = 5`. The cascade runs **only when `J > C`** (eviction forced). For
  `3 ≤ J ≤ 5`, seat all; for `J < 3`, the existing quorum re-ping/abort governs
  (FR-002). Round mode is uncapped by default — the cascade applies only if a cap is
  in force (R3).

## Steps (deterministic; merit-neutral)

1. **Relevance sort.** Order joiners by descending `relevance`. If the top `C` is
   unambiguous (no tie spanning seat `C`), seat them — all `relevance-settled`. Done.
   (FR-003)
2. **Fix the settled seats.** Seats above the tie boundary keep their
   `relevance-settled` provenance. Only the seats spanned by the tie are contested.
   (FR-004)
3. **Coverage maximization.** Among the tied candidates, choose contested seats to
   **maximize the count of distinct primary axes covered by the whole panel**, where a
   lens "covers" only its declared primary (score-3) axes (FR-005). Seats so chosen are
   `coverage-decided`.
4. **Axis-rarity sub-rule.** If step 3 leaves a residual tie because two+ candidates
   add **different** uncovered axes with equal coverage gain, seat the candidate whose
   axis has the **fewest champions across the roster** (rarest first). Seat is
   `rarity-decided`. (FR-006a / FR-017)
5. **Operator fall-back.** If a residual tie remains because candidates cover the
   **same** remaining axis, or are equal on coverage **and** rarity, surface **only**
   those tied candidates (with their shared/contested axis) to the operator; the seat
   is `operator-decided`. Every seat decided in steps 1–4 is seated without a prompt.
   (FR-006b / FR-007)

## Postconditions / invariants

- **Determinism**: identical `{lens, relevance, primary_axes}` ⇒ identical panel and
  per-seat provenance (FR-008). Only step 5 involves a human, and only on the
  genuinely-undecidable residual.
- **Merit-neutrality (S3/I2)**: every automated step sorts persona-supplied integers
  (relevance, distinct-axis coverage counts, champion counts). No step ranks one
  lens's *view* as better than another's.
- **No spillover (FR-015)**: relevance scoring, RSVP self-selection, quorum, the gate
  primitive, and the vote/tally are unchanged.

## Acceptance checks

- Clean relevance top-5 ⇒ no coverage step runs (FR-003).
- Uniform-score tie with axis redundancy ⇒ coverage decides, 0 prompts.
- Different-axis equal-gain tie ⇒ rarity decides, 0 prompts (FR-006a).
- Same-axis residual tie ⇒ operator prompted with only those candidates (FR-007).
- The cascade text exists in exactly one file; SKILL.md references it (SC-006).
