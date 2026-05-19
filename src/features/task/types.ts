export type TaskPriority = "LOW" | "MEDIUM" | "HIGH";

export type TaskSortOption = "dueDate" | "title" | "description" | "priority";

export type TaskItem = {
  id: string;
  title: string;
  description: string | null;
  priority: TaskPriority;
  dueDate: string;
  completed: boolean;
  createdAt: string;
};

export type TaskFormPayload = {
  title: string;
  description: string;
  priority: TaskPriority;
  dueDate: string;
};
