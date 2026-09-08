import { NextResponse } from "next/server";
import { isDocKey, putDoc } from "@/lib/adminStore";

export const dynamic = "force-dynamic";

// PUT /api/admin/store/todos → remplace le doc entier (ils sont petits)
export async function PUT(req: Request, { params }: { params: { key: string } }) {
  if (!isDocKey(params.key)) return NextResponse.json({ error: "clé inconnue" }, { status: 404 });
  const data = await req.json().catch(() => null);
  if (!data || typeof data !== "object" || Array.isArray(data)) return NextResponse.json({ error: "objet attendu" }, { status: 400 });
  try {
    await putDoc(params.key, data);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String((e as Error).message) }, { status: 502 });
  }
}
