import React from "react";
import { useTheme } from "./ThemeProvider";
import { Icon } from "../ui/icon/icon";

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label={
        theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
      }
      className="p-2 rounded-full border border-transparent hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
      type="button"
    >
      {theme === "dark" ? (
        <Icon name="sun" className="w-5 h-5 text-yellow-400" />
      ) : (
        <Icon name="moon" className="w-5 h-5 text-gray-700" />
      )}
    </button>
  );
};
