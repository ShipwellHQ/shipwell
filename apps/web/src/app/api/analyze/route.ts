import { NextRequest } from "next/server";
import { ingestRepo, bundleCodebase, streamAnalysis, StreamingParser, DEFAULT_MODEL, getMaxCodebaseTokens, getMaxOutputTokens } from "@shipwell/core";
import type { Operation } from "@shipwell/core";

export const maxDuration = 300; // 5 min max for long analyses

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { operation, source, apiKey, model, target, context } = body as {
    operation: Operation;
    source: string;
    apiKey: string;
    model?: string;
    target?: string;
    context?: string;
  };

  if (!operation || !source || !apiKey) {
    return new Response("Missing required fields: operation, source, apiKey", { status: 400 });
  }

  const selectedModel = model || DEFAULT_MODEL;
  const maxCodebaseTokens = getMaxCodebaseTokens(selectedModel);

  const encoder = new TextEncoder();
  const parser = new StreamingParser();

  const stream = new ReadableStream({
    async start(controller) {
      function send(type: string, data: any) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type, data })}\n\n`));
      }

      try {
        // Phase 1: Ingest
        send("status", { phase: "ingesting", message: "Cloning and reading repository..." });

        const ingestResult = await ingestRepo({ source, maxTokens: maxCodebaseTokens });
        send("status", {
          phase: "bundling",
          message: `Read ${ingestResult.totalFiles} files (${ingestResult.skippedFiles} skipped)`,
        });

        // Phase 2: Bundle
        const bundle = bundleCodebase(ingestResult);
        send("status", {
          phase: "analyzing",
          message: `Bundled ${bundle.includedFiles} files (~${Math.round(bundle.totalTokens / 1000)}K tokens)`,
        });

        // Send token info for gauge
        send("token_info", {
          codebaseTokens: bundle.totalTokens,
          maxCodebaseTokens,
          maxOutputTokens: getMaxOutputTokens(selectedModel),
        });

        // Phase 3: Stream analysis
        let chunkBuffer = "";
        let lastParseTime = 0;
        const PARSE_INTERVAL = 500; // Parse every 500ms

        for await (const chunk of streamAnalysis({
          apiKey,
          operation,
          model: selectedModel,
          codebaseXml: bundle.xml,
          target,
          context,
        })) {
          send("text", chunk);
          chunkBuffer += chunk;

          // Periodically parse for findings
          const now = Date.now();
          if (now - lastParseTime > PARSE_INTERVAL) {
            const { findings, metrics } = parser.push(chunkBuffer);
            chunkBuffer = "";
            lastParseTime = now;

            for (const finding of findings) {
              send("finding", finding);
            }
            for (const metric of metrics) {
              send("metric", metric);
            }
          }
        }

        // Final parse
        if (chunkBuffer) {
          const { findings, metrics } = parser.push(chunkBuffer);
          for (const finding of findings) {
            send("finding", finding);
          }
          for (const metric of metrics) {
            send("metric", metric);
          }
        }

        const summary = parser.getSummary();
        if (summary) {
          send("summary", summary);
        }

        send("status", { phase: "complete", message: "Analysis complete" });
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      } catch (err: any) {
        send("error", err.message || "Analysis failed");
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
