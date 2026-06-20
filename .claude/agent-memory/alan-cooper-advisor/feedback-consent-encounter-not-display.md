---
name: feedback-consent-encounter-not-display
description: For features submitting LLM-generated content under the user's name, consent requires per-field ENCOUNTER, not just on-screen display; and "unverified" outcomes must never offer a user-facing retry
metadata:
  type: feedback
---

When a feature submits content the user will be held accountable for (job applications under their name, spec 060), a single consent click is fine — but only if the screen guarantees the user *encountered every generated claim*, not merely that it was *displayed*. Display is the developer's mental model (they wrote the fixture, they know what's in it); the user does not.

**Rule 1 — encounter-gate generated content.** LLM-drafted free-text fields must require explicit per-field acknowledgement before Approve unlocks. Deterministic/profile-sourced fields (name, phone) are exempt. This reuses the same block-Approve mechanism the project already accepts for high-stakes fields.

**Rule 2 — the consent verb names the irreversible act.** "Approve" (a 058 journal-entry word) is too soft once it triggers a real submission; use "Submit my application" / "Send to LinkedIn."

**Rule 3 — "unverified" is not "failed."** An outcome meaning "we acted but can't confirm it landed" (spec 060 `submission_unverified`) must NEVER present a user-facing "retry" CTA — retry on a maybe-already-done action causes duplicates. It gets its own honest state ("don't re-submit; we're verifying"); resolution is the operator alarm. This is [[feedback-recovery-not-user-job]] applied: monitoring is the protection layer, not a user retry button. Retry stays only on outcomes where the system KNOWS nothing happened (browser_wedge/throttle/auth/drift).

**Rule 4 — exclusion lists fail safe.** A safelist of "safe to LLM-draft" field kinds must default UNKNOWN kinds to high-stakes (no draft, mandatory confirm), never default-to-draft.

**Why:** spec 060 is the first LinkedInTools feature that writes to the real LinkedIn account and submits LLM content under the user's name. The settled "single Approve" clarification answered the excise question (one click vs two — one is right) but not "what must be true on screen for one click to be honest."

**How to apply:** raise these on any future spec where the product takes an irreversible action under the user's identity, or shows generated content the user will vouch for. See [[feedback-consent-via-auth-gate]] for the orthogonal case (consent bound to auth gate, no runtime consent surface) — that governs *registration-time* consent; this governs *per-action* consent over generated content.
