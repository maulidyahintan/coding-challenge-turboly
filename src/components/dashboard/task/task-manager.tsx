"use client";

import { useCompleteTaskMutation, useDeleteTaskMutation } from "@/hooks/useTasksMutation";
import { useTasksContext } from "@/providers/TasksProvider";
import { useMemo, useState } from "react";
import { TaskListSection } from "./task-list-section";
import { TaskItem, TaskSortOption } from "./types";
import { filterTasksByQuery, isDueTodayDate, isOverdueDueDate, sortTasks } from "./utils";

export function TaskManager() {
  const { tasks, isLoading, error, activeGrupTasks, openTaskModalEdit } = useTasksContext();
  const deleteMutation = useDeleteTaskMutation();
  const completeMutation = useCompleteTaskMutation();

  const [sortBy, setSortBy] = useState<TaskSortOption>("dueDate");
  const [titleFilter, setTitleFilter] = useState("");
  const [updateErrorMessage, setUpdateErrorMessage] = useState<string | null>(null);

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
          openTaskModalEdit(task);
        }}
        onDeleteTask={handleDelete}
        onToggleCompleteTask={handleToggleComplete}
      />
    </>
  );
}
