"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Key, Check, X, Eye, EyeOff, Shield, Cpu, ExternalLink, Sparkles, Loader2, Github } from "lucide-react";
import clsx from "clsx";
import { AuthGuard } from "@/components/auth-guard";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { useApiKey } from "@/hooks/use-api-key";
import { AVAILABLE_MODELS, DEFAULT_MODEL } from "@shipwell/core/client";

export default function SettingsPage() {
  return (
    <AuthGuard>
      <SettingsContent />
    </AuthGuard>
  );
}

function SettingsContent() {
  const { apiKey, setApiKey, isConnected, loaded } = useApiKey();
  const [inputKey, setInputKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [selectedModel, setSelectedModel] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("shipwell_model") || DEFAULT_MODEL;
    }
    return DEFAULT_MODEL;
  });
  const [testStatus, setTestStatus] = useState<"idle" | "testing" | "success" | "error">("idle");
  const [testError, setTestError] = useState("");

  const handleConnect = async () => {
    const key = inputKey.trim();
    if (!key) return;

    setTestStatus("testing");
    setTestError("");

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": key,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 1,
          messages: [{ role: "user", content: "hi" }],
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error?.message || `HTTP ${res.status}`);
      }

      setApiKey(key);
      setInputKey("");
      setTestStatus("success");
      setTimeout(() => setTestStatus("idle"), 3000);
    } catch (err: any) {
      if (err.message?.includes("authentication") || err.message?.includes("invalid")) {
        setTestError("Invalid API key. Please check and try again.");
        setTestStatus("error");
      } else {
        setApiKey(key);
        setInputKey("");
        setTestStatus("success");
        setTimeout(() => setTestStatus("idle"), 3000);
      }
    }
  };

  const handleDisconnect = () => {
    setApiKey("");
    setTestStatus("idle");
    setTestError("");
  };

  const handleModelChange = (modelId: string) => {
    setSelectedModel(modelId);
    localStorage.setItem("shipwell_model", modelId);
  };

  const maskedKey = apiKey ? `${apiKey.slice(0, 10)}${"•".repeat(20)}${apiKey.slice(-4)}` : "";

  if (!loaded) return null;

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Grid background */}
      <div className="absolute inset-0 bg-grid pointer-events-none" />

      <Navbar />
      <main className="flex-1 max-w-2xl mx-auto w-full px-6 py-10 relative">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold tracking-tight mb-1">Settings</h1>
          <p className="text-text-muted text-sm mb-8">Manage your API connection and preferences</p>

          {/* API Key Section */}
          <section className="bg-bg-card/80 backdrop-blur-sm border border-border rounded-2xl overflow-hidden mb-6 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.02] to-transparent pointer-events-none" />
            <div className="relative">
              <div className="px-6 py-5 border-b border-border flex items-center gap-3">
                <div className={clsx(
                  "w-10 h-10 rounded-xl flex items-center justify-center",
                  isConnected ? "bg-success/10" : "bg-bg-elevated"
                )}>
                  <Key className={clsx("w-5 h-5", isConnected ? "text-success" : "text-text-dim")} />
                </div>
                <div className="flex-1">
                  <h2 className="font-semibold text-[15px]">Anthropic API Key</h2>
                  <p className="text-text-dim text-[12px]">
                    {isConnected ? "Connected — stored locally in your browser" : "Connect your API key to start analyzing"}
                  </p>
                </div>
                {isConnected && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-success/10 text-success rounded-full text-[11px] font-semibold ring-1 ring-success/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-success" />
                    Connected
                  </div>
                )}
              </div>

              <div className="p-6">
                {isConnected ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 bg-bg rounded-xl px-4 py-3 border border-border">
                      <span className="text-[13px] font-mono text-text-muted flex-1 truncate">
                        {showKey ? apiKey : maskedKey}
                      </span>
                      <button
                        onClick={() => setShowKey(!showKey)}
                        className="p-1.5 rounded-md text-text-dim hover:text-text hover:bg-bg-elevated transition-colors"
                      >
                        {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <button
                      onClick={handleDisconnect}
                      className="flex items-center gap-2 px-4 py-2.5 text-[13px] font-medium text-danger hover:bg-danger/5 rounded-xl transition-colors border border-danger/15"
                    >
                      <X className="w-4 h-4" />
                      Disconnect API Key
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <input
                        type="password"
                        value={inputKey}
                        onChange={(e) => setInputKey(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleConnect()}
                        placeholder="sk-ant-api03-..."
                        className="flex-1 bg-bg border border-border rounded-xl px-4 py-3 text-[13px] focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/30 placeholder:text-text-dim font-mono transition-colors"
                      />
                      <button
                        onClick={handleConnect}
                        disabled={!inputKey.trim() || testStatus === "testing"}
                        className="px-5 py-3 bg-accent hover:bg-accent-hover disabled:opacity-40 disabled:cursor-not-allowed text-white text-[13px] font-semibold rounded-xl transition-all duration-200 flex items-center gap-2"
                      >
                        {testStatus === "testing" ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Verifying
                          </>
                        ) : "Connect"}
                      </button>
                    </div>

                    {testError && (
                      <p className="text-danger text-[12px] flex items-center gap-1.5">
                        <X className="w-3.5 h-3.5" />
                        {testError}
                      </p>
                    )}

                    <div className="flex items-start gap-2.5 text-[12px] text-text-dim bg-bg-elevated/50 rounded-xl px-4 py-3">
                      <Shield className="w-4 h-4 mt-0.5 shrink-0 text-text-dim" />
                      <span className="leading-relaxed">
                        Your API key is stored only in your browser&apos;s localStorage. It is never sent to our servers — it&apos;s passed directly to Anthropic&apos;s API.
                      </span>
                    </div>

                    <a
                      href="https://console.anthropic.com/settings/keys"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-[12px] text-accent hover:text-accent-hover transition-colors font-medium"
                    >
                      Get an API key from Anthropic Console
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Model Selector */}
          <section className="bg-bg-card/80 backdrop-blur-sm border border-border rounded-2xl overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.02] to-transparent pointer-events-none" />
            <div className="relative">
              <div className="px-6 py-5 border-b border-border flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-bg-elevated flex items-center justify-center">
                  <Cpu className="w-5 h-5 text-text-dim" />
                </div>
                <div>
                  <h2 className="font-semibold text-[15px]">Model</h2>
                  <p className="text-text-dim text-[12px]">Choose the Claude model for analysis</p>
                </div>
              </div>

              <div className="p-4 space-y-2">
                {AVAILABLE_MODELS.map((model) => (
                  <button
                    key={model.id}
                    onClick={() => handleModelChange(model.id)}
                    className={clsx(
                      "w-full flex items-center justify-between px-4 py-3.5 rounded-xl border text-left transition-all duration-150",
                      selectedModel === model.id
                        ? "border-accent/40 bg-accent/5 ring-1 ring-accent/10 shadow-sm shadow-accent/10"
                        : "border-border hover:border-border-bright hover:bg-bg-elevated"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      {selectedModel === model.id ? (
                        <div className="w-5 h-5 rounded-full bg-accent flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-border" />
                      )}
                      <div>
                        <span className="text-[13px] font-semibold">{model.label}</span>
                        <span className="text-[11px] text-text-dim ml-2 font-mono">{model.id}</span>
                      </div>
                    </div>
                    {"default" in model && model.default && (
                      <span className="flex items-center gap-1 text-[10px] text-accent font-semibold uppercase tracking-wide">
                        <Sparkles className="w-3 h-3" />
                        Default
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* GitHub App Integration */}
          <section className="bg-bg-card/80 backdrop-blur-sm border border-border rounded-2xl overflow-hidden mt-6 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.02] to-transparent pointer-events-none" />
            <div className="relative">
              <div className="px-6 py-5 border-b border-border flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-bg-elevated flex items-center justify-center">
                  <Github className="w-5 h-5 text-text-dim" />
                </div>
                <div className="flex-1">
                  <h2 className="font-semibold text-[15px]">GitHub Integration</h2>
                  <p className="text-text-dim text-[12px]">
                    Install the Shipwell app to enable auto-fix PRs
                  </p>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <p className="text-text-muted text-[13px] leading-relaxed">
                  After analysis, click &quot;Create Fix PR&quot; and Shipwell will open a pull request with the suggested fixes — authored by <strong className="text-text">ShipwellHQ</strong>.
                </p>

                <a
                  href="https://github.com/apps/shipwellhq"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2.5 w-full px-5 py-3 bg-[#24292f] hover:bg-[#32383f] text-white text-[13px] font-semibold rounded-xl transition-all duration-200"
                >
                  <Github className="w-4 h-4" />
                  Install Shipwell on GitHub
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>

                <div className="flex items-start gap-2.5 text-[12px] text-text-dim bg-bg-elevated/50 rounded-xl px-4 py-3">
                  <Shield className="w-4 h-4 mt-0.5 shrink-0 text-text-dim" />
                  <span className="leading-relaxed">
                    The app only needs <code className="text-text-muted">Contents</code> and <code className="text-text-muted">Pull Requests</code> write access. You can choose specific repositories during installation.
                  </span>
                </div>
              </div>
            </div>
          </section>
        </motion.div>
      </main>

      <Footer minimal />
    </div>
  );
}
