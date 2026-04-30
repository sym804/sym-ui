/**
 * @registry-meta
 * name: number-input
 * dependencies: ["lucide-react"]
 * internalDeps: ["utils", "button", "input"]
 *
 * 접근성: 증감 버튼은 aria-label 로 의도를 노출. native input[type=number] 가 spinbutton
 * 동작을 담당한다. value 가 비어있을 때는 undefined 로 일관 (null 은 사용하지 않음).
 */
import * as React from "react";
import { Minus, Plus } from "lucide-react";
import { cn } from "../lib/utils";
import { Button } from "./button";
import { Input } from "./input";

export interface NumberInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "defaultValue" | "onChange" | "type"> {
  value?: number;
  defaultValue?: number;
  onChange?: (value: number | undefined) => void;
  min?: number;
  max?: number;
  step?: number;
  /** native input 의 aria-label. visible label 없을 때 권장. default "Number". */
  inputAriaLabel?: string;
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
      inputAriaLabel = "Number",
      decrementAriaLabel = "Decrease",
      incrementAriaLabel = "Increase",
      ...rest
    },
    ref,
  ) => {
    const [internal, setInternal] = React.useState<number | undefined>(defaultValue);
    const isControlled = value !== undefined;
    const current = isControlled ? value : internal;

    const commit = React.useCallback(
      (next: number | undefined) => {
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
          <Minus aria-hidden className="h-4 w-4" />
        </Button>
        <Input
          ref={ref}
          type="number"
          inputMode="decimal"
          aria-label={inputAriaLabel}
          value={current ?? ""}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          onChange={(e) => {
            const raw = e.target.value;
            if (raw === "") return commit(undefined);
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
          <Plus aria-hidden className="h-4 w-4" />
        </Button>
      </div>
    );
  },
);
NumberInput.displayName = "NumberInput";
