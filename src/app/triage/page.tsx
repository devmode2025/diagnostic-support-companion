// src/app/triage/page.tsx

"use client";

import { useEffect, useState } from "react";
import type {
  PhaseDefinition,
  PhaseId,
  PhaseData,
  TriageCase,
} from "@/types/triage";
import type { Category, Severity } from "@/types/content";
import phasesData from "@/../content/phases.json";
import categoriesData from "@/../content/categories.json";
import severityData from "@/../content/severity.json";
import { PhaseRenderer } from "@/components/PhaseRenderer";
import { PhaseStepper } from "@/components/PhaseStepper";
import { CaseSummary } from "@/components/CaseSummary";
import { createCase, getCase, saveCase } from "@/lib/cases";

const phases = phasesData as PhaseDefinition[];
const categories = categoriesData as Category[];
const severity = severityData as Severity[];

export default function TriagePage() {
  const [caseData, setCaseData] = useState<TriageCase | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [closed, setClosed] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    if (id) {
      const existing = getCase(id);
      if (existing) {
        setCaseData(existing);
        if (existing.status === "closed") {
          setCurrentIndex(phases.length);
          setClosed(true);
        } else {
          setCurrentIndex(findFirstIncomplete(existing));
        }
        return;
      }
    }

    const fresh = createCase();
    saveCase(fresh);
    setCaseData(fresh);
    window.history.replaceState(null, "", `/triage?id=${fresh.id}`);
  }, []);

  if (!caseData) {
    return (
      <div className="max-w-5xl mx-auto px-8 py-12 text-sm text-neutral-500">
        Loading case…
      </div>
    );
  }

  const phase = phases[currentIndex];
  const isLast = currentIndex === phases.length - 1;

  function handlePhaseComplete(phaseId: PhaseId, data: PhaseData) {
    if (!caseData) return;
    const updated: TriageCase = {
      ...caseData,
      [phaseId]: data,
      updatedAt: new Date().toISOString(),
      timeline: [
        ...caseData.timeline,
        {
          at: new Date().toISOString(),
          phase: phase.number,
          note: `Completed ${phase.name}`,
        },
      ],
    } as TriageCase;

    if (isLast) {
      updated.status = "closed";
      setClosed(true);
    } else {
      setCurrentIndex(currentIndex + 1);
    }

    setCaseData(updated);
    saveCase(updated);
  }

  function handleBack() {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  }

  function handleReopen() {
    if (!caseData) return;
    const reopened: TriageCase = { ...caseData, status: "in_progress" };
    setCaseData(reopened);
    saveCase(reopened);
    setClosed(false);
    setCurrentIndex(phases.length - 1);
  }

  return (
    <div className="grid grid-cols-[220px_1fr] gap-12 max-w-5xl mx-auto px-8 py-12">
      <PhaseStepper
        phases={phases}
        currentIndex={closed ? phases.length : currentIndex}
        caseData={caseData}
      />

      <main>
        {closed ? (
          <CaseSummary
            caseData={caseData}
            phases={phases}
            categories={categories}
            severity={severity}
            onReopen={handleReopen}
          />
        ) : (
          <PhaseRenderer
            key={phase.id}
            phase={phase}
            caseData={caseData}
            categories={categories}
            severity={severity}
            onComplete={handlePhaseComplete}
            onBack={currentIndex > 0 ? handleBack : undefined}
          />
        )}
      </main>
    </div>
  );
}

function findFirstIncomplete(c: TriageCase): number {
  for (let i = 0; i < phases.length; i++) {
    const slice = c[phases[i].id] as Record<string, unknown>;
    const hasAny = Object.values(slice ?? {}).some(
      (v) => v !== undefined && v !== "" && v !== false,
    );
    if (!hasAny) return i;
  }
  return phases.length - 1;
}
