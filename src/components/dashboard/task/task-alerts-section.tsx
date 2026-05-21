"use client";

import { DataStateMessage } from "@/components/ui";
import { useTasksContext } from "@/providers/TasksProvider";
import { useMemo } from "react";
import { TaskAlertSquare } from "./task-alert-square";
import { isDueTodayDate, isOverdueDueDate } from "./utils";

type TaskAlertsSectionProps = Readonly<{
  isTabletScrollable?: boolean;
}>;

export function TaskAlertsSection({ isTabletScrollable = false }: TaskAlertsSectionProps) {
  const { tasks, isLoading, error, activeGrupTasks, setActiveGrupTasks } = useTasksContext();

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

  const alertItems = [
    {
      count: dueTodayCount,
      tone: "dueToday" as const,
      isActive: activeGrupTasks === "dueToday",
      onClick: () => setActiveGrupTasks("dueToday"),
    },
    {
      count: overdueCount,
      tone: "overdue" as const,
      isActive: activeGrupTasks === "overdue",
      onClick: () => setActiveGrupTasks("overdue"),
    },
    {
      count: openCount,
      tone: "open" as const,
      isActive: activeGrupTasks === "open",
      onClick: () => setActiveGrupTasks("open"),
    },
    {
      count: completedCount,
      tone: "completed" as const,
      isActive: activeGrupTasks === "completed",
      onClick: () => setActiveGrupTasks("completed"),
    },
    {
      count: tasks.length,
      tone: "all" as const,
      isActive: activeGrupTasks === "all",
      onClick: () => setActiveGrupTasks("all"),
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-2" aria-busy="true">
        <p className="sr-only" role="status" aria-live="polite">
          Loading task alerts
        </p>
        <div className={isTabletScrollable ? "flex min-w-max gap-3 pr-1" : "flex gap-3"}>
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={`task-alert-loading-${index}`}
              className="h-24 flex-1 animate-pulse rounded-lg border border-sky-200/40 bg-white/60"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <DataStateMessage kind="error" message={error.message} className="rounded-lg" />;
  }

  if (isTabletScrollable) {
    return (
      <div className="overflow-x-auto pb-1">
        <div className="flex min-w-max gap-3 pr-1">
          {alertItems.map((item) => (
            <div key={item.tone} className="w-36 shrink-0">
              <TaskAlertSquare
                count={item.count}
                tone={item.tone}
                isActive={item.isActive}
                onClick={item.onClick}
                fillWidth
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-3">
      {alertItems.map((item) => (
        <TaskAlertSquare
          key={item.tone}
          count={item.count}
          tone={item.tone}
          isActive={item.isActive}
          onClick={item.onClick}
        />
      ))}
    </div>
  );
}
