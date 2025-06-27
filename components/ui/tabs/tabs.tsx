import React from "react";
import { cn } from "@/lib/utils";

export type TabVariant = "line" | "enclosed" | "soft-rounded" | "solid-rounded";
export type TabSize = "sm" | "md" | "lg";
export type TabOrientation = "horizontal" | "vertical";

export interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export interface TabsProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  items: TabItem[];
  value?: string;
  onChange?: (value: string) => void;
  variant?: TabVariant;
  size?: TabSize;
  orientation?: TabOrientation;
  fullWidth?: boolean;
  className?: string;
}

const variantStyles: Record<TabVariant, string> = {
  line: "border-b border-gray-200",
  enclosed: "border border-gray-200 rounded-lg p-1",
  "soft-rounded": "space-x-1",
  "solid-rounded": "space-x-1",
};

const tabStyles: Record<TabVariant, string> = {
  line: "border-b-2 border-transparent hover:border-gray-300 data-[state=active]:border-blue-500",
  enclosed:
    "rounded-md hover:bg-gray-100 data-[state=active]:bg-white data-[state=active]:shadow-sm",
  "soft-rounded":
    "rounded-md hover:bg-gray-100 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600",
  "solid-rounded":
    "rounded-md hover:bg-gray-100 data-[state=active]:bg-blue-500 data-[state=active]:text-white",
};

const sizeStyles: Record<TabSize, string> = {
  sm: "text-sm px-3 py-1.5",
  md: "text-base px-4 py-2",
  lg: "text-lg px-6 py-3",
};

export const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  (
    {
      items,
      value,
      onChange,
      variant = "line",
      size = "md",
      orientation = "horizontal",
      fullWidth = false,
      className,
      ...props
    },
    ref
  ) => {
    const [selectedTab, setSelectedTab] = React.useState(value || items[0]?.id);

    React.useEffect(() => {
      if (value !== undefined) {
        setSelectedTab(value);
      }
    }, [value]);

    const handleTabClick = (tabId: string) => {
      if (onChange) {
        onChange(tabId);
      } else {
        setSelectedTab(tabId);
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent, tabId: string) => {
      const currentIndex = items.findIndex((item) => item.id === tabId);
      let nextIndex = currentIndex;

      if (orientation === "horizontal") {
        if (e.key === "ArrowLeft") {
          nextIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
        } else if (e.key === "ArrowRight") {
          nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
        }
      } else {
        if (e.key === "ArrowUp") {
          nextIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
        } else if (e.key === "ArrowDown") {
          nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
        }
      }

      if (
        e.key === "ArrowLeft" ||
        e.key === "ArrowRight" ||
        e.key === "ArrowUp" ||
        e.key === "ArrowDown"
      ) {
        e.preventDefault();
        const nextTab = items[nextIndex];
        if (!nextTab.disabled) {
          handleTabClick(nextTab.id);
        }
      }
    };

    return (
      <div
        ref={ref}
        className={cn(
          "w-full",
          orientation === "vertical" && "flex",
          className
        )}
        {...props}
      >
        <div
          role="tablist"
          className={cn(
            "flex",
            orientation === "vertical" && "flex-col",
            variantStyles[variant],
            fullWidth && "w-full"
          )}
          aria-orientation={orientation}
        >
          {items.map((item) => (
            <button
              key={item.id}
              role="tab"
              aria-selected={selectedTab === item.id}
              aria-controls={`panel-${item.id}`}
              tabIndex={selectedTab === item.id ? 0 : -1}
              disabled={item.disabled}
              onClick={() => !item.disabled && handleTabClick(item.id)}
              onKeyDown={(e) => handleKeyDown(e, item.id)}
              className={cn(
                "flex items-center gap-2 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",
                tabStyles[variant],
                sizeStyles[size],
                fullWidth && "flex-1 justify-center",
                orientation === "vertical" && "w-full justify-start"
              )}
              data-state={selectedTab === item.id ? "active" : "inactive"}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
        {items.map((item) => (
          <div
            key={item.id}
            role="tabpanel"
            id={`panel-${item.id}`}
            aria-labelledby={item.id}
            hidden={selectedTab !== item.id}
            className={cn("mt-4", orientation === "vertical" && "ml-4 flex-1")}
          >
            {item.content}
          </div>
        ))}
      </div>
    );
  }
);

Tabs.displayName = "Tabs";
