import type { TaskItem } from "@/features/task/types";
import { useQuery } from "@tanstack/react-query";

export const useTasksQuery = () => {
  return useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const response = await fetch("/api/tasks", { cache: "no-store" });
      const result = (await response.json().catch(() => null)) as {
        tasks?: TaskItem[];
        message?: string;
      } | null;

      if (!response.ok) {
        throw new Error(result?.message ?? "Failed to load tasks");
      }

      return result?.tasks ?? [];
    },
  });
};
