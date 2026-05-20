"use client";

import { FormLabel } from "@/components/ui/form-label";
import type { TaskItem } from "@/features/task/types";
import { readTaskPayload, toDateInputValue, validateTaskPayload } from "@/features/task/utils";
import { SyntheticEvent, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";

type TaskDetailModalProps = Readonly<{
  task: TaskItem | null;
  isOpen: boolean;
  onClose: () => void;
  onTaskUpdated?: (task: TaskItem) => void;
}>;

export function TaskDetailModal({ task, isOpen, onClose, onTaskUpdated }: TaskDetailModalProps) {
  const [mounted, setMounted] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    setIsEditing(false);
    setIsSubmitting(false);
    setErrorMessage(null);
  }, [task]);

  const initialValues = useMemo(
    () =>
      task
        ? {
            title: task.title,
            description: task.description ?? "",
            priority: task.priority,
            dueDate: toDateInputValue(task.dueDate),
          }
        : undefined,
    [task]
  );

  const handleSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!task) {
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);

    const form = event.currentTarget;
    const payload = readTaskPayload(new FormData(form));
    const validationError = validateTaskPayload(payload);

    if (validationError) {
      setErrorMessage(validationError);
      setIsSubmitting(false);
      return;
    }

    const response = await fetch(`/api/tasks/${task.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = (await response.json().catch(() => null)) as {
      task?: TaskItem;
      message?: string;
    } | null;

    if (!response.ok || !result?.task) {
      setErrorMessage(result?.message ?? "Failed to update task.");
      setIsSubmitting(false);
      return;
    }

    onTaskUpdated?.(result.task);
    setIsEditing(false);
    setIsSubmitting(false);
  };

  if (!mounted || !isOpen || !task) {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4">
      <div className="w-full max-w-md rounded-xl border border-sky-200/30 bg-white p-4 font-sans shadow-2xl">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-900">Task Detail</h2>
          <button
            type="button"
            onClick={onClose}
            className="px-2 py-1 text-xs font-medium text-slate-700 transition hover:bg-slate-100"
          >
            X
          </button>
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="mt-4 space-y-3">
            <FormLabel text="Title" required aria-required="true">
              <input
                required
                name="title"
                defaultValue={initialValues?.title ?? ""}
                placeholder="Task title"
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-sans text-sm text-slate-900 outline-none focus:border-sky-500"
              />
            </FormLabel>

            <FormLabel text="Description">
              <textarea
                name="description"
                defaultValue={initialValues?.description ?? ""}
                placeholder="Description (optional)"
                rows={3}
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-sans text-sm text-slate-900 outline-none focus:border-sky-500"
              />
            </FormLabel>

            <div className="grid grid-cols-2 gap-3">
              <FormLabel text="Priority">
                <select
                  name="priority"
                  defaultValue={initialValues?.priority ?? "MEDIUM"}
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
                  defaultValue={initialValues?.dueDate ?? ""}
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-sans text-sm text-slate-900 outline-none focus:border-sky-500"
                />
              </FormLabel>
            </div>

            {errorMessage ? (
              <p className="rounded-lg bg-rose-100 px-3 py-2 text-sm text-rose-700">
                {errorMessage}
              </p>
            ) : null}

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setErrorMessage(null);
                  setIsEditing(false);
                }}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-lg bg-sky-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:bg-sky-300"
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        ) : (
          <div className="mt-4 space-y-3 text-sm text-slate-800">
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">
                Title
              </p>
              <p className="mt-1 font-semibold text-slate-900">{task.title}</p>
            </div>

            <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">
                Description
              </p>
              <p className="mt-1 text-slate-800">{task.description ?? "-"}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">
                  Priority
                </p>
                <p className="mt-1 font-semibold text-slate-900">{task.priority}</p>
              </div>

              <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">
                  Status
                </p>
                <p className="mt-1 font-semibold text-slate-900">
                  {task.completed ? "Done" : "Open"}
                </p>
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">
                Due Date
              </p>
              <p className="mt-1 font-semibold text-slate-900">
                {new Date(task.dueDate).toLocaleDateString()}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="rounded-lg bg-sky-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-sky-500"
              >
                Edit
              </button>

              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
