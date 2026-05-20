"use client";

import { DesktopDashboardPanels } from "@/components/adaptive/desktop/desktop-dashboard-panels";
import { MobileDashboardPanels } from "@/components/adaptive/mobile/mobile-dashboard-panels";
import { TabletDashboardPanels } from "@/components/adaptive/tablet/tablet-dashboard-panels";
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

      <DesktopDashboardPanels selectedDate={selectedDate} onSelectedDateChange={setSelectedDate} />
    </div>
  );
}
