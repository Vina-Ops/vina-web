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

    // Cleanup on unmount
    return () => {
      if (serviceRef.current) {
        // Note: We don't disconnect here to maintain the singleton pattern
        // The service will handle reconnection automatically
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
