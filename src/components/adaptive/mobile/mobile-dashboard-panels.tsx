"use client";

import { MonthCalendar } from "@/components/shared/month-calendar";
import { PreviewTaskCard } from "@/components/shared/task-card";
import { SelectedDateTaskList } from "@/features/task/components/selected-date-task-list";
import { TaskAlertSquare, type TaskAlertTone } from "@/features/task/components/task-alert-square";
import { TaskManager } from "@/features/task/components/task-manager";
import { TaskModal } from "@/features/task/components/task-modal";
import type { TaskItem } from "@/features/task/types";
import { isDueTodayDate, isOverdueDueDate } from "@/features/task/utils";
import { useTasksContext } from "@/providers/TasksProvider";
import { CalendarDays, Home, Plus, SquareKanban, UserCircle2 } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

type MobileTab = "home" | "tasks" | "calendar" | "profile";

const MOBILE_TABS = new Set<MobileTab>(["home", "tasks", "calendar", "profile"]);

function isMobileTab(value: string | null): value is MobileTab {
  return value !== null && MOBILE_TABS.has(value as MobileTab);
}

type MobileDashboardPanelsProps = Readonly<{
  selectedDate: Date | undefined;
  onSelectedDateChange: (date: Date | undefined) => void;
  userEmail: string;
}>;

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

