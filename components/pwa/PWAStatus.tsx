"use client";

import React, { useState } from "react";
import { usePWA } from "@/hooks/use-pwa";
import {
  Wifi,
  WifiOff,
  Download,
  RefreshCw,
  Smartphone,
  Bell,
  Settings,
  X,
} from "lucide-react";

interface PWAStatusProps {
  showDetails?: boolean;
  className?: string;
}

export const PWAStatus: React.FC<PWAStatusProps> = ({
  showDetails = false,
  className = "",
}) => {
  const {
    isInstalled,
    isOnline,
    hasUpdate,
    canInstall,
    installPWA,
    updateServiceWorker,
    requestNotificationPermission,
    subscribeToPushNotifications,
  } = usePWA();

  const [showFullDetails, setShowFullDetails] = useState(showDetails);
  const [notificationPermission, setNotificationPermission] =
    useState<NotificationPermission>("default");

  React.useEffect(() => {
    if ("Notification" in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  const handleInstall = async () => {
    try {
      await installPWA();
    } catch (error) {
      console.error("Installation failed:", error);
    }
  };

  const handleUpdate = () => {
    updateServiceWorker();
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const handleRequestNotifications = async () => {
    const permission = await requestNotificationPermission();
    setNotificationPermission(permission ? "granted" : "denied");

    if (permission) {
      await subscribeToPushNotifications();
    }
  };

  if (!showFullDetails) {
    return (
      <div className={`flex items-center space-x-2 text-sm ${className}`}>
        {/* Online Status */}
        <div className="flex items-center space-x-1">
          {isOnline ? (
            <Wifi className="w-4 h-4 text-green-500" />
          ) : (
            <WifiOff className="w-4 h-4 text-red-500" />
          )}
        </div>

        {/* Install Status */}
        {isInstalled && (
          <div className="flex items-center space-x-1">
            <Smartphone className="w-4 h-4 text-blue-500" />
          </div>
        )}

        {/* Update Available */}
        {hasUpdate && (
          <button
            onClick={handleUpdate}
            className="flex items-center space-x-1 text-orange-500 hover:text-orange-600"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        )}

        {/* Install Available */}
        {canInstall && !isInstalled && (
          <button
            onClick={handleInstall}
            className="flex items-center space-x-1 text-green-500 hover:text-green-600"
          >
            <Download className="w-4 h-4" />
          </button>
        )}

        {/* Settings Button */}
        <button
          onClick={() => setShowFullDetails(true)}
          className="flex items-center space-x-1 text-gray-500 hover:text-gray-600"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 max-w-sm ${className}`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          PWA Status
        </h3>
        <button
          onClick={() => setShowFullDetails(false)}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-3">
        {/* Online Status */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Connection:
          </span>
          <div className="flex items-center space-x-2">
            {isOnline ? (
              <>
                <Wifi className="w-4 h-4 text-green-500" />
                <span className="text-sm text-green-600 dark:text-green-400">
                  Online
                </span>
              </>
            ) : (
              <>
                <WifiOff className="w-4 h-4 text-red-500" />
                <span className="text-sm text-red-600 dark:text-red-400">
                  Offline
                </span>
              </>
            )}
          </div>
        </div>

        {/* Install Status */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Installed:
          </span>
          <div className="flex items-center space-x-2">
            {isInstalled ? (
              <>
                <Smartphone className="w-4 h-4 text-blue-500" />
                <span className="text-sm text-blue-600 dark:text-blue-400">
                  Yes
                </span>
              </>
            ) : (
              <span className="text-sm text-gray-500">No</span>
            )}
          </div>
        </div>

        {/* Update Status */}
        {hasUpdate && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Update:
            </span>
            <button
              onClick={handleUpdate}
              className="flex items-center space-x-1 text-orange-600 hover:text-orange-700 text-sm"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Available</span>
            </button>
          </div>
        )}

        {/* Install Button */}
        {canInstall && !isInstalled && (
          <button
            onClick={handleInstall}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Install App</span>
          </button>
        )}

        {/* Notification Permission */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Notifications:
          </span>
          <div className="flex items-center space-x-2">
            <Bell
              className={`w-4 h-4 ${
                notificationPermission === "granted"
                  ? "text-green-500"
                  : notificationPermission === "denied"
                  ? "text-red-500"
                  : "text-gray-500"
              }`}
            />
            <span className="text-sm capitalize">{notificationPermission}</span>
          </div>
        </div>

        {/* Request Notifications Button */}
        {notificationPermission !== "granted" && (
          <button
            onClick={handleRequestNotifications}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
          >
            <Bell className="w-4 h-4" />
            <span>Enable Notifications</span>
          </button>
        )}
      </div>
    </div>
  );
};
