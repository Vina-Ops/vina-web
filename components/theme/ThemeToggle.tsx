import { useState, useRef, useEffect } from "react";
import { useTheme } from "./ThemeProvider";
import { Sun, Moon, Monitor } from "lucide-react";

interface PositionConfig {
  placement?: "top" | "bottom" | "left" | "right" | "auto";
  offset?: number;
  mobilePlacement?: "top" | "bottom" | "left" | "right" | "auto";
  mobileOffset?: number;
  maxWidth?: string;
  mobileMaxWidth?: string;
}

interface ThemeToggleProps {
  position?: PositionConfig;
  className?: string;
  compact?: boolean;
}

export const ThemeToggle = ({
  position = {},
  className = "",
  compact = false,
}: ThemeToggleProps = {}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<{
    top: number;
    left: number;
    right?: number;
  }>({ top: 0, left: 0, right: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Always call useTheme, but handle the error in the component
  const { theme, resolvedTheme, setTheme, isSystem } = useTheme();

  // Calculate dropdown position
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const isMobile = viewportWidth < 768;

      const {
        placement = "auto",
        offset = 8,
        mobilePlacement = "bottom",
        mobileOffset = 8,
        maxWidth = "180px",
        mobileMaxWidth = "200px",
      } = position;

      const effectivePlacement = isMobile ? mobilePlacement : placement;
      const effectiveOffset = isMobile ? mobileOffset : offset;
      const effectiveMaxWidth = isMobile ? mobileMaxWidth : maxWidth;

      let newPosition: { top: number; left: number; right?: number } = {
        top: 0,
        left: 0,
        right: 0,
      };

      if (effectivePlacement === "auto") {
        // Auto-detect best placement
        const spaceBelow = viewportHeight - buttonRect.bottom;
        const spaceAbove = buttonRect.top;
        const spaceRight = viewportWidth - buttonRect.right;
        const spaceLeft = buttonRect.left;

        if (spaceBelow >= 150 || spaceBelow > spaceAbove) {
          newPosition = {
            top: buttonRect.bottom + effectiveOffset,
            left:
              spaceRight >= 180
                ? buttonRect.left
                : Math.max(8, buttonRect.right - 180),
            right: spaceRight < 180 ? 8 : undefined,
          };
        } else {
          newPosition = {
            top: buttonRect.top - 150 - effectiveOffset,
            left:
              spaceRight >= 180
                ? buttonRect.left
                : Math.max(8, buttonRect.right - 180),
            right: spaceRight < 180 ? 8 : undefined,
          };
        }
      } else {
        // Use specified placement
        switch (effectivePlacement) {
          case "bottom":
            newPosition = {
              top: buttonRect.bottom + effectiveOffset,
              left: buttonRect.left,
              right: undefined,
            };
            break;
          case "top":
            newPosition = {
              top: buttonRect.top - 150 - effectiveOffset,
              left: buttonRect.left,
              right: undefined,
            };
            break;
          case "right":
            newPosition = {
              top: buttonRect.top,
              left: buttonRect.right + effectiveOffset,
              right: undefined,
            };
            break;
          case "left":
            newPosition = {
              top: buttonRect.top,
              left: buttonRect.left - 180 - effectiveOffset,
              right: undefined,
            };
            break;
        }
      }

      setDropdownPosition(newPosition);
    }
  }, [isOpen, position]);

  const themes = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Monitor },
  ] as const;

  const currentTheme = themes.find((t) => t.value === theme);
  const CurrentIcon = currentTheme?.icon || Monitor;

  return (
    <div className={`relative ${className}`}>
      {/* Main toggle button */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={`Current theme: ${currentTheme?.label}. Click to change theme`}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        className={`relative flex justify-center items-center rounded-full border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green focus:ring-offset-2 dark:focus:ring-offset-gray-900 group ${
          compact ? "p-1.5" : "p-2"
        }`}
        type="button"
      >
        <CurrentIcon
          className={`transition-transform duration-200 group-hover:scale-110 ${
            compact ? "w-4 h-4" : "w-5 h-5"
          }`}
        />

        {/* System indicator */}
        {isSystem && (
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-green rounded-full animate-pulse" />
        )}
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-[999]"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* Menu */}
          <div
            ref={dropdownRef}
            className="fixed bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-[9998]"
            style={{
              top: dropdownPosition.top,
              left: dropdownPosition.left,
              right: dropdownPosition.right,
              maxWidth:
                window.innerWidth < 768
                  ? position.mobileMaxWidth || "200px"
                  : position.maxWidth || "180px",
              minWidth: "140px",
            }}
            role="listbox"
            aria-label="Theme options"
          >
            {themes.map((themeOption) => {
              const Icon = themeOption.icon;
              const isActive = theme === themeOption.value;

              return (
                <button
                  key={themeOption.value}
                  onClick={() => {
                    setTheme(themeOption.value);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150 ${
                    isActive
                      ? "text-green dark:text-white bg-green/50 dark:bg-green/20"
                      : "text-gray-700 dark:text-gray-300"
                  }`}
                  role="option"
                  aria-selected={isActive}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {themeOption.label}
                  </span>

                  {/* Active indicator */}
                  {isActive && (
                    <div className="ml-auto w-2 h-2 bg-green dark:bg-green rounded-full" />
                  )}

                  {/* System theme indicator */}
                  {themeOption.value === "system" && isSystem && (
                    <span className="ml-auto text-xs text-gray-500 dark:text-gray-400">
                      {resolvedTheme === "dark" ? "Dark" : "Light"}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

// Simple toggle version for compact spaces
export const SimpleThemeToggle = () => {
  const { resolvedTheme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label={`Switch to ${
        resolvedTheme === "dark" ? "light" : "dark"
      } mode`}
      className="relative p-2 flex justify-center items-center rounded-full border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green focus:ring-offset-2 dark:focus:ring-offset-gray-900 group"
      type="button"
    >
      {resolvedTheme === "dark" ? (
        <Sun className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
      ) : (
        <Moon className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
      )}
    </button>
  );
};
