/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as React from "react";
import { cn } from "@/src/lib/utils";

export interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  color?: string;
}

const ProgressBar = React.forwardRef<HTMLDivElement, ProgressBarProps>(
  ({ className, value, max = 100, color = "bg-primary", ...props }, ref) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    return (
      <div
        ref={ref}
        className={cn("h-2 w-full overflow-hidden rounded-full bg-base-700", className)}
        {...props}
      >
        <div
          className={cn("h-full transition-all duration-500", color)}
          style={{ width: `${percentage}%` }}
        />
      </div>
    );
  }
);

ProgressBar.displayName = "ProgressBar";

export { ProgressBar };
