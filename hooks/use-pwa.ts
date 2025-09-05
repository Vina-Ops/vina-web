import { useEffect, useState, useCallback } from "react";

interface PWAState {
  isInstalled: boolean;
  isOnline: boolean;
  hasUpdate: boolean;
  isInstalling: boolean;
  registration: ServiceWorkerRegistration | null;
}

interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export const usePWA = () => {
  const [state, setState] = useState<PWAState>({
    isInstalled: false,
    isOnline: navigator.onLine,
    hasUpdate: false,
    isInstalling: false,
    registration: null,
  });

  const [deferredPrompt, setDeferredPrompt] =
    useState<InstallPromptEvent | null>(null);

  // Check if app is installed
  const checkIfInstalled = useCallback(() => {
    const isInstalled =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true;
    setState((prev) => ({ ...prev, isInstalled }));
  }, []);

  // Handle online/offline status
  const handleOnlineStatus = useCallback(() => {
    setState((prev) => ({ ...prev, isOnline: navigator.onLine }));
  }, []);

  // Register service worker
  const registerServiceWorker = useCallback(async () => {
    // Skip PWA registration if disabled
    if (process.env.NEXT_PUBLIC_DISABLE_PWA === "true") {
      console.log("PWA disabled in development");
      return;
    }

    if ("serviceWorker" in navigator) {
      try {
        const registration = await navigator.serviceWorker.register("/sw.js");
        setState((prev) => ({ ...prev, registration }));

        // Handle service worker updates
        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener("statechange", () => {
              if (
                newWorker.state === "installed" &&
                navigator.serviceWorker.controller
              ) {
                setState((prev) => ({ ...prev, hasUpdate: true }));
              }
            });
          }
        });

        // Handle service worker controller change
        navigator.serviceWorker.addEventListener("controllerchange", () => {
          setState((prev) => ({ ...prev, hasUpdate: false }));
        });

        return registration;
      } catch (error) {
        console.error("Service Worker registration failed:", error);
      }
    }
  }, []);

  // Install PWA
  const installPWA = useCallback(async () => {
    // Skip PWA installation if disabled
    if (process.env.NEXT_PUBLIC_DISABLE_PWA === "true") {
      console.log("PWA installation disabled in development");
      return;
    }

    if (deferredPrompt) {
      setState((prev) => ({ ...prev, isInstalling: true }));

      try {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === "accepted") {
          console.log("PWA installed successfully");
          setDeferredPrompt(null);
          checkIfInstalled();
        }
      } catch (error) {
        console.error("PWA installation failed:", error);
      } finally {
        setState((prev) => ({ ...prev, isInstalling: false }));
      }
    }
  }, [deferredPrompt, checkIfInstalled]);

  // Update service worker
  const updateServiceWorker = useCallback(() => {
    if (state.registration && state.registration.waiting) {
      state.registration.waiting.postMessage({ type: "SKIP_WAITING" });
    }
  }, [state.registration]);

  // Store offline action
  const storeOfflineAction = useCallback(
    (action: any) => {
      if (state.registration && state.registration.active) {
        state.registration.active.postMessage({
          type: "STORE_OFFLINE_ACTION",
          action: {
            ...action,
            timestamp: Date.now(),
          },
        });
      }
    },
    [state.registration]
  );

  // Request notification permission
  const requestNotificationPermission = useCallback(async () => {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission();
      return permission === "granted";
    }
    return false;
  }, []);

  // Subscribe to push notifications
  const subscribeToPushNotifications = useCallback(async () => {
    if (!state.registration) return false;

    try {
      const subscription = await state.registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
      });

      // Send subscription to server
      await fetch("/api/push/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(subscription),
      });

      return true;
    } catch (error) {
      console.error("Failed to subscribe to push notifications:", error);
      return false;
    }
  }, [state.registration]);

  // Initialize PWA
  useEffect(() => {
    // Check if already installed
    checkIfInstalled();

    // Listen for online/offline events
    window.addEventListener("online", handleOnlineStatus);
    window.addEventListener("offline", handleOnlineStatus);

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as InstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Listen for appinstalled event
    const handleAppInstalled = () => {
      console.log("PWA was installed");
      setDeferredPrompt(null);
      checkIfInstalled();
    };

    window.addEventListener("appinstalled", handleAppInstalled);

    // Register service worker
    registerServiceWorker();

    return () => {
      window.removeEventListener("online", handleOnlineStatus);
      window.removeEventListener("offline", handleOnlineStatus);
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, [checkIfInstalled, handleOnlineStatus, registerServiceWorker]);

  return {
    ...state,
    installPWA,
    updateServiceWorker,
    storeOfflineAction,
    requestNotificationPermission,
    subscribeToPushNotifications,
    canInstall: !!deferredPrompt,
  };
};
