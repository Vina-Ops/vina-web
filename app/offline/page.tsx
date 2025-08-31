"use client";

import React, { useEffect, useState } from "react";
import { Wifi, WifiOff, RefreshCw, Home, MessageCircle } from "lucide-react";
import Link from "next/link";

export default function OfflinePage() {
  const [isOnline, setIsOnline] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const checkOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };

    // Check initial status
    checkOnlineStatus();

    // Listen for online/offline events
    window.addEventListener("online", checkOnlineStatus);
    window.addEventListener("offline", checkOnlineStatus);

    return () => {
      window.removeEventListener("online", checkOnlineStatus);
      window.removeEventListener("offline", checkOnlineStatus);
    };
  }, []);

  const handleRetry = () => {
    setRetryCount((prev) => prev + 1);
    window.location.reload();
  };

  const handleGoHome = () => {
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
        {/* Status Icon */}
        <div className="mb-6">
          {isOnline ? (
            <div className="mx-auto w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
              <Wifi className="w-10 h-10 text-green-600 dark:text-green-400" />
            </div>
          ) : (
            <div className="mx-auto w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
              <WifiOff className="w-10 h-10 text-red-600 dark:text-red-400" />
            </div>
          )}
        </div>

        {/* Status Text */}
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {isOnline ? "You're Back Online!" : "You're Offline"}
        </h1>

        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {isOnline
            ? "Great! Your connection has been restored. You can now continue using Vina."
            : "Don't worry! You can still access some features while offline."}
        </p>

        {/* Offline Features */}
        {!isOnline && (
          <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
              Available Offline:
            </h3>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center justify-center space-x-2">
                <MessageCircle className="w-4 h-4" />
                <span>View cached chat history</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <Home className="w-4 h-4" />
                <span>Browse cached pages</span>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          {isOnline ? (
            <button
              onClick={handleRetry}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              <RefreshCw className="w-5 h-5" />
              <span>Continue to App</span>
            </button>
          ) : (
            <>
              <button
                onClick={handleRetry}
                disabled={retryCount > 3}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <RefreshCw
                  className={`w-5 h-5 ${retryCount > 3 ? "animate-spin" : ""}`}
                />
                <span>{retryCount > 3 ? "Retrying..." : "Try Again"}</span>
              </button>

              <Link
                href="/"
                className="block w-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium py-3 px-4 rounded-lg transition-colors"
              >
                Go to Homepage
              </Link>
            </>
          )}
        </div>

        {/* Connection Tips */}
        {!isOnline && (
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
              Connection Tips:
            </h4>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <li>• Check your Wi-Fi or mobile data</li>
              <li>• Try moving to a different location</li>
              <li>• Restart your router if needed</li>
            </ul>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Vina - Your Mental Wellness Companion
          </p>
        </div>
      </div>
    </div>
  );
}
