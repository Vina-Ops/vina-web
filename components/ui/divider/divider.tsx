import React from "react";
import { cn } from "@/lib/utils";

export type DividerVariant = "solid" | "dashed" | "dotted";
export type DividerOrientation = "horizontal" | "vertical";
export type DividerSize = "sm" | "md" | "lg";

export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The visual variant of the divider
   */
  variant?: DividerVariant;
  /**
   * The orientation of the divider
   */
  orientation?: DividerOrientation;
  /**
   * The size of the divider
   */
  size?: DividerSize;
  /**
   * The text label to display in the center of the divider
   */
  label?: React.ReactNode;
  /**
   * The color of the divider
   */
  color?: string;
  /**
   * Whether the divider is disabled
   */
  disabled?: boolean;
}

const variantStyles: Record<DividerVariant, string> = {
  solid: "border-solid",
  dashed: "border-dashed",
  dotted: "border-dotted",
};

const orientationStyles: Record<DividerOrientation, string> = {
  horizontal: "w-full border-t",
  vertical: "h-full border-l",
};

const sizeStyles: Record<DividerSize, string> = {
  sm: "border-1",
  md: "border-2",
  lg: "border-4",
};

export const Divider = React.forwardRef<HTMLDivElement, DividerProps>(
  (
    {
      variant = "solid",
      orientation = "horizontal",
      size = "md",
      label,
      color,
      disabled = false,
      className,
      ...props
    },
    ref
  ) => {
    const isHorizontal = orientation === "horizontal";

    if (label && !isHorizontal) {
      console.warn("Label is only supported for horizontal dividers");
    }

    return (
      <div
        ref={ref}
        className={cn(
          "relative flex items-center",
          orientationStyles[orientation],
          variantStyles[variant],
          sizeStyles[size],
          disabled && "opacity-50",
          className
        )}
        style={color ? { borderColor: color } : undefined}
        role="separator"
        aria-orientation={orientation}
        {...props}
      >
        {label && isHorizontal && (
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4">
            {label}
          </div>
        )}
      </div>
    );
  }
);

Divider.displayName = "Divider";
