import { useState, useCallback } from "react";
import { Locale } from "@/context/language-context";

interface TranslationResult {
  originalText: string;
  translatedText: string;
  sourceLang: Locale;
  targetLang: Locale;
}

export function useTranslation() {
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const translateText = useCallback(
    async (
      text: string,
      targetLang: Locale,
      sourceLang: Locale = "en"
    ): Promise<TranslationResult | null> => {
      if (!text.trim()) return null;

      setIsTranslating(true);
      setError(null);

      try {
        const response = await fetch("/api/translate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: text.trim(),
            targetLang,
            sourceLang,
          }),
        });

        if (!response.ok) {
          throw new Error(`Translation failed: ${response.statusText}`);
        }

        const result: TranslationResult = await response.json();
        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Translation failed";
        setError(errorMessage);
        console.error("Translation error:", err);
        return null;
      } finally {
        setIsTranslating(false);
      }
    },
    []
  );

  const translateMessage = useCallback(
    async (
      message: string,
      targetLang: Locale,
      sourceLang: Locale = "en"
    ): Promise<string> => {
      const result = await translateText(message, targetLang, sourceLang);
      return result?.translatedText || message;
    },
    [translateText]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    translateText,
    translateMessage,
    isTranslating,
    error,
    clearError,
  };
}

