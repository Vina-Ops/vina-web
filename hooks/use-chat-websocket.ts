import { useState, useEffect, useCallback } from "react";
import { Message } from "@/types/chat";
import { getChatWebSocketService } from "@/services/chat-service";
import notificationSound from "@/utils/notification-sound";
import { useNotification } from "@/context/notification-context";

export const useChatWebSocket = () => {
  const { settings } = useNotification();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(true); // Track initial connection attempt
  const [error, setError] = useState<string | null>(null);

  // Handle incoming messages from WebSocket
  const handleIncomingMessage = useCallback((message: Message) => {
   
    setMessages((prev) => {
      const newMessages = [...prev, message];
     
      return newMessages;
    });
    setIsTyping(false);
    
    // Play notification sound for incoming AI messages
    if (message.sender === 'ai' && settings.soundEnabled) {
      notificationSound.play(settings.volume);
    }
  }, []);

  // Handle typing indicators
  const handleTyping = useCallback((isTyping: boolean) => {
    setIsTyping(isTyping);
  }, []);

  // Handle connection status changes
  const handleConnectionChange = useCallback((connected: boolean) => {
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

    // Add user message to UI immediately
    const userMessage: Message = {
      id: `${Date.now()}-user-${Math.random().toString(36).substr(2, 9)}`,
      content: content.trim(),
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
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
      service.onMessage(handleIncomingMessage);
      service.onTyping(handleTyping);
      service.onConnectionChange(handleConnectionChange);
      service.onError(handleError);

      // Check initial connection status
      const initialStatus = service.isConnected();
   
      setIsConnected(initialStatus);
      setIsConnecting(false); // Stop connecting state after initial check

      // Cleanup on unmount
      return () => {
       
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
