import { useState, useCallback } from "react";

export interface TranslationResult {
  success: boolean;
  originalText: string;
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
  timestamp: string;
  error?: string;
}

export interface LanguageDetectionResult {
  success: boolean;
  text: string;
  detectedLanguage: string;
  timestamp: string;
  error?: string;
}

export interface BatchTranslationResult {
  success: boolean;
  messages: any[];
  targetLanguage: string;
  sourceLanguage: string;
  timestamp: string;
  error?: string;
}

// Supported languages for the translation feature
export const SUPPORTED_LANGUAGES = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "es", name: "Spanish", flag: "🇪🇸" },
  { code: "fr", name: "French", flag: "🇫🇷" },
  { code: "de", name: "German", flag: "🇩🇪" },
  { code: "it", name: "Italian", flag: "🇮🇹" },
  { code: "pt", name: "Portuguese", flag: "🇵🇹" },
  { code: "ru", name: "Russian", flag: "🇷🇺" },
  { code: "ja", name: "Japanese", flag: "🇯🇵" },
  { code: "ko", name: "Korean", flag: "🇰🇷" },
  { code: "zh", name: "Chinese", flag: "🇨🇳" },
  { code: "ar", name: "Arabic", flag: "🇸🇦" },
  { code: "hi", name: "Hindi", flag: "🇮🇳" },
  { code: "nl", name: "Dutch", flag: "🇳🇱" },
  { code: "sv", name: "Swedish", flag: "🇸🇪" },
  { code: "no", name: "Norwegian", flag: "🇳🇴" },
  { code: "da", name: "Danish", flag: "🇩🇰" },
  { code: "fi", name: "Finnish", flag: "🇫🇮" },
  { code: "pl", name: "Polish", flag: "🇵🇱" },
  { code: "tr", name: "Turkish", flag: "🇹🇷" },
  { code: "th", name: "Thai", flag: "🇹🇭" },
  { code: "vi", name: "Vietnamese", flag: "🇻🇳" },
  { code: "id", name: "Indonesian", flag: "🇮🇩" },
  { code: "ms", name: "Malay", flag: "🇲🇾" },
  { code: "tl", name: "Filipino", flag: "🇵🇭" },
];

export const useTranslation = () => {
  const [isTranslating, setIsTranslating] = useState(false);
  const [isDetectingLanguage, setIsDetectingLanguage] = useState(false);
  const [isBatchTranslating, setIsBatchTranslating] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("en");
  const [autoTranslate, setAutoTranslate] = useState<boolean>(false);

  // Translate single text
  const translateText = useCallback(
    async (
      text: string,
      targetLanguage: string,
      sourceLanguage?: string
    ): Promise<TranslationResult> => {
      setIsTranslating(true);

      try {
        const response = await fetch("/api/translate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text,
            targetLanguage,
            sourceLanguage,
          }),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Translation failed");
        }

        return result;
      } catch (error) {
        console.error("Translation error:", error);
        return {
          success: false,
          originalText: text,
          translatedText: text,
          sourceLanguage: sourceLanguage || "unknown",
          targetLanguage,
          timestamp: new Date().toISOString(),
          error: error instanceof Error ? error.message : "Translation failed",
        };
      } finally {
        setIsTranslating(false);
      }
    },
    []
  );

  // Detect language of text
  const detectLanguage = useCallback(
    async (text: string): Promise<LanguageDetectionResult> => {
      setIsDetectingLanguage(true);

      try {
        const response = await fetch(
          `/api/translate?text=${encodeURIComponent(text)}`,
          {
            method: "GET",
          }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Language detection failed");
        }

        return result;
      } catch (error) {
        console.error("Language detection error:", error);
        return {
          success: false,
          text,
          detectedLanguage: "unknown",
          timestamp: new Date().toISOString(),
          error:
            error instanceof Error
              ? error.message
              : "Language detection failed",
        };
      } finally {
        setIsDetectingLanguage(false);
      }
    },
    []
  );

  // Translate multiple messages
  const translateMessages = useCallback(
    async (
      messages: any[],
      targetLanguage: string,
      sourceLanguage?: string
    ): Promise<BatchTranslationResult> => {
      setIsBatchTranslating(true);

      try {
        const response = await fetch("/api/translate", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messages,
            targetLanguage,
            sourceLanguage,
          }),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Batch translation failed");
        }

        return result;
      } catch (error) {
        console.error("Batch translation error:", error);
        return {
          success: false,
          messages,
          targetLanguage,
          sourceLanguage: sourceLanguage || "unknown",
          timestamp: new Date().toISOString(),
          error:
            error instanceof Error ? error.message : "Batch translation failed",
        };
      } finally {
        setIsBatchTranslating(false);
      }
    },
    []
  );

  // Get language name from code
  const getLanguageName = useCallback((code: string): string => {
    const language = SUPPORTED_LANGUAGES.find((lang) => lang.code === code);
    return language ? language.name : code;
  }, []);

  // Get language flag from code
  const getLanguageFlag = useCallback((code: string): string => {
    const language = SUPPORTED_LANGUAGES.find((lang) => lang.code === code);
    return language ? language.flag : "🌐";
  }, []);

  // Auto-translate text based on selected language
  const autoTranslateText = useCallback(
    async (
      text: string,
      sourceLanguage?: string
    ): Promise<TranslationResult> => {
      if (!autoTranslate || selectedLanguage === "en") {
        return {
          success: true,
          originalText: text,
          translatedText: text,
          sourceLanguage: sourceLanguage || "en",
          targetLanguage: selectedLanguage,
          timestamp: new Date().toISOString(),
        };
      }

      return await translateText(text, selectedLanguage, sourceLanguage);
    },
    [autoTranslate, selectedLanguage, translateText]
  );

  return {
    // State
    isTranslating,
    isDetectingLanguage,
    isBatchTranslating,
    selectedLanguage,
    autoTranslate,

    // Functions
    translateText,
    detectLanguage,
    translateMessages,
    autoTranslateText,
    getLanguageName,
    getLanguageFlag,
    setSelectedLanguage,
    setAutoTranslate,

    // Constants
    SUPPORTED_LANGUAGES,
  };
};
