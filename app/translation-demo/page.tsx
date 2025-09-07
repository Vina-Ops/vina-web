"use client";

import React, { useState } from "react";
import { LanguageSelector } from "@/components/chat/LanguageSelector";
import { useTranslation } from "@/hooks/useTranslation";

export default function TranslationDemoPage() {
  const [messages, setMessages] = useState([
    {
      id: "1",
      content: "Hello! How are you today?",
      sender: "user",
      timestamp: new Date().toISOString(),
      type: "text",
    },
    {
      id: "2",
      content:
        "I'm doing great, thank you for asking! How can I help you today?",
      sender: "ai",
      timestamp: new Date().toISOString(),
      type: "text",
    },
    {
      id: "3",
      content: "I need help with my project. Can you assist me?",
      sender: "user",
      timestamp: new Date().toISOString(),
      type: "text",
    },
    {
      id: "4",
      content:
        "Of course! I'd be happy to help you with your project. What specific area do you need assistance with?",
      sender: "ai",
      timestamp: new Date().toISOString(),
      type: "text",
    },
  ]);

  const { autoTranslate, selectedLanguage } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 text-white p-6">
            <h1 className="text-2xl font-bold">AI Translation Demo</h1>
            <p className="text-blue-100 mt-2">
              Select a language and enable auto-translate to see messages
              automatically translated
            </p>
          </div>

          {/* Language Settings */}
          <div className="p-6 border-b border-gray-200">
            <LanguageSelector showLabel={true} />
          </div>

          {/* Status */}
          <div className="p-4 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                {autoTranslate ? (
                  <span className="text-green-600 font-medium">
                    ✅ Auto-translation is enabled
                  </span>
                ) : (
                  <span className="text-gray-500">
                    ⏸️ Auto-translation is disabled
                  </span>
                )}
              </div>
              <div className="text-sm text-gray-500">
                Selected: {selectedLanguage.toUpperCase()}
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs lg:max-w-xl px-4 py-3 rounded-2xl shadow-sm ${
                    message.sender === "user"
                      ? "bg-blue-600 text-white rounded-br-md"
                      : "bg-gray-100 text-gray-900 rounded-bl-md"
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </p>
                  <div
                    className={`text-xs mt-1 ${
                      message.sender === "user"
                        ? "text-blue-200"
                        : "text-gray-500"
                    }`}
                  >
                    {new Date(message.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Instructions */}
          <div className="p-6 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              How to use:
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
              <li>Select a target language from the language selector above</li>
              <li>
                Toggle "Auto-translate messages" to enable automatic translation
              </li>
              <li>
                Watch as all messages are automatically translated to your
                selected language
              </li>
              <li>Both original and translated text will be displayed</li>
              <li>Toggle off auto-translate to return to original messages</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
