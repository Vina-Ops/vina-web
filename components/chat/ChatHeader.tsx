"use client";

import React from "react";
import { Search } from "lucide-react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import Logo from "@/components/logo";
import { getChatWebSocketService } from "@/services/chat-service";

interface ChatHeaderProps {
  isConnected?: boolean;
  onReconnect?: () => void;
  onSearchClick?: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  isConnected,
  onReconnect,
  onSearchClick,
}) => {
  // console.log("ChatHeader: isConnected prop:", isConnected);

  return (
    <div className="text-white px-4 py-1 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="w-fit mr-auto flex justify-start">
          {/* Vina Logo */}
          {/* <Logo /> */}
          <div className="flex items-center gap-4"> VIA</div>
        </div>

        <div className="flex items-center gap-5">
          {/* Search Button */}
          {onSearchClick && (
            <button
              onClick={onSearchClick}
              className="p-2 text-green hover:text-green/80 hover:bg-white/10 rounded-lg transition-colors"
              title="Search messages"
            >
              <Search className="w-5 h-5" />
            </button>
          )}

          {/* Connection Status Indicator */}
          {isConnected !== undefined && (
            <div className="flex items-center gap-4">
              <div
                className={`w-2 h-2 rounded-full ${
                  isConnected ? "bg-green" : "bg-yellow-400"
                }`}
              />
              <span
                className={`text-xs ${
                  isConnected ? "text-green" : "text-yellow-400"
                }`}
              >
                {isConnected ? "Connected" : "Connecting..."}
              </span>
              {!isConnected && onReconnect && (
                <div className="flex gap-1">
                  <button
                    onClick={onReconnect}
                    className="text-xs bg-secondary hover:bg-secondary/80 px-3 py-1 rounded"
                  >
                    Reconnect
                  </button>
                  {/* <button
                    onClick={() => {
                      const service = getChatWebSocketService();
                      service.tryTokenParamAuth();
                    }}
                    className="text-xs bg-green-500 hover:bg-green-600 px-2 py-1 rounded"
                  >
                    Try Token
                  </button>
                  <button
                    onClick={() => {
                      const service = getChatWebSocketService();
                      service.debugConnection();
                    }}
                    className="text-xs bg-purple-500 hover:bg-purple-600 px-2 py-1 rounded"
                  >
                    Debug
                  </button>
                  <button
                    onClick={() => {
                      const service = getChatWebSocketService();
                      service.testSimpleConnection();
                    }}
                    className="text-xs bg-orange-500 hover:bg-orange-600 px-2 py-1 rounded"
                  >
                    Test Simple
                  </button> */}
                </div>
              )}
            </div>
          )}

          {/* Dark Mode Toggle */}
          <ThemeToggle />
        </div>
      </div>

      {/* Today indicator */}
      {/* <div className="mt-2 text-center">
        <span className="bg-green-500 px-3 py-1 rounded-full text-sm font-medium">
          TODAY
        </span>
      </div> */}
    </div>
  );
};
