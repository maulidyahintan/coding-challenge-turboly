"use client";

import { TaskAlertSquare } from "@/features/task/components/task-alert-square";
import { isDueTodayDate, isOverdueDueDate } from "@/features/task/utils";
import { useTasksContext } from "@/providers/TasksProvider";
import { useMemo } from "react";

export function TaskAlertsSection() {
  const { tasks } = useTasksContext();

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

  return (
    <div className="flex gap-3">
      <TaskAlertSquare count={dueTodayCount} tone="dueToday" />
      <TaskAlertSquare count={overdueCount} tone="overdue" />
      <TaskAlertSquare count={openCount} tone="open" />
      <TaskAlertSquare count={completedCount} tone="completed" />
      <TaskAlertSquare count={tasks.length} tone="all" />
    </div>
  );
}
