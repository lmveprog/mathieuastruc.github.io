import { NextResponse } from "next/server";
import { COOKIE, adminConfigured, checkPassword, makeToken } from "@/lib/adminAuth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!adminConfigured()) return NextResponse.json({ error: "admin pas configuré (ADMIN_PW manquant)" }, { status: 503 });
  const body = await req.json().catch(() => ({}));
  const password = typeof body?.password === "string" ? body.password : "";
  if (!password || !(await checkPassword(password))) {
    await new Promise((r) => setTimeout(r, 700)); // freine la force brute, sans base pour compter
    return NextResponse.json({ error: "mauvais mot de passe" }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set({
    name: COOKIE,
    value: await makeToken(30),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 30 * 86_400,
  });
  return res;
}
