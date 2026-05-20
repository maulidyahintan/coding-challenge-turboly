"use client";

import { TaskListSection } from "@/features/task/components/task-list-section";
import { TaskModal } from "@/features/task/components/task-modal";
import type { TaskItem, TaskSortOption } from "@/features/task/types";
import {
  filterTasksByQuery,
  isDueTodayDate,
  isOverdueDueDate,
  readTaskPayload,
  sortTasks,
  toDateInputValue,
  validateTaskPayload,
} from "@/features/task/utils";
import {
  useCompleteTaskMutation,
  useCreateTaskMutation,
  useDeleteTaskMutation,
  useUpdateTaskMutation,
} from "@/hooks/useTasksMutation";
import { useTasksContext } from "@/providers/TasksProvider";
import { SyntheticEvent, useEffect, useMemo, useState } from "react";

export function TaskManager() {
  const { tasks, isLoading, error, activeGrupTasks } = useTasksContext();
  const createMutation = useCreateTaskMutation();
  const updateMutation = useUpdateTaskMutation();
  const deleteMutation = useDeleteTaskMutation();
  const completeMutation = useCompleteTaskMutation();

  const [sortBy, setSortBy] = useState<TaskSortOption>("dueDate");
  const [titleFilter, setTitleFilter] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [taskBeingEdited, setTaskBeingEdited] = useState<TaskItem | null>(null);
  const [createErrorMessage, setCreateErrorMessage] = useState<string | null>(null);
  const [updateErrorMessage, setUpdateErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const legacyTrigger = document.getElementById("open-create-task-modal");
    const dataTriggers = Array.from(
      document.querySelectorAll<HTMLElement>("[data-open-create-task-modal='true']")
    );
    const triggerSet = new Set<HTMLElement>([
      ...dataTriggers,
      ...(legacyTrigger ? [legacyTrigger] : []),
    ]);
    const triggers = Array.from(triggerSet);

    if (triggers.length === 0) {
      return;
    }

    const openModal = () => setIsCreateModalOpen(true);
    triggers.forEach((trigger) => trigger.addEventListener("click", openModal));

    return () => {
      triggers.forEach((trigger) => trigger.removeEventListener("click", openModal));
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
      setUpdateErrorMessage(err instanceof Error ? err.message : "Failed to delete task.");
    }
  };

  const handleToggleComplete = async (task: TaskItem) => {
    try {
      await completeMutation.mutateAsync({ id: task.id, completed: !task.completed });
    } catch (err) {
      setUpdateErrorMessage(err instanceof Error ? err.message : "Failed to update task.");
    }
  };

  const groupedTasks = useMemo(() => {
    switch (activeGrupTasks) {
      case "dueToday":
        return tasks.filter((task) => !task.completed && isDueTodayDate(task.dueDate));
      case "overdue":
        return tasks.filter((task) => !task.completed && isOverdueDueDate(task.dueDate));
      case "open":
        return tasks.filter((task) => !task.completed);
      case "completed":
        return tasks.filter((task) => task.completed);
      case "all":
      default:
        return tasks;
    }
  }, [tasks, activeGrupTasks]);

  const sectionTitle = useMemo(() => {
    switch (activeGrupTasks) {
      case "dueToday":
        return "Due Today Tasks";
      case "overdue":
        return "Overdue Tasks";
      case "open":
        return "Open Tasks";
      case "completed":
        return "Completed Tasks";
      case "all":
      default:
        return "All Tasks";
    }
  }, [activeGrupTasks]);

  const filteredTasks = useMemo(
    () => filterTasksByQuery(groupedTasks, titleFilter),
    [groupedTasks, titleFilter]
  );

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
        onDelete={
          taskBeingEdited
            ? () => {
                handleDelete(taskBeingEdited);
                setTaskBeingEdited(null);
              }
            : undefined
        }
        isDeleting={deleteMutation.isPending}
      />

      <TaskListSection
        title={sectionTitle}
        tasks={displayedTasks}
        isLoading={isLoading}
        errorMessage={error?.message ?? null}
        sortBy={sortBy}
        titleFilter={titleFilter}
        deletingTaskId={deleteMutation.isPending ? "pending" : null}
        completingTaskId={completeMutation.isPending ? "pending" : null}
        onSortChange={setSortBy}
        onTitleFilterChange={setTitleFilter}
        onEditTask={(task) => {
          setUpdateErrorMessage(null);
          setTaskBeingEdited(task);
        }}
        onDeleteTask={handleDelete}
        onToggleCompleteTask={handleToggleComplete}
      />
    </>
  );
}
