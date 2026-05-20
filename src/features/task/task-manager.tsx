"use client";

import { TaskListSection } from "@/features/task/components/task-list-section";
import { TaskModal } from "@/features/task/components/task-modal";
import type { TaskItem, TaskSortOption } from "@/features/task/types";
import {
  filterTasksByQuery,
  readTaskPayload,
  sortTasks,
  toDateInputValue,
  validateTaskPayload,
} from "@/features/task/utils";
import {
  useCreateTaskMutation,
  useDeleteTaskMutation,
  useUpdateTaskMutation,
} from "@/hooks/useTasksMutation";
import { useTasksContext } from "@/providers/TasksProvider";
import { SyntheticEvent, useEffect, useMemo, useState } from "react";

export function TaskManager() {
  const { tasks, isLoading, error } = useTasksContext();
  const createMutation = useCreateTaskMutation();
  const updateMutation = useUpdateTaskMutation();
  const deleteMutation = useDeleteTaskMutation();

  const [sortBy, setSortBy] = useState<TaskSortOption>("dueDate");
  const [titleFilter, setTitleFilter] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [taskBeingEdited, setTaskBeingEdited] = useState<TaskItem | null>(null);
  const [createErrorMessage, setCreateErrorMessage] = useState<string | null>(null);
  const [updateErrorMessage, setUpdateErrorMessage] = useState<string | null>(null);

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

    const form = event.currentTarget;
    const payload = readTaskPayload(new FormData(form));
    const validationError = validateTaskPayload(payload);

    if (validationError) {
      setCreateErrorMessage(validationError);
      return;
    }

    try {
      await createMutation.mutateAsync(payload);
      form.reset();
      setIsCreateModalOpen(false);
    } catch (err) {
      setCreateErrorMessage(err instanceof Error ? err.message : "Failed to create task.");
    }
  };

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

  const handleDelete = async (task: TaskItem) => {
    try {
      await deleteMutation.mutateAsync(task.id);
    } catch (err) {
      console.error(err);
    }
  };

  const totalOpenTasks = useMemo(() => tasks.filter((task) => !task.completed).length, [tasks]);

  const filteredTasks = useMemo(() => filterTasksByQuery(tasks, titleFilter), [tasks, titleFilter]);

  const displayedTasks = useMemo(() => sortTasks(filteredTasks, sortBy), [filteredTasks, sortBy]);

  return (
    <>
      <TaskModal
        title="Create Task"
        isOpen={isCreateModalOpen}
        isSubmitting={createMutation.isPending}
        submitLabel="Create Task"
        errorMessage={createErrorMessage}
        onClose={() => {
          setCreateErrorMessage(null);
          setIsCreateModalOpen(false);
        }}
        onSubmit={handleCreate}
      />

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

      <TaskListSection
        tasks={displayedTasks}
        isLoading={isLoading}
        errorMessage={error?.message ?? null}
        totalOpenTasks={totalOpenTasks}
        sortBy={sortBy}
        titleFilter={titleFilter}
        deletingTaskId={deleteMutation.isPending ? "pending" : null}
        completingTaskId={null}
        onSortChange={setSortBy}
        onTitleFilterChange={setTitleFilter}
        onEditTask={(task) => {
          setUpdateErrorMessage(null);
          setTaskBeingEdited(task);
        }}
        onDeleteTask={handleDelete}
        onToggleCompleteTask={() => {}}
      />
    </>
  );
}
