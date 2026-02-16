"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Ship, Shield, ArrowRight, GitBranch, BookOpen, PackageCheck,
  Terminal, Copy, Check, Search, Menu, X, Settings, Key, Flag,
  Code2, GitPullRequest, ExternalLink, ChevronRight, Download,
  Cpu, LogIn, RefreshCw, Lock, Zap, Globe, FileCode,
} from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

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
    <div className="group relative bg-bg-elevated border border-border rounded-xl overflow-hidden">
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

// ── Section data ───────────────────────────────────────────
const ICON: Record<string, React.ComponentType<{ className?: string }>> = {
  overview: Ship,
  installation: Terminal,
  quickstart: ChevronRight,
  cli: Terminal,
  "cli-operations": Cpu,
  "cli-auto-fix": GitPullRequest,
  "cli-commands": Settings,
  "cli-flags": Flag,
  "cli-env": Settings,
  "github-app": GitPullRequest,
  "github-app-how": Zap,
  "github-app-preview": GitPullRequest,
  "github-app-usage": Terminal,
  "github-app-permissions": Lock,
  "github-app-faq": BookOpen,
  "api-key-model": Key,
  "supported-languages": Code2,
};

type SectionId = string;

interface NavGroup {
  label: string;
  items: { id: SectionId; title: string }[];
}

const NAV: NavGroup[] = [
  {
    label: "Getting Started",
    items: [
      { id: "overview", title: "Overview" },
      { id: "installation", title: "Installation" },
      { id: "quickstart", title: "Quick Start" },
    ],
  },
  {
    label: "CLI",
    items: [
      { id: "cli", title: "CLI Overview" },
      { id: "cli-operations", title: "Analysis Operations" },
      { id: "cli-auto-fix", title: "Auto-Fix PRs" },
      { id: "cli-commands", title: "Account & Config" },
      { id: "cli-flags", title: "Flags & Options" },
      { id: "cli-env", title: "Environment Variables" },
    ],
  },
  {
    label: "GitHub App",
    items: [
      { id: "github-app", title: "GitHub App" },
      { id: "github-app-how", title: "How It Works" },
      { id: "github-app-preview", title: "What You Get" },
      { id: "github-app-usage", title: "Usage" },
      { id: "github-app-permissions", title: "Permissions" },
      { id: "github-app-faq", title: "FAQ" },
    ],
  },
  {
    label: "Configuration",
    items: [
      { id: "api-key-model", title: "API Key & Model" },
    ],
  },
  {
    label: "Reference",
    items: [{ id: "supported-languages", title: "Supported Languages" }],
  },
];

const ALL_SECTIONS = NAV.flatMap((g) => g.items);

// ── CLI Data ───────────────────────────────────────────────
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

const cliFlags = [
  { flag: "-k, --api-key <key>", desc: "Override the stored API key for this run" },
  { flag: "-m, --model <model>", desc: "Override the model (e.g. claude-sonnet-4-5-20250929)" },
  { flag: "-t, --target <target>", desc: "Migration target framework/library" },
  { flag: "-c, --context <ctx>", desc: "Additional context for the analysis" },
  { flag: "-r, --raw", desc: "Print raw streaming output alongside formatted results" },
  { flag: "-y, --yes", desc: "Skip cost confirmation prompt" },
  { flag: "-o, --output <path>", desc: "Export report to file (.md or .json)" },
  { flag: "--create-pr", desc: "Create a GitHub PR with auto-fixes after analysis" },
];

// ── GitHub App Data ────────────────────────────────────────
const ghPermissions = [
  { scope: "Contents", access: "Read & Write", desc: "Read files to generate diffs, write fixes to new branches", icon: FileCode },
  { scope: "Pull Requests", access: "Read & Write", desc: "Create PRs with analysis results and suggested fixes", icon: GitPullRequest },
];

