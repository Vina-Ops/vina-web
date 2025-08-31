# 🌍 Vina Localization Guide

## Overview

Vina implements a robust, client-side localization system that supports multiple languages and provides real-time translation capabilities for chat messages. The system is designed to be scalable, maintainable, and user-friendly.

## Supported Languages

- 🇺🇸 **English (en)** - Default language
- 🇫🇷 **French (fr)** - Français
- 🇩🇪 **German (de)** - Deutsch
- 🇪🇸 **Spanish (es)** - Español
- 🇰🇷 **Korean (ko)** - 한국어
- 🇨🇳 **Chinese (zh)** - 中文

## Architecture

### 1. Language Context (`context/language-context.tsx`)

The core of the localization system that provides:

- Language state management
- Translation function (`t`)
- Language switching functionality
- Browser language detection
- Local storage persistence

```typescript
const { locale, setLocale, t } = useLanguage();
```

### 2. Translation Service (`services/translation-service.ts`)

Backend translation service that supports:

- Simple translation mapping (for development)
- Google Translate API integration (for production)
- Language detection
- Singleton pattern for efficiency

### 3. Translation API (`app/api/translate/route.ts`)

RESTful API endpoints for translation:

- `POST /api/translate` - Translate text
- `GET /api/translate` - Translate text via query parameters

### 4. Translation Hook (`hooks/use-translation.ts`)

React hook for translation functionality:

- `translateText()` - Full translation with metadata
- `translateMessage()` - Simple message translation
- Loading states and error handling

### 5. Message Translator Component (`components/translation/MessageTranslator.tsx`)

UI component for translating chat messages:

- Auto-translation based on user's language preference
- Manual translation controls
- Show/hide original text
- Reset functionality

## Usage Examples

### Basic Translation

```typescript
import { useLanguage } from "@/context/language-context";

function MyComponent() {
  const { t } = useLanguage();

  return (
    <div>
      <h1>{t("hero.title")}</h1>
      <p>{t("hero.description")}</p>
    </div>
  );
}
```

### Language Switching

```typescript
import { useLanguage } from "@/context/language-context";

function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage();

  return (
    <select value={locale} onChange={(e) => setLocale(e.target.value)}>
      <option value="en">English</option>
      <option value="fr">Français</option>
      <option value="de">Deutsch</option>
      <option value="es">Español</option>
      <option value="ko">한국어</option>
      <option value="zh">中文</option>
    </select>
  );
}
```

### Chat Message Translation

```typescript
import { MessageTranslator } from "@/components/translation/MessageTranslator";

function ChatMessage({ message, originalLanguage = "en" }) {
  return (
    <MessageTranslator
      message={message}
      originalLanguage={originalLanguage}
      onTranslationChange={(translatedText) => {
        console.log("Translated:", translatedText);
      }}
    />
  );
}
```

### Programmatic Translation

```typescript
import { useTranslation } from "@/hooks/use-translation";

function TranslationExample() {
  const { translateMessage, isTranslating } = useTranslation();

  const handleTranslate = async () => {
    const translated = await translateMessage("Hello world", "fr", "en");
    console.log(translated); // "Bonjour le monde"
  };

  return (
    <button onClick={handleTranslate} disabled={isTranslating}>
      {isTranslating ? "Translating..." : "Translate"}
    </button>
  );
}
```

## Translation Keys Structure

The translation system uses a hierarchical key structure:

```
{
  "nav.login": "Sign In",
  "hero.title": "Your Mental Wellness",
  "hero.subtitle": "Companion",
  "features.alwaysAvailable.title": "Always Available",
  "features.alwaysAvailable.description": "Get support whenever you need it...",
  "testimonials.sarah.name": "Sarah M.",
  "testimonials.sarah.role": "Student",
  "testimonials.sarah.text": "Vina has been my constant companion..."
}
```

## Adding New Languages

1. **Add language to the Locale type**:

```typescript
export type Locale = "en" | "fr" | "de" | "es" | "ko" | "zh" | "ja"; // Add new language
```

2. **Add translations to the translations object**:

```typescript
const translations: Record<Locale, Record<string, string>> = {
  // ... existing languages
  ja: {
    "nav.login": "ログイン",
    "hero.title": "あなたのメンタルウェルネス",
    // ... add all translation keys
  },
};
```

