"use client";

import { motion } from "framer-motion";
import { Ship } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid" />
        <div className="absolute inset-0 bg-radial-glow" />

        <div className="relative max-w-3xl mx-auto px-6 pt-16 pb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <Ship className="w-8 h-8 text-accent mx-auto mb-4" />
            <h1 className="text-3xl font-bold tracking-tight mb-2">Privacy Policy</h1>
            <p className="text-text-dim text-sm">Last updated: February 14, 2026</p>
          </motion.div>
        </div>
      </div>

      <motion.article
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="max-w-3xl mx-auto px-6 pb-20 space-y-8"
      >
        <Section title="1. Introduction">
          <p>
            This Privacy Policy describes how Shipwell (&quot;the Service&quot;), operated by Manas Dutta (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;),
            collects, uses, and protects your information. We are committed to keeping your data safe and being
            transparent about our practices.
          </p>
        </Section>

        <Section title="2. Information We Collect">
          <h3 className="font-semibold text-text text-[14px] mt-3 mb-1.5">Account Information</h3>
          <p>
            When you sign in with Google, we receive your name, email address, profile photo URL, and a unique
            identifier. This information is used solely for authentication and displaying your identity within the Service.
          </p>

          <h3 className="font-semibold text-text text-[14px] mt-3 mb-1.5">Code & Analysis Data</h3>
          <p>
            When you submit a repository for analysis, the code is processed in real-time and sent directly to the
            Anthropic API from our server. We do not store your code or analysis results on our servers. Temporary
            files created during processing are deleted immediately after the analysis completes.
          </p>

          <h3 className="font-semibold text-text text-[14px] mt-3 mb-1.5">API Keys</h3>
          <p>
            Your Anthropic API key is stored exclusively in your browser&apos;s local storage (web app) or in a local
            configuration file on your machine (CLI at <code className="text-accent text-[13px]">~/.shipwell/config.json</code>).
            API keys are never transmitted to or stored on our servers.
          </p>
        </Section>

        <Section title="3. How We Use Information">
          <ul className="list-disc list-inside space-y-1.5 text-text-muted">
            <li>To authenticate you and provide access to the Service</li>
            <li>To process your code analysis requests in real-time</li>
            <li>To display your profile information within the application</li>
            <li>To improve the Service based on usage patterns</li>
          </ul>
        </Section>

        <Section title="4. Data We Do NOT Collect">
          <div className="bg-bg-card border border-border rounded-xl p-4 space-y-2">
            {[
              "We do not store your source code on our servers",
              "We do not store your API keys",
              "We do not store analysis results",
              "We do not sell or share your data with third parties",
              "We do not use your code for training AI models",
              "We do not track you across other websites",
            ].map((item) => (
              <div key={item} className="flex items-start gap-2.5 text-[13px]">
                <span className="text-success mt-0.5">&#10003;</span>
                <span className="text-text-muted">{item}</span>
              </div>
            ))}
          </div>
        </Section>

        <Section title="5. Third-Party Services">
          <p>The Service uses the following third-party services, each with their own privacy policies:</p>
          <ul className="list-disc list-inside space-y-1.5 mt-2 text-text-muted">
            <li>
              <strong className="text-text">Anthropic</strong> — AI analysis engine.
              Your code is sent to the Anthropic API for processing.{" "}
              <a href="https://www.anthropic.com/privacy" target="_blank" rel="noopener noreferrer" className="text-accent hover:text-accent-hover underline underline-offset-2">Privacy Policy</a>
            </li>
            <li>
              <strong className="text-text">Google</strong> — Authentication provider.{" "}
              <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-accent hover:text-accent-hover underline underline-offset-2">Privacy Policy</a>
            </li>
            <li>
              <strong className="text-text">Firebase</strong> — Authentication infrastructure.{" "}
              <a href="https://firebase.google.com/support/privacy" target="_blank" rel="noopener noreferrer" className="text-accent hover:text-accent-hover underline underline-offset-2">Privacy Policy</a>
            </li>
            <li>
              <strong className="text-text">Vercel</strong> — Hosting platform.{" "}
              <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-accent hover:text-accent-hover underline underline-offset-2">Privacy Policy</a>
            </li>
          </ul>
        </Section>

        <Section title="6. Data Security">
          <p>
            We implement appropriate security measures to protect your information. All communication with the
            Service is encrypted via HTTPS. API keys are stored with restricted file permissions (mode 0600) on
            the CLI. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee
            absolute security.
          </p>
        </Section>

        <Section title="7. Data Retention">
          <p>
            Account authentication data is retained as long as you maintain an active session. Code submitted for
            analysis is processed in real-time and not retained after the analysis completes. You can delete your
            local configuration and credentials at any time by running{" "}
            <code className="text-accent text-[13px]">shipwell logout</code> or clearing your browser data.
          </p>
        </Section>

        <Section title="8. Your Rights">
          <p>You have the right to:</p>
          <ul className="list-disc list-inside space-y-1.5 mt-2 text-text-muted">
            <li>Access the personal information we hold about you</li>
            <li>Request deletion of your account and associated data</li>
            <li>Opt out of the Service at any time by signing out</li>
            <li>Delete your local API keys and configuration</li>
          </ul>
        </Section>

        <Section title="9. Children's Privacy">
          <p>
            The Service is not intended for use by anyone under the age of 13. We do not knowingly collect
            personal information from children under 13. If you believe we have collected information from a
            child under 13, please contact us immediately.
          </p>
        </Section>

        <Section title="10. Changes to This Policy">
          <p>
            We may update this Privacy Policy from time to time. Changes will be posted on this page with an
            updated date. We encourage you to review this policy periodically.
          </p>
        </Section>

        <Section title="11. Contact">
          <p>
            If you have questions or concerns about this Privacy Policy, please reach out via{" "}
            <a
              href="https://github.com/ShipwellHQ/shipwell/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:text-accent-hover underline underline-offset-2"
            >
              GitHub Issues
            </a>.
          </p>
        </Section>
      </motion.article>

      <Footer minimal />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-lg font-semibold mb-3 text-text">{title}</h2>
      <div className="text-[14px] text-text-muted leading-relaxed space-y-3">{children}</div>
    </section>
  );
}
