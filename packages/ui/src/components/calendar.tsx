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
      className={cn("m-0 p-3 text-foreground", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          "inline-flex items-center justify-center rounded-md h-7 w-7 bg-transparent p-0 opacity-70 hover:opacity-100 hover:bg-interactive-hover",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background",
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell: "text-muted-foreground rounded-md w-9 font-normal text-xs",
        row: "flex w-full mt-2",
        cell: "text-center text-sm p-0 relative focus-within:relative focus-within:z-20",
        day: cn(
          "inline-flex items-center justify-center rounded-md h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-interactive-hover",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background",
        ),
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-muted text-foreground",
        // v0.8.0: opacity-50 / -40 으로 인한 contrast 미달을 해소. day_outside 는
        // 다음/이전 달 day 라 구분만 유지하면 되므로 muted-foreground 그대로 + opacity 제거.
        // day_disabled 는 cursor + line-through 로 시각 단서 강화 후 opacity 완화.
        day_outside: "text-muted-foreground",
        day_disabled: "text-muted-foreground line-through cursor-not-allowed",
        day_range_middle: "aria-selected:bg-muted aria-selected:text-muted-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";
