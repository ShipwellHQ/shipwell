"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Shield, ArrowRight, GitBranch, Zap, Scan,
  BookOpen, PackageCheck, LogIn, ChevronRight, Code2, Layers,
  Terminal, Copy, Check,
} from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { useAuth } from "@/components/auth-provider";

const operations = [
  { id: "audit", label: "Security Audit", icon: Shield, color: "from-red-500/10 to-red-500/5 border-red-500/10", iconColor: "text-red-400", desc: "Find vulnerabilities across your entire codebase with cross-file detection" },
  { id: "migrate", label: "Migration", icon: ArrowRight, color: "from-blue-500/10 to-blue-500/5 border-blue-500/10", iconColor: "text-blue-400", desc: "Plan framework & library migrations with complete diffs and dependency chains" },
  { id: "refactor", label: "Refactor", icon: GitBranch, color: "from-purple-500/10 to-purple-500/5 border-purple-500/10", iconColor: "text-purple-400", desc: "Detect duplication, dead code, circular deps & architecture issues" },
  { id: "docs", label: "Documentation", icon: BookOpen, color: "from-emerald-500/10 to-emerald-500/5 border-emerald-500/10", iconColor: "text-emerald-400", desc: "Generate comprehensive docs with architecture diagrams & data flows" },
  { id: "upgrade", label: "Dep. Upgrade", icon: PackageCheck, color: "from-amber-500/10 to-amber-500/5 border-amber-500/10", iconColor: "text-amber-400", desc: "Analyze dependencies, find vulnerabilities & plan safe upgrades" },
];

const stats = [
  { value: "200K", label: "Token Context" },
  { value: "500+", label: "Files per scan" },
  { value: "5", label: "Analysis modes" },
  { value: "Real-time", label: "Streaming" },
];