const ghSteps = [
  { step: "1", title: "Install the App", desc: "Click the button below to install the ShipwellHQ GitHub App on your repositories. You can grant access to all repos or select specific ones.", icon: Settings },
  { step: "2", title: "Run an Analysis", desc: "Use the Shipwell web app or CLI to analyze a repository where the app is installed. Findings with auto-fix diffs will be detected.", icon: Zap },
  { step: "3", title: "Create a Fix PR", desc: "Click \"Create Fix PR\" on the web or pass --create-pr in the CLI. Shipwell creates a branch, applies diffs, and opens a PR authored by ShipwellHQ[bot].", icon: GitPullRequest },
];

const ghFaqs = [
  { q: "What repositories can the app access?", a: "Only the repositories you explicitly grant access to during installation. You can change this anytime in your GitHub settings." },
  { q: "Does the app read my code?", a: "The app only accesses file contents when creating a fix PR — it reads the targeted files to apply diffs. Your code is never stored on our servers. The analysis itself uses your own Anthropic API key, not the GitHub App." },
  { q: "Can I review changes before they're merged?", a: "Absolutely. The app creates a standard pull request, not a direct commit. You review the diff, request changes, or merge — just like any other PR." },
  { q: "What if a diff fails to apply?", a: "If a file has changed since the analysis, that particular fix is skipped. The PR summary shows applied, skipped, and failed counts so you know exactly what happened." },
  { q: "How do I uninstall the app?", a: "Go to github.com/settings/installations, find ShipwellHQ, and click Configure > Uninstall. All access is revoked immediately." },
  { q: "Does it work with private repositories?", a: "Yes. The GitHub App authenticates server-side with its own credentials, so it can access any repo you've granted it permission to — public or private." },
];

const LANGUAGES = [
  "TypeScript", "JavaScript", "Python", "Go", "Rust", "Java",
  "C#", "C/C++", "Ruby", "PHP", "Swift", "Kotlin",
  "Dart", "Elixir", "Scala", "Haskell",
];

