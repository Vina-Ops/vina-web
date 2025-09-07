"use client";

import React, { useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";

export const TranslationDemo: React.FC = () => {
  const [text, setText] = useState("Hello, how are you today?");
  const [targetLanguage, setTargetLanguage] = useState("es");
  const [translatedText, setTranslatedText] = useState("");
  const [isTranslating, setIsTranslating] = useState(false);

  const {
    translateText,
    SUPPORTED_LANGUAGES,
    getLanguageName,
    getLanguageFlag,
  } = useTranslation();

  const handleTranslate = async () => {
    if (!text.trim()) return;

    setIsTranslating(true);
    try {
      const result = await translateText(text, targetLanguage);
      if (result.success) {
        setTranslatedText(result.translatedText);
      } else {
        console.error("Translation failed:", result.error);
      }
    } catch (error) {
      console.error("Translation error:", error);
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">
        AI Translation Demo
      </h2>

      <div className="space-y-4">
        {/* Input Text */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Text to translate:
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={3}
            placeholder="Enter text to translate..."
          />
        </div>

        {/* Language Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Target language:
          </label>
          <select
            value={targetLanguage}
            onChange={(e) => setTargetLanguage(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {SUPPORTED_LANGUAGES.map((language) => (
              <option key={language.code} value={language.code}>
                {language.flag} {language.name}
              </option>
            ))}
          </select>
        </div>

        {/* Translate Button */}
        <button
          onClick={handleTranslate}
          disabled={isTranslating || !text.trim()}
          className="w-full py-3 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isTranslating
            ? "Translating..."
            : `Translate to ${getLanguageName(targetLanguage)}`}
        </button>

        {/* Translation Result */}
        {translatedText && (
          <div className="mt-6 p-4 bg-gray-50 rounded-md">
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <span>{getLanguageFlag(targetLanguage)}</span>
              Translation ({getLanguageName(targetLanguage)}):
            </h3>
            <p className="text-gray-800 leading-relaxed">{translatedText}</p>
          </div>
        )}

        {/* Example Texts */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3">Try these examples:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {[
              "Hello, how are you today?",
              "I love learning new languages!",
              "Can you help me with this problem?",
              "Thank you for your assistance.",
              "What time is it?",
              "I am very happy to meet you.",
            ].map((example, index) => (
              <button
                key={index}
                onClick={() => setText(example)}
                className="p-2 text-left text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TranslationDemo;
