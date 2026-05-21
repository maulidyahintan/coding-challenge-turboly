"use client";

import { useLogout } from "@/hooks/useLogout";
import { ChevronDown, LogOut, UserCircle2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type LogoutButtonProps = Readonly<{
  userEmail: string;
  iconOnly?: boolean;
}>;

export function LogoutButton({ userEmail, iconOnly = false }: LogoutButtonProps) {
  const { logout, isLoggingOut, logoutError } = useLogout();
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

  return (
    <div ref={containerRef} className="relative flex flex-col items-end gap-2">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={
          iconOnly
            ? "grid h-10 w-10 place-items-center rounded-xl border border-sky-300/70 bg-white/95 text-slate-800 shadow-sm transition hover:bg-sky-50"
            : "flex items-center gap-2 rounded-xl border border-sky-300/70 bg-white/95 px-2 py-1.5 text-slate-800 shadow-sm transition hover:bg-sky-50"
        }
        aria-label={iconOnly ? "Open account menu" : undefined}
      >
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-sky-700 text-white">
          <UserCircle2 size={18} />
        </span>
        {iconOnly ? null : (
          <>
            <span className="text-left leading-tight">
              <span className="block text-[11px] uppercase tracking-[0.12em] text-slate-500">
                Account
              </span>
              <span className="block truncate text-sm font-semibold">{userEmail}</span>
            </span>
            <ChevronDown size={16} className="text-slate-500" />
          </>
        )}
      </button>

      {isOpen ? (
        <div className="absolute right-0 top-12 z-100 w-52 rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
          <button
            type="button"
            onClick={logout}
            disabled={isLoggingOut}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:text-rose-300"
          >
            <LogOut size={16} />
            {isLoggingOut ? "Signing out..." : "Logout"}
          </button>
        </div>
      ) : null}

      {logoutError ? <p className="text-xs text-rose-200">{logoutError}</p> : null}
    </div>
  );
}
