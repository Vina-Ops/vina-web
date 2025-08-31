"use client";

import React, { useState } from "react";
import { RefreshCw, X, Download } from "lucide-react";
import { usePWA } from "@/hooks/use-pwa";

interface UpdateNotificationProps {
  className?: string;
  variant?: "banner" | "toast" | "modal";
}

export const UpdateNotification: React.FC<UpdateNotificationProps> = ({
  className = "",
  variant = "banner",
}) => {
  const { hasUpdate, updateServiceWorker } = usePWA();
  const [isVisible, setIsVisible] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  if (!hasUpdate || !isVisible) {
    return null;
  }

  const handleUpdate = () => {
    setIsUpdating(true);
    updateServiceWorker();

    // Reload the page after a short delay to apply the update
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const handleDismiss = () => {
    setIsVisible(false);
  };

  const content = (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-green/10 dark:bg-green/50 rounded-full flex items-center justify-center">
            <Download className="w-5 h-5 text-green dark:text-dark-green" />
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">
            New Version Available
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Update to get the latest features and improvements
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={handleUpdate}
          disabled={isUpdating}
          className="px-3 py-2 bg-green hover:bg-green/50 disabled:bg-gray-400 text-white text-xs font-medium rounded-lg transition-colors flex items-center space-x-1"
        >
          {isUpdating ? (
            <>
              <RefreshCw className="w-3 h-3 animate-spin" />
              <span>Updating...</span>
            </>
          ) : (
            <>
              <RefreshCw className="w-3 h-3" />
              <span>Update</span>
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
            <div className="w-16 h-16 bg-green/10 dark:bg-green/50 rounded-full flex items-center justify-center mx-auto mb-3">
              <Download className="w-8 h-8 text-green dark:text-dark-green" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Update Available
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              A new version of Vina is available with the latest features and
              improvements.
            </p>
          </div>
          <div className="space-y-3">
            <button
              onClick={handleUpdate}
              disabled={isUpdating}
              className="w-full bg-green hover:bg-green/50 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              {isUpdating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  <span>Update Now</span>
                </>
              )}
            </button>
            <button
              onClick={handleDismiss}
              className="w-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Later
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (variant === "toast") {
    return (
      <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 max-w-sm z-40 animate-slide-up">
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
