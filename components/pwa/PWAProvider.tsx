"use client";

import React, { useEffect } from "react";
import { usePWA } from "@/hooks/use-pwa";
import { InstallPrompt } from "./InstallPrompt";
import { UpdateNotification } from "./UpdateNotification";

interface PWAProviderProps {
  children: React.ReactNode;
}

export const PWAProvider: React.FC<PWAProviderProps> = ({ children }) => {
  // Check if PWA should be disabled
  const isPWADisabled =
    process.env.NODE_ENV === "development" &&
    process.env.NEXT_PUBLIC_DISABLE_PWA === "true";

  const {
    isOnline,
    requestNotificationPermission,
    subscribeToPushNotifications,
  } = usePWA();

  // Request notification permission on first visit
  useEffect(() => {
    if (isPWADisabled) return;

    const requestNotifications = async () => {
      const hasPermission = await requestNotificationPermission();
      if (hasPermission) {
        await subscribeToPushNotifications();
      }
    };

    // Only request on first visit
    const hasRequested = localStorage.getItem(
      "notification-permission-requested"
    );
    if (!hasRequested) {
      requestNotifications();
      localStorage.setItem("notification-permission-requested", "true");
    }
  }, [
    requestNotificationPermission,
    subscribeToPushNotifications,
    isPWADisabled,
  ]);

  // Show offline indicator
  useEffect(() => {
    if (isPWADisabled) return;

    if (!isOnline) {
      console.log("App is offline");
    }
  }, [isOnline, isPWADisabled]);

  // If PWA is disabled, just render children
  if (isPWADisabled) {
    console.log("🚫 PWA disabled for development");
    return <>{children}</>;
  }

  return (
    <>
      {children}

      {/* PWA Install Prompt - Floating variant */}
      <InstallPrompt variant="floating" />

      {/* PWA Update Notification - Toast variant */}
      <UpdateNotification variant="toast" />

      {/* Offline indicator */}
      {!isOnline && (
        <div className="fixed top-0 left-0 right-0 bg-yellow-500 text-white text-center py-2 px-4 z-50">
          <span className="text-sm font-medium">
            You're currently offline. Some features may be limited.
          </span>
        </div>
      )}
    </>
  );
};
