"use client";

import React, { useState, useEffect, useRef } from "react";
import Logo from "../logo";

interface Message {
  id: string;
  sender: "ai" | "user";
  content: string;
  delay: number;
}

const conversationTypes = [
  {
    id: 0,
    title: "Work Stress",
    icon: "💼",
    description: "Dealing with work pressure and deadlines",
  },
  {
    id: 1,
    title: "Sleep Issues",
    icon: "😴",
    description: "Improving sleep quality and relaxation",
  },
  {
    id: 2,
    title: "General Support",
    icon: "🤗",
    description: "General emotional support and conversation",
  },
];

const conversations = [
  // Work Conversation
  [
    {
      id: "1",
      sender: "ai" as const,
      content:
        "Hello! I'm here to listen and support you. How are you feeling today? 🌟",
      delay: 0,
    },
    {
      id: "2",
      sender: "user" as const,
      content:
        "Hi Vina, I've been feeling a bit overwhelmed lately with work and everything...",
      delay: 1,
    },
    {
      id: "3",
      sender: "ai" as const,
      content:
        "I hear you, and it's completely normal to feel that way. Work stress can really take a toll. What specifically has been the most challenging for you lately?",
      delay: 2.5,
    },
    {
      id: "4",
      sender: "user" as const,
      content:
        "I think it's the deadlines and feeling like I'm not doing enough. Plus, I haven't been sleeping well...",
      delay: 4,
    },
    {
      id: "5",
      sender: "ai" as const,
      content:
        "That sounds really tough. Sleep is so important for our mental health. Have you tried any relaxation techniques before bed? I'd love to help you find some strategies that work for you. 💙",
      delay: 5.5,
    },
  ],

  // Sleep Conversation
  [
    {
      id: "1",
      sender: "ai" as const,
      content: "Good morning! How did you sleep last night? 😊",
      delay: 0,
    },
    {
      id: "2",
      sender: "user" as const,
      content:
        "Actually, I had a really good night's sleep for the first time in weeks!",
      delay: 1,
    },
    {
      id: "3",
      sender: "ai" as const,
      content:
        "That's wonderful to hear! What do you think helped you sleep better?",
      delay: 2.5,
    },
    {
      id: "4",
      sender: "user" as const,
      content:
        "I tried the breathing exercises you suggested. They really helped calm my mind.",
      delay: 4,
    },
    {
      id: "5",
      sender: "ai" as const,
      content:
        "I'm so glad those worked for you! Consistency is key. Would you like to explore some other relaxation techniques? 🌸",
      delay: 5.5,
    },
  ],

  // General Conversation
  [
    {
      id: "1",
      sender: "ai" as const,
      content:
        "Hi there! I noticed you've been quiet today. Everything okay? 🤗",
      delay: 0,
    },
    {
      id: "2",
      sender: "user" as const,
      content:
        "I'm just feeling a bit down. Nothing specific, just one of those days.",
      delay: 1,
    },
    {
      id: "3",
      sender: "ai" as const,
      content:
        "Those days are completely normal and valid. Sometimes we just need to acknowledge our feelings without trying to fix them. How about we just chat about whatever comes to mind?",
      delay: 2.5,
    },
    {
      id: "4",
      sender: "user" as const,
      content:
        "That sounds nice. Maybe I just need someone to talk to without any pressure.",
      delay: 4,
    },
    {
      id: "5",
      sender: "ai" as const,
      content:
        "Exactly! I'm here for exactly that. No pressure, no judgment, just a listening ear. What's on your mind? 💭",
      delay: 5.5,
    },
  ],
];

export const DynamicChat: React.FC = () => {
  const [currentConversation, setCurrentConversation] = useState(0);
  const [visibleMessages, setVisibleMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

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
    <div className="flex gap-6 items-start">
      {/* Conversation Selector */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 w-64 flex-shrink-0">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-3 text-sm">
          Choose Conversation Type
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
              Auto-play conversations
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
              {isTyping ? "Typing..." : "Online"}
            </div>
          </div>
        </div>

        <div className="space-y-3 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent pr-2 chat-messages-container flex flex-col">
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
