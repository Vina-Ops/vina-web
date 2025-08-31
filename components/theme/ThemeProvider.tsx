"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

// Types for theme
export type Theme = "light" | "dark" | "system";

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: "light" | "dark";
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  isSystem: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>("system");
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  // Get system preference
  const getSystemTheme = (): "light" | "dark" => {
    if (typeof window === "undefined") return "light";
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  };

  // Resolve theme (system preference or explicit choice)
  const resolveTheme = (themeChoice: Theme): "light" | "dark" => {
    if (themeChoice === "system") {
      return getSystemTheme();
    }
    return themeChoice;
  };

  // Set theme on <html> element and persist in localStorage
  useEffect(() => {
    const root = window.document.documentElement;
    const currentResolvedTheme = resolveTheme(theme);

    // Remove both classes first
    root.classList.remove("light", "dark");
    // Add the resolved theme class
    root.classList.add(currentResolvedTheme);

    // Add theme transition class for smooth transitions
    root.classList.add("theme-transition");

    // Update resolved theme
    setResolvedTheme(currentResolvedTheme);

    // Persist theme choice
    localStorage.setItem("theme", theme);

    // Remove transition class after animation
    const timer = setTimeout(() => {
      root.classList.remove("theme-transition");
    }, 300);

    return () => clearTimeout(timer);
  }, [theme]);

  // Listen for system theme changes
  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      if (theme === "system") {
        const newResolvedTheme = getSystemTheme();
        setResolvedTheme(newResolvedTheme);

        const root = window.document.documentElement;
        root.classList.remove("light", "dark");
        root.classList.add(newResolvedTheme);
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  // On mount, check localStorage or system preference
  useEffect(() => {
    const saved = localStorage.getItem("theme") as Theme | null;
    if (saved && ["light", "dark", "system"].includes(saved)) {
      setThemeState(saved);
    } else {
      setThemeState("system");
    }
    setMounted(true);
  }, []);

  const setTheme = (newTheme: Theme) => setThemeState(newTheme);
  const toggleTheme = () => {
    if (theme === "system") {
      setThemeState(getSystemTheme() === "dark" ? "light" : "dark");
    } else {
      setThemeState(theme === "dark" ? "light" : "dark");
    }
  };

  // Prevent hydration mismatch
  if (!mounted) {
    return <div style={{ visibility: "hidden" }}>{children}</div>;
  }

  return (
    <ThemeContext.Provider
      value={{
        theme,
        resolvedTheme,
        setTheme,
        toggleTheme,
        isSystem: theme === "system",
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    // Return a default context instead of throwing an error
    return {
      theme: "light" as Theme,
      resolvedTheme: "light" as "light" | "dark",
      setTheme: () => {},
      toggleTheme: () => {},
      isSystem: false,
    };
  }
  return context;
};
