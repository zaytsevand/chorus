# Agent-SDLC Ledger — Feature 012 (rsvp-exceptional-entry)

> Feature renamed from `rsvp-voting-power` → `rsvp-exceptional-entry` during the Gate-A operator dialogue (the "voting power" connotation was dropped along with the protected-vote mechanism).

Audit trail for the chorus SDLC gates on this feature. A reviewer must be able to
reconstruct each gate from this file alone. Mechanic: `GATE-PRIMITIVE.md`
(extract → author → vote → tally); lifecycle: `SDLC-LAYER.md`; decisions banded by
`DECISION-PRIMITIVE.md`.

---

## Gate A — Design review (spec.md) — 2026-06-17

**Corpus:** `specs/012-rsvp-exceptional-entry/spec.md` (clarified; 4 clarifications recorded; reviewed as spec v1, since revised to v2 — see resolution). No `plan.md` yet — per this project's practice (feature 011), Gate A reviews the design as captured in the spec, before `/speckit-plan`.

**Scope decision (DECISION-PRIMITIVE catalog row 10 — addendum absent → 🟡):** No `docs/reviews/CHORUS-PROJECT.md`. Recorded default: corpus = spec.md + the canon docs it modifies (`skill/chorus/{GATE-PRIMITIVE,SDLC-LAYER,SKILL,DECISION-PRIMITIVE}.md`); no code-path exclusions (markdown methodology repo, design review). Override: operator may restate scope; I re-run.

### Roster (this round) — RSVP

Round-context delta: feature 012 changes the chorus canon's seating + tally — US1 (ABSOLUTE RSVP tier exempt from the 5-seat cap, additive, boards 6–9), US2 (escalation threshold T=floor(N/2) over non-author voter count N, replacing fixed +2), US3 (protected votes — shield-from-reversal). Markdown-only repo; canon docs + quickstart stanzas are the change/verification surface.

| Lens | RSVP | Applicability (cited delta) | Expected stakes | Seated? |
|------|------|------------------------------|-----------------|---------|
| Security-and-Trust | JOIN | US1+US3 capture/integrity surface | 🔴 | ✅ seat 1 |
| Cooper · product | JOIN¹ | US1 self-declaration, US3 vote shielding | 🔴 | ✅ seat 2 |
| Goldratt · scope/defer | JOIN¹ | US2/US3 sequencing vs US1 | 🟢→load-bearing | ✅ seat 3 (mandate) |
| Richards · architecture | JOIN | 3 mechanics × 2 canon docs; Principle I | 🟡 | ✅ seat 4 |
| Delivery-and-Ops | JOIN | boards 6–9 → ~2× dispatch cost; US3 complexity | 🟡 | ✅ seat 5 (tie default) |
| Evans · DDD | JOIN | vocabulary coherence (US1/2/3) | 🟡 | ⬜ out-seated (cap) |
| Beck · TDD/simple | JOIN | US3 testability + YAGNI | 🟡 | ⬜ out-seated (runner-up) |
| Uncle Bob · clean code | JOIN | rule clarity / boundaries | 🟢 | ⬜ out-seated (cap) |
| Norman · HCD | ABSTAIN | concerns are downstream (Gate B/C observables) | 🟡 | — abstained |

¹ Cooper and Goldratt first returned internally-contradictory RSVPs (cited applicability + stakes yet wrote ABSTAIN). Per the chair-decides-nothing rule I re-pinged for disambiguation (did not reclassify); both confirmed JOIN.

**Seating: J = 8 ≥ 6 → cap at 5 (S3).** Sort by (applicability, then stakes); Goldratt mandate-protected (scope/deferral lens is never out-seated on a new buildout, S3). Seats 1–4 are a strict order (🟢 auto-seat). Seat 5 is a **🟡 tie** among Delivery-Ops / Beck / Evans (all 🟡) → DECISION-PRIMITIVE catalog row 2.

> **DecisionRecord** `gateA-seat5-1` · band 🟡 · point: 5th-seat tie · sensor: non-strict at cap boundary, three 🟡 candidates · resolution: default-applied · **chosen: Delivery-and-Ops** (matches declared expected Gate A attendance; distinct operational mandate — Beck's defer-US3 overlaps Goldratt, Evans's "vocabulary coherent" is low-yield) · alternatives: Beck, Evans · override: operator may swap in Beck/Evans async → re-run gate.

### Findings register (Stage 2 — Author; uncapped; all I8-passing)

Severity column is the **author-proposed** severity; the Stage-4 tally sets the final.

