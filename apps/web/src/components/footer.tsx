"use client";

import { useState } from "react";
import Link from "next/link";
import { Ship, Heart } from "lucide-react";

const MENLO = "Menlo, Monaco, 'Courier New', monospace";

const FAQS = [
  { q: "What is Shipwell?", a: "Shipwell is a CLI tool that ingests your entire codebase into Claude Opus 4.6's 1M token context window for deep cross-file analysis. It supports five operations: audit, migrate, refactor, docs, and upgrade." },
  { q: "Is my code safe?", a: "Yes. Your code is sent directly to Anthropic's API over an encrypted connection. Nothing is stored, logged, or cached on our servers. We never see your source code." },
  { q: "What languages are supported?", a: "Shipwell works with any programming language — TypeScript, JavaScript, Python, Go, Rust, Java, Ruby, C#, and more. If it's text-based source code, Shipwell can analyze it." },
  { q: "How does the auto-fix PR work?", a: "When Shipwell finds issues with actionable fixes, it generates diffs. With the --create-pr flag and our GitHub App installed, those diffs are pushed as a pull request to your repository automatically." },
];

function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="mt-16 px-6 md:px-0 flex flex-col md:flex-row gap-10" style={{ fontFamily: MENLO }}>
      {/* FAQ — left */}
      <div className="flex-1">
        <h3 className="text-text text-2xl font-semibold mb-6">FAQ</h3>
        <div className="space-y-2">
          {FAQS.map((faq, i) => (
            <div key={i} className="border border-border rounded-xl overflow-hidden">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-bg-elevated/50 transition-colors"
              >
                <span className="text-sm text-text">{faq.q}</span>
                <span className={`text-accent text-lg shrink-0 ml-4 transition-transform duration-200 ${open === i ? "rotate-45" : ""}`}>+</span>
              </button>
              <div
                className="grid transition-all duration-300 ease-in-out"
                style={{ gridTemplateRows: open === i ? "1fr" : "0fr" }}
              >
                <div className="overflow-hidden">
                  <p className="px-5 pb-5 pt-1 text-sm text-text-muted leading-relaxed">{faq.a}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Support — right */}
      <div className="md:w-80 shrink-0">
        <h3 className="text-text text-2xl font-semibold mb-6">Support</h3>
        <div className="border border-border rounded-xl p-6 bg-bg-elevated/30">
          <Heart className="w-8 h-8 text-accent mb-4" />
          <p className="text-sm text-text mb-2 font-semibold">Back this project</p>
          <p className="text-sm text-text-muted leading-relaxed mb-6">
            Shipwell is open-source and community-driven. If it saves you time, consider sponsoring to keep development going.
          </p>
          <div className="space-y-3">
            <a
              href="https://github.com/sponsors/manasdutta04"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 w-full px-4 py-3 rounded-lg border border-accent/30 bg-accent/5 text-sm text-accent hover:bg-accent/10 transition-colors"
            >
              <Heart className="w-4 h-4" />
              Sponsor on GitHub
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function FooterBar() {
  return (
    <div className="w-full px-6 py-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-2" style={{ fontFamily: MENLO }}>
      <p className="text-text-dim text-sm">&copy; 2026 Shipwell. All rights reserved. Developed by Manas Dutta</p>
      <div className="flex items-center gap-4 text-text-dim text-sm">
        <Link href="/docs#cli" className="hover:text-accent transition-colors">CLI</Link>
        <Link href="/docs#github-app" className="hover:text-accent transition-colors">GitHub App</Link>
        <a href="https://github.com/ShipwellHQ/shipwell" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">GitHub</a>
        <Link href="/terms" className="hover:text-accent transition-colors">Terms</Link>
        <Link href="/privacy" className="hover:text-accent transition-colors">Privacy</Link>
      </div>
    </div>
  );
}

export function Footer({ minimal = false }: { minimal?: boolean }) {
  if (minimal) {
    return (
      <footer className="w-full mt-auto">
        <FooterBar />
      </footer>
    );
  }

  return (
    <footer className="w-full px-6 relative py-0 mt-28 h-auto mb-0 bg-bg-card overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-8 right-6 text-accent text-2xl">+</div>
      <div className="absolute top-1/2 right-12 text-accent text-lg -translate-y-1/2">{"\u2726"}</div>
      <div className="absolute bottom-24 right-20 text-accent text-xl">+</div>
      <div className="absolute top-16 right-32 text-accent text-sm">{"\u2726"}</div>
      <div className="absolute bottom-20 right-8 text-accent text-lg">{"\u2726"}</div>

      <div className="max-w-[1200px] mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between">
          {/* Left content */}
          <div className="flex-1 max-w-lg mt-8">
            <h2
              className="text-text text-4xl md:text-5xl mb-8 leading-[3.5rem] md:leading-[4rem] font-semibold text-center md:text-left"
              style={{ fontFamily: MENLO }}
            >
              See What Others Miss.
            </h2>

            <div className="space-y-4 text-text" style={{ fontFamily: MENLO }}>
              <div className="flex items-start gap-3">
                <span className="text-accent mt-1">{"\u2022"}</span>
                <p className="text-sm">Your entire codebase in one prompt — cross-file vulnerabilities, circular dependencies, dead code paths.</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-accent mt-1">{"\u2022"}</span>
                <p className="text-sm">One command. Five operations. Auto-fix PRs pushed to your repo in seconds.</p>
              </div>
            </div>
          </div>

          {/* Right — large ship icon */}
          <div className="hidden md:flex flex-1 justify-end items-center">
            <Ship className="w-48 h-48 text-accent opacity-10" />
          </div>
        </div>

        {/* FAQ */}
        <FAQSection />

        <div className="mt-16">
          <FooterBar />
        </div>
      </div>
    </footer>
  );
}
