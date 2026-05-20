"use client";

import { MonthCalendar } from "@/components/shared/month-calendar";
import { SelectedDateTaskList } from "@/features/task/components/selected-date-task-list";
import { TaskAlertsSection } from "@/features/task/components/task-alerts-section";
import { TaskManager } from "@/features/task/components/task-manager";
import { Bell, CalendarDays, LayoutPanelLeft } from "lucide-react";

type TabletDashboardPanelsProps = Readonly<{
  selectedDate: Date | undefined;
  onSelectedDateChange: (date: Date | undefined) => void;
}>;

export function TabletDashboardPanels({
  selectedDate,
  onSelectedDateChange,
}: TabletDashboardPanelsProps) {
  return (
    <div className="hidden min-h-0 flex-1 gap-4 md:flex lg:hidden">
      <aside className="flex w-16 flex-col items-center gap-3 rounded-2xl border border-sky-300/30 bg-sky-950/45 p-2 text-sky-100/85 backdrop-blur-sm">
        <span className="mt-1 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-sky-700/60">
          <LayoutPanelLeft size={16} />
        </span>
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-sky-100/10">
          <CalendarDays size={16} />
        </span>
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-sky-100/10">
          <Bell size={16} />
        </span>
      </aside>

      <section className="flex min-h-0 flex-1 flex-col gap-4 overflow-hidden">
        <TaskAlertsSection />
        <TaskManager />
      </section>

      <section className="flex h-full min-h-0 w-85 flex-col overflow-hidden rounded-2xl border border-sky-300/30 bg-white/95">
        <MonthCalendar selectedDate={selectedDate} onSelectedDateChange={onSelectedDateChange} />
        <SelectedDateTaskList selectedDate={selectedDate} />
      </section>
    </div>
  );
}