| ID | Lens | Proposed | Evidence | Pull-quote (verbatim) |
|----|------|:--:|----------|------------------------|
| F1 | Security | 🔴 | spec.md:69,114; GATE-PRIMITIVE.md:122; [principle: constitution III] | "A vote you can shield by self-selecting your own seat tier is not a vote — it is a veto with extra steps." |
| F2 | Security | 🔴 | spec.md:108,113; GATE-PRIMITIVE.md:122,128; [principle: constitution III] | "The spec promises arithmetic-only in FR-011 and then bolts a judgment clause onto the tally in FR-013 — both cannot be true." |
| F3 | Security | 🟡 | spec.md:69,108; GATE-PRIMITIVE.md:128 | "Two identical ballots that produce two different severities is precisely the tally tie the canon swore did not exist." |
| F4 | Security | 🟡 | spec.md:95,138; [principle: constitution V]; [principle:proposed] | "A privilege a persona can claim every round with no cost and no audit will be claimed every round." |
| F5 | Security | 🟢 | spec.md:61; [principle: constitution IX] | "Keep the louder seat and the scaled threshold; drop the silent veto — the first two earn their keep, the third buys capture you cannot audit away." |
| F6 | Cooper | 🔴 | spec.md:25,96; [principle: constitution II] | "Irreplaceability is a judgment about the review — so it belongs to the operator who reads the verdict, not to the lens that wants the chair." |
| F7 | Cooper | 🟡 | spec.md:25; SDLC-LAYER.md:82-83; [principle: constitution VI] | "You are adding an un-overridable seat to fix a tie that was already overridable — that is a downgrade dressed as a feature." |
| F8 | Cooper | 🔴 | spec.md:61,113-117; GATE-PRIMITIVE.md:129-130; [principle: constitution III] | "One self-declared absolutist outvoting five colleagues isn't protection — it's the heckler's veto with a severity attached." |
| F9 | Cooper | 🟡 | spec.md:25,27,61; [principle: constitution IV] | "'I am convinced I matter' is the persona's feeling, not the operator's requirement — and a spec that builds a cap-exemption on a feeling has skipped the user." |
| F10 | Cooper | 🟡 | spec.md:9; SDLC-LAYER.md:19-26; [principle: constitution II] | "If the operator can pin the lens, the persona never needs to crown itself — and the ledger stays honest about who chose." |
| F11 | Cooper | 🟡 | spec.md:35,79; [principle: constitution IX, VI] | "When everyone is irreplaceable, no one is — and the operator inherits a nine-seat room nobody chose to fill." |
| F12 | Goldratt | 🔴 | spec.md:27,43,45 | "US2 fixes a leak in a pipe US1 has not yet laid." |
| F13 | Goldratt | 🔴 | spec.md:25; [principle: constitution IX]; [principle:proposed] | "Ship the seat, watch the room, then decide if the room needs a louder gavel." |
| F14 | Goldratt | 🔴 | spec.md:16,61,63; [principle:proposed] | "A shield forged before the first blow is armor for a war no one has declared." |
| F15 | Goldratt | 🟡 | spec.md:106,133; [principle: constitution IX] | "The only thing that must ship is that nothing changes when nobody asks it to." |
| F16 | Goldratt | 🔴 | spec.md:27,45,63; [principle: constitution IX] | "The spec already wrote my dissent — it just stapled it to a P2 and a P3 instead of a 'later.'" |
| F17 | Richards | 🔴 | spec.md:89,148; GATE-PRIMITIVE.md:6; SDLC-LAYER.md:247; [principle: constitution I] | "Naming the change surface as 'all three docs, or their successors' is not the same as naming one home per rule — and Principle I demands the latter." |
| F18 | Richards | 🔴 | spec.md:60,113-117; GATE-PRIMITIVE.md:103-116; [principle: constitution I] | "A shield that fires inside the tally must be defined where the tally is defined, or two docs will own one moment of arithmetic." |
| F19 | Richards | 🟡 | spec.md:18,103,107; SDLC-LAYER.md:247; GATE-PRIMITIVE.md:151 | "The threshold lives on N, the user reasons in board size, and the identity bridging them belongs to neither canon doc — that gap is where the next drift hides." |
| F20 | Richards | 🟡 | spec.md:61,63,112 | "The spec proves these are two decisions by shipping one without the other, then binds them as if they were one." |
| F21 | Richards | 🟡 | spec.md:82,83; SKILL.md:259; GATE-PRIMITIVE.md:128 | "T=0 lets one vote promote a finding unopposed — the plan cannot be left to discover that the formula has a floor problem at the bottom." |
| F22 | Delivery | 🟡 | spec.md:98; SDLC-LAYER.md:143-147; [principle: constitution IX] | "Every ABSOLUTE seat is a standing 2x tax on the vote fan-out, paid every finding, every cycle, every gate — and nothing in the spec caps the bill." |
| F23 | Delivery | 🟡 | spec.md:79,96-98; [principle: constitution IX] | "A cap that any seat can opt out of by typing one more word in its RSVP is not a cap — it's a suggestion with a 2x cost attached." |
| F24 | Delivery | 🟡 | spec.md:59-63,113-117; [principle: constitution IX] | "US3 armors a finding-tally outcome that no real wide board has ever produced — that is robustness ahead of the first run." |
| F25 | Delivery | 🔴 | spec.md:133-139,148; [principle: constitution V, X]; [principle:proposed] | "The conformance stanza is the only thing that runs in this repo — deferring it on a tally-rewrite means the feature ships with its single test absent." |
| F26 | Delivery | 🟢 | spec.md:99,112,138 | "This is the one place the spec pays its operability rent up front — the ledger makes a wide-board verdict reconstructable instead of trust-me." |
| F27 | Delivery | 🟡 | spec.md:82,108; [principle: constitution VII] | "A threshold that lets one vote manufacture a gating red is a single-signal hard-block — that decision belongs in the spec, not deferred to whoever writes the plan." |

### Stage 3–4 — Vote + deterministic tally

Votes are non-author only (S8). `net = P − O` (CONFIRM excluded); `net ≥ +2` escalate one level, `net ≤ −2` demote, else hold; movement one level per tally; gating iff final 🔴. Convergence (rank) = P + C.