// ── Sidebar ────────────────────────────────────────────────
function Sidebar({
  active,
  onNavigate,
  open,
  onClose,
}: {
  active: SectionId;
  onNavigate: (id: SectionId) => void;
  open: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const q = query.toLowerCase();

  const filtered = NAV.map((g) => ({
    ...g,
    items: g.items.filter((i) => i.title.toLowerCase().includes(q)),
  })).filter((g) => g.items.length > 0);

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={onClose} />
      )}

      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-64 bg-bg-card border-r border-border
          transform transition-transform duration-200 lg:sticky lg:top-0 lg:z-auto lg:translate-x-0
          ${open ? "translate-x-0" : "-translate-x-full"}
          flex flex-col
        `}
        style={{ height: "100vh" }}
      >
        {/* Mobile close */}
        <div className="flex items-center justify-between px-4 pt-4 lg:hidden">
          <span className="text-sm font-semibold text-text">Docs</span>
          <button onClick={onClose} className="text-text-dim hover:text-text">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="px-3 pt-4 pb-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-dim" />
            <input
              type="text"
              placeholder="Search docs..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-bg-elevated border border-border rounded-lg pl-8 pr-3 py-1.5 text-[13px] text-text placeholder:text-text-dim focus:outline-none focus:border-accent/40"
            />
          </div>
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto px-2 pb-6">
          {filtered.map((group) => (
            <div key={group.label} className="mt-4">
              <div className="px-2 mb-1 text-[11px] font-semibold text-text-dim uppercase tracking-wider">
                {group.label}
              </div>
              {group.items.map((item) => {
                const isActive = active === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onNavigate(item.id);
                      onClose();
                    }}
                    className={`
                      w-full text-left px-3 py-1.5 rounded-md text-[13px] transition-colors flex items-center gap-2
                      ${isActive
                        ? "bg-accent/10 text-accent border-l-2 border-accent"
                        : "text-text-muted hover:text-text hover:bg-bg-elevated border-l-2 border-transparent"
                      }
                    `}
                  >
                    {item.title}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}

// ── Section wrapper ────────────────────────────────────────
function Section({
  id,
  title,
  children,
}: {
  id: SectionId;
  title: string;
  children: React.ReactNode;
}) {
  const IconComp = ICON[id] || Ship;
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4 }}
      className="scroll-mt-6 pb-16"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
          <IconComp className="w-4 h-4 text-accent" />
        </div>
        <h2 className="text-xl font-bold text-text">{title}</h2>
      </div>
      {children}
    </motion.section>
  );
}

// ── Page ───────────────────────────────────────────────────
export default function DocsPage() {
  const [active, setActive] = useState<SectionId>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const skipHashUpdate = useRef(false);

  // Read hash on mount and scroll to section
  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash) {
      const el = document.getElementById(hash);
      if (el) {
        skipHashUpdate.current = true;
        setActive(hash);
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
          setTimeout(() => { skipHashUpdate.current = false; }, 500);
        }, 100);
      }
    }
  }, []);

  // Intersection observer for scroll tracking
  useEffect(() => {
    const ids = ALL_SECTIONS.map((s) => s.id);
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (skipHashUpdate.current) return;
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          const id = visible[0].target.id;
          setActive(id);
          window.history.replaceState(null, "", `#${id}`);
        }
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleNavigate = useCallback((id: SectionId) => {
    const el = document.getElementById(id);
    if (el) {
      skipHashUpdate.current = true;
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setActive(id);
      window.history.pushState(null, "", `#${id}`);
      setTimeout(() => { skipHashUpdate.current = false; }, 600);
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-bg">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar
          active={active}
          onNavigate={handleNavigate}
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <div className="flex-1 min-w-0 flex flex-col">
          {/* Mobile header */}
          <div className="sticky top-0 z-30 flex items-center gap-3 px-4 py-3 bg-bg/80 backdrop-blur border-b border-border lg:hidden">
            <button onClick={() => setSidebarOpen(true)} className="text-text-dim hover:text-text">
              <Menu className="w-5 h-5" />
            </button>
            <span className="text-sm font-semibold text-text">Documentation</span>
          </div>

          <div className="flex-1 max-w-3xl mx-auto w-full px-6 lg:px-10 py-10">

            {/* ────────────────────────────────────────────── */}
            {/* GETTING STARTED                                */}
            {/* ────────────────────────────────────────────── */}

            {/* ── Overview ────────────────────────────── */}
            <Section id="overview" title="Overview">
              <p className="text-text-muted text-sm leading-relaxed mb-4">
                Shipwell is a full-codebase analysis engine powered by <span className="text-text font-medium">Claude Opus 4.6</span> with
                up to <span className="text-accent font-medium">1 million tokens</span> of context. It ingests your entire repository —
                every file, every dependency — and performs deep cross-file analysis.
              </p>
              <p className="text-text-muted text-sm leading-relaxed mb-4">
                Available as both a CLI tool and a web application, Shipwell supports five core operations:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { icon: Shield, label: "Audit", desc: "Security vulnerability scanning", color: "text-red-400" },
                  { icon: ArrowRight, label: "Migrate", desc: "Framework migration planning", color: "text-blue-400" },
                  { icon: GitBranch, label: "Refactor", desc: "Code quality analysis", color: "text-purple-400" },
                  { icon: BookOpen, label: "Docs", desc: "Documentation generation", color: "text-emerald-400" },
                  { icon: PackageCheck, label: "Upgrade", desc: "Dependency upgrade planning", color: "text-amber-400" },
                ].map((op) => (
                  <div key={op.label} className="flex items-center gap-3 px-3 py-2.5 rounded-lg border border-border bg-bg-card">
                    <op.icon className={`w-4 h-4 ${op.color} shrink-0`} />
                    <div>
                      <span className="text-sm font-medium text-text">{op.label}</span>
                      <span className="text-text-dim text-xs ml-2">{op.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Section>

            {/* ── Installation ────────────────────────── */}
            <Section id="installation" title="Installation">
              <p className="text-text-muted text-sm leading-relaxed mb-4">
                Install the Shipwell CLI globally via npm:
              </p>
              <CodeBlock copyText="npm install -g @shipwellapp/cli">npm install -g @shipwellapp/cli</CodeBlock>
              <p className="text-text-dim text-xs mt-3">
                Requires Node.js 18 or later. After installation, run <code className="text-accent">shipwell</code> to verify.
              </p>
            </Section>

            {/* ── Quick Start ─────────────────────────── */}
            <Section id="quickstart" title="Quick Start">
              <p className="text-text-muted text-sm leading-relaxed mb-4">
                Get started in four steps:
              </p>
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
              <p className="text-text-dim text-xs mt-4">
                The CLI will display a live-streaming analysis with findings, severity ratings, and suggested fixes.
              </p>
            </Section>

            {/* ────────────────────────────────────────────── */}
            {/* CLI                                            */}
            {/* ────────────────────────────────────────────── */}

            {/* ── CLI Overview ────────────────────────── */}
            <Section id="cli" title="CLI Overview">
              <p className="text-text-muted text-sm leading-relaxed mb-6">
                Deep cross-file codebase analysis from your terminal.
                Powered by Claude with up to 1M token context.
              </p>

              <div className="flex items-center gap-2 bg-bg-card border border-border rounded-xl px-5 py-3 font-mono text-sm mb-8 w-fit">
                <span className="text-text-dim">$</span>
                <span className="text-accent">npm install -g @shipwellapp/cli</span>
                <CopyButton text="npm install -g @shipwellapp/cli" />
              </div>

              {/* Terminal Demo */}
              <TerminalWindow title="Terminal">
                <div className="text-text-dim mb-4">
                  <span className="text-success">$</span> <span className="text-text">shipwell</span>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                  {/* Left — branding & status */}
                  <div className="border border-border rounded-lg p-4 flex-1">
                    <div className="text-accent font-bold text-lg tracking-wide mb-1">SHIPWELL</div>
                    <div className="text-text-dim text-[12px] mb-3">v0.4.0</div>
                    <div className="text-text text-sm">Welcome back, <span className="text-accent">Manas</span>!</div>
                    <div className="mt-3 flex items-center gap-2 text-[12px]">
                      <span className="text-text-muted">Claude Sonnet 4.5</span>
                      <span className="text-text-dim">&middot;</span>
                      <span className="text-success">&#9679;</span>
                      <span className="text-text-dim">API Key</span>
                    </div>
                  </div>

                  {/* Right — commands */}
                  <div className="flex-1 space-y-1">
                    <div className="text-text font-bold text-sm mb-2">Operations</div>
                    {[
                      { cmd: "audit", arg: "<path>", desc: "Security audit" },
                      { cmd: "migrate", arg: "<path>", desc: "Migration plan" },
                      { cmd: "refactor", arg: "<path>", desc: "Refactor analysis" },
                      { cmd: "docs", arg: "<path>", desc: "Documentation" },
                      { cmd: "upgrade", arg: "<path>", desc: "Dep upgrade plan" },
                    ].map((c) => (
                      <div key={c.cmd} className="flex items-center gap-3 text-[13px]">
                        <span className="text-cyan-400 w-16 shrink-0">{c.cmd}</span>
                        <span className="text-text-dim w-14 shrink-0">{c.arg}</span>
                        <span className="text-text-dim">{c.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </TerminalWindow>
            </Section>

            {/* ── Analysis Operations ─────────────────── */}
            <Section id="cli-operations" title="Analysis Operations">
              <p className="text-text-muted text-sm mb-6">
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
                    className={`border rounded-xl p-5 ${op.bg}`}
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
            </Section>

            {/* ── Auto-Fix PRs (CLI) ──────────────────── */}
            <Section id="cli-auto-fix" title="Auto-Fix PRs">
              <p className="text-text-muted text-sm mb-6">
                After analysis, if fixable findings are detected, the CLI can create a GitHub PR with suggested fixes — authored by the <span className="text-accent font-medium">ShipwellHQ</span> GitHub App.
              </p>

              <div className="space-y-4">
                <div className="border rounded-xl p-5 bg-accent/5 border-accent/15">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
                      <GitPullRequest className="w-5 h-5 text-accent" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-text-muted leading-relaxed mb-4">
                        Append <code className="text-accent bg-accent/10 px-1.5 py-0.5 rounded text-xs">--create-pr</code> to any analysis command. The CLI will prompt to create a PR when fixable issues are found.
                      </p>
                      <div className="space-y-2">
                        <CodeBlock copyText="shipwell audit https://github.com/acme/api --create-pr">{`shipwell audit https://github.com/acme/api --create-pr`}</CodeBlock>
                        <CodeBlock copyText="shipwell audit ./my-project --create-pr --yes">{`shipwell audit ./my-project --create-pr --yes`}</CodeBlock>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-bg-card border border-border rounded-xl p-4 text-[13px]">
                  <div className="font-mono text-text-dim leading-relaxed">
                    <div><span className="text-success">{"  ✔"}</span> Repository: <span className="text-accent">https://github.com/acme/api</span></div>
                    <div><span className="text-success">{"  ✔"}</span> PR #42 created</div>
                    <div className="text-text-dim">{"  → "}
                      <span className="text-cyan-400">https://github.com/acme/api/pull/42</span>
                    </div>
                    <div className="text-text-dim">{"  Applied: 8 · Skipped: 2 · Failed: 2"}</div>
                  </div>
                </div>

                <p className="text-text-dim text-xs ml-1">
                  Prerequisite: The{" "}
                  <a
                    href="https://github.com/apps/shipwellhq"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:underline"
                  >
                    ShipwellHQ GitHub App
                  </a>{" "}
                  must be installed on the target repository.
                </p>
              </div>
            </Section>

            {/* ── Account & Configuration ─────────────── */}
            <Section id="cli-commands" title="Account & Configuration">
              <p className="text-text-muted text-sm mb-6">
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
            </Section>

            {/* ── Flags & Options ─────────────────────── */}
            <Section id="cli-flags" title="Flags & Options">
              <p className="text-text-muted text-sm mb-6">
                Pass flags to any analysis command to customize behavior.
              </p>
              <div className="bg-bg-card border border-border rounded-xl overflow-hidden">
                {cliFlags.map((f, i) => (
                  <div
                    key={f.flag}
                    className={`flex items-center gap-4 px-5 py-3.5 ${i !== cliFlags.length - 1 ? "border-b border-border" : ""}`}
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
            </Section>

            {/* ── Environment Variables ────────────────── */}
            <Section id="cli-env" title="Environment Variables">
              <div className="bg-bg-card border border-border rounded-xl overflow-hidden">
                {[
                  { env: "ANTHROPIC_API_KEY", desc: "Your Anthropic API key (overrides stored config)" },
                  { env: "SHIPWELL_MODEL", desc: "Default model ID (overrides stored config)" },
                  { env: "SHIPWELL_API_URL", desc: "API base URL for PR creation (default: https://shipwell.app)" },
                ].map((e, i, arr) => (
                  <div
                    key={e.env}
                    className={`flex items-center gap-4 px-5 py-3.5 ${i !== arr.length - 1 ? "border-b border-border" : ""}`}
                  >
                    <code className="text-[13px] font-mono text-amber-400 flex-[2] min-w-0">{e.env}</code>
                    <span className="text-[13px] text-text-muted flex-[3] min-w-0">{e.desc}</span>
                  </div>
                ))}
              </div>
            </Section>

            {/* ────────────────────────────────────────────── */}
            {/* GITHUB APP                                     */}
            {/* ────────────────────────────────────────────── */}

            {/* ── GitHub App Overview ─────────────────── */}
            <Section id="github-app" title="GitHub App">
              <p className="text-text-muted text-sm leading-relaxed mb-4">
                The <span className="text-accent font-medium">ShipwellHQ</span> GitHub App automatically creates pull requests
                with suggested fixes from your Shipwell analysis. PRs are authored by{" "}
                <span className="text-accent font-medium">ShipwellHQ[bot]</span> and ready for review.
              </p>
              <div className="flex gap-3">
                <a
                  href="https://github.com/apps/shipwellhq"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 px-6 py-3 bg-accent hover:bg-accent-hover text-white font-semibold rounded-xl transition-all duration-300 glow-accent text-[14px]"
                >
                  <GitPullRequest className="w-4 h-4" />
                  Install GitHub App
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </Section>

            {/* ── How It Works ────────────────────────── */}
            <Section id="github-app-how" title="How It Works">
              <p className="text-text-muted text-sm mb-6">
                Three steps from analysis to pull request.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {ghSteps.map((s, i) => (
                  <motion.div
                    key={s.step}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                    className="relative bg-bg border border-border rounded-xl p-5 hover:border-border-bright transition-all"
                  >
                    <div className="flex items-center gap-3 mb-3">
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
            </Section>

            {/* ── What You Get (PR Demo) ──────────────── */}
            <Section id="github-app-preview" title="What You Get">
              <p className="text-text-muted text-sm mb-6">
                A clean pull request with all applicable fixes, ready for review.
              </p>

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
            </Section>

            {/* ── Usage ───────────────────────────────── */}
            <Section id="github-app-usage" title="Usage">
              <p className="text-text-muted text-sm mb-6">
                Create fix PRs from the web app or the CLI.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Web */}
                <div className="border border-border rounded-xl p-6 bg-bg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center">
                      <Globe className="w-4 h-4 text-accent" />
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
                      <Terminal className="w-4 h-4 text-accent" />
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
            </Section>

            {/* ── Permissions ─────────────────────────── */}
            <Section id="github-app-permissions" title="Permissions">
              <p className="text-text-muted text-sm mb-6">
                The app requests only the minimum permissions needed to create fix PRs.
              </p>

              <div className="bg-bg-card border border-border rounded-xl overflow-hidden">
                {ghPermissions.map((p, i) => (
                  <div
                    key={p.scope}
                    className={`flex items-center gap-5 px-6 py-4 ${i !== ghPermissions.length - 1 ? "border-b border-border" : ""}`}
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
            </Section>

            {/* ── FAQ ─────────────────────────────────── */}
            <Section id="github-app-faq" title="FAQ">
              <p className="text-text-muted text-sm mb-6">
                Common questions about the GitHub App.
              </p>
              <div className="space-y-4">
                {ghFaqs.map((faq, i) => (
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
            </Section>

            {/* ────────────────────────────────────────────── */}
            {/* CONFIGURATION & REFERENCE                      */}
            {/* ────────────────────────────────────────────── */}

            {/* ── API Key & Model ─────────────────────── */}
            <Section id="api-key-model" title="API Key & Model">
              <p className="text-text-muted text-sm leading-relaxed mb-4">
                Shipwell uses your own Anthropic API key. Configure it via the CLI or the{" "}
                <Link href="/settings" className="text-accent hover:underline">web settings page</Link>.
              </p>
              <div className="space-y-2 mb-4">
                <CodeBlock copyText="shipwell config set api-key sk-ant-api03-...">shipwell config set api-key sk-ant-api03-...</CodeBlock>
                <CodeBlock copyText="shipwell config set model claude-opus-4-6">shipwell config set model claude-opus-4-6</CodeBlock>
              </div>
              <p className="text-text-muted text-sm leading-relaxed mb-3">
                You can also override per-run with flags:
              </p>
              <CodeBlock copyText="shipwell audit ./app -k sk-ant-... -m claude-opus-4-6">shipwell audit ./app -k sk-ant-... -m claude-opus-4-6</CodeBlock>
              <p className="text-text-dim text-xs mt-3">
                API keys are stored locally and never sent to Shipwell servers. Use <code className="text-accent">shipwell whoami</code> to check your current configuration.
              </p>
            </Section>

            {/* ── Supported Languages ─────────────────── */}
            <Section id="supported-languages" title="Supported Languages">
              <p className="text-text-muted text-sm leading-relaxed mb-4">
                Shipwell can analyze codebases in any language that Claude understands. These are the most commonly used:
              </p>
              <div className="flex flex-wrap gap-2">
                {LANGUAGES.map((lang) => (
                  <span
                    key={lang}
                    className="px-3 py-1.5 rounded-lg bg-bg-card border border-border text-[13px] text-text-muted"
                  >
                    {lang}
                  </span>
                ))}
              </div>
              <p className="text-text-dim text-xs mt-4">
                Additional languages and frameworks are supported — Claude{"'"}s training data covers most programming languages in use today.
              </p>
            </Section>
          </div>

          <Footer minimal />
        </div>
      </div>
    </div>
  );
}
