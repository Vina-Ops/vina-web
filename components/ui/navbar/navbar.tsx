import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";

export type NavbarVariant = "default" | "transparent" | "bordered";
export type NavbarSize = "sm" | "md" | "lg";

export interface NavItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
  items?: NavItem[];
  onClick?: () => void;
}

export interface NavbarProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * The variant of the navbar
   * @default "default"
   */
  variant?: NavbarVariant;
  /**
   * The size of the navbar
   * @default "md"
   */
  size?: NavbarSize;
  /**
   * The logo or brand element
   */
  brand?: React.ReactNode;
  /**
   * The navigation items
   */
  items?: NavItem[];
  /**
   * The items to be displayed on the right side
   */
  rightItems?: NavItem[];
  /**
   * Whether the navbar should be fixed to the top
   * @default false
   */
  fixed?: boolean;
  /**
   * Whether the navbar should be sticky
   * @default false
   */
  sticky?: boolean;
  /**
   * Whether the navbar should be transparent
   * @default false
   */
  transparent?: boolean;
  /**
   * The maximum width of the navbar content
   * @default "lg"
   */
  maxWidth?: "sm" | "md" | "lg" | "xl" | "full";
}

const variantStyles: Record<NavbarVariant, string> = {
  default: "bg-white dark:bg-gray-800 shadow-sm",
  transparent: "bg-transparent",
  bordered:
    "bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700",
};

const sizeStyles: Record<NavbarSize, string> = {
  sm: "h-12",
  md: "h-16",
  lg: "h-20",
};

const maxWidthStyles: Record<NonNullable<NavbarProps["maxWidth"]>, string> = {
  sm: "max-w-screen-sm",
  md: "max-w-screen-md",
  lg: "max-w-screen-lg",
  xl: "max-w-screen-xl",
  full: "max-w-full",
};

export const Navbar = React.forwardRef<HTMLElement, NavbarProps>(
  (
    {
      variant = "default",
      size = "md",
      brand,
      items = [],
      rightItems = [],
      fixed = false,
      sticky = false,
      transparent = false,
      maxWidth = "lg",
      className,
      children,
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <nav
        ref={ref}
        className={cn(
          "w-full",
          variantStyles[variant],
          sizeStyles[size],
          fixed && "fixed top-0 left-0 right-0 z-50",
          sticky && "sticky top-0 z-50",
          transparent && "bg-transparent",
          className
        )}
        {...props}
      >
        <div
          className={cn(
            "h-full mx-auto px-4",
            maxWidthStyles[maxWidth],
            "flex items-center justify-between"
          )}
        >
          {/* Brand */}
          <div className="flex items-center">{brand}</div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {items.map((item, index) => (
              <NavItem key={index} item={item} />
            ))}
          </div>

          {/* Right Items */}
          <div className="hidden md:flex items-center space-x-4">
            {rightItems.map((item, index) => (
              <NavItem key={index} item={item} />
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {items.map((item, index) => (
                <MobileNavItem key={index} item={item} />
              ))}
              {rightItems.map((item, index) => (
                <MobileNavItem key={index} item={item} />
              ))}
            </div>
          </div>
        )}
      </nav>
    );
  }
);

Navbar.displayName = "Navbar";

// NavItem component for desktop navigation
const NavItem: React.FC<{ item: NavItem }> = ({ item }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (item.items) {
    return (
      <div className="relative">
        <button
          className="flex items-center space-x-1 px-3 py-2 rounded-md text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {item.icon && <span className="mr-2">{item.icon}</span>}
          <span>{item.label}</span>
        </button>
        {isOpen && (
          <div className="absolute top-full left-0 mt-1 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5">
            <div className="py-1">
              {item.items.map((subItem, index) => (
                <a
                  key={index}
                  href={subItem.href}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                  onClick={subItem.onClick}
                >
                  {subItem.icon && <span className="mr-2">{subItem.icon}</span>}
                  {subItem.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <a
      href={item.href}
      className="flex items-center space-x-1 px-3 py-2 rounded-md text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
      onClick={item.onClick}
    >
      {item.icon && <span className="mr-2">{item.icon}</span>}
      <span>{item.label}</span>
    </a>
  );
};

// MobileNavItem component for mobile navigation
const MobileNavItem: React.FC<{ item: NavItem }> = ({ item }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (item.items) {
    return (
      <div>
        <button
          className="w-full flex items-center justify-between px-3 py-2 rounded-md text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex items-center">
            {item.icon && <span className="mr-2">{item.icon}</span>}
            <span>{item.label}</span>
          </div>
        </button>
        {isOpen && (
          <div className="pl-4">
            {item.items.map((subItem, index) => (
              <a
                key={index}
                href={subItem.href}
                className="block px-3 py-2 rounded-md text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                onClick={subItem.onClick}
              >
                {subItem.icon && <span className="mr-2">{subItem.icon}</span>}
                {subItem.label}
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
      className="block px-3 py-2 rounded-md text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
      onClick={item.onClick}
    >
      {item.icon && <span className="mr-2">{item.icon}</span>}
      {item.label}
    </a>
  );
};
