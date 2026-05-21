import { DeleteConfirmDialog } from "@/components/dashboard/delete-confirm-dialog";
import { fireEvent, render, screen } from "@testing-library/react";

const baseProps = {
  description: '"Buy milk" will be permanently deleted.',
  isPending: false,
  onCancel: jest.fn(),
  onConfirm: jest.fn(),
};

beforeEach(() => jest.clearAllMocks());

describe("DeleteConfirmDialog", () => {
  it("renders default title and description", () => {
    render(<DeleteConfirmDialog {...baseProps} />);

    expect(screen.getByText("Delete this task?")).toBeInTheDocument();
    expect(screen.getByText(/"Buy milk" will be permanently deleted./)).toBeInTheDocument();
  });

  it("renders custom title when provided", () => {
    render(<DeleteConfirmDialog {...baseProps} title="Remove item?" />);

    expect(screen.getByText("Remove item?")).toBeInTheDocument();
  });

  it("calls onCancel when Cancel button clicked", () => {
    render(<DeleteConfirmDialog {...baseProps} />);

    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));

    expect(baseProps.onCancel).toHaveBeenCalledTimes(1);
  });

  it("calls onConfirm when Delete button clicked", () => {
    render(<DeleteConfirmDialog {...baseProps} />);

    fireEvent.click(screen.getByRole("button", { name: "Delete" }));

    expect(baseProps.onConfirm).toHaveBeenCalledTimes(1);
  });

  it("disables both buttons and shows Deleting... when isPending", () => {
    render(<DeleteConfirmDialog {...baseProps} isPending />);

    expect(screen.getByRole("button", { name: "Cancel" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Deleting..." })).toBeDisabled();
  });
});
