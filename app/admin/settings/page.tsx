"use client";

import React, { useState } from "react";
import {
  Save,
  Globe,
  Shield,
  Bell,
  Database,
  Mail,
  Lock,
  Users,
  MessageSquare,
  CreditCard,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

interface SettingSectionProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

const SettingSection: React.FC<SettingSectionProps> = ({
  title,
  description,
  icon,
  children,
}) => (
  <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
    <div className="px-4 py-5 sm:p-6">
      <div className="flex items-center mb-4">
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center text-white">
            {icon}
          </div>
        </div>
        <div className="ml-3">
          <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
            {title}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {description}
          </p>
        </div>
      </div>
      {children}
    </div>
  </div>
);

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    // General Settings
    siteName: "Vina - Mental Wellness Companion",
    siteDescription:
      "Your AI companion for mental wellness and emotional support",
    maintenanceMode: false,
    allowRegistration: true,

    // Security Settings
    requireEmailVerification: true,
    maxLoginAttempts: 5,
    sessionTimeout: 30,
    enableTwoFactor: false,

    // Notification Settings
    emailNotifications: true,
    pushNotifications: true,
    adminAlerts: true,

    // Chat Settings
    maxMessageLength: 1000,
    autoResponseDelay: 2,
    enableFileUpload: true,
    maxFileSize: 10,

    // Payment Settings
    enablePayments: true,
    currency: "USD",
    stripeEnabled: true,
    paypalEnabled: false,

    // System Settings
    maxUsers: 10000,
    maxTherapists: 500,
    backupFrequency: "daily",
    logRetention: 30,
  });

  const [saved, setSaved] = useState(false);

  const handleSettingChange = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSave = () => {
    // Here you would typically save to backend
    // console.log("Saving settings:", settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            System Settings
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Configure platform settings and preferences
          </p>
        </div>
        <button
          onClick={handleSave}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </button>
      </div>

      {saved && (
        <div className="bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-md p-4">
          <div className="flex">
            <CheckCircle className="h-5 w-5 text-green-400" />
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800 dark:text-green-200">
                Settings saved successfully!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* General Settings */}
      <SettingSection
        title="General Settings"
        description="Basic platform configuration and appearance"
        icon={<Globe className="h-4 w-4" />}
      >
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Site Name
            </label>
            <input
              type="text"
              value={settings.siteName}
              onChange={(e) => handleSettingChange("siteName", e.target.value)}
              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Site Description
            </label>
            <input
              type="text"
              value={settings.siteDescription}
              onChange={(e) =>
                handleSettingChange("siteDescription", e.target.value)
              }
              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={settings.maintenanceMode}
              onChange={(e) =>
                handleSettingChange("maintenanceMode", e.target.checked)
              }
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              Maintenance Mode
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={settings.allowRegistration}
              onChange={(e) =>
                handleSettingChange("allowRegistration", e.target.checked)
              }
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              Allow User Registration
            </label>
          </div>
        </div>
      </SettingSection>

      {/* Security Settings */}
      <SettingSection
        title="Security Settings"
        description="Configure security and authentication options"
        icon={<Shield className="h-4 w-4" />}
      >
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={settings.requireEmailVerification}
              onChange={(e) =>
                handleSettingChange(
                  "requireEmailVerification",
                  e.target.checked
                )
              }
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              Require Email Verification
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={settings.enableTwoFactor}
              onChange={(e) =>
                handleSettingChange("enableTwoFactor", e.target.checked)
              }
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              Enable Two-Factor Authentication
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Max Login Attempts
            </label>
            <input
              type="number"
              value={settings.maxLoginAttempts}
              onChange={(e) =>
                handleSettingChange(
                  "maxLoginAttempts",
                  parseInt(e.target.value)
                )
              }
              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Session Timeout (minutes)
            </label>
            <input
              type="number"
              value={settings.sessionTimeout}
              onChange={(e) =>
                handleSettingChange("sessionTimeout", parseInt(e.target.value))
              }
              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </SettingSection>

      {/* Notification Settings */}
      <SettingSection
        title="Notification Settings"
        description="Configure email and push notification preferences"
        icon={<Bell className="h-4 w-4" />}
      >
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={settings.emailNotifications}
              onChange={(e) =>
                handleSettingChange("emailNotifications", e.target.checked)
              }
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              Email Notifications
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={settings.pushNotifications}
              onChange={(e) =>
                handleSettingChange("pushNotifications", e.target.checked)
              }
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              Push Notifications
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={settings.adminAlerts}
              onChange={(e) =>
                handleSettingChange("adminAlerts", e.target.checked)
              }
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              Admin Alerts
            </label>
          </div>
        </div>
      </SettingSection>

      {/* Chat Settings */}
      <SettingSection
        title="Chat Settings"
        description="Configure chat functionality and limits"
        icon={<MessageSquare className="h-4 w-4" />}
      >
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Max Message Length
            </label>
            <input
              type="number"
              value={settings.maxMessageLength}
              onChange={(e) =>
                handleSettingChange(
                  "maxMessageLength",
                  parseInt(e.target.value)
                )
              }
              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Auto Response Delay (seconds)
            </label>
            <input
              type="number"
              value={settings.autoResponseDelay}
              onChange={(e) =>
                handleSettingChange(
                  "autoResponseDelay",
                  parseInt(e.target.value)
                )
              }
              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={settings.enableFileUpload}
              onChange={(e) =>
                handleSettingChange("enableFileUpload", e.target.checked)
              }
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              Enable File Upload
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Max File Size (MB)
            </label>
            <input
              type="number"
              value={settings.maxFileSize}
              onChange={(e) =>
                handleSettingChange("maxFileSize", parseInt(e.target.value))
              }
              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </SettingSection>

      {/* Payment Settings */}
      <SettingSection
        title="Payment Settings"
        description="Configure payment gateways and billing options"
        icon={<CreditCard className="h-4 w-4" />}
      >
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={settings.enablePayments}
              onChange={(e) =>
                handleSettingChange("enablePayments", e.target.checked)
              }
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              Enable Payments
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Currency
            </label>
            <select
              value={settings.currency}
              onChange={(e) => handleSettingChange("currency", e.target.value)}
              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="GBP">GBP - British Pound</option>
              <option value="CAD">CAD - Canadian Dollar</option>
            </select>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={settings.stripeEnabled}
              onChange={(e) =>
                handleSettingChange("stripeEnabled", e.target.checked)
              }
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              Enable Stripe
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={settings.paypalEnabled}
              onChange={(e) =>
                handleSettingChange("paypalEnabled", e.target.checked)
              }
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              Enable PayPal
            </label>
          </div>
        </div>
      </SettingSection>

      {/* System Limits */}
      <SettingSection
        title="System Limits"
        description="Configure platform capacity and limits"
        icon={<Database className="h-4 w-4" />}
      >
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Max Users
            </label>
            <input
              type="number"
              value={settings.maxUsers}
              onChange={(e) =>
                handleSettingChange("maxUsers", parseInt(e.target.value))
              }
              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Max Therapists
            </label>
            <input
              type="number"
              value={settings.maxTherapists}
              onChange={(e) =>
                handleSettingChange("maxTherapists", parseInt(e.target.value))
              }
              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Backup Frequency
            </label>
            <select
              value={settings.backupFrequency}
              onChange={(e) =>
                handleSettingChange("backupFrequency", e.target.value)
              }
              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="hourly">Hourly</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Log Retention (days)
            </label>
            <input
              type="number"
              value={settings.logRetention}
              onChange={(e) =>
                handleSettingChange("logRetention", parseInt(e.target.value))
              }
              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </SettingSection>

      {/* Danger Zone */}
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
              These actions are irreversible and will affect all users on the
              platform.
            </p>
          </div>
          <div className="mt-4 space-y-3">
            <button className="inline-flex items-center px-4 py-2 border border-red-300 dark:border-red-700 text-sm font-medium rounded-md text-red-700 dark:text-red-300 bg-white dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-900/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
              Clear All Data
            </button>
            <button className="inline-flex items-center px-4 py-2 border border-red-300 dark:border-red-700 text-sm font-medium rounded-md text-red-700 dark:text-red-300 bg-white dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-900/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
              Reset All Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
