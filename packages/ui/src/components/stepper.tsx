/**
 * @registry-meta
 * name: stepper
 * dependencies: []
 * internalDeps: ["utils"]
 *
 * 접근성: ol 기반 + aria-current="step" 으로 현재 단계 노출.
 */
import * as React from "react";
import { cn } from "../lib/utils";

export interface StepperProps extends React.HTMLAttributes<HTMLOListElement> {
  orientation?: "horizontal" | "vertical";
  value: number;
}

const StepperContext = React.createContext<{ value: number; orientation: "horizontal" | "vertical" }>({
  value: 0,
  orientation: "horizontal",
});

export const Stepper = React.forwardRef<HTMLOListElement, StepperProps>(
  ({ className, orientation = "horizontal", value, children, ...props }, ref) => (
    <StepperContext.Provider value={{ value, orientation }}>
      <ol
        ref={ref}
        className={cn(
          "flex w-full",
          orientation === "horizontal" ? "flex-row gap-4" : "flex-col gap-3",
          className,
        )}
        {...props}
      >
        {React.Children.map(children, (child, idx) =>
          React.isValidElement<StepperItemProps>(child)
            ? React.cloneElement(child, { index: idx })
            : child,
        )}
      </ol>
    </StepperContext.Provider>
  ),
);
Stepper.displayName = "Stepper";

export interface StepperItemProps extends React.LiHTMLAttributes<HTMLLIElement> {
  index?: number;
  label: string;
  description?: string;
}

export const StepperItem = React.forwardRef<HTMLLIElement, StepperItemProps>(
  ({ className, index = 0, label, description, ...props }, ref) => {
    const { value } = React.useContext(StepperContext);
    const completed = index < value;
    const active = index === value;
    const status = completed ? "complete" : active ? "current" : "upcoming";
    return (
      <li
        ref={ref}
        aria-current={active ? "step" : undefined}
        data-status={status}
        className={cn("flex flex-1 items-start gap-3", className)}
        {...props}
      >
        <span
          aria-hidden
          className={cn(
            "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold border",
            completed && "border-primary bg-primary text-primary-foreground",
            active && "border-primary text-primary",
            !completed && !active && "border-border text-muted-foreground",
          )}
        >
          {completed ? "✓" : index + 1}
        </span>
        <div className="flex flex-col">
          <span
            className={cn(
              "text-sm font-medium",
              active ? "text-foreground" : "text-muted-foreground",
            )}
          >
            {label}
          </span>
          {description ? (
            <span className="text-xs text-muted-foreground">{description}</span>
          ) : null}
        </div>
      </li>
    );
  },
);
StepperItem.displayName = "StepperItem";
