"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import {
  Shield, ArrowRight, GitBranch, Zap,
  BookOpen, PackageCheck, LogIn, ChevronRight, Code2, Layers,
  Terminal, Copy, Check, Ship, Sparkles, Globe, Lock, Cpu,
  Github, FileCode, BarChart3, ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { useAuth } from "@/components/auth-provider";

// ── Data ─────────────────────────────────────────────────────

const operations = [
  { id: "audit", label: "Security Audit", icon: Shield, color: "text-red-400", bg: "from-red-500/10 to-red-500/5", border: "border-red-500/15 hover:border-red-500/30", desc: "Find vulnerabilities, injection risks, auth flaws, and cross-file security issues across your entire codebase." },
  { id: "migrate", label: "Migration Plan", icon: ArrowRight, color: "text-blue-400", bg: "from-blue-500/10 to-blue-500/5", border: "border-blue-500/15 hover:border-blue-500/30", desc: "Plan framework & library migrations with complete diffs, dependency chain analysis, and step-by-step guides." },
  { id: "refactor", label: "Refactor Analysis", icon: GitBranch, color: "text-purple-400", bg: "from-purple-500/10 to-purple-500/5", border: "border-purple-500/15 hover:border-purple-500/30", desc: "Detect code smells, duplication, circular dependencies, dead code, and architecture anti-patterns." },
  { id: "docs", label: "Documentation", icon: BookOpen, color: "text-emerald-400", bg: "from-emerald-500/10 to-emerald-500/5", border: "border-emerald-500/15 hover:border-emerald-500/30", desc: "Generate architecture overviews, data flow diagrams, API references, and comprehensive module guides." },
  { id: "upgrade", label: "Dep. Upgrade", icon: PackageCheck, color: "text-amber-400", bg: "from-amber-500/10 to-amber-500/5", border: "border-amber-500/15 hover:border-amber-500/30", desc: "Analyze all dependencies, find known CVEs, check breaking changes, and plan safe version upgrades." },
];

const features = [
  { icon: Layers, label: "Cross-file Analysis", desc: "Detects issues spanning multiple files — circular deps, inconsistent types, broken data flows — that single-file tools completely miss." },
  { icon: Code2, label: "Real-time Streaming", desc: "Watch findings appear live as Claude analyzes your code. No waiting for the full analysis to complete." },
  { icon: Lock, label: "Privacy First", desc: "Your API key never touches our servers. It stays in your browser or local CLI config. We don't store your code." },
  { icon: Cpu, label: "1M Token Context", desc: "Feed your entire repository — hundreds of files — into a single prompt. No chunking, no context loss." },
  { icon: Globe, label: "GitHub Integration", desc: "Paste any public GitHub URL. We clone, ingest, and analyze automatically. Or point to a local path." },
  { icon: BarChart3, label: "Actionable Metrics", desc: "Get before/after scores, severity breakdowns, and quantified improvements — not just vague suggestions." },
];

const stats = [
  { value: "1M", suffix: "", label: "Token Context" },
  { value: "500", suffix: "+", label: "Files per scan" },
  { value: "5", suffix: "", label: "Analysis modes" },
  { value: "128K", suffix: "", label: "Output tokens" },
];

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

// ── Components ───────────────────────────────────────────────

function CopyInstall() {
  const [copied, setCopied] = useState(false);
  const cmd = "npm install -g @shipwellapp/cli";
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(cmd); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className="group inline-flex items-center gap-3 bg-bg-card border border-border rounded-xl px-5 py-3 font-mono text-sm hover:border-accent/30 transition-all duration-300"
    >
      <span className="text-text-dim">$</span>
      <span className="text-text-muted group-hover:text-accent transition-colors">{cmd}</span>
      {copied ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4 text-text-dim group-hover:text-accent transition-colors" />}
    </button>
  );
}

function SectionHeading({ badge, title, desc }: { badge: string; title: React.ReactNode; desc: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className="text-center mb-14"
    >
      <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-accent/8 text-accent text-[12px] mb-5 border border-accent/15 font-medium">
        <Sparkles className="w-3 h-3" />
        {badge}
      </div>
      <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">{title}</h2>
      <p className="text-text-muted max-w-xl mx-auto leading-relaxed">{desc}</p>
    </motion.div>
  );
}

