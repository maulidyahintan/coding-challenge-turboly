import { TaskModalContainer } from "@/components/dashboard/task-modal-container";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const mockCloseTaskModal = jest.fn();
const mockSetTaskModalError = jest.fn();
const mockCreateMutateAsync = jest.fn();
const mockUpdateMutateAsync = jest.fn();
const mockDeleteMutateAsync = jest.fn();

jest.mock("@/providers/TasksProvider", () => ({
  useTasksContext: () => ({
    isTaskModalOpen: true,
    taskModalMode: "create",
    taskModalTask: null,
    taskModalError: null,
    closeTaskModal: mockCloseTaskModal,
    setTaskModalError: mockSetTaskModalError,
  }),
}));

jest.mock("@/hooks/useTasksMutation", () => ({
  useCreateTaskMutation: () => ({
    mutateAsync: mockCreateMutateAsync,
    isPending: false,
  }),
  useUpdateTaskMutation: () => ({
    mutateAsync: mockUpdateMutateAsync,
    isPending: false,
  }),
  useDeleteTaskMutation: () => ({
    mutateAsync: mockDeleteMutateAsync,
    isPending: false,
  }),
}));

beforeEach(() => jest.clearAllMocks());

describe("TaskModalContainer", () => {
  it("renders Create Task modal when mode is create and modal is open", () => {
    render(<TaskModalContainer />);

    expect(screen.getByRole("heading", { name: "Create Task" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Create Task" })).toBeInTheDocument();
  });

  it("calls closeTaskModal when Cancel is clicked", async () => {
    const user = userEvent.setup();
    render(<TaskModalContainer />);

    await user.click(screen.getByRole("button", { name: "Cancel" }));

    expect(mockCloseTaskModal).toHaveBeenCalledTimes(1);
  });

  it("calls createMutation on form submit with valid data", async () => {
    mockCreateMutateAsync.mockResolvedValue({});
    const user = userEvent.setup();
    render(<TaskModalContainer />);

    await user.clear(screen.getByPlaceholderText("Task title"));
    await user.type(screen.getByPlaceholderText("Task title"), "New task title");

    await user.click(screen.getByRole("button", { name: "Create Task" }));

    expect(mockCreateMutateAsync).toHaveBeenCalledTimes(1);
  });
});
