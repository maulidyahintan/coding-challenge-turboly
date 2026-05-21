import { TaskListSection } from "@/components/dashboard/task/task-list-section";
import type { TaskItem } from "@/components/dashboard/task/types";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

function makeTask(overrides: Partial<TaskItem> = {}): TaskItem {
  return {
    id: "t1",
    title: "default task",
    description: "desc",
    priority: "MEDIUM",
    dueDate: "2099-12-31T00:00:00.000Z",
    completed: false,
    createdAt: "2026-01-01T00:00:00.000Z",
    ...overrides,
  };
}

const defaultProps = {
  title: "Open Tasks",
  tasks: [makeTask({ id: "t1", title: "first task" }), makeTask({ id: "t2", title: "second task" })],
  isLoading: false,
  errorMessage: null,
  sortBy: "dueDate" as const,
  titleFilter: "",
  deletingTaskId: null,
  completingTaskId: null,
  onSortChange: jest.fn(),
  onTitleFilterChange: jest.fn(),
  onEditTask: jest.fn(),
  onDeleteTask: jest.fn(),
  onToggleCompleteTask: jest.fn(),
};

beforeEach(() => jest.clearAllMocks());

describe("TaskListSection", () => {
  it("renders section title and task list", () => {
    render(<TaskListSection {...defaultProps} />);

    expect(screen.getByText("Open Tasks")).toBeInTheDocument();
    expect(screen.getByText("first task")).toBeInTheDocument();
    expect(screen.getByText("second task")).toBeInTheDocument();
  });

  it("shows loading message when isLoading is true", () => {
    render(<TaskListSection {...defaultProps} tasks={[]} isLoading />);

    expect(screen.getByText("Loading tasks...")).toBeInTheDocument();
  });

  it("shows empty message when no tasks and not loading", () => {
    render(<TaskListSection {...defaultProps} tasks={[]} />);

    expect(screen.getByText(/No task yet/)).toBeInTheDocument();
  });

  it("shows error message when errorMessage is set", () => {
    render(<TaskListSection {...defaultProps} errorMessage="Network error" />);

    expect(screen.getByText("Network error")).toBeInTheDocument();
  });

  it("calls onTitleFilterChange when user types in search input", async () => {
    const user = userEvent.setup();
    render(<TaskListSection {...defaultProps} />);

    await user.type(screen.getByPlaceholderText(/Search by title/i), "abc");

    expect(defaultProps.onTitleFilterChange).toHaveBeenCalled();
  });

  it("calls onSortChange when sort select changes", async () => {
    const user = userEvent.setup();
    render(<TaskListSection {...defaultProps} />);

    await user.selectOptions(screen.getByRole("combobox", { name: "Sort tasks" }), "title");

    expect(defaultProps.onSortChange).toHaveBeenCalledWith("title");
  });

  it("shows delete confirm dialog and calls onDeleteTask on confirm", async () => {
    const user = userEvent.setup();
    render(<TaskListSection {...defaultProps} />);

    // Click delete button on the first task
    const deleteButtons = screen.getAllByRole("button", { name: "Delete task" });
    await user.click(deleteButtons[0]);

    // Dialog should appear
    expect(screen.getByText("Delete this task?")).toBeInTheDocument();

    // Confirm delete
    await user.click(screen.getByRole("button", { name: "Delete" }));

    expect(defaultProps.onDeleteTask).toHaveBeenCalledTimes(1);
  });

  it("cancels delete confirm dialog without calling onDeleteTask", async () => {
    const user = userEvent.setup();
    render(<TaskListSection {...defaultProps} />);

    const deleteButtons = screen.getAllByRole("button", { name: "Delete task" });
    await user.click(deleteButtons[0]);

    await user.click(screen.getByRole("button", { name: "Cancel" }));

    expect(screen.queryByText("Delete this task?")).not.toBeInTheDocument();
    expect(defaultProps.onDeleteTask).not.toHaveBeenCalled();
  });

  it("calls onToggleCompleteTask when toggle button clicked", () => {
    render(<TaskListSection {...defaultProps} />);

    fireEvent.click(screen.getAllByRole("button", { name: "Mark as completed" })[0]);

    expect(defaultProps.onToggleCompleteTask).toHaveBeenCalledTimes(1);
  });

  it("calls onEditTask when edit button clicked", () => {
    render(<TaskListSection {...defaultProps} />);

    fireEvent.click(screen.getAllByRole("button", { name: "Edit task" })[0]);

    expect(defaultProps.onEditTask).toHaveBeenCalledTimes(1);
  });
});
