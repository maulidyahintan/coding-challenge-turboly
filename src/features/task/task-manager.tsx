"use client";

import { SyntheticEvent, useEffect, useMemo, useState } from "react";
import { TaskListSection } from "@/features/task/components/task-list-section";
import { TaskModal } from "@/features/task/components/task-modal";
import { TaskItem } from "@/features/task/types";
import { readTaskPayload, toDateInputValue, validateTaskPayload } from "@/features/task/utils";

export function TaskManager() {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [createErrorMessage, setCreateErrorMessage] = useState<string | null>(null);
  const [updateErrorMessage, setUpdateErrorMessage] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [taskBeingEdited, setTaskBeingEdited] = useState<TaskItem | null>(null);

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
    const payload = readTaskPayload(new FormData(form));
    const validationError = validateTaskPayload(payload);

    if (validationError) {
      setCreateErrorMessage(validationError);
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

  const handleUpdate = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!taskBeingEdited) {
      return;
    }

    setUpdateErrorMessage(null);
    setIsUpdating(true);

    const form = event.currentTarget;
    const payload = readTaskPayload(new FormData(form));
    const validationError = validateTaskPayload(payload);

    if (validationError) {
      setUpdateErrorMessage(validationError);
      setIsUpdating(false);
      return;
    }

    const response = await fetch(`/api/tasks/${taskBeingEdited.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = (await response.json().catch(() => null)) as
      | { task?: TaskItem; message?: string }
      | null;

    if (!response.ok || !result?.task) {
      setUpdateErrorMessage(result?.message ?? "Failed to update task.");
      setIsUpdating(false);
      return;
    }

    setTasks((prev) =>
      prev.map((task) => (task.id === result.task?.id ? result.task : task))
    );
    setTaskBeingEdited(null);
    setIsUpdating(false);
  };

  return (
    <>
      <TaskModal
        title="Create Task"
        isOpen={isCreateModalOpen}
        isSubmitting={isCreating}
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
        isSubmitting={isUpdating}
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
        tasks={tasks}
        isLoading={isLoading}
        errorMessage={errorMessage}
        totalOpenTasks={totalOpenTasks}
        onEditTask={(task) => {
          setUpdateErrorMessage(null);
          setTaskBeingEdited(task);
        }}
      />
    </>
  );
}
