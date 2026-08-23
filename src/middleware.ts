import { NextRequest, NextResponse } from "next/server";

// le tableau de bord matheusgen vit sous /matheus : stats perso + veille
// concurrentielle. il n'a rien a faire en acces libre sur le domaine public,
// donc auth basic. le mot de passe vient d'une variable d'env vercel
// (MATHEUS_PW) ; a defaut, une valeur de repli pour le dev local.
export const config = { matcher: "/matheus/:path*" };

export function middleware(req: NextRequest) {
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
