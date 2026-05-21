import { CreateTaskButton } from "@/components/dashboard/create-task-button";
import { fireEvent, render, screen } from "@testing-library/react";

describe("CreateTaskButton", () => {
  it("renders Add Task label", () => {
    render(<CreateTaskButton />);

    expect(screen.getByRole("button", { name: /Add Task/i })).toBeInTheDocument();
  });

  it("calls onClick when clicked", () => {
    const onClick = jest.fn();
    render(<CreateTaskButton onClick={onClick} />);

    fireEvent.click(screen.getByRole("button", { name: /Add Task/i }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("renders without onClick (optional prop)", () => {
    render(<CreateTaskButton />);

    expect(screen.getByRole("button")).toBeInTheDocument();
  });
});
