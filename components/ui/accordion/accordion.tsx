import React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export type AccordionVariant = "default" | "bordered" | "separated";
export type AccordionSize = "sm" | "md" | "lg";

export interface AccordionProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  /**
   * The visual variant of the accordion
   */
  variant?: AccordionVariant;
  /**
   * The size of the accordion items
   */
  size?: AccordionSize;
  /**
   * Whether multiple items can be expanded at once
   */
  multiple?: boolean;
  /**
   * The default expanded items
   */
  defaultExpanded?: string[];
  /**
   * Callback when an item is expanded/collapsed
   */
  onChange?: (expandedItems: string[]) => void;
  /**
   * Whether to show the chevron icon
   */
  showChevron?: boolean;
  /**
   * Whether to animate the chevron rotation
   */
  animateChevron?: boolean;
}

export interface AccordionItemProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /**
   * The unique identifier for the accordion item
   */
  id: string;
  /**
   * The title of the accordion item
   */
  title: React.ReactNode;
  /**
   * The content of the accordion item
   */
  children: React.ReactNode;
  /**
   * Whether the item is disabled
   */
  disabled?: boolean;
  /**
   * The icon to show before the title
   */
  icon?: React.ReactNode;
  /**
   * The icon to show after the title
   */
  endIcon?: React.ReactNode;
}

const variantStyles: Record<AccordionVariant, string> = {
  default: "divide-y divide-gray-200",
  bordered: "divide-y divide-gray-200 border border-gray-200 rounded-lg",
  separated: "space-y-2",
};

const sizeStyles: Record<AccordionSize, { header: string; content: string }> = {
  sm: {
    header: "py-2 px-3 text-sm",
    content: "py-2 px-3 text-sm",
  },
  md: {
    header: "py-3 px-4 text-base",
    content: "py-3 px-4 text-base",
  },
  lg: {
    header: "py-4 px-5 text-lg",
    content: "py-4 px-5 text-lg",
  },
};

const AccordionContext = React.createContext<{
  expandedItems: string[];
  toggleItem: (id: string) => void;
  multiple: boolean;
  size: AccordionSize;
  showChevron: boolean;
  animateChevron: boolean;
}>({
  expandedItems: [],
  toggleItem: () => {},
  multiple: false,
  size: "md",
  showChevron: true,
  animateChevron: true,
});

export const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
  (
    {
      variant = "default",
      size = "md",
      multiple = false,
      defaultExpanded = [],
      onChange,
      showChevron = true,
      animateChevron = true,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const [expandedItems, setExpandedItems] =
      React.useState<string[]>(defaultExpanded);

    const toggleItem = React.useCallback(
      (id: string) => {
        setExpandedItems((prev) => {
          let newExpanded: string[];
          if (multiple) {
            newExpanded = prev.includes(id)
              ? prev.filter((item) => item !== id)
              : [...prev, id];
          } else {
            newExpanded = prev.includes(id) ? [] : [id];
          }
          onChange?.(newExpanded);
          return newExpanded;
        });
      },
      [multiple, onChange]
    );

    return (
      <AccordionContext.Provider
        value={{
          expandedItems,
          toggleItem,
          multiple,
          size,
          showChevron,
          animateChevron,
        }}
      >
        <div
          ref={ref}
          className={cn(variantStyles[variant], className)}
          {...props}
        >
          {children}
        </div>
      </AccordionContext.Provider>
    );
  }
);

Accordion.displayName = "Accordion";

export const AccordionItem = React.forwardRef<
  HTMLDivElement,
  AccordionItemProps
>(
  (
    {
      id,
      title,
      children,
      disabled = false,
      icon,
      endIcon,
      className,
      ...props
    },
    ref
  ) => {
    const { expandedItems, toggleItem, size, showChevron, animateChevron } =
      React.useContext(AccordionContext);

    const isExpanded = expandedItems.includes(id);

    return (
      <div
        ref={ref}
        className={cn(
          "w-full",
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
        {...props}
      >
        <button
          type="button"
          className={cn(
            "flex w-full items-center justify-between gap-2 text-left hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded transition-colors",
            sizeStyles[size].header,
            disabled && "cursor-not-allowed hover:bg-transparent"
          )}
          onClick={() => !disabled && toggleItem(id)}
          disabled={disabled}
          aria-expanded={isExpanded}
          aria-controls={`accordion-content-${id}`}
          id={`accordion-header-${id}`}
        >
          <div className="flex items-center gap-2">
            {icon && <span className="flex-shrink-0">{icon}</span>}
            <span className="font-medium">{title}</span>
          </div>
          <div className="flex items-center gap-2">
            {endIcon && <span className="flex-shrink-0">{endIcon}</span>}
            {showChevron && (
              <ChevronDown
                className={cn(
                  "h-5 w-5 text-gray-400 transition-transform",
                  animateChevron && "duration-200",
                  isExpanded && "rotate-180"
                )}
              />
            )}
          </div>
        </button>
        <div
          id={`accordion-content-${id}`}
          role="region"
          aria-labelledby={`accordion-header-${id}`}
          className={cn(
            "overflow-hidden transition-all duration-200 ease-in-out",
            isExpanded ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <div className={sizeStyles[size].content}>{children}</div>
        </div>
      </div>
    );
  }
);

AccordionItem.displayName = "AccordionItem";
