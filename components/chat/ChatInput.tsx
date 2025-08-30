"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChatInputProps } from "@/types/chat";
import { Send } from "lucide-react";
import { AudioRecorder } from "./AudioRecorder";

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage }) => {
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  // Handle audio recording
  const handleAudioRecorded = (audioBlob: Blob, duration: number) => {
    // Create a URL for the audio blob
    const audioUrl = URL.createObjectURL(audioBlob);

    // Create an audio message
    const audioMessage = {
      id: `${Date.now()}-audio-${Math.random().toString(36).substr(2, 9)}`,
      content: "",
      sender: "user" as const,
      timestamp: new Date(),
      type: "audio" as const,
      audioUrl,
      duration,
    };

    // Send the audio message
    onSendMessage(audioMessage);
  };

  return (
    <div className="border-t border-gray-200 bg-transparent p-4 sticky bottom-0 bg-white">
      <form onSubmit={handleSubmit} className="flex items-center gap-3">
        <AudioRecorder
          onAudioRecorded={handleAudioRecorded}
          isRecording={isRecording}
          setIsRecording={setIsRecording}
        />
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask Vina anything..."
            className="w-full resize-none rounded-lg border py-2 mt-1 border-gray-300 px-4 pr-12 focus:border-green focus:outline-none focus:ring-1 focus:border-none focus:ring-green"
            rows={1}
            style={{
              minHeight: "44px",
              maxHeight: "100px",
            }}
          />
        </div>
        <button
          type="submit"
          disabled={!message.trim()}
          className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#013F25] text-white transition-colors hover:bg-[#012A1A] disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          <Send className="h-5 w-5" />
        </button>
      </form>
    </div>
  );
};
