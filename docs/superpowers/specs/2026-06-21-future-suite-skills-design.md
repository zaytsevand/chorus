# Future Suite Skills — design (the three reserved seams)

**Date:** 2026-06-21
**Status:** design proposal (not approved; not built)
**Branch:** 015-suite-followups
**Topic:** Design — not build — the three skills feature 014 reserved as documented
seams in `skill/chorus-core/CONDUCTOR.md` § *Reserved-seam contracts*:
`chorus-viewpoint-extraction`, `chorus-setup`, `chorus-memory-update`.

This is DESIGN. It proposes purpose, extraction surface, composition, trigger,
the core contract each consumes, and the open questions / risks for each — and
applies YAGNI honestly, flagging any of the three that may not be worth building.
It implements nothing.

## Background (what 014 already fixed in place)

Feature 014 decomposed the fat `chorus-review` skill into a suite — `chorus-core`
(substrate) + `chorus-review` + `chorus-sdlc` — and **named three contracts in
core** precisely so these three skills can be peeled out later without editing any
existing sibling (`CONDUCTOR.md:320-361`, the Published-Language seams):

| Future skill | Consumes core contract | Contract location |
|---|---|---|
| `chorus-viewpoint-extraction` | extract-stage record (`file:line`-anchored, `source:`-tagged) | `CONDUCTOR.md:328-341`; mechanic in `GATE-PRIMITIVE.md:25-51` |
| `chorus-setup` | agent-memory layout (`~/.claude/agent-memory/<persona>/`) | `CONDUCTOR.md:343-349`; mechanic in `EXPLORATORY-PHASE.md:82-104` |
| `chorus-memory-update` | two-tier memory model (addendum = base, records cache) | `CONDUCTOR.md:351-361`; mechanic in `EXPLORATORY-PHASE.md:82-148` |

The contracts already record load-bearing reality, so each skill is a *peel*, not
an invention. The hard work of this design is **boundary-drawing against what is
already running**, because two of the three overlap heavily with code that ships
today — and one of them (`chorus-memory-update`) collides almost entirely with the
`chorus-sdlc` memory-update phase (spec 010).

The reserved-seams table itself lives at the suite-decomposition design doc
(`docs/superpowers/specs/2026-06-20-chorus-suite-decomposition-design.md:141-147`)
and the 014 data-model (`specs/014-chorus-suite-decomposition/data-model.md:64-70`).

---

## Skill 1 — `chorus-viewpoint-extraction`

**One-line purpose:** Produce `file:line`-anchored, `source:`-tagged extract
records for a review corpus — the gate primitive's Stage-1 Extract, lifted into a
named, independently-invokable, source-pluggable skill that any gate's Author
stage consumes unchanged.

### What it extracts from the current suite (with pointers)

Three scattered producers of the *same* record shape, today embedded in three
different places:

