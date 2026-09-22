// src/components/PhaseRenderer.tsx

"use client";

import type { TriageCase, PhaseDefinition, PhaseData } from "@/types/triage";
import type { Category, Severity } from "@/types/content";
import { PhaseForm } from "./PhaseForm";

type Props = {
  phase: PhaseDefinition;
  caseData: TriageCase;
  categories: Category[];
  severity: Severity[];
  onComplete: (phaseId: PhaseDefinition["id"], data: PhaseData) => void;
  onBack?: () => void;
};

export function PhaseRenderer({
  phase,
  caseData,
  categories,
  severity,
  onComplete,
  onBack,
}: Props) {
  const slice = caseData[phase.id] as unknown as PhaseData;

  return (
    <PhaseForm
      phase={phase}
      initialData={slice}
      categories={categories}
      severity={severity}
      onComplete={(data) => onComplete(phase.id, data)}
      onBack={onBack}
    />
  );
}
