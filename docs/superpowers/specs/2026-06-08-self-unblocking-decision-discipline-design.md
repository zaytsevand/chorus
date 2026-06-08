# Self-Unblocking Decision Discipline — Design

**Date**: 2026-06-08 · **Status**: Approved design (brainstorm) · **Supersedes**: parked feature 005 / GitHub issue #3

## 1. Motivation

### 1.1 What 005 got wrong

GitHub issue #3 proposed a mechanical **axis-coverage tie-break** so a chorus RSVP
seating tie would resolve itself instead of interrupting the operator. Specced as
feature 005 and run through an agent-SDLC Gate A, it was **blocked by 3 🔴 and
parked**. The load-bearing finding: the operator's real seating rule was
*gate-relevance* (which axes matter for this gate) — a **judgment**, which invariants
S3/I2/S9 forbid the orchestrator from making. 005 tried to *mechanically replicate a
human judgment*, and on the standing roster the replication both diverged from the
operator and still interrupted. Replicating judgment was the wrong goal.

### 1.2 The reframe (Fowler, *Fragments*, 2026-04-29)

The article (relaying Chris Parsons and Birgitta Böckeler's *Harness Engineering*)
supplies the right goal. Verbatim anchors:

> "Make feedback **unnecessary where you can** by having the agent verify against a
> realistic environment before it asks a human, and make feedback **instant where you
> cannot**."

> "Verified" … now means "checked by tests, by type checkers, by **automated gates**,
> or **by you where your judgement matters**. The check still happens; it just does not
> always happen in your head."

> "Build better **review surfaces**, not better prompts."

The lesson: **don't replicate judgment — partition it.** For every point where the
workflow pulls in the human, a *computational sensor* asks "is this mechanically
decidable, or genuine judgment?" — auto-resolving the former, and escalating only the
latter, instantly and minimally, onto a real review surface.

### 1.3 Goal

A **self-unblocking yet balanced** agent-SDLC: the workflow runs forward by default,
auto-resolving the decidable and proceeding-with-recorded-default on the reversible,
stopping the human only for genuine, irreversible judgment — and surfacing every
decision for review. Operator involvement collapses to the few calls that are
irreducibly theirs.

## 2. Core model — the decision sensor (three bands)

Every operator-facing decision point routes through one **sensor** that assigns a
**band**, reusing the chorus's own 🔴🟡🟢 vocabulary — now for *decisions*, not just
findings:

| Band | When | Behavior | Article mapping |
|---|---|---|---|
| 🟢 **GREEN** | mechanically decidable (no judgment) | auto-resolve, audit-log, proceed | *feedback unnecessary* |
| 🟡 **YELLOW** | judgment, but **reversible / low-stakes** | **proceed with a recorded default**, queue for **async override** | *better review surface* |
| 🔴 **RED** | judgment **and** irreversible / high-stakes | **hard-block**, instant minimal framed ask | *feedback instant where you can't* |

The workflow **runs forward**, accumulating provisional 🟡 decisions on a review
surface, and only **stops dead for 🔴**. This is the whole of "self-unblocking yet
balanced": green disappears, yellow defers, red — and only red — waits.

## 3. The sensor signal — two evidence-anchored axes

The blunt single self-declared **0–3 relevance score degenerates to all-3s** (every
persona rates itself maximally relevant) — which is precisely *why* 005's seating ties
fired on nearly every gate. A coarse scalar is a blunt sensor. We replace it with a
**decomposed, evidence-anchored** signal, applying the chorus's existing evidence rule
(I8: *a claim with no anchor is demoted*) to scoring itself:

- **Axis A — Applicability.** The persona must **cite ≥ 1 concrete delta** from the
  round-context that its lens touches. No citable delta → **not applicable** →
  abstain-eligible (won't be seated). Evidence-gated: you cannot claim relevance you
  can't anchor.
- **Axis B — Expected stakes.** The **class of finding** the lens expects if seated
  (🟢/🟡/🔴-potential) **plus a one-line evidence hook** for why.

The seating sensor sorts joiners by **(A applicability evidence, then B expected
stakes)**, every term auditable. This kills the uniform-3 degeneracy because the
discriminator is *"can you cite a hook"*, not a self-assigned integer — and it makes
every seating decision **legible** (the evidence is recorded, §5).

> The same evidence-anchoring already governs gate findings (severity proposals carry
> `file:line`/principle tags; the tally is deterministic). The two-axis change brings
> RSVP up to that standard. Severity itself is unchanged.

## 4. Band classification — declared predicate, never orchestrator judgment

This is the **invariant-safety crux** — the thing that keeps the new model from
re-importing 005's S9 failure (the orchestrator quietly making a judgment call):

1. The band for each decision **type** is **declared once** in the catalog (§6). The
   orchestrator does not decide *which band a decision is in* by inference.
2. Per-instance refinement uses only:
   - **mechanical predicates** — sort strictness at the cap boundary, a cycle counter,
     "is the addendum present?"; or
   - **persona-declared flags** — a seated lens declaring "this gap blocks my finding"
     (the lens's call, like JOIN/ABSTAIN — I2-consistent).
3. The orchestrator **counts and routes; it never judges**. A 🔴 is reached only by a
   mechanical predicate firing or a persona flag being raised — never by the
   orchestrator deciding something "feels" like judgment.

This is the discipline 005 violated and the gate primitive already honors (the
deterministic tally). The decision primitive extends it to every touchpoint.

## 5. Decision Record & review surfaces

Every decision — whatever its band — emits one **DecisionRecord**; the band decides how
richly it is *surfaced* (the article's "build better review surfaces," scaled to
stakes).

```
DecisionRecord {
  id            : <gate/phase>-<point>-<n>
  point         : which decision (e.g. "RSVP seating", "Gate-A 🔴 F1")
  band          : 🟢 | 🟡 | 🔴
  sensor: {
    signal      : the rule that fired (e.g. "two-axis sort tie at seat 5")
    evidence    : the anchors (cited deltas, cycle count, persona flag)
    reading     : the mechanical outcome
  }
  resolution    : auto-resolved | default-applied | escalated
  chosen        : what was selected
  alternatives  : the runner-up(s) the sensor weighed
  override      : how to reverse it + its cost (e.g. "re-run gate from seating: 1 cycle")
}
```

Rendered by band:

- **🟢 → audit row.** A one-line entry in the ledger. It was mechanical; review need is
  low, but the trail is complete.
- **🟡 → review-queue card.** A card in the ledger's new
  `## Provisional decisions (review & override)` section: the chosen default, the
  runner-up(s), the `sensor.evidence`, and a **single override action** with its cost.
  *This is the load-bearing review surface* — where async operator judgment lands.
- **🔴 → live decision card.** Surfaced immediately: the specific judgment, **2–4 framed
  options each with its consequence**, the `sensor.evidence`, and the default
  highlighted. Minimal and instant — the operator acts in one step.

The review surface is the *rendered* DecisionRecord; `sensor.evidence` is what makes
every call legible ("why green/yellow/red — here is the proof").

## 6. Decision catalog

The declared band per agent-SDLC touchpoint, with its mechanical predicate. (Base-round
analogues in `INTEGRATION-LAYER.md` follow the same table.)

| Decision point | Band | Predicate (mechanical or persona-declared) |
|---|---|---|
| RSVP seating — clean two-axis sort | 🟢 | strict order at the cap boundary → auto-seat |
| RSVP seating — **tie at the cap** | 🟡 | non-strict at boundary → seat a recorded **default panel** (deterministic order + stable tiebreak), queue for override **(this is all 005 needed)** |
| Gate finding severity (the tally) | 🟢 | deterministic stage-4 tally — already a sensor |
| Proceeding past 🟡/🟢 findings | 🟢 | non-gating → proceed |
| **Gate 🔴 found** | 🟡 → 🔴 | **auto-run incorporation** (clarify→plan / fix) + **re-run gate**, while `cycle < 3`; escalate **🔴 at `cycle == 3`** or when **waiver** is the only path (§7) |
| Exploratory gap — inferable from a cited artefact | 🟢 | a `[ref]` anchor exists → fill + proceed |
| Exploratory gap — needs operator knowledge, reversible | 🟡 | proceed with **recorded assumption** + degradation note; queue for override |
| Exploratory gap — **load-bearing AND irreversible** | 🔴 | a seated lens flags "blocks my finding" **and** no safe default → ask |
| Phase 0 scope/exclusion — addendum present | 🟢 | read addendum → auto |
| Phase 0 scope/exclusion — addendum absent | 🟡 | infer defaults from CLAUDE.md/repo layout + proceed + async confirm |
| Final feature sign-off / 🔴 **waiver** | 🔴 | genuine high-stakes judgment — instant minimal ask |

## 7. The 🔴 self-heal loop

The most consequential behavior change. **Today every gate 🔴 stops to ask the
operator "incorporate or waive?".** Under the decision primitive a gating 🔴 is 🟡
*until the loop bound*:

1. On a post-tally gating 🔴, the orchestrator **auto-runs the incorporation cascade**
   (`/speckit-clarify → /speckit-plan` for Gate A; the per-gate cascade otherwise) —
   the existing, reversible, spec-sourced mechanism (S5).
2. It **re-runs the gate** (a fresh RSVP + primitive cycle). The re-run **is the
   sensor**: it verifies whether the 🔴 cleared — "verify before you ask."
3. This repeats while `cycle < 3` (the existing S7 bound). Each cycle is a 🟡
   DecisionRecord on the review queue (the operator can intervene async).
4. **Escalate 🔴 (hard-block, instant ask) only when**: `cycle == 3` without clearing,
   **or** the incorporation cannot proceed without a **waiver** (a judgment that drops a
   real concern — irreducibly the operator's, S4).

**Invariant preservation:** S4 ("never pass a 🔴 silently") holds — auto-incorporation
is *actively resolving* the 🔴, not passing it; the re-run verifies; a waiver still
hard-escalates. S7 (3-cycle bound) is the RED trigger. S5 (spec-sourced incorporation,
no hand-patching) is the mechanism. So the self-heal is fully inside the existing
guarantees — it just stops asking the human to push the button each cycle.

## 8. Invariants (D1–D5)

New, extending I1–I8 (integration) and S1–S9 (lifecycle + gate primitive):

- **D1 — Declared band, not inferred.** Each decision type's band is declared in the
  catalog; per-instance refinement uses only mechanical predicates or persona-declared
  flags. The orchestrator never *infers* a band. (Extends I2/S3/S9.)
- **D2 — 🔴 never auto-proceeds.** A RED *decision* hard-blocks; no default is applied;
  no silent pass. (Extends S4.) Note the deliberate distinction: a finding whose
  *severity* is 🔴 produces, at first, a 🟡 *decision* — "auto-incorporate and
  re-verify" (§7) — which resolves the finding rather than proceeding past it; the
  *decision* only becomes RED at the loop bound or on a waiver. Severity-🔴 ≠
  decision-band-🔴.
- **D3 — Every 🟡 default is recorded and reversible.** A YELLOW decision proceeds only
  with a DecisionRecord on the review queue carrying a concrete override + its cost.
- **D4 — Classification is mechanical.** The predicate that bands an instance is a sort
  test, a counter, an artefact-presence check, or a persona flag — never a judgment of
  merit or "feel". (Extends S9.)
- **D5 — Signals are evidence-anchored.** The seating signal's applicability and
  expected-stakes axes each require a cited hook; un-anchored claims are demoted.
  (Extends I8.)

## 9. Embodiment (Approach A)

- **New canonical `skill/chorus-review/DECISION-PRIMITIVE.md`** — the three-band model,
  the two-axis signal, the DecisionRecord + review surfaces, the catalog, D1–D5.
  Authored **once**; **referenced** (not restated) by `INTEGRATION-LAYER.md` (base
  round) and `SDLC-LAYER.md` (gates) — the project's established "one primitive, both
  adopt" discipline (cf. `GATE-PRIMITIVE.md`).
- **`SDLC-LAYER.md`** — RSVP/seating section adopts the two-axis signal and the 🟡
  tie-default (replacing the operator-tie-break in S3); the 🔴 block-on-red section
  adopts the self-heal loop (§7); seating examples updated.
- **`SKILL.md`** Phase 0.5 — RSVP reply schema gains the two axes; references the
  decision primitive for banding.
- **`INTEGRATION-LAYER.md`** — references the primitive; base-round decision points
  (scope confirmation, quorum) get their declared bands.
- **Ledger** (`agent-sdlc-log.md` and the base-round artifact) — gains the
  `## Provisional decisions (review & override)` section and the DecisionRecord schema.
- **No runtime code** — Markdown skill/prompt authoring, deployed via `install.sh`.

## 10. Relationship to 005 / issue #3

This **supersedes** feature 005. The seating tie becomes a single 🟡 instance (proceed
with a recorded default, async override) — no axis-coverage machinery, no rarity
sub-rule, no operator interruption. The pieces the Gate A panel **affirmed** carry
forward intact:

- the **canonical-definition discipline** (one primitive, both modes) → §9;
- the **per-seat provenance ledger** → generalized into the DecisionRecord (§5);
- **evidence-anchored self-declaration** (orchestrator counts, never assigns) →
  the two-axis signal (§3) and D1/D4.

Issue #3 is closed as parked; this design is its successor.

## 11. Scope & non-goals

- **In scope:** the decision-banding model, the two-axis RSVP signal, the DecisionRecord
  + review surfaces, the 🔴 self-heal loop, and re-pointing the existing decision points
  to declared bands.
- **Non-goals (YAGNI):** no confidence-score estimator (D4 forbids it); no axis-coverage
  / rarity machinery (retired with 005); no operator-presence modulation (🟡 *always*
  proceeds with default + async review, per the chosen behavior); no new runtime,
  service, or storage.

## 12. Open questions / risks (for the implementation gate to weigh)

- **Residual ties are fine now.** Even with the sharper two-axis signal, some seatings
  will tie — but a tie is 🟡 (default + async review), not an operator stop, so the
  signal need not be perfectly discriminating. The sharpening reduces 🟡 *volume* and
  makes defaults *more defensible*; it is not load-bearing for correctness.
- **The 🔴 self-heal changes operator expectations.** An operator who today expects to
  approve every incorporation will now see them on the review queue instead. The
  degradation/override surface must make in-flight self-heals visible enough that this
  reads as *self-unblocking*, not *runaway*. (This is exactly what a Gate review should
  scrutinize.)
- **"Load-bearing AND irreversible" for gaps** rests on a persona-declared flag (D1).
  If lenses under-flag, a real RED gap could be defaulted as 🟡. The degradation note
  mitigates, but the flag's calibration is worth a gate finding.
- **Review-queue fatigue.** If 🟡 volume is high, async review becomes rubber-stamping.
  The two-axis sharpening and the audit/queue split (🟢 doesn't queue) are the
  mitigations; worth measuring.

## 13. Next step

Take this through the speckit pipeline as a new feature (next sequence number) and gate
it with the agent-SDLC itself — the dogfood that caught 005's flaw. Begin with
`/speckit-specify` from this design, then `/speckit-plan`, then **Gate A**.
