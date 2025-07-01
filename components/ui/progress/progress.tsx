import React from "react";
import { cn } from "@/lib/utils";

export type ProgressVariant = "default" | "success" | "warning" | "error";
export type ProgressSize = "sm" | "md" | "lg";
export type ProgressShape = "rounded" | "square";

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The current progress value (0-100)
   */
  value?: number;
  /**
   * Whether the progress is indeterminate
   */
  indeterminate?: boolean;
  /**
   * The visual variant of the progress
   */
  variant?: ProgressVariant;
  /**
   * The size of the progress
   */
  size?: ProgressSize;
  /**
   * The shape of the progress
   */
  shape?: ProgressShape;
  /**
   * Whether to show the progress value
   */
  showValue?: boolean;
  /**
   * Custom label for the progress
   */
  label?: string;
  /**
   * Whether the progress is disabled
   */
  disabled?: boolean;
}

const variantStyles: Record<ProgressVariant, string> = {
  default: "bg-primary",
  success: "bg-green-500",
  warning: "bg-yellow-500",
  error: "bg-red-500",
};

const sizeStyles: Record<ProgressSize, string> = {
  sm: "h-1",
  md: "h-2",
  lg: "h-3",
};

const shapeStyles: Record<ProgressShape, string> = {
  rounded: "rounded-full",
  square: "rounded-none",
};

export const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  (
    {
      value = 0,
      indeterminate = false,
      variant = "default",
      size = "md",
      shape = "rounded",
      showValue = false,
      label,
      disabled = false,
      className,
      ...props
    },
    ref
  ) => {
    const clampedValue = Math.min(Math.max(value, 0), 100);
    const progressId = `progress-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div
        ref={ref}
        className={cn("w-full", className)}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={indeterminate ? undefined : clampedValue}
        aria-valuetext={label}
        aria-label={label}
        {...props}
      >
        {label && (
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-gray-700">{label}</span>
            {showValue && !indeterminate && (
              <span className="text-sm font-medium text-gray-700">
                {clampedValue}%
              </span>
            )}
          </div>
        )}
        <div
          className={cn(
            "w-full overflow-hidden bg-gray-200",
            shapeStyles[shape],
            disabled && "opacity-50"
          )}
        >
          <div
            className={cn(
              "transition-all duration-300 ease-in-out",
              variantStyles[variant],
              sizeStyles[size],
              shapeStyles[shape],
              indeterminate
                ? "animate-progress-indeterminate"
                : "animate-progress-determinate"
            )}
            style={
              !indeterminate
                ? {
                    width: `${clampedValue}%`,
                    transform: "translateX(0)",
                  }
                : undefined
            }
          />
        </div>
      </div>
    );
  }
);

Progress.displayName = "Progress";
