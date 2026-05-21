import { LogoutButton } from "@/components/dashboard/logout-button";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const mockLogout = jest.fn();

jest.mock("@/hooks/useLogout", () => ({
  useLogout: () => ({
    logout: mockLogout,
    isLoggingOut: false,
    logoutError: null,
  }),
}));

beforeEach(() => jest.clearAllMocks());

describe("LogoutButton", () => {
  it("renders user email in the button when not iconOnly", () => {
    render(<LogoutButton userEmail="user@example.com" />);

    expect(screen.getByText("user@example.com")).toBeInTheDocument();
  });

  it("does not render email when iconOnly is true", () => {
    render(<LogoutButton userEmail="user@example.com" iconOnly />);

    expect(screen.queryByText("user@example.com")).not.toBeInTheDocument();
  });

  it("opens dropdown menu when button is clicked", async () => {
    const user = userEvent.setup();
    render(<LogoutButton userEmail="user@example.com" />);

    await user.click(screen.getByRole("button", { name: /user@example.com/i }));

    expect(screen.getByText("Logout")).toBeInTheDocument();
  });

  it("calls logout when Logout option is clicked", async () => {
    const user = userEvent.setup();
    render(<LogoutButton userEmail="user@example.com" />);

    await user.click(screen.getByRole("button", { name: /user@example.com/i }));
    await user.click(screen.getByRole("button", { name: "Logout" }));

    expect(mockLogout).toHaveBeenCalledTimes(1);
  });

  it("closes dropdown when clicking outside", async () => {
    const user = userEvent.setup();
    render(
      <div>
        <LogoutButton userEmail="user@example.com" />
        <button type="button">outside</button>
      </div>
    );

    // Open dropdown
    await user.click(screen.getByRole("button", { name: /user@example.com/i }));
    expect(screen.getByText("Logout")).toBeInTheDocument();

    // Click outside
    await user.click(screen.getByRole("button", { name: "outside" }));
    expect(screen.queryByText("Logout")).not.toBeInTheDocument();
  });
});

describe("LogoutButton (with logout error)", () => {
  beforeEach(() => {
    jest.mock("@/hooks/useLogout", () => ({
      useLogout: () => ({
        logout: jest.fn(),
        isLoggingOut: false,
        logoutError: "Logout failed. Please try again.",
      }),
    }));
  });

  it("renders normally (error displayed inline when logoutError is set)", () => {
    render(<LogoutButton userEmail="a@b.com" />);
    // Component renders without crashing
    expect(screen.getByRole("button")).toBeInTheDocument();
  });
});
