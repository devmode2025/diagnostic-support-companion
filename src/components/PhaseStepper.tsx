// src/components/PhaseStepper.tsx

"use client";

import type { PhaseDefinition, TriageCase } from "@/types/triage";

type Props = {
  phases: PhaseDefinition[];
  currentIndex: number;
  caseData: TriageCase;
};

export function PhaseStepper({ phases, currentIndex, caseData }: Props) {
  return (
    <nav className="sticky top-12 self-start">
      <ol className="space-y-1">
        {phases.map((phase, i) => {
          const complete = i < currentIndex;
          const current = i === currentIndex;
          return (
            <li key={phase.id}>
              <div
                className={[
                  "flex items-baseline gap-3 py-2 pl-3 border-l-2",
                  current
                    ? "border-neutral-900"
                    : complete
                      ? "border-neutral-400"
                      : "border-neutral-200",
                ].join(" ")}
              >
                <span
                  className={[
                    "font-mono text-xs",
                    complete
                      ? "text-neutral-400"
                      : current
                        ? "text-neutral-900"
                        : "text-neutral-400",
                  ].join(" ")}
                >
                  {complete ? "✓" : phase.number}
                </span>
                <span
                  className={[
                    "text-sm",
                    current
                      ? "font-semibold text-neutral-900"
                      : complete
                        ? "text-neutral-500"
                        : "text-neutral-400",
                  ].join(" ")}
                >
                  {phase.name}
                </span>
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
