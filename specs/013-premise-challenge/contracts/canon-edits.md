# Contract — canon edit surface (Phase 1)

The exact, minimal edits to the chorus canon. Each row: **file → insertion point → content → cited mechanic**. `GATE-PRIMITIVE.md` and `DECISION-PRIMITIVE.md` are **byte-unchanged** (reused by citation). This is the contract Gate B reviews and `/speckit-implement` executes.

> Line targets are against the worktree canon at `skill/chorus/` as of 2026-06-18; the implementer re-confirms exact lines (Principle V — re-ground before editing).

---

## E1 — `SDLC-LAYER.md` · new subsection (the canonical home)

**Insertion point**: after `### Exploratory phase (per gate)` (ends ~line 143), before `### Block on 🔴 — via the self-heal loop` (~line 144).

**New subsection: `### Gate A — premise pass (runs first)`** containing:

1. **The brief.** Before Gate A's within-frame Author stage, the seated panel is briefed to attack the **premise** (problem / necessity-now / framing / load-bearing assumptions) and to **steelman the null or a named alternative** (cite `chorus-and-repo-stats-v2.md` §4d as motivation). Each premise finding carries ≥1 of: steelman-for-not-building / reframe / root-cause doubt / named unvalidated assumption + cheapest test (FR-003).
2. **Scope tag in the vote** (FR-004). A finding carries `scope ∈ {premise, within-frame}`, **author-declared and vote-confirmed** under `GATE-PRIMITIVE.md` S8/S9 — *cite, do not restate the vote mechanic*. A `within-frame` finding is **parked** for the within-frame review; it does not count as premise divergence. No regex/stanza classifies scope.
3. **The fixed red-team checklist** RT-1..RT-6 (verbatim from `data-model.md`) — applied every pass, each outcome recorded; the §4d out-of-distribution floor (FR-005).
4. **Honest-null** (FR-006). On survival, record each attempted attack (lens + steelman/reframe/doubt) + RT outcomes. A pass with no genuine attack is a **failed pass, re-run, bounded N=3 then escalate** (cite `Loop bound`/S7 — do not restate); a bare `sound` fails.
5. **Outcome = existing tally** (FR-007). The premise outcome is `GATE-PRIMITIVE.md` Stage 4 over premise-tagged findings; a premise 🔴 is a **premise-level block**, operator-owned & self-unblocking (`DECISION-PRIMITIVE.md`). **No new verdict, no severity→band mapping, no new doc.**

**Cited (not restated)**: `GATE-PRIMITIVE.md` (Stage 4 tally, S8/S9); `DECISION-PRIMITIVE.md` (🔴 self-unblocking); `SDLC-LAYER.md` Loop bound/S7 (the N=3 re-run bound).

## E2 — `SDLC-LAYER.md` · `## The ledger` ordering note

**Insertion point**: within `## The ledger` (~lines 284–300), append one sentence to the schema description.

**Content**: at Gate A the ledger records, in order, the **premise pass** (RSVP, premise-tagged findings, RT-1..RT-6 outcomes, tally, honest-null), then within-frame findings, then parked-from-premise findings — reconstructable end-to-end (FR-010). Reuses the existing register/tally schema; **no schema change**.

## E3 — `SDLC-LAYER.md` · expected-attendance line (optional, low-risk)

**Insertion point**: the "Expected … attendance" paragraph (~lines 120–123).

**Content**: note that Gate A's expected panel runs the **premise pass first**. One clause; no mechanic change. *(Implementer may fold this into E1 if cleaner.)*

## E4 — `SKILL.md` · register the `challenge` mode

**Insertion point (body)**: `## Three modes` (line 42) → becomes **four modes**; add a bullet:

> - **`chorus challenge`** (premise pass, standalone) — invokes Gate A's premise-pass brief on any target (spec / note / raw premise) outside a full gate, to grill a premise early. Trigger: "chorus challenge `<target>`". Same brief, tagging, red-team checklist, and honest-null — **defined once in `SDLC-LAYER.md` § Gate A — premise pass; cited here, not restated** (Principle I). Output: a durable premise artifact (no feature directory required).

Also add it to `## When to use` and note it is **built on the same gate primitive** as the two review modes.

**Insertion point (frontmatter)**: line 3 `description:` — append a clause: *"…and a `chorus challenge` mode (trigger: 'chorus challenge `<target>`') that runs Gate A's premise pass standalone — see SDLC-LAYER.md."*

**Cited (not restated)**: the brief/checklist/honest-null live in `SDLC-LAYER.md` (E1); `SKILL.md` only registers + points.

## E5 — deployment surfaces (Authoring Constraints)

- **`README.md`**: add `chorus challenge` to the mode list (one line, mirrors SKILL).
- **`install.sh`**: ensure the new mode is discoverable on every cold-start surface (no new file to copy — edits land in existing canon; verify the installer copies the edited `SDLC-LAYER.md`/`SKILL.md`, which it already does).

---

## Non-edits (asserted, conformance-checked)

- `GATE-PRIMITIVE.md` — **byte-unchanged** (SC-008). The tally and S8/S9 are cited, never restated.
- `DECISION-PRIMITIVE.md` — **byte-unchanged**. The 🔴 self-unblocking band is cited.
- Gates B and C in `SDLC-LAYER.md` — **byte-unchanged** (SC-008).
- No new canon file (SC-005). No persona/agent file changes.
