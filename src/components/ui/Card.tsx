/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as React from "react";
import { cn } from "@/src/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "glass";
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-lg border border-base-600 bg-base-800 p-6 shadow-card",
          variant === "glass" && "bg-opacity-50 backdrop-blur-md",
          className
        )}
        {...props}
      />
    );
  }
);

Card.displayName = "Card";

export { Card };
