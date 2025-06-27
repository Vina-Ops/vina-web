import React from "react";
import { cn } from "@/lib/utils";

export type TooltipPosition = "top" | "right" | "bottom" | "left";
export type TooltipVariant = "default" | "light" | "dark";
export type TooltipSize = "sm" | "md" | "lg";

export interface TooltipProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "content"> {
  content: React.ReactNode;
  children: React.ReactElement<React.HTMLAttributes<HTMLElement>>;
  position?: TooltipPosition;
  variant?: TooltipVariant;
  size?: TooltipSize;
  delay?: number;
  disabled?: boolean;
  className?: string;
}

const positionStyles: Record<TooltipPosition, string> = {
  top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
  right: "left-full top-1/2 -translate-y-1/2 ml-2",
  bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
  left: "right-full top-1/2 -translate-y-1/2 mr-2",
};

const variantStyles: Record<TooltipVariant, string> = {
  default: "bg-gray-900 text-white",
  light: "bg-white text-gray-900 border border-gray-200 shadow-sm",
  dark: "bg-gray-900 text-white",
};

const sizeStyles: Record<TooltipSize, string> = {
  sm: "text-xs px-2 py-1",
  md: "text-sm px-3 py-1.5",
  lg: "text-base px-4 py-2",
};

const arrowStyles: Record<TooltipPosition, string> = {
  top: "bottom-[-4px] left-1/2 -translate-x-1/2 border-t-gray-900",
  right: "left-[-4px] top-1/2 -translate-y-1/2 border-r-gray-900",
  bottom: "top-[-4px] left-1/2 -translate-x-1/2 border-b-gray-900",
  left: "right-[-4px] top-1/2 -translate-y-1/2 border-l-gray-900",
};

export const Tooltip = React.forwardRef<HTMLDivElement, TooltipProps>(
  (
    {
      content,
      children,
      position = "top",
      variant = "default",
      size = "md",
      delay = 200,
      disabled = false,
      className,
      ...props
    },
    ref
  ) => {
    const [isVisible, setIsVisible] = React.useState(false);
    const timeoutRef = React.useRef<NodeJS.Timeout | undefined>(undefined);
    const tooltipRef = React.useRef<HTMLDivElement>(null);

    const showTooltip = () => {
      if (disabled) return;
      timeoutRef.current = setTimeout(() => {
        setIsVisible(true);
      }, delay);
    };

    const hideTooltip = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      setIsVisible(false);
    };

    React.useEffect(() => {
      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }, []);

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        hideTooltip();
      }
    };

    const clonedChild = React.cloneElement(children, {
      onMouseEnter: showTooltip,
      onMouseLeave: hideTooltip,
      onFocus: showTooltip,
      onBlur: hideTooltip,
      onKeyDown: handleKeyDown,
      "aria-describedby": isVisible ? "tooltip-content" : undefined,
    });

    return (
      <div className="relative inline-block" ref={ref}>
        {clonedChild}
        {isVisible && (
          <div
            ref={tooltipRef}
            role="tooltip"
            id="tooltip-content"
            className={cn(
              "absolute z-50 rounded-md transition-opacity duration-200",
              positionStyles[position],
              variantStyles[variant],
              sizeStyles[size],
              className
            )}
            {...props}
          >
            {content}
            <div
              className={cn(
                "absolute w-0 h-0 border-4 border-transparent",
                arrowStyles[position]
              )}
            />
          </div>
        )}
      </div>
    );
  }
);

Tooltip.displayName = "Tooltip";
