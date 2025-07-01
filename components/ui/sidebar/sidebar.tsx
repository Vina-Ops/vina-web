"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

export type SidebarVariant = "default" | "compact" | "expanded";
export type SidebarSize = "sm" | "md" | "lg";

export interface SidebarItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
  items?: SidebarItem[];
  badge?: React.ReactNode;
  onClick?: () => void;
  active?: boolean;
}

export interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The variant of the sidebar
   * @default "default"
   */
  variant?: SidebarVariant;
  /**
   * The size of the sidebar
   * @default "md"
   */
  size?: SidebarSize;
  /**
   * The navigation items
   */
  items?: SidebarItem[];
  /**
   * The logo or brand element
   */
  brand?: React.ReactNode;
  /**
   * Whether the sidebar should be collapsed by default
   * @default false
   */
  defaultCollapsed?: boolean;
  /**
   * Whether the sidebar should be collapsible
   * @default true
   */
  collapsible?: boolean;
  /**
   * Whether the sidebar should be fixed
   * @default false
   */
  fixed?: boolean;
  /**
   * The width of the sidebar when expanded
   * @default "240px"
   */
  width?: string;
  /**
   * The width of the sidebar when collapsed
   * @default "64px"
   */
  collapsedWidth?: string;
}

const variantStyles: Record<SidebarVariant, string> = {
  default: "bg-white dark:bg-gray-800",
  compact: "bg-gray-50 dark:bg-gray-900",
  expanded: "bg-white dark:bg-gray-800 shadow-lg",
};

const sizeStyles: Record<SidebarSize, string> = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
};

export const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  (
    {
      variant = "default",
      size = "md",
      items = [],
      brand,
      defaultCollapsed = false,
      collapsible = true,
      fixed = false,
      width = "300px",
      collapsedWidth = "64px",
      className,
      children,
      ...props
    },
    ref
  ) => {
    const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

    return (
      <div
        ref={ref}
        className={cn(
          "h-[calc(100vh-20px)] max-h-[calc(100vh-20px)]  my-auto flex flex-col justify-center transition-all duration-300 w-full overflow-y-auto sticky top-3 mx-3",
          variantStyles[variant],
          sizeStyles[size],
          // fixed && "fixed top-0 left-0 bottom-0 z-40",
          className
        )}
        style={{
          width: isCollapsed ? collapsedWidth : width,
        }}
        {...props}
      >
        <div className="flex flex-col h-full bg-neutral-50  border border-border rounded-lg">
          {/* Brand */}
          {brand && (
            <div
              className={cn(
                "flex items-center px-4 py-3 mx-auto",
                collapsible && "justify-between"
              )}
            >
              {brand}
              {/* {collapsible && (
                <button
                  onClick={() => setIsCollapsed(!isCollapsed)}
                  className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  {isCollapsed ? (
                    <className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </button>
              )} */}
            </div>
          )}

          {/* Navigation Items */}
          <nav className="flex-1 overflow-y-auto h-[50vh] hide-scrollbar">
            <div className="px-2 py-2 space-y-2">
              {items.map((item, index) => (
                <SidebarItem
                  key={index}
                  item={item}
                  isCollapsed={isCollapsed}
                  size={size}
                />
              ))}
            </div>
          </nav>

          {/* Additional Content */}
          {children}
        </div>
      </div>
    );
  }
);

Sidebar.displayName = "Sidebar";

// SidebarItem component
const SidebarItem: React.FC<{
  item: SidebarItem & { active?: boolean };
  isCollapsed: boolean;
  size: SidebarSize;
}> = ({ item, isCollapsed, size }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (item.items) {
    return (
      <div>
        <button
          className={cn(
            "w-full flex items-center justify-between px-3 py-1 rounded-md ",
            "text-neutral-500 hover:text-leaf-700 dark:text-gray-300 dark:hover:text-white",
            "hover:bg-leaf-50 dark:hover:bg-gray-700",
            item.active && "text-leaf-700 bg-leaf-50 font-semibold"
          )}
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex items-center">
            {item.icon && <span className="mr-4">{item.icon}</span>}
            {!isCollapsed && <span className="text-sm">{item.label}</span>}
          </div>
          {!isCollapsed && (
            <ChevronDown
              className={cn(
                "w-4 h-4 transition-transform",
                isOpen && "transform rotate-180"
              )}
            />
          )}
        </button>
        {!isCollapsed && isOpen && (
          <div className="pl-4 mt-1 space-y-1">
            {item.items.map((subItem, index) => (
              <a
                key={index}
                href={subItem.href}
                className={cn(
                  "flex items-center px-3 py-2 rounded-md",
                  "text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white",
                  "hover:bg-gray-100 dark:hover:bg-gray-700"
                )}
                onClick={subItem.onClick}
              >
                {subItem.icon && <span className="mr-2">{subItem.icon}</span>}
                <span>{subItem.label}</span>
                {subItem.badge && (
                  <span className="ml-auto">{subItem.badge}</span>
                )}
              </a>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <a
      href={item.href}
      className={cn(
        "flex items-center px-3 py-2 rounded-md",
        "text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white",
        "hover:bg-gray-100 dark:hover:bg-gray-700",
        item.active && "text-leaf-700 bg-leaf-50 font-semibold"
      )}
      onClick={item.onClick}
    >
      {item.icon && <span className="mr-2">{item.icon}</span>}
      {!isCollapsed && <span>{item.label}</span>}
      {!isCollapsed && item.badge && (
        <span className="ml-auto">{item.badge}</span>
      )}
    </a>
  );
};
