// src/app/cases/page.tsx
//
// Published cases (read-only, shipped with the app; roadmap 4.0) above the
// visitor's own browser-local cases.

import Link from "next/link";
import { LocalCaseLog } from "@/components/LocalCaseLog";
import { listPublishedCases } from "@/lib/published-cases";

export default function CasesPage() {
  const published = listPublishedCases();

  return (
    <div className="max-w-5xl mx-auto px-8 py-12">
      <header className="mb-8 pb-6 border-b-2 border-neutral-900 flex items-baseline gap-6 flex-wrap">
        <h1 className="text-2xl font-semibold text-neutral-900">
          Published cases
        </h1>
        <p className="text-sm text-neutral-500">
          {published.length} · worked from public sources, read-only
        </p>
      </header>

      {published.length === 0 ? (
        <p className="text-sm text-neutral-500 mb-16">
          No published cases yet.
        </p>
      ) : (
        <ul className="mb-16 space-y-6">
          {published.map((c) => (
            <li key={c.slug} className="max-w-3xl">
              <Link
                href={`/cases/${c.slug}`}
                className="text-base font-medium text-neutral-900 underline"
              >
                {c.title}
              </Link>
              <p className="text-sm text-neutral-600 mt-1 leading-relaxed">
                {c.summary}
              </p>
              <p className="text-xs text-neutral-400 mt-1">
                Published {c.publishedAt} · phase that mattered:{" "}
                {c.case.record.phaseThatMattered || "—"}
              </p>
            </li>
          ))}
        </ul>
      )}

      <LocalCaseLog />
    </div>
  );
}
