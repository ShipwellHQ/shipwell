"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

export function StreamingOutput({ text, isStreaming }: { text: string; isStreaming: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [text]);

  if (!text) return null;

  // Simple syntax highlighting for the XML output
  const highlighted = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    // Highlight XML tags
    .replace(/&lt;(\/?[\w-]+)(.*?)&gt;/g, '<span class="text-accent">$&</span>')
    // Highlight diff markers
    .replace(/^(\+.*)$/gm, '<span class="text-success">$1</span>')
    .replace(/^(-.*)$/gm, '<span class="text-danger">$1</span>')
    .replace(/^(@@.*)$/gm, '<span class="text-info">$1</span>');

  return (
    <div
      ref={containerRef}
      className="bg-bg rounded-lg border border-border p-4 h-[400px] overflow-y-auto font-mono text-xs leading-relaxed"
    >
      <pre
        className="whitespace-pre-wrap break-words"
        dangerouslySetInnerHTML={{ __html: highlighted }}
      />
      {isStreaming && (
        <span className="inline-block w-2 h-4 bg-accent cursor-blink ml-0.5" />
      )}
    </div>
  );
}
