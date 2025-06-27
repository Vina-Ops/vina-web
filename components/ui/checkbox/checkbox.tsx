import React from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export type CheckboxVariant =
  | "default"
  | "primary"
  | "success"
  | "warning"
  | "error";
export type CheckboxSize = "sm" | "md" | "lg";

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  /**
   * The visual variant of the checkbox
   */
  variant?: CheckboxVariant;
  /**
   * The size of the checkbox
   */
  size?: CheckboxSize;
  /**
   * The label text for the checkbox
   */
  label?: string;
  /**
   * The helper text for the checkbox
   */
  helperText?: string;
  /**
   * Whether the checkbox is in an error state
   */
  error?: boolean;
  /**
   * The error message to display
   */
  errorMessage?: string;
  /**
   * Whether the checkbox is indeterminate
   */
  indeterminate?: boolean;
  /**
   * Whether to show the checkbox in a controlled state
   */
  controlled?: boolean;
}

const variantStyles: Record<CheckboxVariant, string> = {
  default: "border-gray-300 checked:bg-gray-900 checked:border-gray-900",
  primary: "border-primary checked:bg-primary checked:border-primary",
  success: "border-green-500 checked:bg-green-500 checked:border-green-500",
  warning: "border-yellow-500 checked:bg-yellow-500 checked:border-yellow-500",
  error: "border-red-500 checked:bg-red-500 checked:border-red-500",
};

const sizeStyles: Record<CheckboxSize, string> = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
};

const labelSizeStyles: Record<CheckboxSize, string> = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
};

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      variant = "default",
      size = "md",
      label,
      helperText,
      error = false,
      errorMessage,
      indeterminate = false,
      controlled = false,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const checkboxRef = React.useRef<HTMLInputElement>(null);

    React.useEffect(() => {
      if (checkboxRef.current) {
        checkboxRef.current.indeterminate = indeterminate;
      }
    }, [indeterminate]);

    return (
      <div className="flex flex-col gap-1">
        <label className="flex items-start gap-2">
          <div className="relative flex items-center">
            <input
              ref={ref}
              type="checkbox"
              className={cn(
                "peer appearance-none rounded border transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
                variantStyles[variant],
                sizeStyles[size],
                error && "border-red-500",
                disabled && "cursor-not-allowed opacity-50",
                className
              )}
              disabled={disabled}
              {...props}
            />
            <div
              className={cn(
                "pointer-events-none absolute inset-0 flex items-center justify-center text-white opacity-0 peer-checked:opacity-100",
                indeterminate && "opacity-100"
              )}
            >
              {indeterminate ? (
                <div className="h-0.5 w-3 bg-current" />
              ) : (
                <Check className={cn("h-3 w-3", size === "lg" && "h-4 w-4")} />
              )}
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

Checkbox.displayName = "Checkbox";

// Checkbox Group Component
export interface CheckboxGroupProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The label for the checkbox group
   */
  label?: string;
  /**
   * The helper text for the checkbox group
   */
  helperText?: string;
  /**
   * Whether the checkbox group is in an error state
   */
  error?: boolean;
  /**
   * The error message to display
   */
  errorMessage?: string;
  /**
   * The orientation of the checkbox group
   */
  orientation?: "horizontal" | "vertical";
}

export const CheckboxGroup = React.forwardRef<
  HTMLDivElement,
  CheckboxGroupProps
>(
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
        aria-labelledby={label ? "checkbox-group-label" : undefined}
        {...props}
      >
        {label && (
          <div className="flex flex-col gap-1">
            <span
              id="checkbox-group-label"
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

CheckboxGroup.displayName = "CheckboxGroup";
