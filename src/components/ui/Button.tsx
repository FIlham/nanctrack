/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as React from "react";
import { cn } from "@/src/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "tertiary" | "ghost" | "outline" | "danger";
  size?: "sm" | "md" | "lg" | "icon";
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading, children, ...props }, ref) => {
    const variants = {
      primary: "bg-primary text-white hover:bg-primary-light shadow-glow-p",
      secondary: "bg-secondary text-white hover:opacity-90 shadow-glow-s",
      tertiary: "bg-tertiary text-white hover:opacity-90",
      ghost: "bg-transparent hover:bg-base-700 text-text-secondary",
      outline: "bg-transparent border border-base-600 hover:bg-base-700",
      danger: "bg-danger text-white hover:opacity-90",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-xs",
      md: "px-4 py-2 text-sm",
      lg: "px-6 py-3 text-base",
      icon: "p-2",
    };

    return (
      <button
        ref={ref}
        disabled={loading || props.disabled}
        className={cn(
          "inline-flex items-center justify-center rounded-md font-medium transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {loading ? (
          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
