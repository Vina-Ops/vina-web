import { NextRequest, NextResponse } from "next/server";

// Google Translate API (Free tier: 500,000 characters/month)
async function translateWithGoogle(
  text: string,
  targetLang: string,
  sourceLang?: string
) {
  try {
    const response = await fetch(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${
        sourceLang || "auto"
      }&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`
    );

    if (!response.ok) {
      throw new Error(`Google Translate API error: ${response.status}`);
    }

    const data = await response.json();

    if (data && data[0] && data[0][0] && data[0][0][0]) {
      return {
        translatedText: data[0][0][0],
        detectedLanguage: data[2] || sourceLang || "auto",
        confidence: 0.95, // Google Translate is generally very reliable
      };
    }

    throw new Error("Invalid response from Google Translate API");
  } catch (error) {
    console.error("Google Translate error:", error);
    throw error;
  }
}

// LibreTranslate API (Free and open-source)
async function translateWithLibreTranslate(
  text: string,
  targetLang: string,
  sourceLang?: string
) {
  try {
    // Using a public LibreTranslate instance
    const response = await fetch("https://libretranslate.de/translate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        q: text,
        source: sourceLang || "auto",
        target: targetLang,
        format: "text",
      }),
    });

    if (!response.ok) {
      throw new Error(`LibreTranslate API error: ${response.status}`);
    }

    const data = await response.json();

    if (data && data.translatedText) {
      return {
        translatedText: data.translatedText,
        detectedLanguage:
          data.detectedLanguage?.language || sourceLang || "auto",
        confidence: 0.85, // LibreTranslate is good but slightly less reliable than Google
      };
    }

    throw new Error("Invalid response from LibreTranslate API");
  } catch (error) {
    console.error("LibreTranslate error:", error);
    throw error;
  }
}

// MyMemory API (Free with rate limits)
async function translateWithMyMemory(
  text: string,
  targetLang: string,
  sourceLang?: string
) {
  try {
    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
        text
      )}&langpair=${sourceLang || "auto"}|${targetLang}`
    );

    if (!response.ok) {
      throw new Error(`MyMemory API error: ${response.status}`);
    }

    const data = await response.json();

    if (
      data &&
      data.responseStatus === 200 &&
      data.responseData &&
      data.responseData.translatedText
    ) {
      return {
        translatedText: data.responseData.translatedText,
        detectedLanguage:
          data.responseData.detectedSourceLanguage || sourceLang || "auto",
        confidence: 0.8, // MyMemory is decent but less reliable than Google
      };
    }

    throw new Error("Invalid response from MyMemory API");
  } catch (error) {
    console.error("MyMemory error:", error);
    throw error;
  }
}

