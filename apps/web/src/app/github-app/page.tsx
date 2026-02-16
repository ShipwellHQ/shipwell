"use client";

import { motion } from "framer-motion";
import {
  GitPullRequest, Shield, Check, ChevronRight, Copy,
  Terminal, Globe, ArrowRight, FileCode, Lock,
  Settings, ExternalLink, Ship, Zap, BookOpen,
} from "lucide-react";
import Link from "next/link";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { useState } from "react";

// ── Copy button ────────────────────────────────────────────
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className="text-text-dim hover:text-accent transition-colors p-1"
      title="Copy"
    >
      {copied ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
}

// ── Code block ─────────────────────────────────────────────
function CodeBlock({ children, copyText }: { children: string; copyText?: string }) {
  return (
    <div className="group relative bg-bg rounded-xl border border-border overflow-hidden">
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <CopyButton text={copyText || children} />
      </div>
      <pre className="px-4 py-3 text-[13px] font-mono text-text-muted overflow-x-auto">
        <code>{children}</code>
      </pre>
    </div>
  );
}

// ── Data ───────────────────────────────────────────────────
const permissions = [
  { scope: "Contents", access: "Read & Write", desc: "Read files to generate diffs, write fixes to new branches", icon: FileCode },
  { scope: "Pull Requests", access: "Read & Write", desc: "Create PRs with analysis results and suggested fixes", icon: GitPullRequest },
];

const steps = [
  {
    step: "1",
    title: "Install the App",
    desc: "Click the button below to install the ShipwellHQ GitHub App on your repositories. You can grant access to all repos or select specific ones.",
    icon: Settings,
  },
  {
    step: "2",
    title: "Run an Analysis",
    desc: "Use the Shipwell web app or CLI to analyze a repository where the app is installed. Findings with auto-fix diffs will be detected.",
    icon: Zap,
  },
  {
    step: "3",
    title: "Create a Fix PR",
    desc: "Click \"Create Fix PR\" on the web or pass --create-pr in the CLI. Shipwell creates a branch, applies diffs, and opens a PR authored by ShipwellHQ[bot].",
    icon: GitPullRequest,
  },
];

const faqs = [
  {
    q: "What repositories can the app access?",
    a: "Only the repositories you explicitly grant access to during installation. You can change this anytime in your GitHub settings.",
  },
  {
    q: "Does the app read my code?",
    a: "The app only accesses file contents when creating a fix PR — it reads the targeted files to apply diffs. Your code is never stored on our servers. The analysis itself uses your own Anthropic API key, not the GitHub App.",
  },
  {
    q: "Can I review changes before they're merged?",
    a: "Absolutely. The app creates a standard pull request, not a direct commit. You review the diff, request changes, or merge — just like any other PR.",
  },
  {
    q: "What if a diff fails to apply?",
    a: "If a file has changed since the analysis, that particular fix is skipped. The PR summary shows applied, skipped, and failed counts so you know exactly what happened.",
  },
  {
    q: "How do I uninstall the app?",
    a: "Go to github.com/settings/installations, find ShipwellHQ, and click Configure > Uninstall. All access is revoked immediately.",
  },
  {
    q: "Does it work with private repositories?",
    a: "Yes. The GitHub App authenticates server-side with its own credentials, so it can access any repo you've granted it permission to — public or private.",
  },
];

