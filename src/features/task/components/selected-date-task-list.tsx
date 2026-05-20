"use client";

import { TaskModal } from "@/features/task/components/task-modal";
import type { TaskItem } from "@/features/task/types";
import { readTaskPayload, toDateInputValue, validateTaskPayload } from "@/features/task/utils";
import { useUpdateTaskMutation } from "@/hooks/useTasksMutation";
import { useTasksContext } from "@/providers/TasksProvider";
import { SyntheticEvent, useMemo, useState } from "react";

type SelectedDateTaskListProps = Readonly<{
  selectedDate: Date | undefined;
}>;

const priorityArticleClassName: Record<TaskItem["priority"], string> = {
  LOW: "border-emerald-200 bg-emerald-50 text-emerald-950",
  MEDIUM: "border-amber-200 bg-amber-50 text-amber-950",
  HIGH: "border-rose-200 bg-rose-50 text-rose-950",
};

const priorityDetailButtonClassName: Record<TaskItem["priority"], string> = {
  LOW: "border-emerald-200/60 bg-emerald-100/60 text-emerald-900 hover:bg-emerald-100",
  MEDIUM: "border-amber-200/60 bg-amber-100/60 text-amber-900 hover:bg-amber-100",
  HIGH: "border-rose-200/60 bg-rose-100/60 text-rose-900 hover:bg-rose-100",
};

function isSameDate(dateText: string, target: Date): boolean {
  const date = new Date(dateText);
  return (
    date.getFullYear() === target.getFullYear() &&
    date.getMonth() === target.getMonth() &&
    date.getDate() === target.getDate()
  );
}

function formatSelectedDateLabel(date: Date | undefined): string {
  if (!date) {
    return "No date selected";
  }

  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function SelectedDateTaskList({ selectedDate }: SelectedDateTaskListProps) {
  const { tasks, isLoading, error } = useTasksContext();
  const updateMutation = useUpdateTaskMutation();
  const [updateErrorMessage, setUpdateErrorMessage] = useState<string | null>(null);
  const [taskBeingEdited, setTaskBeingEdited] = useState<TaskItem | null>(null);

  const dateTasks = useMemo(() => {
    if (!selectedDate) {
      return [];
    }

    return tasks.filter((task) => isSameDate(task.dueDate, selectedDate));
  }, [selectedDate, tasks]);

  const handleUpdate = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!taskBeingEdited) {
      return;
    }

    setUpdateErrorMessage(null);

    const form = event.currentTarget;
    const payload = readTaskPayload(new FormData(form));
    const validationError = validateTaskPayload(payload);

    if (validationError) {
      setUpdateErrorMessage(validationError);
      return;
    }

    try {
      await updateMutation.mutateAsync({ id: taskBeingEdited.id, payload });
      setTaskBeingEdited(null);
    } catch (err) {
      setUpdateErrorMessage(err instanceof Error ? err.message : "Failed to update task.");
    }
  };

  return (
    <>
      <TaskModal
        title="Update Task"
        isOpen={Boolean(taskBeingEdited)}
        isSubmitting={updateMutation.isPending}
        isCompleted={taskBeingEdited?.completed}
        submitLabel="Save Changes"
        errorMessage={updateErrorMessage}
        initialValues={
          taskBeingEdited
            ? {
                title: taskBeingEdited.title,
                description: taskBeingEdited.description,
                priority: taskBeingEdited.priority,
                dueDate: toDateInputValue(taskBeingEdited.dueDate),
              }
            : undefined
        }
        onClose={() => {
          setUpdateErrorMessage(null);
          setTaskBeingEdited(null);
        }}
        onSubmit={handleUpdate}
      />

      <div className="flex min-h-0 flex-1 flex-col border-t border-sky-300/30 bg-white p-3 text-sky-50">
        <p className="mb-2 px-2 text-sm font-semibold uppercase tracking-[0.08em] text-sky-700">
          {formatSelectedDateLabel(selectedDate)} ({dateTasks.length})
        </p>

        <div className="min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
          {isLoading ? (
            <p className="rounded-md bg-white/90 px-3 py-2 text-sm text-slate-700">Loading...</p>
          ) : null}

          {error ? (
            <p className="rounded-md bg-rose-100 px-3 py-2 text-sm text-rose-700">
              {error.message}
            </p>
          ) : null}

          {!isLoading && !error && dateTasks.length === 0 ? (
            <p className="rounded-md bg-white/90 px-3 py-2 text-sm text-slate-700">
              No task on this date.
            </p>
          ) : null}

          {!isLoading &&
            !error &&
            dateTasks.map((task) => (
              <article
                key={task.id}
                className={`rounded-lg border p-3 ${priorityArticleClassName[task.priority]}`}
              >
                <div className="flex justify-between gap-2 items-center">
                  <p className="text-sm flex-1 truncate font-semibold">{task.title}</p>
                  <button
                    type="button"
                    onClick={() => setTaskBeingEdited(task)}
                    className={`rounded-md border px-2 py-1 text-xs font-semibold transition ${priorityDetailButtonClassName[task.priority]}`}
                  >
                    Detail
                  </button>
                </div>
                {task.description ? (
                  <p className="mt-1 truncate text-xs opacity-80">{task.description}</p>
                ) : null}
              </article>
            ))}
        </div>
      </div>
    </>
  );
}
