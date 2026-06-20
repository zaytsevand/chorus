---
name: project-spec011-gatea-selfheal-cf3cf4
description: chorus-review feature 011 Gate-A self-heal re-verify cycle 1 — CF-3 (fail-closed) and CF-4 (self-heal artefact-laundering) both CLEAR after rev 2
metadata:
  type: project
---

Feature 011 (gate-workflow-execution) Gate A self-heal re-verification, cycle 1, rev-2 spec (Status "Draft rev 2 — Gate A 🔴 incorporated"). Two prior 🔴 I raised, both now CLEAR.

**CF-3 fail-closed — CLEARED.** FR-007 (spec.md:176-178) states the invariant in correct polarity: release requires an explicit non-🔴 token; `null`/absent/missing all default to GATING. US3 (spec.md:116-123) traces the failure path (errored vote agent → null band → returned gating). SC-003 (spec.md:233-234) encodes it as falsifiable test (0 released without explicit non-🔴). FR-008 finding-centric return removes the re-correlation seam that could manufacture silent absence. Bedrock: absence-of-clear is never a clear.

**CF-4 self-heal artefact-laundering — CLEARED by correct deferral.** Self-heal deferred to Slice 2. Integrity requirement recorded as binding MUST in 3 places (spec.md:80 summary, :200-206 deferred-obligations, :252-253 out-of-scope). All 3 sub-clauses present: per-cycle artefact diff/hash in trail, tell re-verifier what changed, incorporating agent casts no vote in its own cycle (S8-across-cycles). Deferral SAFE because no Slice-1 actor mutates artefacts: FR-011 (runner + dispatched agents write nothing; spec.md:188-189) corroborated by spec.md:44-45, :137-138, :212. Self-heal capability simply absent from Slice 1.

**Carry-forward (non-blocking) for Slice-2 author:** the CF-4 diff/hash obligation lives in PROSE, not CI — nothing fails red if forgotten when Slice 2 is specced. Must become an FR-004a-style conformance fixture (trail lacking per-cycle diff/hash fails CI) or it lapses like any unmaintained control. This is the README-not-CI pattern.

**New trust-boundary scan of revisions:** FR-004b re-derive check (spec.md:163-165) NARROWS trust (validates runner arithmetic against its own data; distinct from forbidden re-tally) — closes a seam. FR-013 transcript handle (spec.md:193-194) is a new data surface (dereferences to unredacted agent I/O) but INERT at single-operator scale (spec.md:30); becomes an authorization boundary only if chorus grows past one principal. No gating NEW-ISSUE.

**Why:** verification cycle, not fresh review — checking whether controls close by construction vs prose intent.
**How to apply:** if 011 self-heal (Slice 2) gets specced later, the load-bearing check is whether the CF-4 diff/hash clause made it into CI, not just into FRs.
