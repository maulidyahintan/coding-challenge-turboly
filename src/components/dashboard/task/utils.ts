import { createTaskSchema } from "@/lib/validations/task";
import { TaskFormPayload, TaskItem, TaskSortOption } from "./types";

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

export function isDueTodayDate(dueDate: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);

  return due.getTime() === today.getTime();
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

  const completedValues = formData
    .getAll("completed")
    .filter((value): value is string => typeof value === "string");
  const completedField = completedValues.at(-1);
  const completed =
    typeof completedField === "string" ? completedField.trim().toLowerCase() === "true" : undefined;

  return {
    title: readField("title"),
    description: readField("description"),
    priority: readField("priority", "MEDIUM") as TaskFormPayload["priority"],
    dueDate: readField("dueDate"),
    completed,
  };
}

export function validateTaskPayload(payload: TaskFormPayload) {
  const parsed = createTaskSchema.safeParse({
    title: payload.title,
    description: payload.description,
    priority: payload.priority,
    dueDate: payload.dueDate,
  });

  if (!parsed.success) {
    return parsed.error.issues[0]?.message ?? "Invalid task payload.";
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
