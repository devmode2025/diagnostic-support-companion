## v5 — Long-term

### 5.1 Semantic search over the case log (RAG over a vector store)

**What.** Embed the `learning` field of each closed case into a vector
store at close time. At query time, embed the current case's restated
problem and search for the top-K nearest past cases. Display the matches
as a "similar past cases" panel on `/triage`, each linking back to its
full case summary.

**Why.** The case log's value grows with volume, but only if it's
searchable. Keyword search over freeform diagnostic text is unreliable —
the same underlying issue can be phrased a dozen different ways across a
dozen reports. A vector search finds cases that a keyword search misses.
This is the retrieval half of RAG; the generation half is out of scope
for v5.1 and belongs to v5.3.

**Design discussion.**

The idea came up in a September 2026 conversation about building a
"diagnostic library" — a searchable, structured record of what was
learned, not just what happened. The case log is raw material; the
library is refined material. The vector search is the retrieval
mechanism that makes the library usable at scale.

Three conditions apply before this is worth building:

1. **Volume.** A vector search over 20 cases is not better than reading
   the list. The value appears around 100–200 cases and becomes clearly
   useful around 500. Cases should be reasonably diverse across
   categories, not 500 cases of the same class.

2. **Structure.** Because `TriageCase` has named fields, embed
   selectively rather than as one blob. The recommended v5.1 scope is to
   embed `record.learning` alone — the distilled lesson is what you
   actually want to retrieve later. Add `parse.restated` and
   `act.outcome` as additional vectors in v5.2 if the learning-only
   search feels thin.

3. **Discipline.** The vector search surfaces similar cases; it does not
   tell you what the current case is. You still run the six-phase gate.
   Retrieved cases inform Phase 1 (Parse) and Phase 3 (Contextualize) —
   "have I seen this before?" — but not Phase 4 (Triage) — "what should
   I decide?" This is the same discipline as the coverage-policy
   discussion in 2.1: the metric is a prompt, not a target. Here, the
   retrieval is a prompt, not an answer.

**Open question: cloud vs. local.**

Two viable architectures, with different trade-offs:

- **Cloud (Pinecone, Weaviate, Qdrant).** Higher-quality embeddings,
  scales to millions of vectors, requires an API key and a backend. This
  makes v5.1 depend on v4.1 (server-side persistence).
- **Local WASM (`@xenova/transformers` + `vectra` or `hnswlib-wasm`).**
  Runs a small embedding model entirely in the browser. No backend, no
  provider, works offline. Adequate for thousands of vectors. Fits the
  v1 "no backend" discipline without requiring v4.1 first.

For a personal diagnostic library in the hundreds-of-cases range, the
local option is likely the better v5.1. Cloud becomes the v5.2 upgrade
only if the library outgrows local capacity, which is unlikely.

**Seam.** New `src/lib/embeddings/` module. A close-time hook in
`src/lib/cases.ts` that runs the embedding pipeline. A new panel on
`src/app/triage/page.tsx` that displays matched cases. New dependencies:
either a cloud client or the local WASM packages, depending on the
architecture chosen.

**Trigger.** Build this when two things are simultaneously true: (a) the
case log contains roughly 200 or more cases, and (b) you find yourself
manually scrolling through `/cases` looking for a prior instance of the
same class of problem. Both conditions matter. Volume without the felt
need is premature; need without volume is unfulfillable.

**Related discussion.** See the Origins section under "The diagnostic
library" for the full framing.

---

### 5.2 Field-level embedding (add after 5.1 proves useful)

**What.** Extend the embedding pipeline to cover `parse.restated` and
`act.outcome` in addition to `record.learning`. At query time, search the
field that matches the current need — problem statements when you're in
Phase 1, outcomes when you're comparing resolutions.

**Why.** The learning-only search answers "what did I conclude?" It does
not answer "what similar problems have I seen?" or "how did similar
problems resolve?" Those are different retrieval tasks, and they benefit
from different vectors.

**Trigger.** Add this only when the v5.1 search has produced a case where
the learning field is a poor match but the restated problem is a good
one. That's the signal.

---

### 5.3 LLM-assisted synthesis across retrieved cases

**What.** When multiple similar cases are retrieved, generate a short
synthesis: "these three cases all involved a similar root cause; the
common thread is X." Presented as a suggestion, never as a conclusion.

**Why.** The retrieval is mechanical; the synthesis is where reading
three cases becomes more useful than reading one. The synthesis saves the
reader from re-deriving the pattern each time.

**Non-goal.** The synthesis never proposes a fix for the current case.
It describes what the retrieved cases have in common and leaves the
decision to the reader. This is the same human-review discipline
documented elsewhere in the project.

**Trigger.** Add this only after 5.1 has been in use long enough to
establish that the retrieved cases are actually relevant. If the
retrieval is producing noise, the synthesis makes the noise worse.

---

## Origins — preserved discussions

### The diagnostic library

**Context.** A September 2026 conversation about whether RAG over a
vector database would be a good addition to the app, and how the case log
relates to a larger idea of a "diagnostic library" — a searchable,
structured record of lessons learned across cases.

**The distinction.** The case log is raw material. The diagnostic library
is refined material. The case log records what happened in each triage.
The library records what was learned across triages.

A single case has a symptom, a hypothesis, a narrowing, a root cause,
and an explanation. A library entry has a pattern: "phase 3 always
matters when the reported symptom is about performance," or "the
security check in phase 2 has caught two issues that would have been
missed otherwise."

**Why vector search is the right retrieval mechanism.** Keyword search
over freeform diagnostic text is unreliable. The same underlying issue
appears in different words across different reports. A vector search
finds semantic matches that keyword search misses. This is what RAG's
retrieval half is designed for.

**Why the generation half is deferred.** RAG's generation step —
assembling an answer from retrieved context — introduces the risk of
confident-sounding wrong answers. For a diagnostic library, the retrieval
is the useful part. The generation is where the discipline has to be
careful. See v5.3 for the constrained version.

**The design constraint.** The retrieval is a prompt, not an answer. The
same principle the field guide applies to MTTR ("the metric is a prompt,
not a target") applies here: the vector search is a prompt, not an
answer. It surfaces relevant past cases. It does not tell you what the
current case is.

**Reference tools.** Several open-source projects explore this space and
are worth reading for format inspiration: `saltanovas/logbook` (a
personal reasoning log), `deja-bug` (a searchable knowledge base of
debugging patterns), `holmes` (a knowledge-driven troubleshooting
assistant), and `experience-pack` (a project lessons log with a
five-part boundary test for distinguishing portable from
project-specific lessons).
---

## Changelog

Entries move here once they ship. The format is:

- **Date** — feature, one sentence, PR or commit reference.

**2026-09-22** — v1 shipped. Content layer, six-phase triage flow, case
log, reference tab, provenance artifact, documentation. First commit
`002b392`.

**2026-09-23** — v1 published. Live at
https://diagnostic-support-companion.replit.app. First public
deployment. Commit `fc697e2`.

**2026-09-23** — v2.1 shipped. Testing policy section added to the
reference tab, sourced from `content/testing-policy.json`. Commit
`9488cc4`.
