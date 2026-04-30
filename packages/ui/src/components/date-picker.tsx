/**
 * @registry-meta
 * name: date-picker
 * dependencies: ["date-fns", "lucide-react"]
 * internalDeps: ["utils", "calendar", "popover", "button"]
 */
import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "./popover";
import { Calendar } from "./calendar";
import { Button } from "./button";
import { cn } from "../lib/utils";

export interface DatePickerProps {
  value: Date | undefined;
  onChange: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  dateFormat?: string;
}

export const DatePicker = React.forwardRef<HTMLButtonElement, DatePickerProps>(
  ({ value, onChange, placeholder = "Pick a date", disabled, className, dateFormat = "yyyy-MM-dd" }, ref) => {
    const [open, setOpen] = React.useState(false);
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            type="button"
            variant="outline"
            disabled={disabled}
            className={cn("w-[220px] justify-start text-left font-normal", !value && "text-muted-foreground", className)}
          >
            <CalendarIcon aria-hidden className="mr-2 h-4 w-4" />
            {value ? format(value, dateFormat) : placeholder}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={value}
            onSelect={(d) => {
              onChange(d);
              if (d) setOpen(false);
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    );
  },
);
DatePicker.displayName = "DatePicker";
