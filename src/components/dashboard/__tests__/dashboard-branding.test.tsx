import { DashboardBranding } from "@/components/dashboard/dashboard-branding";
import { render, screen } from "@testing-library/react";

describe("DashboardBranding", () => {
  it("renders product name", () => {
    render(<DashboardBranding />);

    expect(screen.getByText(/Turboly Coding Challenge/i)).toBeInTheDocument();
  });

  it("renders app title as h1", () => {
    render(<DashboardBranding />);

    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent("Adaptive Task Manager");
  });
});
