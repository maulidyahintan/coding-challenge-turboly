"use client";

import {
  readTaskPayload,
  toDateInputValue,
  validateTaskPayload,
} from "@/components/dashboard/task";
import {
  useCreateTaskMutation,
  useDeleteTaskMutation,
  useUpdateTaskMutation,
} from "@/hooks/useTasksMutation";
import { useTasksContext } from "@/providers/TasksProvider";
import { SyntheticEvent } from "react";
import { TaskModal } from "./task-modal";

export function TaskModalContainer() {
  const {
    isTaskModalOpen,
    taskModalMode,
    taskModalTask,
    taskModalError,
    closeTaskModal,
    setTaskModalError,
  } = useTasksContext();
  const createMutation = useCreateTaskMutation();
  const updateMutation = useUpdateTaskMutation();
  const deleteMutation = useDeleteTaskMutation();

  const isCreateMode = taskModalMode === "create";

  const handleSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    setTaskModalError(null);

    const form = event.currentTarget;
    const payload = readTaskPayload(new FormData(form));
    const validationError = validateTaskPayload(payload);

    if (validationError) {
      setTaskModalError(validationError);
      return;
    }

    try {
      if (isCreateMode) {
        await createMutation.mutateAsync(payload);
      } else if (taskModalTask) {
        await updateMutation.mutateAsync({ id: taskModalTask.id, payload });
      }
      closeTaskModal();
      form.reset();
    } catch (err) {
      setTaskModalError(err instanceof Error ? err.message : "Failed to save task.");
    }
  };

  const handleDelete =
    isCreateMode || !taskModalTask
      ? undefined
      : async () => {
          try {
            await deleteMutation.mutateAsync(taskModalTask.id);
            closeTaskModal();
          } catch (err) {
            setTaskModalError(err instanceof Error ? err.message : "Failed to delete task.");
          }
        };

  return (
    <TaskModal
      title={isCreateMode ? "Create Task" : "Update Task"}
      isOpen={isTaskModalOpen}
      isSubmitting={isCreateMode ? createMutation.isPending : updateMutation.isPending}
      submitLabel={isCreateMode ? "Create Task" : "Save Changes"}
      errorMessage={taskModalError ?? null}
      initialValues={
        taskModalTask
          ? {
              title: taskModalTask.title,
              description: taskModalTask.description,
              priority: taskModalTask.priority,
              dueDate: toDateInputValue(taskModalTask.dueDate),
            }
          : undefined
      }
      isCompleted={taskModalTask?.completed}
      onClose={closeTaskModal}
      onSubmit={handleSubmit}
      onDelete={handleDelete}
      isDeleting={deleteMutation.isPending}
    />
  );
}
