"use client";

import { motion } from "framer-motion";
import { Mail, Calendar, LogOut, Shield, Key, ArrowRight, Clock, Fingerprint } from "lucide-react";
import Link from "next/link";
import clsx from "clsx";
import { AuthGuard } from "@/components/auth-guard";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { useAuth } from "@/components/auth-provider";
import { useApiKey } from "@/hooks/use-api-key";

export default function ProfilePage() {
  return (
    <AuthGuard>
      <ProfileContent />
    </AuthGuard>
  );
}

function ProfileContent() {
  const { user, signOut } = useAuth();
  const { isConnected } = useApiKey();

  if (!user) return null;

  const createdAt = user.metadata.creationTime
    ? new Date(user.metadata.creationTime).toLocaleDateString("en-US", {
        year: "numeric", month: "long", day: "numeric",
      })
    : "Unknown";

  const lastSignIn = user.metadata.lastSignInTime
    ? new Date(user.metadata.lastSignInTime).toLocaleDateString("en-US", {
        year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit",
      })
    : "Unknown";

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Grid background */}
      <div className="absolute inset-0 bg-grid pointer-events-none" />

      <Navbar />
      <main className="flex-1 max-w-2xl mx-auto w-full px-6 py-10 relative">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold tracking-tight mb-1">Profile</h1>
          <p className="text-text-muted text-sm mb-8">Your account information</p>

          {/* Profile Header Card */}
          <div className="bg-bg-card/80 backdrop-blur-sm border border-border rounded-2xl overflow-hidden mb-6 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.02] to-transparent pointer-events-none" />
            <div className="relative">
              {/* Banner */}
              <div className="h-28 bg-gradient-to-br from-accent/15 via-purple-500/8 to-transparent relative">
                <div className="absolute inset-0 bg-grid opacity-40" />
              </div>
              {/* Avatar + Info */}
              <div className="px-6 pb-6 -mt-12 relative">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt=""
                    className="w-20 h-20 rounded-2xl border-4 border-bg-card shadow-lg shadow-black/30"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-2xl bg-accent/20 flex items-center justify-center text-accent text-3xl font-bold border-4 border-bg-card shadow-lg shadow-black/30">
                    {user.displayName?.[0] || user.email?.[0] || "?"}
                  </div>
                )}
                <div className="mt-4">
                  <h2 className="text-xl font-bold tracking-tight">{user.displayName || "User"}</h2>
                  <p className="text-text-muted text-sm flex items-center gap-1.5 mt-1">
                    <Mail className="w-3.5 h-3.5" />
                    {user.email}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Account Details */}
          <div className="bg-bg-card/80 backdrop-blur-sm border border-border rounded-2xl overflow-hidden mb-6 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.02] to-transparent pointer-events-none" />
            <div className="relative">
              <div className="px-6 py-4 border-b border-border">
                <h2 className="font-semibold text-[15px]">Account Details</h2>
              </div>
              <div className="divide-y divide-border">
                {[
                  { icon: Mail, label: "Email", value: user.email },
                  { icon: Fingerprint, label: "Provider", value: "Google" },
                  { icon: Calendar, label: "Joined", value: createdAt },
                  { icon: Clock, label: "Last sign in", value: lastSignIn },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between px-6 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-bg-elevated flex items-center justify-center">
                        <item.icon className="w-4 h-4 text-text-dim" />
                      </div>
                      <span className="text-[13px] text-text-muted">{item.label}</span>
                    </div>
                    <span className="text-[13px] font-medium">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* API Key Status */}
          <div className="bg-bg-card/80 backdrop-blur-sm border border-border rounded-2xl p-5 mb-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.02] to-transparent pointer-events-none" />
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={clsx(
                  "w-10 h-10 rounded-xl flex items-center justify-center",
                  isConnected ? "bg-success/10" : "bg-bg-elevated"
                )}>
                  <Key className={clsx("w-5 h-5", isConnected ? "text-success" : "text-text-dim")} />
                </div>
                <div>
                  <h2 className="font-semibold text-[14px]">API Connection</h2>
                  <p className="text-[12px] text-text-dim">
                    {isConnected ? "Anthropic API key connected" : "No API key connected"}
                  </p>
                </div>
              </div>
              <Link
                href="/settings"
                className="flex items-center gap-1.5 px-4 py-2 text-[13px] font-medium text-accent hover:bg-accent/5 rounded-lg transition-colors"
              >
                {isConnected ? "Manage" : "Connect"}
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Sign Out */}
          <button
            onClick={signOut}
            className="flex items-center gap-2 px-4 py-3 text-[13px] font-medium text-danger hover:bg-danger/5 rounded-xl transition-colors w-full justify-center border border-danger/15"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
