"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Ship, CheckCircle2, Terminal } from "lucide-react";
import { LogoLoader } from "@/components/logo-loader";

function SuccessContent() {
  const searchParams = useSearchParams();
  const name = searchParams.get("name") || "User";
  const email = searchParams.get("email") || "";

  return (
    <div className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid" />
      <div className="absolute inset-0 bg-radial-glow" />

      <div className="w-full max-w-sm relative">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-success/10 border border-success/20 flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 className="w-8 h-8 text-success" />
          </div>
          <h1 className="text-2xl font-bold mb-2 tracking-tight">
            Welcome to <span className="gradient-text" style={{ fontFamily: "Menlo, Monaco, 'Courier New', monospace" }}>Shipwell</span>
          </h1>
          <p className="text-text-muted text-sm leading-relaxed">
            Signed in as <span className="text-accent font-semibold">{name}</span>
          </p>
          {email && (
            <p className="text-text-dim text-xs mt-1">{email}</p>
          )}
        </div>

        <div className="bg-bg-card border border-border rounded-2xl p-6 shadow-2xl shadow-black/30">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
              <Terminal className="w-4 h-4 text-accent" />
            </div>
            <div>
              <p className="text-sm font-medium">Next step</p>
              <p className="text-text-dim text-xs">Set your Anthropic API key</p>
            </div>
          </div>
          <div className="bg-bg-elevated rounded-xl p-3 border border-border">
            <code className="text-accent text-sm">
              shipwell config set api-key sk-ant-...
            </code>
          </div>
        </div>

        <div className="text-center mt-6">
          <p className="text-text-dim text-[11px]">
            You can close this tab and return to your terminal.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function CliAuthSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <LogoLoader size={48} />
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
