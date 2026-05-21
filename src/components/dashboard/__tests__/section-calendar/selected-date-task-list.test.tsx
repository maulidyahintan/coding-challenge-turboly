import { SelectedDateTaskList } from "@/components/dashboard/section-calendar/selected-date-task-list";
import { render, screen } from "@testing-library/react";

const mockOpenTaskModalEdit = jest.fn();

const todayISO = new Date().toISOString();

jest.mock("@/providers/TasksProvider", () => ({
  useTasksContext: () => ({
    tasks: [
      {
        id: "t1",
        title: "today task",
        description: "due today",
        priority: "MEDIUM",
        dueDate: todayISO,
        completed: false,
        createdAt: todayISO,
      },
      {
        id: "t2",
        title: "future task",
        description: null,
        priority: "LOW",
        dueDate: "2099-12-31T00:00:00.000Z",
        completed: false,
        createdAt: todayISO,
      },
    ],
    isLoading: false,
    error: null,
    openTaskModalEdit: mockOpenTaskModalEdit,
  }),
}));

beforeEach(() => jest.clearAllMocks());

describe("SelectedDateTaskList", () => {
  it("shows 'No date selected' when selectedDate is undefined", () => {
    render(<SelectedDateTaskList selectedDate={undefined} />);

    expect(screen.getByText(/No date selected/)).toBeInTheDocument();
  });

  it("shows tasks that fall on the selected date", () => {
    render(<SelectedDateTaskList selectedDate={new Date()} />);

    expect(screen.getByText("today task")).toBeInTheDocument();
  });

  it("does not show tasks from other dates", () => {
    render(<SelectedDateTaskList selectedDate={new Date()} />);

    expect(screen.queryByText("future task")).not.toBeInTheDocument();
  });

  it("shows empty message when no tasks fall on selected date", () => {
    render(<SelectedDateTaskList selectedDate={new Date("2010-01-01")} />);

    expect(screen.getByText(/No task on this date/)).toBeInTheDocument();
  });
});
