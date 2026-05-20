"use client";

import { MonthCalendar } from "@/components/shared/month-calendar";
import { SelectedDateTaskList } from "@/features/task/components/selected-date-task-list";
import { TaskAlertsSection } from "@/features/task/components/task-alerts-section";
import { TaskManager } from "@/features/task/components/task-manager";
import { ChartNoAxesColumn, CircleCheck, Clock3, LayoutDashboard } from "lucide-react";

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
      <aside className="flex h-full w-64 flex-col gap-4 rounded-2xl border border-sky-300/30 bg-sky-950/45 p-4 text-sky-100 backdrop-blur-sm">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-200/80">
            Workspace
          </p>
          <h2 className="mt-1 text-lg font-semibold">Task Command Center</h2>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 rounded-lg bg-sky-700/40 px-3 py-2 font-medium">
            <LayoutDashboard size={16} />
            Dashboard
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-sky-100/10 px-3 py-2 text-sky-100/85">
            <ChartNoAxesColumn size={16} />
            Analytics
          </div>
        </div>

        <div className="mt-auto grid gap-2 text-xs">
          <div className="rounded-lg border border-sky-200/20 bg-sky-900/60 p-3">
            <p className="text-sky-200/80">Completion</p>
            <p className="mt-1 flex items-center gap-2 text-sm font-semibold">
              <CircleCheck size={14} />
              Live Sync Enabled
            </p>
          </div>
          <div className="rounded-lg border border-sky-200/20 bg-sky-900/60 p-3">
            <p className="text-sky-200/80">SLA</p>
            <p className="mt-1 flex items-center gap-2 text-sm font-semibold">
              <Clock3 size={14} />
              Due-Date First
            </p>
          </div>
        </div>
      </aside>

      <section className="flex min-h-0 flex-1 flex-col gap-4 overflow-hidden">
        <TaskAlertsSection />
        <TaskManager />
      </section>

      <section className="flex h-full min-h-0 w-95 flex-col gap-3">
        <div className="overflow-hidden rounded-2xl border border-sky-300/30 bg-white/95">
          <MonthCalendar selectedDate={selectedDate} onSelectedDateChange={onSelectedDateChange} />
        </div>
        <div className="min-h-0 flex-1 overflow-hidden rounded-2xl border border-sky-300/30 bg-white/95">
          <SelectedDateTaskList selectedDate={selectedDate} />
        </div>
      </section>
    </div>
  );
}
