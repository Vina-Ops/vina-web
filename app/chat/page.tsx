"use client";

import React, { useRef, useEffect, useState } from "react";
import {
  FixedNavbar,
  defaultNavItems,
} from "@/components/navigation/FixedNavbar";
import { ChatMessages } from "@/components/chat/ChatMessages";
import { ChatInput } from "@/components/chat/ChatInput";
import { SearchPage } from "@/components/chat/SearchPage";
import { useChatWebSocket } from "@/hooks/use-chat-websocket";
import { useWebSocket } from "@/context/websocket-context";
import { getChatWebSocketService } from "@/services/chat-service";
import { Message } from "@/types/chat";
import { ConnectionLoading } from "@/components/ui/ConnectionLoading";
import { DateHeader } from "@/components/chat/DateHeader";

export default function ChatPage() {
  const { messages, isTyping, isConnecting, error, sendMessage, clearError } =
    useChatWebSocket();
  const { isConnected } = useWebSocket();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showSearch, setShowSearch] = useState(false);

  // console.log("ChatPage: isConnected from WebSocket context:", isConnected);

  // Debug function to force reconnect
  const forceReconnect = async () => {
    const { resetChatWebSocketService } = await import(
      "@/services/chat-service"
    );
    resetChatWebSocketService();
    window.location.reload();
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (content: string | Message) => {
    sendMessage(content);
  };

  const handleSearchClick = () => {
    setShowSearch(true);
  };

  const handleCloseSearch = () => {
    setShowSearch(false);
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl + / to enter search mode
      if (event.ctrlKey && event.key === "/") {
        event.preventDefault();
        setShowSearch(true);
      }

      // Escape to close search
      if (event.key === "Escape" && showSearch) {
        setShowSearch(false);
      }

      // Ctrl + H to go home
      if (event.ctrlKey && event.key === "h") {
        event.preventDefault();
        window.location.href = "/";
      }

      // Ctrl + P to go to profile
      if (event.ctrlKey && event.key === "p") {
        event.preventDefault();
        window.location.href = "/profile";
      }

      // Ctrl + , to go to settings
      if (event.ctrlKey && event.key === ",") {
        event.preventDefault();
        window.location.href = "/settings";
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [showSearch]);

  // Show search page if search is active
  if (showSearch) {
    return <SearchPage messages={messages} onClose={handleCloseSearch} />;
  }

  console.log("ChatPage: isConnecting", isConnecting);

  return (
    <>
      {/* Connection Loading Overlay */}

      <div className="flex h-screen relative">
        <ConnectionLoading
          isConnecting={isConnecting}
          isConnected={isConnected}
          error={error}
          onRetry={forceReconnect}
        />

        {/* Fixed Sidebar Navigation */}
        <FixedNavbar
          navItems={defaultNavItems}
          isConnected={isConnected}
          onReconnect={forceReconnect}
          onSearchClick={handleSearchClick}
        />

        {/* Main Content Area */}
        <div
          className="flex flex-col flex-1 md:ml-64"
          style={{
            backgroundImage: `url("https://res.cloudinary.com/ddynvenje/image/upload/v1751293217/vina/vina-background_w4kipf.svg")`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm">{error}</p>
                  </div>
                </div>
                <button onClick={clearError} className="ml-auto pl-3">
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          )}

          <DateHeader messages={messages} />

          <ChatMessages
            messages={messages}
            isTyping={isTyping}
            messagesEndRef={messagesEndRef}
          />
          <ChatInput onSendMessage={handleSendMessage} />
        </div>
      </div>
    </>
  );
}
