"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Ship, CheckCircle2, Terminal } from "lucide-react";
import { LogoLoader } from "@/components/logo-loader";

function SuccessContent() {
  const searchParams = useSearchParams();
  const port = searchParams.get("port");
  const name = searchParams.get("name") || "User";
  const email = searchParams.get("email") || "";
  const uid = searchParams.get("uid") || "";
  const photo = searchParams.get("photo") || undefined;
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!port || sent) return;

    const params = new URLSearchParams({
      name,
      email,
      uid,
      ...(photo ? { photo } : {}),
    });

    // Use an Image request to bypass CORS / mixed-content (HTTPS→HTTP) restrictions.
    // The server returns a 1x1 gif; onload confirms delivery.
    const img = new Image();
    img.onload = () => setSent(true);
    img.onerror = () => {
      // Even on "error" (non-image response), the HTTP request was made.
      // Give the CLI a moment to process, then assume success.
      setTimeout(() => setSent(true), 500);
    };
    img.src = `http://127.0.0.1:${port}/callback?${params.toString()}`;
  }, [port, name, email, uid, photo, sent]);

  if (!port) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center max-w-sm">
          <Ship className="w-10 h-10 text-accent mx-auto mb-4" />
          <h1 className="text-xl font-bold mb-2">Invalid Request</h1>
          <p className="text-text-muted text-sm">
            This page is used by the Shipwell CLI for authentication.
            Run <code className="text-accent bg-bg-elevated px-1.5 py-0.5 rounded">shipwell login</code> in your terminal.
          </p>
        </div>
      </div>
    );
  }

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
            Welcome to <span className="gradient-text">Shipwell</span>
          </h1>
          <p className="text-text-muted text-sm leading-relaxed">
            Signed in as <span className="text-accent font-semibold">{name}</span>
          </p>
          {email && (
            <p className="text-text-dim text-xs mt-1">{email}</p>
          )}
        </div>

        <div className="bg-bg-card border border-border rounded-2xl p-6 shadow-2xl shadow-black/30">
          {error ? (
            <div className="text-center">
              <p className="text-danger text-sm mb-3">{error}</p>
              <p className="text-text-muted text-xs">
                Try running <code className="text-accent">shipwell login</code> again.
              </p>
            </div>
          ) : (
            <>
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
            </>
          )}
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
