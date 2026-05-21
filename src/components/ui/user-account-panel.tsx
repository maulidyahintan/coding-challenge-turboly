import { UserCircle2 } from "lucide-react";

type UserAccountPanelProps = Readonly<{
  userEmail: string;
  displayName?: string;
  isLoggingOut: boolean;
  logoutError: string | null;
  onLogout: () => void;
  variant: "tablet-sidebar" | "mobile-profile";
  isExpanded?: boolean;
}>;

export function UserAccountPanel({
  userEmail,
  displayName,
  isLoggingOut,
  logoutError,
  onLogout,
  variant,
  isExpanded = true,
}: UserAccountPanelProps) {
  if (variant === "tablet-sidebar") {
    return (
      <div className="mt-auto w-full border-t border-sky-200/20 pt-3">
        <div className={`flex items-center ${isExpanded ? "gap-2 px-2" : "justify-center"}`}>
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-sky-700/70 text-white">
            <UserCircle2 size={16} />
          </span>
          {isExpanded ? (
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold text-sky-100">{userEmail}</p>
              <button
                type="button"
                onClick={onLogout}
                disabled={isLoggingOut}
                className="mt-2 rounded-md bg-amber-50 px-4 py-1 text-center text-xs font-semibold uppercase tracking-[0.08em] text-sky-900 transition hover:text-white disabled:cursor-not-allowed disabled:text-sky-300"
              >
                {isLoggingOut ? "Signing out..." : "Logout"}
              </button>
            </div>
          ) : null}
        </div>
        {logoutError && isExpanded ? (
          <p className="mt-1 px-2 text-[11px] text-rose-300">{logoutError}</p>
        ) : null}
      </div>
    );
  }

  return (
    <div className="flex h-full flex-1 flex-col rounded-2xl border border-sky-300/30 bg-white p-5 text-sky-700 backdrop-blur-sm">
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <span className="grid h-28 w-28 place-items-center rounded-full border-4 border-sky-700 bg-white">
          <UserCircle2 size={60} />
        </span>
        <p className="mt-4 text-lg font-semibold">{displayName ?? userEmail}</p>
        <p className="mt-1 text-sm text-sky-900/80">{userEmail}</p>
      </div>
      <div className="pt-4">
        <button
          type="button"
          onClick={onLogout}
          disabled={isLoggingOut}
          className="block w-full text-center text-sm font-semibold uppercase tracking-[0.08em] text-sky-700 transition hover:text-sky-900 disabled:cursor-not-allowed disabled:text-sky-400"
        >
          {isLoggingOut ? "Signing out..." : "Logout"}
        </button>
        {logoutError ? (
          <p className="mt-2 text-center text-xs text-rose-700">{logoutError}</p>
        ) : null}
      </div>
    </div>
  );
}
