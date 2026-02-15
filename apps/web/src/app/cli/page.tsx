"use client";

import { motion } from "framer-motion";
import {
  Terminal, Copy, Check, Shield, ArrowRight, GitBranch,
  BookOpen, PackageCheck, LogIn, Settings, Cpu, RefreshCw,
  ChevronRight, Download, Ship, ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { Footer } from "@/components/footer";
import { useState } from "react";
import { Navbar } from "@/components/navbar";

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

// ── Terminal mockup ────────────────────────────────────────
function TerminalWindow({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border overflow-hidden bg-bg shadow-2xl shadow-black/40">
      <div className="flex items-center gap-2 px-4 py-2.5 bg-bg-elevated border-b border-border">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/60" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
          <div className="w-3 h-3 rounded-full bg-green-500/60" />
        </div>
        <span className="text-[11px] text-text-dim font-mono ml-2">{title}</span>
      </div>
      <div className="p-4 font-mono text-[13px] leading-relaxed overflow-x-auto">
        {children}
      </div>
    </div>
  );
}

// ── Data ───────────────────────────────────────────────────
const operations = [
  { cmd: "audit", arg: "<path>", icon: Shield, color: "text-red-400", bg: "bg-red-500/8 border-red-500/15", desc: "Run a comprehensive security audit across your entire codebase. Detects vulnerabilities, injection risks, auth flaws, and cross-file security issues." },
  { cmd: "migrate", arg: "<path>", icon: ArrowRight, color: "text-blue-400", bg: "bg-blue-500/8 border-blue-500/15", desc: "Plan framework and library migrations with complete file diffs, dependency chain analysis, and step-by-step migration guides." },
  { cmd: "refactor", arg: "<path>", icon: GitBranch, color: "text-purple-400", bg: "bg-purple-500/8 border-purple-500/15", desc: "Detect code smells, duplication, circular dependencies, dead code, and architecture issues with concrete fix suggestions." },
  { cmd: "docs", arg: "<path>", icon: BookOpen, color: "text-emerald-400", bg: "bg-emerald-500/8 border-emerald-500/15", desc: "Generate comprehensive documentation including architecture overviews, data flow diagrams, API references, and module guides." },
  { cmd: "upgrade", arg: "<path>", icon: PackageCheck, color: "text-amber-400", bg: "bg-amber-500/8 border-amber-500/15", desc: "Analyze all dependencies, find known vulnerabilities, check for breaking changes, and plan safe version upgrades." },
];

const commands = [
  { cmd: "login", icon: LogIn, desc: "Sign in with Google via browser" },
  { cmd: "logout", icon: LogIn, desc: "Sign out and clear credentials" },
  { cmd: "whoami", icon: Settings, desc: "Show current user, API key status, and model" },
  { cmd: "config set api-key <key>", icon: Settings, desc: "Set your Anthropic API key" },
  { cmd: "config set model <model>", icon: Cpu, desc: "Set the Claude model to use" },
  { cmd: "delete-key", icon: Settings, desc: "Remove stored Anthropic API key" },
  { cmd: "interactive", icon: Terminal, desc: "Launch interactive guided mode" },
  { cmd: "models", icon: Cpu, desc: "List all available Claude models" },
  { cmd: "update", icon: RefreshCw, desc: "Update CLI to the latest version" },
];

const flags = [
  { flag: "-k, --api-key <key>", desc: "Override the stored API key for this run" },
  { flag: "-m, --model <model>", desc: "Override the model (e.g. claude-sonnet-4-5-20250929)" },
  { flag: "-t, --target <target>", desc: "Migration target framework/library" },
  { flag: "-c, --context <ctx>", desc: "Additional context for the analysis" },
  { flag: "-r, --raw", desc: "Print raw streaming output alongside formatted results" },
  { flag: "-y, --yes", desc: "Skip cost confirmation prompt" },
  { flag: "-o, --output <path>", desc: "Export report to file (.md or .json)" },
];

// ── Page ───────────────────────────────────────────────────
export default function CliPage() {
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
              <Terminal className="w-3.5 h-3.5" />
              Command Line Interface
            </motion.div>

            <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-[1.1] mb-4">
              Shipwell <span className="gradient-text">CLI</span>
            </h1>
            <p className="text-text-muted text-lg max-w-xl mx-auto mb-8">
              Deep cross-file codebase analysis from your terminal.
              Powered by Claude with up to 1M token context.
            </p>

            <div className="flex items-center justify-center gap-3">
              <div className="flex items-center gap-2 bg-bg-card border border-border rounded-xl px-5 py-3 font-mono text-sm">
                <span className="text-text-dim">$</span>
                <span className="text-accent">npm install -g @shipwellapp/cli</span>
                <CopyButton text="npm install -g @shipwellapp/cli" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Terminal Demo */}
      <div className="max-w-4xl mx-auto px-6 -mt-2 mb-16 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <TerminalWindow title="Terminal">
            <div className="text-text-dim">
              <span className="text-success">$</span> <span className="text-text">shipwell</span>
            </div>
            <div className="mt-3 text-text-dim">
              <span className="text-border-bright">{`╭─`}</span> <span className="text-accent">Shipwell</span> <span className="text-text-dim">v0.2.9</span> <span className="text-border-bright">{`${"─".repeat(50)}╮`}</span>
            </div>
            <div className="text-text-dim">
              <span className="text-border-bright">{`│`}</span>
              {"                                "}
              <span className="text-border-bright">{`│`}</span>
            </div>
            <div>
              <span className="text-border-bright">{`│`}</span>
              {"  "}
              <span className="text-text">Welcome back, </span>
              <span className="text-accent">Manas</span>
              {"!"}
              {"                  "}
              <span className="text-border-bright">{`│`}</span>
              {"  "}
              <span className="font-bold text-text">Getting started</span>
            </div>
            <div>
              <span className="text-border-bright">{`│`}</span>
              {"                                "}
              <span className="text-border-bright">{`│`}</span>
              {"  "}
              <span className="text-cyan-400">audit</span>
              <span className="text-text-dim">{" <path>      Security audit"}</span>
            </div>
            <div>
              <span className="text-border-bright">{`│`}</span>
              {"  "}
              <span className="text-accent">{`╔═╗╦ ╦╦╔═╗╦ ╦╔═╗╦  ╦`}</span>
              {"    "}
              <span className="text-border-bright">{`│`}</span>
              {"  "}
              <span className="text-cyan-400">migrate</span>
              <span className="text-text-dim">{" <path>    Migration plan"}</span>
            </div>
            <div>
              <span className="text-border-bright">{`│`}</span>
              {"  "}
              <span className="text-accent">{`╚═╗╠═╣║╠═╝║║║╠═ ║  ║`}</span>
              {"    "}
              <span className="text-border-bright">{`│`}</span>
              {"  "}
              <span className="text-cyan-400">refactor</span>
              <span className="text-text-dim">{" <path>   Refactor analysis"}</span>
            </div>
            <div>
              <span className="text-border-bright">{`│`}</span>
              {"  "}
              <span className="text-accent">{`╚═╝╩ ╩╩╩  ╚╩╝╚═╝╩═╝╩═╝`}</span>
              {"  "}
              <span className="text-border-bright">{`│`}</span>
              {"  "}
              <span className="text-cyan-400">docs</span>
              <span className="text-text-dim">{" <path>       Documentation"}</span>
            </div>
            <div className="text-text-dim">
              <span className="text-border-bright">{`│`}</span>
              {"                                "}
              <span className="text-border-bright">{`│`}</span>
              {"  "}
              <span className="text-cyan-400">upgrade</span>
              <span className="text-text-dim">{" <path>    Dep upgrade plan"}</span>
            </div>
            <div>
              <span className="text-border-bright">{`│`}</span>
              {"  "}
              <span className="text-accent">Claude Sonnet 4.5</span>
              <span className="text-text-dim">{" · "}</span>
              <span className="text-success">{"●"}</span>
              <span className="text-text-dim">{" API Key"}</span>
              {"       "}
              <span className="text-border-bright">{`│`}</span>
              {"  "}
              <span className="font-bold text-text">Account & Config</span>
            </div>
            <div className="text-text-dim">
              <span className="text-border-bright">{`╰${"─".repeat(64)}╯`}</span>
            </div>
          </TerminalWindow>
        </motion.div>
      </div>

      {/* Quick Start */}
      <div className="max-w-4xl mx-auto px-6 mb-20 w-full">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
              <Download className="w-4 h-4 text-accent" />
            </div>
            Quick Start
          </h2>

          <div className="grid gap-4">
            {[
              { step: "1", title: "Install", code: "npm install -g @shipwellapp/cli" },
              { step: "2", title: "Login", code: "shipwell login" },
              { step: "3", title: "Set API Key", code: "shipwell config set api-key sk-ant-api03-..." },
              { step: "4", title: "Analyze", code: "shipwell audit https://github.com/your/repo" },
            ].map((s, i) => (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.08 }}
                className="flex items-center gap-4 group"
              >
                <div className="w-8 h-8 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent text-sm font-bold shrink-0">
                  {s.step}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium text-text-muted mr-3">{s.title}</span>
                </div>
                <div className="flex-[2] min-w-0">
                  <CodeBlock copyText={s.code}>{s.code}</CodeBlock>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Analysis Operations */}
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
                <Cpu className="w-4 h-4 text-accent" />
              </div>
              Analysis Operations
            </h2>
            <p className="text-text-muted text-sm mb-10 ml-11">
              Each operation ingests your entire codebase and performs deep cross-file analysis.
            </p>

            <div className="space-y-4">
              {operations.map((op, i) => (
                <motion.div
                  key={op.cmd}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.06 }}
                  className={`border rounded-xl p-5 ${op.bg} card-hover`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-xl ${op.bg} border flex items-center justify-center shrink-0`}>
                      <op.icon className={`w-5 h-5 ${op.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <code className="text-sm font-mono font-semibold text-text">
                          shipwell {op.cmd} <span className="text-text-dim">{op.arg}</span>
                        </code>
                      </div>
                      <p className="text-text-muted text-sm leading-relaxed">{op.desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Commands */}
      <div className="max-w-4xl mx-auto px-6 py-20 w-full">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold mb-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
              <Settings className="w-4 h-4 text-accent" />
            </div>
            Account & Configuration
          </h2>
          <p className="text-text-muted text-sm mb-10 ml-11">
            Manage authentication, API keys, and model preferences.
          </p>

          <div className="bg-bg-card border border-border rounded-xl overflow-hidden">
            {commands.map((c, i) => (
              <div
                key={c.cmd}
                className={`flex items-center gap-4 px-5 py-3.5 ${i !== commands.length - 1 ? "border-b border-border" : ""} hover:bg-bg-elevated/50 transition-colors`}
              >
                <code className="text-[13px] font-mono text-accent flex-[2] min-w-0">
                  shipwell {c.cmd}
                </code>
                <span className="text-[13px] text-text-muted flex-[3] min-w-0">{c.desc}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Flags */}
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
              Flags & Options
            </h2>
            <p className="text-text-muted text-sm mb-10 ml-11">
              Pass flags to any analysis command to customize behavior.
            </p>

            <div className="bg-bg-card border border-border rounded-xl overflow-hidden">
              {flags.map((f, i) => (
                <div
                  key={f.flag}
                  className={`flex items-center gap-4 px-5 py-3.5 ${i !== flags.length - 1 ? "border-b border-border" : ""}`}
                >
                  <code className="text-[13px] font-mono text-accent flex-[2] min-w-0 whitespace-nowrap">
                    {f.flag}
                  </code>
                  <span className="text-[13px] text-text-muted flex-[3] min-w-0">{f.desc}</span>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <p className="text-sm text-text-dim mb-3">Examples with flags:</p>
              <CodeBlock copyText='shipwell migrate ./my-app --target "Next.js 15" --model claude-opus-4-6'>{`shipwell migrate ./my-app --target "Next.js 15" --model claude-opus-4-6`}</CodeBlock>
              <div className="mt-3">
                <CodeBlock copyText="shipwell audit ./my-app -y -o report.md">{`shipwell audit ./my-app -y -o report.md`}</CodeBlock>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Environment Variables */}
      <div className="max-w-4xl mx-auto px-6 py-20 w-full">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
              <Settings className="w-4 h-4 text-accent" />
            </div>
            Environment Variables
          </h2>

          <div className="bg-bg-card border border-border rounded-xl overflow-hidden">
            {[
              { env: "ANTHROPIC_API_KEY", desc: "Your Anthropic API key (overrides stored config)" },
              { env: "SHIPWELL_MODEL", desc: "Default model ID (overrides stored config)" },
            ].map((e, i) => (
              <div
                key={e.env}
                className={`flex items-center gap-4 px-5 py-3.5 ${i === 0 ? "border-b border-border" : ""}`}
              >
                <code className="text-[13px] font-mono text-amber-400 flex-[2] min-w-0">{e.env}</code>
                <span className="text-[13px] text-text-muted flex-[3] min-w-0">{e.desc}</span>
              </div>
            ))}
          </div>
        </motion.div>
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
            <h2 className="text-2xl font-bold mb-3">Ready to get started?</h2>
            <p className="text-text-muted text-sm mb-8 max-w-md mx-auto">
              Install the CLI and run your first analysis in under a minute.
            </p>
            <div className="flex items-center justify-center gap-4">
              <div className="flex items-center gap-2 bg-bg-card border border-border rounded-xl px-5 py-3 font-mono text-sm">
                <span className="text-text-dim">$</span>
                <span className="text-accent">npm i -g @shipwellapp/cli</span>
                <CopyButton text="npm install -g @shipwellapp/cli" />
              </div>
              <a
                href="https://www.npmjs.com/package/@shipwellapp/cli"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 text-[13px] font-medium text-text-muted hover:text-accent border border-border rounded-xl hover:border-accent/30 transition-all"
              >
                npm
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
