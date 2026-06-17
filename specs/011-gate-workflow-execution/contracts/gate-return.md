# Contract — Gate Return (the runner↔orchestrator Published Language)

The single interface the runner exposes (FR-008, FR-011, FR-012). It is the **only** thing the runner
produces; the orchestrator persists the ledger from it and from nothing else (Principle X). Modeled on the
canon finding shape by reference — **finding-centric**, not five loose parallel arrays (CF-9: loose arrays
force the orchestrator to re-correlate, which is re-authoring → an S1 leak).

## Shape (JSON Schema, conceptual)

```json
{
  "type": "object",
  "required": ["findings", "gaps", "stageOutcomes", "runId"],
  "additionalProperties": false,
  "properties": {
    "runId": { "type": "string" },
    "findings": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["id","lens","evidence","pull_quote","proposed_severity","votes","tally","band","transcriptHandle"],
        "additionalProperties": false,
        "properties": {
          "id":                { "type": "string" },
          "lens":              { "type": "string" },
          "evidence":          { "type": "string", "minLength": 1 },
          "pull_quote":        { "type": "string" },
          "proposed_severity": { "enum": ["🟢","🟡","🔴"] },
          "votes": {
            "type": "array",
            "items": {
              "type": "object",
              "required": ["voter","ballot","reason","transcriptHandle"],
              "additionalProperties": false,
              "properties": {
                "voter":  { "type": "string" },
                "ballot": { "enum": ["PRIORITIZE","CONFIRM","OVER-RATE"] },
                "reason": { "type": "string" },
                "transcriptHandle": { "$ref": "#/$defs/handle" }
              }
            }
          },
          "tally": {
            "type": "object",
            "required": ["P","O","net"], "additionalProperties": false,
            "properties": { "P": {"type":"integer"}, "O": {"type":"integer"}, "net": {"type":"integer"} }
          },
          "band": { "oneOf": [ { "enum": ["🟢","🟡","🔴"] }, { "type": "null" } ] },
          "transcriptHandle": { "$ref": "#/$defs/handle" }
        }
      }
    },
    "gaps": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["stage","lens","findingId","reason"], "additionalProperties": false,
        "properties": {
          "stage":     { "enum": ["author","vote"] },
          "lens":      { "type": "string" },
          "findingId": { "oneOf": [ { "type": "string" }, { "type": "null" } ] },
          "reason":    { "enum": ["null-isolated","timeout"] }
        }
      }
    },
    "stageOutcomes": {
      "type": "object",
      "required": ["author","vote"], "additionalProperties": false,
      "properties": {
        "author": { "enum": ["ok","stage-timeout","quorum-failed"] },
        "vote":   { "enum": ["ok","stage-timeout","quorum-failed"] }
      }
    }
  },
  "$defs": {
    "handle": {
      "type": "object",
      "required": ["runId","agentLabel"], "additionalProperties": false,
      "properties": { "runId": {"type":"string"}, "agentLabel": {"type":"string"} }
    }
  }
}
```

## Contract invariants (asserted by the conformance suite)

1. **S8** — for every finding, no `votes[].voter == findings[].lens` (FR-003a / SC-002).
2. **Fail-closed** — `band == null` (or absent) is consumed by the orchestrator as **gating**; only an
   explicit `🟢`/`🟡`/`🔴` releases a finding (FR-007 / SC-003).
3. **Tally arithmetic** — `tally.P − tally.O == tally.net`, and `band` equals the canon band for `net`
   under the injected thresholds (FR-004 / SC-001).
4. **Consistency** — orchestrator re-derives `band` from `votes[]` with the **same injected thresholds**
   and asserts equality with the returned `band` (FR-004b / SC-007).
5. **No silent loss** — every dispatched lens that did not return appears in `gaps[]` (FR-006 / SC-004).
6. **Diagnosable** — every finding and vote carries a resolvable `transcriptHandle` (FR-013 / SC-008).
7. **Reconstructable** — every value the rendered ledger shows is byte-traceable to a field here;
   0 orchestrator-authored values beyond formatting (FR-012 / SC-009).

## What is NOT in this contract

No decision **band is acted upon** inside the return — `🔴`/`null` are *data*; the inline orchestrator
performs the block/ask (FR-009, Principle VI/VII). No self-heal trail and no extract output (Slice 2).
