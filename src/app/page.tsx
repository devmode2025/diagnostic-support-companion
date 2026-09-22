// src/app/page.tsx

import Link from "next/link";
import loop from "@/../content/loop.json";
import type { Loop } from "@/types/content";

const loopContent = loop as Loop;

export default function HomePage() {
  return (
    <div className="max-w-2xl mx-auto px-8 py-20">
      <p className="text-xs uppercase tracking-wider text-neutral-500 mb-4">
        Diagnostic Support Companion
      </p>

      <h1 className="text-4xl font-semibold text-neutral-900 leading-tight mb-6">
        {loopContent.title}
      </h1>

      <p className="text-lg text-neutral-600 leading-relaxed mb-10">
        {loopContent.standfirst}
      </p>

      <div className="flex flex-wrap gap-6 text-sm mb-16">
        <Link href="/triage" className="underline text-neutral-900 font-medium">
          Start a triage →
        </Link>
        <Link href="/reference" className="underline text-neutral-600">
          Read the method
        </Link>
        <Link href="/cases" className="underline text-neutral-600">
          Case log
        </Link>
        <Link href="/method" className="underline text-neutral-600">
          Provenance
        </Link>
      </div>

      <section className="mb-16">
        <h2 className="text-xs uppercase tracking-wider text-neutral-500 mb-4 pb-2 border-b border-neutral-200">
          What this is
        </h2>
        <p className="text-sm text-neutral-700 leading-relaxed mb-3">
          A triage-first tool that walks a support ticket through a structured
          six-phase first-response assessment — Receive, Parse, Classify,
          Contextualize, Triage, Act, Record — and produces a named decision, an
          evidence bundle, and a template-generated customer-facing status
          update at the end.
        </p>
        <p className="text-sm text-neutral-700 leading-relaxed">
          Every completed case is stored locally and appears in the case log.
          The column worth reading is{" "}
          <span className="font-mono text-xs bg-neutral-100 px-1 py-0.5 rounded-sm">
            phase that mattered
          </span>
          : it records which of the six phases changed the outcome, turning a
          case log into evidence of judgment rather than a record of activity.
        </p>
      </section>

      <section className="mb-16">
        <h2 className="text-xs uppercase tracking-wider text-neutral-500 mb-4 pb-2 border-b border-neutral-200">
          The method
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {loopContent.layers.map((layer) => (
            <div
              key={layer.id}
              className="border border-neutral-300 border-t-4 rounded-sm p-4"
              style={{ borderTopColor: colorFor(layer.colorKey) }}
            >
              <p className="text-xs uppercase tracking-wider text-neutral-500 mb-1">
                Layer {layer.number}
              </p>
              <h3 className="text-sm font-semibold text-neutral-900 mb-1">
                {layer.name}
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                {layer.description}
              </p>
            </div>
          ))}
        </div>
        <p className="text-xs text-neutral-500 mt-4 leading-relaxed">
          Between Layer 2 and Layer 3 sits the first-response gate — the
          six-phase assessment that decides whether a report becomes an incident
          at all.
        </p>
      </section>

      <footer className="pt-6 border-t border-neutral-200 text-xs text-neutral-500 leading-relaxed">
        The original study outline this app was built from is preserved at{" "}
        <a href="/method.html" className="underline">
          /method.html
        </a>
        . The authoritative version of the method lives in the app and is edited
        as JSON. See{" "}
        <a
          href="https://github.com/devmode2025/diagnostic-support-companion"
          className="underline"
        >
          the repo
        </a>{" "}
        for details.
      </footer>
    </div>
  );
}

function colorFor(key: Loop["layers"][number]["colorKey"]): string {
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
