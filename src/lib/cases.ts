// src/lib/cases.ts

import type { TriageCase } from "@/types/triage";

const STORAGE_KEY = "dsc.cases";

type CaseMap = Record<string, TriageCase>;

function readAll(): CaseMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as CaseMap;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function writeAll(map: CaseMap): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
}

function newId(): string {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function createCase(): TriageCase {
  const now = new Date().toISOString();
  return {
    id: newId(),
    createdAt: now,
    updatedAt: now,
    status: "in_progress",
    timeline: [{ at: now, phase: "gate", note: "Case created" }],

    receive: {
      acknowledged: false,
      reporter: "",
      reportedAt: "",
      onsetAt: "",
      environment: "",
      affected: "",
      evidence: "",
      missing: "",
    },

    parse: {
      restated: "",
      observableFacts: "",
      reporterHypothesis: "",
      scope: "",
      clarifyingQuestions: "",
    },

    classify: {
      category: "",
      severity: "",
      severityReconsidered: false,
      duplicateOf: "",
      securityChecked: false,
    },

    contextualize: {
      recentChanges: "",
      serviceHealth: "",
      errorTracker: "",
      logsAndTraces: "",
      rumAndReplay: "",
      patterns: "",
      evidenceBundle: "",
    },

    triage: {
      decision: "investigate",
      reasoning: "",
      whatWouldChangeMyMind: "",
    },

    act: {
      path: "runbook",
      actionsTaken: "",
      deviations: "",
      outcome: "",
    },

    record: {
      ticketUpdated: false,
      postMortemNeeded: false,
      runbookUpdated: false,
      alertAdded: false,
      testAdded: false,
      broadcast: false,
      learning: "",
      phaseThatMattered: "",
    },
  };
}

export function saveCase(caseData: TriageCase): void {
  const map = readAll();
  map[caseData.id] = { ...caseData, updatedAt: new Date().toISOString() };
  writeAll(map);
}

export function getCase(id: string): TriageCase | undefined {
  return readAll()[id];
}

export function listCases(): TriageCase[] {
  const map = readAll();
  return Object.values(map).sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );
}

export function deleteCase(id: string): void {
  const map = readAll();
  delete map[id];
  writeAll(map);
}
