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
  isBefore,
  isAfter,
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
  const today = new Date();
  const defaultMinDate = minDate ? parseISO(minDate) : today;
  const defaultMaxDate = maxDate ? parseISO(maxDate) : addDays(today, 30);

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
    // Check if date is before min date
    if (isBefore(date, defaultMinDate)) return false;

    // Check if date is after max date
    if (isAfter(date, defaultMaxDate)) return false;

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
    return !isBefore(prevMonthEnd, defaultMinDate);
  }, [currentMonth, defaultMinDate]);

  const canGoNext = useMemo(() => {
    const nextMonth = addMonths(currentMonth, 1);
    const nextMonthStart = startOfMonth(nextMonth);
    return !isAfter(nextMonthStart, defaultMaxDate);
  }, [currentMonth, defaultMaxDate]);

  // Group days into weeks (7 days per row)
  const weeks: Date[][] = [];
  for (let i = 0; i < calendarDays.length; i += 7) {
    weeks.push(calendarDays.slice(i, i + 7));
  }

  return (
    <div className="rounded-2xl border border-neutral-400 bg-white p-4">
      {/* Header */}
      <h3 className="font-semibold text-neutral-900 mb-3">Date</h3>
      <div className="border-b border-neutral-400 mb-4" />

      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handlePreviousMonth}
          disabled={!canGoPrevious}
          className={`p-1 rounded-lg transition-colors ${
            canGoPrevious
              ? "hover:bg-gray-100 text-neutral-900"
              : "text-gray-300 cursor-not-allowed"
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
              ? "hover:bg-gray-100 text-neutral-900"
              : "text-gray-300 cursor-not-allowed"
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
            className="w-10 h-8 flex items-center justify-center text-xs font-medium text-gray-500"
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
                    w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium
                    transition-colors
                    ${
                      selected
                        ? "bg-[#32C28A] text-white"
                        : today && !selected
                        ? "border border-[#32C28A] text-neutral-900"
                        : selectable && inCurrentMonth
                        ? "text-gray-900 hover:bg-gray-100"
                        : "text-gray-300"
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
