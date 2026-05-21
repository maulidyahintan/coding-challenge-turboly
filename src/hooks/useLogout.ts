"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

type UseLogoutResult = {
  isLoggingOut: boolean;
  logoutError: string | null;
  logout: () => Promise<void>;
};

export function useLogout(): UseLogoutResult {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState<string | null>(null);

  const logout = useCallback(async () => {
    setIsLoggingOut(true);
    setLogoutError(null);

    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (!response.ok) {
        setLogoutError("Logout failed. Please try again.");
        setIsLoggingOut(false);
        return;
      }

      router.push("/login");
      router.refresh();
    } catch {
      setLogoutError("Logout failed. Please try again.");
      setIsLoggingOut(false);
    }
  }, [router]);

  return {
    isLoggingOut,
    logoutError,
    logout,
  };
}
