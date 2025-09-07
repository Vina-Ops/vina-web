import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import { NextRequest, NextResponse } from "next/server";

// Translation API using AI SDK
export async function POST(request: NextRequest) {
  try {
    const { text, targetLanguage, sourceLanguage } = await request.json();

    if (!text || !targetLanguage) {
      return NextResponse.json(
        { error: "Text and target language are required" },
        { status: 400 }
      );
    }

    // Create translation prompt
    const prompt = sourceLanguage
      ? `Translate the following ${sourceLanguage} text to ${targetLanguage}. Only return the translation, no explanations or additional text:\n\n${text}`
      : `Translate the following text to ${targetLanguage}. Only return the translation, no explanations or additional text:\n\n${text}`;

    // Use AI SDK to generate translation
    const { text: translation } = await generateText({
      model: openai("gpt-4o-mini"), // Using GPT-4o-mini for cost efficiency
      prompt,
      temperature: 0.1, // Low temperature for consistent translations
    });

    return NextResponse.json({
      success: true,
      originalText: text,
      translatedText: translation.trim(),
      sourceLanguage: sourceLanguage || "auto-detected",
      targetLanguage,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Translation error:", error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Translation failed",
      },
      { status: 500 }
    );
  }
}

// Batch translation endpoint
export async function PUT(request: NextRequest) {
  try {
    const { messages, targetLanguage, sourceLanguage } = await request.json();

    if (!messages || !Array.isArray(messages) || !targetLanguage) {
      return NextResponse.json(
        { error: "Messages array and target language are required" },
        { status: 400 }
      );
    }

    // Translate all messages
    const translatedMessages = await Promise.all(
      messages.map(async (message: any) => {
        if (!message.content || typeof message.content !== "string") {
          return message; // Return original if not translatable
        }

        try {
          const prompt = sourceLanguage
            ? `Translate the following ${sourceLanguage} text to ${targetLanguage}. Only return the translation, no explanations or additional text:\n\n${message.content}`
            : `Translate the following text to ${targetLanguage}. Only return the translation, no explanations or additional text:\n\n${message.content}`;

          const { text: translation } = await generateText({
            model: openai("gpt-4o-mini"),
            prompt,
            temperature: 0.1,
          });

          return {
            ...message,
            content: translation.trim(),
            originalContent: message.content,
            isTranslated: true,
          };
        } catch (error) {
          console.error(`Failed to translate message ${message.id}:`, error);
          return message; // Return original on error
        }
      })
    );

    return NextResponse.json({
      success: true,
      messages: translatedMessages,
      targetLanguage,
      sourceLanguage: sourceLanguage || "auto-detected",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Batch translation error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Batch translation failed",
      },
      { status: 500 }
    );
  }
}

// Language detection endpoint
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const text = searchParams.get("text");

    if (!text) {
      return NextResponse.json(
        { error: "Text parameter is required" },
        { status: 400 }
      );
    }

    const { text: detectedLanguage } = await generateText({
      model: openai("gpt-4o-mini"),
      prompt: `Detect the language of the following text and respond with only the language name in English (e.g., "English", "Spanish", "French", etc.):\n\n${text}`,
      temperature: 0.1,
    });

    return NextResponse.json({
      success: true,
      text,
      detectedLanguage: detectedLanguage.trim(),
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Language detection error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Language detection failed",
      },
      { status: 500 }
    );
  }
}
