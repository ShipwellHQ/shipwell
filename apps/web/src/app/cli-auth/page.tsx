"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Ship } from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { LogoLoader } from "@/components/logo-loader";

function CliAuthContent() {
  const { user, loading, signInWithGoogle } = useAuth();
  const searchParams = useSearchParams();
  const port = searchParams.get("port");
  const [redirected, setRedirected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && user && port && !redirected) {
      setRedirected(true);
      const params = new URLSearchParams({
        name: user.displayName || "User",
        email: user.email || "",
        uid: user.uid,
        ...(user.photoURL ? { photo: user.photoURL } : {}),
      });
      // Redirect to CLI's local server — it will immediately redirect
      // back to shipwell.app/cli-auth/success (localhost URL flashes briefly)
      window.location.href = `http://127.0.0.1:${port}/callback?${params.toString()}`;
    }
  }, [user, loading, port, redirected]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LogoLoader size={48} />
      </div>
    );
  }

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

  if (redirected) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center max-w-sm">
          <div className="w-12 h-12 rounded-xl bg-success/10 border border-success/20 flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">✓</span>
          </div>
          <h1 className="text-xl font-bold mb-2">Authenticated</h1>
          <p className="text-text-muted text-sm">
            Redirecting to CLI... You can close this tab.
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
          <div className="mb-5 flex justify-center">
            <Ship className="w-10 h-10 text-accent" />
          </div>
          <h1 className="text-2xl font-bold mb-2 tracking-tight">
            Sign in to <span className="gradient-text" style={{ fontFamily: "Menlo, Monaco, 'Courier New', monospace" }}>Shipwell CLI</span>
          </h1>
          <p className="text-text-muted text-sm leading-relaxed">
            Authenticate your terminal session
          </p>
        </div>

        <div className="bg-bg-card border border-border rounded-2xl p-6 shadow-2xl shadow-black/30">
          <button
            onClick={async () => {
              try {
                await signInWithGoogle();
              } catch (err: any) {
                setError(err.message || "Sign-in failed");
              }
            }}
            className="flex items-center justify-center gap-3 w-full px-4 py-3.5 bg-white hover:bg-gray-50 text-gray-800 font-semibold rounded-xl transition-all duration-200 text-[15px] shadow-sm"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>

          {error && (
            <p className="mt-3 text-center text-sm text-danger">{error}</p>
          )}

          <div className="mt-4 pt-3 border-t border-border">
            <p className="text-[11px] text-text-dim text-center">
              This will authenticate your <code className="text-accent">shipwell</code> CLI session
            </p>
          </div>
        </div>

        <div className="text-center mt-6">
          <p className="text-text-dim text-[11px]">
            Your API key stays local — never sent to our servers
          </p>
        </div>
      </div>
    </div>
  );
}

export default function CliAuthPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <LogoLoader size={48} />
        </div>
      }
    >
      <CliAuthContent />
    </Suspense>
  );
}
