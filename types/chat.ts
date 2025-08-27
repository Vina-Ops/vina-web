import React from 'react';

export interface Message {
  id: string;
  content: string | React.ReactNode;
  sender: "user" | "ai";
  timestamp: Date;
  type?: "text" | "audio";
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
}

export interface ChatMessagesProps {
  messages: Message[];
  isTyping: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

export interface ChatInputProps {
  onSendMessage: (message: string | Message) => void;
}
