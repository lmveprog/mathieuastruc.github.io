import { NextRequest } from "next/server";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_LOG_REPO;
  const file = process.env.GITHUB_LOG_FILE ?? "questions.md";

  if (!token) return Response.json({ error: "GITHUB_TOKEN missing" }, { status: 500 });
  if (!repo) return Response.json({ error: "GITHUB_LOG_REPO missing" }, { status: 500 });

  const apiUrl = `https://api.github.com/repos/${repo}/contents/${file}`;
  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "Content-Type": "application/json",
    "User-Agent": "mathieuastruc-portfolio",
  };

  const getRes = await fetch(apiUrl, { headers });
  const getData = await getRes.json();
  if (!getRes.ok) return Response.json({ step: "GET failed", status: getRes.status, body: getData });

  const existing = Buffer.from(getData.content, "base64").toString("utf-8");
  const now = new Date().toLocaleString("fr-FR", { timeZone: "Europe/Paris" });
  const updated = existing.trimEnd() + `\n- **${now}** [ROUTE-TEST] test via /api/test-log\n`;

  const putRes = await fetch(apiUrl, {
    method: "PUT",
    headers,
    body: JSON.stringify({
      message: "log: route test",
      content: Buffer.from(updated).toString("base64"),
      sha: getData.sha,
    }),
  });
  const putData = await putRes.json();
  if (!putRes.ok) return Response.json({ step: "PUT failed", status: putRes.status, body: putData });

  return Response.json({ ok: true, logged: now });
}
