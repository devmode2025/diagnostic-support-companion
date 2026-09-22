// src/app/method/page.tsx

import Link from "next/link";

export default function MethodPage() {
  return (
    <div className="max-w-2xl mx-auto px-8 py-16">
      <header className="mb-10 pb-6 border-b-2 border-neutral-900">
        <p className="text-xs uppercase tracking-wider text-neutral-500 mb-2">
          Provenance
        </p>
        <h1 className="text-3xl font-semibold text-neutral-900 mb-3">
          The method
        </h1>
      </header>

      <p className="text-base text-neutral-700 leading-relaxed mb-4">
        This project began as a standalone study outline for diagnostic support
        engineering — four layers, one gate, one loop. It was written first, in
        long-form HTML, as a way of working out what the role actually does
        across the full lifecycle of a system.
      </p>

      <p className="text-base text-neutral-700 leading-relaxed mb-4">
        The app you are using now is an attempt to operationalize that outline.
        The current version of the method lives in{" "}
        <code className="font-mono text-sm bg-neutral-100 px-1 py-0.5 rounded-sm">
          content/*.json
        </code>{" "}
        and is rendered at{" "}
        <Link href="/reference" className="underline">
          /reference
        </Link>
        . When the method changes, the JSON changes.
      </p>

      <p className="text-base text-neutral-700 leading-relaxed mb-8">
        The original outline is preserved unchanged at{" "}
        <a href="/method.html" className="underline">
          /method.html
        </a>
        . It is a provenance artifact — a record of the first draft. It is not
        edited, and when it diverges from the JSON, the JSON is correct.
      </p>

      <div className="border border-neutral-300 rounded-sm p-6 mb-8">
        <p className="text-sm text-neutral-600 mb-4">
          The two artifacts serve different purposes.
        </p>
        <div className="grid grid-cols-2 gap-6 text-sm">
          <div>
            <p className="font-semibold text-neutral-800 mb-2">
              Original outline
            </p>
            <p className="text-neutral-600 leading-relaxed">
              Preserved. Read-only. Captures what the method was when the
              project started.
            </p>
          </div>
          <div>
            <p className="font-semibold text-neutral-800 mb-2">
              Current method
            </p>
            <p className="text-neutral-600 leading-relaxed">
              Editable. Authoritative. Edited in{" "}
              <code className="font-mono text-xs">content/*.json</code>,
              rendered in the app.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-6 text-sm">
        <a
          href="/method.html"
          className="underline text-neutral-900 font-medium"
        >
          Open the original outline →
        </a>
        <Link href="/reference" className="underline text-neutral-600">
          Open the current method
        </Link>
        <Link href="/triage" className="underline text-neutral-600">
          Start a triage
        </Link>
      </div>

      <footer className="mt-16 pt-6 border-t border-neutral-200 text-xs text-neutral-500 leading-relaxed">
        The convention that governs this relationship is documented in{" "}
        <a
          href="https://github.com/devmode2025/diagnostic-support-companion/blob/main/CONTRIBUTING.md"
          className="underline"
        >
          CONTRIBUTING.md
        </a>
        . Two rules, one question: if a change is to what the method says, edit
        the JSON. If it is to how the method is presented, edit the code. The
        outline itself is frozen.
      </footer>
    </div>
  );
}
