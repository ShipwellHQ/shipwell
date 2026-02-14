"use client";

import { useState, useCallback, useRef } from "react";
import type { Finding, MetricEvent } from "@shipwell/core";

export interface SSEState {
  status: "idle" | "connecting" | "streaming" | "complete" | "error";
  rawText: string;
  findings: Finding[];
  metrics: MetricEvent[];
  summary: string | null;
  error: string | null;
  phase: string | null;
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
  });

  const abortRef = useRef<AbortController | null>(null);

  const start = useCallback(async (body: {
    operation: string;
    source: string;
    apiKey: string;
    target?: string;
    context?: string;
  }) => {
    // Abort any existing stream
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setState({
      status: "connecting",
      rawText: "",
      findings: [],
      metrics: [],
      summary: null,
      error: null,
      phase: "ingesting",
    });

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      if (!response.ok) {
        const err = await response.text();
        setState(prev => ({ ...prev, status: "error", error: err || `HTTP ${response.status}` }));
        return;
      }

      const reader = response.body?.getReader();
      if (!reader) {
        setState(prev => ({ ...prev, status: "error", error: "No response body" }));
        return;
      }

      const decoder = new TextDecoder();
      let buffer = "";
      let fullText = "";
      const allFindings: Finding[] = [];
      const allMetrics: MetricEvent[] = [];

      setState(prev => ({ ...prev, status: "streaming", phase: "analyzing" }));

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // Process SSE events
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
                setState(prev => ({ ...prev, findings: [...allFindings] }));
              } else if (event.type === "metric") {
                allMetrics.push(event.data);
                setState(prev => ({ ...prev, metrics: [...allMetrics] }));
              } else if (event.type === "status") {
                setState(prev => ({ ...prev, phase: event.data.phase }));
              } else if (event.type === "summary") {
                setState(prev => ({ ...prev, summary: event.data }));
              } else if (event.type === "error") {
                setState(prev => ({ ...prev, status: "error", error: event.data }));
              }
            } catch {
              // Ignore parse errors for partial chunks
            }
          }
        }
      }

      setState(prev => ({ ...prev, status: "complete" }));
    } catch (err: any) {
      if (err.name === "AbortError") return;
      setState(prev => ({ ...prev, status: "error", error: err.message }));
    }
  }, []);

  const stop = useCallback(() => {
    abortRef.current?.abort();
    setState(prev => ({ ...prev, status: "complete" }));
  }, []);

  return { ...state, start, stop };
}
