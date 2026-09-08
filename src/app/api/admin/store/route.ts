import { NextResponse } from "next/server";
import { DOC_KEYS, getDocs, isDocKey } from "@/lib/adminStore";

export const dynamic = "force-dynamic";

// GET /api/admin/store?keys=todos,habits → les docs demandes d'un coup
export async function GET(req: Request) {
  const wanted = (new URL(req.url).searchParams.get("keys") || DOC_KEYS.join(","))
    .split(",")
    .filter(isDocKey);
  try {
    return NextResponse.json(await getDocs(wanted));
  } catch (e) {
    return NextResponse.json({ error: String((e as Error).message) }, { status: 502 });
  }
}
