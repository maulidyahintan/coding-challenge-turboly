"use client";

import { MonthCalendar, SelectedDateTaskList } from "@/components/dashboard/section-calendar";
import { TaskAlertsSection, TaskManager } from "@/components/dashboard/task";
import { IconTabNav, type IconTabNavItem, UserAccountPanel } from "@/components/ui";
import { useLogout } from "@/hooks/useLogout";
import { CalendarDays, ChevronLeft, ChevronRight, SquareKanban } from "lucide-react";
import { useState } from "react";

type TabletDashboardPanelsProps = Readonly<{
  selectedDate: Date | undefined;
  onSelectedDateChange: (date: Date | undefined) => void;
  userEmail: string;
}>;

const TABLET_TAB = {
  TASKS: "tasks",
  CALENDAR: "calendar",
} as const;

type TabletTab = (typeof TABLET_TAB)[keyof typeof TABLET_TAB];

const TABLET_NAV_ITEMS: ReadonlyArray<IconTabNavItem<TabletTab>> = [
  {
    tab: TABLET_TAB.TASKS,
    label: "Tasks",
    ariaLabel: "Show tasks",
    icon: SquareKanban,
  },
  {
    tab: TABLET_TAB.CALENDAR,
    label: "Calendar",
    ariaLabel: "Show calendar",
    icon: CalendarDays,
  },
];

export function TabletDashboardPanels({
  selectedDate,
  onSelectedDateChange,
  userEmail,
}: TabletDashboardPanelsProps) {
  const [activeTab, setActiveTab] = useState<TabletTab>(TABLET_TAB.TASKS);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const { logout, isLoggingOut, logoutError } = useLogout();

  const sidebarWidthClassName = isSidebarExpanded ? "w-64" : "w-16 items-center";
  const toggleButtonClassName = isSidebarExpanded
    ? "inline-flex h-9 w-full items-center justify-end rounded-lg bg-sky-100/10 px-2 text-sky-100/85 transition hover:bg-sky-100/20"
    : "inline-flex h-9 w-9 items-center justify-center rounded-lg bg-sky-100/10 text-sky-100/85 transition hover:bg-sky-100/20";

  return (
    <div className="hidden min-h-0 flex-1 gap-4 -ml-5 md:flex lg:hidden">
      <aside
        className={`flex gap-4 flex-col rounded-r-2xl border border-sky-300/30 border-l-0 bg-sky-950/45 p-2 text-sky-100/85 backdrop-blur-sm transition-all duration-200 ${sidebarWidthClassName}`}
      >
        <button
          type="button"
          onClick={() => setIsSidebarExpanded((prev) => !prev)}
          className={toggleButtonClassName}
          aria-label={isSidebarExpanded ? "Collapse sidebar" : "Expand sidebar"}
        >
          {isSidebarExpanded ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>

        <IconTabNav
          items={TABLET_NAV_ITEMS}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          ariaLabel="Tablet dashboard tabs"
          className="mt-3 flex flex-col gap-2"
          variant="sidebar"
          isExpanded={isSidebarExpanded}
        />

        <UserAccountPanel
          variant="tablet-sidebar"
          userEmail={userEmail}
          isExpanded={isSidebarExpanded}
          isLoggingOut={isLoggingOut}
          logoutError={logoutError}
          onLogout={logout}
        />
      </aside>

      {activeTab === TABLET_TAB.TASKS ? (
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
