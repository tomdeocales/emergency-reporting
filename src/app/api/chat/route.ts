import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";
import type { NextRequest } from "next/server";

// Provider selection: prefer GROQ when a key is present, otherwise fall back to
// the existing Context7-compatible endpoint.
const provider = (() => {
  if (process.env.GROQ_API_KEY) {
    return createOpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: process.env.GROQ_BASE_URL ?? "https://api.groq.com/openai/v1",
    });
  }
  return createOpenAI({
    apiKey: process.env.CONTEXT7_API_KEY,
    baseURL: process.env.CONTEXT7_API_BASE_URL ?? "https://api.context7.com/v1",
  });
})();

export const runtime = "edge";

export async function POST(request: NextRequest) {
  if (!process.env.GROQ_API_KEY && !process.env.CONTEXT7_API_KEY) {
    return new Response(
      "Missing GROQ_API_KEY or CONTEXT7_API_KEY. Add one to .env.local.",
      { status: 500 },
    );
  }

  const { messages, ...options } = await request.json();

  // Sensible defaults per provider
  const modelName = process.env.GROQ_API_KEY
    ? (process.env.GROQ_MODEL ?? "llama-3.1-8b-instant")
    : (process.env.CONTEXT7_MODEL ?? "gpt-4.1-mini");

  const result = await streamText({
    model: provider.chat(modelName),
    system:
      "You are a helpful assistant for a demo emergency-operations console. Generate concise, clearly mocked answers grounded in typical incident analytics. Never imply data is real; prefer short bullets and realistic but fictitious numbers.",
    messages,
    temperature: 0.3,
    ...options,
  });

  return result.toTextStreamResponse();
}
