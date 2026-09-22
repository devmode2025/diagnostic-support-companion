// src/components/PhaseForm.tsx

"use client";

import { useState } from "react";
import type { PhaseDefinition, PhaseData, FieldValue } from "@/types/triage";
import type { Category, Severity } from "@/types/content";
import { PromptField } from "./PromptField";
import { validatePhase } from "@/lib/validation";

type Props = {
  phase: PhaseDefinition;
  initialData: PhaseData;
  categories: Category[];
  severity: Severity[];
  onComplete: (data: PhaseData) => void;
  onBack?: () => void;
};

export function PhaseForm({
  phase,
  initialData,
  categories,
  severity,
  onComplete,
  onBack,
}: Props) {
  const [data, setData] = useState<PhaseData>(initialData);
  const [missing, setMissing] = useState<string[]>([]);

  function handleChange(id: string, value: FieldValue) {
    setData((prev) => ({ ...prev, [id]: value }));
    if (missing.includes(id)) {
      setMissing((prev) => prev.filter((m) => m !== id));
    }
  }

  function handleSubmit() {
    const result = validatePhase(phase, data);
    if (!result.valid) {
      setMissing(result.missing);
      return;
    }
    onComplete(data);
  }

  return (
    <section className="max-w-2xl">
      <header className="mb-8">
        <p className="text-xs uppercase tracking-wider text-neutral-500 mb-1">
          Phase {phase.number}
        </p>
        <h2 className="text-2xl font-semibold text-neutral-900 mb-2">
          {phase.name}
        </h2>
        <p className="text-neutral-600 leading-relaxed">{phase.purpose}</p>
      </header>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        {phase.prompts.map((prompt) => (
          <PromptField
            key={prompt.id}
            prompt={prompt}
            value={data[prompt.id]}
            onChange={handleChange}
            invalid={missing.includes(prompt.id)}
            categories={categories}
            severity={severity}
          />
        ))}

        <div className="flex items-center gap-4 mt-10 pt-6 border-t border-neutral-200">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="text-sm text-neutral-500 hover:text-neutral-900"
            >
              ← Back
            </button>
          )}
          <button
            type="submit"
            className="ml-auto bg-neutral-900 text-white text-sm font-medium px-5 py-2 rounded-sm hover:bg-neutral-700"
          >
            Complete phase {phase.number}
          </button>
        </div>
      </form>

      <aside className="mt-12 pt-8 border-t border-neutral-200">
        <h3 className="text-xs uppercase tracking-wider text-neutral-500 mb-3">
          Mindset
        </h3>
        <ul className="space-y-3">
          {phase.mindset.map((line, i) => (
            <li
              key={i}
              className="text-sm italic text-neutral-600 border-l-2 border-neutral-300 pl-3"
            >
              {line}
            </li>
          ))}
        </ul>

        {phase.antiPatterns.length > 0 && (
          <details className="mt-8">
            <summary className="text-xs uppercase tracking-wider text-neutral-500 cursor-pointer">
              Anti-patterns
            </summary>
            <ul className="mt-3 space-y-2">
              {phase.antiPatterns.map((line, i) => (
                <li key={i} className="text-sm text-neutral-600 pl-4 relative">
                  <span className="absolute left-0 text-red-600 font-bold">
                    ×
                  </span>
                  {line}
                </li>
              ))}
            </ul>
          </details>
        )}
      </aside>
    </section>
  );
}
