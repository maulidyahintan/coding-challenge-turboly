"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, LogOut, UserCircle2 } from "lucide-react";

export function LogoutButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!containerRef.current) {
        return;
      }

      if (!containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    globalThis.addEventListener("mousedown", handleOutsideClick);
    return () => globalThis.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleLogout = async () => {
    setIsLoading(true);
    setError(null);

    const response = await fetch("/api/auth/logout", {
      method: "POST",
    });

    if (!response.ok) {
      setError("Logout failed. Please try again.");
      setIsLoading(false);
      return;
    }

    router.push("/login");
    router.refresh();
  };

  return (
    <div ref={containerRef} className="relative flex flex-col items-end gap-2">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 rounded-xl border border-sky-300/70 bg-white/95 px-2 py-1.5 text-slate-800 shadow-sm transition hover:bg-sky-50"
      >
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-sky-700 text-white">
          <UserCircle2 size={18} />
        </span>
        <span className="text-left leading-tight">
          <span className="block text-[11px] uppercase tracking-[0.12em] text-slate-500">
            Account
          </span>
          <span className="block text-sm font-semibold">My Profile</span>
        </span>
        <ChevronDown size={16} className="text-slate-500" />
      </button>

      {isOpen ? (
        <div className="absolute top-12 right-0 z-20 w-52 rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoading}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:text-rose-300"
          >
            <LogOut size={16} />
            {isLoading ? "Signing out..." : "Logout"}
          </button>
        </div>
      ) : null}

      {error ? <p className="text-xs text-rose-200">{error}</p> : null}
    </div>
  );
}
