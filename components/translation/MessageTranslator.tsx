"use client";

import React, { useState, useEffect } from "react";
import { useTranslation } from "@/hooks/use-translation";
import { useLanguage } from "@/context/language-context";
import { Globe, RotateCcw, Check, X } from "lucide-react";

interface MessageTranslatorProps {
  message: string;
  originalLanguage?: string;
  onTranslationChange?: (translatedText: string) => void;
  showOriginal?: boolean;
  className?: string;
}

export function MessageTranslator({
  message,
  originalLanguage = "en",
  onTranslationChange,
  showOriginal = false,
  className = "",
}: MessageTranslatorProps) {
  const { locale } = useLanguage();
  const { translateMessage, isTranslating, error } = useTranslation();
  const [translatedText, setTranslatedText] = useState<string>("");
  const [showTranslation, setShowTranslation] = useState(false);
  const [hasTranslated, setHasTranslated] = useState(false);

  // Auto-translate if the target language is different from the original
  useEffect(() => {
    if (locale !== originalLanguage && message && !hasTranslated) {
      handleTranslate();
    }
  }, [locale, originalLanguage, message, hasTranslated]);

  const handleTranslate = async () => {
    if (!message.trim()) return;

    const result = await translateMessage(
      message,
      locale,
      originalLanguage as any
    );
    setTranslatedText(result);
    setHasTranslated(true);
    setShowTranslation(true);
    onTranslationChange?.(result);
  };

  const handleToggleTranslation = () => {
    setShowTranslation(!showTranslation);
  };

  const handleReset = () => {
    setTranslatedText("");
    setShowTranslation(false);
    setHasTranslated(false);
    onTranslationChange?.(message);
  };

  const shouldShowTranslator = locale !== originalLanguage && message.trim();

  if (!shouldShowTranslator) {
    return <div className={className}>{message}</div>;
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Original Message */}
      <div className="text-gray-700 dark:text-gray-300">{message}</div>

      {/* Translation Controls */}
      <div className="flex items-center gap-2">
        {!hasTranslated ? (
          <button
            onClick={handleTranslate}
            disabled={isTranslating}
            className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors disabled:opacity-50"
          >
            <Globe className="w-3 h-3" />
            {isTranslating ? "Translating..." : "Translate"}
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleTranslation}
              className="flex items-center gap-1 px-2 py-1 text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded hover:bg-green-200 dark:hover:bg-green-800 transition-colors"
            >
              <Check className="w-3 h-3" />
              {showTranslation ? "Hide" : "Show"} Translation
            </button>
            <button
              onClick={handleReset}
              className="flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-1 text-xs text-red-600 dark:text-red-400">
          <X className="w-3 h-3" />
          {error}
        </div>
      )}

      {/* Translated Message */}
      {showTranslation && translatedText && (
        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border-l-4 border-blue-500">
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
            Translated to {locale.toUpperCase()}
          </div>
          <div className="text-gray-800 dark:text-gray-200">
            {translatedText}
          </div>
        </div>
      )}
    </div>
  );
}