function getDisplayName(email: string): string {
  const name = email.split("@")[0] ?? email;
  return name.replace(/[._-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function MobileDashboardPanels({
  selectedDate,
  onSelectedDateChange,
  userEmail,
}: MobileDashboardPanelsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const activeTab: MobileTab = isMobileTab(tabParam) ? tabParam : "home";
  const { tasks, activeGrupTasks, setActiveGrupTasks } = useTasksContext();

  const setTabParam = (tab: MobileTab) => {
    const params = new URLSearchParams(searchParams.toString());

    if (tab === "home") {
      params.delete("tab");
    } else {
      params.set("tab", tab);
    }

    const nextQuery = params.toString();
    const nextUrl = nextQuery ? `${pathname}?${nextQuery}` : pathname;
    router.replace(nextUrl, { scroll: false });
  };

  const dueTodayCount = useMemo(
    () => tasks.filter((task) => !task.completed && isDueTodayDate(task.dueDate)).length,
    [tasks]
  );
  const overdueCount = useMemo(
    () => tasks.filter((task) => !task.completed && isOverdueDueDate(task.dueDate)).length,
    [tasks]
  );
  const openCount = useMemo(() => tasks.filter((task) => !task.completed).length, [tasks]);
  const completedCount = useMemo(() => tasks.filter((task) => task.completed).length, [tasks]);

  const recentTasks = useMemo(
    () => [...tasks].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)).slice(0, 3),
    [tasks]
  );

  const alertItems: Array<{ tone: TaskAlertTone; count: number }> = [
    { tone: "dueToday", count: dueTodayCount },
    { tone: "overdue", count: overdueCount },
    { tone: "open", count: openCount },
    { tone: "completed", count: completedCount },
    { tone: "all", count: tasks.length },
  ];

  const handleAlertClick = (tone: TaskAlertTone) => {
    setActiveGrupTasks(tone);
    setTabParam("tasks");
  };

  const navItems: Array<{ tab: MobileTab; label: string; icon: typeof Home }> = [
    { tab: "home", label: "Home", icon: Home },
    { tab: "tasks", label: "Tasks", icon: SquareKanban },
    { tab: "calendar", label: "Calendar", icon: CalendarDays },
    { tab: "profile", label: "Profile", icon: UserCircle2 },
  ];

  const [taskBeingEdited, setTaskBeingEdited] = useState<TaskItem | null>(null);
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
    <div className="flex min-h-0 flex-1 flex-col md:hidden">
      {/* Scrollable content area */}
      <div className="min-h-0 flex-1 overflow-y-auto pb-24">
        {activeTab === "home" ? (
          <div className="flex flex-col gap-4">
            <div className="text-white backdrop-blur-sm">
              <p className="mt-24 text-2xl font-bold text-sky-100/75">{getGreeting()},</p>
              <h2 className="mt-1 text-4xl font-bold">
                {getDisplayName(userEmail)}{" "}
                <span role="img" aria-label="waving hand">
                  👋
                </span>
              </h2>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2">
              {alertItems.map((item) => (
                <TaskAlertSquare
                  key={item.tone}
                  tone={item.tone}
                  count={item.count}
                  isActive={activeGrupTasks === item.tone}
                  isMobileView
                  forceActiveStyle
                  alwaysShowView
                  onClick={() => handleAlertClick(item.tone)}
                />
              ))}
            </div>

            <section className="mt-2">
              <div className="mb-2 flex items-center justify-between gap-2">
                <h3 className="text-md font-bold uppercase text-white">Recent Task</h3>
                <button
                  type="button"
                  onClick={() => setTabParam("tasks")}
                  className="text-xs font-semibold uppercase tracking-[0.08em] text-sky-100/80 transition hover:text-white"
                >
                  See all
                </button>
              </div>

              <div className="max-h-[38vh] space-y-2 overflow-y-auto pr-1">
                {recentTasks.length === 0 ? (
                  <p className="rounded-lg bg-white/85 px-3 py-2 text-sm text-slate-700">
                    No recent task.
                  </p>
                ) : (
                  recentTasks.map((task) => (
                    <PreviewTaskCard
                      key={task.id}
                      task={task}
                      onDetail={() => setTaskBeingEdited(task)}
                    />
                  ))
                )}
              </div>
            </section>
          </div>
        ) : null}

        {/* Task Modal */}
        <TaskModal
          title="Update Task"
          isOpen={Boolean(taskBeingEdited)}
          isSubmitting={false}
          isCompleted={taskBeingEdited?.completed ?? false}
          submitLabel="Save Changes"
          errorMessage={null}
          initialValues={
            taskBeingEdited
              ? {
                  title: taskBeingEdited.title,
                  description: taskBeingEdited.description,
                  priority: taskBeingEdited.priority,
                  dueDate: taskBeingEdited.dueDate,
                }
              : undefined
          }
          onClose={() => setTaskBeingEdited(null)}
          onSubmit={() => undefined}
          onDelete={() => undefined}
          isDeleting={false}
        />

        {activeTab === "tasks" ? (
          <div className="min-h-[60vh]">
            <TaskManager />
          </div>
        ) : null}

        {activeTab === "calendar" ? (
          <div className="flex flex-col gap-3">
            <h3 className="text-md font-bold uppercase text-white">Calendar</h3>
            <div className="overflow-hidden rounded-2xl border border-sky-300/30 bg-white/95">
              <MonthCalendar
                selectedDate={selectedDate}
                onSelectedDateChange={onSelectedDateChange}
              />
            </div>
            <div className="min-h-0 overflow-hidden">
              <SelectedDateTaskList selectedDate={selectedDate} isMobileView />
            </div>
          </div>
        ) : null}

        {activeTab === "profile" ? (
          <div className="flex min-h-[calc(100dvh-8.5rem)] flex-col">
            <div className="flex h-full flex-1 flex-col rounded-2xl border border-sky-300/30 bg-white p-5 text-sky-700 backdrop-blur-sm">
              <div className="flex flex-1 flex-col items-center justify-center text-center">
                <span className="grid h-28 w-28 place-items-center rounded-full border-4 border-sky-700 bg-white">
                  <UserCircle2 size={60} />
                </span>
                <p className="mt-4 text-lg font-semibold">{getDisplayName(userEmail)}</p>
                <p className="mt-1 text-sm text-sky-900/80">{userEmail}</p>
              </div>
              <div className="pt-4">
                <button
                  type="button"
                  onClick={handleLogout}
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
          </div>
        ) : null}
      </div>

      {/* FAB — only visible on Tasks tab */}
      {activeTab === "tasks" ? (
        <button
          type="button"
          data-open-create-task-modal="true"
          className="fixed right-5 bottom-24 z-50 inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/70 bg-sky-500 text-white ring-4 ring-sky-950/30 shadow-xl shadow-black/35 transition hover:bg-sky-400 hover:shadow-black/45 active:scale-95"
          aria-label="Create task"
        >
          <Plus size={20} />
        </button>
      ) : null}

      {/* Bottom tab navigation */}
      <nav className="fixed right-3 bottom-3 left-3 z-40 flex rounded-2xl border border-sky-200/30 bg-sky-950/90 p-2 backdrop-blur">
        {navItems.map(({ tab, label, icon: Icon }) => (
          <button
            key={tab}
            type="button"
            onClick={() => setTabParam(tab)}
            className={`flex flex-1 flex-col items-center rounded-lg py-2 text-[10px] font-semibold transition ${
              activeTab === tab ? "bg-sky-100/25 text-sky-50" : "text-sky-100/75"
            }`}
          >
            <Icon size={15} className="mb-0.5" />
            {label}
          </button>
        ))}
      </nav>
    </div>
  );
}
