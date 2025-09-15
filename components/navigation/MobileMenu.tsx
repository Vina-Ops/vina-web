"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/language-context";
import { LanguageSwitcher } from "../language/LanguageSwitcher";
import { ThemeToggle } from "../theme/ThemeToggle";
import { X, Menu, Users, LogIn, Play, User, Settings } from "lucide-react";

interface MobileMenuProps {
  className?: string;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ className = "" }) => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      // Prevent body scroll when menu is open
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={menuRef}>
      {/* Hamburger Button */}
      <button
        onClick={toggleMenu}
        className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-105 active:scale-95"
        aria-label="Toggle mobile menu"
        aria-expanded={isOpen}
      >
        <div className="relative w-5 h-5">
          <span
            className={`absolute top-1 left-0 w-5 h-0.5 bg-gray-600 dark:bg-gray-300 transition-all duration-300 ${
              isOpen ? "rotate-45 top-2" : ""
            }`}
          />
          <span
            className={`absolute top-2 left-0 w-5 h-0.5 bg-gray-600 dark:bg-gray-300 transition-all duration-300 ${
              isOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`absolute top-3 left-0 w-5 h-0.5 bg-gray-600 dark:bg-gray-300 transition-all duration-300 ${
              isOpen ? "-rotate-45 top-2" : ""
            }`}
          />
        </div>
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
            onClick={closeMenu}
          />
          
          {/* Menu Panel */}
          <div className="absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-white dark:bg-gray-900 shadow-2xl transform transition-all duration-300 ease-out animate-in slide-in-from-right">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Menu
              </h2>
              <button
                onClick={closeMenu}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Close menu"
              >
                <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </button>
            </div>

            {/* Menu Content */}
            <div className="flex flex-col h-full">
            {/* Navigation Links */}
            <div className="flex-1 p-4 space-y-1">
              <Link href="/therapist" onClick={closeMenu}>
                <div className="flex items-center p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group">
                  <Users className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3 group-hover:text-gray-700 dark:group-hover:text-gray-200" />
                  <span className="text-gray-700 dark:text-gray-300 font-medium group-hover:text-gray-900 dark:group-hover:text-white">
                    Therapists
                  </span>
                </div>
              </Link>

              <Link href="/auth/login" onClick={closeMenu}>
                <div className="flex items-center p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group">
                  <LogIn className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3 group-hover:text-gray-700 dark:group-hover:text-gray-200" />
                  <span className="text-gray-700 dark:text-gray-300 font-medium group-hover:text-gray-900 dark:group-hover:text-white">
                    {t("nav.login")}
                  </span>
                </div>
              </Link>

              <Link href="/?start=1" onClick={closeMenu}>
                <div className="flex items-center p-3 rounded-lg bg-green hover:bg-green/80 transition-colors group">
                  <Play className="w-5 h-5 text-white mr-3" />
                  <span className="text-white font-medium">
                    {t("nav.getStarted")}
                  </span>
                </div>
              </Link>

              {/* Additional mobile-only links */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700 mt-4">
                <Link href="/profile" onClick={closeMenu}>
                  <div className="flex items-center p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group">
                    <User className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3 group-hover:text-gray-700 dark:group-hover:text-gray-200" />
                    <span className="text-gray-700 dark:text-gray-300 font-medium group-hover:text-gray-900 dark:group-hover:text-white">
                      Profile
                    </span>
                  </div>
                </Link>

                <Link href="/settings" onClick={closeMenu}>
                  <div className="flex items-center p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group">
                    <Settings className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3 group-hover:text-gray-700 dark:group-hover:text-gray-200" />
                    <span className="text-gray-700 dark:text-gray-300 font-medium group-hover:text-gray-900 dark:group-hover:text-white">
                      Settings
                    </span>
                  </div>
                </Link>
              </div>
            </div>

              {/* Settings Section */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-4">
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Settings
                  </h3>
                  
                  {/* Language Switcher */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Language
                    </span>
                    <LanguageSwitcher 
                      position={{
                        placement: "left",
                        mobilePlacement: "top",
                        offset: 8,
                        mobileOffset: 8
                      }}
                    />
                  </div>

                  {/* Theme Toggle */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Theme
                    </span>
                    <ThemeToggle 
                      position={{
                        placement: "left",
                        mobilePlacement: "top",
                        offset: 8,
                        mobileOffset: 8
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
