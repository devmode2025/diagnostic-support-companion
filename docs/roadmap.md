## v2 — Shipped since v1

The full v2 list (2.1–2.15) lives in the master project document; this
file carries the entries built since. Numbering follows the master's rule:
an entry goes in the bucket that matches its trigger, so a feature whose
trigger has arrived is v2 however it is sized.

### 2.16 Published case library (read-only, no backend) — SHIPPED 3 October 2026

**Why.** Cases live only in the browser's `localStorage` (`dsc.cases`
in `src/lib/cases.ts`). That had two consequences nobody intended:

1. **Nobody else can see a case.** A hiring manager who opens the live
   app sees an empty case log — their browser, their storage. By
   October 2026 the cover letters and application answers had started
   citing specific cases worked through the app ("I ran your GitHub
   Discussion #33500 through my triage tool"). A claim the reader can
   check and finds empty is worse than no claim.
2. **A case can be lost.** Clearing browser data or switching laptops
   deletes it. Case 1 (the `cisco` substring bug) has lived only in
   `localStorage` since 26 September.

The tool is a claim; the case log is the evidence (see the depth-over-
breadth discussion). Evidence that only its author can see is not
evidence.

**What.** Published cases ship with the app as JSON files in
`content/cases/`, one per case, in the existing `TriageCase` shape plus a
small header (slug, title, summary, sources, publishedAt). Each renders
read-only at its own permanent URL, `/cases/<slug>`. The `/cases` page
shows them in a "Published cases" section above the visitor's own
browser-local cases. Private working cases stay in `localStorage` until
the author chooses to publish one; an "Export JSON" control on a case
produces the file to commit.

**Why not a database (2.13 or 4.1).** 4.1's trigger is "more than one
person needs to see the same case log." A reader needs to *view* a case,
not edit it, and read-only viewing needs no server, auth, sessions or
retention policy, so 4.1 stays deferred with its trigger unchanged.
2.13 (single-user managed Postgres) does not answer this either: it makes
every stored case durable, but publishing is a deliberate per-case
decision, made after the sources are checked, and a working draft must
never become public by being saved. 2.13 still stands on its own terms,
durability, and is unchanged by this entry. Files in the repo are also
version-controlled, so every published case carries a dated commit,
which is its own provenance.

**Relationship to 2.5 and 2.10.** 2.10 (print and share view) named the
same reader, someone who has never opened the app, and was waiting for
the first interview. Its trigger arrived early, in an application answer,
and this entry delivers its shareable half: a clean page per case. The
print stylesheet is still open under 2.10. 2.5 (export and import) is
half done: the "Export JSON" control writes a case to a file, wrapped in
the published-case header. Import, and a plain round trip in the
`TriageCase` shape, are still open under 2.5.

**Rules for publishing.**

- Public sources only: open GitHub issues and discussions, public
  documentation, the author's own projects. Never an employer's system
  or a confidential ticket.
- Every published case links its sources.
- A published case is a record, not a showcase: keep the wrong turns.

**Seam.** New `content/cases/*.json`; new `src/lib/published-cases.ts`
(build-time loader); new `src/app/cases/[slug]/page.tsx` (static,
read-only); `CaseSummary` gains a read-only mode (no reopen control);
`src/app/cases/page.tsx` lists published cases; home page and README
link the library. `src/lib/cases.ts` gains an export helper only — the
`localStorage` path is unchanged.

**First cases.** (1) Supabase Discussion #33500 — RLS select returns an
empty array with no error; already cited in an application. (2) Case 1,
the `cisco` substring bug — recovered from the original laptop's
`localStorage` on 3 October, which is this section's "can be lost" risk
in miniature. (3) Case 002. (4) Claude API intermittent 429s.

**Practice.** Export a case as soon as it closes.

**Trigger.** Built 3 October 2026, triggered by the first application
answer that cited a specific case.

---

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

**2026-10-03** — 2.16 published case library: read-only cases shipped as
files in `content/cases/`, each at `/cases/<slug>`. First case: Supabase
Discussion #33500. Case 1 (`cisco`) published from the original record. Case 002
(openai-agents-js #799) published with phases 4–5 completed 3 October.

**2026-10-03** — "Closed" defined: a case closes when Phase 6 is
completed, and closed records that the case was worked, not how it
ended. Status now always shows with its outcome ("Closed · escalated")
on the case summary and the published-case list, from the Phase 5 path
or, failing that, the Phase 4 decision (`src/lib/case-status.ts`).

**2026-10-03** — Two fixes to the browser case log. Opening Triage no
longer saves an empty case: a new case lives in memory until Phase 0 is
completed, and empty drafts already saved are cleared when the case log
loads (they hold no answers, since answers save only on phase
completion). The Decision column shows "—" until Phase 4 is completed,
instead of the "Investigate" default every new case carries.

**2026-10-07** — Fourth published case: Plaid Link's "OAuth redirect URI
must be configured" message traced to two different root causes in public
artifacts (an expired link_token in plaid-link-ios #25, a blank
redirect_uri in tiny-quickstart #65).
