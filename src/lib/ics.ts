// lecteur ics minimaliste pour l'agenda du /admin : evenements simples,
// journees entieres, et les recurrences courantes (daily / weekly /
// monthly / yearly). pas de lib externe, on ne couvre que ce que google
// calendar exporte vraiment.

export type CalEvent = {
  id: string;
  gid?: string; // identifiant google, quand l'evenement vient de l'apps script
  title: string;
  day: string; // yyyy-mm-dd, heure de paris
  start: string; // iso, ou yyyy-mm-dd si journee entiere
  end: string;
  allDay: boolean;
  location?: string;
  calendar?: string;
  deletable?: boolean;
};

export const TZ = "Europe/Paris";
const DAY = 86_400_000;
const WD = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];

type Prop = { name: string; params: Record<string, string>; value: string };
type When = { ms: number; allDay: boolean };
type Rule = { freq: string; interval: number; count?: number; until?: number; byday?: string[]; bymonthday?: number[] };
type Raw = {
  uid: string;
  title: string;
  location?: string;
  start: When;
  durationMs: number;
  rule: Rule | null;
  exdates: Set<number>;
  recurrenceId?: number;
  tz: string;
};

// ── dates et fuseaux ──

const fmtCache = new Map<string, Intl.DateTimeFormat>();
function fmt(tz: string) {
  let f = fmtCache.get(tz);
  if (!f) {
    f = new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      hourCycle: "h23",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    fmtCache.set(tz, f);
  }
  return f;
}

export function localParts(ms: number, tz = TZ) {
  const p: Record<string, number> = {};
  for (const part of fmt(tz).formatToParts(new Date(ms))) if (part.type !== "literal") p[part.type] = Number(part.value);
  return { y: p.year, mo: p.month, d: p.day, h: p.hour, mi: p.minute, s: p.second };
}

function tzOffset(ms: number, tz: string) {
  const p = localParts(ms, tz);
  return Date.UTC(p.y, p.mo - 1, p.d, p.h, p.mi, p.s) - Math.floor(ms / 1000) * 1000;
}

// heure locale d'un fuseau → instant utc (deux passes pour l'heure d'ete)
export function zonedToUtc(y: number, mo: number, d: number, h: number, mi: number, s: number, tz = TZ) {
  const guess = Date.UTC(y, mo - 1, d, h, mi, s);
  const off1 = tzOffset(guess, tz);
  const off2 = tzOffset(guess - off1, tz);
  return guess - off2;
}

export const dayKey = (ms: number, tz = TZ) => {
  const p = localParts(ms, tz);
  return `${p.y}-${String(p.mo).padStart(2, "0")}-${String(p.d).padStart(2, "0")}`;
};
const utcDayKey = (ms: number) => new Date(ms).toISOString().slice(0, 10);

// ── parsing ──

function unfold(text: string) {
  return text.replace(/\r\n?/g, "\n").replace(/\n[ \t]/g, "");
}

function parseLine(line: string): Prop | null {
  // NOM;P1=V1;P2="a:b":valeur — le premier ':' hors guillemets separe
  let inQ = false;
  let i = 0;
  for (; i < line.length; i++) {
    const c = line[i];
    if (c === '"') inQ = !inQ;
    else if (c === ":" && !inQ) break;
  }
  if (i >= line.length) return null;
  const [name, ...ps] = line.slice(0, i).split(";");
  const params: Record<string, string> = {};
  for (const p of ps) {
    const eq = p.indexOf("=");
    if (eq > 0) params[p.slice(0, eq).toUpperCase()] = p.slice(eq + 1).replace(/^"|"$/g, "");
  }
  return { name: name.toUpperCase(), params, value: line.slice(i + 1) };
}

const unescapeText = (v: string) =>
  v.replace(/\\n/gi, "\n").replace(/\\,/g, ",").replace(/\;/g, ";").replace(/\\\\/g, "\\").trim();

function parseWhen(value: string, params: Record<string, string>, fallbackTz: string): When | null {
  const m = value.trim().match(/^(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2})(\d{2})?(Z)?)?$/);
  if (!m) return null;
  const [, y, mo, d, h, mi, s, z] = m;
  if (params.VALUE === "DATE" || !h) return { ms: Date.UTC(+y, +mo - 1, +d), allDay: true };
  if (z) return { ms: Date.UTC(+y, +mo - 1, +d, +h, +mi, +(s || 0)), allDay: false };
  const tz = params.TZID || fallbackTz;
  try {
    return { ms: zonedToUtc(+y, +mo, +d, +h, +mi, +(s || 0), tz), allDay: false };
  } catch {
    return { ms: zonedToUtc(+y, +mo, +d, +h, +mi, +(s || 0), TZ), allDay: false };
  }
}

