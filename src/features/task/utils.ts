import { TaskFormPayload, TaskItem, TaskSortOption } from "@/features/task/types";

const priorityRank: Record<TaskItem["priority"], number> = {
  HIGH: 0,
  MEDIUM: 1,
  LOW: 2,
};

const sortComparators: Record<TaskSortOption, (left: TaskItem, right: TaskItem) => number> = {
  dueDate: (left, right) => new Date(left.dueDate).getTime() - new Date(right.dueDate).getTime(),
  title: (left, right) => left.title.localeCompare(right.title),
  description: (left, right) =>
    (left.description ?? left.title).localeCompare(right.description ?? right.title),
  priority: (left, right) => priorityRank[left.priority] - priorityRank[right.priority],
};

export function isOverdueDueDate(dueDate: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);

  return due < today;
}

export function toDateInputValue(dateValue: string) {
  const date = new Date(dateValue);
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(0, 10);
}

export function readTaskPayload(formData: FormData): TaskFormPayload {
  const readField = (key: string, fallback = "") => {
    const value = formData.get(key);
    return typeof value === "string" ? value : fallback;
  };

  return {
    title: readField("title"),
    description: readField("description"),
    priority: readField("priority", "MEDIUM") as TaskFormPayload["priority"],
    dueDate: readField("dueDate"),
  };
}

export function validateTaskPayload(payload: TaskFormPayload) {
  if (!payload.title.trim()) {
    return "Title is required.";
  }

  if (!payload.dueDate) {
    return "Due date is required.";
  }

  return null;
}

export function sortTasks(tasks: TaskItem[], sortBy: TaskSortOption) {
  return [...tasks].sort(sortComparators[sortBy]);
}

export function filterTasksByQuery(tasks: TaskItem[], query: string) {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return tasks;
  }

  return tasks.filter((task) => {
    const searchTarget = `${task.title} ${task.description ?? ""}`.toLowerCase();
    return searchTarget.includes(normalizedQuery);
  });
}
