"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Ship, ArrowUpRight, Copy, Check, Shield, GitBranch, BookOpen, PackageCheck, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { useAuth } from "@/components/auth-provider";

// ── Components ───────────────────────────────────────────────

function SplineScene() {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="absolute inset-0 w-full h-full bg-bg overflow-hidden">
      {/* Loading overlay — dark bg until iframe is ready, prevents white flash */}
      <div
        className="absolute inset-0 w-full h-full flex items-center justify-center z-10 bg-bg transition-opacity duration-700"
        style={{ opacity: isLoaded ? 0 : 1, pointerEvents: isLoaded ? "none" : "auto" }}
      >
        <div className="text-text text-center">
          <Ship className="w-8 h-8 text-accent mx-auto mb-3 animate-pulse" />
          <div className="text-sm text-text-dim font-mono">Loading 3D Scene...</div>
        </div>
      </div>

      {/* Spline iframe — invert+hue-rotate flips white bg → black while preserving model colors */}
      <iframe
        src="https://my.spline.design/interactiveaiassistant-fOED4V5WTp1lOQ2jtzaglYzg/"
        frameBorder="0"
        width="100%"
        height="100%"
        allow="autoplay"
        className="absolute inset-0"
        style={{
          border: "none",
          filter: "invert(0.965) hue-rotate(180deg)",
          transform: "scale(1.05) translateX(20%)",
          transformOrigin: "center center",
        }}
        onLoad={() => setIsLoaded(true)}
      />

      {/* Dark vignette — softens edges into the page bg */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{ boxShadow: "inset 0 0 80px 40px #09090b" }}
      />

      {/* Cover Spline watermark */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-bg to-transparent z-20 pointer-events-none" />
    </div>
  );
}

const WORDS = ["Audit", "Migrate", "Refactor", "Docs", "Upgrade"];

function HeroTextOverlay() {
  const [index, setIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [phase, setPhase] = useState<"typing" | "hold" | "deleting">("typing");

  const word = WORDS[index];

  useEffect(() => {
    if (phase === "typing") {
      if (displayed.length < word.length) {
        const t = setTimeout(() => setDisplayed(word.slice(0, displayed.length + 1)), 100);
        return () => clearTimeout(t);
      }
      setPhase("hold");
    } else if (phase === "hold") {
      const t = setTimeout(() => setPhase("deleting"), 1800);
      return () => clearTimeout(t);
    } else if (phase === "deleting") {
      if (displayed.length > 0) {
        const t = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 60);
        return () => clearTimeout(t);
      }
      setIndex((i) => (i + 1) % WORDS.length);
      setPhase("typing");
    }
  }, [displayed, phase, word]);

  return (
    <div className="absolute top-48 md:top-72 left-8 z-10">
      <h1
        className="text-6xl md:text-7xl lg:text-8xl mb-1"
        style={{
          fontFamily: "Menlo, Monaco, 'Courier New', monospace",
          color: "rgb(9, 9, 11)",
          WebkitTextStroke: "4px #6366f1",
          paintOrder: "stroke fill",
          letterSpacing: "0.06em",
        }}
      >
        {displayed}
        <span className="cursor-blink text-accent">|</span>
      </h1>
      <p className="text-text font-mono text-sm md:text-base max-w-xs tracking-widest mt-6">
        Full Codebase Autopilot.
        <br />
        Powered by Opus 4.6
      </p>
    </div>
  );
}

function RotatingTextAccent() {
  const text = " AUDIT \u00B7 MIGRATE \u00B7 REFACTOR \u00B7 DOCS \u00B7 UPGRADE \u00B7";

  return (
    <div className="absolute bottom-20 right-8 w-24 h-24 md:w-32 md:h-32">
      <div className="relative w-full h-full">
        <div className="absolute inset-0 flex items-center justify-center">
          <Ship className="w-8 h-8 md:w-10 md:h-10 text-accent" />
        </div>

        <div className="absolute inset-0 animate-spin-slow">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <defs>
              <path id="circle" d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0" />
            </defs>
            <text className="text-xs fill-white font-medium" style={{ fontSize: "7.5px" }}>
              <textPath href="#circle" startOffset="0%">
                {text.repeat(2)}
              </textPath>
            </text>
          </svg>
        </div>
      </div>
    </div>
  );
}

