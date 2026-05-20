"use client";

import { MobileDashboardPanels } from "@/components/adaptive/mobile/mobile-dashboard-panels";
import { TabletDashboardPanels } from "@/components/adaptive/tablet/tablet-dashboard-panels";
import { MonthCalendar } from "@/components/shared/month-calendar";
import { SelectedDateTaskList } from "@/features/task/components/selected-date-task-list";
import { TaskAlertsSection } from "@/features/task/components/task-alerts-section";
import { TaskManager } from "@/features/task/components/task-manager";
import { useState } from "react";

type DashboardPanelsProps = Readonly<{
  userEmail: string;
}>;

export function DashboardPanels({ userEmail }: DashboardPanelsProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <MobileDashboardPanels
        selectedDate={selectedDate}
        onSelectedDateChange={setSelectedDate}
        userEmail={userEmail}
      />

      <TabletDashboardPanels
        selectedDate={selectedDate}
        onSelectedDateChange={setSelectedDate}
        userEmail={userEmail}
      />

      <div className="hidden min-h-0 flex-1 gap-4 lg:flex">
        <section className="flex h-full min-h-0 w-90 flex-col overflow-hidden rounded-2xl border border-sky-300/30 backdrop-blur-sm">
          <MonthCalendar selectedDate={selectedDate} onSelectedDateChange={setSelectedDate} />
          <SelectedDateTaskList selectedDate={selectedDate} />
        </section>

        <section className="flex h-full min-h-0 w-full flex-1 flex-col gap-4 overflow-hidden">
          <TaskAlertsSection />
          <TaskManager />
        </section>
      </div>
    </div>
  );
}