// ── Page ───────────────────────────────────────────────────
export default function GitHubAppPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid" />
        <div className="absolute inset-0 bg-radial-glow" />

        <div className="relative max-w-4xl mx-auto px-6 pt-20 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/8 text-accent text-[13px] mb-6 border border-accent/15 font-medium"
            >
              <GitPullRequest className="w-3.5 h-3.5" />
              GitHub Integration
            </motion.div>

            <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-[1.1] mb-4" style={{ fontFamily: "Menlo, Monaco, 'Courier New', monospace" }}>
              ShipwellHQ <span className="gradient-text">GitHub App</span>
            </h1>
            <p className="text-text-muted text-lg max-w-2xl mx-auto mb-8">
              Automatically create pull requests with suggested fixes from your Shipwell analysis.
              PRs are authored by <span className="text-accent font-medium">ShipwellHQ[bot]</span> and ready for review.
            </p>

            <div className="flex items-center justify-center gap-4">
              <a
                href="https://github.com/apps/shipwellhq"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-accent hover:bg-accent-hover text-white font-semibold rounded-xl transition-all duration-300 glow-accent-lg text-[15px] hover:scale-[1.02]"
              >
                <GitPullRequest className="w-5 h-5" />
                Install GitHub App
                <ExternalLink className="w-4 h-4" />
              </a>
              <Link
                href="/cli"
                className="inline-flex items-center gap-2 px-6 py-3.5 border border-border hover:border-accent/30 text-text-muted hover:text-text rounded-xl transition-all duration-300 text-[15px] font-medium"
              >
                <Terminal className="w-4 h-4" />
                CLI Docs
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* How It Works */}
      <div className="border-t border-border bg-bg-card/30">
        <div className="max-w-4xl mx-auto px-6 py-20">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold mb-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
                <Zap className="w-4 h-4 text-accent" />
              </div>
              How It Works
            </h2>
            <p className="text-text-muted text-sm mb-10 ml-11">
              Three steps from analysis to pull request.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {steps.map((s, i) => (
                <motion.div
                  key={s.step}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="relative bg-bg border border-border rounded-xl p-6 hover:border-border-bright transition-all"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center relative">
                      <s.icon className="w-5 h-5 text-accent" />
                      <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-accent text-white text-[10px] font-bold flex items-center justify-center">
                        {s.step}
                      </div>
                    </div>
                    <h3 className="font-semibold text-[15px]">{s.title}</h3>
                  </div>
                  <p className="text-text-muted text-sm leading-relaxed">{s.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* PR Demo */}
      <div className="max-w-4xl mx-auto px-6 py-20 w-full">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold mb-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
              <GitPullRequest className="w-4 h-4 text-accent" />
            </div>
            What You Get
          </h2>
          <p className="text-text-muted text-sm mb-10 ml-11">
            A clean pull request with all applicable fixes, ready for review.
          </p>

          {/* Mock PR */}
          <div className="border border-border rounded-xl overflow-hidden bg-bg shadow-2xl shadow-black/30">
            {/* PR header */}
            <div className="px-6 py-5 border-b border-border bg-bg-elevated/50">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-accent/15 border border-accent/20 flex items-center justify-center mt-0.5 shrink-0">
                  <Ship className="w-4 h-4 text-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 text-[11px] font-medium border border-green-500/20">
                      Open
                    </span>
                    <h3 className="font-semibold text-[15px] text-text truncate">
                      fix(security): resolve 8 findings from Shipwell audit
                    </h3>
                  </div>
                  <p className="text-text-dim text-[12px]">
                    <span className="text-accent font-medium">shipwellhq[bot]</span>
                    {" "}wants to merge 1 commit into <code className="text-text-muted bg-bg px-1.5 py-0.5 rounded text-[11px]">main</code> from <code className="text-text-muted bg-bg px-1.5 py-0.5 rounded text-[11px]">shipwell/fix-audit-1739234582</code>
                  </p>
                </div>
              </div>
            </div>

            {/* PR body */}
            <div className="px-6 py-5 text-sm">
              <div className="prose prose-invert prose-sm max-w-none">
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="w-4 h-4 text-accent" />
                  <span className="font-semibold text-text">Shipwell Security Audit</span>
                </div>
                <p className="text-text-muted text-[13px] leading-relaxed mb-4">
                  This PR applies auto-fixes for findings detected by Shipwell&apos;s cross-file analysis.
                </p>

                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="bg-green-500/8 border border-green-500/15 rounded-lg px-4 py-3 text-center">
                    <div className="text-xl font-bold text-green-400">8</div>
                    <div className="text-[11px] text-text-dim uppercase tracking-wider mt-0.5">Applied</div>
                  </div>
                  <div className="bg-amber-500/8 border border-amber-500/15 rounded-lg px-4 py-3 text-center">
                    <div className="text-xl font-bold text-amber-400">2</div>
                    <div className="text-[11px] text-text-dim uppercase tracking-wider mt-0.5">Skipped</div>
                  </div>
                  <div className="bg-red-500/8 border border-red-500/15 rounded-lg px-4 py-3 text-center">
                    <div className="text-xl font-bold text-red-400">0</div>
                    <div className="text-[11px] text-text-dim uppercase tracking-wider mt-0.5">Failed</div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  {[
                    { severity: "CRITICAL", color: "text-red-400", title: "SQL injection in src/db/queries.ts" },
                    { severity: "HIGH", color: "text-amber-400", title: "Hardcoded secret in src/config/auth.ts" },
                    { severity: "HIGH", color: "text-amber-400", title: "Missing rate limiting on API routes" },
                    { severity: "MEDIUM", color: "text-yellow-400", title: "Weak password hashing in src/auth/hash.ts" },
                  ].map((f, i) => (
                    <div key={i} className="flex items-center gap-2 text-[13px]">
                      <Check className="w-3.5 h-3.5 text-green-400 shrink-0" />
                      <span className={`font-mono text-[11px] font-medium ${f.color} w-16 shrink-0`}>{f.severity}</span>
                      <span className="text-text-muted truncate">{f.title}</span>
                    </div>
                  ))}
                  <div className="text-text-dim text-[12px] pl-[22px]">+ 4 more fixes applied</div>
                </div>
              </div>
            </div>

            {/* PR footer */}
            <div className="px-6 py-3 border-t border-border bg-bg-elevated/30 flex items-center justify-between">
              <span className="text-[11px] text-text-dim">Generated by Shipwell</span>
              <div className="flex items-center gap-2 text-[11px]">
                <span className="text-green-400">+124</span>
                <span className="text-red-400">-47</span>
                <span className="text-text-dim">across 6 files</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Usage: Web + CLI */}
      <div className="border-t border-border bg-bg-card/30">
        <div className="max-w-4xl mx-auto px-6 py-20">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold mb-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
                <Terminal className="w-4 h-4 text-accent" />
              </div>
              Usage
            </h2>
            <p className="text-text-muted text-sm mb-10 ml-11">
              Create fix PRs from the web app or the CLI.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Web */}
              <div className="border border-border rounded-xl p-6 bg-bg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center">
                    <Globe className="w-4.5 h-4.5 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[15px]">Web App</h3>
                    <p className="text-text-dim text-[12px]">shipwell.app</p>
                  </div>
                </div>
                <ol className="space-y-2.5 text-sm text-text-muted">
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent text-[10px] font-bold shrink-0 mt-0.5">1</span>
                    <span>Run an analysis on a GitHub repository</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent text-[10px] font-bold shrink-0 mt-0.5">2</span>
                    <span>Review findings with auto-fix diffs</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent text-[10px] font-bold shrink-0 mt-0.5">3</span>
                    <span>Click <span className="text-accent font-medium">&quot;Create Fix PR&quot;</span> to open a PR</span>
                  </li>
                </ol>
              </div>

              {/* CLI */}
              <div className="border border-border rounded-xl p-6 bg-bg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center">
                    <Terminal className="w-4.5 h-4.5 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[15px]">CLI</h3>
                    <p className="text-text-dim text-[12px]">@shipwellapp/cli</p>
                  </div>
                </div>
                <div className="space-y-2.5">
                  <CodeBlock copyText="shipwell audit https://github.com/acme/api --create-pr">{`shipwell audit <repo> --create-pr`}</CodeBlock>
                  <CodeBlock copyText="shipwell audit ./my-project --create-pr --yes">{`shipwell audit ./local --create-pr --yes`}</CodeBlock>
                  <p className="text-text-dim text-[12px] mt-3">
                    Works with all operations: <code className="text-text-muted">audit</code>, <code className="text-text-muted">migrate</code>, <code className="text-text-muted">refactor</code>, <code className="text-text-muted">docs</code>, <code className="text-text-muted">upgrade</code>
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Permissions */}
      <div className="max-w-4xl mx-auto px-6 py-20 w-full">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold mb-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
              <Lock className="w-4 h-4 text-accent" />
            </div>
            Permissions
          </h2>
          <p className="text-text-muted text-sm mb-10 ml-11">
            The app requests only the minimum permissions needed to create fix PRs.
          </p>

          <div className="bg-bg-card border border-border rounded-xl overflow-hidden">
            {permissions.map((p, i) => (
              <div
                key={p.scope}
                className={`flex items-center gap-5 px-6 py-4.5 ${i !== permissions.length - 1 ? "border-b border-border" : ""}`}
              >
                <div className="w-9 h-9 rounded-lg bg-accent/8 border border-accent/15 flex items-center justify-center shrink-0">
                  <p.icon className="w-4 h-4 text-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-semibold text-sm text-text">{p.scope}</span>
                    <span className="text-[11px] text-accent bg-accent/8 px-2 py-0.5 rounded-full border border-accent/15 font-medium">{p.access}</span>
                  </div>
                  <p className="text-text-muted text-[13px]">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-start gap-3 bg-green-500/5 border border-green-500/15 rounded-xl p-4">
            <Shield className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-green-400 mb-1">Privacy & Security</p>
              <p className="text-text-muted text-[13px] leading-relaxed">
                The app never stores your code. File contents are read only at PR creation time to apply diffs, then discarded.
                All analysis is performed using your own Anthropic API key — your code goes directly to Anthropic, not through our servers.
                GitHub App credentials are stored securely server-side and never exposed to the browser.
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* FAQ */}
      <div className="border-t border-border bg-bg-card/30">
        <div className="max-w-4xl mx-auto px-6 py-20">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold mb-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-accent" />
              </div>
              FAQ
            </h2>
            <p className="text-text-muted text-sm mb-10 ml-11">
              Common questions about the GitHub App.
            </p>

            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  className="border border-border rounded-xl p-5 bg-bg hover:border-border-bright transition-colors"
                >
                  <h3 className="font-semibold text-sm text-text mb-2">{faq.q}</h3>
                  <p className="text-text-muted text-[13px] leading-relaxed">{faq.a}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* CTA */}
      <div className="border-t border-border">
        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <Ship className="w-10 h-10 text-accent mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-3">Ready to automate fixes?</h2>
            <p className="text-text-muted text-sm mb-8 max-w-md mx-auto">
              Install the GitHub App, run an analysis, and get a fix PR in minutes.
            </p>
            <div className="flex items-center justify-center gap-4">
              <a
                href="https://github.com/apps/shipwellhq"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-accent hover:bg-accent-hover text-white font-semibold rounded-xl transition-all duration-300 glow-accent text-[15px]"
              >
                <GitPullRequest className="w-5 h-5" />
                Install ShipwellHQ
                <ArrowRight className="w-4 h-4" />
              </a>
              <Link
                href="/analysis"
                className="inline-flex items-center gap-2 px-6 py-3.5 border border-border hover:border-accent/30 text-text-muted hover:text-text rounded-xl transition-all duration-300 text-[15px] font-medium"
              >
                Start Analysis
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
