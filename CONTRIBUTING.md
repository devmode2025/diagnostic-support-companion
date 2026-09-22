# Contributing

Two rules keep this project coherent. Everything else is normal Next.js
and TypeScript work.

1. **Content changes go through `content/*.json`.**
2. **`docs/method.html` is frozen.**

If you only read one section, read the two below.

---

## Rule 1 — Content changes go through `content/*.json`

Every piece of reference material the app renders — the loop, the six
phases, severity, categories, metrics, glossary, fluency, framings — lives
in a JSON file under `content/`. No reference content is hardcoded into a
component.

### Why

Two reasons.

The first is that the method is expected to grow. Adding a phase, a
severity level, a glossary term, or an entirely new layer should be a
content edit, not a code change. The `TriageCase` type in
`src/types/triage.ts` is the single shape every feature reads from and
writes to. As long as content stays data, future features — LLM
summarization, pattern detection, post-mortem export — plug into that shape
rather than rewriting it.

The second is that duplication is a bug. If a phase name lives in two
places, they will eventually disagree, and the app will render one thing
while the README describes another. One file per concept, one author for
each change.

### How

When you add or change content:

1. Edit the relevant file under `content/`.
2. Match the existing shape exactly. Field names are load-bearing — they
   map to the `TriageCase` type and to the phase form renderer.
3. Keep the voice. This project's method document was written in a
   particular register — declarative, methodical, no hedging. When you
   convert prose into JSON strings, preserve the wording. Do not
   paraphrase.
4. If you add a new field, update `src/types/triage.ts` in the same
   commit. Do not leave the type behind the content.
5. If you add a new file, add it to the loader in `src/types/content.ts`
   and to whichever route renders it.

### What not to do

- Do not inline reference text into a React component. If you find
  yourself typing a phase name or a severity definition into JSX, stop
  and put it in the JSON.
- Do not create a second JSON file that duplicates part of an existing
  one. Extend the existing file instead.
- Do not use `**bold**` or `*italic*` markers in any field other than
  `glossary.definition`, `fluency.body`, and `framings.paragraphs`. Those
  are the only fields the reference component runs through the inline
  markdown pass.

---

## Rule 2 — `docs/method.html` is frozen

The original study outline for this project is preserved at
`docs/method.html` (and served at `/method.html`). It is a **provenance
artifact** — a record of the first draft. It is not edited.

### Why

The method document was the seed of the app, and it is worth keeping. But
a project with two documents describing the same method has two truths,
and the moment they diverge — one adding a phase the other doesn't have,
one revising a severity definition — readers can no longer tell which is
current. The cost of resolving that ambiguity every time is higher than
the cost of freezing one file.

So the JSON is authoritative. The HTML is history.

### How

- Do not edit `docs/method.html`.
- Do not edit `public/method.html`. It is the served copy of the same
  file and must stay byte-identical to `docs/method.html`.
- If the method changes substantively, change the JSON and tag the commit
  `METHOD-vN` so the divergence has a date.
- If you believe the HTML contains something the JSON does not, do not
  copy it by hand. Convert it into the JSON, in the same commit, and
  note what you moved.

### The two files must stay identical

`docs/method.html` is what a reader finds on GitHub.
`public/method.html` is what the app serves at `/method.html`. They are
the same artifact in two places.

If you are on Unix, a symlink is fine. If the repo has to build anywhere
that does not follow symlinks, commit two copies and add a CI check that
fails if `sha256` differs. Do not let them drift.

---

## Adding a new phase, layer, or reference section

The common case is that the method grows and a new section needs to be
represented in the app. The workflow is:

1. **Update the JSON first.** Add the new content to the relevant file
   under `content/`, matching the existing shape.
2. **Update `TriageCase` if needed.** If the new content is something a
   triage case records (a new prompt, a new phase), extend the type in the
   same commit.
3. **Update the renderer if needed.** If the new content is a new phase,
   add it to the phase form renderer. If it is a new reference section,
   add it to the reference tab's section list.
4. **Do not touch `docs/method.html`.** Even if the new content makes the
   original outline look incomplete, that is the point. The HTML records
   what the method was; the JSON records what it is.

A change that adds content without touching the type or the renderer is
fine — that is the whole benefit of content-as-data. A change that adds
content *by* touching the renderer without touching the JSON is the
thing Rule 1 exists to prevent.

---

## Working on the app

Beyond the two rules above, the project is standard:

- **Stack:** Next.js (App Router), TypeScript strict mode, React 18,
  Tailwind CSS.
- **No design system dependency.** The reference tab reuses the color
  tokens from the original method document (`--l1` through `--l4`, `--g`,
  etc.) via a small inline `colorFor` helper. If you carry those into
  Tailwind theme extensions later, do not duplicate hex values.
- **No AI calls in v1.** LLM summarization is a named increment (v3) and
  will live under `src/lib/ai/`. Do not add it earlier.
- **No external integrations in v1.** Slack, Zendesk, and Linear are v6
  and will live under `src/lib/integrations/`.
- **Persistence is `localStorage` in v1.** The repository module is
  `src/lib/cases.ts`. When v2 introduces server-side persistence, that
  module is the only thing that changes.

### Commit hygiene

- One concept per commit. "Add phase 4 prompts" and "fix typo in README"
  are two commits.
- Commit messages describe *what changed and why*, not *what file was
  touched*. "Add severity reconsideration prompt to Phase 2" is a good
  message. "Update phases.json" is not.
- If a commit changes content in a way that would invalidate an existing
  in-progress case in a user's `localStorage`, note it in the commit body.
  There is no migration mechanism yet; the assumption is that v1 users are
  the only users, and they are the author.

---

## The provenance paragraph

The README carries this in its "Provenance" section, and the `/method`
route repeats it in the app. It is the contract:

> This project began as a standalone study outline — the document
> preserved at [`docs/method.html`](docs/method.html). The outline is a
> **provenance artifact**: it is kept unchanged as a record of the first
> draft, and it is not edited.
>
> The authoritative version of the method lives in
> [`content/*.json`](content). All content changes go there. When the JSON
> and the HTML diverge, the JSON is correct.

If a contributor is ever unsure which file to edit, that paragraph is the
answer.

---

## When in doubt

Ask: **is this a change to what the method says, or a change to how the
method is presented?**

- If it is what the method says → `content/*.json`.
- If it is how the method is presented → the component, the route, or
  the styling.
- If it is neither, and the change is to the original study outline →
  it is not a change. The outline is frozen.

Two rules, one question, and the rest is normal work.