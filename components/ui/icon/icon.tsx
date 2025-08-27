import React from "react";
import * as LucideIcons from "lucide-react";
import { cn } from "@/lib/utils";

export type IconSize = "xs" | "sm" | "md" | "lg" | "xl";
export type IconVariant =
  | "default"
  | "primary"
  | "success"
  | "warning"
  | "error";
export type IconAnimation = "none" | "spin" | "pulse" | "bounce";

export interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
  /**
   * The name of the Lucide icon to display
   */
  name: keyof typeof LucideIcons;
  /**
   * The size of the icon
   */
  size?: IconSize;
  /**
   * The visual variant of the icon
   */
  variant?: IconVariant;
  /**
   * The animation style of the icon
   */
  animation?: IconAnimation;
  /**
   * The color of the icon
   */
  color?: string;
  /**
   * Whether the icon is disabled
   */
  disabled?: boolean;
  /**
   * The stroke width of the icon
   */
  strokeWidth?: number;
  /**
   * Whether to fill the icon
   */
  fill?: boolean;
}

const sizeStyles: Record<IconSize, string> = {
  xs: "h-3 w-3",
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
  xl: "h-8 w-8",
};

const variantStyles: Record<IconVariant, string> = {
  default: "text-gray-600",
  primary: "text-primary-600",
  success: "text-success-600",
  warning: "text-warning-600",
  error: "text-error-600",
};

const animationStyles: Record<IconAnimation, string> = {
  none: "",
  spin: "animate-spin",
  pulse: "animate-pulse",
  bounce: "animate-bounce",
};

export const Icon = React.forwardRef<HTMLSpanElement, IconProps>(
  (
    {
      name,
      size = "md",
      variant = "default",
      animation = "none",
      color,
      disabled = false,
      strokeWidth = 2,
      fill = false,
      className,
      ...props
    },
    ref
  ) => {
    const IconComponent = LucideIcons[name];

    if (!IconComponent) {
      console.warn(`Icon "${name}" not found in Lucide icons`);
      return null;
    }

    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center",
          sizeStyles[size],
          variantStyles[variant],
          animationStyles[animation],
          disabled && "opacity-50",
          className
        )}
        style={color ? { color } : undefined}
        role="img"
        aria-hidden="true"
        {...props}
      >
        {React.createElement(IconComponent as React.ComponentType<any>, {
          className: cn(fill && "fill-current"),
          strokeWidth: strokeWidth,
        })}
      </span>
    );
  }
);

Icon.displayName = "Icon";

// Export all Lucide icons for convenience
export { LucideIcons };
