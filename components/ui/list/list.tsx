import React from "react";
import { cn } from "@/lib/utils";

export type ListVariant = "default" | "bordered" | "striped" | "hover";
export type ListSize = "sm" | "md" | "lg";
export type ListLayout = "vertical" | "horizontal";

export interface ListProps extends React.HTMLAttributes<HTMLUListElement> {
  /**
   * The visual variant of the list
   */
  variant?: ListVariant;
  /**
   * The size of the list items
   */
  size?: ListSize;
  /**
   * The layout direction of the list
   */
  layout?: ListLayout;
  /**
   * Whether the list is interactive
   */
  interactive?: boolean;
  /**
   * Whether to show dividers between items
   */
  dividers?: boolean;
  /**
   * The maximum number of items to show
   */
  maxItems?: number;
  /**
   * The text to show when there are no items
   */
  emptyText?: string;
  /**
   * The icon to show when there are no items
   */
  emptyIcon?: React.ReactNode;
}

export interface ListItemProps extends React.LiHTMLAttributes<HTMLLIElement> {
  /**
   * The main content of the list item
   */
  children: React.ReactNode;
  /**
   * The icon to show before the content
   */
  icon?: React.ReactNode;
  /**
   * The icon to show after the content
   */
  endIcon?: React.ReactNode;
  /**
   * Whether the item is disabled
   */
  disabled?: boolean;
  /**
   * Whether the item is selected
   */
  selected?: boolean;
}

const variantStyles: Record<ListVariant, string> = {
  default: "divide-y divide-gray-200",
  bordered: "divide-y divide-gray-200 border border-gray-200 rounded-lg",
  striped: "divide-y divide-gray-200 [&>li:nth-child(odd)]:bg-gray-50",
  hover: "divide-y divide-gray-200 [&>li:hover]:bg-gray-50",
};

const sizeStyles: Record<ListSize, string> = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
};

const layoutStyles: Record<ListLayout, string> = {
  vertical: "flex flex-col",
  horizontal: "flex flex-row flex-wrap gap-2",
};

export const List = React.forwardRef<HTMLUListElement, ListProps>(
  (
    {
      variant = "default",
      size = "md",
      layout = "vertical",
      interactive = false,
      dividers = true,
      maxItems,
      emptyText = "No items",
      emptyIcon,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const items = React.Children.toArray(children);
    const displayItems = maxItems ? items.slice(0, maxItems) : items;

    if (items.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center p-4 text-center text-gray-500">
          {emptyIcon}
          <p className="mt-2">{emptyText}</p>
        </div>
      );
    }

    return (
      <ul
        ref={ref}
        role="list"
        className={cn(
          "list-none p-0 m-0",
          variantStyles[variant],
          sizeStyles[size],
          layoutStyles[layout],
          !dividers && "divide-y-0",
          interactive && "cursor-pointer",
          className
        )}
        {...props}
      >
        {displayItems}
      </ul>
    );
  }
);

List.displayName = "List";

export const ListItem = React.forwardRef<HTMLLIElement, ListItemProps>(
  (
    {
      children,
      icon,
      endIcon,
      disabled = false,
      selected = false,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <li
        ref={ref}
        role="listitem"
        className={cn(
          "flex items-center gap-3 px-4 py-2",
          disabled && "opacity-50 cursor-not-allowed",
          selected && "bg-primary-50 text-primary-700",
          className
        )}
        {...props}
      >
        {icon && <span className="flex-shrink-0">{icon}</span>}
        <span className="flex-grow">{children}</span>
        {endIcon && <span className="flex-shrink-0">{endIcon}</span>}
      </li>
    );
  }
);

ListItem.displayName = "ListItem";

// List Group Component
export interface ListGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The title of the list group
   */
  title?: string;
  /**
   * The description of the list group
   */
  description?: string;
}

export const ListGroup = React.forwardRef<HTMLDivElement, ListGroupProps>(
  ({ title, description, className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex flex-col gap-1", className)}
        {...props}
      >
        {title && (
          <h3 className="text-sm font-medium text-gray-700">{title}</h3>
        )}
        {description && <p className="text-sm text-gray-500">{description}</p>}
        {children}
      </div>
    );
  }
);

ListGroup.displayName = "ListGroup";
