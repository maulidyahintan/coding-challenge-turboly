"use client";

import type { TaskItem } from "@/features/task/types";
import { useTasksQuery } from "@/hooks/useTasksQuery";
import { createContext, useContext, useMemo, type ReactNode } from "react";

interface TasksContextType {
  tasks: TaskItem[];
  isLoading: boolean;
  error: Error | null;
}

const TasksContext = createContext<TasksContextType | undefined>(undefined);

export function TasksProvider({ children }: Readonly<{ children: ReactNode }>) {
  const { data, isLoading, error } = useTasksQuery();

  const value = useMemo(
    () => ({ tasks: data ?? [], isLoading, error: error as Error | null }),
    [data, isLoading, error]
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
