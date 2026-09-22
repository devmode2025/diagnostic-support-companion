// src/components/CaseSummary.tsx

"use client";

import type {
  PhaseDefinition,
  TriageCase,
  TriageDecision,
} from "@/types/triage";
import type { Category, Severity } from "@/types/content";

type Props = {
  caseData: TriageCase;
  phases: PhaseDefinition[];
  categories: Category[];
  severity: Severity[];
  onReopen: () => void;
};

export function CaseSummary({
  caseData,
  phases,
  categories,
  severity,
  onReopen,
}: Props) {
  const category = categories.find((c) => c.id === caseData.classify.category);
  const sev = severity.find((s) => s.id === caseData.classify.severity);
  const phaseThatMattered = caseData.record.phaseThatMattered;

  return (
    <article className="max-w-2xl">
      <header className="mb-10 pb-6 border-b-2 border-neutral-900">
        <p className="text-xs uppercase tracking-wider text-neutral-500 mb-2">
          Case {caseData.id.slice(0, 8)}
        </p>
        <h1 className="text-2xl font-semibold text-neutral-900 leading-snug mb-3">
          {caseData.parse.restated || "Untitled case"}
        </h1>
        <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-neutral-600">
          <span>
            <span className="text-neutral-400">Category:</span>{" "}
            {category?.label ?? "—"}
          </span>
          <span>
            <span className="text-neutral-400">Severity:</span>{" "}
            {sev?.label ?? "—"}
          </span>
          <span>
            <span className="text-neutral-400">Decision:</span>{" "}
            {labelDecision(caseData.triage.decision)}
          </span>
          <span>
            <span className="text-neutral-400">Phase that mattered:</span>{" "}
            {phaseThatMattered || "—"}
          </span>
        </div>
      </header>

      <Section title="Reported as">
        <p>{caseData.receive.evidence || "—"}</p>
      </Section>

      <Section title="Restated problem">
        <p>{caseData.parse.restated || "—"}</p>
      </Section>

      <Section title="Evidence bundle">
        <p className="whitespace-pre-wrap">
          {caseData.contextualize.evidenceBundle || "—"}
        </p>
      </Section>

      <Section title="Decision and reasoning">
        <p className="mb-3">
          <span className="font-semibold">
            {labelDecision(caseData.triage.decision)}
          </span>
        </p>
        <p className="whitespace-pre-wrap">
          {caseData.triage.reasoning || "—"}
        </p>
      </Section>

      <Section title="Outcome">
        <p className="whitespace-pre-wrap">{caseData.act.outcome || "—"}</p>
      </Section>

      <Section title="Learning">
        <p className="whitespace-pre-wrap">{caseData.record.learning || "—"}</p>
      </Section>

      <Section title="Customer-facing status update (draft)">
        <pre className="whitespace-pre-wrap font-sans text-sm bg-neutral-50 border border-neutral-200 p-4 rounded-sm">
          {draftStatusUpdate(caseData, sev)}
        </pre>
        <p className="text-xs text-neutral-500 mt-2">
          Template-generated. Review before sending.
        </p>
      </Section>

      <div className="mt-12 pt-6 border-t border-neutral-200 flex items-center gap-4">
        <button
          onClick={onReopen}
          className="text-sm text-neutral-500 hover:text-neutral-900"
        >
          Reopen case
        </button>
        <a
          href="/cases"
          className="ml-auto text-sm text-neutral-500 hover:text-neutral-900"
        >
          All cases →
        </a>
      </div>
    </article>
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
    <section className="mb-8">
      <h2 className="text-xs uppercase tracking-wider text-neutral-500 mb-2">
        {title}
      </h2>
      <div className="text-sm text-neutral-800 leading-relaxed">{children}</div>
    </section>
  );
}

function labelDecision(d: TriageDecision): string {
  switch (d) {
    case "declare_incident":
      return "Declare an incident";
    case "resolve":
      return "Resolve via runbook";
    case "investigate":
      return "Investigate";
    case "escalate":
      return "Escalate";
    case "request_info":
      return "Request more information";
  }
}

function draftStatusUpdate(c: TriageCase, sev: Severity | undefined): string {
  const sevLabel = sev?.label ?? "SEV?";
  const impact =
    c.classify.category === "availability"
      ? "service availability"
      : c.classify.category === "performance"
        ? "response times"
        : c.classify.category === "data_integrity"
          ? "data accuracy"
          : "a subset of functionality";

  const status = c.act.outcome
    ? "We have applied a fix and are monitoring the result."
    : "We are actively investigating.";

  return [
    `Status: ${sevLabel}`,
    "",
    `We are aware of an issue affecting ${impact}.`,
    status,
    "We will provide the next update within 30 minutes.",
    "",
    "— Support",
  ].join("\n");
}
