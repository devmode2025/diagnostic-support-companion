// src/types/triage.ts

export type PhaseId =
  | "receive"
  | "parse"
  | "classify"
  | "contextualize"
  | "triage"
  | "act"
  | "record";

export type PromptType =
  | "text"
  | "textarea"
  | "boolean"
  | "datetime"
  | "select";

export type PromptOption = {
  value: string;
  label: string;
};

export type PromptDefinition = {
  id: string;
  label: string;
  type: PromptType;
  required: boolean;
  help?: string;
  source?: "categories" | "severity";
  options?: PromptOption[];
};

export type PhaseDefinition = {
  id: PhaseId;
  number: number;
  name: string;
  purpose: string;
  prompts: PromptDefinition[];
  mindset: string[];
  antiPatterns: string[];
  output: string;
};

export type FieldValue = string | boolean | undefined;

export type PhaseData = Record<string, FieldValue>;

export type TimelineEntry = {
  at: string;
  phase: number | "gate";
  note: string;
};

export type TriageDecision =
  | "resolve"
  | "escalate"
  | "declare_incident"
  | "request_info"
  | "investigate";

export type ActPath = "runbook" | "novel" | "incident_lead" | "escalation";

export type TriageCase = {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: "in_progress" | "closed";

  receive: {
    acknowledged: boolean;
    reporter: string;
    reportedAt: string;
    onsetAt?: string;
    environment: string;
    affected: string;
    evidence: string;
    missing: string;
  };

  parse: {
    restated: string;
    observableFacts: string;
    reporterHypothesis: string;
    scope: string;
    clarifyingQuestions: string;
  };

  classify: {
    category: string;
    severity: string;
    severityReconsidered: boolean;
    duplicateOf?: string;
    securityChecked: boolean;
  };

  contextualize: {
    recentChanges: string;
    serviceHealth: string;
    errorTracker: string;
    logsAndTraces: string;
    rumAndReplay: string;
    patterns: string;
    evidenceBundle: string;
  };

  triage: {
    decision: TriageDecision;
    reasoning: string;
    whatWouldChangeMyMind: string;
  };

  act: {
    path: ActPath;
    actionsTaken: string;
    deviations: string;
    outcome: string;
  };

  record: {
    ticketUpdated: boolean;
    postMortemNeeded: boolean;
    runbookUpdated: boolean;
    alertAdded: boolean;
    testAdded: boolean;
    broadcast: boolean;
    learning: string;
    phaseThatMattered: string;
  };

  timeline: TimelineEntry[];
};
