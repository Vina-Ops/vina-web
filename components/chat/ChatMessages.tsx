"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { ChatMessagesProps } from "@/types/chat";
import { ChatMessage } from "./ChatMessage";
import { TypingIndicator } from "./TypingIndicator";

export const ChatMessages: React.FC<ChatMessagesProps> = ({
  messages,
  isTyping,
  messagesEndRef,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [stickyDate, setStickyDate] = useState<string>("");
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Sort messages by timestamp to ensure proper chronological order
  const sortedMessages = [...messages].sort((a, b) => {
    const timestampA =
      typeof a.timestamp === "string" ? new Date(a.timestamp) : a.timestamp;
    const timestampB =
      typeof b.timestamp === "string" ? new Date(b.timestamp) : b.timestamp;
    const result = timestampA.getTime() - timestampB.getTime();

    // Debug logging
    if (process.env.NODE_ENV === "development") {
      console.log("Message sort:", {
        messageA: { content: a.content, timestamp: timestampA.toISOString() },
        messageB: { content: b.content, timestamp: timestampB.toISOString() },
        result,
      });
    }

    return result;
  });

  // Group messages by date for better organization
  const groupMessagesByDate = (messages: any[]) => {
    const groups: { [key: string]: any[] } = {};

    messages.forEach((message) => {
      const timestamp =
        typeof message.timestamp === "string"
          ? new Date(message.timestamp)
          : message.timestamp;
      const dateKey = timestamp.toDateString();
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(message);
    });

    return groups;
  };

  const messageGroups = groupMessagesByDate(sortedMessages);

  // Sort date groups chronologically
  const sortedDateKeys = Object.keys(messageGroups).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  );

  // Function to format date display
  const formatDateDisplay = useCallback((dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
  }, []);

  // Scroll handler for sticky date
  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    let isUpdating = false;

    const handleScroll = () => {
      if (isUpdating) return;

      const scrollTop = container.scrollTop;
      const containerHeight = container.clientHeight;
      const scrollHeight = container.scrollHeight;

      // Check if we're at the bottom
      const isAtBottom = scrollTop + containerHeight >= scrollHeight - 100;

      if (isAtBottom && sortedMessages.length > 0) {
        const latestMessage = sortedMessages[sortedMessages.length - 1];
        const latestDate = latestMessage.timestamp.toDateString();
        if (latestDate !== stickyDate) {
          isUpdating = true;
          setStickyDate(latestDate);
          setTimeout(() => {
            isUpdating = false;
          }, 100);
        }
        return;
      }

      // Find which date section is most visible
      const dateSections = container.querySelectorAll("[data-date-key]");
      let currentDate = "";

      for (let i = dateSections.length - 1; i >= 0; i--) {
        const section = dateSections[i] as HTMLElement;
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;

        // Check if this section is visible in the viewport
        if (
          scrollTop <= sectionTop + sectionHeight &&
          scrollTop + containerHeight >= sectionTop
        ) {
          currentDate = section.getAttribute("data-date-key") || "";
          break;
        }
      }

      if (currentDate && currentDate !== stickyDate) {
        isUpdating = true;
        setStickyDate(currentDate);
        setTimeout(() => {
          isUpdating = false;
        }, 100);
      }
    };

    // Initial call
    handleScroll();

    // Add scroll listener
    container.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, [sortedMessages, stickyDate]);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (messagesEndRef.current && containerRef.current) {
      const container = containerRef.current;
      const isScrolledToBottom =
        container.scrollTop + container.clientHeight >=
        container.scrollHeight - 100;

      // Only auto-scroll if user is already at or near the bottom
      if (isScrolledToBottom) {
        container.scrollTop = container.scrollHeight;
      }
    }
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col">
      {/* Sticky Date Header - Fixed at top */}
      {stickyDate && (
        <div className="sticky top-0 z-10 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 py-2 transition-all duration-200">
          <div className="flex justify-center">
            <div className="bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full shadow-sm">
              <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                {formatDateDisplay(stickyDate)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Messages Container */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto px-4 space-y-4 chat-scrollbar bg-transparent pt-6 pb-6"
        style={{ scrollBehavior: "smooth" }}
      >
        {sortedDateKeys.map((dateKey) => (
          <div key={dateKey} className="space-y-4" data-date-key={dateKey}>
            {/* Date separator */}
            <div className="flex justify-center">
              <div className="bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
                <span className="text-xs text-gray-500 dark:text-gray-400 uppercase">
                  {formatDateDisplay(dateKey)}
                </span>
              </div>
            </div>

            {/* Messages for this date */}
            {messageGroups[dateKey].map((message, index) => (
              <div
                key={message.id || `${dateKey}-${index}`}
                // data-message-timestamp={message.timestamp.getTime()}
                className="scroll-mt-20" // Offset for sticky header
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
