import React from "react";
import { cn } from "@/lib/utils";

export type SkeletonVariant = "default" | "rounded" | "circular";
export type SkeletonSize = "sm" | "md" | "lg";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The visual variant of the skeleton
   */
  variant?: SkeletonVariant;
  /**
   * The size of the skeleton
   */
  size?: SkeletonSize;
  /**
   * Whether the skeleton is animated
   */
  animated?: boolean;
  /**
   * The width of the skeleton
   */
  width?: string | number;
  /**
   * The height of the skeleton
   */
  height?: string | number;
  /**
   * Whether the skeleton is disabled
   */
  disabled?: boolean;
}

const variantStyles: Record<SkeletonVariant, string> = {
  default: "rounded",
  rounded: "rounded-lg",
  circular: "rounded-full",
};

const sizeStyles: Record<SkeletonSize, string> = {
  sm: "h-4",
  md: "h-6",
  lg: "h-8",
};

export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  (
    {
      variant = "default",
      size = "md",
      animated = true,
      width,
      height,
      disabled = false,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "bg-gray-200",
          variantStyles[variant],
          !height && sizeStyles[size],
          animated && !disabled && "animate-pulse",
          disabled && "opacity-50",
          className
        )}
        style={{
          width: width,
          height: height,
        }}
        {...props}
      />
    );
  }
);

Skeleton.displayName = "Skeleton";

// Common skeleton layouts
export const SkeletonText = React.forwardRef<
  HTMLDivElement,
  SkeletonProps & { lines?: number }
>(({ lines = 3, className, ...props }, ref) => {
  return (
    <div ref={ref} className={cn("space-y-2", className)} {...props}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          variant="default"
          size="md"
          width={i === lines - 1 ? "60%" : "100%"}
          {...props}
        />
      ))}
    </div>
  );
});

SkeletonText.displayName = "SkeletonText";

export const SkeletonAvatar = React.forwardRef<HTMLDivElement, SkeletonProps>(
  (props, ref) => {
    return (
      <Skeleton
        ref={ref}
        variant="circular"
        size="lg"
        width={40}
        height={40}
        {...props}
      />
    );
  }
);

SkeletonAvatar.displayName = "SkeletonAvatar";

export const SkeletonImage = React.forwardRef<HTMLDivElement, SkeletonProps>(
  (props, ref) => {
    return (
      <Skeleton
        ref={ref}
        variant="rounded"
        width="100%"
        height={200}
        {...props}
      />
    );
  }
);

SkeletonImage.displayName = "SkeletonImage";

export const SkeletonButton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  (props, ref) => {
    return (
      <Skeleton
        ref={ref}
        variant="rounded"
        size="md"
        width={100}
        height={36}
        {...props}
      />
    );
  }
);

SkeletonButton.displayName = "SkeletonButton";

export const SkeletonCard = React.forwardRef<HTMLDivElement, SkeletonProps>(
  (props, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "p-4 space-y-4 border border-gray-200 rounded-lg",
          props.className
        )}
        {...props}
      >
        <Skeleton variant="rounded" size="lg" width="100%" height={160} />
        <div className="space-y-2">
          <Skeleton variant="default" size="md" width="80%" />
          <Skeleton variant="default" size="sm" width="60%" />
        </div>
        <div className="flex justify-between items-center">
          <Skeleton variant="circular" size="sm" width={24} height={24} />
          <Skeleton variant="rounded" size="sm" width={80} height={24} />
        </div>
      </div>
    );
  }
);

SkeletonCard.displayName = "SkeletonCard";
