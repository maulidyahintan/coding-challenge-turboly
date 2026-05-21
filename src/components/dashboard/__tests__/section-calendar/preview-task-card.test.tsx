import { PreviewTaskCard } from "@/components/dashboard/section-calendar/preview-task-card";
import type { TaskItem } from "@/components/dashboard/task/types";
import { fireEvent, render, screen } from "@testing-library/react";

function makeTask(overrides: Partial<TaskItem> = {}): TaskItem {
  return {
    id: "t1",
    title: "read the docs",
    description: "important",
    priority: "HIGH",
    dueDate: "2099-01-01T00:00:00.000Z",
    completed: false,
    createdAt: "2026-01-01T00:00:00.000Z",
    ...overrides,
  };
}

describe("PreviewTaskCard", () => {
  it("renders task title", () => {
    render(<PreviewTaskCard task={makeTask()} onDetail={jest.fn()} />);

    expect(screen.getByText("read the docs")).toBeInTheDocument();
  });

  it("renders task description when present", () => {
    render(<PreviewTaskCard task={makeTask()} onDetail={jest.fn()} />);

    expect(screen.getByText("important")).toBeInTheDocument();
  });

  it("does not render description paragraph when description is null", () => {
    render(<PreviewTaskCard task={makeTask({ description: null })} onDetail={jest.fn()} />);

    expect(screen.queryByText("important")).not.toBeInTheDocument();
  });

  it("calls onDetail when Detail button is clicked", () => {
    const onDetail = jest.fn();
    render(<PreviewTaskCard task={makeTask()} onDetail={onDetail} />);

    fireEvent.click(screen.getByRole("button", { name: /Detail/i }));

    expect(onDetail).toHaveBeenCalledTimes(1);
  });

  it.each([
    ["HIGH", "bg-rose-50"],
    ["MEDIUM", "bg-yellow-50"],
    ["LOW", "bg-emerald-50"],
  ] as const)("applies correct priority style for %s", (priority, expectedClass) => {
    const { container } = render(
      <PreviewTaskCard task={makeTask({ priority })} onDetail={jest.fn()} />
    );

    expect(container.firstChild).toHaveClass(expectedClass);
  });
});
