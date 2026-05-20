"use client";

import { TaskAlertSquare } from "@/features/task/components/task-alert-square";
import { isDueTodayDate, isOverdueDueDate } from "@/features/task/utils";
import { useTasksContext } from "@/providers/TasksProvider";
import { useMemo } from "react";

export function TaskAlertsSection() {
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

  return (
    <div className="flex gap-3">
      <TaskAlertSquare
        count={dueTodayCount}
        tone="dueToday"
        isActive={activeGrupTasks === "dueToday"}
        onClick={() => setActiveGrupTasks("dueToday")}
      />
      <TaskAlertSquare
        count={overdueCount}
        tone="overdue"
        isActive={activeGrupTasks === "overdue"}
        onClick={() => setActiveGrupTasks("overdue")}
      />
      <TaskAlertSquare
        count={openCount}
        tone="open"
        isActive={activeGrupTasks === "open"}
        onClick={() => setActiveGrupTasks("open")}
      />
      <TaskAlertSquare
        count={completedCount}
        tone="completed"
        isActive={activeGrupTasks === "completed"}
        onClick={() => setActiveGrupTasks("completed")}
      />
      <TaskAlertSquare
        count={tasks.length}
        tone="all"
        isActive={activeGrupTasks === "all"}
        onClick={() => setActiveGrupTasks("all")}
      />
    </div>
  );
}
