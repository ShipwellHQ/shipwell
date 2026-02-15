"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";

interface GraphFinding {
  files: string[];
  severity?: string;
  crossFile: boolean;
}

interface CrossFileGraphProps {
  findings: GraphFinding[];
}

interface Node {
  id: string;
  label: string;
  count: number;
  x: number;
  y: number;
}

interface Edge {
  source: string;
  target: string;
  severity: string;
  weight: number;
}

const SEVERITY_COLORS: Record<string, string> = {
  critical: "#ef4444",
  high: "#f97316",
  medium: "#eab308",
  low: "#3b82f6",
  info: "#6b7280",
};

function truncatePath(filePath: string): string {
  const segments = filePath.split("/").filter(Boolean);
  if (segments.length <= 1) return segments.join("/");
  return segments.slice(-1)[0];
}

export function CrossFileGraph({ findings }: CrossFileGraphProps) {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const { nodes, edges } = useMemo(() => {
    const crossFileFindings = findings.filter(
      (f) => f.crossFile && f.files.length > 1
    );

    // Count findings per file
    const fileCounts = new Map<string, number>();
    for (const f of crossFileFindings) {
      for (const file of f.files) {
        fileCounts.set(file, (fileCounts.get(file) ?? 0) + 1);
      }
    }

    // Build edges: co-occurrence of files in the same finding
    const edgeMap = new Map<string, { severity: string; weight: number }>();
    for (const f of crossFileFindings) {
      const files = f.files;
      for (let i = 0; i < files.length; i++) {
        for (let j = i + 1; j < files.length; j++) {
          const key = [files[i], files[j]].sort().join("||");
          const existing = edgeMap.get(key);
          const sev = f.severity ?? "info";
          if (existing) {
            existing.weight++;
            // Upgrade severity if higher
            const priority: Record<string, number> = {
              critical: 4,
              high: 3,
              medium: 2,
              low: 1,
              info: 0,
            };
            if ((priority[sev] ?? 0) > (priority[existing.severity] ?? 0)) {
              existing.severity = sev;
            }
          } else {
            edgeMap.set(key, { severity: sev, weight: 1 });
          }
        }
      }
    }

    // Create nodes in circular layout
    const fileList = Array.from(fileCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 12);

    const cx = 200;
    const cy = 180;
    const radius = 140;

    const nodes: Node[] = fileList.map(([file, count], i) => {
      const angle = (2 * Math.PI * i) / fileList.length - Math.PI / 2;
      return {
        id: file,
        label: truncatePath(file),
        count,
        x: cx + radius * Math.cos(angle),
        y: cy + radius * Math.sin(angle),
      };
    });

    const nodeIds = new Set(nodes.map((n) => n.id));
    const edges: Edge[] = [];
    for (const [key, val] of edgeMap.entries()) {
      const [source, target] = key.split("||");
      if (nodeIds.has(source) && nodeIds.has(target)) {
        edges.push({ source, target, ...val });
      }
    }

    return { nodes, edges };
  }, [findings]);

  if (nodes.length < 2) return null;

  const nodeMap = new Map(nodes.map((n) => [n.id, n]));
  const maxCount = Math.max(...nodes.map((n) => n.count), 1);

  // Find connected nodes for hover highlighting
  const connectedNodes = new Set<string>();
  if (hoveredNode) {
    connectedNodes.add(hoveredNode);
    for (const edge of edges) {
      if (edge.source === hoveredNode) connectedNodes.add(edge.target);
      if (edge.target === hoveredNode) connectedNodes.add(edge.source);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-bg-card border border-border rounded-xl p-5 overflow-hidden"
    >
      <h3 className="uppercase text-[10px] tracking-wider font-semibold text-text-dim mb-3">
        Cross-File Dependency Map
      </h3>

      <svg viewBox="0 0 400 360" className="w-full max-w-lg mx-auto">
        {/* Edges */}
        {edges.map((edge, i) => {
          const s = nodeMap.get(edge.source);
          const t = nodeMap.get(edge.target);
          if (!s || !t) return null;

          const isHighlighted =
            !hoveredNode ||
            (connectedNodes.has(edge.source) &&
              connectedNodes.has(edge.target));

          return (
            <motion.line
              key={`edge-${i}`}
              x1={s.x}
              y1={s.y}
              x2={t.x}
              y2={t.y}
              stroke={SEVERITY_COLORS[edge.severity] ?? SEVERITY_COLORS.info}
              strokeWidth={Math.min(edge.weight * 1.5, 4)}
              initial={{ opacity: 0 }}
              animate={{ opacity: isHighlighted ? 0.5 : 0.08 }}
              transition={{ duration: 0.2 }}
            />
          );
        })}

        {/* Nodes */}
        {nodes.map((node) => {
          const r = 6 + (node.count / maxCount) * 10;
          const isHighlighted = !hoveredNode || connectedNodes.has(node.id);

          return (
            <g
              key={node.id}
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
              className="cursor-pointer"
            >
              <motion.circle
                cx={node.x}
                cy={node.y}
                r={r}
                className="fill-accent"
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: 1,
                  opacity: isHighlighted ? 1 : 0.2,
                }}
                transition={{ duration: 0.3, delay: 0.05 }}
              />
              <motion.text
                x={node.x}
                y={node.y + r + 12}
                textAnchor="middle"
                className="fill-text-muted text-[9px] font-mono"
                initial={{ opacity: 0 }}
                animate={{ opacity: isHighlighted ? 1 : 0.2 }}
                transition={{ duration: 0.2 }}
              >
                {node.label}
              </motion.text>
              <motion.text
                x={node.x}
                y={node.y + 3.5}
                textAnchor="middle"
                className="fill-white text-[8px] font-bold pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: isHighlighted ? 1 : 0 }}
                transition={{ duration: 0.2 }}
              >
                {node.count}
              </motion.text>
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-2 flex-wrap">
        {Object.entries(SEVERITY_COLORS)
          .filter(([sev]) =>
            edges.some((e) => e.severity === sev)
          )
          .map(([sev, color]) => (
            <div key={sev} className="flex items-center gap-1.5">
              <span
                className="inline-block w-3 h-0.5 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span className="text-[10px] text-text-dim capitalize">
                {sev}
              </span>
            </div>
          ))}
      </div>
    </motion.div>
  );
}
