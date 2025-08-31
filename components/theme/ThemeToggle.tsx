import React, { useState } from "react";
import { useTheme } from "./ThemeProvider";
import { Sun, Moon, Monitor } from "lucide-react";

export const ThemeToggle = () => {
  const { theme, resolvedTheme, setTheme, isSystem } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const themes = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Monitor },
  ] as const;

  const currentTheme = themes.find((t) => t.value === theme);
  const CurrentIcon = currentTheme?.icon || Monitor;

  return (
    <div className="relative">
      {/* Main toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={`Current theme: ${currentTheme?.label}. Click to change theme`}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        className="relative p-2 flex justify-center items-center rounded-full border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green focus:ring-offset-2 dark:focus:ring-offset-gray-900 group"
        type="button"
      >
        <CurrentIcon className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />

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
            className="fixed inset-0 z-20"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* Menu */}
          <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-40 animate-scale-in">
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
                      ? "text-olive-green dark:text-olive-green bg-green-50 dark:bg-dark-green/20"
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
                    <div className="ml-auto w-2 h-2 bg-green dark:bg-olive-green rounded-full" />
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
