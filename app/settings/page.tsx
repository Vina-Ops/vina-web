"use client";

import React, { useState } from "react";
import {
  Bell,
  Shield,
  Palette,
  Globe,
  Volume2,
  Eye,
  Lock,
  Smartphone,
  Mail,
  Save,
} from "lucide-react";
import {
  FixedNavbar,
  defaultNavItems,
} from "@/components/navigation/FixedNavbar";
import { usePathname } from "next/navigation";

interface SettingItem {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  type: "toggle" | "select" | "input";
  value?: any;
  options?: { label: string; value: string }[];
  danger?: boolean;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    notifications: true,
    emailUpdates: true,
    darkMode: false,
    language: "en",
    soundEnabled: true,
    privacyMode: false,
    autoSave: true,
    twoFactorAuth: false,
  });
  const pathname = usePathname();

  // Update navigation items to reflect current path
  const updatedNavItems = defaultNavItems.map((item) => ({
    ...item,
    isActive: item.href
      ? pathname === item.href || pathname.startsWith(item.href)
      : false,
  }));

  const handleSettingChange = (settingId: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [settingId]: value,
    }));
  };

  const settingsGroups: { title: string; items: SettingItem[] }[] = [
    {
      title: "Notifications",
      items: [
        {
          id: "notifications",
          title: "Push Notifications",
          description: "Receive notifications for new messages and updates",
          icon: <Bell className="w-5 h-5" />,
          type: "toggle",
          value: settings.notifications,
        },
        {
          id: "emailUpdates",
          title: "Email Updates",
          description: "Receive email notifications for important updates",
          icon: <Mail className="w-5 h-5" />,
          type: "toggle",
          value: settings.emailUpdates,
        },
        {
          id: "soundEnabled",
          title: "Sound Notifications",
          description: "Play sound for new messages and notifications",
          icon: <Volume2 className="w-5 h-5" />,
          type: "toggle",
          value: settings.soundEnabled,
        },
      ],
    },
    {
      title: "Appearance",
      items: [
        {
          id: "darkMode",
          title: "Dark Mode",
          description: "Switch between light and dark themes",
          icon: <Palette className="w-5 h-5" />,
          type: "toggle",
          value: settings.darkMode,
        },
        {
          id: "language",
          title: "Language",
          description: "Choose your preferred language",
          icon: <Globe className="w-5 h-5" />,
          type: "select",
          value: settings.language,
          options: [
            { label: "English", value: "en" },
            { label: "Spanish", value: "es" },
            { label: "French", value: "fr" },
            { label: "German", value: "de" },
          ],
        },
      ],
    },
    {
      title: "Privacy & Security",
      items: [
        {
          id: "privacyMode",
          title: "Privacy Mode",
          description: "Hide sensitive information from screenshots",
          icon: <Eye className="w-5 h-5" />,
          type: "toggle",
          value: settings.privacyMode,
        },
        {
          id: "twoFactorAuth",
          title: "Two-Factor Authentication",
          description: "Add an extra layer of security to your account",
          icon: <Lock className="w-5 h-5" />,
          type: "toggle",
          value: settings.twoFactorAuth,
        },
        {
          id: "autoSave",
          title: "Auto-Save",
          description: "Automatically save your progress",
          icon: <Save className="w-5 h-5" />,
          type: "toggle",
          value: settings.autoSave,
        },
      ],
    },
  ];

  const renderSettingItem = (item: SettingItem) => {
    return (
      <div
        key={item.id}
        className={`flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0 ${
          item.danger ? "border-l-4 border-l-red-500" : ""
        }`}
      >
        <div className="flex items-center space-x-3">
          <div className="text-gray-500 dark:text-gray-400">{item.icon}</div>
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white">
              {item.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {item.description}
            </p>
          </div>
        </div>
        <div className="flex items-center">
          {item.type === "toggle" && (
            <button
              onClick={() =>
                handleSettingChange(item.id, !(item.value as boolean))
              }
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green focus:ring-offset-2 ${
                item.value ? "bg-green" : "bg-gray-200 dark:bg-gray-700"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  item.value ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          )}
          {item.type === "select" && (
            <select
              value={item.value as string}
              onChange={(e) => handleSettingChange(item.id, e.target.value)}
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green focus:border-transparent w-full"
              style={{
                width: "100%",
                padding: "4px 8px",
                fontSize: "14px",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                backgroundColor: "white",
                WebkitAppearance: "none",
                MozAppearance: "none",
                appearance: "none",
                backgroundImage: "none",
              }}
            >
              {item.options?.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                  className="text-gray-900 dark:text-white w-96"
                >
                  {option.label}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen">
      <FixedNavbar
        navItems={updatedNavItems}
        showSearch={true}
        showConnectionStatus={true}
        showThemeToggle={true}
      />
      <div className="flex flex-col flex-1 md:ml-64">
        <main className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900">
          <div className="p-4 md:p-6">
            <div className="">
              {/* Header */}
              <div className="mb-8 ml-4 md:ml-0">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-green mb-2">
                  Settings
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Customize your experience and manage your preferences
                </p>
              </div>

              {/* Settings Groups */}
              <div className="space-y-6">
                {settingsGroups.map((group) => (
                  <div
                    key={group.title}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
                  >
                    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {group.title}
                      </h2>
                    </div>
                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                      {group.items.map(renderSettingItem)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Save Button */}
              <div className="mt-8 flex justify-end">
                <button className="px-6 py-2 bg-green text-white rounded-lg hover:bg-green/80 transition-colors font-medium">
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
