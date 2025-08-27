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
      className="p-2 flex justify-center items-center rounded-full border border-transparent hover:bg-gray-100 text-green dark:text-white transition-colors focus:outline-none focus:ring-0 focus:ring-primary"
      type="button"
    >
      {theme === "dark" ? (
        <Icon name="Sun" className="w-7 h-7 text-xl" />
      ) : (
        <Icon name="Moon" className="w-7 h-7 text-xl" />
      )}
    </button>
  );
};
