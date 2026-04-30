/**
 * @registry-meta
 * name: number-input
 * dependencies: []
 * internalDeps: ["utils", "button", "input"]
 *
 * 접근성: 증감 버튼은 aria-label 로 의도를 노출, role="spinbutton" 의 native 동작은 input[type=number] 에 위임.
 */
import * as React from "react";
import { cn } from "../lib/utils";
import { Button } from "./button";
import { Input } from "./input";

export interface NumberInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "defaultValue" | "onChange" | "type"> {
  value?: number;
  defaultValue?: number;
  onChange?: (value: number | null) => void;
  min?: number;
  max?: number;
  step?: number;
  decrementAriaLabel?: string;
  incrementAriaLabel?: string;
}

function clamp(n: number, min?: number, max?: number) {
  let out = n;
  if (typeof min === "number") out = Math.max(out, min);
  if (typeof max === "number") out = Math.min(out, max);
  return out;
}

export const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  (
    {
      className,
      value,
      defaultValue,
      onChange,
      min,
      max,
      step = 1,
      disabled,
      decrementAriaLabel = "Decrease",
      incrementAriaLabel = "Increase",
      ...rest
    },
    ref,
  ) => {
    const [internal, setInternal] = React.useState<number | null>(defaultValue ?? null);
    const isControlled = value !== undefined;
    const current = isControlled ? value ?? null : internal;

    const commit = React.useCallback(
      (next: number | null) => {
        if (!isControlled) setInternal(next);
        onChange?.(next);
      },
      [isControlled, onChange],
    );

    const bump = (delta: number) => {
      const base = current ?? 0;
      const next = clamp(base + delta, min, max);
      commit(next);
    };

    return (
      <div className={cn("inline-flex items-stretch gap-1", className)}>
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label={decrementAriaLabel}
          disabled={disabled || (typeof min === "number" && (current ?? 0) <= min)}
          onClick={() => bump(-step)}
        >
          <span aria-hidden>−</span>
        </Button>
        <Input
          ref={ref}
          type="number"
          inputMode="decimal"
          value={current ?? ""}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          onChange={(e) => {
            const raw = e.target.value;
            if (raw === "") return commit(null);
            const parsed = Number(raw);
            if (Number.isNaN(parsed)) return;
            commit(clamp(parsed, min, max));
          }}
          className="w-24 text-center"
          {...rest}
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label={incrementAriaLabel}
          disabled={disabled || (typeof max === "number" && (current ?? 0) >= max)}
          onClick={() => bump(step)}
        >
          <span aria-hidden>+</span>
        </Button>
      </div>
    );
  },
);
NumberInput.displayName = "NumberInput";
