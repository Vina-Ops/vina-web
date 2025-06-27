import React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export type DrawerVariant = "default" | "bordered" | "shadow";
export type DrawerSize = "sm" | "md" | "lg" | "full";
export type DrawerPosition = "left" | "right" | "top" | "bottom";

export interface DrawerProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Whether the drawer is open
   */
  open?: boolean;
  /**
   * Callback when the drawer opens/closes
   */
  onOpenChange?: (open: boolean) => void;
  /**
   * The default open state
   */
  defaultOpen?: boolean;
  /**
   * The visual variant of the drawer
   */
  variant?: DrawerVariant;
  /**
   * The size of the drawer
   */
  size?: DrawerSize;
  /**
   * The position of the drawer
   */
  position?: DrawerPosition;
  /**
   * The title of the drawer
   */
  title?: string;
  /**
   * Whether to show the close button
   */
  showCloseButton?: boolean;
  /**
   * Whether to show the overlay
   */
  showOverlay?: boolean;
  /**
   * Whether to close the drawer when clicking the overlay
   */
  closeOnOverlayClick?: boolean;
  /**
   * Whether to close the drawer when pressing escape
   */
  closeOnEscape?: boolean;
  /**
   * Whether to lock the body scroll when the drawer is open
   */
  lockScroll?: boolean;
  /**
   * The content of the drawer
   */
  children: React.ReactNode;
  /**
   * The footer content of the drawer
   */
  footer?: React.ReactNode;
}

const variantStyles: Record<DrawerVariant, string> = {
  default: "bg-white",
  bordered: "bg-white border border-gray-200",
  shadow: "bg-white shadow-lg",
};

const sizeStyles: Record<DrawerSize, Record<DrawerPosition, string>> = {
  sm: {
    left: "w-64",
    right: "w-64",
    top: "h-64",
    bottom: "h-64",
  },
  md: {
    left: "w-96",
    right: "w-96",
    top: "h-96",
    bottom: "h-96",
  },
  lg: {
    left: "w-[32rem]",
    right: "w-[32rem]",
    top: "h-[32rem]",
    bottom: "h-[32rem]",
  },
  full: {
    left: "w-full",
    right: "w-full",
    top: "h-full",
    bottom: "h-full",
  },
};

const positionStyles: Record<DrawerPosition, string> = {
  left: "left-0 top-0 bottom-0",
  right: "right-0 top-0 bottom-0",
  top: "top-0 left-0 right-0",
  bottom: "bottom-0 left-0 right-0",
};

export const Drawer = React.forwardRef<HTMLDivElement, DrawerProps>(
  (
    {
      open: controlledOpen,
      onOpenChange,
      defaultOpen = false,
      variant = "default",
      size = "md",
      position = "right",
      title,
      showCloseButton = true,
      showOverlay = true,
      closeOnOverlayClick = true,
      closeOnEscape = true,
      lockScroll = true,
      children,
      footer,
      className,
      ...props
    },
    ref
  ) => {
    const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
    const isControlled = controlledOpen !== undefined;
    const isOpen = isControlled ? controlledOpen : uncontrolledOpen;

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
      const handleEscape = (event: KeyboardEvent) => {
        if (isOpen && closeOnEscape && event.key === "Escape") {
          handleOpenChange(false);
        }
      };

      if (lockScroll && isOpen) {
        document.body.style.overflow = "hidden";
      }

      document.addEventListener("keydown", handleEscape);

      return () => {
        document.removeEventListener("keydown", handleEscape);
        if (lockScroll) {
          document.body.style.overflow = "";
        }
      };
    }, [isOpen, closeOnEscape, lockScroll, handleOpenChange]);

    if (!isOpen) return null;

    return (
      <div
        ref={ref}
        className="fixed inset-0 z-50"
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "drawer-title" : undefined}
        {...props}
      >
        {showOverlay && (
          <div
            className="fixed inset-0 bg-black/50 transition-opacity"
            onClick={() => closeOnOverlayClick && handleOpenChange(false)}
          />
        )}
        <div
          className={cn(
            "fixed z-50 transition-transform duration-300 ease-in-out",
            variantStyles[variant],
            sizeStyles[size][position],
            positionStyles[position],
            className
          )}
        >
          {(title || showCloseButton) && (
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              {title && (
                <h2
                  id="drawer-title"
                  className="text-lg font-medium text-gray-900"
                >
                  {title}
                </h2>
              )}
              {showCloseButton && (
                <button
                  type="button"
                  className="rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                  onClick={() => handleOpenChange(false)}
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
          )}
          <div className="flex h-[calc(100%-4rem)] flex-col">
            <div className="flex-1 overflow-y-auto p-6">{children}</div>
            {footer && (
              <div className="border-t border-gray-200 p-6">{footer}</div>
            )}
          </div>
        </div>
      </div>
    );
  }
);

Drawer.displayName = "Drawer";
