// src/lib/published-cases.ts
//
// Build-time loader for published cases (roadmap 4.0). Server-only: reads
// content/cases/*.json from disk. Browser-local cases stay in
// src/lib/cases.ts and are unaffected.

import fs from "node:fs";
import path from "node:path";
import type { PublishedCase } from "@/types/published";

const CASES_DIR = path.join(process.cwd(), "content", "cases");
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function assertPublishedCase(
  value: unknown,
  file: string,
): asserts value is PublishedCase {
  const v = value as Partial<PublishedCase> | null;
  const problems: string[] = [];
  if (!v || typeof v !== "object") problems.push("not an object");
  else {
    if (typeof v.slug !== "string" || !SLUG_PATTERN.test(v.slug))
      problems.push("slug must be lowercase-kebab-case");
    if (typeof v.title !== "string" || !v.title) problems.push("missing title");
    if (typeof v.summary !== "string") problems.push("missing summary");
    if (typeof v.publishedAt !== "string" || !v.publishedAt)
      problems.push("missing publishedAt");
    if (!Array.isArray(v.sources) || v.sources.length === 0)
      problems.push("sources must list at least one source");
    else if (v.sources.some((s) => !s || typeof s.label !== "string" || !s.label))
      problems.push("every source needs a label");
    if (!v.case || typeof v.case !== "object") problems.push("missing case");
  }
  if (problems.length > 0) {
    throw new Error(
      `Invalid published case ${file}: ${problems.join("; ")}`,
    );
  }
}

export function listPublishedCases(): PublishedCase[] {
  if (!fs.existsSync(CASES_DIR)) return [];
  const files = fs
    .readdirSync(CASES_DIR)
    .filter((f) => f.endsWith(".json"))
    .sort();

  const cases = files.map((file) => {
    const raw = fs.readFileSync(path.join(CASES_DIR, file), "utf8");
    const parsed: unknown = JSON.parse(raw);
    assertPublishedCase(parsed, file);
    if (`${parsed.slug}.json` !== file) {
      throw new Error(
        `Published case ${file}: file name must match slug "${parsed.slug}"`,
      );
    }
    return parsed;
  });

  return cases.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export function getPublishedCase(slug: string): PublishedCase | undefined {
  return listPublishedCases().find((c) => c.slug === slug);
}
