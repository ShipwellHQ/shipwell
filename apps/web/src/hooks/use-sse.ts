"use client";

import { useState, useCallback, useRef } from "react";
import type { Finding, MetricEvent } from "@shipwell/core/client";
import demoData from "@/data/demo-analysis.json";

export interface ActivityEntry {
  id: string;
  icon: "clone" | "read" | "bundle" | "analyze" | "finding" | "metric" | "done" | "error";
  message: string;
  timestamp: number;
  done: boolean;
}

export interface TokenInfo {
  codebaseTokens: number;
  maxCodebaseTokens: number;
  maxOutputTokens: number;
}

export interface SSEState {
  status: "idle" | "connecting" | "streaming" | "complete" | "error";
  rawText: string;
  findings: Finding[];
  metrics: MetricEvent[];
  summary: string | null;
  error: string | null;
  phase: string | null;
  activity: ActivityEntry[];
  startedAt: number;
  tokenInfo: TokenInfo | null;
}

export function useSSE() {
  const [state, setState] = useState<SSEState>({
    status: "idle",
    rawText: "",
    findings: [],
    metrics: [],
    summary: null,
    error: null,
    phase: null,
    activity: [],
    startedAt: 0,
    tokenInfo: null,
  });

  const abortRef = useRef<AbortController | null>(null);
  const activityRef = useRef<ActivityEntry[]>([]);
  const findingCountRef = useRef(0);

  function addActivity(icon: ActivityEntry["icon"], message: string, done = false): string {
    const id = `act-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const entry: ActivityEntry = { id, icon, message, timestamp: Date.now(), done };
    activityRef.current = [...activityRef.current, entry];
    setState(prev => ({ ...prev, activity: activityRef.current }));
    return id;
  }

  function completeActivity(id: string) {
    activityRef.current = activityRef.current.map(a =>
      a.id === id ? { ...a, done: true } : a
    );
    setState(prev => ({ ...prev, activity: activityRef.current }));
  }

  const start = useCallback(async (body: {
    operation: string;
    source: string;
    apiKey: string;
    model?: string;
    target?: string;
    context?: string;
  }) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    activityRef.current = [];
    findingCountRef.current = 0;

    setState({
      status: "connecting",
      rawText: "",
      findings: [],
      metrics: [],
      summary: null,
      error: null,
      phase: "ingesting",
      activity: [],
      startedAt: Date.now(),
      tokenInfo: null,
    });

    const isGithub = body.source.startsWith("https://github.com");
    const connectId = addActivity(
      "clone",
      isGithub ? `Cloning ${body.source.split("/").slice(-2).join("/")}...` : `Reading ${body.source}...`
    );

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      if (!response.ok) {
        const err = await response.text();
        completeActivity(connectId);
        addActivity("error", err || `HTTP ${response.status}`, true);
        setState(prev => ({ ...prev, status: "error", error: err || `HTTP ${response.status}` }));
        return;
      }

      completeActivity(connectId);

      const reader = response.body?.getReader();
      if (!reader) {
        addActivity("error", "No response body", true);
        setState(prev => ({ ...prev, status: "error", error: "No response body" }));
        return;
      }

      const decoder = new TextDecoder();
      let buffer = "";
      let fullText = "";
      const allFindings: Finding[] = [];
      const allMetrics: MetricEvent[] = [];
      let analyzeId: string | null = null;

      setState(prev => ({ ...prev, status: "streaming", phase: "analyzing" }));

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") continue;

            try {
              const event = JSON.parse(data);

              if (event.type === "text") {
                fullText += event.data;
                setState(prev => ({ ...prev, rawText: fullText }));
              } else if (event.type === "finding") {
                allFindings.push(event.data);
                findingCountRef.current++;
                const f = event.data;
                const severity = f.severity ? `[${f.severity}] ` : "";
                const cross = f.crossFile ? " (cross-file)" : "";
                addActivity("finding", `${severity}${f.title}${cross}`, true);
                setState(prev => ({ ...prev, findings: [...allFindings] }));
              } else if (event.type === "metric") {
                allMetrics.push(event.data);
                addActivity("metric", `${event.data.label}: ${event.data.before} → ${event.data.after}`, true);
                setState(prev => ({ ...prev, metrics: [...allMetrics] }));
              } else if (event.type === "status") {
                const phase = event.data.phase;
                const msg = event.data.message;

                if (phase === "bundling") {
                  addActivity("read", msg, true);
                } else if (phase === "analyzing") {
                  addActivity("bundle", msg, true);
                  analyzeId = addActivity("analyze", `Running ${body.operation} analysis...`);
                } else if (phase === "complete") {
                  if (analyzeId) completeActivity(analyzeId);
                }

                setState(prev => ({ ...prev, phase }));
              } else if (event.type === "token_info") {
                setState(prev => ({ ...prev, tokenInfo: event.data }));
              } else if (event.type === "summary") {
                setState(prev => ({ ...prev, summary: event.data }));
              } else if (event.type === "error") {
                if (analyzeId) completeActivity(analyzeId);
                addActivity("error", event.data, true);
                setState(prev => ({ ...prev, status: "error", error: event.data }));
              }
            } catch {
              // Ignore parse errors
            }
          }
        }
      }

      if (analyzeId) completeActivity(analyzeId);
      addActivity("done", `Analysis complete — ${allFindings.length} findings`, true);
      setState(prev => ({ ...prev, status: "complete" }));
    } catch (err: any) {
      if (err.name === "AbortError") return;
      addActivity("error", err.message, true);
      setState(prev => ({ ...prev, status: "error", error: err.message }));
    }
  }, []);

  const stop = useCallback(() => {
    abortRef.current?.abort();
    addActivity("done", "Analysis stopped", true);
    setState(prev => ({ ...prev, status: "complete" }));
  }, []);

  const loadDemo = useCallback(async () => {
    abortRef.current?.abort();
    activityRef.current = [];
    findingCountRef.current = 0;

    const startedAt = Date.now();

    setState({
      status: "connecting",
      rawText: "",
      findings: [],
      metrics: [],
      summary: null,
      error: null,
      phase: "ingesting",
      activity: [],
      startedAt,
      tokenInfo: null,
    });

    const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

    // Simulate clone
    addActivity("clone", "Cloning acme/api-server...");
    await delay(800);
    activityRef.current = activityRef.current.map((a) =>
      a.icon === "clone" ? { ...a, done: true } : a
    );
    setState((prev) => ({ ...prev, activity: activityRef.current }));

    // Simulate read
    addActivity("read", "Read 342 files (47 skipped)", true);
    await delay(500);

    // Simulate bundle
    addActivity("bundle", "Bundled 295 files (~187K tokens)", true);
    setState((prev) => ({
      ...prev,
      status: "streaming",
      phase: "analyzing",
      tokenInfo: demoData.tokenInfo as TokenInfo,
    }));
    await delay(400);

    const analyzeId = addActivity("analyze", "Running audit analysis...");

    // Stream findings with staggered delays
    const allFindings: Finding[] = [];
    for (const finding of demoData.findings as Finding[]) {
      await delay(400 + Math.random() * 300);
      allFindings.push(finding);
      findingCountRef.current++;
      const severity = finding.severity ? `[${finding.severity}] ` : "";
      const cross = finding.crossFile ? " (cross-file)" : "";
      addActivity("finding", `${severity}${finding.title}${cross}`, true);
      setState((prev) => ({ ...prev, findings: [...allFindings] }));
    }

    // Stream metrics
    const allMetrics: MetricEvent[] = [];
    for (const metric of demoData.metrics as MetricEvent[]) {
      await delay(200);
      allMetrics.push(metric);
      addActivity("metric", `${metric.label}: ${metric.before} → ${metric.after}`, true);
      setState((prev) => ({ ...prev, metrics: [...allMetrics] }));
    }

    // Complete
    completeActivity(analyzeId);
    addActivity("done", `Analysis complete — ${allFindings.length} findings`, true);
    setState((prev) => ({
      ...prev,
      status: "complete",
      phase: "complete",
      summary: demoData.summary,
      rawText: `<!-- Demo mode: ${allFindings.length} findings, ${allMetrics.length} metrics -->`,
    }));
  }, []);

  return { ...state, start, stop, loadDemo };
}