function CliInstallBlock() {
  const [copied, setCopied] = useState(false);
  const cmd = "npm install -g @shipwellapp/cli";
  return (
    <div className="inline-flex items-center gap-2 bg-bg border border-border rounded-lg px-4 py-2.5 font-mono text-[13px]">
      <span className="text-text-dim">$</span>
      <span className="text-accent">{cmd}</span>
      <button
        onClick={() => { navigator.clipboard.writeText(cmd); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
        className="text-text-dim hover:text-accent transition-colors p-0.5 ml-1"
      >
        {copied ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}
      </button>
    </div>
  );
}

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Redirect logged-in users straight to analysis
  useEffect(() => {
    if (!loading && user) {
      router.replace("/analysis");
    }
  }, [user, loading, router]);

  // Don't render landing if logged in (avoids flash)
  if (!loading && user) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <main className="flex-1">
        <div className="relative overflow-hidden">
          {/* Background effects */}
          <div className="absolute inset-0 bg-grid" />
          <div className="absolute inset-0 bg-radial-glow" />

          <div className="relative flex flex-col items-center px-6 pt-24 pb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl"
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/8 text-accent text-[13px] mb-8 border border-accent/15 font-medium"
              >
                <Zap className="w-3.5 h-3.5" />
                Powered by Claude &mdash; Deep cross-file analysis
              </motion.div>

              {/* Heading */}
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-[1.1] mb-6">
                Full Codebase
                <br />
                <span className="gradient-text">Autopilot</span>
              </h1>

              <p className="text-text-muted text-lg leading-relaxed mb-10 max-w-lg mx-auto">
                Feed your entire repository into one prompt. Get deep cross-file analysis
                that&apos;s impossible with file-by-file tools.
              </p>

              {/* CTA */}
              {!loading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                  className="flex items-center gap-4 justify-center"
                >
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-2 px-7 py-3 bg-accent hover:bg-accent-hover text-white font-semibold rounded-xl transition-all duration-200 glow-accent-lg text-[15px]"
                  >
                    <LogIn className="w-5 h-5" />
                    Get Started
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                </motion.div>
              )}
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex items-center gap-8 mt-16"
            >
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl font-bold text-text">{stat.value}</div>
                  <div className="text-xs text-text-dim mt-1">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Operations */}
        <div className="px-6 pb-20">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="text-center mb-12"
            >
              <h2 className="text-2xl font-bold mb-3">Five powerful analysis modes</h2>
              <p className="text-text-muted text-sm">Each operation performs deep cross-file analysis across your entire codebase</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {operations.map((op, i) => (
                <motion.div
                  key={op.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 + i * 0.08 }}
                  className={`bg-gradient-to-b ${op.color} border rounded-xl p-5 card-hover cursor-default`}
                >
                  <op.icon className={`w-8 h-8 ${op.iconColor} mb-4`} />
                  <h3 className="font-semibold text-sm mb-2">{op.label}</h3>
                  <p className="text-text-dim text-xs leading-relaxed">{op.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Features row */}
        <div className="border-t border-border">
          <div className="max-w-4xl mx-auto px-6 py-12">
            <div className="grid grid-cols-3 gap-8">
              {[
                { icon: Layers, label: "Cross-file Analysis", desc: "Finds issues spanning multiple files that single-file tools miss" },
                { icon: Code2, label: "Real-time Streaming", desc: "Watch findings appear live as Claude analyzes your code" },
                { icon: Shield, label: "Client-side Keys", desc: "Your API key stays in your browser, never touches our servers" },
              ].map((f, i) => (
                <motion.div
                  key={f.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.7 + i * 0.1 }}
                  className="text-center"
                >
                  <div className="w-10 h-10 rounded-xl bg-accent/8 border border-accent/10 flex items-center justify-center mx-auto mb-3">
                    <f.icon className="w-5 h-5 text-accent" />
                  </div>
                  <h3 className="font-semibold text-sm mb-1.5">{f.label}</h3>
                  <p className="text-text-dim text-xs leading-relaxed">{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* CLI Section */}
      <div className="border-t border-border bg-bg-card/30">
        <div className="max-w-4xl mx-auto px-6 py-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row items-center gap-10"
          >
            {/* Terminal mockup */}
            <div className="flex-1 w-full">
              <div className="rounded-xl border border-border overflow-hidden bg-bg shadow-2xl shadow-black/40">
                <div className="flex items-center gap-2 px-4 py-2.5 bg-bg-elevated border-b border-border">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                  </div>
                  <span className="text-[10px] text-text-dim font-mono ml-2">Terminal</span>
                </div>
                <div className="p-4 font-mono text-xs leading-relaxed">
                  <div><span className="text-success">$</span> <span className="text-text">npm i -g @shipwellapp/cli</span></div>
                  <div className="mt-2"><span className="text-success">$</span> <span className="text-text">shipwell audit</span> <span className="text-text-dim">https://github.com/user/repo</span></div>
                  <div className="mt-2 text-text-dim">
                    <span className="text-accent">{"⛵"}</span> Ingesting 342 files (187K tokens)...
                  </div>
                  <div className="text-text-dim">
                    <span className="text-success">{"✔"}</span> Found 12 findings (3 cross-file)
                  </div>
                </div>
              </div>
            </div>

            {/* CLI info */}
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/8 text-accent text-[11px] mb-4 border border-accent/15 font-medium">
                <Terminal className="w-3 h-3" />
                CLI Available
              </div>
              <h2 className="text-2xl font-bold mb-3 tracking-tight">
                Also available in your <span className="gradient-text">terminal</span>
              </h2>
              <p className="text-text-muted text-sm leading-relaxed mb-5">
                Run the same deep analysis from your command line.
                Supports GitHub URLs and local paths, with real-time streaming output.
              </p>
              <CliInstallBlock />
              <Link
                href="/cli"
                className="inline-flex items-center gap-1.5 text-accent text-sm hover:text-accent-hover font-medium mt-4"
              >
                View CLI docs
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-5 text-center text-text-dim text-xs">
        <div className="flex items-center justify-center gap-4">
          <span>Shipwell &copy; 2026 &middot; Built by Manas Dutta</span>
          <span className="text-border">&middot;</span>
          <Link href="/terms" className="hover:text-accent transition-colors">Terms</Link>
          <Link href="/privacy" className="hover:text-accent transition-colors">Privacy</Link>
        </div>
      </footer>
    </div>
  );
}
