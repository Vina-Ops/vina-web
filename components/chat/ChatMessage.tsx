"use client";

import React, { useState, useEffect } from "react";
import { ChatMessageProps } from "@/types/chat";
import { LinkPreview } from "./LinkPreview";
import { AudioMessage } from "./AudioMessage";
import { TranslationButton } from "./TranslationButton";
import { useTranslation } from "@/hooks/useTranslation";
import {
  extractUrls,
  getTextWithoutUrls,
  getLinkMetadata,
} from "@/utils/link-utils";

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, highlightQuery }) => {
  const isUser = message.sender === "user";

  // Helper function to highlight search terms
  const highlightText = (text: string, query?: string) => {
    if (!query || !query.trim()) return text;
    
    const regex = new RegExp(`(${query})`, "gi");
    const parts = text.split(regex);
    
    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 px-1 rounded">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };
  const [linkMetadata, setLinkMetadata] = useState<
    Array<{
      url: string;
      title: string;
      description: string;
      image: string | null;
      siteName: string | null;
    }>
  >([]);
  const [translatedContent, setTranslatedContent] = useState<string | null>(
    null
  );
  const [isAutoTranslating, setIsAutoTranslating] = useState(false);

  const {
    autoTranslate,
    selectedLanguage,
    autoTranslateText,
    getLanguageName,
    getLanguageFlag,
  } = useTranslation();

  // console.log("Rendering message:", message); // Debug log

  // Auto-translate message content when language changes
  useEffect(() => {
    if (
      autoTranslate &&
      message.type !== "audio" &&
      typeof message.content === "string" &&
      message.content.trim() &&
      selectedLanguage !== "en"
    ) {
      setIsAutoTranslating(true);
      autoTranslateText(message.content)
        .then((result) => {
          if (result.success && result.translatedText !== message.content) {
            setTranslatedContent(result.translatedText);
          } else {
            setTranslatedContent(null);
          }
        })
        .catch((error) => {
          console.error("Auto-translation failed:", error);
          setTranslatedContent(null);
        })
        .finally(() => {
          setIsAutoTranslating(false);
        });
    } else {
      setTranslatedContent(null);
    }
  }, [
    autoTranslate,
    selectedLanguage,
    message.content,
    message.type,
    autoTranslateText,
  ]);

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
            <div className="space-y-2">
              {/* Translated content */}
              {translatedContent && (
                <div className="relative">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {highlightText(getTextWithoutUrls(translatedContent), highlightQuery)}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-xs text-blue-600 flex items-center gap-1">
                      <span>{getLanguageFlag(selectedLanguage)}</span>
                      <span>
                        Translated to {getLanguageName(selectedLanguage)}
                      </span>
                    </span>
                  </div>
                </div>
              )}

              {/* Original content */}
              <div className={`${translatedContent ? "opacity-60" : ""}`}>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {typeof message.content === "string"
                    ? highlightText(getTextWithoutUrls(message.content), highlightQuery)
                    : message.content}
                </p>
                {translatedContent && (
                  <div className="text-xs text-gray-500 mt-1">
                    Original message
                  </div>
                )}
              </div>

              {/* Auto-translating indicator */}
              {isAutoTranslating && (
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <div className="w-3 h-3 border border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
                  <span>Translating...</span>
                </div>
              )}
            </div>

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
          className={`flex items-center justify-between mt-1 ${
            isUser ? "text-gray-300" : "text-gray-500"
          }`}
        >
          <div className="text-xs">
            {new Date(message.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>

          {/* Translation Button - only for text messages */}
          {message.type !== "audio" && typeof message.content === "string" && (
            <TranslationButton
              text={message.content}
              messageId={message.id}
              className={isUser ? "text-gray-300" : "text-gray-500"}
            />
          )}
        </div>
      </div>
    </div>
  );
};
