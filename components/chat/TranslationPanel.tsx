import React, { useState, useEffect } from "react";
import { Languages, Loader2, X, RotateCcw, Globe } from "lucide-react";
import { useTranslation, SUPPORTED_LANGUAGES } from "@/hooks/useTranslation";
import { Message } from "@/types/chat";

interface ExtendedMessage extends Message {
  originalContent?: string;
  isTranslated?: boolean;
}

interface TranslationPanelProps {
  messages: Message[];
  onMessagesUpdate: (messages: Message[]) => void;
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

export const TranslationPanel: React.FC<TranslationPanelProps> = ({
  messages,
  onMessagesUpdate,
  isOpen,
  onClose,
  className = "",
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState<string>("en");
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationHistory, setTranslationHistory] = useState<
    Record<string, string>
  >({});

  const {
    translateMessages,
    isBatchTranslating,
    getLanguageName,
    getLanguageFlag,
  } = useTranslation();

  // Auto-detect language from first message
  useEffect(() => {
    if (messages.length > 0 && !translationHistory[selectedLanguage]) {
      // You could implement auto-detection here if needed
    }
  }, [messages, selectedLanguage, translationHistory]);

  const handleTranslateAll = async () => {
    if (messages.length === 0) return;

    setIsTranslating(true);

    try {
      const result = await translateMessages(messages, selectedLanguage);

      if (result.success) {
        onMessagesUpdate(result.messages);
        setTranslationHistory((prev) => ({
          ...prev,
          [selectedLanguage]: new Date().toISOString(),
        }));
      }
    } catch (error) {
      console.error("Batch translation failed:", error);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleRevertTranslation = () => {
    const revertedMessages = messages.map((msg) => ({
      ...msg,
      content: (msg as ExtendedMessage).originalContent || msg.content,
      originalContent: undefined,
      isTranslated: false,
    }));
    onMessagesUpdate(revertedMessages);
  };

  const hasTranslatedMessages = messages.some(
    (msg) => (msg as ExtendedMessage).isTranslated
  );

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4 ${className}`}
    >
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Languages className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">
              Translate Chat
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Language Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Translate to:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-40 overflow-y-auto">
              {SUPPORTED_LANGUAGES.map((language) => (
                <button
                  key={language.code}
                  onClick={() => setSelectedLanguage(language.code)}
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

          {/* Translation Status */}
          {hasTranslatedMessages && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
              <div className="flex items-center gap-2 text-yellow-800">
                <Globe className="w-4 h-4" />
                <span className="text-sm font-medium">
                  Chat is currently translated to{" "}
                  {getLanguageName(selectedLanguage)}
                </span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleTranslateAll}
              disabled={
                isTranslating || isBatchTranslating || messages.length === 0
              }
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isTranslating || isBatchTranslating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Languages className="w-4 h-4" />
              )}
              <span>
                {isTranslating || isBatchTranslating
                  ? "Translating..."
                  : `Translate to ${getLanguageName(selectedLanguage)}`}
              </span>
            </button>

            {hasTranslatedMessages && (
              <button
                onClick={handleRevertTranslation}
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Show Original</span>
              </button>
            )}
          </div>

          {/* Message Preview */}
          {messages.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preview ({messages.length} messages):
              </label>
              <div className="bg-gray-50 rounded-md p-3 max-h-40 overflow-y-auto">
                <div className="space-y-2">
                  {messages.slice(0, 3).map((message) => (
                    <div key={message.id} className="text-sm">
                      <div className="font-medium text-gray-600">
                        {message.sender === "user"
                          ? "You"
                          : message.sender === "therapist"
                          ? "Therapist"
                          : "AI"}
                        :
                      </div>
                      <div className="text-gray-800">
                        {message.content.length > 100
                          ? `${message.content.substring(0, 100)}...`
                          : message.content}
                      </div>
                    </div>
                  ))}
                  {messages.length > 3 && (
                    <div className="text-xs text-gray-500">
                      ... and {messages.length - 3} more messages
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-gray-200 bg-gray-50">
          <div className="text-xs text-gray-500">Translation powered by AI</div>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onClose}
              className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
