import { NextResponse } from "next/server";
import { gasConfigured, gasCreate, gasDelete } from "@/lib/gcal";
import { loadAgenda } from "@/lib/agenda";

export const dynamic = "force-dynamic";

const headers = { "Cache-Control": "no-store" };

// GET : l'agenda seul, pour rafraichir la carte apres un ajout
export async function GET() {
  return NextResponse.json(await loadAgenda(), { headers });
}

// POST : creer un evenement dans l'agenda principal
export async function POST(req: Request) {
  if (!gasConfigured()) return NextResponse.json({ error: "écriture pas branchée (apps script)" }, { status: 503, headers });
  const b = await req.json().catch(() => ({}));
  const title = typeof b.title === "string" ? b.title.trim() : "";
  if (!title) return NextResponse.json({ error: "titre manquant" }, { status: 400, headers });
  const location = typeof b.location === "string" ? b.location.trim() : "";
  try {
    if (b.allDay) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(b.date || "")) return NextResponse.json({ error: "date invalide" }, { status: 400, headers });
      await gasCreate({ title, allDay: true, date: b.date, location });
    } else {
      const start = new Date(b.start), end = new Date(b.end);
      if (isNaN(start.getTime()) || isNaN(end.getTime()) || end <= start) return NextResponse.json({ error: "heures invalides" }, { status: 400, headers });
      await gasCreate({ title, allDay: false, start: start.toISOString(), end: end.toISOString(), location });
    }
    return NextResponse.json({ ok: true, agenda: await loadAgenda() }, { headers });
  } catch (e) {
    return NextResponse.json({ error: String((e as Error).message || e) }, { status: 502, headers });
  }
}

// DELETE ?id=… : retirer un evenement de l'agenda principal
export async function DELETE(req: Request) {
  if (!gasConfigured()) return NextResponse.json({ error: "écriture pas branchée (apps script)" }, { status: 503, headers });
  const id = new URL(req.url).searchParams.get("id") || "";
  if (!id) return NextResponse.json({ error: "id manquant" }, { status: 400, headers });
  try {
    await gasDelete(id);
    return NextResponse.json({ ok: true, agenda: await loadAgenda() }, { headers });
  } catch (e) {
    return NextResponse.json({ error: String((e as Error).message || e) }, { status: 502, headers });
  }
}
