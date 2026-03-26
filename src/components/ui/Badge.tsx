/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as React from "react";
import { cn } from "@/src/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "success" | "warning" | "danger" | "info" | "outline";
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = "info", ...props }, ref) => {
    const variants = {
      success: "bg-success/10 text-success border-success/20",
      warning: "bg-warning/10 text-warning border-warning/20",
      danger: "bg-danger/10 text-danger border-danger/20",
      info: "bg-info/10 text-info border-info/20",
      outline: "bg-transparent border-base-600 text-text-secondary",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
          variants[variant],
          className
        )}
        {...props}
      />
    );
  }
);

Badge.displayName = "Badge";

export { Badge };
