"use client";

import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  addMonths,
  subMonths,
  isSameDay,
  parseISO,
  isToday,
  getDay,
  addDays,
} from "date-fns";

interface CalendarPickerProps {
  selectedDate: string | null; // ISO date string
  onSelectDate: (date: string) => void;
  minDate?: string; // ISO date string
  maxDate?: string; // ISO date string
  disableSundays?: boolean;
}

export function CalendarPicker({
  selectedDate,
  onSelectDate,
  minDate,
  maxDate,
  disableSundays = false,
}: CalendarPickerProps) {
  const today = useMemo(() => new Date(), []);
  const defaultMinDateTs = useMemo(
    () => (minDate ? parseISO(minDate).getTime() : today.getTime()),
    [minDate, today]
  );
  const defaultMaxDateTs = useMemo(
    () => (maxDate ? parseISO(maxDate).getTime() : addDays(today, 30).getTime()),
    [maxDate, today]
  );

  const [currentMonth, setCurrentMonth] = useState(
    selectedDate ? parseISO(selectedDate) : today
  );

  // Day headers
  const dayHeaders = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // Generate calendar grid for current month
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 }); // Monday
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

    return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  }, [currentMonth]);

  // Check if date is selectable
  const isDateSelectable = (date: Date): boolean => {
    const dateTs = date.getTime();
    // Check if date is before min date
    if (dateTs < defaultMinDateTs) return false;

    // Check if date is after max date
    if (dateTs > defaultMaxDateTs) return false;

    // Check if Sunday and Sundays are disabled
    if (disableSundays && getDay(date) === 0) return false;

    return true;
  };

  // Check if date is selected
  const isDateSelected = (date: Date): boolean => {
    if (!selectedDate) return false;
    return isSameDay(date, parseISO(selectedDate));
  };

  // Check if date is in current month
  const isInCurrentMonth = (date: Date): boolean => {
    return (
      date.getMonth() === currentMonth.getMonth() &&
      date.getFullYear() === currentMonth.getFullYear()
    );
  };

  // Handle date selection
  const handleSelectDate = (date: Date) => {
    if (!isDateSelectable(date)) return;
    onSelectDate(format(date, "yyyy-MM-dd"));
  };

  // Handle month navigation
  const handlePreviousMonth = () => {
    setCurrentMonth((prev) => subMonths(prev, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth((prev) => addMonths(prev, 1));
  };

  // Check if can navigate to previous/next month
  const canGoPrevious = useMemo(() => {
    const prevMonth = subMonths(currentMonth, 1);
    const prevMonthEnd = endOfMonth(prevMonth);
    return prevMonthEnd.getTime() >= defaultMinDateTs;
  }, [currentMonth, defaultMinDateTs]);

  const canGoNext = useMemo(() => {
    const nextMonth = addMonths(currentMonth, 1);
    const nextMonthStart = startOfMonth(nextMonth);
    return nextMonthStart.getTime() <= defaultMaxDateTs;
  }, [currentMonth, defaultMaxDateTs]);

  // Group days into weeks (7 days per row)
  const weeks: Date[][] = [];
  for (let i = 0; i < calendarDays.length; i += 7) {
    weeks.push(calendarDays.slice(i, i + 7));
  }

  return (
    <div className="rounded-4xl border border-neutral-400 bg-white p-4">
      {/* Header */}
      <h3 className="font-bold text-xl text-neutral-900 mb-3">Date</h3>
      <div className="border-b border-neutral-400 mb-4" />

      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handlePreviousMonth}
          disabled={!canGoPrevious}
          className={`p-1 rounded-lg transition-colors ${
            canGoPrevious
              ? "hover:bg-neutral-200 text-neutral-900"
              : "text-neutral-400 cursor-not-allowed"
          }`}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <span className="font-medium text-neutral-900">
          {format(currentMonth, "MMMM yyyy")}
        </span>

        <button
          onClick={handleNextMonth}
          disabled={!canGoNext}
          className={`p-1 rounded-lg transition-colors ${
            canGoNext
              ? "hover:bg-neutral-200 text-neutral-900"
              : "text-neutral-400 cursor-not-allowed"
          }`}
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Day Headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayHeaders.map((day) => (
          <div
            key={day}
            className="w-10 h-8 flex items-center justify-center text-xs font-medium text-neutral-700"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Date Grid */}
      <div className="space-y-1">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="grid grid-cols-7 gap-1">
            {week.map((date, dayIndex) => {
              const selectable = isDateSelectable(date);
              const selected = isDateSelected(date);
              const today = isToday(date);
              const inCurrentMonth = isInCurrentMonth(date);

              return (
                <button
                  key={dayIndex}
                  onClick={() => handleSelectDate(date)}
                  disabled={!selectable}
                  className={`
                    w-10 h-9 flex items-center justify-center rounded-lg font-medium
                    transition-colors
                    ${
                      selected
                        ? "bg-primary-900 text-neutral-900"
                        : today && !selected
                        ? "border border-primary-900 text-neutral-900"
                        : selectable && inCurrentMonth
                        ? "text-neutral-900 bg-secondary-100"
                        : "text-neutral-400"
                    }
                    ${!selectable ? "cursor-not-allowed" : "cursor-pointer"}
                  `}
                >
                  {format(date, "d")}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
