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
  AlertTriangle,
  Phone,
} from "lucide-react";
import {
  FixedNavbar,
  defaultNavItems,
} from "@/components/navigation/FixedNavbar";
import { usePathname } from "next/navigation";
import { useNotification } from "@/context/notification-context";
import { useTopToast } from "@/components/ui/toast";

// DeleteChatsModal Component
const DeleteChatsModal: React.FC = () => {
  const { showToast } = useTopToast();
  const [showModal, setShowModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const { deleteChatWithAI } = await import("@/services/general-service");
      await deleteChatWithAI();
      setShowModal(false);
      showToast("All your chats with Vina have been deleted.", {
        type: "success",
      });
    } catch (error) {
      showToast(
        "Failed to delete chats. Please try again or contact support.",
        {
          type: "error",
        }
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <button
        className="mt-6 flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors shadow focus:outline-none focus:ring-2 focus:ring-red-400"
        onClick={() => setShowModal(true)}
      >
        <AlertTriangle className="h-5 w-5" />
        Delete My Chats with Vina
      </button>

      {showModal && (
        <div className="fixed inset-0 z-[9998] backdrop-blur-md flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg max-w-md w-full p-6 relative">
            <h3 className="text-lg font-semibold text-red-700 dark:text-red-300 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-400" />
              Delete All Chats
            </h3>
            <p className="mt-3 text-gray-700 dark:text-gray-200">
              Are you sure you want to delete{" "}
              <b className="font-bold uppercase text-sm">
                all your chats with Vina
              </b>
              ? This action cannot be undone.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                onClick={() => setShowModal(false)}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold transition"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

interface SettingItem {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  type: "toggle" | "select" | "input" | "range";
  value?: any;
  options?: { label: string; value: string }[];
  onChange?: (value: any) => void;
  min?: number;
  max?: number;
  step?: number;
  danger?: boolean;
}

export default function SettingsPage() {
  const {
    settings: notificationSettings,
    toggleSound,
    toggleIncomingCallSound,
    setVolume,
  } = useNotification();
  const [settings, setSettings] = useState({
    notifications: true,
    emailUpdates: true,
    darkMode: false,
    language: "en",
    privacyMode: false,
    autoSave: true,
    twoFactorAuth: false,
  });
  const pathname = usePathname();

  // Update navigation items to reflect current path
  const updatedNavItems = defaultNavItems.map((item) => ({
    ...item,
    isActive: item.href
      ? pathname === item.href || pathname?.startsWith(item.href)
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
          value: notificationSettings.soundEnabled,
          onChange: toggleSound,
        },
        {
          id: "incomingCallSound",
          title: "Incoming Call Sounds",
          description: "Play sound for incoming video calls",
          icon: <Phone className="w-5 h-5" />,
          type: "toggle",
          value: notificationSettings.incomingCallSoundEnabled,
          onChange: toggleIncomingCallSound,
        },
        {
          id: "volume",
          title: "Notification Volume",
          description: "Adjust the volume of notification sounds",
          icon: <Volume2 className="w-5 h-5" />,
          type: "range",
          value: notificationSettings.volume,
          onChange: setVolume,
          min: 0,
          max: 1,
          step: 0.1,
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
              onClick={() => {
                if (item.onChange) {
                  item.onChange(!(item.value as boolean));
                } else {
                  handleSettingChange(item.id, !(item.value as boolean));
                }
              }}
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
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green focus:border-transparent w-full relative z-[9999]"
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
                zIndex: 999,
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
          {item.type === "range" && (
            <div className="flex items-center space-x-3">
              <input
                type="range"
                min={item.min || 0}
                max={item.max || 1}
                step={item.step || 0.1}
                value={item.value as number}
                onChange={(e) => {
                  if (item.onChange) {
                    item.onChange(parseFloat(e.target.value));
                  } else {
                    handleSettingChange(item.id, parseFloat(e.target.value));
                  }
                }}
                className="w-20 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #013F25 0%, #013F25 ${
                    (item.value as number) * 100
                  }%, #e5e7eb ${(item.value as number) * 100}%, #e5e7eb 100%)`,
                }}
              />
              <span className="text-sm text-gray-600 dark:text-gray-400 w-8 text-center">
                {Math.round((item.value as number) * 100)}%
              </span>
            </div>
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
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
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

              {/* Danger Zone */}
              <div className="mt-8">
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex items-center">
                      <AlertTriangle className="h-5 w-5 text-red-400" />

                      <h3 className="ml-2 text-lg leading-6 font-medium text-red-800 dark:text-red-200">
                        Danger Zone
                      </h3>
                    </div>
                    <div className="mt-4 text-sm text-red-700 dark:text-red-300">
                      <p>
                        These actions are irreversible and will affect all users
                        on the platform.
                      </p>
                    </div>

                    {/* Delete My Chats Modal Button and Modal */}
                    <DeleteChatsModal />
                  </div>
                </div>
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