// Language detection using Google Translate
async function detectLanguageWithGoogle(text: string) {
  try {
    const response = await fetch(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&q=${encodeURIComponent(
        text
      )}`
    );

    if (!response.ok) {
      throw new Error(`Google Language Detection error: ${response.status}`);
    }

    const data = await response.json();

    if (data && data[2]) {
      return {
        language: data[2],
        confidence: 0.95,
      };
    }

    throw new Error("Invalid response from Google Language Detection");
  } catch (error) {
    console.error("Google Language Detection error:", error);
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { text, targetLanguage, sourceLanguage, action } =
      await request.json();

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    // Language mapping for different APIs
    const languageMap: Record<string, string> = {
      en: "en",
      es: "es",
      fr: "fr",
      de: "de",
      it: "it",
      pt: "pt",
      ru: "ru",
      ja: "ja",
      ko: "ko",
      zh: "zh",
      ar: "ar",
      hi: "hi",
      th: "th",
      vi: "vi",
      nl: "nl",
      sv: "sv",
      da: "da",
      no: "no",
      fi: "fi",
      pl: "pl",
      tr: "tr",
      he: "he",
      id: "id",
      ms: "ms",
      tl: "tl",
      uk: "uk",
      cs: "cs",
      hu: "hu",
      ro: "ro",
      bg: "bg",
      hr: "hr",
      sk: "sk",
      sl: "sl",
      et: "et",
      lv: "lv",
      lt: "lt",
      mt: "mt",
      cy: "cy",
      ga: "ga",
      is: "is",
      mk: "mk",
      sq: "sq",
      sr: "sr",
      bs: "bs",
      me: "me",
      eu: "eu",
      ca: "ca",
      gl: "gl",
      af: "af",
      sw: "sw",
      zu: "zu",
      xh: "xh",
      yo: "yo",
      ig: "ig",
      ha: "ha",
      am: "am",
      ti: "ti",
      om: "om",
      so: "so",
      rw: "rw",
      rn: "rn",
      ny: "ny",
      sn: "sn",
      st: "st",
      tn: "tn",
      ts: "ts",
      ve: "ve",
      ss: "ss",
      nr: "nr",
      nso: "nso",
      tsn: "tsn",
      tso: "tso",
      ven: "ven",
      xho: "xho",
      zul: "zul",
      afr: "afr",
      nbl: "nbl",
      sot: "sot",
      ssw: "ssw",
    };

    const mappedTargetLang = languageMap[targetLanguage] || targetLanguage;
    const mappedSourceLang = sourceLanguage
      ? languageMap[sourceLanguage]
      : undefined;

    if (action === "detect") {
      // Try Google Translate for language detection first
      try {
        const result = await detectLanguageWithGoogle(text);
        return NextResponse.json({
          language: result.language,
          confidence: result.confidence,
          provider: "google",
        });
      } catch (error) {
        // Fallback to OpenAI if Google fails
        const { generateText } = await import("ai");
        const { openai } = await import("@ai-sdk/openai");

        const result = await generateText({
          model: openai("gpt-4o-mini"),
          prompt: `Detect the language of this text and return only the ISO 639-1 language code (e.g., 'en', 'es', 'fr'): "${text}"`,
        });

        return NextResponse.json({
          language: result.text.trim().toLowerCase(),
          confidence: 0.8,
          provider: "openai",
        });
      }
    }

    // Translation with fallback chain: Google → LibreTranslate → MyMemory → OpenAI
    let result;
    let provider = "";

    try {
      // Try Google Translate first (most reliable)
      result = await translateWithGoogle(
        text,
        mappedTargetLang,
        mappedSourceLang
      );
      provider = "google";
    } catch (googleError) {
      console.log("Google Translate failed, trying LibreTranslate...");

      try {
        // Try LibreTranslate second
        result = await translateWithLibreTranslate(
          text,
          mappedTargetLang,
          mappedSourceLang
        );
        provider = "libretranslate";
      } catch (libreError) {
        console.log("LibreTranslate failed, trying MyMemory...");

        try {
          // Try MyMemory third
          result = await translateWithMyMemory(
            text,
            mappedTargetLang,
            mappedSourceLang
          );
          provider = "mymemory";
        } catch (memoryError) {
          console.log("MyMemory failed, falling back to OpenAI...");

          // Fallback to OpenAI
          const { generateText } = await import("ai");
          const { openai } = await import("@ai-sdk/openai");

          const openaiResult = await generateText({
            model: openai("gpt-4o-mini"),
            prompt: `Translate this text to ${targetLanguage}. Return only the translated text: "${text}"`,
          });

          result = {
            translatedText: openaiResult.text.trim(),
            detectedLanguage: sourceLanguage || "auto",
            confidence: 0.9,
          };
          provider = "openai";
        }
      }
    }

    return NextResponse.json({
      translatedText: result.translatedText,
      detectedLanguage: result.detectedLanguage,
      confidence: result.confidence,
      provider: provider,
    });
  } catch (error) {
    console.error("Translation error:", error);
    return NextResponse.json({ error: "Translation failed" }, { status: 500 });
  }
}
