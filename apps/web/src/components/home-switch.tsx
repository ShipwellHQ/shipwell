"use client";

import { useAuth } from "@/components/auth-provider";
import { LandingPage } from "@/components/landing-page";
import { Dashboard } from "@/components/dashboard";
import { TourProvider } from "@/components/onboarding-tour";

export function HomeSwitch({ hasSession }: { hasSession: boolean }) {
  const { user, loading } = useAuth();

  if (loading) {
    return hasSession ? (
      <TourProvider><Dashboard /></TourProvider>
    ) : (
      <LandingPage />
    );
  }

  return user ? (
    <TourProvider><Dashboard /></TourProvider>
  ) : (
    <LandingPage />
  );
}
