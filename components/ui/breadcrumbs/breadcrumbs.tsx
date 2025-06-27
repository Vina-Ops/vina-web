import React from "react";
import { cn } from "@/lib/utils";
import { ChevronRight, Home } from "lucide-react";

export type BreadcrumbsVariant = "default" | "solid" | "transparent";
export type BreadcrumbsSize = "sm" | "md" | "lg";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
}

export interface BreadcrumbsProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * The variant of the breadcrumbs
   * @default "default"
   */
  variant?: BreadcrumbsVariant;
  /**
   * The size of the breadcrumbs
   * @default "md"
   */
  size?: BreadcrumbsSize;
  /**
   * The breadcrumb items
   */
  items: BreadcrumbItem[];
  /**
   * The separator between items
   * @default <ChevronRight className="w-4 h-4" />
   */
  separator?: React.ReactNode;
  /**
   * Whether to show the home icon for the first item
   * @default false
   */
  showHomeIcon?: boolean;
  /**
   * Whether to show the last item as a link
   * @default false
   */
  showLastItemAsLink?: boolean;
  /**
   * The maximum number of items to show
   * @default undefined (show all items)
   */
  maxItems?: number;
  /**
   * Whether to show the items before the max items
   * @default true
   */
  showItemsBeforeMax?: boolean;
  /**
   * Whether to show the items after the max items
   * @default true
   */
  showItemsAfterMax?: boolean;
}

const variantStyles: Record<BreadcrumbsVariant, string> = {
  default: "text-gray-500 dark:text-gray-400",
  solid: "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300",
  transparent: "text-gray-500 dark:text-gray-400",
};

const sizeStyles: Record<BreadcrumbsSize, string> = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
};

export const Breadcrumbs = React.forwardRef<HTMLElement, BreadcrumbsProps>(
  (
    {
      variant = "default",
      size = "md",
      items,
      separator = <ChevronRight className="w-4 h-4" />,
      showHomeIcon = false,
      showLastItemAsLink = false,
      maxItems,
      showItemsBeforeMax = true,
      showItemsAfterMax = true,
      className,
      ...props
    },
    ref
  ) => {
    const renderItems = () => {
      if (!maxItems || items.length <= maxItems) {
        return items;
      }

      const result: BreadcrumbItem[] = [];
      const itemsBeforeMax = Math.floor((maxItems - 1) / 2);
      const itemsAfterMax = maxItems - 1 - itemsBeforeMax;

      if (showItemsBeforeMax) {
        result.push(...items.slice(0, itemsBeforeMax));
      }

      result.push({
        label: "...",
        href: "#",
      });

      if (showItemsAfterMax) {
        result.push(...items.slice(-itemsAfterMax));
      }

      return result;
    };

    return (
      <nav
        ref={ref}
        className={cn(
          "flex items-center space-x-2",
          variantStyles[variant],
          sizeStyles[size],
          variant === "solid" && "px-4 py-2 rounded-md",
          className
        )}
        aria-label="Breadcrumb"
        {...props}
      >
        <ol className="flex items-center space-x-2">
          {renderItems().map((item, index) => (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <span className="mx-2 text-gray-400" aria-hidden="true">
                  {separator}
                </span>
              )}
              {index === 0 && showHomeIcon ? (
                <a
                  href={item.href}
                  className="flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  onClick={item.onClick}
                >
                  <Home className="w-4 h-4" />
                </a>
              ) : index === items.length - 1 && !showLastItemAsLink ? (
                <span className="text-gray-700 dark:text-gray-300">
                  {item.icon && <span className="mr-1">{item.icon}</span>}
                  {item.label}
                </span>
              ) : (
                <a
                  href={item.href}
                  className="flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  onClick={item.onClick}
                >
                  {item.icon && <span className="mr-1">{item.icon}</span>}
                  {item.label}
                </a>
              )}
            </li>
          ))}
        </ol>
      </nav>
    );
  }
);

Breadcrumbs.displayName = "Breadcrumbs";
