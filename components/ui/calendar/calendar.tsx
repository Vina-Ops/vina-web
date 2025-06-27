import React, { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type CalendarMode = "single" | "range" | "multiple";

export interface CalendarProps {
  mode?: CalendarMode;
  selected?: Date | Date[] | { from: Date; to: Date };
  onSelect?: (date: Date | Date[] | { from: Date; to: Date }) => void;
  disabled?: (date: Date) => boolean;
  className?: string;
  minDate?: Date;
  maxDate?: Date;
  locale?: string;
  showOutsideDays?: boolean;
  fixedWeeks?: boolean;
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  events?: Array<{
    date: Date;
    label: string;
    color?: string;
  }>;
}

export function Calendar({
  mode = "single",
  selected,
  onSelect,
  disabled,
  className,
  minDate,
  maxDate,
  locale = "en-US",
  showOutsideDays = true,
  fixedWeeks = false,
  weekStartsOn = 0,
  events = [],
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const daysInMonth = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];

    // Add days from previous month
    const firstDayOfWeek = firstDay.getDay();
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, prevMonthLastDay - i);
      days.push(date);
    }

    // Add days from current month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const date = new Date(year, month, i);
      days.push(date);
    }

    // Add days from next month
    const lastDayOfWeek = lastDay.getDay();
    const remainingDays = 6 - lastDayOfWeek;
    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(year, month + 1, i);
      days.push(date);
    }

    // Add extra week if fixedWeeks is true
    if (fixedWeeks && days.length < 42) {
      const extraDays = 42 - days.length;
      for (let i = 1; i <= extraDays; i++) {
        const date = new Date(year, month + 1, lastDay.getDate() + i);
        days.push(date);
      }
    }

    return days;
  }, [currentMonth, fixedWeeks]);

  const weekDays = useMemo(() => {
    const days = [];
    const formatter = new Intl.DateTimeFormat(locale, { weekday: "short" });
    for (let i = 0; i < 7; i++) {
      const day = (i + weekStartsOn) % 7;
      const date = new Date(2024, 0, day + 1); // Use a fixed date for consistent formatting
      days.push(formatter.format(date));
    }
    return days;
  }, [locale, weekStartsOn]);

  const isDateSelected = (date: Date) => {
    if (!selected) return false;

    if (mode === "single") {
      const selectedDate = selected as Date;
      return (
        date.getDate() === selectedDate.getDate() &&
        date.getMonth() === selectedDate.getMonth() &&
        date.getFullYear() === selectedDate.getFullYear()
      );
    }

    if (mode === "multiple") {
      const selectedDates = selected as Date[];
      return selectedDates.some(
        (d) =>
          date.getDate() === d.getDate() &&
          date.getMonth() === d.getMonth() &&
          date.getFullYear() === d.getFullYear()
      );
    }

    if (mode === "range") {
      const range = selected as { from: Date; to: Date };
      return (
        date >= range.from &&
        date <= range.to &&
        date.getHours() === 0 &&
        date.getMinutes() === 0 &&
        date.getSeconds() === 0
      );
    }

    return false;
  };

  const isDateInRange = (date: Date) => {
    if (mode !== "range" || !selected) return false;

    const range = selected as { from: Date; to: Date };
    return date > range.from && date < range.to;
  };

  const isDateDisabled = (date: Date) => {
    if (disabled?.(date)) return true;
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    return false;
  };

  const handleDateClick = (date: Date) => {
    if (isDateDisabled(date)) return;

    if (mode === "single") {
      onSelect?.(date);
    } else if (mode === "multiple") {
      const selectedDates = (selected as Date[]) || [];
      const isSelected = selectedDates.some(
        (d) =>
          d.getDate() === date.getDate() &&
          d.getMonth() === date.getMonth() &&
          d.getFullYear() === d.getFullYear()
      );

      if (isSelected) {
        onSelect?.(
          selectedDates.filter(
            (d) =>
              !(
                d.getDate() === date.getDate() &&
                d.getMonth() === date.getMonth() &&
                d.getFullYear() === d.getFullYear()
              )
          )
        );
      } else {
        onSelect?.([...selectedDates, date]);
      }
    } else if (mode === "range") {
      const range = selected as { from: Date; to: Date } | undefined;
      if (!range || (range.from && range.to)) {
        onSelect?.({ from: date, to: date });
      } else {
        onSelect?.({
          from: range.from,
          to: date > range.from ? date : range.from,
        });
      }
    }
  };

  const getEventForDate = (date: Date) => {
    return events.find(
      (event) =>
        event.date.getDate() === date.getDate() &&
        event.date.getMonth() === date.getMonth() &&
        event.date.getFullYear() === date.getFullYear()
    );
  };

  return (
    <div className={cn("w-full max-w-sm", className)}>
      <div className="flex items-center justify-between px-4 py-2">
        <button
          onClick={() =>
            setCurrentMonth(
              new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
            )
          }
          className="rounded-md p-2 hover:bg-gray-100"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h2 className="text-lg font-semibold">
          {new Intl.DateTimeFormat(locale, {
            month: "long",
            year: "numeric",
          }).format(currentMonth)}
        </h2>
        <button
          onClick={() =>
            setCurrentMonth(
              new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
            )
          }
          className="rounded-md p-2 hover:bg-gray-100"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-px bg-gray-200">
        {weekDays.map((day, i) => (
          <div
            key={i}
            className="bg-white py-2 text-center text-sm font-medium text-gray-500"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-px bg-gray-200">
        {daysInMonth.map((date, i) => {
          const isCurrentMonth = date.getMonth() === currentMonth.getMonth();
          const isSelected = isDateSelected(date);
          const isInRange = isDateInRange(date);
          const isDisabled = isDateDisabled(date);
          const event = getEventForDate(date);

          return (
            <button
              key={i}
              onClick={() => handleDateClick(date)}
              disabled={isDisabled}
              className={cn(
                "relative h-12 bg-white p-2 text-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50",
                !isCurrentMonth && "text-gray-400",
                isSelected && "bg-primary-50 text-primary-600",
                isInRange && "bg-primary-50",
                isDisabled && "text-gray-300"
              )}
            >
              <span>{date.getDate()}</span>
              {event && (
                <div
                  className={cn(
                    "absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full",
                    event.color || "bg-primary-500"
                  )}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
