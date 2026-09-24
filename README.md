# Diagnostic Support Companion

A triage-first web app for support engineers. It walks a ticket through the
six-phase first-response gate from the diagnostic support engineering method,
produces a structured evidence bundle and a named decision at the end, and
stores each completed triage as a case.

The point is not to replace judgment. The point is to make judgment
repeatable — to give every ambiguous ticket the same disciplined first read,
and to leave a written record that makes the next responder faster.

- Live: [Diagnostic Support Companion](https://diagnostic-support-companion.replit.app)
- Method: [Full Study Outline](https://diagnostic-support-companion.replit.app/method)
- Open: [For Original Outline](https://diagnostic-support-companion.replit.app/method.html).

---

## The method

A diagnostic support engineer operates across four layers, with one gate
between observation and incident:

1. **Pre-production** — prevent and catch defects before they ship.
2. **Production runtime** — observe the live system and detect deviation.
3. **Incident response** — diagnose, mitigate, communicate.
4. **Post-incident** — learn, memorialize, and change the system.

Between Layer 2 and Layer 3 sits the **first-response gate** — a six-phase
assessment that decides whether a report becomes an incident at all. Most
tickets never pass through it, which is exactly why the gate matters.

The six phases:

| Phase | Purpose | Output |
|---|---|---|
| 0 · Receive | Establish a tracked unit of work | Ticket with metadata |
| 1 · Parse | Separate symptom from hypothesis from defect | Restated problem, scope |
| 2 · Classify | Assign category and severity | Provisional classification |
| 3 · Contextualize | Enrich with system evidence | Evidence bundle |
| 4 · Triage | Commit to a path | Named decision |
| 5 · Act | Execute with discipline | Resolution or handoff |
| 6 · Record | Close the loop | Updated record |

The tools change at every layer. The mindset does not: understand what
correct looks like, observe deviation, let evidence drive the diagnosis,
and write it down so the next person is faster.

---

## How to use it

1. Open `/triage` and start a new case.
2. Work through the six phases. Each phase has a purpose, prompts, a
   mindset panel, and anti-patterns to avoid.
3. At Phase 4, commit to a named decision. Phase 5 adapts to your choice.
4. At Phase 6, close the case. The app produces a case summary — restated
   problem, evidence bundle, decision, outcome, learning, and a
   template-based customer-facing status update draft.
5. Review completed cases at `/cases`. The **phase that mattered** column
   is the one worth reading.

Reference material — the loop, the gate, severity, categories, metrics,
glossary, fluency — is browsable at `/reference`.

---

## Why it's built this way

**Content as data.** Every piece of reference material lives in
`content/*.json`. No reference content is hardcoded into a component.
Adding a phase, a severity level, or an entire new layer is a content edit,
not a code change.

**One core data model, three views.** The `TriageCase` type in
`src/types/triage.ts` is the single shape that reference, triage, and case
log all read from and write to. Future features — LLM summarization,
pattern detection, post-mortem export — plug into this shape rather than
replacing it.

**Triage-first, reference-second.** The primary route is the triage flow,
because that is the skill the tool is meant to exercise. Reference is a
supporting tab, not the product.

**Local persistence in v1.** Cases are stored in `localStorage`. No
authentication, no server, no multi-user. These are deliberate non-goals
for v1 and named increments for later versions.

---

## Roadmap

| Version | Addition | Seam |
|---|---|---|
| v1 | Reference, Triage, Case Log | — |
| v2 | Reference search, case filtering, mobile polish | `/reference`, `/cases` |
| v3 | LLM-assisted phase summaries and status-update drafts | `src/lib/ai/` |
| v4 | Pattern detection across cases | `src/lib/analyzers/` |
| v5 | Post-mortem / RCA export | `src/lib/exports/` |
| v6 | Slack / Zendesk / Linear integration | `src/lib/integrations/` |

Each version is a module or content addition. None requires touching the
`TriageCase` shape.

---

## Stack

- Next.js (App Router) + TypeScript strict mode
- React 18
- Tailwind CSS
- localStorage for v1 persistence

No design system dependency. No AI calls in v1. No external integrations
in v1.

---

## Built on Replit

This app is built and deployed on Replit, and linked to its GitHub repo
from the first commit. The Repl is the working environment; GitHub is the
canonical source.

Live: _add your Replit deployment URL here after publishing_

---

## Provenance

This project began as a standalone study outline — the document preserved
at [`docs/method.html`](docs/method.html). The outline is a **provenance
artifact**: it is kept unchanged as a record of the first draft, and it is
not edited.

The authoritative version of the method lives in
[`content/*.json`](content). All content changes go there. When the JSON
and the HTML diverge, the JSON is correct.

---

## Source

GitHub: https://github.com/devmode2025/diagnostic-support-companion

- Live: [Diagnostic Support Companion](https://diagnostic-support-companion.replit.app)
- Method: [Full Study Outline](https://diagnostic-support-companion.replit.app/method)
- Open: [For Original Outline](https://diagnostic-support-companion.replit.app/method.html).

---

## What fluency looks like

An interviewer probing this role is usually testing fluency across the
loop. Concretely, that means five things:

1. **You know which tool answers which question.** APM traces answer
   *where is it slow?* Logs answer *what did the code do?* RUM answers
   *what did the user see?* Session replay answers *what did the user do?*
   Post-mortems answer *why did this happen?*
2. **You know which document governs which moment.** A runbook governs a
   known task. A playbook governs a class of incident. A SOP governs a
   recurring workflow. A post-mortem governs learning.
3. **You know when to stop one activity and start another.** Stop
   diagnosing and start mitigating when customer impact is severe. Stop
   mitigating and start analyzing when the bleed is under control.
4. **You know what the loop produces.** Every incident should produce at
   least one of: a new test, a new alert, a new runbook entry, a playbook
   revision, a new SOP, or a new design constraint.
5. **You know what the loop consumes.** Every incident consumes the
   observability built in Layer 2 and the procedures written in Layers 1
   and 2. Where those were inadequate, the incident ran longer than it
   should have — and the fix belongs upstream.

---

## Non-goals

To keep v1 shippable, the following are explicitly out of scope:

- Authentication
- LLM calls or AI summarization
- Pattern detection across cases
- External integrations (Slack, Zendesk, Linear)
- Post-mortem / RCA export
- Multi-user or server-side persistence
- Mobile responsiveness beyond "doesn't break"

Each is a named increment in the roadmap, not a missing feature.
