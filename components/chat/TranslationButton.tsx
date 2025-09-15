import React, { useState } from "react";
import { Languages, Loader2, Check, X } from "lucide-react";
import { useTranslation, SUPPORTED_LANGUAGES } from "@/hooks/useTranslation";

interface TranslationButtonProps {
  text: string;
  messageId: string;
  onTranslationComplete?: (
    translatedText: string,
    targetLanguage: string
  ) => void;
  className?: string;
}

export const TranslationButton: React.FC<TranslationButtonProps> = ({
  text,
  messageId,
  onTranslationComplete,
  className = "",
}) => {
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [translatedText, setTranslatedText] = useState<string | null>(null);
  const [targetLanguage, setTargetLanguage] = useState<string>("");
  const [showTranslation, setShowTranslation] = useState(false);

  const { translateText, isTranslating, getLanguageName, getLanguageFlag } =
    useTranslation();

  const handleTranslate = async (languageCode: string) => {
    try {
      const result = await translateText(text, languageCode);

      if (result.success) {
        setTranslatedText(result.translatedText);
        setTargetLanguage(languageCode);
        setShowTranslation(true);
        setShowLanguageSelector(false);

        // Notify parent component
        onTranslationComplete?.(result.translatedText, languageCode);
      }
    } catch (error) {
      console.error("Translation failed:", error);
    }
  };

  const handleCloseTranslation = () => {
    setShowTranslation(false);
    setTranslatedText(null);
    setTargetLanguage("");
  };

  const handleShowOriginal = () => {
    setShowTranslation(false);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Translation Button */}
      <button
        onClick={() => setShowLanguageSelector(!showLanguageSelector)}
        disabled={isTranslating}
        className="flex items-center gap-1 px-2 py-1 text-xs text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors disabled:opacity-50"
        title="Translate message"
      >
        {isTranslating ? (
          <Loader2 className="w-3 h-3 animate-spin" />
        ) : (
          <Languages className="w-3 h-3" />
        )}
        <span className="hidden sm:inline">Translate</span>
      </button>

      {/* Language Selector Dropdown */}
      {showLanguageSelector && (
        <div className="absolute bottom-8 left-0 z-[80] bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto min-w-48">
          <div className="p-2">
            <div className="text-xs font-medium text-gray-500 mb-2 px-2">
              Select language:
            </div>
            {SUPPORTED_LANGUAGES.map((language) => (
              <button
                key={language.code}
                onClick={() => handleTranslate(language.code)}
                disabled={isTranslating}
                className="w-full flex items-center gap-2 px-2 py-1.5 text-sm hover:bg-gray-100 rounded-md transition-colors disabled:opacity-50"
              >
                <span className="text-base">{language.flag}</span>
                <span>{language.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Translation Display */}
      {showTranslation && translatedText && (
        <div className="absolute bottom-8 left-0 z-50 bg-white border border-gray-200 rounded-lg shadow-lg max-w-sm p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-base">
                {getLanguageFlag(targetLanguage)}
              </span>
              <span className="text-sm font-medium text-gray-700">
                {getLanguageName(targetLanguage)}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={handleShowOriginal}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                title="Show original"
              >
                <X className="w-3 h-3" />
              </button>
              <button
                onClick={handleCloseTranslation}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                title="Close translation"
              >
                <Check className="w-3 h-3" />
              </button>
            </div>
          </div>
          <div className="text-sm text-gray-800 leading-relaxed">
            {translatedText}
          </div>
        </div>
      )}

      {/* Backdrop to close dropdowns */}
      {(showLanguageSelector || showTranslation) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowLanguageSelector(false);
            if (!showTranslation) {
              setShowTranslation(false);
            }
          }}
        />
      )}
    </div>
  );
};
