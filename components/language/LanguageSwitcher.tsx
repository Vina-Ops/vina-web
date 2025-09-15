"use client";

import React, { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/context/language-context";
import { Globe } from "lucide-react";

const languages = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "ko", name: "한국어", flag: "🇰🇷" },
  { code: "zh", name: "中文", flag: "🇨🇳" },
] as const;

interface PositionConfig {
  placement?: "top" | "bottom" | "left" | "right" | "auto";
  offset?: number;
  mobilePlacement?: "top" | "bottom" | "left" | "right" | "auto";
  mobileOffset?: number;
  maxWidth?: string;
  mobileMaxWidth?: string;
}

interface LanguageSwitcherProps {
  position?: PositionConfig;
  className?: string;
  compact?: boolean;
}

export function LanguageSwitcher({
  position = {},
  className = "",
  compact = false,
}: LanguageSwitcherProps = {}) {
  const { locale, setLocale } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<{
    top: number;
    left: number;
    right?: number;
  }>({ top: 0, left: 0, right: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLanguage = languages.find((lang) => lang.code === locale);

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
        maxWidth = "200px",
        mobileMaxWidth = "280px",
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

        if (spaceBelow >= 200 || spaceBelow > spaceAbove) {
          newPosition = {
            top: buttonRect.bottom + effectiveOffset,
            left:
              spaceRight >= 200
                ? buttonRect.left
                : Math.max(8, buttonRect.right - 200),
            right: spaceRight < 200 ? 8 : undefined,
          };
        } else {
          newPosition = {
            top: buttonRect.top - 200 - effectiveOffset,
            left:
              spaceRight >= 200
                ? buttonRect.left
                : Math.max(8, buttonRect.right - 200),
            right: spaceRight < 200 ? 8 : undefined,
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
              top: buttonRect.top - 200 - effectiveOffset,
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
              left: buttonRect.left - 200 - effectiveOffset,
              right: undefined,
            };
            break;
        }
      }

      setDropdownPosition(newPosition);
    }
  }, [isOpen, position]);

  return (
    <div className={`relative ${className}`}>
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center space-x-2 px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 ${
          compact ? "px-2 py-1" : ""
        }`}
        aria-label="Select language"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <Globe className="w-4 h-4" />
        <span className="text-sm font-medium">{currentLanguage?.flag}</span>
        {!compact && (
          <span className="hidden sm:block text-sm">
            {currentLanguage?.name}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-[9990]"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <div
            ref={dropdownRef}
            className="fixed bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-[99999]"
            style={{
              top: dropdownPosition.top,
              left: dropdownPosition.left,
              right: dropdownPosition.right,
              maxWidth:
                window.innerWidth < 768
                  ? position.mobileMaxWidth || "280px"
                  : position.maxWidth || "200px",
              minWidth: "160px",
            }}
            role="listbox"
            aria-label="Language options"
          >
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => {
                  setLocale(language.code);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                  locale === language.code
                    ? "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20"
                    : "text-gray-700 dark:text-gray-300"
                }`}
                role="option"
                aria-selected={locale === language.code}
              >
                <span className="text-lg">{language.flag}</span>
                <span className="text-sm font-medium">{language.name}</span>
                {locale === language.code && (
                  <div className="ml-auto w-2 h-2 bg-green-600 dark:bg-green-400 rounded-full" />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
