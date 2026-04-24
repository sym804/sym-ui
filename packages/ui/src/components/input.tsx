/**
 * @registry-meta
 * name: input
 * dependencies: []
 * internalDeps: ["utils"]
 */
import * as React from "react";
import { cn } from "../lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => (
    <input
      ref={ref}
      type={type ?? "text"}
      className={cn(
        "flex h-10 w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm",
        "dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100",
        "placeholder:text-neutral-400 dark:placeholder:text-neutral-500",
        "focus-visible:outline-none focus-visible:border-primary-500 focus-visible:ring-2 focus-visible:ring-primary-100 dark:focus-visible:ring-primary-900/40",
        "disabled:cursor-not-allowed disabled:bg-neutral-50 disabled:text-neutral-400 dark:disabled:bg-neutral-900 dark:disabled:text-neutral-500",
        "data-[error=true]:border-danger data-[error=true]:focus-visible:ring-danger/20",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";
