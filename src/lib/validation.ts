// src/lib/validation.ts

import type { PhaseDefinition, PhaseData, FieldValue } from "@/types/triage";

export type ValidationResult = {
  valid: boolean;
  missing: string[];
};

export function validatePhase(
  phase: PhaseDefinition,
  data: PhaseData,
): ValidationResult {
  const missing: string[] = [];

  for (const prompt of phase.prompts) {
    if (!prompt.required) continue;
    const value = data[prompt.id];
    if (!isSatisfied(prompt.type, value)) {
      missing.push(prompt.id);
    }
  }

  return { valid: missing.length === 0, missing };
}

function isSatisfied(type: string, value: FieldValue): boolean {
  if (type === "boolean") return value === true;
  if (typeof value !== "string") return false;
  return value.trim().length > 0;
}
