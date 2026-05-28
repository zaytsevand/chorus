# Chorus-review groundwork principles

The chorus is a procedure for surfacing trade-offs. It is not itself a
substitute for the engineering principles a project anchors trade-offs
against. This file names the three principles the public chorus-review
templates assume as default groundwork. Projects with their own
constitution (a numbered, codified set of principles) should keep using it
and map their clauses to these names in `docs/reviews/CHORUS-PROJECT.md`;
projects without one inherit these as the floor.

The three are not original to chorus-review. They are widely-held
engineering principles, named here so persona agents can reference them
without each project re-naming the same idea.

---

## P1 — API-First

**The interface is the contract.** Every cross-component interaction is
specified before it is implemented. For HTTP, that means an OpenAPI 3.1
spec; for async, AsyncAPI 3.x; for in-process module boundaries, a typed
signature with explicit pre- and post-conditions. The spec is the source of
truth; generated artefacts (client SDKs, server stubs, fixtures) are not
hand-edited.

**Why the chorus cares.** Without an interface spec, every persona — Evans
on bounded contexts, Richards on architectural characteristics, Uncle Bob
on dependency direction, Cooper on who-actually-uses-this — has to
reverse-engineer the contract from implementations. The reviews become
about code, not about the system. With a spec, the reviews can be about the
system's intent and where the implementation diverges from it.

**How a persona applies it.** When a finding touches a new endpoint, a new
message type, or a new module boundary, the persona asks: *where is the
spec?* If no spec exists, that absence IS the finding (tag
`[principle:P1]`), not a stylistic comment.

---

## P2 — No Side-Effects

**A function does exactly what its name says — no more, no less.** Hidden
chaining (the "save" method that also enqueues a webhook that also writes
an audit log that also rotates a token) is a smell. State-changing
operations are explicit and visible at the call site. Pure functions stay
pure; impure functions advertise it.

**Why the chorus cares.** Side-effects compound silently. Evans reviews a
domain entity and finds an aggregate; Richards reviews the same code and
finds an event publisher; Uncle Bob finds an SRP violation; none of them
saw the same code. The chorus surfaces this by giving each lens an
independent read on the same artefact.

**How a persona applies it.** When a finding describes "X also does Y,"
the persona names the hidden Y as the finding, not the named X. The
recommended remediation is to split the function or rename it so the name
matches the behaviour. Uncle Bob's lens is the loudest carrier of this
principle, but every lens contributes evidence.

---

## P3 — Test-First (TDD)

**A failing test exists in the same commit as the production code that
makes it pass.** Tests are not added afterwards. The act of writing the
test first is what disciplines the design — it forces the unit under test
to be reachable, isolable, and named for what it does (which is also how
P2 gets enforced).

**Why the chorus cares.** Kent Beck's lens is the natural carrier here,
but the principle is project-wide: a feature without a test is a feature
without a behavioural assertion the next chorus can use as an anchor. The
chorus's evidence rule (`file:line` or `[principle]` tag) collapses
without behavioural assertions — they are the cheapest invariants to
follow the "why-why-why" chain to.

**How a persona applies it.** When a finding describes a behaviour, the
persona checks whether a test asserts that behaviour. If not, the missing
test is part of the finding, not a separate nit. Severity scales with how
load-bearing the un-asserted behaviour is, not with whether tests are
"nice to have."

---

## How projects extend this

Projects with stronger or more-specific principles (layer rules, language
mandates, infrastructure constraints) document them in
`docs/reviews/CHORUS-PROJECT.md` under item 4 (Constitutional / governance
principles). Phase 4 ranking ("Constitutional ROI") consumes that list.
P1–P3 are the floor; project-specific clauses sit on top.

Persona agents reference principles by tag — `[principle:P1]`,
`[principle:P2]`, `[principle:P3]`, or `[principle:<project-tag>]`. The
tag identifies what the persona is invoking; the cite (file path, clause
number, prior chorus finding) tells the reader where it is grounded.

---

## What this file is not

- **Not a CONTRIBUTING.md replacement.** The principles describe what the
  chorus looks for, not how to contribute to the chorus-review repo
  itself. See [`../CONTRIBUTING.md`](../CONTRIBUTING.md) for that.
- **Not a project constitution.** Projects with codified governance keep
  it. This file gives the chorus a floor to stand on when no such
  document exists.
- **Not exhaustive.** P1–P3 are load-bearing for the persona lenses on
  the default roster. Domain-specific principles (security, regulatory,
  performance budgets, accessibility) belong in the project addendum or
  the security addendum, not here.
