import React from "react";
import { cn } from "@/lib/utils";

export type SpinnerVariant =
  | "default"
  | "primary"
  | "success"
  | "warning"
  | "error";
export type SpinnerSize = "sm" | "md" | "lg" | "xl";
export type SpinnerStyle = "circular" | "dots" | "pulse";

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The visual variant of the spinner
   */
  variant?: SpinnerVariant;
  /**
   * The size of the spinner
   */
  size?: SpinnerSize;
  /**
   * The style of the spinner
   */
  style?: SpinnerStyle;
  /**
   * The text label to display below the spinner
   */
  label?: string;
  /**
   * Whether the spinner is disabled
   */
  disabled?: boolean;
  /**
   * The speed of the spinner animation in milliseconds
   */
  speed?: number;
}

const variantStyles: Record<SpinnerVariant, string> = {
  default: "text-gray-400",
  primary: "text-primary-600",
  success: "text-success-600",
  warning: "text-warning-600",
  error: "text-error-600",
};

const sizeStyles: Record<SpinnerSize, { spinner: string; label: string }> = {
  sm: {
    spinner: "h-4 w-4",
    label: "text-sm",
  },
  md: {
    spinner: "h-6 w-6",
    label: "text-base",
  },
  lg: {
    spinner: "h-8 w-8",
    label: "text-lg",
  },
  xl: {
    spinner: "h-12 w-12",
    label: "text-xl",
  },
};

const styleComponents: Record<SpinnerStyle, React.FC<{ className: string }>> = {
  circular: ({ className }) => (
    <svg
      className={cn("animate-spin", className)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  ),
  dots: ({ className }) => (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="h-2 w-2 animate-bounce rounded-full bg-current [animation-delay:-0.3s]" />
      <div className="h-2 w-2 animate-bounce rounded-full bg-current [animation-delay:-0.15s]" />
      <div className="h-2 w-2 animate-bounce rounded-full bg-current" />
    </div>
  ),
  pulse: ({ className }) => (
    <div className={cn("relative", className)}>
      <div className="absolute inset-0 animate-ping rounded-full bg-current opacity-75" />
      <div className="relative h-full w-full rounded-full bg-current" />
    </div>
  ),
};

export const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  (
    {
      variant = "default",
      size = "md",
      style = "circular",
      label,
      disabled = false,
      speed,
      className,
      ...props
    },
    ref
  ) => {
    const SpinnerComponent = styleComponents[style];

    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex flex-col items-center",
          disabled && "opacity-50",
          className
        )}
        role="status"
        aria-label={label || "Loading"}
        {...props}
      >
        <div
          className={cn(variantStyles[variant], sizeStyles[size].spinner)}
          style={
            speed
              ? {
                  animationDuration: `${speed}ms`,
                }
              : undefined
          }
        >
          <SpinnerComponent className="h-full w-full" />
        </div>
        {label && (
          <span className={cn("mt-2 text-gray-600", sizeStyles[size].label)}>
            {label}
          </span>
        )}
      </div>
    );
  }
);

Spinner.displayName = "Spinner";
