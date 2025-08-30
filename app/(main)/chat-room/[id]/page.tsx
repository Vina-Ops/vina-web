"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { AuthenticatedRoute } from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/context/auth-context";
import {
  ArrowLeft,
  Phone,
  Video,
  MoreVertical,
  Send,
  Paperclip,
  Smile,
  Mic,
  Image,
  File,
  X,
} from "lucide-react";

interface Message {
  id: string;
  content: string;
  sender: "user" | "therapist" | "ai";
  timestamp: string;
  type: "text" | "image" | "file" | "audio";
  isRead: boolean;
}

interface ChatParticipant {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
  isTherapist: boolean;
  specialization?: string;
  lastSeen: string;
}

const mockMessages: Message[] = [
  {
    id: "1",
    content: "Hello! How are you feeling today?",
    sender: "therapist",
    timestamp: "10:30 AM",
    type: "text",
    isRead: true,
  },
  {
    id: "2",
    content: "Hi Dr. Sarah, I'm feeling a bit anxious today.",
    sender: "user",
    timestamp: "10:32 AM",
    type: "text",
    isRead: true,
  },
  {
    id: "3",
    content:
      "I understand. Can you tell me more about what's causing the anxiety?",
    sender: "therapist",
    timestamp: "10:33 AM",
    type: "text",
    isRead: true,
  },
  {
    id: "4",
    content:
      "I have a big presentation at work tomorrow and I'm worried I'll mess up.",
    sender: "user",
    timestamp: "10:35 AM",
    type: "text",
    isRead: true,
  },
  {
    id: "5",
    content:
      "That's a common source of anxiety. Let's work through some breathing exercises together.",
    sender: "therapist",
    timestamp: "10:36 AM",
    type: "text",
    isRead: false,
  },
];

const mockParticipant: ChatParticipant = {
  id: "1",
  name: "Dr. Sarah Johnson",
  avatar:
    "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face",
  isOnline: true,
  isTherapist: true,
  specialization: "Anxiety & Depression",
  lastSeen: "2 minutes ago",
};

export default function ChatSessionPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const chatId = params.id as string;

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    // Simulate typing indicator
    if (
      messages.length > 0 &&
      messages[messages.length - 1].sender === "user"
    ) {
      setIsTyping(true);
      const timer = setTimeout(() => {
        setIsTyping(false);
        // Simulate therapist response
        const therapistResponse: Message = {
          id: Date.now().toString(),
          content:
            "Thank you for sharing that with me. I'm here to support you.",
          sender: "therapist",
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          type: "text",
          isRead: false,
        };
        setMessages((prev) => [...prev, therapistResponse]);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now().toString(),
        content: newMessage,
        sender: "user",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        type: "text",
        isRead: false,
      };
      setMessages((prev) => [...prev, message]);
      setNewMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleAttachment = (type: "image" | "file" | "audio") => {
    // Handle file attachment
    console.log("Attach", type);
    setShowAttachmentMenu(false);
  };

  const handleVoiceMessage = () => {
    // Handle voice message recording
    console.log("Record voice message");
  };

  return (
    <AuthenticatedRoute>
      <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => router.back()}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div className="relative">
                <img
                  className="h-10 w-10 rounded-full object-cover"
                  src={mockParticipant.avatar}
                  alt={mockParticipant.name}
                />
                <div
                  className={`absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-white ${
                    mockParticipant.isOnline ? "bg-green-400" : "bg-gray-400"
                  }`}
                />
              </div>
              <div>
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                  {mockParticipant.name}
                </h2>
                {mockParticipant.isTherapist &&
                  mockParticipant.specialization && (
                    <p className="text-sm text-blue-600 dark:text-blue-400">
                      {mockParticipant.specialization}
                    </p>
                  )}
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {mockParticipant.isOnline
                    ? "Online"
                    : "Last seen " + mockParticipant.lastSeen}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <Phone className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <Video className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <MoreVertical className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.sender === "user"
                    ? "bg-blue-600 text-white"
                    : message.sender === "therapist"
                    ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700"
                    : "bg-green-600 text-white"
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p
                  className={`text-xs mt-1 ${
                    message.sender === "user"
                      ? "text-blue-100"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  {message.timestamp}
                  {message.sender === "user" && (
                    <span className="ml-2">{message.isRead ? "✓✓" : "✓"}</span>
                  )}
                </p>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-end space-x-2">
            {/* Attachment Menu */}
            <div className="relative">
              <button
                onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <Paperclip className="h-5 w-5" />
              </button>

              {showAttachmentMenu && (
                <div className="absolute bottom-full left-0 mb-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-2">
                  <button
                    onClick={() => handleAttachment("image")}
                    className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  >
                    <Image className="h-4 w-4" />
                    <span>Image</span>
                  </button>
                  <button
                    onClick={() => handleAttachment("file")}
                    className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  >
                    <File className="h-4 w-4" />
                    <span>File</span>
                  </button>
                </div>
              )}
            </div>

            {/* Message Input */}
            <div className="flex-1">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                rows={1}
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 resize-none"
                style={{ minHeight: "40px", maxHeight: "120px" }}
              />
            </div>

            {/* Emoji Picker */}
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <Smile className="h-5 w-5" />
            </button>

            {/* Voice Message */}
            <button
              onClick={handleVoiceMessage}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <Mic className="h-5 w-5" />
            </button>

            {/* Send Button */}
            <button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>

          {/* Emoji Picker */}
          {showEmojiPicker && (
            <div className="mt-2 p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="grid grid-cols-8 gap-1">
                {[
                  "😊",
                  "😂",
                  "😍",
                  "🥰",
                  "😎",
                  "🤔",
                  "😢",
                  "😡",
                  "👍",
                  "👎",
                  "❤️",
                  "💔",
                  "🎉",
                  "🎂",
                  "🌹",
                  "☀️",
                ].map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => {
                      setNewMessage((prev) => prev + emoji);
                      setShowEmojiPicker(false);
                    }}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-lg"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </AuthenticatedRoute>
  );
}
