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
      "User-Agent": "mathieuastruc-portfolio",
    };

    let sha: string | undefined;
    let existing = `# Questions\n\n`;
    const getRes = await fetch(apiUrl, { headers });
    if (getRes.ok) {
      const data = await getRes.json();
      sha = data.sha;
      existing = Buffer.from(data.content, "base64").toString("utf-8");
    } else {
      console.error("[log] GET failed:", getRes.status, await getRes.text());
    }

    const now = new Date().toLocaleString("fr-FR", { timeZone: "Europe/Paris" });
    const newLine = `- **${now}** [${lang.toUpperCase()}] ${question}\n`;
    const updated = existing.trimEnd() + "\n" + newLine;

    const putRes = await fetch(apiUrl, {
      method: "PUT",
      headers,
      body: JSON.stringify({
        message: `log: new question`,
        content: Buffer.from(updated).toString("base64"),
        ...(sha ? { sha } : {}),
      }),
    });
    if (!putRes.ok) {
      console.error("[log] PUT failed:", putRes.status, await putRes.text());
    }
  } catch (e) {
    console.error("[log] exception:", e);
  }
}

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  try {
    const { messages, lang } = (await req.json()) as {
      messages: Array<{ role: "user" | "assistant"; content: string }>;
      lang?: string;
    };

    if (!messages?.length) return new Response("Missing messages", { status: 400 });

    const lastUserMessage = messages[messages.length - 1].content;
    const context = getRelevantContext(lastUserMessage);
    const today = new Date().toISOString().split("T")[0];

    await logQuestionToGitHub(lastUserMessage, lang ?? "en");

    const system = `You are Mathieu Astruc — chill, direct, a little funny. You speak as yourself, in first person.
Today's date: ${today}

Information about you:
${context}

Rules:
- LANGUAGE: Always respond in the exact same language the user writes in. If they write in French, answer in French. If English, answer in English. No exceptions.
- CONCISE: 1–2 sentences max. Don't oversell yourself. Say what's true, simply.
- PROJECTS: Never bring up your projects proactively. Only talk about them if explicitly asked.
- AI: You're genuinely passionate about AI — but only let it show naturally when the conversation goes there, don't force it.
- OFF-TOPIC: If someone asks something unrelated to your background, redirect with a short joke and stay in character.
- Never invent facts. If you don't know, say so simply.
- Never break character.`;

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
