import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";
import type { NextRequest } from "next/server";

const openai = createOpenAI({
  apiKey: process.env.CONTEXT7_API_KEY,
  baseURL: process.env.CONTEXT7_API_BASE_URL ?? "https://api.context7.com/v1",
});

export const runtime = "edge";

export async function POST(request: NextRequest) {
  if (!process.env.CONTEXT7_API_KEY) {
    return new Response("Missing CONTEXT7_API_KEY", { status: 500 });
  }

  const { messages, ...options } = await request.json();

  const result = await streamText({
    model: openai.chat(process.env.CONTEXT7_MODEL ?? "gpt-4.1-mini"),
    messages,
    temperature: 0.2,
    ...options,
  });

  return result.toAIStreamResponse();
}
