"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Ship, User, LogOut, ChevronDown, Key, ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import { useAuth } from "./auth-provider";

export function Navbar() {
  const { user, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isAnalysis = pathname === "/analysis";
  const isLanding = pathname === "/";

  return (
    <nav
      className={clsx(
        "z-50 backdrop-blur-sm transition-all duration-200",
        isLanding
          ? "fixed top-0 left-0 right-0 bg-bg/0"
          : "sticky top-0 bg-bg/80 border-b border-border"
      )}
    >
      <div className="flex items-center justify-between px-6 py-4">
        <Link href={user ? "/analysis" : "/"} className="flex items-center gap-2 group">
          <Ship className="w-5 h-5 text-accent group-hover:text-accent-hover transition-colors" />
          <span className="font-bold text-[15px] tracking-tight font-mono">Shipwell</span>
        </Link>

        <div className="flex items-center gap-3">
          {isAnalysis && user && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-success/10 text-[11px] font-medium text-success ring-1 ring-success/20 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-success" />
              Connected
            </div>
          )}

          {!user && (
            <Link
              href="/login"
              className="bg-accent text-white rounded-full px-6 py-2 text-sm font-semibold font-mono transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(99,102,241,0.5)] flex items-center gap-1.5"
            >
              Get Started <ArrowUpRight className="w-4 h-4" />
            </Link>
          )}

          {user && (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-bg-elevated transition-all duration-150"
              >
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt=""
                    className="w-7 h-7 rounded-full ring-1 ring-border"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-accent/15 flex items-center justify-center text-accent text-xs font-bold ring-1 ring-accent/20">
                    {user.displayName?.[0] || user.email?.[0] || "?"}
                  </div>
                )}
                <span className="text-[13px] text-text-muted hidden sm:block max-w-[120px] truncate font-mono">
                  {user.displayName?.split(" ")[0] || user.email}
                </span>
                <ChevronDown className={clsx(
                  "w-3.5 h-3.5 text-text-dim transition-transform duration-150",
                  menuOpen && "rotate-180"
                )} />
              </button>

              <AnimatePresence>
                {menuOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -4 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -4 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="absolute right-0 mt-2 w-52 bg-bg-card border border-border rounded-xl shadow-2xl shadow-black/50 z-50 py-1 overflow-hidden backdrop-blur-xl"
                  >
                    <div className="px-3.5 py-3 border-b border-border">
                      <p className="text-sm font-medium truncate font-mono">{user.displayName}</p>
                      <p className="text-xs text-text-dim truncate mt-0.5 font-mono">{user.email}</p>
                    </div>
                    <div className="py-1">
                      <Link
                        href="/profile"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3.5 py-2 text-[13px] text-text-muted hover:bg-bg-elevated hover:text-text transition-colors font-mono"
                      >
                        <User className="w-4 h-4" />
                        Profile
                      </Link>
                      <Link
                        href="/settings"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3.5 py-2 text-[13px] text-text-muted hover:bg-bg-elevated hover:text-text transition-colors font-mono"
                      >
                        <Key className="w-4 h-4" />
                        API Key & Model
                      </Link>
                    </div>
                    <div className="border-t border-border py-1">
                      <button
                        onClick={() => { setMenuOpen(false); signOut(); }}
                        className="flex items-center gap-2.5 px-3.5 py-2 text-[13px] text-danger hover:bg-danger/5 transition-colors w-full font-mono"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
