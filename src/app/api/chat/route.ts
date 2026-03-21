import { NextRequest } from "next/server";
import Groq from "groq-sdk";
import { getRelevantContext } from "@/lib/rag";

async function logQuestionToGitHub(question: string, lang: string) {
  try {
    const token = process.env.GITHUB_TOKEN;
    const repo = process.env.GITHUB_LOG_REPO;
    const file = process.env.GITHUB_LOG_FILE ?? "questions.md";
    if (!token || !repo) return;

    const apiUrl = `https://api.github.com/repos/${repo}/contents/${file}`;
    const headers = {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
    };

    // Get current file (for SHA + existing content)
    let sha: string | undefined;
    let existing = `# Questions\n\n`;
    const getRes = await fetch(apiUrl, { headers });
    if (getRes.ok) {
      const data = await getRes.json();
      sha = data.sha;
      existing = Buffer.from(data.content, "base64").toString("utf-8");
    }

    const now = new Date().toLocaleString("fr-FR", { timeZone: "Europe/Paris" });
    const newLine = `- **${now}** [${lang.toUpperCase()}] ${question}\n`;
    const updated = existing.trimEnd() + "\n" + newLine;

    await fetch(apiUrl, {
      method: "PUT",
      headers,
      body: JSON.stringify({
        message: `log: new question`,
        content: Buffer.from(updated).toString("base64"),
        ...(sha ? { sha } : {}),
      }),
    });
  } catch {
    // Silent fail — never break the chat
  }
}

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { messages, lang } = (await req.json()) as {
      messages: Array<{ role: "user" | "assistant"; content: string }>;
      lang?: string;
    };

    if (!messages?.length) return new Response("Missing messages", { status: 400 });

    const isFr = lang === "fr";
    const lastUserMessage = messages[messages.length - 1].content;
    const context = getRelevantContext(lastUserMessage);
    const today = new Date().toISOString().split("T")[0];

    // Log question async — don't await so it never blocks the response
    logQuestionToGitHub(lastUserMessage, lang ?? "en");

    const system = isFr
      ? `Tu es Mathieu Astruc — décontracté, direct, un peu drôle. Tu réponds en ton propre nom.
Date du jour : ${today}

Informations te concernant :
${context}

Règles :
- Réponds toujours en français
- Parle à la première personne ("j'ai travaillé sur...", "je suis...")
- Reste naturel et cool — pas de ton corporatif
- Sois concis (2–3 phrases) sauf si plus de détail est clairement nécessaire
- Si la question est hors sujet (météo, recettes, actu...), rappelle gentiment que tu es là pour parler de ton parcours — fais une petite vanne avant de rediriger
- N'invente jamais de faits. Si tu ne sais pas, dis-le avec style
- Ne brise jamais le personnage`
      : `You are Mathieu Astruc — sharp, chill, and a little funny. You speak as yourself.
Today's date: ${today}

Information about you:
${context}

Rules:
- Always reply in English
- Speak in first person ("I built...", "I worked on...", "my experience...")
- Keep it casual and natural — no corporate tone
- Be concise (2–3 sentences) unless more detail is clearly needed
- If the question is totally off-topic, stay in character: mention you're here to talk about your own background — throw in a short joke before redirecting
- Never invent facts. If you don't know, say so with personality
- Never break character`;

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
      headers: { "Content-Type": "text/plain; charset=utf-8", "X-Content-Type-Options": "nosniff" },
    });
  } catch (err) {
    console.error("[chat/route]", err);
    return new Response("Internal server error", { status: 500 });
  }
}
