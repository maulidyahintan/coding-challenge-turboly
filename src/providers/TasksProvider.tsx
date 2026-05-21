"use client";

import type { TaskAlertTone, TaskItem } from "@/components/dashboard/task";
import { useTasksQuery } from "@/hooks/useTasksQuery";
import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

type TaskModalMode = "create" | "edit";

interface TasksContextType {
  tasks: TaskItem[];
  isLoading: boolean;
  error: Error | null;
  activeGrupTasks: TaskAlertTone;
  setActiveGrupTasks: (tone: TaskAlertTone) => void;
  // TaskModal global state/handler
  isTaskModalOpen: boolean;
  taskModalMode: TaskModalMode;
  taskModalTask: TaskItem | null;
  taskModalError: string | null;
  openTaskModalCreate: () => void;
  openTaskModalEdit: (task: TaskItem) => void;
  closeTaskModal: () => void;
  setTaskModalError: (msg: string | null) => void;
}

const TasksContext = createContext<TasksContextType | undefined>(undefined);

export function TasksProvider({ children }: Readonly<{ children: ReactNode }>) {
  const { data, isLoading, error } = useTasksQuery();
  const [activeGrupTasks, setActiveGrupTasks] = useState<TaskAlertTone>("all");

  // TaskModal state
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskModalMode, setTaskModalMode] = useState<TaskModalMode>("create");
  const [taskModalTask, setTaskModalTask] = useState<TaskItem | null>(null);
  const [taskModalError, setTaskModalError] = useState<string | null>(null);

  const openTaskModalCreate = () => {
    setTaskModalMode("create");
    setTaskModalTask(null);
    setTaskModalError(null);
    setIsTaskModalOpen(true);
  };
  const openTaskModalEdit = (task: TaskItem) => {
    setTaskModalMode("edit");
    setTaskModalTask(task);
    setTaskModalError(null);
    setIsTaskModalOpen(true);
  };
  const closeTaskModal = () => {
    setIsTaskModalOpen(false);
    setTaskModalTask(null);
    setTaskModalError(null);
  };

  const value = useMemo(
    () => ({
      tasks: data ?? [],
      isLoading,
      error: error as Error | null,
      activeGrupTasks,
      setActiveGrupTasks,
      isTaskModalOpen,
      taskModalMode,
      taskModalTask,
      taskModalError,
      openTaskModalCreate,
      openTaskModalEdit,
      closeTaskModal,
      setTaskModalError,
    }),
    [
      data,
      isLoading,
      error,
      activeGrupTasks,
      isTaskModalOpen,
      taskModalMode,
      taskModalTask,
      taskModalError,
    ]
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
