"use client";

import { DataStateMessage } from "@/components/ui";
import { ArrowUpDown } from "lucide-react";
import { useId, useState } from "react";
import { DeleteConfirmDialog } from "../delete-confirm-dialog";
import { TaskCard } from "./task-card";
import { TaskItem, TaskSortOption } from "./types";

type TaskListSectionProps = Readonly<{
  title: string;
  tasks: TaskItem[];
  isLoading: boolean;
  errorMessage: string | null;
  sortBy: TaskSortOption;
  titleFilter: string;
  deletingTaskId: string | null;
  completingTaskId: string | null;
  onSortChange: (sortBy: TaskSortOption) => void;
  onTitleFilterChange: (query: string) => void;
  onEditTask: (task: TaskItem) => void;
  onDeleteTask: (task: TaskItem) => void;
  onToggleCompleteTask: (task: TaskItem) => void;
}>;

export function TaskListSection({
  title,
  tasks,
  isLoading,
  errorMessage,
  sortBy,
  titleFilter,
  deletingTaskId,
  completingTaskId,
  onSortChange,
  onTitleFilterChange,
  onEditTask,
  onDeleteTask,
  onToggleCompleteTask,
}: TaskListSectionProps) {
  const [taskPendingDelete, setTaskPendingDelete] = useState<TaskItem | null>(null);
  const id = useId();
  const filterInputId = `${id}-task-title-filter`;
  const sortSelectId = `${id}-task-sort-select`;

  const handleConfirmDelete = () => {
    if (!taskPendingDelete) {
      return;
    }

    onDeleteTask(taskPendingDelete);
    setTaskPendingDelete(null);
  };

  return (
    <div className="flex-1 overflow-hidden font-sans">
      <section className="relative flex h-full min-h-0 flex-col overflow-hidden md:rounded-xl md:bg-sky-950/45 md:p-4">
        <div className="mb-3 flex items-center justify-between gap-2 md:gap-3">
          <h2 className="text-mc font-bold uppercase tracking-[0.12em] text-white">{title}</h2>
          <div className="flex flex-wrap items-center gap-2">
            <label
              className="sr-only md:not-sr-only md:text-xs md:font-medium md:text-sky-100/75"
              htmlFor={filterInputId}
            >
              Search
            </label>
            <input
              id={filterInputId}
              value={titleFilter}
              onChange={(event) => onTitleFilterChange(event.target.value)}
              placeholder="Search by title or desc..."
              className="h-8 w-32 rounded-md border border-sky-100/20 bg-sky-900/70 px-2 text-xs font-medium text-sky-50 outline-none placeholder:text-sky-200/50 focus:border-sky-300 sm:w-40"
            />
            <label
              className="sr-only md:not-sr-only md:text-xs md:font-medium md:text-sky-100/75"
              htmlFor={sortSelectId}
            >
              Sort
            </label>
            <div className="relative h-8 w-8 md:h-auto md:w-auto">
              <ArrowUpDown
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 text-sky-100/75 md:left-2 md:translate-x-0"
              />
              <select
                id={sortSelectId}
                aria-label="Sort tasks"
                value={sortBy}
                onChange={(event) => onSortChange(event.target.value as TaskSortOption)}
                className="h-8 w-8 cursor-pointer appearance-none rounded-md border border-sky-100/20 bg-sky-900/70 p-0 text-transparent outline-none focus:border-sky-300 md:h-auto md:w-auto md:py-1 md:pl-7 md:pr-2 md:text-xs md:font-medium md:text-sky-50"
              >
                <option value="dueDate">Due date</option>
                <option value="title">Title</option>
                <option value="description">Description</option>
                <option value="priority">Priority</option>
              </select>
            </div>
          </div>
        </div>

        {errorMessage ? (
          <DataStateMessage kind="error" message={errorMessage} className="mb-3 rounded-lg" />
        ) : null}

        <p className="sr-only" role="status" aria-live="polite">
          {isLoading ? "Loading task list" : `${tasks.length} task items shown`}
        </p>

        <div className="min-h-0 flex-1 space-y-2 overflow-y-auto pr-1" aria-busy={isLoading}>
          {isLoading ? (
            <DataStateMessage kind="loading" message="Loading tasks..." className="rounded-lg" />
          ) : null}

          {!isLoading && tasks.length === 0 ? (
            <DataStateMessage
              kind="empty"
              message="No task yet. Create your first task."
              className="rounded-lg"
            />
          ) : null}

          {isLoading
            ? null
            : tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={onEditTask}
                  onDelete={(selectedTask) => setTaskPendingDelete(selectedTask)}
                  onToggleComplete={onToggleCompleteTask}
                  isDeleting={deletingTaskId === task.id}
                  isCompleting={completingTaskId === task.id}
                />
              ))}
        </div>

        {taskPendingDelete ? (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-slate-950/45 p-4">
            <DeleteConfirmDialog
              description={`"${taskPendingDelete.title}" will be permanently deleted.`}
              isPending={Boolean(deletingTaskId)}
              onCancel={() => setTaskPendingDelete(null)}
              onConfirm={handleConfirmDelete}
            />
          </div>
        ) : null}
      </section>
    </div>
  );
}
