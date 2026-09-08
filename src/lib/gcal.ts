// google agenda en lecture / ecriture, via un petit apps script deploye par
// mathieu (docs/agenda.gs). quand il n'est pas configure, l'agenda retombe
// sur l'adresse ics (lecture seule, en retard de quelques heures).

import { dayKey, localParts, zonedToUtc, type CalEvent } from "./ics";

const URL_ = process.env.ADMIN_GAS_URL || "";
const SECRET = process.env.ADMIN_GAS_SECRET || "";
const DAY = 86_400_000;

export const gasConfigured = () => Boolean(URL_ && SECRET);

type GasEvent = { id: string; title: string; allDay: boolean; start: string; end: string; location?: string; calendar?: string };

async function call<T>(init: RequestInit & { query?: Record<string, string> }): Promise<T> {
  if (!gasConfigured()) throw new Error("ADMIN_GAS_URL / ADMIN_GAS_SECRET manquants");
  const u = new URL(URL_);
  for (const [k, v] of Object.entries(init.query || {})) u.searchParams.set(k, v);
  u.searchParams.set("key", SECRET);
  // apps script repond par une redirection vers le contenu : fetch la suit
  const r = await fetch(u, { ...init, redirect: "follow", cache: "no-store" });
  if (!r.ok) throw new Error(`apps script ${r.status}`);
  const text = await r.text();
  let data: T & { error?: string };
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error("apps script : réponse illisible (déploiement « tout le monde » ?)");
  }
  if (data.error) throw new Error(`apps script : ${data.error}`);
  return data;
}

function toCalEvent(e: GasEvent, defaultCalendar: string): CalEvent[] {
  const deletable = e.calendar === defaultCalendar;
  if (e.allDay) {
    // une entree par jour couvert, comme pour l'ics
    const out: CalEvent[] = [];
    const [y, m, d] = e.start.split("-").map(Number);
    const [y2, m2, d2] = e.end.split("-").map(Number);
    const startMs = Date.UTC(y, m - 1, d);
    const endMs = Date.UTC(y2, m2 - 1, d2);
    for (let t = startMs; t < endMs; t += DAY) {
      out.push({
        id: `${e.id}@${t}`,
        gid: e.id,
        title: e.title,
        day: new Date(t).toISOString().slice(0, 10),
        start: e.start,
        end: e.end,
        allDay: true,
        location: e.location || undefined,
        calendar: e.calendar,
        deletable,
      });
    }
    return out;
  }
  return [
    {
      id: `${e.id}@${e.start}`,
      gid: e.id,
      title: e.title,
      day: dayKey(new Date(e.start).getTime()),
      start: e.start,
      end: e.end,
      allDay: false,
      location: e.location || undefined,
      calendar: e.calendar,
      deletable,
    },
  ];
}

export async function gasAgenda(days = 8) {
  const now = localParts(Date.now());
  const windowStart = zonedToUtc(now.y, now.mo, now.d, 0, 0, 0);
  const windowEnd = windowStart + days * DAY;
  const data = await call<{ events: GasEvent[]; defaultCalendar: string }>({
    method: "GET",
    query: { from: new Date(windowStart).toISOString(), to: new Date(windowEnd).toISOString() },
  });
  const events = data.events.flatMap((e) => toCalEvent(e, data.defaultCalendar)).filter((e) => {
    if (e.allDay) return e.day >= new Date(windowStart).toISOString().slice(0, 10);
    return new Date(e.end).getTime() > windowStart && new Date(e.start).getTime() < windowEnd;
  });
  events.sort((a, b) => (a.day < b.day ? -1 : a.day > b.day ? 1 : a.allDay !== b.allDay ? (a.allDay ? -1 : 1) : a.start < b.start ? -1 : 1));
  return { events, defaultCalendar: data.defaultCalendar };
}

export type NewEvent = { title: string; allDay: boolean; date?: string; start?: string; end?: string; location?: string };

export async function gasCreate(ev: NewEvent) {
  return call<{ ok: boolean; event: GasEvent }>({
    method: "POST",
    headers: { "Content-Type": "text/plain" },
    body: JSON.stringify({ key: SECRET, action: "create", ...ev }),
  });
}

export async function gasDelete(id: string) {
  return call<{ ok: boolean }>({
    method: "POST",
    headers: { "Content-Type": "text/plain" },
    body: JSON.stringify({ key: SECRET, action: "delete", id }),
  });
}
