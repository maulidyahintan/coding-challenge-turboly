import type { TaskFormPayload, TaskItem } from "@/features/task/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateTaskMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: TaskFormPayload) => {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = (await response.json().catch(() => null)) as {
        task?: TaskItem;
        message?: string;
      } | null;

      if (!response.ok || !result?.task) {
        throw new Error(result?.message ?? "Failed to create task");
      }

      return result.task;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};

export const useUpdateTaskMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: string; payload: Partial<TaskItem> }) => {
      const response = await fetch(`/api/tasks/${data.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data.payload),
      });

      const result = (await response.json().catch(() => null)) as {
        task?: TaskItem;
        message?: string;
      } | null;

      if (!response.ok || !result?.task) {
        throw new Error(result?.message ?? "Failed to update task");
      }

      return result.task;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};

export const useDeleteTaskMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (taskId: string) => {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
      });

      const result = (await response.json().catch(() => null)) as { message?: string } | null;

      if (!response.ok) {
        throw new Error(result?.message ?? "Failed to delete task");
      }

      return taskId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};

export const useCompleteTaskMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: string; completed: boolean }) => {
      const response = await fetch(`/api/tasks/${data.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: data.completed }),
      });

      const result = (await response.json().catch(() => null)) as {
        task?: TaskItem;
        message?: string;
      } | null;

      if (!response.ok || !result?.task) {
        throw new Error(result?.message ?? "Failed to update task status");
      }

      return result.task;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};
