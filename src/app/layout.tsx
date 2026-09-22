// src/app/layout.tsx

import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Diagnostic Support Companion",
  description:
    "A triage-first tool for walking a support ticket through a six-phase first-response assessment.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white text-neutral-900 antialiased">
        <header className="border-b border-neutral-200">
          <div className="max-w-5xl mx-auto px-8 py-4 flex items-center gap-6 text-sm">
            <Link
              href="/"
              className="font-semibold text-neutral-900 tracking-tight"
            >
              Diagnostic Support Companion
            </Link>
            <nav className="flex items-center gap-5 ml-auto">
              <Link
                href="/triage"
                className="text-neutral-600 hover:text-neutral-900"
              >
                Triage
              </Link>
              <Link
                href="/reference"
                className="text-neutral-600 hover:text-neutral-900"
              >
                Reference
              </Link>
              <Link
                href="/cases"
                className="text-neutral-600 hover:text-neutral-900"
              >
                Cases
              </Link>
              <Link
                href="/method"
                className="text-neutral-600 hover:text-neutral-900"
              >
                Method
              </Link>
            </nav>
          </div>
        </header>

        {children}

        <footer className="border-t border-neutral-200 mt-20">
          <div className="max-w-5xl mx-auto px-8 py-6 text-xs text-neutral-500 flex flex-wrap gap-x-6 gap-y-2">
            <span>
              Built on Replit ·{" "}
              <a
                href="https://github.com/devmode2025/diagnostic-support-companion"
                className="underline hover:text-neutral-900"
              >
                source on GitHub
              </a>
            </span>
            <a href="/method.html" className="underline hover:text-neutral-900">
              Original outline
            </a>
            <Link href="/method" className="underline hover:text-neutral-900">
              Provenance
            </Link>
          </div>
        </footer>
      </body>
    </html>
  );
}
