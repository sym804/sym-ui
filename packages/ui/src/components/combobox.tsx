/**
 * @registry-meta
 * name: combobox
 * dependencies: []
 * internalDeps: ["utils", "popover", "command", "button"]
 */
import * as React from "react";
import { Popover, PopoverTrigger, PopoverContent } from "./popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "./command";
import { Button } from "./button";
import { cn } from "../lib/utils";

export interface ComboboxOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface ComboboxProps {
  options: ComboboxOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  className?: string;
  disabled?: boolean;
}

export const Combobox = React.forwardRef<HTMLButtonElement, ComboboxProps>(
  (
    {
      options,
      value,
      onValueChange,
      placeholder = "Select...",
      searchPlaceholder = "Search...",
      emptyText = "No results",
      className,
      disabled,
    },
    ref,
  ) => {
    const [open, setOpen] = React.useState(false);
    const selected = options.find((o) => o.value === value);

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className={cn("w-[220px] justify-between", className)}
          >
            {selected ? selected.label : placeholder}
            <span aria-hidden className="ml-2 opacity-50">▾</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[220px] p-0">
          <Command>
            <CommandInput placeholder={searchPlaceholder} />
            <CommandList>
              <CommandEmpty>{emptyText}</CommandEmpty>
              <CommandGroup>
                {options.map((opt) => (
                  <CommandItem
                    key={opt.value}
                    value={opt.label}
                    disabled={opt.disabled}
                    onSelect={() => {
                      onValueChange?.(opt.value);
                      setOpen(false);
                    }}
                  >
                    {opt.label}
                    {opt.value === value ? <span aria-hidden className="ml-auto">✓</span> : null}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  },
);
Combobox.displayName = "Combobox";
