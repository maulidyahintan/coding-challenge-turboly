"use client";

import { MonthCalendar } from "@/components/shared/month-calendar";
import { SelectedDateTaskList } from "@/features/task/components/selected-date-task-list";
import { TaskAlertsSection } from "@/features/task/components/task-alerts-section";
import { TaskManager } from "@/features/task/components/task-manager";
import { CalendarDays, ChevronLeft, ChevronRight, SquareKanban, UserCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type TabletDashboardPanelsProps = Readonly<{
  selectedDate: Date | undefined;
  onSelectedDateChange: (date: Date | undefined) => void;
  userEmail: string;
}>;

type TabletTab = "tasks" | "calendar";

export function TabletDashboardPanels({
  selectedDate,
  onSelectedDateChange,
  userEmail,
}: TabletDashboardPanelsProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabletTab>("tasks");
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState<string | null>(null);

  const handleLogout = async () => {
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
  };

  return (
    <div className="hidden min-h-0 flex-1 gap-4 -ml-5 md:flex lg:hidden">
      <aside
        className={`flex gap-4 flex-col rounded-r-2xl border border-sky-300/30 border-l-0 bg-sky-950/45 p-2 text-sky-100/85 backdrop-blur-sm transition-all duration-200 ${
          isSidebarExpanded ? "w-64" : "w-16 items-center"
        }`}
      >
        <button
          type="button"
          onClick={() => setIsSidebarExpanded((prev) => !prev)}
          className={`inline-flex h-9 items-center rounded-lg bg-sky-100/10 text-sky-100/85 transition hover:bg-sky-100/20 ${
            isSidebarExpanded ? "w-full justify-end px-2" : "w-9 justify-center"
          }`}
          aria-label={isSidebarExpanded ? "Collapse sidebar" : "Expand sidebar"}
        >
          {isSidebarExpanded ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("tasks")}
          className={`mt-3 inline-flex h-9 items-center rounded-lg transition ${
            isSidebarExpanded ? "w-full justify-start gap-2 px-3" : "w-9 justify-center"
          } ${
            activeTab === "tasks" ? "bg-sky-700/60 text-sky-50" : "bg-sky-100/10 text-sky-100/85"
          }`}
          aria-label="Show tasks"
        >
          <SquareKanban size={16} />
          {isSidebarExpanded ? <span className="text-sm font-semibold">Tasks</span> : null}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("calendar")}
          className={`inline-flex h-9 items-center rounded-lg transition ${
            isSidebarExpanded ? "w-full justify-start gap-2 px-3" : "w-9 justify-center"
          } ${
            activeTab === "calendar" ? "bg-sky-700/60 text-sky-50" : "bg-sky-100/10 text-sky-100/85"
          }`}
          aria-label="Show calendar"
        >
          <CalendarDays size={16} />
          {isSidebarExpanded ? <span className="text-sm font-semibold">Calendar</span> : null}
        </button>

        <div className="mt-auto w-full border-t border-sky-200/20 pt-3">
          <div
            className={`flex items-center ${isSidebarExpanded ? "gap-2 px-2" : "justify-center"}`}
          >
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-sky-700/70 text-white">
              <UserCircle2 size={16} />
            </span>
            {isSidebarExpanded ? (
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold text-sky-100">{userEmail}</p>
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className={`text-xs rounded-md bg-amber-50 font-semibold uppercase tracking-[0.08em] text-sky-900 transition hover:text-white disabled:cursor-not-allowed disabled:text-sky-300 text-center px-4 py-1 mt-2`}
                >
                  {isLoggingOut ? "Signing out..." : "Logout"}
                </button>
              </div>
            ) : null}
          </div>
          {logoutError && isSidebarExpanded ? (
            <p className="mt-1 px-2 text-[11px] text-rose-300">{logoutError}</p>
          ) : null}
        </div>
      </aside>

      {activeTab === "tasks" ? (
        <section className="flex min-h-0 flex-1 flex-col gap-4 overflow-hidden">
          <TaskAlertsSection isTabletScrollable />
          <TaskManager />
        </section>
      ) : (
        <section className="flex h-full min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-sky-300/30 bg-white/95">
          <MonthCalendar
            selectedDate={selectedDate}
            onSelectedDateChange={onSelectedDateChange}
            numberOfMonths={isSidebarExpanded ? 1 : 2}
          />
          <SelectedDateTaskList selectedDate={selectedDate} />
        </section>
      )}
    </div>
  );
}
