"use client";

import React, { useState, useEffect } from "react";
import { ChatMessageProps } from "@/types/chat";
import { LinkPreview } from "./LinkPreview";
import { AudioMessage } from "./AudioMessage";
import {
  extractUrls,
  getTextWithoutUrls,
  getLinkMetadata,
} from "@/utils/link-utils";

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.sender === "user";
  const [linkMetadata, setLinkMetadata] = useState<
    Array<{
      url: string;
      title: string;
      description: string;
      image: string | null;
      siteName: string | null;
    }>
  >([]);

  // console.log("Rendering message:", message); // Debug log

  // Extract URLs and get metadata (only for text messages)
  useEffect(() => {
    if (
      message.type !== "audio" &&
      typeof message.content === "string" &&
      message.content
    ) {
      const urls = extractUrls(message.content);
      if (urls.length > 0) {
        const fetchMetadata = async () => {
          const metadata = await Promise.all(
            urls.map(async (url) => {
              const data = await getLinkMetadata(url);
              return { url, ...data };
            })
          );
          setLinkMetadata(metadata);
        };
        fetchMetadata();
      }
    }
  }, [message.content, message.type]);

  // Handle transcription
  const handleTranscribe = (transcription: string) => {
    // console.log("Transcription received:", transcription);
    // In a real app, you would send this transcription to the AI
    // For now, we'll just log it
  };

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      <div
        className={`max-w-xs lg:max-w-xl px-4 py-3 rounded-2xl shadow-sm ${
          isUser
            ? "bg-[#013F25] text-white rounded-br-md"
            : "bg-white text-black rounded-bl-md"
        }`}
      >
        {/* Audio Message */}
        {message.type === "audio" && message.audioUrl && message.duration ? (
          <AudioMessage
            audioUrl={message.audioUrl}
            duration={message.duration}
            isUserMessage={isUser}
            onTranscribe={handleTranscribe}
          />
        ) : (
          <>
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {typeof message.content === "string"
                ? getTextWithoutUrls(message.content)
                : message.content}
            </p>

            {/* Link Previews */}
            {linkMetadata.map((link, index) => (
              <LinkPreview
                key={`${link.url}-${index}`}
                url={link.url}
                title={link.title}
                description={link.description}
                isUserMessage={isUser}
              />
            ))}
          </>
        )}
        <div
          className={`text-xs mt-1 ${
            isUser ? "text-gray-300" : "text-gray-500"
          }`}
        >
          {message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
    </div>
  );
};
