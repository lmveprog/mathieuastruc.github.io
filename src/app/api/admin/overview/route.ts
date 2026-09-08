import { NextResponse } from "next/server";
import { getDocs, getGuests, getLab, type Lab } from "@/lib/adminStore";
import { loadAgenda, type AgendaPayload } from "@/lib/agenda";
export type { AgendaPayload } from "@/lib/agenda";

export const dynamic = "force-dynamic";

// tout ce que le dashboard lit sans pouvoir l'ecrire : meteo, visiteurs,
// abonnes du lab, agenda. chaque bloc peut manquer sans casser les autres.

export type Platform = {
  key: string;
  name: string;
  followers: number;
  ts: number;
  delta1: number | null;
  delta7: number | null;
  spark: number[];
};
export type Overview = {
  now: string;
  weather?: { city: string; temp: number; feels: number; code: number; label: string; tmax: number; tmin: number; rain: number };
  guests?: { visitors: number; today: number };
  audience?: { generated: number; total: number; platforms: Platform[] };
  contents?: { platform: string; title: string; url: string; views: number; moving: boolean }[];
  veille?: { hours: number; items: { platform: string; handle: string; title: string; url: string; views: number }[] };
  agenda: AgendaPayload;
  errors: string[];
};
const NAMES: Record<string, string> = { tiktok: "tiktok", instagram: "instagram", youtube: "youtube", facebook: "facebook", x: "x" };
const ORDER = ["tiktok", "instagram", "youtube", "facebook", "x"];

const WEATHER: [number, string][] = [
  [0, "ciel dégagé"], [1, "plutôt dégagé"], [2, "quelques nuages"], [3, "couvert"],
  [48, "brouillard"], [57, "bruine"], [67, "pluie"], [77, "neige"], [82, "averses"], [86, "averses de neige"], [99, "orage"],
];
const weatherLabel = (code: number) => (WEATHER.find(([max]) => code <= max) || [0, "?"])[1];

async function weather(loc: { city: string; lat: number; lon: number }) {
  const u = new URL("https://api.open-meteo.com/v1/forecast");
  u.search = new URLSearchParams({
    latitude: String(loc.lat),
    longitude: String(loc.lon),
    current: "temperature_2m,apparent_temperature,weather_code",
    daily: "temperature_2m_max,temperature_2m_min,precipitation_probability_max",
    timezone: "Europe/Paris",
    forecast_days: "1",
  }).toString();
  const r = await fetch(u, { next: { revalidate: 900 } });
  if (!r.ok) throw new Error(`meteo ${r.status}`);
  const d = await r.json();
  return {
    city: loc.city,
    temp: Math.round(d.current.temperature_2m),
    feels: Math.round(d.current.apparent_temperature),
    code: d.current.weather_code,
    label: weatherLabel(d.current.weather_code),
    tmax: Math.round(d.daily.temperature_2m_max[0]),
    tmin: Math.round(d.daily.temperature_2m_min[0]),
    rain: d.daily.precipitation_probability_max[0] ?? 0,
  };
}

function audience(lab: Lab) {
  const platforms: Platform[] = [];
  for (const key of Object.keys(lab.abonnes)) {
    const pts = (lab.abonnes[key] || []).filter((p) => typeof p.abonnes === "number").sort((a, b) => a.ts - b.ts) as { ts: number; abonnes: number }[];
    if (!pts.length) continue;
    const last = pts[pts.length - 1];
    // le releve le plus proche avant t (ou le premier, si on n'a pas assez d'historique)
    const at = (t: number) => {
      let best = pts[0];
      for (const p of pts) if (p.ts <= t) best = p;
      return best;
    };
    const d1 = at(last.ts - 86_400);
    const d7 = at(last.ts - 7 * 86_400);
    const spark: number[] = [];
    for (let i = 13; i >= 0; i--) spark.push(at(last.ts - i * 86_400).abonnes);
    platforms.push({
      key,
      name: NAMES[key] || key,
      followers: last.abonnes,
      ts: last.ts,
      delta1: d1 === last ? null : last.abonnes - d1.abonnes,
      delta7: d7 === last ? null : last.abonnes - d7.abonnes,
      spark,
    });
  }
  platforms.sort((a, b) => (ORDER.indexOf(a.key) + 99) % 99 - ((ORDER.indexOf(b.key) + 99) % 99));
  return { generated: lab.genere_le, total: platforms.reduce((s, p) => s + p.followers, 0), platforms };
}

function contents(lab: Lab) {
  const moving = lab.mes_contenus.some((c) => (c.vitesse || 0) > 0);
  return [...lab.mes_contenus]
    .filter((c) => typeof c.vues === "number")
    .sort((a, b) => (b.vitesse || 0) - (a.vitesse || 0) || (b.vues || 0) - (a.vues || 0))
    .slice(0, 6)
    .map((c) => ({ platform: c.plateforme, title: c.titre || "(sans titre)", url: c.url, views: c.vues || 0, moving: moving && (c.vitesse || 0) > 0 }));
}

function veille(lab: Lab) {
  const items = [...(lab.veille || [])]
    .sort((a, b) => (b.vues || 0) - (a.vues || 0))
    .slice(0, 6)
    .map((c) => ({ platform: c.plateforme, handle: c.handle, title: c.titre || c.texte || "(sans titre)", url: c.url, views: c.vues || 0 }));
  return { hours: lab.fenetre_veille_h || 24, items };
}

export async function GET() {
  const errors: string[] = [];
  let loc = { city: "Paris", lat: 48.8566, lon: 2.3522 };
  try {
    const cfg = (await getDocs(["config"])).config as { weather?: typeof loc } | null;
    if (cfg?.weather?.lat) loc = cfg.weather;
  } catch (e) {
    errors.push(`store : ${(e as Error).message}`);
  }

  const [w, g, l, a] = await Promise.allSettled([weather(loc), getGuests(), getLab(), loadAgenda()]);

  const out: Overview = {
    now: new Date().toISOString(),
    agenda: { configured: false, source: "none", writable: false, events: [], errors: [] },
    errors,
  };
  if (w.status === "fulfilled") out.weather = w.value; else errors.push(`météo : ${w.reason?.message || w.reason}`);
  if (g.status === "fulfilled") out.guests = g.value; else errors.push(`visiteurs : ${g.reason?.message || g.reason}`);
  if (l.status === "fulfilled") { out.audience = audience(l.value); out.contents = contents(l.value); out.veille = veille(l.value); } else errors.push(`lab : ${l.reason?.message || l.reason}`);
  if (a.status === "fulfilled") out.agenda = a.value;
  else out.agenda.errors.push(String(a.reason?.message || a.reason));

  return NextResponse.json(out, { headers: { "Cache-Control": "no-store" } });
}
