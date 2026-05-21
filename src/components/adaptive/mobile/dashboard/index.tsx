"use client";

import {
  MonthCalendar,
  PreviewTaskCard,
  SelectedDateTaskList,
} from "@/components/dashboard/section-calendar";
import {
  isDueTodayDate,
  isOverdueDueDate,
  TaskAlertSquare,
  TaskAlertTone,
  TaskManager,
} from "@/components/dashboard/task";
import { IconTabNav, type IconTabNavItem, UserAccountPanel } from "@/components/ui";
import { useLogout } from "@/hooks/useLogout";
import { useTasksContext } from "@/providers/TasksProvider";
import { CalendarDays, Home, Plus, SquareKanban, UserCircle2 } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";

const MOBILE_TAB = {
  HOME: "home",
  TASKS: "tasks",
  CALENDAR: "calendar",
  PROFILE: "profile",
} as const;

type MobileTab = (typeof MOBILE_TAB)[keyof typeof MOBILE_TAB];

const MOBILE_TABS = new Set<MobileTab>(Object.values(MOBILE_TAB));

const MOBILE_NAV_ITEMS: ReadonlyArray<IconTabNavItem<MobileTab>> = [
  { tab: MOBILE_TAB.HOME, label: "Home", ariaLabel: "Show home", icon: Home },
  { tab: MOBILE_TAB.TASKS, label: "Tasks", ariaLabel: "Show tasks", icon: SquareKanban },
  {
    tab: MOBILE_TAB.CALENDAR,
    label: "Calendar",
    ariaLabel: "Show calendar",
    icon: CalendarDays,
  },
  {
    tab: MOBILE_TAB.PROFILE,
    label: "Profile",
    ariaLabel: "Show profile",
    icon: UserCircle2,
  },
];

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
  const activeTab: MobileTab = isMobileTab(tabParam) ? tabParam : MOBILE_TAB.HOME;
  const { tasks, activeGrupTasks, setActiveGrupTasks, openTaskModalCreate, openTaskModalEdit } =
    useTasksContext();

  const setTabParam = (tab: MobileTab) => {
    const params = new URLSearchParams(searchParams.toString());

    if (tab === MOBILE_TAB.HOME) {
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
    setTabParam(MOBILE_TAB.TASKS);
  };

  const { logout, isLoggingOut, logoutError } = useLogout();
  const greeting = getGreeting();
  const displayName = getDisplayName(userEmail);

  return (
    <div className="flex min-h-0 flex-1 flex-col md:hidden">
      {/* Scrollable content area */}
      <div className="min-h-0 flex-1 overflow-y-auto pb-24">
        {activeTab === MOBILE_TAB.HOME ? (
          <div className="flex flex-col gap-4">
            <div className="text-white backdrop-blur-sm">
              <p className="mt-24 text-2xl font-bold text-sky-100/75">{greeting},</p>
              <h2 className="mt-1 text-4xl font-bold">
                {displayName}{" "}
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
                  onClick={() => setTabParam(MOBILE_TAB.TASKS)}
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
                      onDetail={() => openTaskModalEdit(task)}
                    />
                  ))
                )}
              </div>
            </section>
          </div>
        ) : null}

        {activeTab === MOBILE_TAB.TASKS ? (
          <div className="min-h-[60vh]">
            <TaskManager />
          </div>
        ) : null}

        {activeTab === MOBILE_TAB.CALENDAR ? (
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

        {activeTab === MOBILE_TAB.PROFILE ? (
          <div className="flex min-h-[calc(100dvh-8.5rem)] flex-col">
            <UserAccountPanel
              variant="mobile-profile"
              userEmail={userEmail}
              displayName={displayName}
              isLoggingOut={isLoggingOut}
              logoutError={logoutError}
              onLogout={logout}
            />
          </div>
        ) : null}
      </div>

      {/* FAB — only visible on Tasks tab */}
      {activeTab === MOBILE_TAB.TASKS ? (
        <button
          type="button"
          onClick={openTaskModalCreate}
          className="fixed right-5 bottom-24 z-50 inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/70 bg-sky-500 text-white ring-4 ring-sky-950/30 shadow-xl shadow-black/35 transition hover:bg-sky-400 hover:shadow-black/45 active:scale-95"
          aria-label="Create task"
        >
          <Plus size={20} />
        </button>
      ) : null}

      {/* Bottom tab navigation */}
      <IconTabNav
        items={MOBILE_NAV_ITEMS}
        activeTab={activeTab}
        onTabChange={setTabParam}
        ariaLabel="Mobile dashboard tabs"
        className="fixed right-3 bottom-3 left-3 z-40 flex rounded-2xl border border-sky-200/30 bg-sky-950/90 p-2 backdrop-blur"
        variant="bottom-nav"
      />
    </div>
  );
}
