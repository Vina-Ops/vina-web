import React from "react";
import { cn } from "@/lib/utils";
import { Icon } from "../icon/icon";
import { Button } from "../button/button";

export type EmptyStateVariant = "default" | "simple" | "compact";
export type EmptyStateSize = "sm" | "md" | "lg";

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The title of the empty state
   */
  title: string;
  /**
   * The description of the empty state
   */
  description?: string;
  /**
   * The icon to display
   */
  icon?: keyof typeof import("lucide-react");
  /**
   * The visual variant of the empty state
   */
  variant?: EmptyStateVariant;
  /**
   * The size of the empty state
   */
  size?: EmptyStateSize;
  /**
   * The primary action button
   */
  action?: {
    label: string;
    onClick: () => void;
    icon?: keyof typeof import("lucide-react");
  };
  /**
   * The secondary action button
   */
  secondaryAction?: {
    label: string;
    onClick: () => void;
    icon?: keyof typeof import("lucide-react");
  };
  /**
   * Custom image to display instead of an icon
   */
  image?: string;
  /**
   * Whether to center the content
   */
  centered?: boolean;
  /**
   * Additional content to display below the actions
   */
  footer?: React.ReactNode;
}

const variantStyles: Record<EmptyStateVariant, string> = {
  default: "p-8",
  simple: "p-4",
  compact: "p-2",
};

const sizeStyles: Record<
  EmptyStateSize,
  {
    container: string;
    icon: string;
    title: string;
    description: string;
  }
> = {
  sm: {
    container: "max-w-sm",
    icon: "xl",
    title: "text-lg",
    description: "text-sm",
  },
  md: {
    container: "max-w-md",
    icon: "2xl",
    title: "text-xl",
    description: "text-base",
  },
  lg: {
    container: "max-w-lg",
    icon: "3xl",
    title: "text-2xl",
    description: "text-lg",
  },
};

export const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  (
    {
      title,
      description,
      icon,
      variant = "default",
      size = "md",
      action,
      secondaryAction,
      image,
      centered = true,
      footer,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-lg border border-gray-200 bg-white",
          variantStyles[variant],
          sizeStyles[size].container,
          centered && "mx-auto text-center",
          className
        )}
        role="status"
        aria-label="Empty state"
        {...props}
      >
        <div className="flex flex-col items-center gap-4">
          {image ? (
            <img
              src={image}
              alt=""
              className={cn(
                "h-24 w-24 object-contain",
                size === "lg" && "h-32 w-32",
                size === "sm" && "h-16 w-16"
              )}
            />
          ) : icon ? (
            <Icon
              name={icon}
              size={sizeStyles[size].icon as any}
              variant="default"
              className="text-gray-400"
            />
          ) : null}

          <div className="space-y-2">
            <h3
              className={cn(
                "font-medium text-gray-900",
                sizeStyles[size].title
              )}
            >
              {title}
            </h3>
            {description && (
              <p className={cn("text-gray-500", sizeStyles[size].description)}>
                {description}
              </p>
            )}
          </div>

          {(action || secondaryAction) && (
            <div className="flex flex-wrap items-center justify-center gap-3">
              {action && (
                <Button
                  variant="primary"
                  size={size === "lg" ? "lg" : "md"}
                  onClick={action.onClick}
                  icon={action.icon}
                >
                  {action.label}
                </Button>
              )}
              {secondaryAction && (
                <Button
                  variant="outline"
                  size={size === "lg" ? "lg" : "md"}
                  onClick={secondaryAction.onClick}
                  icon={secondaryAction.icon}
                >
                  {secondaryAction.label}
                </Button>
              )}
            </div>
          )}

          {footer && (
            <div className="mt-4 w-full border-t border-gray-200 pt-4">
              {footer}
            </div>
          )}
        </div>
      </div>
    );
  }
);

EmptyState.displayName = "EmptyState";
