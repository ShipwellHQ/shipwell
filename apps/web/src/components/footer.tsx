import Link from "next/link";
import { Ship } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border px-6 py-6">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Ship className="w-4 h-4 text-accent" />
          <span className="text-text-dim text-xs">Shipwell &copy; 2026 &middot; Built by Manas Dutta</span>
        </div>
        <div className="flex items-center gap-5 text-xs text-text-dim">
          <Link href="/cli" className="hover:text-accent transition-colors">CLI</Link>
          <Link href="/github-app" className="hover:text-accent transition-colors">GitHub App</Link>
          <a href="https://github.com/ShipwellHQ/shipwell" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">GitHub</a>
          <a href="https://www.npmjs.com/package/@shipwellapp/cli" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">npm</a>
          <Link href="/terms" className="hover:text-accent transition-colors">Terms</Link>
          <Link href="/privacy" className="hover:text-accent transition-colors">Privacy</Link>
        </div>
      </div>
    </footer>
  );
}
