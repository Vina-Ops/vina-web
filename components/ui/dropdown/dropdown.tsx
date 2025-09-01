import React from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export type DropdownVariant = "default" | "primary" | "outline" | "ghost";
export type DropdownSize = "sm" | "md" | "lg";
export type DropdownPlacement =
  | "bottom-start"
  | "bottom-end"
  | "top-start"
  | "top-end";

export interface DropdownItem {
  id: string;
  label?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  selected?: boolean;
  onClick?: () => void;
  children?: DropdownItem[];
  divider?: boolean;
}

export interface DropdownProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The trigger element that opens the dropdown
   */
  trigger?: React.ReactNode;
  /**
   * The items to display in the dropdown
   */
  items: DropdownItem[];
  /**
   * The visual variant of the dropdown trigger
   */
  variant?: DropdownVariant;
  /**
   * The size of the dropdown trigger
   */
  size?: DropdownSize;
  /**
   * The placement of the dropdown menu
   */
  placement?: DropdownPlacement;
  /**
   * Whether the dropdown is open
   */
  open?: boolean;
  /**
   * Callback when the dropdown opens/closes
   */
  onOpenChange?: (open: boolean) => void;
  /**
   * The default open state
   */
  defaultOpen?: boolean;
  /**
   * Whether to close the dropdown when an item is clicked
   */
  closeOnSelect?: boolean;
  /**
   * The width of the dropdown menu
   */
  menuWidth?: number | string;
  /**
   * Whether to show a checkmark for selected items
   */
  showCheckmark?: boolean;
  /**
   * The label for the dropdown trigger
   */
  label?: string;
  /**
   * Whether the dropdown trigger is disabled
   */
  disabled?: boolean;
}

const variantStyles: Record<DropdownVariant, string> = {
  default: "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300",
  primary: "bg-primary-600 text-white hover:bg-primary-700",
  outline:
    "bg-transparent text-gray-700 hover:bg-gray-50 border border-gray-300",
  ghost: "bg-transparent text-gray-700 hover:bg-gray-50",
};

const sizeStyles: Record<DropdownSize, { trigger: string; menu: string }> = {
  sm: {
    trigger: "h-8 px-3 text-sm",
    menu: "text-sm",
  },
  md: {
    trigger: "h-10 px-4 text-base",
    menu: "text-base",
  },
  lg: {
    trigger: "h-12 px-6 text-lg",
    menu: "text-lg",
  },
};

const placementStyles: Record<DropdownPlacement, string> = {
  "bottom-start": "top-full left-0 mt-1",
  "bottom-end": "top-full right-0 mt-1",
  "top-start": "bottom-full left-0 mb-1",
  "top-end": "bottom-full right-0 mb-1",
};

export const Dropdown = React.forwardRef<HTMLDivElement, DropdownProps>(
  (
    {
      trigger,
      items,
      variant = "default",
      size = "md",
      placement = "bottom-start",
      open: controlledOpen,
      onOpenChange,
      defaultOpen = false,
      closeOnSelect = true,
      menuWidth = 200,
      showCheckmark = true,
      label,
      disabled = false,
      className,
      ...props
    },
    ref
  ) => {
    const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
    const isControlled = controlledOpen !== undefined;
    const isOpen = isControlled ? controlledOpen : uncontrolledOpen;
    const triggerRef = React.useRef<HTMLButtonElement>(null);
    const menuRef = React.useRef<HTMLDivElement>(null);

    const handleOpenChange = React.useCallback(
      (newOpen: boolean) => {
        if (!isControlled) {
          setUncontrolledOpen(newOpen);
        }
        onOpenChange?.(newOpen);
      },
      [isControlled, onOpenChange]
    );

    const handleItemClick = React.useCallback(
      (item: DropdownItem) => {
        if (item.disabled) return;
        item.onClick?.();
        if (closeOnSelect) {
          handleOpenChange(false);
        }
      },
      [closeOnSelect, handleOpenChange]
    );

    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          isOpen &&
          triggerRef.current &&
          menuRef.current &&
          !triggerRef.current.contains(event.target as Node) &&
          !menuRef.current.contains(event.target as Node)
        ) {
          handleOpenChange(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen, handleOpenChange]);

    const renderTrigger = () => {
      if (trigger) return trigger;

      return (
        <button
          ref={triggerRef}
          type="button"
          className={cn(
            "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2",
            variantStyles[variant],
            sizeStyles[size].trigger,
            disabled && "opacity-50 cursor-not-allowed"
          )}
          onClick={() => !disabled && handleOpenChange(!isOpen)}
          disabled={disabled}
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          {label}
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform duration-200",
              isOpen && "transform rotate-180"
            )}
          />
        </button>
      );
    };

    const renderMenuItem = (item: DropdownItem) => {
      if (item.divider) {
        return (
          <div
            key={item.id}
            className="my-1 border-t border-gray-200"
            role="separator"
          />
        );
      }

      return (
        <button
          key={item.id}
          className={cn(
            "w-full flex items-center gap-2 px-4 py-2 text-left transition-colors",
            sizeStyles[size].menu,
            item.disabled
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-gray-100 cursor-pointer",
            item.selected && "bg-gray-50"
          )}
          onClick={() => handleItemClick(item)}
          disabled={item.disabled}
          role="menuitem"
          aria-disabled={item.disabled}
        >
          {item.icon}
          <span className="flex-grow">{item.label}</span>
          {showCheckmark && item.selected && (
            <Check className="h-4 w-4 text-primary-600" />
          )}
        </button>
      );
    };

    return (
      <div
        ref={ref}
        className={cn("relative inline-block", className)}
        {...props}
      >
        {renderTrigger()}
        {isOpen && (
          <div
            ref={menuRef}
            className={cn(
              "absolute z-[9999] min-w-[200px] rounded-md border border-gray-200 bg-white shadow-lg",
              placementStyles[placement]
            )}
            style={{ width: menuWidth }}
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="dropdown-trigger"
          >
            <div className="py-1">{items.map(renderMenuItem)}</div>
          </div>
        )}
      </div>
    );
  }
);

Dropdown.displayName = "Dropdown";
