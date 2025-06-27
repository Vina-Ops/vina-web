import React from "react";
import { cn } from "@/lib/utils";

export type ContainerSize = "sm" | "md" | "lg" | "xl" | "full";
export type ContainerPadding = "none" | "sm" | "md" | "lg";

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The maximum width of the container
   * @default "lg"
   */
  size?: ContainerSize;
  /**
   * The padding around the container
   * @default "md"
   */
  padding?: ContainerPadding;
  /**
   * Whether the container should be centered
   * @default true
   */
  centered?: boolean;
  /**
   * Whether the container should take full height
   * @default false
   */
  fullHeight?: boolean;
  /**
   * Whether the container should have a background color
   * @default false
   */
  withBackground?: boolean;
}

const sizeStyles: Record<ContainerSize, string> = {
  sm: "max-w-screen-sm",
  md: "max-w-screen-md",
  lg: "max-w-screen-lg",
  xl: "max-w-screen-xl",
  full: "max-w-full",
};

const paddingStyles: Record<ContainerPadding, string> = {
  none: "p-0",
  sm: "px-4 py-2",
  md: "px-6 py-4",
  lg: "px-8 py-6",
};

export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  (
    {
      size = "lg",
      padding = "md",
      centered = true,
      fullHeight = false,
      withBackground = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          sizeStyles[size],
          paddingStyles[padding],
          centered && "mx-auto",
          fullHeight && "h-full",
          withBackground && "bg-white dark:bg-gray-800",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Container.displayName = "Container";
