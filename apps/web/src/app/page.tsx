"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Ship, Shield, ArrowRight, GitBranch, FileCode2, Zap, Scan, BookOpen, PackageCheck } from "lucide-react";
import Link from "next/link";

const operations = [
  { id: "audit", label: "Security Audit", icon: Shield, desc: "Find vulnerabilities across your entire codebase" },
  { id: "migrate", label: "Migration", icon: ArrowRight, desc: "Plan framework & library migrations with full diffs" },
  { id: "refactor", label: "Refactor", icon: GitBranch, desc: "Detect duplication, dead code & architecture issues" },
  { id: "docs", label: "Documentation", icon: BookOpen, desc: "Generate comprehensive docs from your code" },
  { id: "upgrade", label: "Dependency Upgrade", icon: PackageCheck, desc: "Analyze & plan dependency upgrades safely" },
];

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Nav */}
      <nav className="border-b border-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Ship className="w-6 h-6 text-accent" />
          <span className="text-lg font-bold">Shipwell</span>
        </div>
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-text-muted hover:text-text text-sm"
        >
          GitHub
        </a>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-sm mb-6 border border-accent/20">
            <Zap className="w-3.5 h-3.5" />
            Powered by Claude Opus 4.6 — 1M token context
          </div>

          <h1 className="text-5xl font-bold tracking-tight mb-4">
            Full Codebase
            <br />
            <span className="text-accent">Autopilot</span>
          </h1>

          <p className="text-text-muted text-lg mb-10 max-w-xl mx-auto">
            Feed your entire repository into one prompt. Get deep cross-file analysis
            that&apos;s impossible with file-by-file tools.
          </p>

          <Link
            href="/analysis"
            className="inline-flex items-center gap-2 px-6 py-3 bg-accent hover:bg-accent-hover text-white font-medium rounded-lg transition-colors glow-accent"
          >
            <Scan className="w-5 h-5" />
            Start Analysis
          </Link>
        </motion.div>

        {/* Operation cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-16 max-w-5xl w-full"
        >
          {operations.map((op, i) => (
            <motion.div
              key={op.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
              className="bg-bg-card border border-border rounded-lg p-4 hover:border-accent/50 transition-colors"
            >
              <op.icon className="w-8 h-8 text-accent mb-3" />
              <h3 className="font-semibold text-sm mb-1">{op.label}</h3>
              <p className="text-text-dim text-xs leading-relaxed">{op.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-wrap justify-center gap-6 mt-16 text-text-muted text-sm"
        >
          <div className="flex items-center gap-2">
            <FileCode2 className="w-4 h-4 text-accent" />
            Cross-file analysis
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-accent" />
            Real-time streaming
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-accent" />
            Your API key, client-side only
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-4 text-center text-text-dim text-xs">
        Built for the Built with Opus 4.6 Hackathon
      </footer>
    </div>
  );
}
