import React from "react";
import { cn } from "@/lib/utils";

export type SwitchVariant =
  | "default"
  | "primary"
  | "success"
  | "warning"
  | "error";
export type SwitchSize = "sm" | "md" | "lg";

export interface SwitchProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  /**
   * The visual variant of the switch
   */
  variant?: SwitchVariant;
  /**
   * The size of the switch
   */
  size?: SwitchSize;
  /**
   * The label text for the switch
   */
  label?: string;
  /**
   * The helper text for the switch
   */
  helperText?: string;
  /**
   * Whether the switch is in an error state
   */
  error?: boolean;
  /**
   * The error message to display
   */
  errorMessage?: string;
  /**
   * Whether to show the switch in a controlled state
   */
  controlled?: boolean;
}

const variantStyles: Record<SwitchVariant, string> = {
  default: "bg-gray-200 peer-checked:bg-gray-900",
  primary: "bg-gray-200 peer-checked:bg-primary",
  success: "bg-gray-200 peer-checked:bg-green-500",
  warning: "bg-gray-200 peer-checked:bg-yellow-500",
  error: "bg-gray-200 peer-checked:bg-red-500",
};

const sizeStyles: Record<SwitchSize, { track: string; thumb: string }> = {
  sm: {
    track: "h-4 w-7",
    thumb: "h-3 w-3",
  },
  md: {
    track: "h-5 w-9",
    thumb: "h-4 w-4",
  },
  lg: {
    track: "h-6 w-11",
    thumb: "h-5 w-5",
  },
};

const labelSizeStyles: Record<SwitchSize, string> = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
};

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  (
    {
      variant = "default",
      size = "md",
      label,
      helperText,
      error = false,
      errorMessage,
      controlled = false,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <div className="flex flex-col gap-1">
        <label className="flex items-start gap-2">
          <div className="relative flex items-center">
            <input
              ref={ref}
              type="checkbox"
              role="switch"
              className="peer sr-only"
              disabled={disabled}
              {...props}
            />
            <div
              className={cn(
                "relative inline-flex cursor-pointer items-center rounded-full transition-colors duration-200 ease-in-out",
                variantStyles[variant],
                sizeStyles[size].track,
                error && "bg-red-500",
                disabled && "cursor-not-allowed opacity-50",
                className
              )}
            >
              <div
                className={cn(
                  "pointer-events-none absolute left-0.5 inline-block transform rounded-full bg-white shadow transition-transform duration-200 ease-in-out",
                  sizeStyles[size].thumb,
                  "peer-checked:translate-x-full"
                )}
              />
            </div>
          </div>
          {label && (
            <div className="flex flex-col">
              <span
                className={cn(
                  "font-medium text-gray-700",
                  labelSizeStyles[size],
                  disabled && "opacity-50"
                )}
              >
                {label}
              </span>
              {helperText && !error && (
                <span className="text-sm text-gray-500">{helperText}</span>
              )}
              {error && errorMessage && (
                <span className="text-sm text-red-500">{errorMessage}</span>
              )}
            </div>
          )}
        </label>
      </div>
    );
  }
);

Switch.displayName = "Switch";

// Switch Group Component
export interface SwitchGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The label for the switch group
   */
  label?: string;
  /**
   * The helper text for the switch group
   */
  helperText?: string;
  /**
   * Whether the switch group is in an error state
   */
  error?: boolean;
  /**
   * The error message to display
   */
  errorMessage?: string;
  /**
   * The orientation of the switch group
   */
  orientation?: "horizontal" | "vertical";
}

export const SwitchGroup = React.forwardRef<HTMLDivElement, SwitchGroupProps>(
  (
    {
      label,
      helperText,
      error = false,
      errorMessage,
      orientation = "vertical",
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn("flex flex-col gap-2", className)}
        role="group"
        aria-labelledby={label ? "switch-group-label" : undefined}
        {...props}
      >
        {label && (
          <div className="flex flex-col gap-1">
            <span
              id="switch-group-label"
              className="text-sm font-medium text-gray-700"
            >
              {label}
            </span>
            {helperText && !error && (
              <span className="text-sm text-gray-500">{helperText}</span>
            )}
            {error && errorMessage && (
              <span className="text-sm text-red-500">{errorMessage}</span>
            )}
          </div>
        )}
        <div
          className={cn(
            "flex gap-4",
            orientation === "vertical" ? "flex-col" : "flex-row"
          )}
        >
          {children}
        </div>
      </div>
    );
  }
);

SwitchGroup.displayName = "SwitchGroup";
