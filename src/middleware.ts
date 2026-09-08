import { NextRequest, NextResponse } from "next/server";
import { COOKIE, verifyToken } from "./lib/adminAuth";

// deux coins prives sur le domaine :
// - /matheus : le tableau de bord statique matheusgen, auth basic (MATHEUS_PW)
// - /admin : mon dashboard perso, login par mot de passe (ADMIN_PW) et cookie signe
export const config = { matcher: ["/matheus/:path*", "/admin/:path*", "/api/admin/:path*"] };

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname.startsWith("/matheus")) return matheus(req);

  const ok = await verifyToken(req.cookies.get(COOKIE)?.value);
  if (pathname === "/admin/login" || pathname === "/api/admin/login") {
    if (ok && pathname === "/admin/login") return NextResponse.redirect(new URL("/admin", req.url));
    return NextResponse.next();
  }
  if (ok) return NextResponse.next();
  if (pathname.startsWith("/api/")) return NextResponse.json({ error: "non connecté" }, { status: 401 });
  return NextResponse.redirect(new URL("/admin/login", req.url));
}

function matheus(req: NextRequest) {
  const expected = process.env.MATHEUS_PW || "gen2026";
  const auth = req.headers.get("authorization");

  if (auth) {
    const [, b64] = auth.split(" ");
    const [, pw] = atob(b64).split(":");
    if (pw === expected) return NextResponse.next();
  }

  return new NextResponse("Auth requise", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="matheus"' },
  });
}
