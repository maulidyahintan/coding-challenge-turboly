"use client";

import type { TaskAlertTone } from "@/features/task/components/task-alert-square";
import type { TaskItem } from "@/features/task/types";
import { useTasksQuery } from "@/hooks/useTasksQuery";
import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

interface TasksContextType {
  tasks: TaskItem[];
  isLoading: boolean;
  error: Error | null;
  activeGrupTasks: TaskAlertTone;
  setActiveGrupTasks: (tone: TaskAlertTone) => void;
}

const TasksContext = createContext<TasksContextType | undefined>(undefined);

export function TasksProvider({ children }: Readonly<{ children: ReactNode }>) {
  const { data, isLoading, error } = useTasksQuery();
  const [activeGrupTasks, setActiveGrupTasks] = useState<TaskAlertTone>("all");

  const value = useMemo(
    () => ({
      tasks: data ?? [],
      isLoading,
      error: error as Error | null,
      activeGrupTasks,
      setActiveGrupTasks,
    }),
    [data, isLoading, error, activeGrupTasks]
  );

  return <TasksContext.Provider value={value}>{children}</TasksContext.Provider>;
}

export const useTasksContext = () => {
  const context = useContext(TasksContext);
  if (!context) {
    throw new Error("useTasksContext must be used within TasksProvider");
  }
  return context;
};