| ID | Author | Proposed | P | C | O | net | Final | Conv |
|----|--------|:--:|:-:|:-:|:-:|:--:|:--:|:--:|
| F1 | Security | 🔴 | 1 | 3 | 0 | +1 | 🔴 | 4 |
| F2 | Security | 🔴 | 2 | 2 | 0 | +2 | 🔴 (cap) | 4 |
| F3 | Security | 🟡 | 0 | 4 | 0 | 0 | 🟡 | 4 |
| F4 | Security | 🟡 | 2 | 0 | 2 | 0 | 🟡 | 2 |
| F5 | Security | 🟢 | 0 | 4 | 0 | 0 | 🟢 | 4 |
| F6 | Cooper | 🔴 | 0 | 4 | 0 | 0 | 🔴 | 4 |
| F7 | Cooper | 🟡 | 1 | 3 | 0 | +1 | 🟡 | 4 |
| F8 | Cooper | 🔴 | 1 | 3 | 0 | +1 | 🔴 | 4 |
| F9 | Cooper | 🟡 | 0 | 3 | 1 | −1 | 🟡 | 3 |
| F10 | Cooper | 🟡 | 2 | 2 | 0 | +2 | **🔴** (escalated) | 4 |
| F11 | Cooper | 🟡 | 1 | 2 | 1 | 0 | 🟡 | 3 |
| F12 | Goldratt | 🔴 | 1 | 3 | 0 | +1 | 🔴 | 4 |
| F13 | Goldratt | 🔴 | 0 | 4 | 0 | 0 | 🔴 | 4 |
| F14 | Goldratt | 🔴 | 1 | 3 | 0 | +1 | 🔴 | 4 |
| F15 | Goldratt | 🟡 | 1 | 2 | 1 | 0 | 🟡 | 3 |
| F16 | Goldratt | 🔴 | 0 | 4 | 0 | 0 | 🔴 | 4 |
| F17 | Richards | 🔴 | 2 | 2 | 0 | +2 | 🔴 (cap) | 4 |
| F18 | Richards | 🔴 | 1 | 3 | 0 | +1 | 🔴 | 4 |
| F19 | Richards | 🟡 | 0 | 3 | 1 | −1 | 🟡 | 3 |
| F20 | Richards | 🟡 | 1 | 3 | 0 | +1 | 🟡 | 4 |
| F21 | Richards | 🟡 | 1 | 2 | 1 | 0 | 🟡 | 3 |
| F22 | Delivery | 🟡 | 0 | 0 | 4 | −4 | **🟢** (demoted) | 0 |
| F23 | Delivery | 🟡 | 1 | 2 | 1 | 0 | 🟡 | 3 |
| F24 | Delivery | 🟡 | 1 | 3 | 0 | +1 | 🟡 | 4 |
| F25 | Delivery | 🔴 | 1 | 3 | 0 | +1 | 🔴 | 4 |
| F26 | Delivery | 🟢 | 0 | 4 | 0 | 0 | 🟢 | 4 |
| F27 | Delivery | 🟡 | 0 | 2 | 2 | −2 | **🟢** (demoted) | 2 |

