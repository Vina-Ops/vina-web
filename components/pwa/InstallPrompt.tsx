"use client";

import React, { useState, useRef, useEffect } from "react";
import { Download, X, Smartphone, Move } from "lucide-react";
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
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const promptRef = useRef<HTMLDivElement>(null);

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

  // Load saved position from localStorage
  useEffect(() => {
    const savedPosition = localStorage.getItem("pwa-install-position");
    if (savedPosition) {
      try {
        const parsed = JSON.parse(savedPosition);
        setPosition(parsed);
      } catch (error) {
        console.error("Failed to parse saved position:", error);
      }
    }
  }, []);

  // Save position to localStorage when it changes
  useEffect(() => {
    if (variant === "floating") {
      localStorage.setItem("pwa-install-position", JSON.stringify(position));
    }
  }, [position, variant]);

  // Mouse event handlers for dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    if (variant !== "floating") return;

    e.preventDefault();
    setIsDragging(true);
    const rect = promptRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || variant !== "floating") return;

    const newX = e.clientX - dragOffset.x;
    const newY = e.clientY - dragOffset.y;

    // Keep within viewport bounds
    const maxX = window.innerWidth - (promptRef.current?.offsetWidth || 400);
    const maxY = window.innerHeight - (promptRef.current?.offsetHeight || 100);

    setPosition({
      x: Math.max(0, Math.min(newX, maxX)),
      y: Math.max(0, Math.min(newY, maxY)),
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Add/remove global mouse event listeners
  useEffect(() => {
    if (variant === "floating") {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, dragOffset, variant]);

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
      <div className="flex items-center space-x-6">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
            <Download className="w-5 h-5 text-green dark:text-white" />
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

      <div className="flex items-center space-x-2 pl-5">
        <button
          onClick={handleInstall}
          disabled={isInstalling}
          className="px-3 py-1.5 bg-green hover:bg-green/70 dark:text-gray-900 dark:bg-white dark:hover:bg-white/70 disabled:bg-gray-400 text-white text-xs font-medium rounded-lg transition-colors flex items-center space-x-2"
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
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[9998]">
        <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6 shadow-xl">
          <div className="text-center mb-4">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <Download className="w-8 h-8 text-green-600 dark:text-white" />
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
              className="w-full bg-green hover:bg-green/50 dark:text-gray-900 dark:bg-gray-200 dark:hover:bg-gray-300 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
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
              className="w-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-white font-medium py-2 px-4 rounded-lg transition-colors"
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
      <div
        ref={promptRef}
        className={`fixed bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 dark:text-white p-4 w-full max-w-md z-[9999] cursor-move select-none ${
          isDragging ? "shadow-2xl" : ""
        }`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: isDragging ? "scale(1.02)" : "scale(1)",
          transition: isDragging ? "none" : "transform 0.2s ease",
        }}
        onMouseDown={handleMouseDown}
      >
        {/* Drag handle */}
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <Move className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
              Drag to move
            </span>
          </div>
          <button
            onClick={handleDismiss}
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content without the dismiss button since it's now in the header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                <Download className="w-5 h-5 text-green dark:text-white" />
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

          <div className="flex items-center space-x-2 pl-5">
            <button
              onClick={handleInstall}
              disabled={isInstalling}
              className="px-3 py-1.5 bg-green hover:bg-green/70 dark:text-gray-900 dark:bg-white dark:hover:bg-white/70 disabled:bg-gray-400 text-white text-xs font-medium rounded-lg transition-colors flex items-center space-x-2"
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
          </div>
        </div>
      </div>
    );
  }

  // Default banner variant
  return (
    <div
      className={`bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 dark:text-white px-4 py-3 ${className}`}
    >
      {content}
    </div>
  );
};
