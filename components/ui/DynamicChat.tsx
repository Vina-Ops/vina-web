"use client";

import React, { useState, useEffect, useRef } from "react";
import Logo from "../logo";
import { useLanguage } from "@/context/language-context";

interface Message {
  id: string;
  sender: "ai" | "user";
  content: string;
  delay: number;
}

// This will be generated dynamically based on translations

// This will be generated dynamically based on translations

export const DynamicChat: React.FC = () => {
  const [currentConversation, setCurrentConversation] = useState(0);
  const [visibleMessages, setVisibleMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { t } = useLanguage();

  // Generate conversation types from translations
  const conversationTypes = [
    {
      id: 0,
      title: t("dynamicChat.conversations.work.title"),
      icon: "💼",
      description: t("dynamicChat.conversations.work.description"),
    },
    {
      id: 1,
      title: t("dynamicChat.conversations.sleep.title"),
      icon: "😴",
      description: t("dynamicChat.conversations.sleep.description"),
    },
    {
      id: 2,
      title: t("dynamicChat.conversations.general.title"),
      icon: "🤗",
      description: t("dynamicChat.conversations.general.description"),
    },
  ];

  // Generate conversations from translations
  const conversations = [
    // Work Conversation
    [
      {
        id: "1",
        sender: "ai" as const,
        content: t("dynamicChat.conversations.work.messages.ai1"),
        delay: 0,
      },
      {
        id: "2",
        sender: "user" as const,
        content: t("dynamicChat.conversations.work.messages.user1"),
        delay: 1,
      },
      {
        id: "3",
        sender: "ai" as const,
        content: t("dynamicChat.conversations.work.messages.ai2"),
        delay: 2.5,
      },
      {
        id: "4",
        sender: "user" as const,
        content: t("dynamicChat.conversations.work.messages.user2"),
        delay: 4,
      },
      {
        id: "5",
        sender: "ai" as const,
        content: t("dynamicChat.conversations.work.messages.ai3"),
        delay: 5.5,
      },
    ],

    // Sleep Conversation
    [
      {
        id: "1",
        sender: "ai" as const,
        content: t("dynamicChat.conversations.sleep.messages.ai1"),
        delay: 0,
      },
      {
        id: "2",
        sender: "user" as const,
        content: t("dynamicChat.conversations.sleep.messages.user1"),
        delay: 1,
      },
      {
        id: "3",
        sender: "ai" as const,
        content: t("dynamicChat.conversations.sleep.messages.ai2"),
        delay: 2.5,
      },
      {
        id: "4",
        sender: "user" as const,
        content: t("dynamicChat.conversations.sleep.messages.user2"),
        delay: 4,
      },
      {
        id: "5",
        sender: "ai" as const,
        content: t("dynamicChat.conversations.sleep.messages.ai3"),
        delay: 5.5,
      },
    ],

    // General Conversation
    [
      {
        id: "1",
        sender: "ai" as const,
        content: t("dynamicChat.conversations.general.messages.ai1"),
        delay: 0,
      },
      {
        id: "2",
        sender: "user" as const,
        content: t("dynamicChat.conversations.general.messages.user1"),
        delay: 1,
      },
      {
        id: "3",
        sender: "ai" as const,
        content: t("dynamicChat.conversations.general.messages.ai2"),
        delay: 2.5,
      },
      {
        id: "4",
        sender: "user" as const,
        content: t("dynamicChat.conversations.general.messages.user2"),
        delay: 4,
      },
      {
        id: "5",
        sender: "ai" as const,
        content: t("dynamicChat.conversations.general.messages.ai3"),
        delay: 5.5,
      },
    ],
  ];

  const scrollToBottom = () => {
    const chatContainer = document.querySelector(".chat-messages-container");
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [visibleMessages, isTyping]);

  const handleConversationChange = (conversationId: number) => {
    // Clear any existing timeouts
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setCurrentConversation(conversationId);
    setCurrentMessageIndex(0);
    setVisibleMessages([]);
    setIsTyping(false);
  };

  useEffect(() => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    const conversation = conversations[currentConversation];

    const processMessage = (index: number) => {
      if (index >= conversation.length) {
        // Conversation finished, only cycle if auto-play is enabled
        if (isAutoPlay) {
          timeoutRef.current = setTimeout(() => {
            setCurrentConversation((prev) => (prev + 1) % conversations.length);
            setCurrentMessageIndex(0);
            setVisibleMessages([]);
          }, 3000);
        }
        return;
      }

      const message = conversation[index];

      if (message.sender === "ai") {
        // Show typing indicator first for AI messages
        setIsTyping(true);

        // Calculate typing duration based on message length
        const typingDuration = Math.max(1000, message.content.length * 50);

        // Show the message after typing
        timeoutRef.current = setTimeout(() => {
          setVisibleMessages((prev) => [...prev, message]);
          setIsTyping(false);
          setCurrentMessageIndex(index + 1);

          // Schedule next message after a pause
          timeoutRef.current = setTimeout(() => {
            processMessage(index + 1);
          }, 800);
        }, typingDuration);
      } else {
        // User messages appear instantly
        setVisibleMessages((prev) => [...prev, message]);
        setCurrentMessageIndex(index + 1);

        // Schedule next message after a pause
        timeoutRef.current = setTimeout(() => {
          processMessage(index + 1);
        }, 800);
      }
    };

    // Start processing messages
    processMessage(currentMessageIndex);

    // Cleanup function
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [currentConversation, isAutoPlay]); // Depend on currentConversation and isAutoPlay

  return (
    <div className="grid grid-cols-1 md:flex gap-6 items-start">
      {/* Conversation Selector */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 lg:w-64 flex-shrink-0">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-3 text-sm">
          {t("dynamicChat.title")}
        </h3>
        <div className="space-y-2">
          {conversationTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => handleConversationChange(type.id)}
              className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                currentConversation === type.id
                  ? "bg-green-100 dark:bg-green-900 border-2 border-green-500"
                  : "bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{type.icon}</span>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white text-sm">
                    {type.title}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {type.description}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Auto-play toggle */}
        <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-600">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isAutoPlay}
              onChange={(e) => setIsAutoPlay(e.target.checked)}
              className="rounded text-green-500 focus:ring-green-500 peer-[&:checked]:bg-green"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {t("dynamicChat.autoPlay")}
            </span>
          </label>
        </div>
      </div>

      {/* Chat Window */}
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 w-full animate-float">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-full flex items-center justify-center">
            <Logo />
          </div>
          <div>
            <div className="font-semibold text-gray-900 dark:text-white">
              Vina
            </div>
            <div className="text-xs text-gray-500 flex items-center">
              <div className="w-2 h-2 bg-green rounded-full mr-2 animate-pulse"></div>
              {isTyping
                ? t("dynamicChat.status.typing")
                : t("dynamicChat.status.online")}
            </div>
          </div>
        </div>

        <div className="space-y-3 max-h-96 lg:max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent pr-2 chat-messages-container flex flex-col">
          {visibleMessages.map((message, index) => (
            <div
              key={`${currentConversation}-${message.id}-${index}`}
              className={`flex items-start space-x-2 ${
                message.sender === "user" ? "justify-end" : ""
              } animate-fade-in`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {message.sender === "ai" && (
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                  <Logo />
                </div>
              )}

              <div
                className={`rounded-lg p-3 text-sm max-w-md break-words flex-1 flex-shrink-0 flex flex-wrap overflow-wrap-anywhere hyphens-auto ${
                  message.sender === "ai"
                    ? "bg-green text-white dark:bg-gray-700"
                    : "bg-green/10"
                }`}
              >
                <span className="typing-animation leading-relaxed block">
                  {message.content}
                </span>
              </div>

              {message.sender === "user" && (
                <div className="w-8 h-8 bg-green rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-bold">👨</span>
                </div>
              )}
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && visibleMessages.length > 0 && (
            <div className="flex items-start space-x-2 animate-fade-in">
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                <Logo />
              </div>
              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 text-sm">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
