import { TaskAlertSquare } from "@/components/dashboard/task/task-alert-square";
import { fireEvent, render, screen } from "@testing-library/react";

describe("TaskAlertSquare", () => {
  it("renders the count and label for each tone", () => {
    render(<TaskAlertSquare count={7} tone="overdue" isActive={false} onClick={jest.fn()} />);

    expect(screen.getByText("7")).toBeInTheDocument();
    expect(screen.getByText("Overdue")).toBeInTheDocument();
  });

  it("uses the tone CSS variable as background", () => {
    render(<TaskAlertSquare count={1} tone="open" isActive={false} onClick={jest.fn()} />);

    expect(screen.getByRole("button")).toHaveStyle({
      backgroundColor: "var(--task-alert-open)",
    });
  });

  it("fires onClick handler", () => {
    const onClick = jest.fn();
    render(<TaskAlertSquare count={0} tone="all" isActive={false} onClick={onClick} />);

    fireEvent.click(screen.getByRole("button"));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("sets aria-pressed to true when active", () => {
    render(<TaskAlertSquare count={2} tone="completed" isActive onClick={jest.fn()} />);

    expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "true");
  });

  it("applies active ring class when isActive", () => {
    render(<TaskAlertSquare count={2} tone="dueToday" isActive onClick={jest.fn()} />);

    expect(screen.getByRole("button")).toHaveClass("ring-2");
  });

  it("applies active ring when forceActiveStyle even when not active", () => {
    render(
      <TaskAlertSquare count={2} tone="dueToday" isActive={false} forceActiveStyle onClick={jest.fn()} />
    );

    expect(screen.getByRole("button")).toHaveClass("ring-2");
  });

  it("hides View when active and alwaysShowView is false", () => {
    render(
      <TaskAlertSquare count={1} tone="all" isActive onClick={jest.fn()} alwaysShowView={false} />
    );

    expect(screen.queryByText("View")).not.toBeInTheDocument();
  });

  it("shows View when active and alwaysShowView is true", () => {
    render(
      <TaskAlertSquare count={1} tone="all" isActive onClick={jest.fn()} alwaysShowView />
    );

    expect(screen.getByText("View")).toBeInTheDocument();
  });

  it("fillWidth applies w-full class", () => {
    render(
      <TaskAlertSquare count={1} tone="all" isActive={false} onClick={jest.fn()} fillWidth />
    );

    expect(screen.getByRole("button")).toHaveClass("w-full");
  });
});
