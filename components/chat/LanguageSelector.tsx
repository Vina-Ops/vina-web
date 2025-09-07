import React from "react";
import { Languages, Globe } from "lucide-react";
import { useTranslation, SUPPORTED_LANGUAGES } from "@/hooks/useTranslation";

interface LanguageSelectorProps {
  className?: string;
  showLabel?: boolean;
  compact?: boolean;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  className = "",
  showLabel = true,
  compact = false,
}) => {
  const {
    selectedLanguage,
    autoTranslate,
    setSelectedLanguage,
    setAutoTranslate,
    getLanguageName,
    getLanguageFlag,
  } = useTranslation();

  const handleLanguageChange = (languageCode: string) => {
    setSelectedLanguage(languageCode);
  };

  const handleAutoTranslateToggle = () => {
    setAutoTranslate(!autoTranslate);
  };

  if (compact) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <button
          onClick={handleAutoTranslateToggle}
          className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs transition-colors ${
            autoTranslate
              ? "bg-blue-100 text-blue-700 border border-blue-200"
              : "bg-gray-100 text-gray-600 border border-gray-200"
          }`}
          title={
            autoTranslate ? "Disable auto-translate" : "Enable auto-translate"
          }
        >
          <Globe className="w-3 h-3" />
          <span className="hidden sm:inline">
            {autoTranslate ? "Auto" : "Manual"}
          </span>
        </button>

        <select
          value={selectedLanguage}
          onChange={(e) => handleLanguageChange(e.target.value)}
          className="text-xs border border-gray-200 rounded-md px-2 py-1 bg-white dark:bg-gray-700 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        >
          {SUPPORTED_LANGUAGES.map((language) => (
            <option key={language.code} value={language.code}>
              {language.flag} {language.name}
            </option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {showLabel && (
        <div className="flex items-center gap-2">
          <Languages className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">
            Language Settings
          </span>
        </div>
      )}

      {/* Auto-translate Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-gray-600" />
          <span className="text-sm text-gray-700">Auto-translate messages</span>
        </div>
        <button
          onClick={handleAutoTranslateToggle}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            autoTranslate ? "bg-blue-600" : "bg-gray-200"
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              autoTranslate ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>

      {/* Language Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Translate to:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-40 overflow-y-auto">
          {SUPPORTED_LANGUAGES.map((language) => (
            <button
              key={language.code}
              onClick={() => handleLanguageChange(language.code)}
              className={`flex items-center gap-2 p-2 rounded-md border transition-colors ${
                selectedLanguage === language.code
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              <span className="text-lg">{language.flag}</span>
              <span className="text-sm font-medium">{language.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Current Status */}
      {autoTranslate && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
          <div className="flex items-center gap-2 text-blue-800">
            <Globe className="w-4 h-4" />
            <span className="text-sm font-medium">
              Auto-translating to {getLanguageFlag(selectedLanguage)}{" "}
              {getLanguageName(selectedLanguage)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
