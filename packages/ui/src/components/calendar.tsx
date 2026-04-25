/**
 * @registry-meta
 * name: calendar
 * dependencies: ["react-day-picker", "date-fns"]
 * internalDeps: ["utils"]
 */
import * as React from "react";
import { DayPicker, type DayPickerProps } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { cn } from "../lib/utils";

export type CalendarProps = DayPickerProps;

export function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3 text-neutral-900 dark:text-[#d1d4dc]", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          "inline-flex items-center justify-center rounded-md h-7 w-7 bg-transparent p-0 opacity-70 hover:opacity-100",
          "hover:bg-neutral-100 dark:hover:bg-[#262a36]",
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell: "text-neutral-500 rounded-md w-9 font-normal text-xs dark:text-[#787b86]",
        row: "flex w-full mt-2",
        cell: "text-center text-sm p-0 relative focus-within:relative focus-within:z-20",
        day: cn(
          "inline-flex items-center justify-center rounded-md h-9 w-9 p-0 font-normal aria-selected:opacity-100",
          "hover:bg-neutral-100 dark:hover:bg-[#262a36]",
        ),
        day_selected:
          "bg-blue-500 text-white hover:bg-blue-500 hover:text-white focus:bg-blue-500 focus:text-white dark:bg-[#3d7eff] dark:hover:bg-[#3d7eff]",
        day_today: "bg-neutral-100 text-neutral-900 dark:bg-[#262a36] dark:text-[#d1d4dc]",
        day_outside: "text-neutral-400 opacity-50 dark:text-[#4a4d55]",
        day_disabled: "text-neutral-400 opacity-50",
        day_range_middle: "aria-selected:bg-neutral-100 aria-selected:text-neutral-900",
        day_hidden: "invisible",
        ...classNames,
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";
