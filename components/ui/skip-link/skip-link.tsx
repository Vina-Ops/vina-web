import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export interface SkipLinkProps {
  targetId?: string;
  children?: React.ReactNode;
  className?: string;
  focusClassName?: string;
  showOnFocus?: boolean;
  position?: "top-left" | "top-right" | "top-center";
  offset?: string;
}

export function SkipLink({
  targetId = "main-content",
  children = "Skip to main content",
  className,
  focusClassName,
  showOnFocus = true,
  position = "top-left",
  offset = "1rem",
}: SkipLinkProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // Handle focus visibility
  useEffect(() => {
    const handleFocus = () => {
      if (showOnFocus) {
        setIsVisible(true);
      }
    };

    const handleBlur = () => {
      if (showOnFocus) {
        setIsVisible(false);
      }
    };

    const link = document.getElementById("skip-link");
    if (link) {
      link.addEventListener("focus", handleFocus);
      link.addEventListener("blur", handleBlur);
    }

    return () => {
      if (link) {
        link.removeEventListener("focus", handleFocus);
        link.removeEventListener("blur", handleBlur);
      }
    };
  }, [showOnFocus]);

  // Handle click
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const target = document.getElementById(targetId);
    if (target) {
      target.tabIndex = -1;
      target.focus();
      setTimeout(() => {
        target.removeAttribute("tabindex");
      }, 100);
    }
  };

  // Position styles
  const positionStyles = {
    "top-left": { left: offset, top: offset },
    "top-right": { right: offset, top: offset },
    "top-center": { left: "50%", top: offset, transform: "translateX(-50%)" },
  };

  return (
    <a
      id="skip-link"
      href={`#${targetId}`}
      onClick={handleClick}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      className={cn(
        "fixed z-50 rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-lg transition-all duration-200",
        !isVisible && !isFocused && "sr-only",
        isFocused && focusClassName,
        className
      )}
      style={positionStyles[position]}
    >
      {children}
    </a>
  );
}
