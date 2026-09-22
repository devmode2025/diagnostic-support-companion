// src/components/PromptField.tsx

"use client";

import type { PromptDefinition, FieldValue } from "@/types/triage";
import type { Category, Severity } from "@/types/content";

type Props = {
  prompt: PromptDefinition;
  value: FieldValue;
  onChange: (id: string, value: FieldValue) => void;
  invalid?: boolean;
  categories?: Category[];
  severity?: Severity[];
};

export function PromptField({
  prompt,
  value,
  onChange,
  invalid = false,
  categories = [],
  severity = [],
}: Props) {
  const fieldId = `prompt-${prompt.id}`;

  return (
    <div className={`mb-6 ${invalid ? "border-l-2 border-red-600 pl-3" : ""}`}>
      <label
        htmlFor={fieldId}
        className="block text-sm font-semibold text-neutral-800 mb-1"
      >
        {prompt.label}
        {prompt.required && <span className="text-red-600 ml-1">*</span>}
      </label>

      {prompt.help && (
        <p className="text-xs text-neutral-500 mb-2 leading-relaxed">
          {prompt.help}
        </p>
      )}

      {renderInput(prompt, value, onChange, fieldId, categories, severity)}

      {invalid && (
        <p className="text-xs text-red-600 mt-1">This field is required.</p>
      )}
    </div>
  );
}

function renderInput(
  prompt: PromptDefinition,
  value: FieldValue,
  onChange: (id: string, value: FieldValue) => void,
  fieldId: string,
  categories: Category[],
  severity: Severity[],
) {
  const stringValue = typeof value === "string" ? value : "";

  switch (prompt.type) {
    case "text":
      return (
        <input
          id={fieldId}
          type="text"
          value={stringValue}
          onChange={(e) => onChange(prompt.id, e.target.value)}
          className="w-full border border-neutral-300 rounded-sm px-3 py-2 text-sm font-mono"
        />
      );

    case "textarea":
      return (
        <textarea
          id={fieldId}
          value={stringValue}
          onChange={(e) => onChange(prompt.id, e.target.value)}
          rows={4}
          className="w-full border border-neutral-300 rounded-sm px-3 py-2 text-sm"
        />
      );

    case "datetime":
      return (
        <input
          id={fieldId}
          type="datetime-local"
          value={stringValue}
          onChange={(e) => onChange(prompt.id, e.target.value)}
          className="w-full border border-neutral-300 rounded-sm px-3 py-2 text-sm font-mono"
        />
      );

    case "boolean":
      return (
        <label className="inline-flex items-center gap-2 text-sm">
          <input
            id={fieldId}
            type="checkbox"
            checked={value === true}
            onChange={(e) => onChange(prompt.id, e.target.checked)}
            className="h-4 w-4"
          />
          <span className="text-neutral-600">Yes</span>
        </label>
      );

    case "select": {
      const options = resolveOptions(prompt, categories, severity);
      return (
        <select
          id={fieldId}
          value={stringValue}
          onChange={(e) => onChange(prompt.id, e.target.value)}
          className="w-full border border-neutral-300 rounded-sm px-3 py-2 text-sm"
        >
          <option value="">— Select —</option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      );
    }
  }
}

function resolveOptions(
  prompt: PromptDefinition,
  categories: Category[],
  severity: Severity[],
) {
  if (prompt.options) return prompt.options;
  if (prompt.source === "categories") {
    return categories.map((c) => ({ value: c.id, label: c.label }));
  }
  if (prompt.source === "severity") {
    return severity.map((s) => ({
      value: s.id,
      label: `${s.label} — ${s.definition}`,
    }));
  }
  return [];
}
