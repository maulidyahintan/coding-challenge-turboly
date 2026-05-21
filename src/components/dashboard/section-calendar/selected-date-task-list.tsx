"use client";

import { PreviewTaskCard } from "@/components/dashboard/section-calendar/preview-task-card";
import { DataStateMessage } from "@/components/ui";
import { useTasksContext } from "@/providers/TasksProvider";
import { useMemo } from "react";

type SelectedDateTaskListProps = Readonly<{
  selectedDate: Date | undefined;
  isMobileView?: boolean;
}>;

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

export function SelectedDateTaskList({
  selectedDate,
  isMobileView = false,
}: SelectedDateTaskListProps) {
  const { tasks, isLoading, error, openTaskModalEdit } = useTasksContext();

  const dateTasks = useMemo(() => {
    if (!selectedDate) {
      return [];
    }

    return tasks.filter((task) => isSameDate(task.dueDate, selectedDate));
  }, [selectedDate, tasks]);

  return (
    <>
      <div
        className={`flex w-full min-w-0 flex-col min-h-0 flex-1 ${
          isMobileView ? "" : "bg-white p-3 border-t border-sky-300/30"
        }`}
      >
        <p
          className={`mb-2 text-sm font-semibold uppercase tracking-[0.08em] ${
            isMobileView ? "text-white" : "px-2 text-sky-700"
          }`}
        >
          {formatSelectedDateLabel(selectedDate)} ({dateTasks.length})
        </p>

        <div
          className="min-h-0 w-full min-w-0 flex-1 space-y-2 overflow-y-auto overflow-x-hidden pr-1"
          aria-busy={isLoading}
        >
          {isLoading ? <DataStateMessage kind="loading" message="Loading tasks..." /> : null}

          {error ? <DataStateMessage kind="error" message={error.message} /> : null}

          {!isLoading && !error && dateTasks.length === 0 ? (
            <DataStateMessage kind="empty" message="No task on this date." />
          ) : null}

          {!isLoading &&
            !error &&
            dateTasks.map((task) => (
              <PreviewTaskCard key={task.id} task={task} onDetail={() => openTaskModalEdit(task)} />
            ))}
        </div>
      </div>
    </>
  );
}
