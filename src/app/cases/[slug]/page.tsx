// src/app/cases/[slug]/page.tsx
//
// Read-only page for a published case (roadmap 4.0). Statically generated
// from content/cases/<slug>.json at build time; unknown slugs return 404.

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { FieldValue, PhaseDefinition, TriageCase } from "@/types/triage";
import type { Category, Severity } from "@/types/content";
import phasesData from "@/../content/phases.json";
import categoriesData from "@/../content/categories.json";
import severityData from "@/../content/severity.json";
import { CaseSummary } from "@/components/CaseSummary";
import { getPublishedCase, listPublishedCases } from "@/lib/published-cases";

const phases = phasesData as PhaseDefinition[];
const categories = categoriesData as Category[];
const severity = severityData as Severity[];

export const dynamicParams = false;

export function generateStaticParams() {
  return listPublishedCases().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const published = getPublishedCase(slug);
  if (!published) return {};
  return {
    title: `${published.title} · Diagnostic Support Companion`,
    description: published.summary,
  };
}

export default async function PublishedCasePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const published = getPublishedCase(slug);
  if (!published) notFound();

  return (
    <div className="max-w-5xl mx-auto px-8 py-12">
      <div className="max-w-2xl mb-10 border border-neutral-200 bg-neutral-50 rounded-sm p-5">
        <p className="text-xs uppercase tracking-wider text-neutral-500 mb-2">
          Published case · read-only · {published.publishedAt}
        </p>
        <h1 className="text-lg font-semibold text-neutral-900 leading-snug mb-2">
          {published.title}
        </h1>
        <p className="text-sm text-neutral-700 leading-relaxed mb-4">
          {published.summary}
        </p>
        <h2 className="text-xs uppercase tracking-wider text-neutral-500 mb-1">
          Sources
        </h2>
        <ul className="text-sm list-disc pl-5 space-y-1">
          {published.sources.map((s) => (
            <li key={s.url}>
              <a href={s.url} className="underline text-neutral-800">
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <CaseSummary
        caseData={published.case}
        phases={phases}
        categories={categories}
        severity={severity}
      />

      <FullRecord caseData={published.case} />

      <p className="max-w-2xl mt-10 text-sm">
        <Link href="/cases" className="underline text-neutral-600">
          ← All cases
        </Link>
      </p>
    </div>
  );
}

function FullRecord({ caseData }: { caseData: TriageCase }) {
  return (
    <section className="max-w-2xl mt-12 pt-8 border-t-2 border-neutral-900">
      <h2 className="text-xl font-semibold text-neutral-900 mb-1">
        Full case record
      </h2>
      <p className="text-sm text-neutral-500 mb-8">
        Every phase as it was filled in, including the hypotheses that were
        ruled out.
      </p>
      {phases.map((phase) => {
        const data = caseData[phase.id] as Record<string, FieldValue>;
        const rows = phase.prompts
          .map((prompt) => ({
            prompt,
            value: displayValue(prompt.id, data?.[prompt.id], phase),
          }))
          .filter((r) => r.value !== "");
        if (rows.length === 0) return null;
        return (
          <div key={phase.id} className="mb-8">
            <h3 className="text-xs uppercase tracking-wider text-neutral-500 mb-3">
              Phase {phase.number} · {phase.name}
            </h3>
            <dl className="text-sm space-y-3">
              {rows.map(({ prompt, value }) => (
                <div key={prompt.id}>
                  <dt className="font-medium text-neutral-800">
                    {prompt.label}
                  </dt>
                  <dd className="text-neutral-700 whitespace-pre-wrap leading-relaxed">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        );
      })}
    </section>
  );
}

function displayValue(
  promptId: string,
  value: FieldValue,
  phase: PhaseDefinition,
): string {
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (value === undefined || value === "") return "";
  if (promptId === "category")
    return categories.find((c) => c.id === value)?.label ?? value;
  if (promptId === "severity")
    return severity.find((s) => s.id === value)?.label ?? value;
  const option = phase.prompts
    .find((p) => p.id === promptId)
    ?.options?.find((o) => o.value === value);
  return option?.label ?? value;
}
