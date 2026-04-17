import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || "");

const SYSTEM_PROMPT = `You are a code reviewer. Review the provided code. Be concise (max 5 bullet points). Focus on: bugs, performance, best practices, readability. If the code is good, say so briefly. Respond in the same language the user writes their comments in — if comments are in Spanish, respond in Spanish; if in English, respond in English.`;

export async function POST(request: NextRequest) {
  try {
    const { code, language } = await request.json();

    if (!code || typeof code !== "string" || code.length > 10000) {
      return NextResponse.json({ error: "Invalid code" }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent([
      { text: SYSTEM_PROMPT },
      { text: `Language: ${language || "typescript"}\n\nCode:\n\`\`\`\n${code}\n\`\`\`` },
    ]);

    const text = result.response.text();
    return NextResponse.json({ review: text });
  } catch (error) {
    console.error("Code review error:", error);
    return NextResponse.json({ error: "AI review failed" }, { status: 500 });
  }
}