function parseDuration(v: string) {
  const m = v.match(/^-?P(?:(\d+)W)?(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?$/);
  if (!m) return 0;
  const [, w, d, h, mi, s] = m.map((x) => Number(x || 0));
  return ((w * 7 + d) * 24 * 3600 + h * 3600 + mi * 60 + s) * 1000;
}

function parseRule(v: string, fallbackTz: string): Rule | null {
  const r: Rule = { freq: "", interval: 1 };
  for (const part of v.split(";")) {
    const [k, val] = part.split("=");
    if (!val) continue;
    switch (k.toUpperCase()) {
      case "FREQ": r.freq = val.toUpperCase(); break;
      case "INTERVAL": r.interval = Math.max(1, Number(val) || 1); break;
      case "COUNT": r.count = Number(val) || undefined; break;
      case "UNTIL": r.until = parseWhen(val, {}, fallbackTz)?.ms; break;
      case "BYDAY": r.byday = val.split(",").map((x) => x.slice(-2).toUpperCase()); break;
      case "BYMONTHDAY": r.bymonthday = val.split(",").map(Number).filter((n) => n > 0); break;
    }
  }
  return r.freq ? r : null;
}

export function parseIcs(text: string): { name?: string; events: Raw[] } {
  const lines = unfold(text).split("\n");
  const events: Raw[] = [];
  let name: string | undefined;
  let cur: Record<string, Prop[]> | null = null;
  let calTz = TZ;

  for (const line of lines) {
    if (line === "BEGIN:VEVENT") { cur = {}; continue; }
    if (line === "END:VEVENT") {
      if (cur) {
        const ev = toRaw(cur, calTz);
        if (ev) events.push(ev);
      }
      cur = null;
      continue;
    }
    const p = parseLine(line);
    if (!p) continue;
    if (cur) (cur[p.name] ||= []).push(p);
    else if (p.name === "X-WR-CALNAME") name = unescapeText(p.value);
    else if (p.name === "X-WR-TIMEZONE") calTz = p.value.trim() || TZ;
  }
  return { name, events };
}

function toRaw(props: Record<string, Prop[]>, calTz: string): Raw | null {
  const one = (k: string) => props[k]?.[0];
  const ds = one("DTSTART");
  if (!ds) return null;
  const start = parseWhen(ds.value, ds.params, calTz);
  if (!start) return null;
  const tz = ds.params.TZID || calTz;
  const de = one("DTEND");
  const end = de ? parseWhen(de.value, de.params, calTz) : null;
  let durationMs = end ? end.ms - start.ms : one("DURATION") ? parseDuration(one("DURATION")!.value) : start.allDay ? DAY : 0;
  if (durationMs < 0) durationMs = 0;
  const exdates = new Set<number>();
  for (const p of props.EXDATE || []) for (const v of p.value.split(",")) {
    const w = parseWhen(v, p.params, tz);
    if (w) exdates.add(w.ms);
  }
  const rid = one("RECURRENCE-ID");
  const rr = one("RRULE");
  return {
    uid: one("UID")?.value || String(start.ms),
    title: unescapeText(one("SUMMARY")?.value || "(sans titre)"),
    location: one("LOCATION") ? unescapeText(one("LOCATION")!.value) || undefined : undefined,
    start,
    durationMs,
    rule: rr ? parseRule(rr.value, tz) : null,
    exdates,
    recurrenceId: rid ? parseWhen(rid.value, rid.params, tz)?.ms : undefined,
    tz,
  };
}

// ── recurrences ──

function* occurrences(ev: Raw, windowEnd: number): Generator<number> {
  const { start, rule, tz } = ev;
  if (!rule) { yield start.ms; return; }
  const base = start.allDay
    ? { ...localParts(start.ms, "UTC") }
    : localParts(start.ms, tz);
  const toMs = (y: number, mo: number, d: number) =>
    start.allDay ? Date.UTC(y, mo - 1, d) : zonedToUtc(y, mo, d, base.h, base.mi, base.s, tz);
  const startDay = Date.UTC(base.y, base.mo - 1, base.d);
  const weekStart = startDay - ((new Date(startDay).getUTCDay() + 6) % 7) * DAY; // lundi
  const byday = rule.byday?.length ? rule.byday : null;
  let n = 0;

  if (rule.freq === "DAILY" || rule.freq === "WEEKLY") {
    for (let i = 0; i < 6000; i++) {
      const dayMs = startDay + i * DAY;
      const dow = WD[new Date(dayMs).getUTCDay()];
      const ok =
        rule.freq === "DAILY"
          ? i % rule.interval === 0 && (!byday || byday.includes(dow))
          : Math.floor((dayMs - weekStart) / (7 * DAY)) % rule.interval === 0 && (byday ? byday.includes(dow) : i % 7 === 0);
      if (!ok) continue;
      const dt = new Date(dayMs);
      const ms = toMs(dt.getUTCFullYear(), dt.getUTCMonth() + 1, dt.getUTCDate());
      if (rule.until !== undefined && ms > rule.until) return;
      n++;
      yield ms;
      if ((rule.count && n >= rule.count) || ms > windowEnd) return;
    }
    return;
  }

  if (rule.freq === "MONTHLY" || rule.freq === "YEARLY") {
    for (let i = 0; i < 600; i++) {
      const step = i * rule.interval;
      const y = rule.freq === "YEARLY" ? base.y + step : base.y + Math.floor((base.mo - 1 + step) / 12);
      const mo = rule.freq === "YEARLY" ? base.mo : ((base.mo - 1 + step) % 12) + 1;
      for (const d of rule.bymonthday?.length ? rule.bymonthday : [base.d]) {
        if (new Date(Date.UTC(y, mo - 1, d)).getUTCMonth() !== mo - 1) continue; // 31 fevrier & co
        const ms = toMs(y, mo, d);
        if (ms < start.ms) continue;
        if (rule.until !== undefined && ms > rule.until) return;
        n++;
        yield ms;
        if ((rule.count && n >= rule.count) || ms > windowEnd) return;
      }
    }
  }
}

// ── fenetre ──

export function expand(raws: Raw[], windowStart: number, windowEnd: number, calendar?: string): CalEvent[] {
  const overrides = new Set<string>();
  for (const r of raws) if (r.recurrenceId !== undefined) overrides.add(`${r.uid}|${r.recurrenceId}`);
  const out: CalEvent[] = [];

  const push = (r: Raw, ms: number) => {
    const end = ms + r.durationMs;
    if (end <= windowStart || ms >= windowEnd) return;
    if (r.start.allDay) {
      // une entree par jour couvert, pour que le client groupe simplement
      for (let d = ms; d < end && d < windowEnd; d += DAY) {
        if (d + DAY <= windowStart) continue;
        out.push({
          id: `${r.uid}@${d}`,
          title: r.title,
          day: utcDayKey(d),
          start: utcDayKey(ms),
          end: utcDayKey(end),
          allDay: true,
          location: r.location,
          calendar,
        });
      }
      return;
    }
    out.push({
      id: `${r.uid}@${ms}`,
      title: r.title,
      day: dayKey(ms),
      start: new Date(ms).toISOString(),
      end: new Date(end).toISOString(),
      allDay: false,
      location: r.location,
      calendar,
    });
  };

  for (const r of raws) {
    if (r.recurrenceId !== undefined) { push(r, r.start.ms); continue; }
    if (!r.rule && (r.start.ms + r.durationMs <= windowStart || r.start.ms >= windowEnd)) continue;
    for (const ms of occurrences(r, windowEnd)) {
      if (r.exdates.has(ms) || overrides.has(`${r.uid}|${ms}`)) continue;
      push(r, ms);
    }
  }
  return out;
}

export async function fetchAgenda(urls: string[], days = 8) {
  const now = localParts(Date.now());
  const windowStart = zonedToUtc(now.y, now.mo, now.d, 0, 0, 0);
  const windowEnd = windowStart + days * DAY;
  const results = await Promise.allSettled(
    urls.map(async (u) => {
      const r = await fetch(u, { cache: "no-store", headers: { "User-Agent": "mathieuastruc-admin" } });
      if (!r.ok) throw new Error(`ics ${r.status}`);
      const { name, events } = parseIcs(await r.text());
      return expand(events, windowStart, windowEnd, name);
    }),
  );
  const events: CalEvent[] = [];
  const errors: string[] = [];
  for (const r of results) r.status === "fulfilled" ? events.push(...r.value) : errors.push(String(r.reason?.message || r.reason));
  events.sort((a, b) => (a.day < b.day ? -1 : a.day > b.day ? 1 : a.allDay !== b.allDay ? (a.allDay ? -1 : 1) : a.start < b.start ? -1 : 1));
  return { events, errors, windowStart, windowEnd };
}
