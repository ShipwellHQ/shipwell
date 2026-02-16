"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Ship, ArrowUpRight, Copy, Check, Shield, GitBranch, BookOpen, PackageCheck, ArrowRight } from "lucide-react";
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
    <div className="absolute top-44 md:top-64 left-8 md:left-12 z-10">
      {/* Label chip */}
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-accent/20 bg-accent/5 mb-6">
        <span className="text-[11px] text-accent font-medium tracking-wider" style={{ fontFamily: "Menlo, Monaco, 'Courier New', monospace" }}>
          Not backed by{" "}
          <svg className="inline-block w-3.5 h-3.5 -mt-px mx-0.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="24" height="24" rx="5" fill="#F26522" />
            <path d="M8 4L12 12M16 4L12 12M12 12V20" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {" "}Combinator
        </span>
      </div>

      {/* Typing headline */}
      <div className="flex items-baseline gap-2 md:gap-3">
        <span className="text-accent/40 text-3xl md:text-4xl lg:text-5xl font-extralight select-none" style={{ fontFamily: "Menlo, Monaco, 'Courier New', monospace" }}>{">"}</span>
        <h1
          className="text-5xl md:text-7xl lg:text-8xl font-bold"
          style={{
            fontFamily: "Menlo, Monaco, 'Courier New', monospace",
            letterSpacing: "0.02em",
          }}
        >
          <span className="gradient-text">{displayed}</span>
          <span className="cursor-blink text-accent/60 font-extralight">|</span>
        </h1>
      </div>

      {/* Subtitle */}
      <p className="mt-5 text-[15px] md:text-base text-text-muted/80 tracking-wide max-w-sm leading-relaxed" style={{ fontFamily: "Menlo, Monaco, 'Courier New', monospace" }}>
        Full codebase autopilot powered
        <br className="hidden md:block" />
        {" "}by <span className="text-text font-medium">Claude Opus 4.6</span>
      </p>

      {/* Accent line */}
      <div className="mt-6 flex items-center gap-3">
        <div className="h-px w-12 bg-gradient-to-r from-accent/60 to-transparent" />
        <span className="text-[11px] text-text-dim tracking-widest uppercase" style={{ fontFamily: "Menlo, Monaco, 'Courier New', monospace" }}>1M token context</span>
      </div>
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
      className="group inline-flex items-center gap-3 bg-bg border border-border rounded-lg px-4 py-2.5 text-sm hover:border-accent/40 transition-all duration-300"
      style={{ fontFamily: "Menlo, Monaco, 'Courier New', monospace" }}
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

            {/* Product info — key/value terminal style */}
            <div className="flex flex-col gap-3 max-w-5xl" style={{ fontFamily: "Menlo, Monaco, 'Courier New', monospace" }}>
              <div className="flex items-center gap-4">
                <span className="text-accent text-sm w-16 shrink-0">Name</span>
                <span className="text-text text-base" style={{ letterSpacing: "0.04em" }}>Shipwell</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-accent text-sm w-16 shrink-0">Engine</span>
                <span className="text-text text-sm">Claude Opus 4.6 — 1M token context</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-accent text-sm w-16 shrink-0">Input</span>
                <span className="text-text text-sm">Entire codebase — every file, every dependency</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-accent text-sm w-16 shrink-0">Output</span>
                <span className="text-text text-sm">Findings, diffs, and auto-fix PRs — streamed live</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-accent text-sm w-16 shrink-0">Install</span>
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
            <div className="flex flex-col md:flex-row" style={{ fontFamily: "Menlo, Monaco, 'Courier New', monospace" }}>
              {/* Terminal output — left */}
              <div className="flex-1 p-6 text-[13px] leading-[1.9]">
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
              {/* Stats panel — right */}
              <div className="hidden md:flex flex-col justify-center gap-5 px-8 py-6 border-l border-border bg-bg-elevated/30 w-64 shrink-0">
                <div>
                  <div className="text-3xl font-bold text-text">847</div>
                  <div className="text-[11px] text-text-dim mt-1">files scanned</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-text">412K</div>
                  <div className="text-[11px] text-text-dim mt-1">tokens ingested</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-[#ef4444]">18</div>
                  <div className="text-[11px] text-text-dim mt-1">findings detected</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-success">14</div>
                  <div className="text-[11px] text-text-dim mt-1">auto-fixes applied</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
