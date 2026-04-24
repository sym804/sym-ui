/**
 * @registry-meta
 * name: label
 * dependencies: []
 * internalDeps: ["utils"]
 */
import * as React from "react";
import { cn } from "../lib/utils";

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, required, children, ...props }, ref) => (
    <label
      ref={ref}
      className={cn("block text-sm font-semibold text-neutral-700 dark:text-[#d1d4dc] mb-1.5", className)}
      {...props}
    >
      {children}
      {required && (
        <>
          <span aria-hidden="true" className="ml-1 text-danger">
            *
          </span>
          <span className="sr-only"> (required)</span>
        </>
      )}
    </label>
  ),
);
Label.displayName = "Label";
