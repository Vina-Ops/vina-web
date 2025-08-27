"use client";

import React from "react";
import { Search, Home, MessageCircle, Settings, User } from "lucide-react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import Logo from "@/components/logo";

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  isActive?: boolean;
}

interface FixedNavbarProps {
  navItems?: NavItem[];
  isConnected?: boolean;
  onReconnect?: () => void;
  onSearchClick?: () => void;
  showSearch?: boolean;
  showConnectionStatus?: boolean;
  showThemeToggle?: boolean;
}

export const FixedNavbar: React.FC<FixedNavbarProps> = ({
  navItems = [],
  isConnected,
  onReconnect,
  onSearchClick,
  showSearch = true,
  showConnectionStatus = true,
  showThemeToggle = true,
}) => {
  return (
    <nav className="fixed top-0 left-0 h-full w-64 bg-white/95 backdrop-blur-md border-r border-gray-200 dark:bg-gray-900/95 dark:border-gray-700 shadow-sm z-50">
      <div className="flex flex-col h-full">
        {/* Top section - Logo */}
        <div className="flex-shrink-0 p-6 border-b border-gray-200 dark:border-gray-700 flex items-center gap-x-4">
          <Logo />
          <span className="text-sm font-medium text-green">
            Always Listening
          </span>
        </div>

        {/* Middle section - Navigation Items */}
        <div className="flex-1 px-4 py-6">
          {navItems.length > 0 && (
            <div className="space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={item.onClick}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    item.isActive
                      ? "bg-green/20 font-bold text-green dark:bg-green-900/30 dark:text-green"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800"
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Bottom section - Actions */}
        <div className="flex-shrink-0 p-4 border-t border-gray-200 dark:border-gray-700 space-y-4">
          {/* Search Button */}
          {showSearch && onSearchClick && (
            <button
              onClick={onSearchClick}
              className="w-full flex items-center space-x-3 px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800 rounded-lg transition-colors"
              title="Search messages (Ctrl + /)"
            >
              <Search className="w-5 h-5" />
              <span className="text-sm font-medium">Search</span>
            </button>
          )}

          {/* Connection Status */}
          {showConnectionStatus && isConnected !== undefined && (
            <div className="flex items-center space-x-3 px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div
                className={`w-2 h-2 rounded-full ${
                  isConnected ? "bg-green" : "bg-yellow-400"
                }`}
              />
              <div className="flex-1">
                <span
                  className={`text-xs font-medium ${
                    isConnected
                      ? "text-green font-bold dark:text-green"
                      : "text-yellow-600 dark:text-yellow-400"
                  }`}
                >
                  {isConnected ? "Connected" : "Connecting..."}
                </span>
                {!isConnected && onReconnect && (
                  <button
                    onClick={onReconnect}
                    className="block mt-1 text-xs bg-red-100 hover:bg-red-200 text-red-700 dark:bg-red-900/30 dark:hover:bg-red-900/50 dark:text-red-400 px-2 py-1 rounded transition-colors"
                  >
                    Reconnect
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Theme Toggle */}
          {showThemeToggle && (
            <div className="px-4">
              <ThemeToggle />
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

// Default navigation items for common use cases
export const defaultNavItems: NavItem[] = [
  {
    id: "home",
    label: "Home",
    icon: <Home className="w-6 h-6" />,
    onClick: () => {
      // Navigate to home page
      window.location.href = "/";
    },
    isActive: false,
  },
  {
    id: "chat",
    label: "Chat",
    icon: <MessageCircle className="w-6 h-6" />,
    onClick: () => {
      // Navigate to chat page
      window.location.href = "/chat";
    },
    isActive: true,
  },
  {
    id: "profile",
    label: "Profile",
    icon: <User className="w-6 h-6" />,
    onClick: () => {
      // Navigate to profile page
      window.location.href = "/profile";
    },
    isActive: false,
  },
  {
    id: "settings",
    label: "Settings",
    icon: <Settings className="w-6 h-6" />,
    onClick: () => {
      // Navigate to settings page
      window.location.href = "/settings";
    },
    isActive: false,
  },
];
