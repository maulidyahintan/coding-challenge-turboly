"use client";

import { SyntheticEvent, useEffect, useMemo, useState } from "react";
import { FormLabel } from "@/components/ui/form-label";

type TaskItem = {
  id: string;
  title: string;
  description: string | null;
  priority: "LOW" | "MEDIUM" | "HIGH";
  dueDate: string;
  completed: boolean;
  createdAt: string;
};

const priorityBadgeStyle: Record<TaskItem["priority"], string> = {
  LOW: "bg-emerald-100 text-emerald-700",
  MEDIUM: "bg-amber-100 text-amber-700",
  HIGH: "bg-rose-100 text-rose-700",
};

function isOverdueDueDate(dueDate: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);

  return due < today;
}

export function TaskManager() {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [createErrorMessage, setCreateErrorMessage] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const totalOpenTasks = useMemo(
    () => tasks.filter((task) => !task.completed).length,
    [tasks]
  );

  const loadTasks = async () => {
    setErrorMessage(null);

    const response = await fetch("/api/tasks", { cache: "no-store" });
    const result = (await response.json().catch(() => null)) as
      | { tasks?: TaskItem[]; message?: string }
      | null;

    if (!response.ok) {
      setErrorMessage(result?.message ?? "Failed to load tasks.");
      setIsLoading(false);
      return;
    }

    setTasks(result?.tasks ?? []);
    setIsLoading(false);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadTasks();
  }, []);

  useEffect(() => {
    const trigger = document.getElementById("open-create-task-modal");

    if (!trigger) {
      return;
    }

    const openModal = () => setIsCreateModalOpen(true);
    trigger.addEventListener("click", openModal);

    return () => {
      trigger.removeEventListener("click", openModal);
    };
  }, []);

  const handleCreate = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCreateErrorMessage(null);
    setIsCreating(true);

    const form = event.currentTarget;
    const formData = new FormData(form);

    const readField = (key: string, fallback = "") => {
      const value = formData.get(key);
      return typeof value === "string" ? value : fallback;
    };

    const payload = {
      title: readField("title"),
      description: readField("description"),
      priority: readField("priority", "MEDIUM"),
      dueDate: readField("dueDate"),
    };

    if (!payload.title.trim()) {
      setCreateErrorMessage("Title is required.");
      setIsCreating(false);
      return;
    }

    if (!payload.dueDate) {
      setCreateErrorMessage("Due date is required.");
      setIsCreating(false);
      return;
    }

    const response = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = (await response.json().catch(() => null)) as
      | { task?: TaskItem; message?: string }
      | null;

    if (!response.ok || !result?.task) {
      setCreateErrorMessage(result?.message ?? "Failed to create task.");
      setIsCreating(false);
      return;
    }

    const createdTask = result.task;
    setTasks((prev) => [createdTask, ...prev]);
    form.reset();
    setIsCreateModalOpen(false);
    setIsCreating(false);
  };

  return (
    <>
      {isCreateModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4">
          <div className="w-full max-w-md rounded-xl border border-sky-200/30 bg-white p-4 font-sans shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-900">Create Task</h2>
              <button
                type="button"
                onClick={() => {
                  if (!isCreating) {
                    setCreateErrorMessage(null);
                    setIsCreateModalOpen(false);
                  }
                }}
                className="px-2 py-1 text-xs font-medium text-slate-700 transition hover:bg-slate-100"
              >
                X
              </button>
            </div>

            <form onSubmit={handleCreate} className="mt-4 space-y-3">
              <FormLabel text="Title" required aria-required="true">
                <input
                  required
                  name="title"
                  placeholder="Task title"
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-sans text-sm text-slate-900 outline-none focus:border-sky-500"
                />
              </FormLabel>

              <FormLabel text="Description">
                <textarea
                  name="description"
                  placeholder="Description (optional)"
                  rows={3}
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-sans text-sm text-slate-900 outline-none focus:border-sky-500"
                />
              </FormLabel>

              <div className="grid grid-cols-2 gap-3">
                <FormLabel text="Priority">
                  <select
                    name="priority"
                    defaultValue="MEDIUM"
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-sans text-sm text-slate-900 outline-none focus:border-sky-500"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                </FormLabel>

                <FormLabel text="Due Date" required aria-required="true">
                  <input
                    required
                    aria-required="true"
                    type="date"
                    name="dueDate"
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-sans text-sm text-slate-900 outline-none focus:border-sky-500"
                  />
                </FormLabel>
              </div>

              {createErrorMessage ? (
                <p className="rounded-lg bg-rose-100 px-3 py-2 text-sm text-rose-700">
                  {createErrorMessage}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={isCreating}
                className="w-full rounded-lg bg-sky-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:bg-sky-300"
              >
                {isCreating ? "Creating..." : "Create Task"}
              </button>
            </form>
          </div>
        </div>
      ) : null}

      <div className="flex-1 overflow-hidden p-4 font-sans">
        <section className="h-full overflow-hidden rounded-xl border border-sky-200/25 bg-sky-950/45 p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-sky-100/80">
            Tasks
          </h2>
          <span className="rounded-full bg-sky-100/15 px-2 py-1 text-xs font-medium text-sky-100">
            Open: {totalOpenTasks}
          </span>
        </div>

        {errorMessage ? (
          <p className="mb-3 rounded-lg bg-rose-100 px-3 py-2 text-sm text-rose-700">
            {errorMessage}
          </p>
        ) : null}

        <div className="max-h-[520px] space-y-2 overflow-auto pr-1">
          {isLoading ? (
            <p className="rounded-lg bg-white/80 px-3 py-2 text-sm text-slate-600">Loading tasks...</p>
          ) : null}

          {!isLoading && tasks.length === 0 ? (
            <p className="rounded-lg bg-white/80 px-3 py-2 text-sm text-slate-600">
              No task yet. Create your first task.
            </p>
          ) : null}

          {isLoading
            ? null
            : tasks.map((task) => (
                (() => {
                  const isOverdue = !task.completed && isOverdueDueDate(task.dueDate);
                  return (
                <article
                  key={task.id}
                  className={
                    isOverdue
                      ? "rounded-lg border border-rose-300 bg-rose-50 p-3 text-rose-900"
                      : "rounded-lg border border-slate-200 bg-white p-3 text-slate-800"
                  }
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-sm font-semibold leading-snug">{task.title}</h3>
                    <span
                      className={`rounded-full px-2 py-1 text-[11px] font-semibold ${priorityBadgeStyle[task.priority]}`}
                    >
                      {task.priority}
                    </span>
                  </div>
                  {task.description ? (
                    <p className={isOverdue ? "mt-1 text-xs text-rose-700" : "mt-1 text-xs text-slate-600"}>
                      {task.description}
                    </p>
                  ) : null}
                  <p className={isOverdue ? "mt-2 text-xs font-medium text-rose-700" : "mt-2 text-xs text-slate-500"}>
                    Due {new Date(task.dueDate).toLocaleDateString()}
                    {isOverdue ? " (Overdue)" : ""}
                  </p>
                </article>
                  );
                })()
              ))}
        </div>
        </section>
      </div>
    </>
  );
}
