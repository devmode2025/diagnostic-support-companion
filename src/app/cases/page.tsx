// src/app/cases/page.tsx

"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { TriageCase, TriageDecision } from "@/types/triage";
import type { Category, Severity } from "@/types/content";
import categoriesData from "@/../content/categories.json";
import severityData from "@/../content/severity.json";
import { listCases } from "@/lib/cases";

const categories = categoriesData as Category[];
const severity = severityData as Severity[];

export default function CasesPage() {
  const [cases, setCases] = useState<TriageCase[]>([]);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [severityFilter, setSeverityFilter] = useState("");

  useEffect(() => {
    setCases(listCases());
  }, []);

  const filtered = useMemo(
    () =>
      cases.filter((c) => {
        if (categoryFilter && c.classify.category !== categoryFilter)
          return false;
        if (severityFilter && c.classify.severity !== severityFilter)
          return false;
        return true;
      }),
    [cases, categoryFilter, severityFilter],
  );

  return (
    <div className="max-w-5xl mx-auto px-8 py-12">
      <header className="mb-8 pb-6 border-b-2 border-neutral-900 flex items-baseline gap-6 flex-wrap">
        <h1 className="text-2xl font-semibold text-neutral-900">Cases</h1>
        <p className="text-sm text-neutral-500">
          {filtered.length} of {cases.length}
        </p>
        <Link
          href="/triage"
          className="ml-auto text-sm text-neutral-800 underline"
        >
          Start a triage →
        </Link>
      </header>

      <div className="flex flex-wrap gap-4 mb-8 text-sm items-end">
        <FilterSelect
          label="Category"
          value={categoryFilter}
          onChange={setCategoryFilter}
          options={categories.map((c) => ({ value: c.id, label: c.label }))}
        />
        <FilterSelect
          label="Severity"
          value={severityFilter}
          onChange={setSeverityFilter}
          options={severity.map((s) => ({ value: s.id, label: s.label }))}
        />
        {(categoryFilter || severityFilter) && (
          <button
            onClick={() => {
              setCategoryFilter("");
              setSeverityFilter("");
            }}
            className="text-neutral-500 hover:text-neutral-900 pb-1"
          >
            Clear
          </button>
        )}
      </div>

      {cases.length === 0 ? (
        <EmptyState />
      ) : filtered.length === 0 ? (
        <p className="text-sm text-neutral-500">No cases match the filter.</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-900">
              <Th>ID</Th>
              <Th>Reported as</Th>
              <Th>Category</Th>
              <Th>Severity</Th>
              <Th>Decision</Th>
              <Th>Phase that mattered</Th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => {
              const cat = categories.find((x) => x.id === c.classify.category);
              const sev = severity.find((x) => x.id === c.classify.severity);
              return (
                <tr
                  key={c.id}
                  className="border-b border-neutral-200 hover:bg-neutral-50"
                >
                  <Td mono>
                    <Link href={`/triage?id=${c.id}`} className="underline">
                      {c.id.slice(0, 8)}
                    </Link>
                  </Td>
                  <Td>
                    {truncate(c.parse.restated || c.receive.evidence, 60)}
                  </Td>
                  <Td>{cat?.label ?? "—"}</Td>
                  <Td>{sev?.label ?? "—"}</Td>
                  <Td>{labelDecision(c.triage.decision)}</Td>
                  <Td mono>{c.record.phaseThatMattered || "—"}</Td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="flex items-center gap-2">
      <span className="text-neutral-500">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border border-neutral-300 rounded-sm px-2 py-1"
      >
        <option value="">All</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function EmptyState() {
  return (
    <div className="border border-dashed border-neutral-300 rounded-sm p-12 text-center">
      <p className="text-sm text-neutral-600 mb-3">No cases yet.</p>
      <Link href="/triage" className="text-sm underline text-neutral-800">
        Start the first triage →
      </Link>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="text-left font-semibold py-2 pr-4 text-neutral-700">
      {children}
    </th>
  );
}

function Td({ children, mono }: { children: React.ReactNode; mono?: boolean }) {
  return (
    <td
      className={`py-2 pr-4 align-top text-neutral-700 ${
        mono ? "font-mono text-xs" : ""
      }`}
    >
      {children}
    </td>
  );
}

function truncate(s: string, n: number): string {
  if (!s) return "—";
  return s.length > n ? s.slice(0, n - 1) + "…" : s;
}

function labelDecision(d: TriageDecision): string {
  switch (d) {
    case "declare_incident":
      return "Declare";
    case "resolve":
      return "Resolve";
    case "investigate":
      return "Investigate";
    case "escalate":
      return "Escalate";
    case "request_info":
      return "Request info";
  }
}
