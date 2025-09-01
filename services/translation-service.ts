import { Locale } from "@/context/language-context";

// Translation service using Google Translate API or similar
export class TranslationService {
  private static instance: TranslationService;
  private apiKey: string;

  private constructor() {
    this.apiKey = process.env.GOOGLE_TRANSLATE_API_KEY || "";
  }

  public static getInstance(): TranslationService {
    if (!TranslationService.instance) {
      TranslationService.instance = new TranslationService();
    }
    return TranslationService.instance;
  }

  // Translate text to target language
  async translateText(
    text: string,
    targetLang: Locale,
    sourceLang: Locale = "en"
  ): Promise<string> {
    if (targetLang === sourceLang) return text;

    try {
      // For now, using a simple mapping approach
      // In production, you'd use Google Translate API or similar
      return this.simpleTranslate(text, targetLang, sourceLang);
    } catch (error) {
      console.error("Translation error:", error);
      return text; // Fallback to original text
    }
  }

  // Simple translation mapping (for development)
  private simpleTranslate(
    text: string,
    targetLang: Locale,
    sourceLang: Locale
  ): string {
    const translations: Record<string, Record<Locale, string>> = {
      // Common chat phrases
      Hello: {
        en: "Hello",
        fr: "Bonjour",
        de: "Hallo",
        es: "Hola",
        ko: "안녕하세요",
        zh: "你好",
      },
      "How are you feeling today?": {
        en: "How are you feeling today?",
        fr: "Comment vous sentez-vous aujourd'hui ?",
        de: "Wie fühlen Sie sich heute?",
        es: "¿Cómo te sientes hoy?",
        ko: "오늘 기분이 어떠세요?",
        zh: "你今天感觉怎么样？",
      },
      "I'm here to listen": {
        en: "I'm here to listen",
        fr: "Je suis là pour écouter",
        de: "Ich bin hier, um zuzuhören",
        es: "Estoy aquí para escuchar",
        ko: "듣고 있습니다",
        zh: "我在这里倾听",
      },
      "That sounds difficult": {
        en: "That sounds difficult",
        fr: "Cela semble difficile",
        de: "Das klingt schwierig",
        es: "Eso suena difícil",
        ko: "어려워 보이네요",
        zh: "听起来很困难",
      },
      "I understand": {
        en: "I understand",
        fr: "Je comprends",
        de: "Ich verstehe",
        es: "Entiendo",
        ko: "이해합니다",
        zh: "我理解",
      },
      "Would you like to talk more about that?": {
        en: "Would you like to talk more about that?",
        fr: "Voulez-vous en parler davantage ?",
        de: "Möchten Sie mehr darüber sprechen?",
        es: "¿Te gustaría hablar más sobre eso?",
        ko: "그것에 대해 더 이야기하고 싶으세요?",
        zh: "你想多谈谈这个吗？",
      },
      "Take a deep breath": {
        en: "Take a deep breath",
        fr: "Prenez une respiration profonde",
        de: "Atmen Sie tief durch",
        es: "Respira profundamente",
        ko: "깊게 숨을 쉬세요",
        zh: "深呼吸",
      },
      "You're not alone": {
        en: "You're not alone",
        fr: "Vous n'êtes pas seul",
        de: "Sie sind nicht allein",
        es: "No estás solo",
        ko: "혼자가 아닙니다",
        zh: "你并不孤单",
      },
      "It's okay to feel this way": {
        en: "It's okay to feel this way",
        fr: "C'est normal de ressentir cela",
        de: "Es ist in Ordnung, sich so zu fühlen",
        es: "Está bien sentirse así",
        ko: "이렇게 느끼는 것은 괜찮습니다",
        zh: "有这种感觉是正常的",
      },
      "Let's work through this together": {
        en: "Let's work through this together",
        fr: "Travaillons ensemble sur cela",
        de: "Lassen Sie uns das gemeinsam durcharbeiten",
        es: "Trabajemos juntos en esto",
        ko: "함께 해결해봅시다",
        zh: "让我们一起解决这个问题",
      },
    };

    // Check if we have a translation for this text
    const textLower = text.trim();
    const translation = translations[textLower]?.[targetLang];

    if (translation) {
      return translation;
    }

    // For production, you'd use Google Translate API here
    // const response = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${this.apiKey}`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     q: text,
    //     source: sourceLang,
    //     target: targetLang
    //   })
    // });
    // const data = await response.json();
    // return data.data.translations[0].translatedText;

    // For now, return original text if no translation found
    return text;
  }

  // Detect language of text
  async detectLanguage(text: string): Promise<Locale> {
    // Simple language detection based on common words
    const languagePatterns: Record<Locale, RegExp[]> = {
      en: [/\b(the|and|or|but|in|on|at|to|for|of|with|by)\b/i],
      fr: [/\b(le|la|les|et|ou|mais|dans|sur|à|pour|de|avec|par)\b/i],
      de: [/\b(der|die|das|und|oder|aber|in|auf|an|zu|für|von|mit)\b/i],
      es: [/\b(el|la|los|las|y|o|pero|en|sobre|a|para|de|con)\b/i],
      ko: [/[가-힣]/],
      zh: [/[\u4e00-\u9fff]/],
    };

    for (const [lang, patterns] of Object.entries(languagePatterns)) {
      if (patterns.some((pattern) => pattern.test(text))) {
        return lang as Locale;
      }
    }

    return "en"; // Default to English
  }
}

// Export singleton instance
export const translationService = TranslationService.getInstance();
