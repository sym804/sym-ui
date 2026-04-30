/**
 * @registry-meta
 * name: combobox
 * dependencies: ["lucide-react"]
 * internalDeps: ["utils", "popover", "command", "button"]
 */
import * as React from "react";
import { ChevronDown, Check } from "lucide-react";
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
  searchAriaLabel?: string;
  /**
   * Trigger button 의 aria-label. visible label 이 없을 때 권장.
   * 미지정 시 placeholder 또는 selected 값을 fallback 으로 사용.
   */
  triggerAriaLabel?: string;
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
      searchAriaLabel,
      triggerAriaLabel,
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
            // visible label 이 placeholder/selected 로 채워지지만 axe 가 first paint
            // 이전을 검사하면 button-name 위반으로 잡을 수 있음. aria-label 을 항상 부여.
            aria-label={triggerAriaLabel ?? selected?.label ?? placeholder}
            disabled={disabled}
            className={cn("w-[220px] justify-between", className)}
          >
            {selected ? selected.label : placeholder}
            <ChevronDown aria-hidden className="ml-2 h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[220px] p-0">
          <Command>
            <CommandInput placeholder={searchPlaceholder} aria-label={searchAriaLabel ?? searchPlaceholder} />
            <CommandList>
              <CommandEmpty>{emptyText}</CommandEmpty>
              <CommandGroup>
                {options.map((opt) => (
                  <CommandItem
                    key={opt.value}
                    value={opt.value}
                    keywords={[opt.label]}
                    disabled={opt.disabled}
                    onSelect={(selectedValue) => {
                      onValueChange?.(selectedValue);
                      setOpen(false);
                    }}
                  >
                    {opt.label}
                    {opt.value === value ? <Check aria-hidden className="ml-auto h-4 w-4" /> : null}
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
