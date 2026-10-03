// src/types/published.ts

import type { TriageCase } from "@/types/triage";

export type CaseSource = {
  label: string;
  /** Omit for a source that is not publicly reachable (e.g. a private repo). */
  url?: string;
};

/**
 * A case published read-only with the app (roadmap 2.16).
 * Lives in content/cases/<slug>.json and renders at /cases/<slug>.
 */
export type PublishedCase = {
  slug: string;
  title: string;
  summary: string;
  publishedAt: string;
  sources: CaseSource[];
  case: TriageCase;
};
