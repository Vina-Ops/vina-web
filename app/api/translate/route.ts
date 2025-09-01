import { NextRequest, NextResponse } from "next/server";
import { translationService } from "@/services/translation-service";
import { Locale } from "@/context/language-context";

export async function POST(request: NextRequest) {
  try {
    const { text, targetLang, sourceLang = 'en' } = await request.json();

    if (!text || !targetLang) {
      return NextResponse.json(
        { error: "Missing required fields: text and targetLang" },
        { status: 400 }
      );
    }

    // Validate language codes
    const validLocales: Locale[] = ['en', 'fr', 'de', 'es', 'ko', 'zh'];
    if (!validLocales.includes(targetLang as Locale) || !validLocales.includes(sourceLang as Locale)) {
      return NextResponse.json(
        { error: "Invalid language code" },
        { status: 400 }
      );
    }

    // Translate the text
    const translatedText = await translationService.translateText(
      text,
      targetLang as Locale,
      sourceLang as Locale
    );

    return NextResponse.json({
      originalText: text,
      translatedText,
      sourceLang,
      targetLang
    });

  } catch (error) {
    console.error('Translation API error:', error);
    return NextResponse.json(
      { error: "Translation failed" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const text = searchParams.get('text');
    const targetLang = searchParams.get('targetLang') as Locale;
    const sourceLang = (searchParams.get('sourceLang') as Locale) || 'en';

    if (!text || !targetLang) {
      return NextResponse.json(
        { error: "Missing required parameters: text and targetLang" },
        { status: 400 }
      );
    }

    // Validate language codes
    const validLocales: Locale[] = ['en', 'fr', 'de', 'es', 'ko', 'zh'];
    if (!validLocales.includes(targetLang) || !validLocales.includes(sourceLang)) {
      return NextResponse.json(
        { error: "Invalid language code" },
        { status: 400 }
      );
    }

    // Translate the text
    const translatedText = await translationService.translateText(
      text,
      targetLang,
      sourceLang
    );

    return NextResponse.json({
      originalText: text,
      translatedText,
      sourceLang,
      targetLang
    });

  } catch (error) {
    console.error('Translation API error:', error);
    return NextResponse.json(
      { error: "Translation failed" },
      { status: 500 }
    );
  }
}

