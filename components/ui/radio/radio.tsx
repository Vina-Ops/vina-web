import React from "react";
import { cn } from "@/lib/utils";

export type RadioVariant =
  | "default"
  | "primary"
  | "success"
  | "warning"
  | "error";
export type RadioSize = "sm" | "md" | "lg";

export interface RadioProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  /**
   * The visual variant of the radio
   */
  variant?: RadioVariant;
  /**
   * The size of the radio
   */
  size?: RadioSize;
  /**
   * The label text for the radio
   */
  label?: string;
  /**
   * The helper text for the radio
   */
  helperText?: string;
  /**
   * Whether the radio is in an error state
   */
  error?: boolean;
  /**
   * The error message to display
   */
  errorMessage?: string;
}

const variantStyles: Record<RadioVariant, string> = {
  default: "border-gray-300 checked:border-gray-900 checked:bg-gray-900",
  primary: "border-primary checked:border-primary checked:bg-primary",
  success: "border-green-500 checked:border-green-500 checked:bg-green-500",
  warning: "border-yellow-500 checked:border-yellow-500 checked:bg-yellow-500",
  error: "border-red-500 checked:border-red-500 checked:bg-red-500",
};

const sizeStyles: Record<RadioSize, string> = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
};

const labelSizeStyles: Record<RadioSize, string> = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
};

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  (
    {
      variant = "default",
      size = "md",
      label,
      helperText,
      error = false,
      errorMessage,
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
              type="radio"
              className={cn(
                "peer appearance-none rounded-full border transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
                variantStyles[variant],
                sizeStyles[size],
                error && "border-red-500",
                disabled && "cursor-not-allowed opacity-50",
                className
              )}
              disabled={disabled}
              {...props}
            />
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div
                className={cn(
                  "rounded-full bg-white opacity-0 transition-opacity peer-checked:opacity-100",
                  size === "sm" && "h-1.5 w-1.5",
                  size === "md" && "h-2 w-2",
                  size === "lg" && "h-2.5 w-2.5"
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

Radio.displayName = "Radio";

// Radio Group Component
export interface RadioGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The label for the radio group
   */
  label?: string;
  /**
   * The helper text for the radio group
   */
  helperText?: string;
  /**
   * Whether the radio group is in an error state
   */
  error?: boolean;
  /**
   * The error message to display
   */
  errorMessage?: string;
  /**
   * The orientation of the radio group
   */
  orientation?: "horizontal" | "vertical";
  /**
   * The name attribute for the radio inputs
   */
  name: string;
  /**
   * The value of the selected radio
   */
  value?: string;
  /**
   * Callback fired when the value changes
   */
  onChange?: (value: string) => void;
}

export const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  (
    {
      label,
      helperText,
      error = false,
      errorMessage,
      orientation = "vertical",
      name,
      value,
      onChange,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(event.target.value);
    };

    return (
      <div
        ref={ref}
        className={cn("flex flex-col gap-2", className)}
        role="radiogroup"
        aria-labelledby={label ? "radio-group-label" : undefined}
        {...props}
      >
        {label && (
          <div className="flex flex-col gap-1">
            <span
              id="radio-group-label"
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
          {React.Children.map(children, (child) => {
            if (React.isValidElement(child)) {
              return React.cloneElement(child, {
                name,
                checked: child.props.value === value,
                onChange: handleChange,
              });
            }
            return child;
          })}
        </div>
      </div>
    );
  }
);

RadioGroup.displayName = "RadioGroup";