1. **The base round's Phase-1 Extract pass** — `chorus-review/SKILL.md:300-313`
   ("an optional read-only Extract pass (a bounded `Explore`) may pre-build
   structured `file:line`-anchored records the personas author from").
2. **The gate primitive's Stage-1 Extract** — the canonical mechanic and record
   schema, `GATE-PRIMITIVE.md:25-51`. The `{artifact, location, observation,
   raw_excerpt, candidate_lens, source}` JSON shape at `GATE-PRIMITIVE.md:32-41`
   is the contract this skill emits.
3. **Gate-C `spec-walkthrough` ingestion** — `chorus-sdlc/SKILL.md:227-238` and
   `GATE-PRIMITIVE.md:46-51`: the headless `spec-walkthrough` digest ingested as
   records with `source: "spec-walkthrough"`, plus the *unclaimed-record* logging
   (a DRIFT/SURPRISE no persona claims, `GATE-PRIMITIVE.md:48-51`).
4. **Addendum item-7 anchor-discovery** — `chorus-review/SKILL.md:118-137` (the
   architecture-doc / spec-head-scan / memsearch / spec-slug-grep procedure that
   *finds what to extract from*). This is the **upstream** of extraction: it
   produces the corpus the Extract pass then anchors into records.

The reserved seam, per `CONDUCTOR.md:328-341`, is the **extract-stage record**:
the `file:line` locator + `source:` tag + verbatim material. A viewpoint-extraction
skill "emits records in exactly this shape and they flow into any gate's Stage-1
Extract unchanged."

### How it composes chorus-core

It **owns** the producer side of the extract-stage record contract; core **owns
the consumer side** (the gate primitive's Stage-1, which already accepts records
with any `source:` value). The skill declares `REQUIRED: chorus-core` and reads
`GATE-PRIMITIVE.md` for the record schema it must emit. It adds **no new
invariant** — it sits *before* Stage 2 (Author) and never assigns severity or
authors findings (`GATE-PRIMITIVE.md:45`). The "not authoritative — a persona must
claim a record for it to face the vote" rule (`GATE-PRIMITIVE.md:48-51`) is the
fence that keeps a new viewpoint source from smuggling un-voted findings in.

### Trigger / entry

**Substrate-leaning, but invokable.** Two coherent shapes:

- **(a) Pure substrate**, like `chorus-core`: no operator trigger phrase;
  referenced by name from the base round's Phase-1 and from the SDLC gates'
  Stage-1. This is the cleanest peel and matches how Extract is used today (always
  *inside* a gate, never standalone).
- **(b) Substrate + thin standalone entry** ("extract the viewpoints on
  `<corpus>`" / "run a spec-walkthrough viewpoint over feature 0NN") for the case
  where an operator wants the anchored-record digest *without* a full chorus round
  — a cheap pre-flight before committing to a gate.

**Recommendation:** ship as **substrate first (a)**; add (b) only if an operator
actually asks for standalone extraction. The standalone value is real but
unproven (YAGNI on the trigger, not on the skill).

### Contract consumed from core

The extract-stage record contract (`CONDUCTOR.md:328-341`) — but inverted: this
skill is the **producer** the contract was written *for*. It reads the record
schema (`GATE-PRIMITIVE.md:32-41`) and the "not authoritative / unclaimed record"
discipline (`GATE-PRIMITIVE.md:48-51`). It does not consume the memory contracts.

### Open design questions / risks

- **TOP OPEN QUESTION — is the seam a *skill* or just a *registry of sources*?**
  Today there are exactly two sources (`explore`, `spec-walkthrough`). The seam's
  whole value is *pluggability* — letting a third viewpoint source (a custom
  linter, an AsyncAPI diff, a prior-chorus-baseline reader) emit records under a
  new `source:` tag. If no third source is on the horizon, this skill is
  extraction-of-extraction with no new capability — it relocates `GATE-PRIMITIVE.md`
  Stage-1 prose into its own dir and buys nothing. **The skill earns its keep only
  if/when a third viewpoint source is wanted; until then it is a rename.**
- **Anchor-discovery is project-specific (`SKILL.md:118-137`) but the record shape
  is universal.** Pulling anchor-discovery *into* this skill drags project-addendum
  coupling across the boundary; leaving it in `chorus-review` splits the
  find-corpus/extract-records pipeline across two homes. Decide whether
  anchor-discovery stays addendum-driven config (preferred) or migrates.
- **`spec-walkthrough` is an installed sibling skill, not core.** A
  viewpoint-extraction skill that ingests it (`chorus-sdlc/SKILL.md:229-232`) takes
  a dependency on a skill outside the suite — fine, but it widens the trust surface;
  the "not authoritative" fence (`GATE-PRIMITIVE.md:48`) must travel with it.

---

## Skill 2 — `chorus-setup`

**One-line purpose:** Bootstrap the per-persona agent-memory layout
(`~/.claude/agent-memory/<persona>/`) after the suite is installed, so the first
chorus round on a fresh machine reads a real (if empty-but-valid) memory tree
instead of cold-starting it implicitly.

### What it extracts from the current suite (with pointers)

There is **no extraction of behavior** here — there is no setup code today. What it
formalizes is a *convention* currently assumed, not bootstrapped:

1. **The agent-memory layout convention** — `CONDUCTOR.md:343-349` (the named
   contract) and the mechanic `EXPLORATORY-PHASE.md:89-91` (`~/.claude/agent-memory/<persona>/`,
   "references, inferences, gaps, and cached project-wide facts").
2. **The Phase-1 memory-recovery assumption** — `chorus-review/SKILL.md:389-393`
   ("some personas… write their actual report to `.claude/agent-memory/<persona-name>/`…
   check that path and `Read` any new memory files"). Today the round *discovers*
   this dir opportunistically; nothing creates or validates it.
3. **Install seam** — `2026-06-20-chorus-suite-decomposition-design.md:175-178`
   notes persona agents install to `~/.claude/agents/` (outside any skill dir) and
   that `install.sh` loops over `skill/*/`. `chorus-setup` is the natural home for
   "and also seed the agent-memory tree for each installed persona."

### How it composes chorus-core

It reads the **agent-memory layout contract** (`CONDUCTOR.md:343-349`) and the
**two-tier memory model** (`CONDUCTOR.md:351-361`) to know *what* a valid empty
tree looks like (per-persona record dir; the addendum's "Project understanding"
section as the authoritative base). It writes nothing core owns at runtime — it
operates once, at install/first-run, creating the scaffold the read-side
(`EXPLORATORY-PHASE.md`) and the write-side (`chorus-sdlc` memory-update; a future
`chorus-memory-update`) both assume.

### Trigger / entry

**One-shot operator command**, not substrate: "set up the chorus" / "bootstrap
chorus memory" / run automatically as the tail of `install.sh`. It is the only one
of the three with a clear, finite, operator-facing job that runs *zero times per
round*.

### Contract consumed from core

The agent-memory layout (`CONDUCTOR.md:343-349`) and, read-only, the two-tier
model (`CONDUCTOR.md:351-361`) — it needs to know the addendum is the base so it
can scaffold/point at `docs/reviews/CHORUS-PROJECT.md`'s "Project understanding"
section (`EXPLORATORY-PHASE.md:83-87`) and the per-persona record dirs.

### Open design questions / risks

- **TOP OPEN QUESTION — does anything actually break without a bootstrap step?**
  The read-side already tolerates absence: Phase-1 memory-recovery *checks* for new
  files (`SKILL.md:389-393`); the exploratory phase treats a missing prior record
  as "no reuse, harvest fresh" (`EXPLORATORY-PHASE.md:46-50`); the
  fitness-function explicitly "runs against the records a round produces… not an
  empty tree" (`EXPLORATORY-PHASE.md:227-231,240-244`). So the system is **designed
  to cold-start gracefully** — which means `chorus-setup` may be solving a
  non-problem. Its honest value is narrow: (i) seeding the addendum *template* so
  the first round doesn't interview from scratch, and (ii) validating the install
  (a `ctx-doctor`-style check that persona dirs and the addendum are reachable).
  Both are real but small.
- **Overlap with `install.sh`.** If install already loops `skill/*/` and copies
  persona agents, "scaffold the memory tree" is ~10 lines of install script, not a
  skill. A *skill* is justified only if bootstrap needs persona-driven content
  (e.g. each persona writes its own initial baseline) — otherwise it is install
  plumbing wearing a skill costume.
- **Cross-project memory pollution.** `~/.claude/agent-memory/<persona>/` is
  **global, not per-project** (`EXPLORATORY-PHASE.md:89-91`), while the addendum is
  per-project. A naive bootstrap that wipes/recreates the global dir would clobber
  another project's cached facts. Setup must be additive and project-aware at the
  record level (the per-project split is `EXPLORATORY-PHASE.md:90-91`,
  "project-scoped part and feature/spec deltas").

---

## Skill 3 — `chorus-memory-update`

**One-line purpose:** Maintain the personas' two-tier memory between and after
rounds — the gate-upkeep + write-back loop — so each lens's persisted understanding
stays current, deduplicated, and reconciled against the authoritative addendum.

### What it extracts from the current suite (with pointers)

This is where the design gets hard, because the write-side **already exists in two
places** and this skill would be a *third* home for substantially the same work:

1. **The reserved seam** — `EXPLORATORY-PHASE.md` § *Gate upkeep* (the memory
   procedure), `EXPLORATORY-PHASE.md:149-182`: promote / refresh / retire /
   graduate of `[gate]` entries and standing answers, at round close, per seated
   advisor.
2. **The two-tier write-back + staleness/reconciliation mechanic** —
   `EXPLORATORY-PHASE.md:82-148` (two-tier memory; memory-is-an-index; staleness &
   reconciliation; content-digest fingerprint).
3. **THE COLLISION — the `chorus-sdlc` memory-update phase (spec 010)** —
   `chorus-sdlc/SKILL.md:240-291`. This is a fully-specified, shipped write-side:
   dispatch-never-synthesize (S1/S9), durable-only (010 FR-003a), secret pre-filter
   first (010 FR-007, two-part detector), scope routing banded by the decision
   primitive, bounded re-offer (010 FR-006, N=3 lapse), no-op recorded (010 FR-009).
   The read-side itself names this as its "write-side bookend"
   (`EXPLORATORY-PHASE.md:268-272`).
4. **The findings→memory deferred callback contract** — `CONDUCTOR.md:363-418`:
   the consuming contract a future findings→memory callback reads (findings-artifact
   shape `CONDUCTOR.md:369-383`; agent-memory write targets `CONDUCTOR.md:385-391`;
   secret pre-filter as hard precondition `CONDUCTOR.md:393-418`). This is the
   *other* write-path into memory — from a chorus round's findings register rather
   than from a persona's own learning.

### How it composes chorus-core

It reads the two-tier memory contract (`CONDUCTOR.md:351-361`), the gate-upkeep
mechanic (`EXPLORATORY-PHASE.md:149-182`), the staleness/reconciliation rules
(`EXPLORATORY-PHASE.md:118-147`), and — if it absorbs the findings→memory callback
— the deferred-callback contract with its **hard secret-pre-filter precondition**
(`CONDUCTOR.md:393-418`, deny-default, two-part detector, audit-every-drop). It
adds no invariant; it *implements* the write half of contracts core already owns.

### Trigger / entry

Three candidate shapes, and the choice is the whole design:

- **(a) Operator command** — "update chorus memory" / "reconcile the lenses": a
  standalone maintenance pass an operator runs between rounds.
- **(b) Round-close callback** — fires automatically at the end of a
  `chorus-review` round (the base round has **no** memory write-back today; only
  `chorus-sdlc` does, `EXPLORATORY-PHASE.md:268-272`), closing the read/write loop
  for the review mode the way 010 closes it for the SDLC mode.
- **(c) Substrate** — a shared write-back library both `chorus-review` and
  `chorus-sdlc` call, with `chorus-sdlc`'s spec-010 phase **re-expressed as a thin
  caller** of it.

### Contract consumed from core

The two-tier memory model (`CONDUCTOR.md:351-361`), the agent-memory layout
(`CONDUCTOR.md:343-349`), and the findings→memory deferred-callback contract
(`CONDUCTOR.md:363-418`) including its FR-010a secret-pre-filter precondition.

### Open design questions / risks

- **TOP OPEN QUESTION — `chorus-memory-update` vs the existing 010 memory-update
  phase: is one absorbed into the other, and does extracting this skill REGRESS
  010?** The two overlap almost entirely. Three resolutions, with my read:
  - **(i) Absorb 010 into the skill (extract-and-refactor).** Make
    `chorus-memory-update` the *single* write-side substrate; rewrite
    `chorus-sdlc/SKILL.md:240-291` to *call* it. **Pro:** kills duplication, gives
    the base round a write-back for free (option (b) above). **Con / REGRESSION
    RISK:** 010 is not generic write-back — it carries SDLC-specific bindings
    (fires *once after Gate C clears*, never per-gate / per-self-heal / on abort,
    `chorus-sdlc/SKILL.md:247-248`; ledger-audited under `## Memory update
    (sign-off)`, `chorus-sdlc/SKILL.md:290`, `chorus-sdlc/SKILL.md:335-338`; S1/S9
    self-audit, `chorus-sdlc/SKILL.md:291`). Naively absorbing it would strip the
    lifecycle anchoring and the ledger audit — a real 010 regression. The skill
    would have to expose those as *caller-supplied policy* (when-to-fire, where-to-
    audit), keeping 010's bindings in `chorus-sdlc` while the *mechanic* (dispatch-
    never-synthesize, durable-only, secret-filter, scope routing) moves down.
  - **(ii) Leave 010 alone; build the skill only for the base-round + standalone
    case.** Two write-sides coexist — the duplication 014 exists to kill returns,
    invisibly (the same anti-drift lineage risk 014 called out for `I1–I9`,
    `2026-06-20…design.md:76-86`). **Rejected** for the same reason 014 moved the
    catalog to core: shared mechanic must have one home.
  - **(iii) Don't build a separate skill; fold the *contract* into core and let
    each mode keep its own thin write-back.** YAGNI answer: the two-tier model and
    gate-upkeep mechanic are *already* in core (`EXPLORATORY-PHASE.md`); 010 is the
    SDLC caller. If the base round wants write-back, add a ~30-line base-round
    bookend that reuses the same `EXPLORATORY-PHASE.md` contract (exactly how 010
    describes itself, `chorus-sdlc/SKILL.md:250-251` "invents no new write path").
    No third skill needed.
  - **My recommendation:** resolution **(i) restricted to the shared *mechanic***
    (move dispatch/durable/secret-filter/scope-routing into a core-resident
    write-back primitive that 010 *and* a base-round bookend both call) — which is
    closer to **(iii)** than to a standalone skill. The standalone *skill* shape
    (a) is the weakest case: maintenance-between-rounds is already covered by
    per-round gate-upkeep at round close (`EXPLORATORY-PHASE.md:164`).
- **Secret-pre-filter is a hard precondition, not a feature.** Any write-side that
  ships must carry FR-010a (deny-default, two-part detector, audit-every-drop,
  `CONDUCTOR.md:393-418`; `chorus-sdlc/SKILL.md:263-272`). A new skill that writes
  memory without it is a contract violation (SC-006 negative case,
  `CONDUCTOR.md:416-418`). This is the single biggest correctness risk in
  extraction — the filter must travel with the mechanic, not be re-implemented.
- **No runtime.** The fingerprint/staleness check is "the advisor re-reading the
  cited span" (`EXPLORATORY-PHASE.md:139-147`), and the secret filter is
  "persona-applied discipline made verifiable by the ledger drop-record, not a
  mechanical runtime pass" (`chorus-sdlc/SKILL.md:271-272`). A `chorus-memory-update`
  skill cannot become a "real" mechanical maintainer without a runtime the suite
  deliberately does not have — so it stays dispatch-and-audit, same as 010.

---

## YAGNI verdict (honest)

| Skill | Build now? | Verdict |
|---|---|---|
| `chorus-viewpoint-extraction` | **No, not yet** | The seam (record contract) is already in core and already honored. The *skill* buys nothing until a **third viewpoint source** is wanted. Keep the reserved seam; build the skill when a concrete third source lands. The standalone-trigger value is unproven. |
| `chorus-setup` | **Probably not as a skill** | The read-side cold-starts gracefully by design (`EXPLORATORY-PHASE.md:46-50,227-244`). Real value (template seeding + install validation) is ~10 lines of `install.sh` + a `ctx-doctor`-style check — install plumbing, not a skill. Promote to a skill only if bootstrap needs persona-driven content. |
| `chorus-memory-update` | **No — refactor, don't build** | Collides with shipped 010. The right move is to **lift the shared write-back mechanic into a core-resident primitive** that 010 and an optional base-round bookend both call — not a standalone maintenance skill. A separate skill risks regressing 010's lifecycle anchoring + ledger audit, and standalone maintenance is already covered by per-round gate-upkeep. |

**Net:** all three reserved seams were correctly *reserved* (cheap insurance,
endorsed by the 014 architecture review, `2026-06-20…design.md:213-214`). On
honest YAGNI, **none of the three is worth building as a standalone skill today.**
The two that have real residual value (`chorus-setup`'s install-validation;
`chorus-memory-update`'s base-round write-back) are better served by small,
in-place additions than by new skill dirs. The seams stay reserved; this design
records *why the build is deferred and what concrete trigger would un-defer each.*

## Un-defer triggers (what makes each worth building)

- **`chorus-viewpoint-extraction`** — a concrete third `source:` (custom
  analyzer / contract-diff / baseline reader) someone actually wants to plug in.
- **`chorus-setup`** — a bootstrap step that requires *persona-authored* initial
  content (not just empty dirs), or an install-validation surface that outgrows a
  script.
- **`chorus-memory-update`** — a decision to give `chorus-review` (base round) a
  write-back loop, which forces the shared write-back primitive out of `chorus-sdlc`
  and into core; the skill (or the primitive) crystallizes at that point.

## Out of scope

- Implementing any of the three skills, or the findings→memory callback wiring
  (still deferred per 014 FR-011, `CONDUCTOR.md:363-367`).
- Changing the reserved-seam contracts in `chorus-core/CONDUCTOR.md`.
- Any persona-agent content or roster change.
- Refactoring 010's memory-update phase (this doc only *recommends* the refactor
  shape; a separate feature would execute it).

## References

- `skill/chorus-core/CONDUCTOR.md:320-418` — the three reserved-seam contracts +
  findings→memory deferred-callback contract.
- `skill/chorus-core/EXPLORATORY-PHASE.md:82-182,268-272` — two-tier memory,
  gate-upkeep, staleness, and the write-side bookend pointer.
- `skill/chorus-core/GATE-PRIMITIVE.md:25-51` — Stage-1 Extract record schema.
- `skill/chorus-sdlc/SKILL.md:227-291` — Gate-C `spec-walkthrough` ingestion + the
  spec-010 memory-update phase (the collision).
- `skill/chorus-review/SKILL.md:118-137,300-313,389-393` — anchor-discovery,
  Phase-1 Extract, memory-recovery.
- `docs/superpowers/specs/2026-06-20-chorus-suite-decomposition-design.md:141-147,213-214`
  — the reserved-seams table + architecture-review endorsement.
</content>
</invoke>
