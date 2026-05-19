import { TaskFormPayload } from "@/features/task/types";

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
