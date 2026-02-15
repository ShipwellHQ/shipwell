"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";

type LineType = "added" | "removed" | "header" | "file-header" | "context";

interface ParsedLine {
  type: LineType;
  content: string;
  lineNumber: number | null;
}

interface DiffViewerProps {
  diff: string;
}

const lineStyles: Record<LineType, { row: string; border: string }> = {
  added: {
    row: "bg-emerald-500/10 text-emerald-300",
    border: "border-l-emerald-500",
  },
  removed: {
    row: "bg-red-500/10 text-red-300",
    border: "border-l-red-500",
  },
  header: {
    row: "bg-blue-500/[0.08] text-blue-400",
    border: "border-l-blue-500",
  },
  "file-header": {
    row: "text-text-muted font-semibold",
    border: "border-l-transparent",
  },
  context: {
    row: "text-text-dim",
    border: "border-l-transparent",
  },
};

function stripCodeFences(raw: string): string {
  let text = raw.trim();
  // Remove leading ```diff or ``` fence
  if (/^```[\w-]*\s*\n/.test(text)) {
    text = text.replace(/^```[\w-]*\s*\n/, "");
  }
  // Remove trailing ``` fence
  if (/\n```\s*$/.test(text)) {
    text = text.replace(/\n```\s*$/, "");
  }
  return text;
}

function classifyLine(line: string): LineType {
  if (line.startsWith("@@") && line.includes("@@")) return "header";
  if (line.startsWith("---") || line.startsWith("+++")) return "file-header";
  if (line.startsWith("+")) return "added";
  if (line.startsWith("-")) return "removed";
  return "context";
}

function parseDiff(raw: string): ParsedLine[] {
  const cleaned = stripCodeFences(raw);
  const lines = cleaned.split("\n");

  let addLineNum = 0;
  let removeLineNum = 0;

  return lines.map((line) => {
    const type = classifyLine(line);

    let lineNumber: number | null = null;

    if (type === "header") {
      // Extract starting line numbers from @@ -a,b +c,d @@
      const match = line.match(/@@ -(\d+)(?:,\d+)? \+(\d+)(?:,\d+)? @@/);
      if (match) {
        removeLineNum = parseInt(match[1], 10);
        addLineNum = parseInt(match[2], 10);
      }
    } else if (type === "added") {
      lineNumber = addLineNum;
      addLineNum++;
    } else if (type === "removed") {
      lineNumber = removeLineNum;
      removeLineNum++;
    } else if (type === "context" && addLineNum > 0) {
      lineNumber = addLineNum;
      addLineNum++;
      removeLineNum++;
    }

    return { type, content: line, lineNumber };
  });
}

export function DiffViewer({ diff }: DiffViewerProps) {
  const lines = useMemo(() => parseDiff(diff), [diff]);

  if (!diff.trim()) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="rounded-lg border border-border bg-bg overflow-hidden"
    >
      <div className="overflow-x-auto">
        <table className="w-full border-collapse font-mono text-[12px] leading-relaxed">
          <tbody>
            {lines.map((line, i) => {
              const styles = lineStyles[line.type];
              return (
                <tr key={i} className={clsx("border-l-2", styles.border, styles.row)}>
                  <td className="select-none px-2.5 py-0 text-right text-text-muted/40 w-[1%] whitespace-nowrap align-top">
                    {line.lineNumber ?? ""}
                  </td>
                  <td className="px-3 py-0 whitespace-pre">
                    {line.content}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
