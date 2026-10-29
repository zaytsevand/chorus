/**
 * The chorus vocabulary, read from schema/vocab.schema.json — the single home
 * of every closed token set. Code imports names from here and never spells a
 * member as a bare literal (test/vocab-lint.test.mjs enforces it).
 *
 *   import { VOTE, VOCAB } from "./vocab.mjs";
 *   VOTE.OVER_RATE        // "OVER-RATE"
 *   VOCAB.vote            // ["PRIORITIZE", "CONFIRM", "OVER-RATE", "NEED_INFO"]
 *
 * Zero dependencies; Node 20+.
 */

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const DEFS = JSON.parse(readFileSync(join(dirname(fileURLToPath(import.meta.url)), "..", "schema", "vocab.schema.json"), "utf8")).$defs;

/** A member's code name: x-names if given, else upper-cased with non-alphanumeric runs as _. */
export const codeName = (member, names = {}) => names[member] ?? member.toUpperCase().replace(/[^A-Z0-9]+/g, "_").replace(/^_|_$/g, "");

/** Every vocabulary as a frozen list, by its $def name. */
export const VOCAB = Object.freeze(Object.fromEntries(Object.entries(DEFS).map(([k, d]) => [k, Object.freeze([...d.enum])])));

const named = (def) => Object.freeze(Object.fromEntries(DEFS[def].enum.map((m) => [codeName(m, DEFS[def]["x-names"]), m])));

export const SEVERITY = named("severity");
export const FINAL_SEVERITY = named("final_severity");
export const SEATING_BAND = named("seating_band");
export const CONFIDENCE = named("confidence");
export const VOTE = named("vote");
export const RSVP = named("rsvp_decision");
export const FAILURE = named("failure");
export const SEAT = named("seat");
export const EVIDENCE_KIND = named("evidence_kind");
export const NEED_INFO_STAGE = named("need_info_stage");
export const SCOPE = named("scope");
export const TALLY_STATUS = named("tally_status");
export const MOVEMENT = named("movement");
export const PORT = named("port");
export const RECOVERY = named("recovery_kind");
export const SIDE_NOTE = named("side_note_regime");
export const REPORT_MODE = named("report_mode");
export const REVIEW_MODE = named("review_mode");
export const REVIEW_QUORUM = named("review_quorum");
export const GATE_QUORUM = named("gate_quorum");
export const CONFLICT_OUTCOME = named("conflict_outcome");
export const HELD_ROUTE = named("held_route");
export const DECISION_STATUS = named("decision_status");
export const DECISION_RESOLUTION = named("decision_resolution");
export const DECISION_EVIDENCE = named("decision_evidence_kind");
export const RULING_STATUS = named("ruling_status");
export const SDLC_MODE = named("sdlc_mode");
export const SDLC_STATUS = named("sdlc_status");
export const GATE = named("gate");
export const RED_DISPOSITION = named("red_disposition");
export const GATE_RESULT = named("gate_result");
export const RECORD_KIND = named("record_kind");
export const RUN_MODE = named("run_mode");
export const PHASE = named("phase");
export const ACTION = named("action");
export const EVENT = named("event");
export const TOPIC = named("answer_topic");
/** exit meaning → process exit code (x-codes), e.g. EXIT.NOT_ASKED === 4. */
export const EXIT = Object.freeze(Object.fromEntries(DEFS.exit.enum.map((m) => [codeName(m), DEFS.exit["x-codes"][m]])));

/** persona → lens, and the optional (language) lenses, from the roster registry. */
export const LENS_OF = Object.freeze({ ...DEFS.roster["x-lens"] });
export const OPTIONAL_LENSES = Object.freeze([...DEFS.roster["x-optional"]]);

/** gate id → gate name, paired by position in the registry. */
export const GATE_NAME_OF = Object.freeze(Object.fromEntries(VOCAB.gate.map((g, i) => [g, VOCAB.gate_name[i]])));

/** Severity ladder, low to high: index arithmetic for one-level moves. */
export const SEVERITY_LADDER = Object.freeze([SEVERITY.GREEN, SEVERITY.YELLOW, SEVERITY.RED]);
