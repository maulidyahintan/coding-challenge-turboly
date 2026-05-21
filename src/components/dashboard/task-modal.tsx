"use client";

import { FormLabel } from "@/components/ui";
import { Trash2, X } from "lucide-react";
import { SyntheticEvent, useState } from "react";
import { createPortal } from "react-dom";
import { DeleteConfirmDialog } from "./delete-confirm-dialog";
import { TaskItem } from "./task/types";

type TaskModalProps = Readonly<{
  title: string;
  isOpen: boolean;
  isSubmitting: boolean;
  submitLabel: string;
  errorMessage: string | null;
  initialValues?: Partial<Pick<TaskItem, "title" | "description" | "priority">> & {
    dueDate?: string;
  };
  isCompleted?: boolean;
  onClose: () => void;
  onSubmit: (event: SyntheticEvent<HTMLFormElement>) => void;
  onDelete?: () => void;
  isDeleting?: boolean;
}>;

export function TaskModal({
  title,
  isOpen,
  isSubmitting,
  submitLabel,
  errorMessage,
  initialValues,
  isCompleted,
  onClose,
  onSubmit,
  onDelete,
  isDeleting = false,
}: TaskModalProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const isUpdateMode = initialValues !== undefined;
  const isBusy = isSubmitting || isDeleting;
  const dueDateDefaultValue = initialValues?.dueDate ?? new Date().toISOString().split("T")[0];
  const deleteTargetLabel = initialValues?.title ?? title;

  const handleClose = () => {
    if (isBusy) {
      return;
    }
    setShowDeleteConfirm(false);
    onClose();
  };

  if (!isOpen || typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4">
      <div className="relative w-full max-w-md rounded-xl border border-sky-200/30 bg-white p-4 font-sans shadow-2xl">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-900">{title}</h2>
          <button
            type="button"
            onClick={handleClose}
            disabled={isBusy}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Close task modal"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="mt-4 space-y-3">
          <FormLabel text="Title" required aria-required="true">
            <input
              required
              name="title"
              maxLength={120}
              defaultValue={initialValues?.title ?? ""}
              placeholder="Task title"
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-sans text-sm text-slate-900 outline-none focus:border-sky-500"
            />
          </FormLabel>

          <FormLabel text="Description">
            <textarea
              name="description"
              maxLength={400}
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
                defaultValue={dueDateDefaultValue}
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-sans text-sm text-slate-900 outline-none focus:border-sky-500"
              />
            </FormLabel>
          </div>

          {errorMessage ? (
            <p
              role="alert"
              aria-live="assertive"
              className="rounded-lg bg-rose-100 px-3 py-2 text-sm text-rose-700"
            >
              {errorMessage}
            </p>
          ) : null}

          {isCompleted === undefined ? null : (
            <div className="rounded-lg border border-slate-300 bg-slate-50 px-3 py-2">
              <input type="hidden" name="completed" value="false" />

              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-slate-700">Task Status</p>

                <label className="relative inline-flex h-7 w-14 cursor-pointer items-center">
                  <input
                    type="checkbox"
                    name="completed"
                    value="true"
                    defaultChecked={isCompleted}
                    disabled={isSubmitting}
                    className="peer sr-only"
                    aria-label="Toggle task completion"
                  />
                  <span className="h-7 w-14 rounded-full border border-slate-400 bg-slate-300 transition peer-checked:border-emerald-500 peer-checked:bg-emerald-500/90 peer-disabled:cursor-not-allowed peer-disabled:opacity-60" />
                  <span className="pointer-events-none absolute left-1 top-1 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 peer-checked:translate-x-7 peer-disabled:opacity-60" />
                </label>
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={isBusy}
              className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isBusy}
              className="flex-1 rounded-lg bg-sky-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:bg-sky-300"
            >
              {isSubmitting ? "Saving..." : submitLabel}
            </button>
            {isUpdateMode && onDelete && !showDeleteConfirm ? (
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                disabled={isBusy}
                className="inline-flex items-center justify-center rounded-md bg-slate-100 p-1 text-rose-600 transition hover:bg-rose-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Delete task"
              >
                <Trash2 size={18} />
              </button>
            ) : null}
          </div>
        </form>

        {showDeleteConfirm && isUpdateMode && onDelete ? (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-slate-950/45 p-4">
            <DeleteConfirmDialog
              description={`"${deleteTargetLabel}" will be permanently deleted.`}
              isPending={isDeleting}
              onCancel={() => setShowDeleteConfirm(false)}
              onConfirm={() => {
                onDelete();
                setShowDeleteConfirm(false);
              }}
            />
          </div>
        ) : null}
      </div>
    </div>,
    document.body
  );
}