Two findings moved on the vote: **F10** 🟡→🔴 (Richards+Delivery PRIORITIZE — the un-considered operator-pinned-lens alternative is an evolvability/earned-complexity miss) and **F22**/**F27** 🟡→🟢 (panel judged dispatch-cost the earned price of wider boards; the N≤1 footgun a dup of F21). No author graded its own finding; no orchestrator-synthesized vote (S8/S9 hold).

### Gating 🔴 set (12) — grouped by keystone

- **K1 · US3 protected votes break "severity is arithmetic" (constitution III) — cut as designed:** F1, F2, F8, F18 (+F14 defer). Reintroduces the single-voice severity veto issue #13 closed.
- **K2 · US2/US3 are speculative; defer behind a validated US1 (constitution IX):** F12, F13, F16, F14. No board exceeds 5 today — US2 solves a problem US1 manufactures.
- **K3 · US1 seating inverts ownership — operator should control seating, not personas self-declaring:** F6, F10. (+F7 🟡: the spec's premise is partly false — cap ties are already async-overridable, SDLC-LAYER:82-83.)
- **K4 · Principle I / conformance hygiene:** F17 (no single canonical home), F18 (protected-vote rule home-less), F25 (the only test surface — quickstart stanzas — deferred).

### Round brief

A highly convergent gate. All five seated lenses, each from its own mandate, reached the same verdict: **US3 (protected votes) is unshippable as designed** — it bolts a judgment clause onto a tally the canon (and constitution Principle III) require to be arithmetic-only, letting one self-declared ABSOLUTE seat outvote five (F1/F2/F8/F18). **US2 and US3 are speculative** — they fix over-escalation on wide boards that *cannot form until US1 ships*, so they are inventory ahead of validated learning (F12/F13/F16, constitution IX). **US1's mechanism is itself contested** — ABSOLUTE lets a persona self-declare irreplaceability, inverting an ownership that belongs to the operator, when a simpler operator-pinned-lens achieves the goal transparently (F6/F10), and its motivating premise (that cap ties displace deserving lenses) is partly false since ties are already async-overridable (F7). Even the parts worth keeping need Principle-I canonical homes and the deferred conformance stanzas (F17/F25). 12 of 27 findings are gating 🔴.

### Block on 🔴 → operator escalation

> **DecisionRecord** `gateA-block-1` · band 🔴 · point: 12 gating 🔴 dominated by a **scope reversal** (cut US3, defer US2) that contradicts the operator's explicitly-requested feature scope (US1+US2+US3). · sensor: post-tally gating set; the dominant resolution is a scope decision the operator owns (chair-decides-nothing: "scope decision during incorporation → operator's recorded default") and/or a waiver of real concerns (DECISION-PRIMITIVE catalog row 5/11). · resolution: **escalated** (no auto-default; D2 — 🔴 never auto-proceeds). · cycle: 0 (escalating *before* the self-heal loop, because auto-incorporating a cut/defer of operator-requested stories would be the conductor making the operator's scope call). · note: matches feature-011 Gate-A precedent (9 🔴 → escalated to operator, then self-healed post-decision).

**Operator input received mid-gate (2026-06-17):** "Goldratt's protection may be replaced by current mechanism." Reframes US1 as *generalizing the existing hard-coded Goldratt must-seat carve-out (SDLC-LAYER S3) into a declared tier*, partially rebutting F6/F10 (must-seat is not novel; today's carve-out is more arbitrary than a declared tier). Residual F6 nuance: the carve-out is mandate-based + designer-decided, ABSOLUTE is self-declared per round → incorporation should anchor the tier to a mandate/operator-pin. Routed into the scope decision below; not yet applied (S5 — incorporation is spec-sourced via clarify→plan).

### S1–S9 self-audit (Gate A)

| Inv | Holds? | Evidence |
|-----|:--:|----------|
| S1 orchestrator authors nothing | ✅ | all 27 findings authored by personas; conductor only tallied/recorded |
| S2 RSVP fired this gate | ✅ | Roster table; 9 replies, independent |
| S3 panel ≤5, signal-seated, tie→🟡, Goldratt not out-seated | ✅ | seating record; `gateA-seat5-1` 🟡 default; Goldratt mandate-seated |
| S4 no gate passes with open 🔴 | ✅ | escalating, not passing |
| S5 incorporation spec-sourced (clarify→plan) | ✅ | committed; no hand-patch performed |
| S6/I8 every counted finding has file:line or principle tag | ✅ | all 27 carry evidence; none demoted to [unsupported] |
| S7 loop ≤3 cycles | ✅ | cycle 0; escalated pre-loop |
| S8 author never grades own finding | ✅ | each voter skipped its own F-IDs |
| S9 no synthesized votes; tally arithmetic-only | ✅ | votes are real dispatches; tally table reproducible |

### Provisional decisions (review & override)

- `gateA-seat5-1` 🟡 — seat 5 = Delivery-and-Ops (runner-ups Beck, Evans); override: swap async → re-run.
- `gateA-block-1` 🔴 — **RESOLVED by operator** (below).

### Operator scope decision — resolves `gateA-block-1`

> **DecisionRecord** `gateA-block-1` · band 🔴 · resolution: **operator-decided** (2026-06-17 dialogue) · chosen: **inclusion-first reframe** — see below · alternatives weighed: panel's "US1-only, defer US2"; "keep US1+US2, drop US3"; "waive all". The operator reasoned to a resolution distinct from the panel's literal recommendation; the gate **informed** the decision, it did not dictate it (I9 — the chair decides nothing; scope is the operator's).

The 12 🔴 are cleared **without a waiver** by reframing the feature (spec → v2):

1. **US3 (protected votes) — CUT.** Clears K1 (F1/F2/F8/F18) and the US3 half of K2 (F14). "An expert lens must win because it's persuasive, not because of its weight." Severity stays arithmetic (Principle III).
2. **US1 — recast to *capped board (5) + uncapped exceptional entry*.** Clears K3 (F6/F10/F7): entry is self-selected on cited exceptional reasoning (not a self-important veto-seat, not an operator-pin, not a codified mandate — "mandates limit self-selection"). Entry buys a voice, never weight. The cap never *truly* excludes (exceptional entry is the escape valve), so inclusion holds without widening the default board.
3. **US2 (board-scaled threshold) — KEPT, now load-bearing.** Rebuts K2 (F12/F13/F16): the operator deliberately enables wide boards via exceptional entry, so a fixed `+2` would over-escalate *now* — the dilution is the cure, not speculative inventory. Linear `floor(N/2)` is fine because the cap keeps `N` near 4 with rare exceptional bumps.
4. **US3′ (new) — conductor side-notes, flag-only — ADDED.** A non-binding safety net for the edge regimes US1/US2 open (wide board, marginal `net==T`, same-brief unanimity). The **gating ("do more") version is DEFERRED to a separate spec** (Goldratt deferral, Principle IX).
5. **K4 (Principle I + conformance) — folded into v2:** each rule gets one canonical home (seating→SDLC-LAYER, threshold→GATE-PRIMITIVE Stage 4, side-note→INTEGRATION-LAYER); conformance stanzas are the named verification surface; the false "cap ties displace lenses" premise (F7) is corrected; the `N≤1→T=0` footgun is closed in-spec (`T≥1`, no tally at `N<2`).

**Incorporation:** spec rewritten to **v2** in-session (the operator supplied the clarifications directly; recorded under Clarifications → "Session 2026-06-17 (Gate A reframe)"). Feature renamed `rsvp-voting-power → rsvp-exceptional-entry`. **Next:** re-run **Gate A cycle 1** against spec v2 to confirm the 12 🔴 are cleared (the re-run tally is the verifying sensor — "verify before you ask").

### Conductor side-notes (safety net) — first instance

> The US3′ side-note mechanism is specified in v2 but not yet built. This is the conductor exercising the posture by hand, as the operator requested — a first instance for the record.

**SN-1** · Gate A, 2026-06-17 · *filed by the conductor (integration layer), non-binding, routed to the operator. Severity effect: none (Principle III).*

> This gate recorded **12 gating 🔴 with unusually high convergence** — six findings carried 4–0 CONFIRM. I am obliged to note, in the canon's own words, that **a unanimous vote of five personas who each read the same round-context paragraph is one datum, not five.** The brief I wrote is a common cause; convergence on a common cause is correlation, not five independent confirmations. The verdict was sound and the operator's reframe clears it — but its *weight* should be read as "the framing held under five lenses," not "five oracles independently agreed."
>
> Second: **F10 escalated 🟡→🔴 on `net = +2`, the threshold's exact boundary** (two PRIORITIZE at N=4, T=2) — a *marginal* promotion, precisely the case US3′'s safety-net is meant to flag. One more voter (an exceptional entry, N=5 → T=2 still; N=6 → T=3) and F10 would not have escalated. The escalation is arithmetically correct and stands; this note is the safety net beside the tally, never an override.
>
> Routed to: operator. No severity changed.

---

## Gate A — cycle 1 (verification re-run on spec v2) — 2026-06-17

Self-heal loop, cycle 1 (`DECISION-PRIMITIVE` catalog row 5). Fresh RSVP + primitive (S2).

### RSVP (cycle 1)

Round-context delta: spec v2 (post-reframe). 8 joiners, 1 abstain (Evans 🟢, no domain-model work — coherent). Cooper and Norman first abstained-while-citing-stakes; re-pinged for disambiguation (chair decides nothing), both → JOIN. Stakes collapsed vs cycle 0: Richards/Security/Goldratt/Uncle Bob/Beck/Delivery all 🟢 ("v2 clears my cycle-0 reds"); Cooper 🟡 + Norman 🔴-hook (new concerns).

**Seating (cap 5):** Norman, Cooper (the two new-concern lenses), Richards + Security (verifiers of their own cycle-0 keystones K4/K1), Goldratt (mandate). Out-seated 🟢-clearance-only: Delivery, Uncle Bob, Beck (`gateA-c1-seat` 🟡 default; async override).

### Cycle-0 clearance (verified by authors, with v2 citations)

**All 12 cycle-0 gating 🔴 CLEARED.** Security: F1–F5 ✓ (FR-003/011/014; protected votes deleted). Richards: F17–F21 ✓ (single homes named; F18/F20 cleared by deletion; FR-010 T≥1). Cooper: F6–F11 ✓ (tier reframed to voice-not-weight; operator-pin alternative now on record). Goldratt: F12–F16 cleared/honored (US2 now load-bearing; side-note gating deferred to a separate spec).

### New findings (cycle 1) — register + tally

`net = P − O` over 4 non-author voters; `net ≥ +2` escalate, `≤ −2` demote, else hold. Convergence = P+C.

| ID | Lens | Proposed | P | C | O | net | Final | Pull-quote (verbatim) |
|----|------|:--:|:-:|:-:|:-:|:--:|:--:|---|
| G1 | Security | 🟡 | 0 | 3 | 1 | −1 | 🟡 | "An entry path that is uncapped, self-judged, and backed only by a note the operator may ignore is an open door with a doorbell, not a lock." |
| G2 | Richards | 🟡 | 2 | 2 | 0 | +2 | **🔴** | "Naming one home is necessary but not sufficient when the house already has three echoes of the same rule wired into the walls." |
| G3 | Cooper | 🟡 | 2 | 2 | 0 | +2 | **🔴** | "The lens you most need is the one too modest to walk through the open door — and you just rejected the only mechanism that would have pulled it in." |
| G4 | Cooper | 🟡 | 4 | 0 | 0 | +4 | **🔴** | "A cap with an exception anyone can self-grant by writing a sentence is not a cap — it's a suggestion with paperwork." |
| G5 | Goldratt | 🟡 | 1 | 3 | 0 | +1 | 🟡 | "You have built the cure for a wide board and the door that widens it in the same batch — yet not one round has walked through the door." |
| G6 | Goldratt | 🟢 | 0 | 4 | 0 | 0 | 🟢 | "A change that reduces to the identity at today's board is still a change you must maintain on the constraint's critical path." |
| G7 | Norman | 🔴 | 2 | 1 | 1 | +1 | 🔴 | "You cannot ask nine independent agents to clear a bar you never drew on the wall and then call the result 'rare.'" |
| G8 | Norman | 🟡 | 1 | 3 | 0 | +1 | 🟡 | "A note that changes nothing and tells the reader nothing about what to change is decoration, not a safety net." |
| G9 | Norman | 🟢 | 0 | 1 | 1 | −1 | 🟢 | "Tell the persona what its voice *buys*, not only what it doesn't." |

**Gating 🔴 set (cycle 1): G2, G3, G4, G7.** G3/G4/G7 are one root — *"exceptional" is undefined / unenforced* (Cooper, Goldratt-via-G5, Norman; G4 unanimous 4–0). G2 is separate — *Principle I in practice*: editing a rule's canonical home leaves the canon's existing restatements of cap-5 / `net≥+2` stale across 3–4 docs.

### Conductor side-note — SN-2

**SN-2** · Gate A cycle 1 · *non-binding, routed to operator, severity effect: none.*
> **G2 escalated 🟡→🔴 on net = +2, the threshold's exact boundary** (Security + Norman PRIORITIZE; Cooper + Goldratt CONFIRM) — a marginal promotion. It stands (arithmetic), but flagged as the boundary case. Note also that the four cycle-1 🔴 collapse to **two** distinct fixes (define-the-bar; reconcile-canon-copies), so "four reds" overstates the work — one datum seen from several lenses, again.

### S1–S9 self-audit (cycle 1)

S1 ✅ (personas authored; conductor tallied) · S2 ✅ (fresh RSVP) · S3 ✅ (cap 5; `gateA-c1-seat` 🟡; Goldratt seated) · S4 ✅ (not passing — escalating) · S5 ✅ (no hand-patch) · S6/I8 ✅ (all G-findings cite file:line) · S7 ✅ (cycle 1 of 3) · S8 ✅ (no author graded own G-finding) · S9 ✅ (arithmetic tally, reproducible).

### Block on 🔴 → operator escalation (cycle 1)

> **DecisionRecord** `gateA-c1-block` · band 🔴 · point: 4 new gating 🔴 (G2/G3/G4/G7) on spec v2. · resolution: **escalated** (no auto-default; D2). · cycle: 1 of 3. · rationale: the dominant fix (define "exceptional" — its bar, adjudicator, and rarity enforcement) **collides with the operator's explicit cycle-0 decisions** (no operator-pin, no mandate, preserve self-selection — G3 names this directly). The conductor cannot auto-incorporate a resolution that reverses or trades against operator-owned scope choices (chair decides nothing). G2 (reconcile canon restatements) is mechanically incorporable in plan, but cannot clear the gate alone while G3/G4/G7 await the operator.

**Awaiting operator decision** on the "exceptional" bar (see options in session).

**Operator decision (resolves `gateA-c1-block`):** option 1 — **define "exceptional" by an evidence bar, not an adjudicator** (operator-authorized, so this is a self-heal incorporation, not a conductor scope call). Plus the operator **reframed G3**: "it's not modesty, it's value that is not articulated clearly" — a lens that can't cite an uncovered delta hasn't demonstrated value, so not seating it is the bar working, not exclusion. Incorporated to **spec v3**: FR-002a (cite an uncovered delta or be refused; I8/D5; no adjudicator), FR-002b (distinct deltas self-limit packing), FR-016 + SC-009 (reconcile canon restatements), SC-008 (the bar's conformance). 

_Gate A cycle 1 closed; incorporated to v3; proceeding to cycle 2._

---

## Gate A — cycle 2 (verification re-run on spec v3) — 2026-06-17

Self-heal loop, cycle 2 of 3. Fresh RSVP (S2). Purpose: verify the 4 cycle-1 🔴 (G2/G3/G4/G7) are cleared by v3.

### RSVP + clearance verification (cycle 2)

All 9 roster lenses replied; **all confirm v3 clears their cycle-1 concern**, each citing the resolving v3 requirement. Stakes collapsed to 🟢 (two 🟡 residual hooks). Seated (cap 5, the cycle-1 red-owners + mandate): Richards, Cooper, Norman, Security, Goldratt.

| Cycle-1 🔴 | Owner | v3 fix (cited) | Verdict |
|----|----|----|----|
| G2 | Richards | FR-016 + SC-009 (reconcile every restatement; conformance no stale `net≥+2` remains) | **CLEARED** |
| G3 | Cooper | FR-002a + reframe (value-not-articulated ≠ exclusion) | **CLEARED** |
| G4 | Cooper | FR-002a (cite uncovered delta; no adjudicator) | **CLEARED** |
| G7 | Norman | FR-002a / SC-008 (self-checkable bar replaces "guess") | **CLEARED** |

No lens re-raised a gating concern. The cycle-1 🟡/🟢 holds (G1/G5/G8 etc.) are unchanged and non-gating.

### New finding (cycle 2)

| ID | Lens | Severity | Evidence | Pull-quote |
|----|------|:--:|----------|------------|
| H1 | Security | 🟡 | spec.md FR-002b | "The distinct-delta rule stops trivial stuffing, but two formally-distinct claims can be the same phenomenon wearing two hats — and nothing here checks the semantics." |

**H1 is non-gating** (Security self-rated 🟢→🟡; no lens contests it; cost-bounded per Delivery). **Mitigation (recorded, routed to plan):** the round brief should state what counts as a *distinct* delta (e.g. anchored to round-fresh findings / new coverage, not re-litigated prior art); the US3 side-note already flags board-widening for operator review. Carried as a Gate-B/plan note, not a Gate-A blocker.

### Method note (proportionality)

Cycle 2 ran a fresh RSVP in which each cycle-1 red-owner assessed clearance of its own finding against v3 with a file:line citation; no lens authored a gating finding, and the sole new finding (H1) is a recorded 🟡. A full author+vote+tally was judged disproportionate against unanimous clearance (no-ultracode posture; [[no-ultracode-mode]]). The operator may request a full author/vote pass for belt-and-suspenders.

### S1–S9 self-audit (cycle 2)

S1 ✅ · S2 ✅ (fresh RSVP) · S3 ✅ (cap 5; Goldratt seated) · **S4 ✅ — gate clears with no open 🔴** · S5 ✅ (v3 spec-sourced, operator-authorized) · S6/I8 ✅ (H1 cites file:line) · S7 ✅ (cleared at cycle 2 of 3, within bound) · S8/S9 ✅.

### Decision — Gate A CLEARED

> **DecisionRecord** `gateA-pass` · band 🟢 · point: Gate A verdict after cycle-2 verification · sensor: gating 🔴 set is **empty** (all 12 cycle-0 reds cleared in v3; all 4 cycle-1 reds verified cleared; one non-gating 🟡 H1 recorded) · resolution: **auto-resolve — Gate A passes** · cycle count: 2 of 3 (within S7 bound). N+1 (operator) holds final sign-off.

---

## Gate A — Sign-off

**TL;DR.** Gate A on feature 012 (rsvp-exceptional-entry) **PASSED at cycle 2**. Cycle 0 found 12 gating 🔴 (dominated by: protected votes break "severity is arithmetic"; US2/US3 speculative; US1 seating inverts ownership). The operator reframed the feature to an **inclusion-first** design — capped board + uncapped *exceptional entry* (evidence-bar gated, voice-not-weight), board-scaled promotion threshold (kept, load-bearing), conductor side-notes (flag-only; gating version deferred to a separate spec) — clearing all 12 without a waiver. Cycle 1 caught a real gap (undefined "exceptional"), fixed in v3 by an evidence bar (cite an uncovered delta; no adjudicator). Cycle 2 verified clearance; one non-gating 🟡 (H1: "distinct delta" semantic validation) routed to plan.

**The journey (3 cycles, within the S7 bound of 3):**
- Cycle 0: 12 🔴 → operator scope decision (inclusion-first reframe).
- Cycle 1: 12 cleared, 4 new 🔴 (undefined "exceptional" + canon hygiene) → operator chose the evidence-bar definition.
- Cycle 2: all cleared; 1 non-gating 🟡. **PASS.**

**Conductor side-notes filed:** SN-1 (cycle 0: convergence is "one datum not five"; F10 marginal escalation), SN-2 (cycle 1: G2 marginal escalation; "four reds are two fixes").

**Next-gate baseline (Gate B — plan/tasks).** Assume settled: the v3 design (US1 evidence-bar seating, US2 `T=max(1,floor(N/2))`, US3 flag-only side-notes). Carry forward to plan/tasks:
- **FR-016 / SC-009** — when editing each rule's canonical home, reconcile all restatements across `GATE-PRIMITIVE.md` / `SDLC-LAYER.md` / `SKILL.md` (no stale `net≥+2` or standalone cap-5 left).
- **H1 mitigation** — define "distinct delta" in the round-brief guidance.
- **Deferred to a separate spec:** the gating ("do more") version of side-notes.
- Single canonical homes to edit: seating→SDLC-LAYER; threshold→GATE-PRIMITIVE Stage 4; side-note→INTEGRATION-LAYER.

_Gate A complete._

---

## Plan / Tasks — 2026-06-17

- `/speckit-plan` → `plan.md` (+ `research.md`, `data-model.md`, `contracts/canon-edits.md`, `quickstart.md`). Constitution Check PASS, no violations (markdown-only; the feature *improves* Principle-I compliance via FR-016).
- `/speckit-tasks` → `tasks.md` (T001–T016). **Gate B (plan/tasks review) skipped per operator direction** — tasks generated only as the `/speckit-implement` prerequisite.

## Implement — 2026-06-17

Canon edits applied per `contracts/canon-edits.md` (diff: 4 files, +101/−41):
- **C3** `GATE-PRIMITIVE.md` Stage 4 → `T = max(1, floor(N/2))` (T=2 at N=4; no tally at N<2; "no seat re-weighted").
- **C1/C2** `SDLC-LAYER.md` seating → cap 5 ordinary + uncapped **exceptional entry** (evidence bar: cite uncovered delta or refused; distinct deltas; no adjudicator; voice-not-weight; board formula); S3 updated.
- **C5/C6** `SKILL.md` → RSVP exceptional-entry answer; Phase-2 tally prose reconciled to **cite** GATE-PRIMITIVE (no restated `±2`).
- **C4** `GATE-PRIMITIVE.md`:130 → "ordinary-seat cap" (citation). **C7** `INTEGRATION-LAYER.md` → conductor side-note safety net (flag-only; gating deferred). **C8** `DECISION-PRIMITIVE.md` → checked; D5 already supports the evidence bar, no edit.
- **Conformance (quickstart CS-001..009):** all pass. **CS-009** grep confirms the threshold formula lives only in GATE-PRIMITIVE; **no stale `net≥+2`** anywhere (FR-016 / G2 satisfied).

## Gate C — Implementation review — 2026-06-17

**Fixed viewpoint:** `spec-walkthrough 012 headless` → `walkthrough-headless.md`, **advisory CLEAN** (zero DRIFT), one SURPRISE `«base-round-reach»`. Ingested as extract records (not gospel).

**Panel (4 seated, proportionate to a small conformance-verified diff):** Richards, Security, Beck, Goldratt reviewed the actual diff + spec v3 + walkthrough digest.

### Findings register (Gate C)

| ID | Lens | Severity | Evidence | Pull-quote (verbatim) |
|----|------|:--:|----------|------------------------|
| J1 | Richards | 🟢 | GATE-PRIMITIVE:104-132; SDLC-LAYER:107-130; INTEGRATION:84-110; SKILL:512-515 | "One home per rule, every other touch demoted to a reference — no two docs now own the same number." |
| J2 | Richards | 🟢 | SDLC-LAYER:124-126; GATE-PRIMITIVE:104-117 | "Seating produces N, the tally consumes N — the dependency points one way and each side cites the other's home rather than copying it." |
| J3 | Richards + Goldratt | 🟡 | GATE-PRIMITIVE:104-117; SKILL base-round; spec.md US2 | "The number landed in the one right home — and that home is shared with the uncapped base round, so 'backward-compatible' is only true at N=4." |
| J4 | Security | 🟡 | GATE-PRIMITIVE:110-112; SDLC-LAYER:99-100 | "Entry can no longer out-weigh the count, but a well-timed extra voter can still mute a genuine escalation by raising the denominator — the side-note is what makes that visible." |
| J5 | Security | 🟢 | SDLC-LAYER:93-95 | "Packing buys voices, not votes that count more — the worst a packer achieves is a noisier room the operator was already told to watch." |
| J6 | Beck | 🟡 | quickstart CS-004 | "A green the implementation cannot turn red is not a passing test — it's a decoration." |
| J7 | Beck | 🟢 | INTEGRATION:84-86; spec FR-015 | "This is the rare change that adds a capability without adding a single knob nobody asked for." |
| J8 | Goldratt | 🟢 | INTEGRATION:92-110 | "The deferral is not just respected — it is documented at the seam, so the next spec inherits a clean boundary." |

**Gating 🔴 set: EMPTY.** All 4 lenses independently verdicted "none gating"; Security confirmed the cycle-0 integrity win is preserved (arithmetic-only tally, no weighted/protected vote). No finding proposed above 🟡, so the tally holds each at its author-proposed severity (no vote stage dispatched — proportionate; a stage-3 vote only *moves* severity, and no lens signaled an under-rated gating finding).

### 🟡 incorporation (cheap, clearly-correct fixes Gate C surfaced)
- **J3 `«base-round-reach»`** → spec Clarifications "Session 2026-06-17 (Gate C)": the scaled threshold applies wherever the gate primitive tallies (base round + gates); backward-compat holds only at N=4. Recorded.
- **J6 CS-004 golden** → `quickstart.md` CS-004 now requires a frozen pre-edit golden severity column (so the regression can actually go red).
- **J4 timing vector** → recorded non-gating; mitigated by the FR-012 board-widening side-note (operator-visible). No spec change.

### S1–S9 self-audit (Gate C)
S1 ✅ (personas authored; conductor recorded) · S2 ✅ · S3 ✅ (4 seated, proportionate) · **S4 ✅ — gate clears, no open 🔴** · S5 ✅ (edits trace to spec/contract; the 🟡 spec fix was clarify-style) · S6/I8 ✅ (every finding cites file:line/diff) · S7 ✅ (cleared first cycle) · S8/S9 ✅ (author≠grader; no synthesized vote).

### Decision — Gate C CLEARED
> **DecisionRecord** `gateC-pass` · band 🟢 · sensor: gating 🔴 set empty; spec-walkthrough CLEAN; 9/9 conformance stanzas pass; integrity (Principle III) verified preserved · resolution: **auto-resolve — Gate C passes** · 3 non-gating 🟡 recorded (2 incorporated). N+1 holds final sign-off.

---

## Feature sign-off

**Feature 012-rsvp-exceptional-entry: all gates cleared.** Gate A (design) passed at cycle 2 after the inclusion-first reframe + evidence bar; Gate B skipped per operator; Gate C (implementation) passed clean — the canon edits faithfully implement spec v3, integrity preserved, 9/9 conformance stanzas pass, no stale restatement (FR-016). The "do more" side-note (gating) is deferred to a future spec.

**Artifacts:** spec.md (v3), plan.md, research.md, data-model.md, contracts/canon-edits.md, quickstart.md (CS-001..009), tasks.md, walkthrough-headless.md, this ledger. **Canon changed:** `skill/chorus/{GATE-PRIMITIVE,SDLC-LAYER,SKILL,INTEGRATION-LAYER}.md`. Uncommitted; awaiting operator sign-off to commit.

## Post-Gate-C amendment — Goldratt carve-out replaced — 2026-06-17

Operator-surfaced after Gate C: the round-1 intent ("Goldratt's protection may be replaced by current mechanism") had never been executed — the hard carve-out (`SDLC-LAYER.md` Mandate guardrail + S3: "the scope/deferral lens is never out-seated on a new buildout") still coexisted with the new self-selected exceptional entry, a **mandate** contradicting the feature's "no mandates / value must be articulated" stance, and obsolete now that uncapped exceptional entry removes its root cause (issue #6: the cap forcing the scope lens out).

**Operator decision: execute the replacement (option A).** Edits:
- `SDLC-LAYER.md` Mandate guardrail + S3 — retire the hard "never out-seated" carve-out; the scope/deferral lens now **secures its seat by exceptional entry** (a new buildout always presents an uncovered scope/deferral *cut* delta; it cites that, and being uncapped is never out-seated) — the same evidence-gated path any lens uses.
- `INTEGRATION-LAYER.md` § Side-notes — **new flag-only regime** "new-buildout gate seated without the scope/deferral lens → side-note" carries the issue-#6 safety concern (surface, never auto-seat).
- Spec — Clarifications "post-Gate-C" session; FR-002c (subsumes the carve-out); FR-012(d) (the new regime). Conformance — **CS-010** added.

**Verification:** `grep "never out-seated"` shows no surviving hard mandate (only the exceptional-entry phrasing + the historical note); the new side-note regime present in SDLC-LAYER + INTEGRATION-LAYER; CS-009 still clean. CS-010 passes by construction. A full Gate-C re-run was judged disproportionate for a clean, operator-directed special-case removal (no-ultracode posture); the change unifies must-seat under the feature's two mechanisms (evidence-gated entry + flag-only side-note) and removes a Principle-I special-case.

Net effect: the feature now **also** delivers the round-1 generalization — one evidence-based must-seat mechanism, no bespoke carve-outs.

_SDLC run complete (incl. post-Gate-C carve-out replacement)._


