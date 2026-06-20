# Contract — findings → memory (designed seam; impl deferred)

## What this feature builds

1. **`CHORUS-PROJECT.md` (+ template) gains a findings→memory section** by which a
   project declares:
   - **targets** — where findings flow (e.g. `~/.claude/agent-memory/<persona>/`
     records, project memory, the addendum's "Project understanding" section);
   - **policy** — scope routing (`lens-specific` → auto; `project-wide` →
     operator-accepted), the durable-only rule (locator + ≤~2-sentence hint), and
     the secret pre-filter requirement.
2. **`chorus-core` documents the consuming contract**:
   - **findings-artifact shape** — the register row schema (ID, advisor·lens,
     severity, target locator, verbatim pull-quote, tag).
   - **agent-memory layout** — the two-tier model (addendum = authoritative base;
     `<persona>/` records cache it; memory is an index, never the endpoint).

## Secret pre-filter — enforced obligation (Gate A F1/F2/F3, 🔴)

The contract commits a write surface (verbatim pull-quotes → durable
`~/.claude/agent-memory/` + `CHORUS-PROJECT.md`). Its guard MUST therefore be a
**behavioral obligation, not a noun**:

- **Deny-default**: an excerpt is dropped unless it passes the filter.
- **Named detector class**: credential-shaped/high-entropy tokens, known key
  prefixes, `.env`/secret-file path captures, AND structured private facts
  (internal hostnames, personal/customer names, ticket IDs).
- **Audit line**: every drop is recorded (visible, not silent), on both the
  `project-wide` proposal path and the auto `lens-specific` write path.
- **Sole-reach fence (F13)**: the future callback reaches only the documented
  findings-artifact shape — never `chorus-core` file internals.
- **Hard precondition**: the deferred-callback spec carries "implements this secret
  pre-filter (FR-010a)" as a gate; it cannot ship conforming-but-unfiltered.

This reuses the existing `SDLC-LAYER.md` memory-update secret pre-filter language;
this contract names it as the obligation the deferred callback inherits.

## What this feature does NOT build (FR-011 / FR-019)

- The callback/hook **wiring** that fires to incorporate findings into memory.
- Any automated execution of that callback.

The contract is written so a later spec can implement the callback against a stable
shape without revisiting core. The callback is explicitly redesignable later.

## Acceptance

- A project can fill the findings→memory section with targets/policy and zero
  callback code exists in the feature (SC-006).
- `chorus-core` documents both the findings-artifact shape and the agent-memory
  layout (FR-010).
