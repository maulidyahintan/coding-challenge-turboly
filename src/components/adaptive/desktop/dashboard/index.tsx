"use client";

import { MonthCalendar, SelectedDateTaskList } from "@/components/dashboard/section-calendar";
import { TaskAlertsSection, TaskManager } from "@/components/dashboard/task";

type DesktopDashboardPanelsProps = Readonly<{
  selectedDate: Date | undefined;
  onSelectedDateChange: (date: Date | undefined) => void;
}>;

export function DesktopDashboardPanels({
  selectedDate,
  onSelectedDateChange,
}: DesktopDashboardPanelsProps) {
  return (
    <div className="hidden min-h-0 flex-1 gap-4 lg:flex">
      <section className="flex h-full min-h-0 w-90 flex-col overflow-hidden rounded-2xl border border-sky-300/30 backdrop-blur-sm">
        <MonthCalendar selectedDate={selectedDate} onSelectedDateChange={onSelectedDateChange} />
        <SelectedDateTaskList selectedDate={selectedDate} />
      </section>

      <section className="flex h-full min-h-0 w-full flex-1 flex-col gap-4 overflow-hidden">
        <TaskAlertsSection />
        <TaskManager />
      </section>
    </div>
  );
}
