"use client";

import { useTasksContext } from "@/providers/TasksProvider";
import { useMemo } from "react";
import { TaskAlertSquare } from "./task-alert-square";
import { isDueTodayDate, isOverdueDueDate } from "./utils";

type TaskAlertsSectionProps = Readonly<{
  isTabletScrollable?: boolean;
}>;

export function TaskAlertsSection({ isTabletScrollable = false }: TaskAlertsSectionProps) {
  const { tasks, activeGrupTasks, setActiveGrupTasks } = useTasksContext();

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
