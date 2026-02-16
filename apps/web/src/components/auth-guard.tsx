"use client";

import { useAuth } from "./auth-provider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { LogoLoader } from "./logo-loader";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LogoLoader size={48} />
      </div>
    );
  }

  if (!user) return null;

  return <>{children}</>;
}
