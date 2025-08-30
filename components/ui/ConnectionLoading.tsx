"use client";

import React from "react";

interface ConnectionLoadingProps {
  isConnecting: boolean;
  isConnected: boolean;
  error?: string | null;
  onRetry?: () => void;
}

export const ConnectionLoading: React.FC<ConnectionLoadingProps> = ({
  isConnecting,
  isConnected,
  error,
  onRetry,
}) => {
  // Only show the modal if we're connecting or there's an error
  if (!isConnecting && !error) return null;

  return (
    <div className="fixed inset-0 bg-gray-50/80 backdrop-blur-sm z-[70] flex items-center justify-center w-full">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4">
        {isConnecting ? (
          <div className="text-center">
            {/* Animated Loading Spinner */}
            <div className="relative mb-6">
              <div className="w-16 h-16 border-4 border-gray-200 rounded-full mx-auto"></div>
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-16 h-16 border-4 border-green rounded-full border-t-transparent animate-spin"></div>
            </div>

            {/* Loading Text */}
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Connecting to Vina
            </h3>
            <p className="text-gray-600 text-sm">
              Establishing secure connection...
            </p>

            {/* Animated Dots */}
            <div className="flex justify-center mt-4 space-x-1">
              <div className="w-2 h-2 bg-green rounded-full animate-bounce"></div>
              <div
                className="w-2 h-2 bg-green rounded-full animate-bounce"
                style={{ animationDelay: "0.1s" }}
              ></div>
              <div
                className="w-2 h-2 bg-green rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
            </div>
          </div>
        ) : error ? (
          <div className="text-center">
            {/* Error Icon */}
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>

            {/* Error Text */}
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Connection Failed
            </h3>
            <p className="text-gray-600 text-sm mb-6">{error}</p>

            {/* Retry Button */}
            {onRetry && (
              <button
                onClick={onRetry}
                className="bg-green hover:bg-green/80 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
              >
                Try Again
              </button>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
};
