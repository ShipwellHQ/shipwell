"use client";

import { useAuth } from "@/components/auth-provider";
import { LandingPage } from "@/components/landing-page";
import { Dashboard } from "@/components/dashboard";

export function HomeSwitch({ hasSession }: { hasSession: boolean }) {
  const { user, loading } = useAuth();

  if (loading) {
    return hasSession ? <Dashboard /> : <LandingPage />;
  }

  return user ? <Dashboard /> : <LandingPage />;
}
