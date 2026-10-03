// src/lib/case-status.ts
//
// "Closed" means a case was worked through all six phases and recorded.
// It says nothing about outcome, so status is always shown with the
// outcome beside it: "Closed · escalated", never a bare "Closed".
// The outcome is the Phase 5 path (what happened); when that is missing,
// the Phase 4 decision (what was chosen) stands in.

import type { ActPath, TriageCase, TriageDecision } from "@/types/triage";

const PATH_OUTCOME: Record<ActPath, string> = {
  runbook: "resolved",
  novel: "investigated",
  incident_lead: "incident led",
  escalation: "escalated",
};

const DECISION_OUTCOME: Record<TriageDecision, string> = {
  declare_incident: "incident declared",
  resolve: "resolved",
  investigate: "investigated",
  escalate: "escalated",
  request_info: "paused for information",
};

export function caseOutcome(c: TriageCase): string | null {
  const path = c.act?.path as ActPath | undefined;
  if (path && PATH_OUTCOME[path]) return PATH_OUTCOME[path];
  const decision = c.triage?.decision as TriageDecision | undefined;
  if (decision && DECISION_OUTCOME[decision]) return DECISION_OUTCOME[decision];
  return null;
}

export function caseStatusLabel(c: TriageCase): string {
  if (c.status !== "closed") return "In progress";
  const outcome = caseOutcome(c);
  return outcome ? `Closed · ${outcome}` : "Closed";
}
