"use client";

import { motion } from "framer-motion";
import { Ship } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function TermsPage() {
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
            <h1 className="text-3xl font-bold tracking-tight mb-2">Terms of Service</h1>
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
        <Section title="1. Agreement to Terms">
          <p>
            By accessing or using Shipwell (&quot;the Service&quot;), operated by Manas Dutta (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;),
            you agree to be bound by these Terms of Service. If you do not agree to these terms, do not use the Service.
          </p>
        </Section>

        <Section title="2. Description of Service">
          <p>
            Shipwell is a codebase analysis tool that uses AI (Claude by Anthropic) to perform security audits, migration planning,
            refactoring analysis, documentation generation, and dependency upgrade planning. The Service is available via a web
            application at shipwell.app and a command-line interface (CLI) distributed via npm.
          </p>
        </Section>

        <Section title="3. User Accounts">
          <p>
            To use certain features, you must sign in with a Google account. You are responsible for maintaining the
            security of your account and for all activities that occur under your account. You must provide accurate
            information during registration.
          </p>
        </Section>

        <Section title="4. API Keys">
          <p>
            The Service requires an Anthropic API key to function. Your API key is stored locally in your browser
            or CLI configuration and is never transmitted to or stored on our servers. You are solely responsible
            for the security of your API key and any charges incurred through its use with the Anthropic API.
          </p>
        </Section>

        <Section title="5. Acceptable Use">
          <p>You agree not to:</p>
          <ul className="list-disc list-inside space-y-1.5 mt-2 text-text-muted">
            <li>Use the Service for any illegal purpose or in violation of any laws</li>
            <li>Upload or analyze code that you do not have the right to access</li>
            <li>Attempt to reverse-engineer, decompile, or disassemble the Service</li>
            <li>Interfere with or disrupt the Service or its infrastructure</li>
            <li>Use the Service to transmit malware or malicious code</li>
            <li>Resell or redistribute the Service without permission</li>
          </ul>
        </Section>

        <Section title="6. Intellectual Property">
          <p>
            The Service, including its design, code, and branding, is owned by Manas Dutta and protected by
            applicable intellectual property laws. Your code and analysis results remain your property. We claim
            no ownership over code you submit for analysis.
          </p>
        </Section>

        <Section title="7. Third-Party Services">
          <p>
            The Service relies on third-party services including Anthropic (Claude API), Google (authentication),
            and Firebase. Your use of these services is subject to their respective terms and privacy policies.
            We are not responsible for the availability or performance of third-party services.
          </p>
        </Section>

        <Section title="8. Disclaimer of Warranties">
          <p>
            The Service is provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind, either express or implied.
            We do not guarantee that the analysis results will be accurate, complete, or error-free. AI-generated
            analysis should be reviewed by qualified professionals before acting on any recommendations.
          </p>
        </Section>

        <Section title="9. Limitation of Liability">
          <p>
            To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, special,
            consequential, or punitive damages, or any loss of profits, data, or goodwill, arising from your use
            of the Service. Our total liability shall not exceed the amount you paid us in the twelve months
            preceding the claim.
          </p>
        </Section>

        <Section title="10. Changes to Terms">
          <p>
            We reserve the right to modify these terms at any time. Changes will be posted on this page with an
            updated date. Continued use of the Service after changes constitutes acceptance of the new terms.
          </p>
        </Section>

        <Section title="11. Termination">
          <p>
            We may suspend or terminate your access to the Service at any time, with or without cause. Upon
            termination, your right to use the Service ceases immediately. Provisions that by their nature should
            survive termination will survive.
          </p>
        </Section>

        <Section title="12. Contact">
          <p>
            If you have questions about these Terms, please reach out via{" "}
            <a
              href="https://github.com/manasdutta04/shipwell/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:text-accent-hover underline underline-offset-2"
            >
              GitHub Issues
            </a>.
          </p>
        </Section>
      </motion.article>

      <Footer />
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
