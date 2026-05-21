import { TaskCard } from "@/components/dashboard/task/task-card";
import type { TaskItem } from "@/components/dashboard/task/types";
import { fireEvent, render, screen } from "@testing-library/react";

function makeTask(overrides: Partial<TaskItem> = {}): TaskItem {
  return {
    id: "task-1",
    title: "ship feature",
    description: "do the thing",
    priority: "MEDIUM",
    dueDate: "2000-01-01T00:00:00.000Z", // guaranteed overdue
    completed: false,
    createdAt: "2000-01-01T00:00:00.000Z",
    ...overrides,
  };
}

describe("TaskCard", () => {
  it("renders title, description, and priority badge", () => {
    render(
      <TaskCard
        task={makeTask()}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
        onToggleComplete={jest.fn()}
        isDeleting={false}
        isCompleting={false}
      />
    );

    expect(screen.getByText("ship feature")).toBeInTheDocument();
    expect(screen.getByText("do the thing")).toBeInTheDocument();
    expect(screen.getByText("MEDIUM")).toBeInTheDocument();
  });

  it("renders overdue indicator for past incomplete tasks", () => {
    const { container } = render(
      <TaskCard
        task={makeTask()}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
        onToggleComplete={jest.fn()}
        isDeleting={false}
        isCompleting={false}
      />
    );

    expect(container.firstChild).toHaveClass("bg-red-50");
    expect(screen.getByText(/\(Overdue\)/)).toBeInTheDocument();
  });

  it("does not render overdue indicator for completed tasks", () => {
    const { container } = render(
      <TaskCard
        task={makeTask({ completed: true })}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
        onToggleComplete={jest.fn()}
        isDeleting={false}
        isCompleting={false}
      />
    );

    expect(container.firstChild).not.toHaveClass("bg-red-50");
    expect(screen.queryByText(/\(Overdue\)/)).not.toBeInTheDocument();
  });

  it("calls onEdit with task when edit button clicked", () => {
    const onEdit = jest.fn();
    const task = makeTask();

    render(
      <TaskCard
        task={task}
        onEdit={onEdit}
        onDelete={jest.fn()}
        onToggleComplete={jest.fn()}
        isDeleting={false}
        isCompleting={false}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Edit task" }));

    expect(onEdit).toHaveBeenCalledWith(task);
  });

  it("calls onDelete with task when delete button clicked", () => {
    const onDelete = jest.fn();
    const task = makeTask();

    render(
      <TaskCard
        task={task}
        onEdit={jest.fn()}
        onDelete={onDelete}
        onToggleComplete={jest.fn()}
        isDeleting={false}
        isCompleting={false}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Delete task" }));

    expect(onDelete).toHaveBeenCalledWith(task);
  });

  it("calls onToggleComplete with task when toggle button clicked", () => {
    const onToggleComplete = jest.fn();
    const task = makeTask();

    render(
      <TaskCard
        task={task}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
        onToggleComplete={onToggleComplete}
        isDeleting={false}
        isCompleting={false}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Mark as completed" }));

    expect(onToggleComplete).toHaveBeenCalledWith(task);
  });

  it("disables all action buttons when isDeleting is true", () => {
    render(
      <TaskCard
        task={makeTask()}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
        onToggleComplete={jest.fn()}
        isDeleting
        isCompleting={false}
      />
    );

    expect(screen.getByRole("button", { name: "Edit task" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Delete task" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Mark as completed" })).toBeDisabled();
  });

  it("disables all action buttons when isCompleting is true", () => {
    render(
      <TaskCard
        task={makeTask()}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
        onToggleComplete={jest.fn()}
        isDeleting={false}
        isCompleting
      />
    );

    expect(screen.getByRole("button", { name: "Edit task" })).toBeDisabled();
  });

  it("shows Mark as incomplete label for completed task", () => {
    render(
      <TaskCard
        task={makeTask({ completed: true })}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
        onToggleComplete={jest.fn()}
        isDeleting={false}
        isCompleting={false}
      />
    );

    expect(
      screen.getByRole("button", { name: "Mark as incomplete" })
    ).toBeInTheDocument();
  });
});
