import React from "react";

export interface Message {
  id: string;
  content: string;
  sender: "user" | "therapist" | "ai";
  timestamp: string;
  type: "text" | "audio" | "image" | "file";
  isRead: boolean;
  status?: "sending" | "sent" | "delivered" | "failed";
  audioUrl?: string;
  duration?: number;
  transcription?: string;
}

export interface LinkMetadata {
  url: string;
  title: string;
  description: string;
}

export interface AudioMessage {
  id: string;
  audioUrl: string;
  duration: number;
  sender: "user" | "ai";
  timestamp: Date;
  transcription?: string;
}

export interface ChatMessageProps {
  message: Message;
  highlightQuery?: string;
}

export interface ChatMessagesProps {
  messages: Message[];
  isTyping: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

export interface ChatInputProps {
  onSendMessage: (message: string | Message) => void;
}
