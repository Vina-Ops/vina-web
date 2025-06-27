import React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export type PopoverVariant = "default" | "bordered" | "shadow";
export type PopoverSize = "sm" | "md" | "lg";
export type PopoverPlacement =
  | "top"
  | "top-start"
  | "top-end"
  | "bottom"
  | "bottom-start"
  | "bottom-end"
  | "left"
  | "left-start"
  | "left-end"
  | "right"
  | "right-start"
  | "right-end";

export interface PopoverProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The trigger element that opens the popover
   */
  trigger?: React.ReactNode;
  /**
   * The content to display in the popover
   */
  content: React.ReactNode;
  /**
   * The visual variant of the popover
   */
  variant?: PopoverVariant;
  /**
   * The size of the popover
   */
  size?: PopoverSize;
  /**
   * The placement of the popover
   */
  placement?: PopoverPlacement;
  /**
   * Whether the popover is open
   */
  open?: boolean;
  /**
   * Callback when the popover opens/closes
   */
  onOpenChange?: (open: boolean) => void;
  /**
   * The default open state
   */
  defaultOpen?: boolean;
  /**
   * Whether to show the close button
   */
  showCloseButton?: boolean;
  /**
   * The title of the popover
   */
  title?: string;
  /**
   * The width of the popover
   */
  width?: number | string;
  /**
   * The offset from the trigger element
   */
  offset?: number;
  /**
   * Whether to show an arrow pointing to the trigger
   */
  showArrow?: boolean;
  /**
   * Whether the popover is disabled
   */
  disabled?: boolean;
  /**
   * Whether to close the popover when clicking outside
   */
  closeOnClickOutside?: boolean;
  /**
   * Whether to close the popover when pressing escape
   */
  closeOnEscape?: boolean;
}

const variantStyles: Record<PopoverVariant, string> = {
  default: "bg-white",
  bordered: "bg-white border border-gray-200",
  shadow: "bg-white shadow-lg",
};

const sizeStyles: Record<PopoverSize, { content: string; title: string }> = {
  sm: {
    content: "p-3 text-sm",
    title: "text-sm px-3 py-2",
  },
  md: {
    content: "p-4 text-base",
    title: "text-base px-4 py-3",
  },
  lg: {
    content: "p-5 text-lg",
    title: "text-lg px-5 py-4",
  },
};

const placementStyles: Record<PopoverPlacement, string> = {
  top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
  "top-start": "bottom-full left-0 mb-2",
  "top-end": "bottom-full right-0 mb-2",
  bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
  "bottom-start": "top-full left-0 mt-2",
  "bottom-end": "top-full right-0 mt-2",
  left: "right-full top-1/2 -translate-y-1/2 mr-2",
  "left-start": "right-full top-0 mr-2",
  "left-end": "right-full bottom-0 mr-2",
  right: "left-full top-1/2 -translate-y-1/2 ml-2",
  "right-start": "left-full top-0 ml-2",
  "right-end": "left-full bottom-0 ml-2",
};

const arrowPlacementStyles: Record<PopoverPlacement, string> = {
  top: "bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rotate-45",
  "top-start": "bottom-0 left-4 translate-y-1/2 rotate-45",
  "top-end": "bottom-0 right-4 translate-y-1/2 rotate-45",
  bottom: "top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-45",
  "bottom-start": "top-0 left-4 -translate-y-1/2 rotate-45",
  "bottom-end": "top-0 right-4 -translate-y-1/2 rotate-45",
  left: "right-0 top-1/2 -translate-y-1/2 translate-x-1/2 rotate-45",
  "left-start": "right-0 top-4 translate-x-1/2 rotate-45",
  "left-end": "right-0 bottom-4 translate-x-1/2 rotate-45",
  right: "left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 rotate-45",
  "right-start": "left-0 top-4 -translate-x-1/2 rotate-45",
  "right-end": "left-0 bottom-4 -translate-x-1/2 rotate-45",
};

export const Popover = React.forwardRef<HTMLDivElement, PopoverProps>(
  (
    {
      trigger,
      content,
      variant = "default",
      size = "md",
      placement = "bottom",
      open: controlledOpen,
      onOpenChange,
      defaultOpen = false,
      showCloseButton = true,
      title,
      width = 300,
      offset = 0,
      showArrow = true,
      disabled = false,
      closeOnClickOutside = true,
      closeOnEscape = true,
      className,
      ...props
    },
    ref
  ) => {
    const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
    const isControlled = controlledOpen !== undefined;
    const isOpen = isControlled ? controlledOpen : uncontrolledOpen;
    const triggerRef = React.useRef<HTMLDivElement>(null);
    const popoverRef = React.useRef<HTMLDivElement>(null);

    const handleOpenChange = React.useCallback(
      (newOpen: boolean) => {
        if (!isControlled) {
          setUncontrolledOpen(newOpen);
        }
        onOpenChange?.(newOpen);
      },
      [isControlled, onOpenChange]
    );

    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          isOpen &&
          closeOnClickOutside &&
          triggerRef.current &&
          popoverRef.current &&
          !triggerRef.current.contains(event.target as Node) &&
          !popoverRef.current.contains(event.target as Node)
        ) {
          handleOpenChange(false);
        }
      };

      const handleEscape = (event: KeyboardEvent) => {
        if (isOpen && closeOnEscape && event.key === "Escape") {
          handleOpenChange(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        document.removeEventListener("keydown", handleEscape);
      };
    }, [isOpen, closeOnClickOutside, closeOnEscape, handleOpenChange]);

    return (
      <div
        ref={ref}
        className={cn("relative inline-block", className)}
        {...props}
      >
        <div
          ref={triggerRef}
          onClick={() => !disabled && handleOpenChange(!isOpen)}
          className={
            disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
          }
        >
          {trigger}
        </div>
        {isOpen && (
          <div
            ref={popoverRef}
            className={cn(
              "absolute z-50 rounded-md",
              variantStyles[variant],
              placementStyles[placement]
            )}
            style={{
              width,
              transform: `translate(${offset}px, ${offset}px)`,
            }}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? "popover-title" : undefined}
          >
            {title && (
              <div
                className={cn(
                  "flex items-center justify-between border-b border-gray-200",
                  sizeStyles[size].title
                )}
              >
                <h3 id="popover-title" className="font-medium">
                  {title}
                </h3>
                {showCloseButton && (
                  <button
                    type="button"
                    className="ml-2 rounded-md p-1 hover:bg-gray-100"
                    onClick={() => handleOpenChange(false)}
                    aria-label="Close"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            )}
            <div className={sizeStyles[size].content}>{content}</div>
            {showArrow && (
              <div
                className={cn(
                  "absolute h-2 w-2 bg-white",
                  variant === "bordered" && "border border-gray-200",
                  arrowPlacementStyles[placement]
                )}
              />
            )}
          </div>
        )}
      </div>
    );
  }
);

Popover.displayName = "Popover";
