// petites fonctions de date : tout est en heure de paris, les jours sont
// des cles yyyy-mm-dd pour que le stockage reste lisible a l'oeil

export const TZ = "Europe/Paris";

const dayFmt = new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" });
export const dayKeyOf = (d: Date) => dayFmt.format(d);
export const todayKey = () => dayKeyOf(new Date());

const parts = (key: string) => key.split("-").map(Number) as [number, number, number];
export const shiftDay = (key: string, n: number) => {
  const [y, m, d] = parts(key);
  return new Date(Date.UTC(y, m - 1, d + n)).toISOString().slice(0, 10);
};
export const daysBetween = (from: string, to: string) => {
  const [y1, m1, d1] = parts(from);
  const [y2, m2, d2] = parts(to);
  return Math.round((Date.UTC(y2, m2 - 1, d2) - Date.UTC(y1, m1 - 1, d1)) / 86_400_000);
};

const utcDate = (key: string) => new Date(key + "T00:00:00Z");
export const fmtDayLong = (key: string) =>
  new Intl.DateTimeFormat("fr-FR", { timeZone: "UTC", weekday: "long", day: "numeric", month: "long" }).format(utcDate(key));
export const fmtDayShort = (key: string) =>
  new Intl.DateTimeFormat("fr-FR", { timeZone: "UTC", weekday: "short", day: "numeric", month: "short" }).format(utcDate(key));
export const weekdayInitial = (key: string) =>
  new Intl.DateTimeFormat("fr-FR", { timeZone: "UTC", weekday: "narrow" }).format(utcDate(key)).toLowerCase();
export const fmtTime = (iso: string) =>
  new Intl.DateTimeFormat("fr-FR", { timeZone: TZ, hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).format(new Date(iso));
export const fmtStamp = (unixSeconds: number) =>
  new Intl.DateTimeFormat("fr-FR", { timeZone: TZ, day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).format(new Date(unixSeconds * 1000));

export const fmtNum = (n: number) => n.toLocaleString("fr-FR");
export const uid = () => Math.random().toString(36).slice(2, 9);

// la semaine commence le lundi
export const mondayOf = (key: string) => {
  const [y, m, d] = parts(key);
  const dow = (new Date(Date.UTC(y, m - 1, d)).getUTCDay() + 6) % 7;
  return shiftDay(key, -dow);
};
export const weekdayLong = (key: string) =>
  new Intl.DateTimeFormat("fr-FR", { timeZone: "UTC", weekday: "long" }).format(utcDate(key));
export const dayNumber = (key: string) => String(Number(key.slice(8, 10)));

export const monthOf = (key: string) => key.slice(0, 7);
export const shiftMonth = (month: string, n: number) => {
  const [y, m] = month.split("-").map(Number);
  const d = new Date(Date.UTC(y, m - 1 + n, 1));
  return d.toISOString().slice(0, 7);
};
export const fmtMonth = (month: string) =>
  new Intl.DateTimeFormat("fr-FR", { timeZone: "UTC", month: "long", year: "numeric" }).format(new Date(month + "-01T00:00:00Z"));
export const fmtMonthShort = (month: string) =>
  new Intl.DateTimeFormat("fr-FR", { timeZone: "UTC", month: "short" }).format(new Date(month + "-01T00:00:00Z")).replace(".", "");
export const fmtEuro = (n: number, cents = false) =>
  n.toLocaleString("fr-FR", { style: "currency", currency: "EUR", minimumFractionDigits: cents ? 2 : 0, maximumFractionDigits: cents ? 2 : 0 });
export const fmtRelative = (iso: string, now: Date) => {
  const diff = (now.getTime() - new Date(iso).getTime()) / 60_000;
  if (diff < 1) return "à l'instant";
  if (diff < 60) return `${Math.round(diff)} min`;
  if (diff < 24 * 60) return `${Math.round(diff / 60)} h`;
  return `${Math.round(diff / 1440)} j`;
};
