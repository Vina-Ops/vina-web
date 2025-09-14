"use client";

import React, { useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { Languages, Zap, Shield, CheckCircle, XCircle } from "lucide-react";

export default function TranslationFreeDemo() {
  const {
    translateText,
    detectLanguage,
    isTranslating,
    isDetectingLanguage,
    selectedLanguage,
    setSelectedLanguage,
    SUPPORTED_LANGUAGES,
    getLanguageName,
    getLanguageFlag,
  } = useTranslation();

  const [inputText, setInputText] = useState("");
  const [translationResult, setTranslationResult] = useState<any>(null);
  const [detectionResult, setDetectionResult] = useState<any>(null);

  const handleTranslate = async () => {
    if (!inputText.trim()) return;

    const result = await translateText(inputText, selectedLanguage);
    setTranslationResult(result);
  };

  const handleDetectLanguage = async () => {
    if (!inputText.trim()) return;

    const result = await detectLanguage(inputText);
    setDetectionResult(result);
  };

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case "google":
        return <Shield className="h-4 w-4 text-green-500" />;
      case "libretranslate":
        return <Zap className="h-4 w-4 text-blue-500" />;
      case "mymemory":
        return <Zap className="h-4 w-4 text-purple-500" />;
      case "openai":
        return <Zap className="h-4 w-4 text-orange-500" />;
      default:
        return <Zap className="h-4 w-4 text-gray-500" />;
    }
  };

  const getProviderName = (provider: string) => {
    switch (provider) {
      case "google":
        return "Google Translate (Free)";
      case "libretranslate":
        return "LibreTranslate (Free)";
      case "mymemory":
        return "MyMemory (Free)";
      case "openai":
        return "OpenAI GPT-4o-mini (Fallback)";
      default:
        return "Unknown";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <Languages className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Free Translation Demo
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input Section */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Text to Translate
                </label>
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Enter text to translate..."
                  className="w-full h-32 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Target Language
                </label>
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.flag} {lang.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleTranslate}
                  disabled={isTranslating || !inputText.trim()}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  {isTranslating ? "Translating..." : "Translate"}
                </button>
                <button
                  onClick={handleDetectLanguage}
                  disabled={isDetectingLanguage || !inputText.trim()}
                  className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  {isDetectingLanguage ? "Detecting..." : "Detect Language"}
                </button>
              </div>
            </div>

            {/* Results Section */}
            <div className="space-y-4">
              {/* Translation Result */}
              {translationResult && (
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Translation Result
                    </h3>
                    {translationResult.provider && (
                      <div className="flex items-center gap-1 ml-auto">
                        {getProviderIcon(translationResult.provider)}
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {getProviderName(translationResult.provider)}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Original:
                      </span>
                      <p className="text-gray-900 dark:text-white">
                        {translationResult.originalText}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Translated:
                      </span>
                      <p className="text-gray-900 dark:text-white font-medium">
                        {translationResult.translatedText}
                      </p>
                    </div>
                    {translationResult.confidence && (
                      <div>
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          Confidence:
                        </span>
                        <span className="ml-2 text-sm text-gray-900 dark:text-white">
                          {(translationResult.confidence * 100).toFixed(1)}%
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Language Detection Result */}
              {detectionResult && (
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Language Detection
                    </h3>
                    {detectionResult.provider && (
                      <div className="flex items-center gap-1 ml-auto">
                        {getProviderIcon(detectionResult.provider)}
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {getProviderName(detectionResult.provider)}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Detected Language:
                      </span>
                      <span className="ml-2 text-gray-900 dark:text-white font-medium">
                        {getLanguageFlag(detectionResult.detectedLanguage)}{" "}
                        {getLanguageName(detectionResult.detectedLanguage)}
                      </span>
                    </div>
                    {detectionResult.confidence && (
                      <div>
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          Confidence:
                        </span>
                        <span className="ml-2 text-sm text-gray-900 dark:text-white">
                          {(detectionResult.confidence * 100).toFixed(1)}%
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Error Display */}
              {(translationResult?.error || detectionResult?.error) && (
                <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <XCircle className="h-5 w-5 text-red-500" />
                    <h3 className="font-semibold text-red-800 dark:text-red-400">
                      Error
                    </h3>
                  </div>
                  <p className="text-red-700 dark:text-red-300 text-sm">
                    {translationResult?.error || detectionResult?.error}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Free Translation Info */}
          <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <h3 className="font-semibold text-blue-800 dark:text-blue-400 mb-2">
              🆓 Free Translation Services
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-green-500" />
                <span className="text-blue-700 dark:text-blue-300">
                  <strong>Google Translate:</strong> 500K chars/month free
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-blue-500" />
                <span className="text-blue-700 dark:text-blue-300">
                  <strong>LibreTranslate:</strong> Open-source, unlimited
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-purple-500" />
                <span className="text-blue-700 dark:text-blue-300">
                  <strong>MyMemory:</strong> Free with rate limits
                </span>
              </div>
            </div>
            <p className="text-blue-600 dark:text-blue-400 text-sm mt-2">
              OpenAI GPT-4o-mini is used as a fallback when free services are
              unavailable.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
