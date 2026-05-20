"use client";

import { TaskAlertSquare } from "@/features/task/components/task-alert-square";
import type { TaskItem } from "@/features/task/types";
import { isDueTodayDate, isOverdueDueDate } from "@/features/task/utils";
import { useEffect, useMemo, useState } from "react";

export function TaskAlertsSection() {
  const [tasks, setTasks] = useState<TaskItem[]>([]);

  useEffect(() => {
    let isMounted = true;

    const loadTasks = async () => {
      const response = await fetch("/api/tasks", { cache: "no-store" });
      const result = (await response.json().catch(() => null)) as {
        tasks?: TaskItem[];
      } | null;

      if (!isMounted || !response.ok) {
        return;
      }

      setTasks(result?.tasks ?? []);
    };

    void loadTasks();

    const intervalId = globalThis.setInterval(() => {
      void loadTasks();
    }, 15000);

    const handleFocus = () => {
      void loadTasks();
    };

    window.addEventListener("focus", handleFocus);
    globalThis.addEventListener("tasks-updated", handleFocus);

    return () => {
      isMounted = false;
      globalThis.clearInterval(intervalId);
      window.removeEventListener("focus", handleFocus);
      globalThis.removeEventListener("tasks-updated", handleFocus);
    };
  }, []);

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
