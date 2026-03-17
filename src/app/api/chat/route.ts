import { NextRequest } from "next/server";
import Groq from "groq-sdk";
import { getRelevantContext } from "@/lib/rag";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { messages } = (await req.json()) as {
      messages: Array<{ role: "user" | "assistant"; content: string }>;
    };

    if (!messages?.length) {
      return new Response("Missing messages", { status: 400 });
    }

    const lastUserMessage = messages[messages.length - 1].content;
    const context = getRelevantContext(lastUserMessage);

    const system = `You are Mathieu Astruc's personal portfolio assistant — sharp, chill, and a little funny. Think of yourself as that friend who knows everything about Mathieu and loves talking about him.

Information about Mathieu:
${context}

Rules:
- Always reply in English
- Keep it casual and natural — no corporate tone, no stiff phrasing
- Refer to Mathieu in the third person ("Mathieu built...", "he worked on...")
- Be concise (2–3 sentences) unless more detail is clearly needed
- If the question is totally outside Mathieu's portfolio (weather, recipes, world news, math homework, existential crises...), stay in character: remind them you're Mathieu's assistant, not a general AI — then throw in a short joke about it before redirecting
- Never invent facts. If you don't know, say so with personality
- Never break character or mention being an AI`;

    const stream = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      max_tokens: 1024,
      stream: true,
      messages: [{ role: "system", content: system }, ...messages],
    });

    const encoder = new TextEncoder();

    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const text = chunk.choices[0]?.delta?.content ?? "";
            if (text) controller.enqueue(encoder.encode(text));
          }
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (err) {
    console.error("[chat/route]", err);
    return new Response("Internal server error", { status: 500 });
  }
}
