"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface NotificationSettings {
  soundEnabled: boolean;
  volume: number;
  incomingCallSoundEnabled: boolean;
}

interface NotificationContextType {
  settings: NotificationSettings;
  updateSettings: (newSettings: Partial<NotificationSettings>) => void;
  toggleSound: () => void;
  toggleIncomingCallSound: () => void;
  setVolume: (volume: number) => void;
}

const defaultSettings: NotificationSettings = {
  soundEnabled: true,
  volume: 0.7,
  incomingCallSoundEnabled: true,
};

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [settings, setSettings] =
    useState<NotificationSettings>(defaultSettings);

  // Load settings from localStorage on mount
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem("notification-settings");
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        setSettings({ ...defaultSettings, ...parsed });
      }
    } catch (error) {
      console.warn("Failed to load notification settings:", error);
    }
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem("notification-settings", JSON.stringify(settings));
    } catch (error) {
      console.warn("Failed to save notification settings:", error);
    }
  }, [settings]);

  const updateSettings = (newSettings: Partial<NotificationSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const toggleSound = () => {
    setSettings((prev) => ({ ...prev, soundEnabled: !prev.soundEnabled }));
  };

  const toggleIncomingCallSound = () => {
    setSettings((prev) => ({
      ...prev,
      incomingCallSoundEnabled: !prev.incomingCallSoundEnabled,
    }));
  };

  const setVolume = (volume: number) => {
    setSettings((prev) => ({
      ...prev,
      volume: Math.max(0, Math.min(1, volume)),
    }));
  };

  const value: NotificationContextType = {
    settings,
    updateSettings,
    toggleSound,
    toggleIncomingCallSound,
    setVolume,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
