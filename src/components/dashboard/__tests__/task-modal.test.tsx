import { TaskModal } from "@/components/dashboard/task-modal";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const baseProps = {
  title: "Create Task",
  isOpen: true,
  isSubmitting: false,
  submitLabel: "Create Task",
  errorMessage: null,
  onClose: jest.fn(),
  onSubmit: jest.fn((e) => e.preventDefault()),
};

beforeEach(() => jest.clearAllMocks());

describe("TaskModal", () => {
  it("renders nothing when isOpen is false", () => {
    render(<TaskModal {...baseProps} isOpen={false} />);

    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
  });

  it("renders modal title and form when open", () => {
    render(<TaskModal {...baseProps} />);

    expect(screen.getByRole("heading", { name: "Create Task" })).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Task title")).toBeInTheDocument();
  });

  it("shows error message when errorMessage is set", () => {
    render(<TaskModal {...baseProps} errorMessage="Something went wrong" />);

    expect(screen.getByRole("alert")).toHaveTextContent("Something went wrong");
  });

  it("renders initial values in form fields", () => {
    render(
      <TaskModal
        {...baseProps}
        title="Edit Task"
        submitLabel="Save"
        initialValues={{
          title: "Read book",
          description: "Finish chapter 3",
          priority: "HIGH",
          dueDate: "2026-12-31",
        }}
      />
    );

    expect(screen.getByDisplayValue("Read book")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Finish chapter 3")).toBeInTheDocument();
  });

  it("calls onClose when Cancel button clicked and not busy", async () => {
    const user = userEvent.setup();
    render(<TaskModal {...baseProps} />);

    await user.click(screen.getByRole("button", { name: "Cancel" }));

    expect(baseProps.onClose).toHaveBeenCalledTimes(1);
  });

  it("blocks close when isSubmitting is true", () => {
    render(<TaskModal {...baseProps} isSubmitting />);

    fireEvent.click(screen.getByRole("button", { name: "Close task modal" }));

    expect(baseProps.onClose).not.toHaveBeenCalled();
  });

  it("shows save button as Saving... when isSubmitting", () => {
    render(<TaskModal {...baseProps} isSubmitting />);

    expect(screen.getByRole("button", { name: "Saving..." })).toBeInTheDocument();
  });

  it("shows delete icon button in update mode with onDelete", () => {
    render(
      <TaskModal
        {...baseProps}
        initialValues={{ title: "existing", dueDate: "2026-12-31" }}
        onDelete={jest.fn()}
      />
    );

    expect(screen.getByRole("button", { name: "Delete task" })).toBeInTheDocument();
  });

  it("shows delete confirm dialog on delete icon click, then calls onDelete on confirm", async () => {
    const user = userEvent.setup();
    const onDelete = jest.fn();

    render(
      <TaskModal
        {...baseProps}
        initialValues={{ title: "existing", dueDate: "2026-12-31" }}
        onDelete={onDelete}
      />
    );

    await user.click(screen.getByRole("button", { name: "Delete task" }));
    expect(screen.getByText("Delete this task?")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Delete" }));
    expect(onDelete).toHaveBeenCalledTimes(1);
  });

  it("shows task status toggle when isCompleted prop is provided", () => {
    render(
      <TaskModal
        {...baseProps}
        initialValues={{ title: "existing", dueDate: "2026-12-31" }}
        isCompleted={false}
      />
    );

    expect(screen.getByText("Task Status")).toBeInTheDocument();
    expect(screen.getByRole("checkbox", { name: "Toggle task completion" })).toBeInTheDocument();
  });
});
