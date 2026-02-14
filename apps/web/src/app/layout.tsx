import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Shipwell — Full Codebase Autopilot",
  description: "Ingest entire codebases into Opus 4.6's 1M context window for deep cross-file analysis",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
