"use client";

import React, { useState } from "react";
import { Download, X, Smartphone } from "lucide-react";
import { usePWA } from "@/hooks/use-pwa";

interface InstallPromptProps {
  className?: string;
  variant?: "banner" | "modal" | "floating";
}

export const InstallPrompt: React.FC<InstallPromptProps> = ({
  className = "",
  variant = "banner",
}) => {
  const { canInstall, isInstalled, installPWA, isInstalling } = usePWA();
  const [isVisible, setIsVisible] = useState(true);
  const [isDismissed, setIsDismissed] = useState(false);

  // Check if user has dismissed recently (within 24 hours)
  React.useEffect(() => {
    const dismissed = localStorage.getItem("pwa-install-dismissed");
    if (dismissed) {
      const dismissedTime = parseInt(dismissed);
      const now = Date.now();
      const oneDay = 24 * 60 * 60 * 1000;

      if (now - dismissedTime < oneDay) {
        setIsDismissed(true);
      } else {
        localStorage.removeItem("pwa-install-dismissed");
      }
    }
  }, []);

  const handleInstall = async () => {
    try {
      await installPWA();
      setIsVisible(false);
    } catch (error) {
      console.error("Installation failed:", error);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    // Store dismissal in localStorage
    localStorage.setItem("pwa-install-dismissed", Date.now().toString());
  };

  // Don't show if already installed or can't install
  if (isInstalled || !canInstall || isDismissed || !isVisible) {
    return null;
  }

  const content = (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
            <Download className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">
            Install Vina App
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Get quick access and work offline
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={handleInstall}
          disabled={isInstalling}
          className="px-3 py-1.5 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white text-xs font-medium rounded-lg transition-colors flex items-center space-x-1"
        >
          {isInstalling ? (
            <>
              <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
              <span>Installing...</span>
            </>
          ) : (
            <>
              <Smartphone className="w-3 h-3" />
              <span>Install</span>
            </>
          )}
        </button>
        <button
          onClick={handleDismiss}
          className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  if (variant === "modal") {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg max-w-sm w-full p-6 shadow-xl">
          <div className="text-center mb-4">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <Download className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Install Vina App
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Install Vina on your device for a better experience with offline
              access and quick launch.
            </p>
          </div>
          <div className="space-y-3">
            <button
              onClick={handleInstall}
              disabled={isInstalling}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              {isInstalling ? (
                <>
                  <div className="w-4 h-4 border border-white border-t-transparent rounded-full animate-spin" />
                  <span>Installing...</span>
                </>
              ) : (
                <>
                  <Smartphone className="w-4 h-4" />
                  <span>Install App</span>
                </>
              )}
            </button>
            <button
              onClick={handleDismiss}
              className="w-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (variant === "floating") {
    return (
      <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 max-w-sm z-40">
        {content}
      </div>
    );
  }

  // Default banner variant
  return (
    <div
      className={`bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 ${className}`}
    >
      {content}
    </div>
  );
};