function CopyInstall() {
  const [copied, setCopied] = useState(false);
  const cmd = "npm install -g @shipwellapp/cli";
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(cmd); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className="group inline-flex items-center gap-3 bg-bg border border-border rounded-lg px-4 py-2.5 font-mono text-sm hover:border-accent/40 transition-all duration-300"
    >
      <span className="text-text-dim">$</span>
      <span className="text-text-muted group-hover:text-accent transition-colors">{cmd}</span>
      {copied ? <Check className="w-4 h-4 text-success shrink-0" /> : <Copy className="w-4 h-4 text-text-dim group-hover:text-accent transition-colors shrink-0" />}
    </button>
  );
}

// ── Page ─────────────────────────────────────────────────────

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) router.replace("/analysis");
  }, [user, loading, router]);

  if (!loading && user) return null;

  return (
    <div className="w-full min-h-screen py-0 bg-bg">
      <Navbar />

      <div className="max-w-[1200px] mx-auto">
        {/* ── Hero with 3D Scene ─────────────────────────── */}
        <main className="w-full relative h-[600px]">
          <SplineScene />
          <HeroTextOverlay />
          <RotatingTextAccent />
        </main>

        {/* ── Info Section with Grid Background ──────────── */}
        <section
          className="relative rounded-3xl py-7 mx-4 md:mx-0 w-[calc(100%-2rem)] md:w-full bg-bg-card border border-border pb-20"
          style={{
            backgroundImage: `
              linear-gradient(var(--color-border) 1px, transparent 1px),
              linear-gradient(90deg, var(--color-border) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
          }}
        >
          {/* Decorative + signs */}
          <div className="absolute top-8 left-8 text-text opacity-50 text-5xl font-extralight leading-[0rem]" style={{ fontFamily: "var(--font-mono)" }}>+</div>
          <div className="absolute top-8 right-8 text-text opacity-50 text-5xl font-extralight leading-[0]" style={{ fontFamily: "var(--font-mono)" }}>+</div>
          <div className="absolute bottom-8 left-8 text-text opacity-50 text-5xl font-extralight" style={{ fontFamily: "var(--font-mono)" }}>+</div>
          <div className="absolute bottom-8 right-8 text-text opacity-50 text-5xl font-extralight" style={{ fontFamily: "var(--font-mono)" }}>+</div>

          <div className="px-6 md:px-20 lg:px-40">
            {/* Analysis modes — minimal showcase */}
            <div className="flex items-center justify-center mb-10 gap-6 md:gap-11 flex-wrap">
              {[
                { icon: Shield, label: "Audit" },
                { icon: ArrowRight, label: "Migrate" },
                { icon: GitBranch, label: "Refactor" },
                { icon: BookOpen, label: "Docs" },
                { icon: PackageCheck, label: "Upgrade" },
              ].map((m) => (
                <div key={m.label} className="flex flex-col items-center gap-2">
                  <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-bg border border-border flex items-center justify-center">
                    <m.icon className="w-6 h-6 text-accent" />
                  </div>
                  <span className="text-text font-mono text-xs tracking-wider">{m.label}</span>
                </div>
              ))}
            </div>

            {/* Product info — key/value mono style */}
            <div className="flex flex-col gap-2.5 max-w-5xl">
              <div className="flex items-center gap-4">
                <span className="text-accent font-mono text-sm w-16 shrink-0">Name</span>
                <span className="text-text text-base" style={{ fontFamily: "Menlo, Monaco, 'Courier New', monospace", letterSpacing: "0.04em" }}>Shipwell</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-accent font-mono text-sm w-16 shrink-0">Engine</span>
                <span className="text-text font-mono text-sm">Claude Opus 4.6 — 1M token context</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-accent font-mono text-sm w-16 shrink-0">Input</span>
                <span className="text-text font-mono text-sm">Entire codebase — every file, every dependency</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-accent font-mono text-sm w-16 shrink-0">Output</span>
                <span className="text-text font-mono text-sm">Findings, diffs, and auto-fix PRs — streamed live</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-accent font-mono text-sm w-16 shrink-0">Install</span>
                <CopyInstall />
              </div>
            </div>
          </div>
        </section>

        {/* ── Terminal Preview ────────────────────────────── */}
        <section className="px-4 md:px-0 mt-16">
          <div className="rounded-2xl border border-border overflow-hidden bg-bg-card">
            <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-bg-elevated">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-[#ef4444]/70" />
                <div className="w-3 h-3 rounded-full bg-[#f59e0b]/70" />
                <div className="w-3 h-3 rounded-full bg-[#22c55e]/70" />
              </div>
              <span className="text-[11px] text-text-dim font-mono">~/project</span>
              <div className="w-12" />
            </div>
            <div className="p-6 font-mono text-[13px] leading-[1.9]">
              <div><span className="text-success">$</span> <span className="text-text">shipwell audit</span> <span className="text-text-muted">./my-saas-app</span></div>
              <div className="text-text-dim">&nbsp;</div>
              <div className="text-text-dim"><span className="text-accent">{"\u26F5"}</span> Packing 847 files into context <span className="text-text-dim">(412,038 tokens)</span></div>
              <div className="text-text-dim"><span className="text-accent">{"\u26F5"}</span> Streaming analysis from Opus 4.6...</div>
              <div className="text-text-dim">&nbsp;</div>
              <div><span className="text-[#ef4444]">  CRITICAL</span> <span className="text-text">SQL injection via unsanitized input</span> <span className="text-accent">src/db/queries.ts:47</span></div>
              <div><span className="text-[#ef4444]">  CRITICAL</span> <span className="text-text">JWT secret hardcoded in source</span> <span className="text-accent">src/config/auth.ts:12</span></div>
              <div><span className="text-[#f59e0b]">  HIGH</span>     <span className="text-text">Missing rate-limit on auth endpoints</span> <span className="text-accent">src/api/login.ts:8</span></div>
              <div><span className="text-[#f59e0b]">  HIGH</span>     <span className="text-text">Open redirect in OAuth callback</span> <span className="text-accent">src/api/oauth.ts:31</span></div>
              <div className="text-text-dim">&nbsp;</div>
              <div><span className="text-success">  {"\u2714"}</span> <span className="text-text">18 findings</span> <span className="text-text-dim">(2 critical · 4 high · 7 medium · 5 low)</span></div>
              <div><span className="text-success">  {"\u2714"}</span> <span className="text-text">PR #63 opened</span> <span className="text-accent">with 14 auto-fixes applied</span></div>
            </div>
          </div>
        </section>
      </div>

      {/* ── Footer ─────────────────────────────────────────── */}
      <footer className="w-full px-6 relative py-0 mt-28 h-auto mb-0 bg-bg-card">
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
                style={{ fontFamily: "var(--font-mono)" }}
              >
                See What Others Miss.
              </h2>

              <div className="space-y-4 text-text">
                <div className="flex items-start gap-3">
                  <span className="text-accent mt-1">{"\u2022"}</span>
                  <p className="text-sm font-mono">Your entire codebase in one prompt — cross-file vulnerabilities, circular dependencies, dead code paths.</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-accent mt-1">{"\u2022"}</span>
                  <p className="text-sm font-mono">One command. Five operations. Auto-fix PRs pushed to your repo in seconds.</p>
                </div>
              </div>
            </div>

            {/* Right — large ship icon */}
            <div className="hidden md:flex flex-1 justify-end items-center">
              <Ship className="w-48 h-48 text-accent opacity-10" />
            </div>
          </div>

          {/* Bottom bar */}
          <div className="w-full px-6 py-16 flex flex-col md:flex-row items-center justify-center md:justify-between gap-6 md:gap-0 border-t border-border mt-16">
            <div className="flex flex-col md:flex-row gap-2 text-center md:text-left">
              <h2 className="text-text text-3xl flex items-center gap-2.5" style={{ fontFamily: "Menlo, Monaco, 'Courier New', monospace", letterSpacing: "0.04em" }}>
                <Ship className="w-6 h-6 text-accent" />
                Shipwell
              </h2>
              <p className="text-text font-mono font-normal text-base">Full Codebase Autopilot</p>
            </div>

            {!loading && (
              <Link
                href="/login"
                className="bg-accent text-white px-8 py-4 rounded-full font-semibold text-lg whitespace-nowrap hover:scale-105 hover:shadow-[0_0_20px_rgba(99,102,241,0.5)] transition-all duration-300 font-mono flex items-center gap-2"
              >
                Get Started
                <ArrowUpRight className="w-5 h-5" />
              </Link>
            )}
          </div>

          <div className="w-full px-6 py-4 border-t border-border flex items-center justify-between gap-2">
            <p className="text-text-dim text-sm font-mono">&copy; 2026 <span style={{ fontFamily: "Menlo, Monaco, 'Courier New', monospace", letterSpacing: "0.04em" }}>Shipwell</span></p>
            <div className="flex items-center gap-4 text-text-dim text-sm font-mono">
              <Link href="/cli" className="hover:text-accent transition-colors">CLI</Link>
              <Link href="/github-app" className="hover:text-accent transition-colors">GitHub App</Link>
              <a href="https://github.com/ShipwellHQ/shipwell" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">GitHub</a>
              <Link href="/terms" className="hover:text-accent transition-colors">Terms</Link>
              <Link href="/privacy" className="hover:text-accent transition-colors">Privacy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
