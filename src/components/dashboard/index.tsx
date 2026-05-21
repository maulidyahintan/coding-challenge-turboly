"use client";

import { DesktopDashboardPanels } from "@/components/adaptive/desktop/dashboard";
import { MobileDashboardPanels } from "@/components/adaptive/mobile/dashboard";
import { TabletDashboardPanels } from "@/components/adaptive/tablet/dashboard";
import { useTasksContext } from "@/providers/TasksProvider";
import { useState } from "react";
import { DashboardBranding } from "./dashboard-branding";
import { CreateTaskButton } from "./create-task-button";
import { LogoutButton } from "./logout-button";
import { TaskModalContainer } from "./task-modal-container";

type DashboardPageClientProps = Readonly<{
  userEmail: string;
}>;

export function DashboardPageClient({ userEmail }: DashboardPageClientProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const { openTaskModalCreate } = useTasksContext();

  return (
    <>
      <main className="flex h-screen flex-col gap-4 bg-linear-to-b from-sky-700 via-sky-600 to-sky-500 px-3 py-4 sm:px-5 sm:py-6">
        <div className="relative z-50 mx-auto justify-between hidden w-full md:flex lg:hidden">
          <DashboardBranding />
          <CreateTaskButton onClick={openTaskModalCreate} />
        </div>

        <nav className="relative z-50 mx-auto hidden w-full items-center justify-between gap-3 rounded-2xl border border-sky-300/30 bg-sky-900/35 px-4 py-3 backdrop-blur-sm lg:flex sm:px-5">
          <DashboardBranding />
          <div className="flex items-center gap-2 sm:gap-3">
            <CreateTaskButton onClick={openTaskModalCreate} />
            <LogoutButton userEmail={userEmail} />
          </div>
        </nav>

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

          <DesktopDashboardPanels
            selectedDate={selectedDate}
            onSelectedDateChange={setSelectedDate}
          />
        </div>
        <TaskModalContainer />
      </main>
    </>
  );
}