// ── Page ─────────────────────────────────────────────────────

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);

  useEffect(() => {
    if (!loading && user) router.replace("/analysis");
  }, [user, loading, router]);

  if (!loading && user) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* ── Hero ──────────────────────────────────────────── */}
        <div ref={heroRef} className="relative overflow-hidden">
          {/* Layered backgrounds */}
          <div className="absolute inset-0 bg-grid" />
          <div className="absolute inset-0 hero-glow" />
          <div className="absolute inset-0 noise pointer-events-none" />

          {/* Decorative beams */}
          <div className="absolute top-0 left-1/4 w-px h-full overflow-hidden opacity-20">
            <div className="w-full h-32 bg-gradient-to-b from-transparent via-accent to-transparent animate-beam" />
          </div>
          <div className="absolute top-0 right-1/3 w-px h-full overflow-hidden opacity-10">
            <div className="w-full h-32 bg-gradient-to-b from-transparent via-accent to-transparent animate-beam" style={{ animationDelay: "1.5s" }} />
          </div>

          <motion.div style={{ opacity: heroOpacity, scale: heroScale }} className="relative">
            <div className="flex flex-col items-center px-6 pt-28 pb-24">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="text-center max-w-4xl"
              >
                {/* Badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.15 }}
                  className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-accent/8 text-accent text-[13px] mb-8 border border-accent/15 font-medium"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Powered by Claude Opus 4.6</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                </motion.div>

                {/* Heading */}
                <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.05] mb-6">
                  <span className="block">Your entire codebase.</span>
                  <span className="block gradient-text">One deep analysis.</span>
                </h1>

                <p className="text-text-muted text-lg md:text-xl leading-relaxed mb-10 max-w-2xl mx-auto">
                  Feed hundreds of files into a single prompt. Get cross-file security audits,
                  migration plans, refactoring insights, and more &mdash; all streaming in real-time.
                </p>

                {/* CTAs */}
                {!loading && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.35 }}
                    className="flex flex-col sm:flex-row items-center gap-4 justify-center"
                  >
                    <Link
                      href="/login"
                      className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-accent hover:bg-accent-hover text-white font-semibold rounded-xl transition-all duration-300 glow-accent-lg text-[15px] hover:scale-[1.02]"
                    >
                      <LogIn className="w-5 h-5" />
                      Get Started Free
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                    <Link
                      href="/cli"
                      className="inline-flex items-center gap-2.5 px-6 py-3.5 border border-border hover:border-accent/30 text-text-muted hover:text-text rounded-xl transition-all duration-300 text-[15px] font-medium"
                    >
                      <Terminal className="w-4.5 h-4.5" />
                      CLI Docs
                    </Link>
                  </motion.div>
                )}
              </motion.div>

              {/* Stats bar */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="flex items-center gap-0 mt-20 bg-bg-card/60 border border-border rounded-2xl overflow-hidden backdrop-blur-sm"
              >
                {stats.map((s, i) => (
                  <div
                    key={s.label}
                    className={`px-8 py-4 text-center ${i !== stats.length - 1 ? "border-r border-border" : ""}`}
                  >
                    <div className="text-2xl md:text-3xl font-bold text-text tracking-tight">
                      {s.value}<span className="text-accent">{s.suffix}</span>
                    </div>
                    <div className="text-[11px] text-text-dim mt-1 uppercase tracking-wider font-medium">{s.label}</div>
                  </div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* ── Demo Terminal ────────────────────────────────── */}
        <div className="px-6 -mt-4 mb-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            <div className="rounded-2xl border border-border overflow-hidden bg-bg shadow-2xl shadow-black/50 relative">
              {/* Glow behind terminal */}
              <div className="absolute -inset-1 bg-gradient-to-b from-accent/5 to-transparent rounded-2xl blur-xl -z-10" />

              <div className="flex items-center gap-2 px-4 py-3 bg-bg-elevated border-b border-border">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/70" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                  <div className="w-3 h-3 rounded-full bg-green-500/70" />
                </div>
                <span className="text-[11px] text-text-dim font-mono ml-2">~/project</span>
              </div>
              <div className="p-5 font-mono text-[13px] leading-[1.8] space-y-0.5">
                <div><span className="text-success">$</span> <span className="text-text">shipwell audit</span> <span className="text-text-muted">https://github.com/acme/api</span></div>
                <div className="text-text-dim">&nbsp;</div>
                <div className="text-text-dim"><span className="text-accent">{"  ⛵"}</span> Cloning acme/api...</div>
                <div className="text-text-dim"><span className="text-accent">{"  ⛵"}</span> Ingesting 342 files <span className="text-text-dim">(187,420 tokens)</span></div>
                <div className="text-text-dim"><span className="text-accent">{"  ⛵"}</span> Analyzing with Claude Opus 4.6...</div>
                <div className="text-text-dim">&nbsp;</div>
                <div><span className="text-red-400">  CRITICAL</span> <span className="text-text">SQL injection in</span> <span className="text-accent">src/db/queries.ts:47</span></div>
                <div className="text-text-dim">{"           "}Unsanitized user input flows to db.raw() via 3 files</div>
                <div><span className="text-amber-400">  HIGH</span>     <span className="text-text">Hardcoded secret in</span> <span className="text-accent">src/config/auth.ts:12</span></div>
                <div><span className="text-amber-400">  HIGH</span>     <span className="text-text">Missing rate limiting on</span> <span className="text-accent">src/routes/api/*.ts</span></div>
                <div className="text-text-dim">&nbsp;</div>
                <div><span className="text-success">  {"✔"}</span> <span className="text-text">12 findings</span> <span className="text-text-dim">(2 critical, 4 high, 3 medium, 3 low)</span></div>
                <div><span className="text-success">  {"✔"}</span> <span className="text-text">3 cross-file issues</span> <span className="text-text-dim">detected</span></div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── Operations ───────────────────────────────────── */}
        <div className="px-6 pb-24">
          <div className="max-w-5xl mx-auto">
            <SectionHeading
              badge="Analysis Modes"
              title={<>Five ways to understand your <span className="gradient-text">codebase</span></>}
              desc="Each operation ingests your entire repository and performs deep cross-file analysis that's impossible with file-by-file tools."
            />

            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-80px" }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {operations.map((op) => (
                <motion.div
                  key={op.id}
                  variants={fadeUp}
                  className={`group bg-gradient-to-b ${op.bg} border ${op.border} rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:shadow-black/20 hover:-translate-y-0.5`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <op.icon className={`w-6 h-6 ${op.color}`} />
                    <h3 className="font-semibold text-[15px]">{op.label}</h3>
                  </div>
                  <p className="text-text-dim text-[13px] leading-relaxed">{op.desc}</p>
                </motion.div>
              ))}

              {/* CTA card */}
              <motion.div variants={fadeUp}>
                <Link
                  href="/login"
                  className="flex flex-col items-center justify-center h-full border border-dashed border-border hover:border-accent/30 rounded-2xl p-6 transition-all duration-300 group text-center"
                >
                  <div className="w-12 h-12 rounded-xl bg-accent/8 border border-accent/15 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Sparkles className="w-5 h-5 text-accent" />
                  </div>
                  <span className="text-sm font-medium text-text-muted group-hover:text-accent transition-colors">Try it now</span>
                  <span className="text-[11px] text-text-dim mt-1">Free to use with your API key</span>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* ── How It Works ─────────────────────────────────── */}
        <div className="border-t border-border bg-bg-card/20">
          <div className="max-w-4xl mx-auto px-6 py-24">
            <SectionHeading
              badge="How It Works"
              title={<>Three steps to <span className="gradient-text">deep insights</span></>}
              desc="No configuration needed. Just point at a repo and go."
            />

            <div className="relative">
              {/* Connecting line */}
              <div className="hidden md:block absolute top-10 left-[calc(16.67%+20px)] right-[calc(16.67%+20px)] h-px bg-gradient-to-r from-border via-accent/20 to-border" />

              <motion.div
                variants={stagger}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-80px" }}
                className="grid grid-cols-1 md:grid-cols-3 gap-8"
              >
                {[
                  { step: "01", icon: Globe, title: "Point", desc: "Paste a GitHub URL or local path. We clone and ingest every file automatically." },
                  { step: "02", icon: Cpu, title: "Analyze", desc: "Your entire codebase is fed into Claude's 1M context window for deep cross-file analysis." },
                  { step: "03", icon: BarChart3, title: "Act", desc: "Get streaming findings, severity scores, diffs, and actionable recommendations." },
                ].map((s) => (
                  <motion.div key={s.step} variants={fadeUp} className="text-center relative">
                    <div className="w-14 h-14 rounded-2xl bg-bg border border-border flex items-center justify-center mx-auto mb-5 relative z-10">
                      <s.icon className="w-6 h-6 text-accent" />
                      <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-accent text-white text-[10px] font-bold flex items-center justify-center">
                        {s.step}
                      </div>
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{s.title}</h3>
                    <p className="text-text-dim text-sm leading-relaxed">{s.desc}</p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>

        {/* ── Features Grid ────────────────────────────────── */}
        <div className="px-6 py-24">
          <div className="max-w-5xl mx-auto">
            <SectionHeading
              badge="Why Shipwell"
              title={<>Built for <span className="gradient-text">serious</span> codebases</>}
              desc="Not another linter. Shipwell sees your entire project at once and finds what other tools can't."
            />

            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-80px" }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {features.map((f) => (
                <motion.div
                  key={f.label}
                  variants={fadeUp}
                  className="group bg-bg-card border border-border rounded-2xl p-6 hover:border-border-bright transition-all duration-300 hover:shadow-lg hover:shadow-black/20"
                >
                  <div className="w-10 h-10 rounded-xl bg-accent/8 border border-accent/10 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-accent/12 transition-all duration-300">
                    <f.icon className="w-5 h-5 text-accent" />
                  </div>
                  <h3 className="font-semibold text-[15px] mb-2">{f.label}</h3>
                  <p className="text-text-dim text-[13px] leading-relaxed">{f.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* ── CLI Section ──────────────────────────────────── */}
        <div className="border-t border-border bg-bg-card/20">
          <div className="max-w-5xl mx-auto px-6 py-24">
            <div className="flex flex-col lg:flex-row items-center gap-14">
              {/* Terminal */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="flex-1 w-full"
              >
                <div className="rounded-2xl border border-border overflow-hidden bg-bg shadow-2xl shadow-black/40 relative">
                  <div className="absolute -inset-1 bg-gradient-to-br from-accent/5 via-transparent to-purple-500/5 rounded-2xl blur-xl -z-10" />
                  <div className="flex items-center gap-2 px-4 py-3 bg-bg-elevated border-b border-border">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500/70" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                      <div className="w-3 h-3 rounded-full bg-green-500/70" />
                    </div>
                    <span className="text-[11px] text-text-dim font-mono ml-2">Terminal</span>
                  </div>
                  <div className="p-5 font-mono text-[13px] leading-[1.8]">
                    <div><span className="text-success">$</span> <span className="text-text">npm i -g @shipwellapp/cli</span></div>
                    <div><span className="text-success">$</span> <span className="text-text">shipwell login</span></div>
                    <div className="text-text-dim"><span className="text-accent">{"  ⛵"}</span> Opening browser to sign in...</div>
                    <div><span className="text-success">{"  ✔"}</span> Logged in as <span className="text-accent">Manas Dutta</span></div>
                    <div className="text-text-dim">&nbsp;</div>
                    <div><span className="text-success">$</span> <span className="text-text">shipwell refactor</span> <span className="text-text-muted">./my-project</span></div>
                    <div className="text-text-dim"><span className="text-accent">{"  ⛵"}</span> Ingesting 128 files...</div>
                    <div><span className="text-success">{"  ✔"}</span> <span className="text-text">8 findings</span> <span className="text-text-dim">(2 cross-file)</span></div>
                  </div>
                </div>
              </motion.div>

              {/* Info */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="flex-1"
              >
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-accent/8 text-accent text-[12px] mb-5 border border-accent/15 font-medium">
                  <Terminal className="w-3 h-3" />
                  Command Line Interface
                </div>
                <h2 className="text-3xl font-bold mb-4 tracking-tight">
                  Power users, <span className="gradient-text">rejoice</span>.
                </h2>
                <p className="text-text-muted leading-relaxed mb-6">
                  The same deep analysis engine, right in your terminal. Supports GitHub URLs and local paths
                  with real-time streaming output. Pipe results, script your audits, run in CI.
                </p>

                <CopyInstall />

                <div className="flex items-center gap-5 mt-6">
                  <Link
                    href="/cli"
                    className="inline-flex items-center gap-1.5 text-accent text-sm hover:text-accent-hover font-medium transition-colors"
                  >
                    View CLI docs <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                  <a
                    href="https://www.npmjs.com/package/@shipwellapp/cli"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-text-dim text-sm hover:text-text-muted font-medium transition-colors"
                  >
                    npm <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* ── Open Source Banner ────────────────────────────── */}
        <div className="px-6 py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="relative bg-gradient-to-b from-accent/8 to-transparent border border-accent/15 rounded-3xl p-10 overflow-hidden">
              <div className="absolute inset-0 noise pointer-events-none" />
              <div className="relative">
                <Ship className="w-10 h-10 text-accent mx-auto mb-5" />
                <h2 className="text-3xl font-bold mb-3 tracking-tight">Open Source</h2>
                <p className="text-text-muted max-w-md mx-auto mb-8 leading-relaxed">
                  Shipwell is fully open source. Star the repo, report issues, or contribute.
                </p>
                <div className="flex items-center justify-center gap-4">
                  <a
                    href="https://github.com/manasdutta04/shipwell"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2.5 px-6 py-3 bg-bg-card border border-border hover:border-border-bright rounded-xl transition-all duration-300 text-sm font-medium hover:shadow-lg hover:shadow-black/20"
                  >
                    <Github className="w-4.5 h-4.5" />
                    View on GitHub
                  </a>
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-2.5 px-6 py-3 bg-accent hover:bg-accent-hover text-white rounded-xl transition-all duration-300 text-sm font-semibold glow-accent"
                  >
                    Get Started <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Ship className="w-4 h-4 text-accent" />
            <span className="text-text-dim text-xs">Shipwell &copy; 2026 &middot; Built by Manas Dutta</span>
          </div>
          <div className="flex items-center gap-5 text-xs text-text-dim">
            <Link href="/cli" className="hover:text-accent transition-colors">CLI</Link>
            <a href="https://github.com/manasdutta04/shipwell" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">GitHub</a>
            <a href="https://www.npmjs.com/package/@shipwellapp/cli" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">npm</a>
            <Link href="/terms" className="hover:text-accent transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-accent transition-colors">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
