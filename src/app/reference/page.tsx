// src/app/reference/page.tsx

"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import loopData from "@/../content/loop.json";
import phasesData from "@/../content/phases.json";
import severityData from "@/../content/severity.json";
import categoriesData from "@/../content/categories.json";
import metricsData from "@/../content/metrics.json";
import glossaryData from "@/../content/glossary.json";
import fluencyData from "@/../content/fluency.json";
import framingsData from "@/../content/framings.json";
import type {
  Loop,
  Severity,
  Category,
  Metric,
  GlossaryTerm,
  FluencyItem,
  Framing,
  ColorKey,
} from "@/types/content";
import type { PhaseDefinition } from "@/types/triage";

const loop = loopData as Loop;
const phases = phasesData as PhaseDefinition[];
const severity = severityData as Severity[];
const categories = categoriesData as Category[];
const metrics = metricsData as Metric[];
const glossary = glossaryData as GlossaryTerm[];
const fluency = fluencyData as FluencyItem[];
const framings = framingsData as Framing[];

export default function ReferencePage() {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();

  const filtered = useMemo(
    () => ({
      glossary: q
        ? glossary.filter((g) => matches(q, g.term, g.definition))
        : glossary,
      metrics: q
        ? metrics.filter((m) =>
            matches(q, m.label, m.expanded, m.measures, m.pointsTo),
          )
        : metrics,
      categories: q
        ? categories.filter((c) => matches(q, c.label, c.description, c.owner))
        : categories,
    }),
    [q],
  );

  return (
    <div className="max-w-3xl mx-auto px-8 py-12">
      <header className="mb-10 pb-6 border-b-2 border-neutral-900">
        <h1 className="text-3xl font-semibold text-neutral-900 mb-2">
          {loop.title}
        </h1>
        <p className="text-neutral-600 leading-relaxed">{loop.standfirst}</p>
      </header>

      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Filter glossary, metrics, categories…"
        className="w-full border border-neutral-300 rounded-sm px-4 py-2 text-sm mb-12"
      />

      <TheLoop />

      <Section title="Severity">
        <Table
          head={["Severity", "Definition", "Response"]}
          rows={severity.map((s) => [s.label, s.definition, s.response])}
        />
      </Section>

      <Section title="Category taxonomy">
        <Table
          head={["Category", "Description", "Typical owner"]}
          rows={filtered.categories.map((c) => [
            c.label,
            c.description,
            c.owner,
          ])}
        />
      </Section>

      <Section title="Measuring the loop">
        <Table
          head={["Metric", "Measures", "Where it points"]}
          rows={filtered.metrics.map((m) => [m.label, m.measures, m.pointsTo])}
        />
        <p className="text-sm text-neutral-600 mt-4 leading-relaxed">
          All of these are means, and incident durations are heavily skewed.
          Prefer medians and p90, report the distribution rather than the single
          figure, and treat any of these as a diagnostic prompt rather than a
          target. The moment MTTR becomes a goal, the incentive is to close
          incidents early rather than resolve them.
        </p>
      </Section>

      <Section title="What fluency looks like">
        <ol className="space-y-6">
          {fluency.map((f, i) => (
            <li key={f.id}>
              <p className="text-sm font-semibold text-neutral-800 mb-1">
                {i + 1}. {f.title}
              </p>
              <p className="text-sm text-neutral-600 leading-relaxed">
                {renderInlineMarkdown(f.body)}
              </p>
            </li>
          ))}
        </ol>
      </Section>

      <Section title="Glossary">
        <dl className="space-y-4">
          {filtered.glossary.map((g) => (
            <div key={g.term} className="grid grid-cols-[150px_1fr] gap-4">
              <dt className="text-sm font-semibold text-neutral-800">
                {g.term}
              </dt>
              <dd className="text-sm text-neutral-600 leading-relaxed">
                {renderInlineMarkdown(g.definition)}
              </dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section title="Closing framings">
        {framings.map((f) => (
          <div key={f.id} className="mb-8">
            <h3 className="text-xs uppercase tracking-wider text-neutral-500 mb-3">
              {f.label}
            </h3>
            {f.paragraphs.map((p, i) => (
              <p
                key={i}
                className="text-sm text-neutral-800 leading-relaxed mb-3"
              >
                {p}
              </p>
            ))}
          </div>
        ))}
      </Section>

      <footer className="mt-16 pt-6 border-t border-neutral-200 text-sm text-neutral-500">
        The original study outline this app was built from is preserved at{" "}
        <a href="/method.html" className="underline">
          /method.html
        </a>
        . The method above is the authoritative version.
      </footer>
    </div>
  );
}

function TheLoop() {
  return (
    <Section title="The loop">
      <div className="grid grid-cols-2 gap-4 mb-6">
        {loop.layers.map((layer) => (
          <div
            key={layer.id}
            className="border border-neutral-300 border-t-4 rounded-sm p-4"
            style={{ borderTopColor: colorFor(layer.colorKey) }}
          >
            <p className="text-xs uppercase tracking-wider text-neutral-500 mb-1">
              Layer {layer.number}
            </p>
            <h3 className="text-base font-semibold text-neutral-900 mb-1">
              {layer.name}
            </h3>
            <p className="text-sm text-neutral-600 leading-relaxed">
              {layer.description}
            </p>
            <p className="text-xs text-neutral-400 mt-3 pt-3 border-t border-neutral-200 font-mono">
              {layer.transition}
            </p>
          </div>
        ))}
      </div>
      <p className="text-sm text-neutral-600 leading-relaxed border-l-2 border-neutral-300 pl-4">
        {loop.note}
      </p>
      <p className="text-sm mt-6">
        <Link href="/triage" className="underline text-neutral-800">
          Start a triage →
        </Link>
      </p>
    </Section>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-14">
      <h2 className="text-xs uppercase tracking-wider text-neutral-500 mb-4 pb-2 border-b border-neutral-200">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Table({ head, rows }: { head: string[]; rows: string[][] }) {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-neutral-900">
          {head.map((h) => (
            <th
              key={h}
              className="text-left font-semibold py-2 pr-4 text-neutral-700"
            >
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} className="border-b border-neutral-200">
            {row.map((cell, j) => (
              <td key={j} className="py-2 pr-4 align-top text-neutral-700">
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function matches(q: string, ...fields: string[]): boolean {
  return fields.some((f) => f.toLowerCase().includes(q));
}

function renderInlineMarkdown(s: string): React.ReactNode {
  const parts = s.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return <em key={i}>{part.slice(1, -1)}</em>;
    }
    return <span key={i}>{part}</span>;
  });
}

function colorFor(key: ColorKey): string {
  switch (key) {
    case "l1":
      return "#3E6B4F";
    case "l2":
      return "#2F5D7C";
    case "l3":
      return "#A85432";
    case "l4":
      return "#5D4A7A";
    case "g":
      return "#3A4046";
  }
}
