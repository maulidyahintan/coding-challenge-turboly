import { MonthCalendar } from "@/components/dashboard/section-calendar/month-calendar";
import { render, screen } from "@testing-library/react";

describe("MonthCalendar", () => {
  it("renders a calendar with navigation buttons", () => {
    render(<MonthCalendar />);

    // DayPicker renders prev/next nav buttons
    const prevButton = screen.getByRole("button", { name: /previous month/i });
    const nextButton = screen.getByRole("button", { name: /next month/i });

    expect(prevButton).toBeInTheDocument();
    expect(nextButton).toBeInTheDocument();
  });

  it("renders day cells", () => {
    render(<MonthCalendar />);

    // Should render a grid/table of day cells
    const gridCells = screen.getAllByRole("gridcell");
    expect(gridCells.length).toBeGreaterThan(0);
  });

  it("marks the selected date", () => {
    const today = new Date();
    render(<MonthCalendar selectedDate={today} />);

    // The selected cell should have aria-selected=true
    const selected = screen.getAllByRole("gridcell").find(
      (cell) => cell.getAttribute("aria-selected") === "true"
    );

    expect(selected).toBeDefined();
  });
});
