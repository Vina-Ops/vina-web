"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { getChatWebSocketService } from "@/services/chat-service";

interface WebSocketContextType {
  isConnected: boolean;
  error: string | null;
  clearError: () => void;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }
  return context;
};

interface WebSocketProviderProps {
  children: React.ReactNode;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({
  children,
}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const serviceRef = useRef<any>(null);

  useEffect(() => {
    const handlePathChange = () => {
      const currentPath =
        typeof window !== "undefined" ? window.location.pathname : "";
      const isAIChatPage = currentPath === "/chat";

      if (!isAIChatPage) {
        console.log("🚫 Not on AI chat page, skipping WebSocket connection");
        setIsConnected(false);
        setError(null);
        return;
      }

      try {
        // Get the WebSocket service
        const service = getChatWebSocketService();
        serviceRef.current = service;

        // Set up connection status handler
        service.onConnectionChange((connected: boolean) => {
          // console.log(
          //   "WebSocket Provider: Connection status changed to:",
          //   connected
          // );
          setIsConnected(connected);

          if (connected) {
            setError(null);
          }
        });

        // Set up error handler
        service.onError((errorMessage: string) => {
          console.error("WebSocket Provider: Error received:", errorMessage);
          setError(errorMessage);
        });

        // Check initial connection status
        const initialStatus = service.isConnected();
        // console.log(
        //   "WebSocket Provider: Initial connection status:",
        //   initialStatus
        // );
        setIsConnected(initialStatus);
      } catch (error) {
        console.error("WebSocket Provider: Failed to initialize:", error);
        setError("Failed to initialize WebSocket connection");
      }
    };

    // Check initial path
    handlePathChange();

    // Listen for path changes (for client-side navigation)
    const handlePopState = () => {
      handlePathChange();
    };

    // Listen for route changes using Next.js router events
    const handleRouteChange = () => {
      handlePathChange();
    };

    window.addEventListener("popstate", handlePopState);

    // Listen for Next.js route changes
    if (typeof window !== "undefined") {
      // Use a custom event to detect route changes
      window.addEventListener("routechange", handleRouteChange);
    }

    // Cleanup on unmount
    return () => {
      window.removeEventListener("popstate", handlePopState);
      if (typeof window !== "undefined") {
        window.removeEventListener("routechange", handleRouteChange);
      }

      // Clean up WebSocket service when provider unmounts
      if (serviceRef.current) {
        console.log("🧹 WebSocket Provider: Cleaning up service on unmount");
        try {
          const {
            cleanupChatWebSocketService,
          } = require("@/services/chat-service");
          cleanupChatWebSocketService();
        } catch (error) {
          console.error("Error cleaning up WebSocket service:", error);
        }
      }
    };
  }, []);

  const clearError = () => {
    setError(null);
  };

  const value: WebSocketContextType = {
    isConnected,
    error,
    clearError,
  };

  // console.log(
  //   "WebSocket Provider: Current state - isConnected:",
  //   isConnected,
  //   "error:",
  //   error
  // );

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};