3. **Update language patterns in translation service**:

```typescript
const languagePatterns: Record<Locale, RegExp[]> = {
  // ... existing patterns
  ja: [/[\u3040-\u309F\u30A0-\u30FF]/], // Hiragana and Katakana
};
```

4. **Add to LanguageSwitcher component**:

```typescript
const languages = [
  // ... existing languages
  { code: "ja", name: "日本語", flag: "🇯🇵" },
];
```

## Adding New Translation Keys

1. **Add to all language objects**:

```typescript
const translations: Record<Locale, Record<string, string>> = {
  en: {
    // ... existing keys
    "new.section.title": "New Section Title",
  },
  fr: {
    // ... existing keys
    "new.section.title": "Nouveau Titre de Section",
  },
  // ... add to all other languages
};
```

2. **Use in components**:

```typescript
const { t } = useLanguage();
return <h2>{t("new.section.title")}</h2>;
```

## Best Practices

### 1. Key Naming Convention

- Use lowercase with dots for hierarchy: `section.subsection.element`
- Be descriptive but concise: `hero.cta` not `hero.callToActionButton`
- Use consistent naming across similar elements

### 2. Translation Quality

- Keep translations natural and culturally appropriate
- Consider context and tone
- Test with native speakers when possible
- Use professional translation services for production

### 3. Performance

- The system uses client-side caching via localStorage
- Translation service is a singleton for efficiency
- Lazy load translations for large applications

### 4. Accessibility

- Always provide fallback text for missing translations
- Use semantic HTML for translated content
- Consider right-to-left (RTL) languages if needed

## Production Setup

### Google Translate API Integration

1. **Get API Key**:

   - Visit [Google Cloud Console](https://console.cloud.google.com/)
   - Enable Cloud Translation API
   - Create API credentials

2. **Set Environment Variable**:

```env
GOOGLE_TRANSLATE_API_KEY=your_api_key_here
```

3. **Update Translation Service**:

```typescript
// Uncomment the Google Translate API code in translation-service.ts
const response = await fetch(
  `https://translation.googleapis.com/language/translate/v2?key=${this.apiKey}`,
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      q: text,
      source: sourceLang,
      target: targetLang,
    }),
  }
);
```

### Error Handling

The system includes comprehensive error handling:

- Network errors during translation
- Invalid language codes
- Missing translation keys
- API rate limiting

### Monitoring

Consider implementing:

- Translation usage analytics
- Error tracking for failed translations
- Performance monitoring for translation API calls
- User language preference analytics

## Testing

### Unit Tests

```typescript
import { renderHook } from "@testing-library/react";
import { useLanguage } from "@/context/language-context";

test("translates correctly", () => {
  const { result } = renderHook(() => useLanguage());
  expect(result.current.t("nav.login")).toBe("Sign In");
});
```

### Integration Tests

```typescript
test("translates API endpoint", async () => {
  const response = await fetch("/api/translate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      text: "Hello",
      targetLang: "fr",
      sourceLang: "en",
    }),
  });

  const data = await response.json();
  expect(data.translatedText).toBe("Bonjour");
});
```

## Troubleshooting

### Common Issues

1. **Translation keys not showing**:

   - Check if the key exists in all language objects
   - Verify the key is being used correctly in components
   - Check for typos in key names

2. **Language not switching**:

   - Verify localStorage is working
   - Check browser language detection
   - Ensure the language is in the supported locales list

3. **Translation API errors**:

   - Check API key configuration
   - Verify network connectivity
   - Check API rate limits

4. **Performance issues**:
   - Monitor translation API calls
   - Consider implementing caching
   - Optimize translation key structure

## Future Enhancements

- **Machine Learning Translation**: Implement custom ML models for better accuracy
- **Context-Aware Translation**: Consider conversation context for better translations
- **Voice Translation**: Add speech-to-speech translation capabilities
- **Offline Translation**: Cache translations for offline use
- **Translation Memory**: Remember and reuse previous translations
- **Cultural Adaptation**: Adapt content based on cultural context

## Support

For questions or issues with the localization system:

1. Check this documentation
2. Review the code examples
3. Test with different languages
4. Monitor error logs
5. Contact the development team

