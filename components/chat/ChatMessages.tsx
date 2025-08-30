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
  const [stickyDate, setStickyDate] = useState<string>("");

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

  // Handle scroll to update sticky date
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const container = containerRef.current;
      const scrollTop = container.scrollTop;
      const containerHeight = container.clientHeight;

      // Find the date that should be sticky based on scroll position
      let currentStickyDate = "";

      // Get all date elements
      const dateElements = container.querySelectorAll("[data-date-key]");

      dateElements.forEach((element) => {
        const rect = element.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();

        // If the date element is at or near the top of the visible area
        if (
          rect.top <= containerRect.top + 60 &&
          rect.bottom > containerRect.top
        ) {
          currentStickyDate = element.getAttribute("data-date-key") || "";
        }
      });

      setStickyDate(currentStickyDate);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, [messageGroups]);

  return (
    <div className="flex-1 flex flex-col relative">
      {/* Sticky Date Header */}
      {stickyDate && (
        <div className="sticky top-0 z-10 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 py-2">
          <div className="flex justify-center">
            <div className="bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full shadow-sm">
              <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                {new Date(stickyDate).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Messages Container */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto px-4 py-6 space-y-4 chat-scrollbar bg-transparent"
      >
        {Object.entries(messageGroups).map(([dateKey, dateMessages]) => (
          <div key={dateKey} className="space-y-4">
            {/* Date separator (hidden when sticky) */}
            <div
              className={`flex justify-center ${
                stickyDate === dateKey ? "opacity-0" : ""
              }`}
              data-date-key={dateKey}
            >
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
    </div>
  );
};
