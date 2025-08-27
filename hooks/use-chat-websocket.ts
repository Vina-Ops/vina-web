import { useState, useEffect, useCallback } from "react";
import { Message } from "@/types/chat";
import { getChatWebSocketService } from "@/services/chat-service";

export const useChatWebSocket = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(true); // Track initial connection attempt
  const [error, setError] = useState<string | null>(null);

  // Handle incoming messages from WebSocket
  const handleIncomingMessage = useCallback((message: Message) => {
    // console.log("Adding new message:", message);
    setMessages((prev) => {
      const newMessages = [...prev, message];
      // console.log("Updated messages array:", newMessages);
      return newMessages;
    });
    setIsTyping(false);
  }, []);

  // Handle typing indicators
  const handleTyping = useCallback((isTyping: boolean) => {
    setIsTyping(isTyping);
  }, []);

  // Handle connection status changes
  const handleConnectionChange = useCallback((connected: boolean) => {
    // console.log("Hook: Connection change handler called with:", connected);
    setIsConnected(connected);
    setIsConnecting(false); // Stop connecting state once we get a connection status
    if (connected) {
      setError(null);
    }
  }, []);

  // Handle WebSocket errors
  const handleError = useCallback((errorMessage: string) => {
    setError(errorMessage);
    setIsConnecting(false); // Stop connecting state on error
    console.error("Chat WebSocket error:", errorMessage);

    // If WebSocket fails, simulate AI response for testing
    setTimeout(() => {
      const aiResponse: Message = {
        id: `${Date.now()}-fallback-${Math.random().toString(36).substr(2, 9)}`,
        content: "I'm here to help you. What would you like to talk about?",
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000);
  }, []);

  // Send message through WebSocket
  const sendMessage = useCallback((content: string | Message) => {
    // Handle Message object (for audio messages)
    if (typeof content === "object") {
      setMessages((prev) => [...prev, content]);
      return;
    }

    // Handle string content (for text messages)
    if (!content.trim()) return;

    // console.log("Sending message:", content);

    // Add user message to UI immediately
    const userMessage: Message = {
      id: `${Date.now()}-user-${Math.random().toString(36).substr(2, 9)}`,
      content: content.trim(),
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    // console.log("Added user message to UI:", userMessage);

    // Show typing indicator while waiting for response
    setIsTyping(true);

    // Send message through WebSocket
    try {
      const service = getChatWebSocketService();
      service.sendMessage(content);
    } catch (error) {
      console.warn("WebSocket service not available:", error);
      // Handle the case where WebSocket is not available
      setError("WebSocket connection not available");
      setIsTyping(false);
    }
  }, []);

  // Set up WebSocket event handlers
  useEffect(() => {
    try {
      const service = getChatWebSocketService();
      // console.log("Hook: Setting up WebSocket handlers");

      service.onMessage(handleIncomingMessage);
      service.onTyping(handleTyping);
      service.onConnectionChange(handleConnectionChange);
      service.onError(handleError);

      // Check initial connection status
      const initialStatus = service.isConnected();
      // console.log("Hook: Initial connection status:", initialStatus);
      setIsConnected(initialStatus);
      setIsConnecting(false); // Stop connecting state after initial check

      // Cleanup on unmount
      return () => {
        // Note: We don't disconnect here to maintain the singleton pattern
        // The service will handle reconnection automatically
      };
    } catch (error) {
      console.warn("WebSocket service not available:", error);
      // Set connected to false if service is not available
      setIsConnected(false);
      setIsConnecting(false); // Stop connecting state on service error
    }
  }, [
    handleIncomingMessage,
    handleTyping,
    handleConnectionChange,
    handleError,
  ]);

  // Clear error when connection is restored
  useEffect(() => {
    if (isConnected && error) {
      setError(null);
    }
  }, [isConnected, error]);

  return {
    messages,
    isTyping,
    isConnected,
    isConnecting,
    error,
    sendMessage,
    clearError: () => setError(null),
  };
};
