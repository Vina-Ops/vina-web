"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Locale = "en" | "fr" | "de" | "es" | "ko" | "zh";

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

// Import translations from JSON files
import enTranslations from "@/messages/en.json";
import frTranslations from "@/messages/fr.json";
import deTranslations from "@/messages/de.json";
import esTranslations from "@/messages/es.json";
import koTranslations from "@/messages/ko.json";
import zhTranslations from "@/messages/zh.json";

const translations: Record<Locale, Record<string, any>> = {
  en: enTranslations,
  fr: frTranslations,
  de: deTranslations,
  es: esTranslations,
  ko: koTranslations,
  zh: zhTranslations,
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>("en");

  useEffect(() => {
    const savedLocale = localStorage.getItem("preferred-locale") as Locale;
    if (savedLocale && translations[savedLocale]) {
      setLocale(savedLocale);
    } else {
      const browserLang = navigator.language.split("-")[0] as Locale;
      if (translations[browserLang]) {
        setLocale(browserLang);
      }
    }
  }, []);

  const handleSetLocale = (newLocale: Locale) => {
    setLocale(newLocale);
    localStorage.setItem("preferred-locale", newLocale);
  };

  const t = (key: string): string => {
    const getNestedValue = (obj: any, path: string): string => {
      return path.split(".").reduce((current, key) => {
        if (current && typeof current === "object" && key in current) {
          return current[key];
        }
        return undefined;
      }, obj);
    };

    const value =
      getNestedValue(translations[locale], key) ||
      getNestedValue(translations.en, key) ||
      key;

    return typeof value === "string" ? value : key;
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale: handleSetLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
