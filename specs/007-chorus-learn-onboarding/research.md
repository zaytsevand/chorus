# Research: `chorus learn` — Interactive Staged Onboarding

**Feature**: 007-chorus-learn-onboarding | **Date**: 2026-06-10 (cycle-3 regen)

R1–R8 are the original plan decisions, revised where Gate A cycles 1–2 falsified them;
R9–R10 were added from cycle 1's defect families (A–N), R11–R12 from cycle 2's
clusters (G1–G27). Ledger: `agent-sdlc-log.md`.

## R1 — Where the mode lives: `LEARN.md` companion, not inline *(unchanged)*

- **Decision**: Author the tutorial as `skill/chorus-review/LEARN.md` — the single
  canonical definition of the learn mode. `SKILL.md` registers it (see R9 for the full
  registration surface).
- **Rationale**: `SKILL.md` is read in full every round; a ~12 KB tutorial inlined there
  taxes every non-learn invocation. The companion-doc pattern is the repo's established
  mode mechanism (`SDLC-LAYER.md`).
- **Alternatives considered**: inline `SKILL.md` section (bloats the hot path); a new
  skill (rejected by the spec's mode-of-one-skill shape).

## R2 — Step set: the spec's five, with declared sub-steps *(revised: vocabulary + sub-step entity)*

- **Decision**: Five **steps** (FR-002) — orient / set up / run a round / agent-SDLC /
  work with results — with **declared sub-steps** inside steps: the **install sub-step**
  (S1, instruct-only) and the **scaffold offer** (S2, dedicated confirm; the sole
  write). "Stage" is reserved for the canon's four-stage review flow; S3 carries the
  one-line disambiguation (FR-012).
  | Step | Teaches | Cites |
  |---|---|---|
  | S1 orient | what the chorus is; the three modes; what's reachable | `skill/chorus-review/SKILL.md` |
  | S2 set up | install; the addendum (sections 2/3/5); the roster | `templates/CHORUS-PROJECT.template.md`, `skill/chorus-review/SKILL.md` (addendum + roster sections), `install.sh` |
  | S3 run a round | "spawn the chorus": RSVP → the four review stages → artifact | `skill/chorus-review/GATE-PRIMITIVE.md`, `skill/chorus-review/SKILL.md` (procedure) |
  | S4 agent-SDLC | gating a speckit feature; block-on-🔴; self-heal | `skill/chorus-review/SDLC-LAYER.md`, `skill/chorus-review/DECISION-PRIMITIVE.md` |
  | S5 work with results | the artifact, baselines, 🟡 override surfaces, next round | `skill/chorus-review/SKILL.md` (artifact), `skill/chorus-review/DECISION-PRIMITIVE.md` (review surfaces) |
- **Rationale**: SC-002 caps the count; declared sub-steps keep conditional paths from
  multiplying steps while making their effects auditable (gate finding F5: an
  undeclared sub-step is an undeclared write surface).
- **Alternatives considered**: a 6th expert step — rejected; the fast exit rides S1's
  exit affordance (R3).

## R3 — Navigation within the AskUserQuestion budget *(revised: families A, B, L)*

- **Decision**: Each step ends with **one navigation question, exactly 4 options**:
  **(a)** advance (recommended, first), **(b)** go deeper — after one deeper pass this
  slot re-presents as **"recap this step"** (depth bounded at one level, no dead
  option), **(c)** jump — fires one follow-up listing the other steps (**at S5: S1–S4,
  no "back" slot**; returning rides the built-in Other), **(d)** exit — delivering the
  FR-011 wrap-up. **At S1 the exit wrap-up IS the expert cheat-sheet** (addendum
  checklist + command list + "any step is one jump away"), so the fast exit costs no
  slot and FR-004 holds universally.
- **Unit definition (SC-003)**: one **navigation action** = one selection on the
  navigation question plus its follow-up if any — **≤2 AskUserQuestion interactions**.
  Any step is reachable from any other in one navigation action. The resume-or-restart
  question on same-conversation re-entry is **outside the unit** (G4 — stated, not
  hidden): SC-003 measures navigation from a presented step.
- **Rationale**: Gate A families A/B (5/5-lens convergence each): the prior design's N5
  substitution violated FR-004's MUST, and "one navigation choice" was satisfied only
  by redefinition. Riding the exit affordance satisfies both MUSTs inside four slots
  (finding F51's resolution); defining the unit makes SC-003 certifiable (F2).
- **Alternatives considered**: an FR-004 exception clause at S1 — workable but weaker
  (an unrecorded exception was the defect; a recorded one still splits the system's
  voice — F1); >4 options (tool budget); multiSelect (navigation is exclusive).

## R4 — Resume: conversation-scoped, transition-updated, disclosed *(revised: families C + F10)*

- **Decision**: ResumeState (last step reached) updates at **every step transition**,
  not only at explicit exit — silent abandonment resumes correctly. Scope is the
  conversation; **the wrap-up discloses it** (step reached + "in a new session, say
  'chorus learn' and jump straight to any step"). SC-007/US2-sc3/FR-010 are qualified
  to the conversation.
- **Rationale**: The scoping was deliberate (no writes for a convenience navigation
  already covers); the gate's finding was **non-disclosure** (F3/F52) and the
  exit-only update (F10). Both fixed at the contract level; zero writes preserved.
- **Alternatives considered**: a state file (violates FR-005 for marginal benefit —
  unchanged from cycle 1).

## R5 — Detection: dual-channel, artefact-grounded, read-only *(revised: family F)*

- **Decision**: S1 probes are read-only and **artefact-grounded**: the mode running is
  itself evidence the skill is reachable, so probes verify what routing actually needs —
  **(1) template availability** at either documented channel (file-path
  `$CLAUDE_HOME/skills/chorus-review/templates/` or the plugin's skill directory,
  resolved from the running skill's own base path), **(2) persona agents present**,
  **(3) project addendum** (`docs/reviews/CHORUS-PROJECT.md`, including its SCAFFOLDED
  marker state — R9), **(4) repo context** (`git rev-parse --is-inside-work-tree`).
  Only a user whose installation genuinely lacks a needed artefact routes to the
  install sub-step, whose cohort is named: someone exploring from a checkout or with a
  partial install. The sub-step **instructs**, never executes, and its remedy text
  **branches by the detected channel** (G18): file-path → clone + `./install.sh`;
  plugin → reinstall/update the plugin so its packaged artefacts deploy. A
  single-channel remedy under dual-channel detection mismatches the plugin user's
  mental model.
- **Rationale**: Family F (3 lenses): probing only `~/.claude/skills/` false-negatives
  the README's plugin channel — the tutorial would tell working users their setup is
  broken. Execute-vs-recite ambiguity (F5/F21) resolved to instruct-only, keeping the
  write surface at exactly one. Cycle 2 (G18) found the *remedy* still single-channel;
  the branch completes the symmetry detection started.
- **Alternatives considered**: asking the user (newcomers don't know); executing
  install.sh on confirm (a second write surface — rejected to keep FR-005's "exactly
  one" simple and auditable).

## R6 — Scaffold source & deployment *(revised: family G mechanics + F47; resolution order pinned, cluster F′)*

- **Decision**: `install.sh` deploys `templates/` into the installed skill dir
  (`$SKILL_DST/templates/CHORUS-PROJECT.template.md`). Scaffold source resolution,
  in order: **(1)** inside this repo, the repo checkout's `templates/` is
  authoritative (source of truth); **(2)** otherwise `<skill-base>/templates/` —
  the running skill's own copy, whichever channel installed it; **(3)** the
  **plugin root's `templates/`** as fallback (the plugin layout roots the skill at
  `skill/chorus-review/` with `templates/` a sibling at the plugin root — G6/G12;
  delivery is R11). The scaffold copies the template with sections 2/3/5 flagged
  `<!-- TO FILL -->`, prepends the **SCAFFOLDED marker** (R9), and the template's
  copy-instructions preamble is **comment-wrapped in the template itself** so the
  scaffolded file reads correctly post-copy (F7).
- **Rationale**: install.sh:36 ships only `skill/chorus-review/*.md` today — FR-007 is
  unimplementable outside this repo without the edit (verified by 3 lenses, F49
  "verifies true"). Repo-first ordering inside this repo fixes the ownership inversion
  (F47). Cycle 2 (G6/G12) showed `<skill-base>/templates/` alone does not exist on the
  plugin channel — the pinned three-step order makes the resolution real on both
  channels instead of asserted.
- **Alternatives considered**: embedding template content in `LEARN.md` (restatement
  that drifts — the exact FR-008 violation); fetching from GitHub (network +
  supply-chain surface); restructuring the plugin to nest `templates/` under the
  skill dir (touches the plugin contract for every consumer; the two-location
  resolution is cheaper and additive).

## R7 — Conformance checks C1–C7 (+C5b) *(revised: families H, I, K; cycle-2 clusters K′, C5-dead-draft, ownership)*

- **Decision**: `quickstart.md` carries the check suite, each check pinned to what it
  actually defends, **owned and triggered**: C1–C7 execute at the **Gate C dogfood and
  before merge**, results recorded in the gate ledger (G9 — an unowned check is
  decorative by default). Two suite-wide disciplines from cycle 2: **no dead or
  vestigial assertions** (every line can fail — G2/G8/G25), and checks parse
  **structural units** (the frontmatter block, tables), never fixed line windows
  (G11).
  - **C1 registration** — "chorus learn" present in `SKILL.md` mode list **and YAML
    frontmatter description** (parsed as the whole `---`-delimited block, not a
    fixed-line `sed` window — G11), README, `install.sh` "Next:"; **staleness
    assert**: scans for **any residual two-mode phrasing** (`Two modes` / `[Bb]oth
    modes`) on the named surfaces — not a single literal (G14 caught "Both modes run
    it" escaping the original pattern).
  - **C2 steps** — the five step headings exist in `LEARN.md`, each followed by a
    `Cites:` line and a navigation-question block.
  - **C3 cite-resolution + cardinality** — every path in every structured **`Cites:`**
    line resolves; scoped to the Cites: notation (no bare-filename regex), so
    non-canon names in prose cannot false-positive. **Cardinality assert (G26)**: the
    check counts `Cites:` lines and **fails on fewer than 5** (one per step) — C2/C3
    can no longer pass vacuously on a LEARN.md with zero cites. Limitation recorded
    honestly: resolution is at **doc granularity**; section renames surface at
    re-read, not in C3 (F23/F37/F45).
  - **C4 no-restatement** — pinned **distinctive delimiters** of the canon's
    load-bearing tables: the tally rule (`net ≥ +2`), the band table
    (`auto-resolve · audit-log`), the decision catalog (`| 1 | RSVP seating`), **and
    the RSVP quorum table (`J ∈ {3, 4}`)** — none may appear in `LEARN.md`.
  - **C5 scaffold deployment (repo + installed side)** — template present in repo;
    `install.sh`'s deploy line matched by the **actual deploy idiom**
    (`^cp .*templates`, not a prose-matching bare grep — G8); installed-side
    assertion via one clean `mktemp` stanza: install into a temp `CLAUDE_HOME`,
    assert the template at `$SKILL_DST/templates/`, remove the temp dir. The cycle-2
    dead stanza (undefined `$CLAUDE_HOME_TMP_CHECK`, redundant install, leaked
    tempdir — G2/G25) is deleted.
  - **C5b plugin-side packaging (new — G6/G12/G16)** — `plugin.json` lists
    `templates/` (or the packaging mechanism demonstrably carries it) **and** every
    persona agent in `agents/` (10/10, not 7/10); asserted by comparing the packaged
    agent list against the `agents/` directory listing.
  - **C6 write surface, self-tested** — mechanical **write-idiom scan** over
    `LEARN.md` (Write/Edit/`cp`/`mkdir`/`tee`/redirection idioms appear only inside
    the scaffold sub-step's accept branch) with **corrected ERE alternation** (the
    cycle-2 scan used `\|` inside an ERE — a literal pipe; its cp/tee/mkdir branches
    could never fire, G7/G13/G23). The scan is **self-tested against known-bad
    fixture lines** containing each idiom: a scan that fails to fire on its fixtures
    fails the suite (the fixture test is what makes SC-008's certification real).
  - **C7 scaffold matrix** — the four paths (accept / decline / existing-target /
    outside-repo) each dogfooded with a recorded expected outcome (write with marker /
    zero writes / review-extend offer, no overwrite / stated unavailability, zero
    writes).
- **Rationale**: Family K: the design's strongest invariants had the weakest checks;
  family H: C3's regex false-positived on conformant content. Cycle 2 then showed the
  *checks themselves* can be the weak link — a dead regex (K′), a dead stanza, a
  vacuous pass, an unowned suite. The remedies are structural: fixture self-tests,
  cardinality floors, structural-unit parsing, named ownership.
- **Alternatives considered**: prose-only review (the drift the spec exists to
  prevent); hash-pinning canon tables (over-brittle; delimiter pinning catches
  restatement without freezing the canon); CI automation of C1–C7 (no CI exists in
  this repo; Gate C + pre-merge ownership reaches the same assurance at zero infra).

## R8 — Sequencing on feature 006 (PR #5, open) *(corrected per F25)*

- **Decision**: 007 lands after 006 merges; merge `main` (with 006) into this branch
  before `/speckit-implement`; author `LEARN.md` against the 006-era canon.
  **Correction**: 006 does *not* deliver a three-mode SKILL.md — its SKILL.md still
  frames two modes (+ the decision primitive). **007 itself performs the two→three
  reframe** (R9), which is why both branches edit the same SKILL.md region and the
  merge order matters.
- **Rationale**: Tutorial steps S3–S5 cite `DECISION-PRIMITIVE.md`, which exists only
  post-006; the conflict surface is the known mode-list region.
- **Alternatives considered**: authoring against pre-006 canon (teaches a stale
  roster of mechanics on arrival — the drift FR-008 prevents).

## R9 — The scaffolded-addendum third state *(new: family G)*

- **Decision**: The scaffold emits a machine-readable marker as the file's first line
  after the title — `<!-- SCAFFOLDED by chorus learn YYYY-MM-DD — sections 2/3/5
  unfilled; a chorus round treats this file as structure, not facts, until the marker
  is removed -->` — and the **registration edit adds a Phase-0 note to SKILL.md**: an
  addendum bearing the SCAFFOLDED marker is **present-but-unfilled** — the orchestrator
  confirms the flagged sections with the operator (one question, as if the addendum
  were absent but pre-structured) instead of consuming placeholder text as project
  facts. The user removes the marker when they fill sections 2/3/5; the tutorial
  wrap-up says exactly that. The **dogfood walkthrough in this repo declines the
  scaffold by default** (accepting changes this repo's Phase-0 behavior — a separate
  operator decision, F61).
- **Rationale**: Family G (Evans F33, 4–0): the round's consumer contract was binary
  (present = read-and-use; absent = ask); the scaffold manufactured an undefined third
  state in which TO-FILL placeholders would enter persona briefs as project facts. The
  marker makes the state explicit and its consumer behavior declared; the two
  addendum-creation paths (S2 scaffold = pre-round structural form; SKILL.md Phase-5
  offer = post-interview distillation) are cross-referenced with the template as the
  single source of structure (F22).
- **Alternatives considered**: scaffolding into a draft path then renaming (two-step
  state the user must remember); teaching "fill before any round" with no mechanical
  signal (vigilance-only — the exact failure family K removes).

## R10 — Runtime cite-failure behavior *(new: family H; pointer coordinates fixed per G1)*

- **Decision**: `LEARN.md` carries a **cite-failure clause** mirroring the scaffold's
  failure honesty: if a cited canon doc is missing/unreadable at runtime (stale or
  partial installation), the tutorial **states that plainly, continues at summary
  altitude, and points to the canonical source resolved via the running skill's base
  path** — repo path when running from the repo checkout, installed/plugin base
  otherwise (the same resolution rule as the template, R6) — and never reconstructs
  canon from memory. This clause covers every CanonicalPointer, not only the template.
- **Rationale**: F8/F56: authoring-time C3 cannot protect a user whose *installed*
  copy is stale; the natural LLM fallback (reconstruct from memory) is precisely the
  silent drift FR-008 exists to prevent. Cycle 2 (G1, 4–0) added: the recovery pointer
  was **repo-relative, but the user who hits it has no repo** — a remedy the affected
  cohort cannot follow. Base-path resolution gives the pointer coordinates that exist
  in the failing user's world.
- **Alternatives considered**: hard-stopping the tutorial on a broken cite (punishes
  the user for a packaging defect); silently skipping the mechanic (silent quality
  drop); always pointing at the GitHub URL (network assumption; the local base path
  is where the fix actually lands).

## R11 — Plugin-channel delivery parity *(new: cluster F′ — G6/G12/G16/G18, FR-015)*

- **Decision**: The plugin channel becomes a **delivery** surface, not just a
  detection target. `plugin.json` is the **named edit surface**: it gains
  **`templates/`** in the packaged file set and the **three missing persona agents**
  (`constraint-and-flow-advisor.md`, `security-and-trust-advisor.md`,
  `guido-python-reviewer.md` — today it ships 7 of 10), and its stale "Seven persona
  advisors" description is refreshed. Scaffold/cite resolution honors the plugin
  layout via R6's pinned order (`<skill-base>/templates/` → plugin root). **C5b**
  asserts the packaging (agent list compared against `agents/`; template path
  present). The S1 probe's remedy text branches per channel (R5).
- **Rationale**: Cycle 2's highest-converged cluster (G6 🔴 4–0, G12 🔴 4–0, G18 🔴
  4–0): detection promised both channels but `install.sh` never runs on the plugin
  channel and `<skill-base>/templates/` does not exist there — the "both install
  channels work" claim was unsubstantiated, and the 7/10 agent gap (G16) becomes
  user-visible the moment S1 probes agents. Packaging the artefacts where the
  channel's own mechanism delivers them is the only fix that doesn't invent a new
  install path.
- **Alternatives considered**: declaring the plugin channel unsupported for the
  scaffold (degrades a documented channel — the exact F44 defect resurfacing);
  having the tutorial fetch the template from GitHub at runtime (network +
  supply-chain surface, rejected at R6); restructuring the plugin to nest templates
  under the skill root (wider blast radius than the additive packaging edit).

## R12 — The navigation contract is the normative surface *(new: cluster G19/G24 + G3/G20/G21/G27)*

- **Decision**: `contracts/navigation.md` **pins, normatively**: the per-slot
  **labels** (S1's exit label signifies the cheat-sheet before selection; S5's
  advance label is **Finish**, with a **declared convergence** — Finish and Exit both
  reach the FR-011 wrap-up, Finish marking completion); the **S2 ordering** (the
  dedicated scaffold confirm precedes S2's navigation question); **per-step depth
  state** (the "Recap this step" re-present fires only on a step whose own deeper
  pass happened — depth state never leaks across steps); and the **S5 jump
  follow-up's disclosure** that free-text input stays at S5. Walkthroughs (e.g.
  quickstart's) are illustrative and must conform to the contract, never the
  reverse.
- **Rationale**: Cycle 2 found the binding surface inverted: the S1 exit signifier
  (G19, 4–0 🔴), the S5 "Finish" label (G27), the S2 confirm ordering (G20), and the
  S5 recap state (G24, 4–0 🔴) were each pinned only by the non-normative walkthrough
  — and the walkthrough itself violated the per-step depth rule it implied. A
  contract that doesn't own labels and ordering lets the implementation inherit
  whatever the example happened to show. The Finish/Exit convergence is declared
  rather than differentiated (G3): at the last step both verbs honestly end the
  tutorial; pretending otherwise manufactures a fake choice.
- **Alternatives considered**: differentiating Finish from Exit behaviorally
  (manufactures consequence where none exists — Cooper's G3 names this a fake
  choice); pinning labels in `LEARN.md` prose only (the walkthrough-drift defect
  again, one document over); dropping the S5 Finish label for plain "Continue"
  (mislabels the terminal transition).
