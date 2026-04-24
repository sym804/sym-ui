/**
 * @registry-meta
 * name: skeleton
 * dependencies: []
 * internalDeps: ["utils"]
 */
import * as React from "react";
import { cn } from "../lib/utils";

export type SkeletonProps = React.HTMLAttributes<HTMLDivElement>;

export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("animate-pulse rounded-md bg-neutral-100 dark:bg-[#1e222d]", className)}
      aria-hidden="true"
      {...props}
    />
  ),
);
Skeleton.displayName = "Skeleton";
