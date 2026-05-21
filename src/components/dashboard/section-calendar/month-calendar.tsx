"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import type { CustomComponents } from "react-day-picker";
import { DayPicker } from "react-day-picker";

type MonthCalendarProps = Readonly<{
  selectedDate?: Date;
  onSelectedDateChange?: (date: Date | undefined) => void;
  numberOfMonths?: number;
}>;

function CalendarChevron({ orientation, ...props }: Parameters<CustomComponents["Chevron"]>[0]) {
  return orientation === "left" ? (
    <ChevronLeft {...props} size={16} />
  ) : (
    <ChevronRight {...props} size={16} />
  );
}

export function MonthCalendar({
  selectedDate,
  onSelectedDateChange,
  numberOfMonths = 1,
}: MonthCalendarProps) {
  const today = useMemo(() => new Date(), []);
  const [month, setMonth] = useState(today);
  const [internalSelectedDate, setInternalSelectedDate] = useState<Date | undefined>(today);

  const activeSelectedDate = selectedDate ?? internalSelectedDate;

  const handleSelectDate = (date: Date | undefined) => {
    setInternalSelectedDate(date);
    onSelectedDateChange?.(date);
  };

  return (
    <DayPicker
      mode="single"
      month={month}
      numberOfMonths={numberOfMonths}
      selected={activeSelectedDate}
      onSelect={handleSelectDate}
      onMonthChange={setMonth}
      pagedNavigation={numberOfMonths > 1}
      showOutsideDays
      components={{
        Chevron: CalendarChevron,
      }}
      className="bg-white text-black px-4 py-2 rounded-b-none text-sm"
      classNames={{
        months: numberOfMonths > 1 ? "flex flex-row gap-4" : undefined,
        month_grid: "w-full border-separate border-spacing-0.5",
        caption_label: "mt-2 text-sm px-2 font-semibold uppercase tracking-[0.08em] text-sky-700",
        weekday:
          "h-8 w-10 p-0 text-center text-[11px] font-semibold uppercase tracking-[0.08em] text-sky-700",
        today: "ring2 border border-sky-700 rounded-full",
        selected:
          "rounded-full !border-sky-700 !bg-sky-700 !text-white hover:!border-sky-300 hover:!bg-sky-300 hover:!text-sky-900",
        outside: "text-black/30",
      }}
    />
  );
}
