"use client";

import React, { useState, useEffect, useRef } from "react";
import { ChatMessagesProps } from "@/types/chat";
import { ChatMessage } from "./ChatMessage";
import { TypingIndicator } from "./TypingIndicator";

export const ChatMessages: React.FC<ChatMessagesProps> = ({
  messages,
  isTyping,
  messagesEndRef,
}) => {
  // console.log("Messages in ChatMessages:", messages); // Debug log
  const containerRef = useRef<HTMLDivElement>(null);

  // Sort messages by timestamp to ensure proper chronological order
  const sortedMessages = [...messages].sort(
    (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
  );

  // Group messages by date for better organization
  const groupMessagesByDate = (messages: any[]) => {
    const groups: { [key: string]: any[] } = {};

    messages.forEach((message) => {
      const dateKey = message.timestamp.toDateString();
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(message);
    });

    return groups;
  };

  const messageGroups = groupMessagesByDate(sortedMessages);

  // Scroll to bottom when new messages are added
  useEffect(() => {
    if (messagesEndRef.current && containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto px-4 py-6 space-y-4 chat-scrollbar bg-transparent relative"
    >
      {Object.entries(messageGroups).map(([dateKey, dateMessages]) => (
        <div key={dateKey} className="space-y-4">
          {/* Date separator */}
          <div className="flex justify-center">
            <div className="bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {new Date(dateKey).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>

          {/* Messages for this date */}
          {dateMessages.map((message) => (
            <div
              key={message.id}
              data-message-timestamp={message.timestamp.getTime()}
            >
              <ChatMessage message={message} />
            </div>
          ))}
        </div>
      ))}

      {isTyping && <TypingIndicator />}

      <div ref={messagesEndRef} />
    </div>
  );
};
