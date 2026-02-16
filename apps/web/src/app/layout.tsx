import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Montserrat, IBM_Plex_Mono } from "next/font/google";
import { AuthProvider } from "@/components/auth-provider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-montserrat",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-ibm-mono",
});

export const metadata: Metadata = {
  title: "Shipwell | Full Codebase Autopilot",
  description: "Ingest entire codebases into Opus 4.6's 1M context window for deep cross-file analysis",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${jetbrainsMono.variable} ${montserrat.variable} ${ibmPlexMono.variable} min-h-screen antialiased`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
