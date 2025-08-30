"use client";

import React, { useState } from "react";
import {
  Settings,
  Bell,
  Shield,
  Palette,
  Globe,
  Download,
  Trash2,
  HelpCircle,
  Info,
  ChevronRight,
  Moon,
  Sun,
  Volume2,
  VolumeX,
} from "lucide-react";

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [language, setLanguage] = useState("English");

  const settingsCategories = [
    {
      id: "notifications",
      title: "Notifications",
      icon: Bell,
      description: "Manage your notification preferences",
      items: [
        {
          id: "push-notifications",
          label: "Push Notifications",
          description:
            "Receive notifications about your sessions and reminders",
          type: "toggle",
          value: notifications,
          onChange: setNotifications,
        },
        {
          id: "email-updates",
          label: "Email Updates",
          description: "Receive email updates about your progress",
          type: "toggle",
          value: emailUpdates,
          onChange: setEmailUpdates,
        },
      ],
    },
    {
      id: "appearance",
      title: "Appearance",
      icon: Palette,
      description: "Customize the look and feel of the app",
      items: [
        {
          id: "dark-mode",
          label: "Dark Mode",
          description: "Switch between light and dark themes",
          type: "toggle",
          value: darkMode,
          onChange: setDarkMode,
        },
        {
          id: "language",
          label: "Language",
          description: "Choose your preferred language",
          type: "select",
          value: language,
          onChange: setLanguage,
          options: ["English", "Spanish", "French", "German"],
        },
      ],
    },
    {
      id: "privacy",
      title: "Privacy & Security",
      icon: Shield,
      description: "Manage your privacy and security settings",
      items: [
        {
          id: "data-export",
          label: "Export Data",
          description: "Download a copy of your data",
          type: "action",
          action: () => console.log("Export data"),
          icon: Download,
        },
        {
          id: "delete-account",
          label: "Delete Account",
          description: "Permanently delete your account and all data",
          type: "action",
          action: () => console.log("Delete account"),
          icon: Trash2,
          danger: true,
        },
      ],
    },
    {
      id: "support",
      title: "Support & Help",
      icon: HelpCircle,
      description: "Get help and support",
      items: [
        {
          id: "help-center",
          label: "Help Center",
          description: "Browse our help articles and guides",
          type: "action",
          action: () => console.log("Help center"),
          icon: HelpCircle,
        },
        {
          id: "contact-support",
          label: "Contact Support",
          description: "Get in touch with our support team",
          type: "action",
          action: () => console.log("Contact support"),
          icon: Info,
        },
      ],
    },
  ];

  // Type definitions for settings items
  type SettingItem = {
    id: string;
    label: string;
    description: string;
    type: "toggle" | "select" | "action";
    value?: boolean | string;
    onChange?: (value: boolean | string) => void;
    options?: string[];
    action?: () => void;
    icon?: React.ComponentType<{ className?: string }>;
    danger?: boolean;
  };

  const renderSettingItem = (item: SettingItem) => {
    switch (item.type) {
      case "toggle":
        return (
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={typeof item.value === 'boolean' ? item.value : false}
              onChange={(e) => item.onChange && item.onChange(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green/20 dark:peer-focus:ring-green/80 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green"></div>
          </label>
        );
      case "select":
        return (
          <select
            value={typeof item.value === 'string' ? item.value : ''}
            onChange={(e) => item.onChange && item.onChange(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green focus:border-transparent"
          >
            {item.options?.map((option: string) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      case "action":
        return (
          <button
            onClick={item.action}
            className={`p-2 rounded-lg transition-colors ${
              item.danger
                ? "text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                : "text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700"
            }`}
          >
            {item.icon && <item.icon className="w-5 h-5" />}
          </button>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your account settings and preferences
          </p>
        </div>

        {/* Settings Categories */}
        <div className="space-y-6">
          {settingsCategories.map((category) => (
            <div
              key={category.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md"
            >
              {/* Category Header */}
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green/10 rounded-lg">
                    <category.icon className="w-5 h-5 text-green" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {category.title}
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {category.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Category Items */}
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {category.items.map((item) => (
                  <div key={item.id} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3
                            className={`text-sm font-medium ${
                              (item as any).danger
                                ? "text-red-600"
                                : "text-gray-900 dark:text-white"
                            }`}
                          >
                            {item.label}
                          </h3>
                          {item.type === "action" && (
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {item.description}
                        </p>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        {renderSettingItem(item as SettingItem)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Download className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    Export Data
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Download your data
                  </p>
                </div>
              </div>
            </button>
            <button className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <HelpCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    Help Center
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Get help
                  </p>
                </div>
              </div>
            </button>
            <button className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <Info className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    About
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    App information
                  </p>
                </div>
              </div>
            </button>
            <button className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                  <Shield className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    Privacy
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Privacy policy
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* App Version */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Vina v1.0.0 • Made with ❤️ for mental wellness
          </p>
        </div>
      </div>
    </div>
  );
}
