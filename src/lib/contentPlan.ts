export const channels = [
  { key: 'instagram', name: 'instagram', handle: 'matheusgen_', url: 'https://www.instagram.com/matheusgen_/' },
  { key: 'x', name: 'X', handle: 'matheusnpu', url: 'https://x.com/matheusnpu' },
  { key: 'tiktok', name: 'tiktok', handle: 'matheusgen', url: 'https://www.tiktok.com/@matheusgen' },
  { key: 'facebook', name: 'facebook', handle: 'matheusgen', url: 'https://www.facebook.com/matheusgen' },
  { key: 'youtube', name: 'youtube', handle: 'matheusgen', url: 'https://www.youtube.com/@matheusgen' },
] as const;
export type Channel = typeof channels[number]['key'];
export type DailyMetric = { key: Channel; handles: string[]; followers: number | null; delta: number | null; views: number | null; compared: number; observed: number; ts: number | null };
export type Analytics = { generated: number; days: { date: string; platforms: DailyMetric[] }[] };
export type Draft = { id: string; day: string; kind: 'x' | 'video'; title: string; text: string; detail?: string; source?: string; sourceDate?: string; done: boolean; published?: string[]; edition?: string; trend?: { label: string; url?: string; checkedAt: string } };
export type Editorial = { day: string; generated: string; x: Draft[]; video: Draft[] };
export const safeLink = (url?: string) => { try { return url && new URL(url).protocol === 'https:' ? url : undefined; } catch { return undefined; } };
// les propositions sont redigees a partir de sources lues, puis stockees en prive.
// aucun titre de release n'est transforme automatiquement en pseudo-analyse.
export function readEditorial(raw: unknown): Editorial | null {
 if (!raw || typeof raw !== 'object') return null;
 const e = raw as Editorial;
 if (!/^\d{4}-\d{2}-\d{2}$/.test(e.day) || typeof e.generated !== 'string') return null;
 const valid = (d: Draft, kind: Draft['kind']) => d && d.kind === kind && d.day === e.day && typeof d.id === 'string' && typeof d.title === 'string' && typeof d.text === 'string' && d.text.length > 0 && d.text.length <= 6000 && (!d.sourceDate || typeof d.sourceDate === 'string') && (!d.trend || (typeof d.trend.label === 'string' && typeof d.trend.checkedAt === 'string')) && (!d.detail || (typeof d.detail === 'string' && d.detail.length < 5000));
 if (!Array.isArray(e.x) || !e.x.length || !e.x.every(d=>valid(d,'x')) || !Array.isArray(e.video) || !e.video.length || !e.video.every(d=>valid(d,'video'))) return null;
 return { ...e, x: e.x.slice(0,3), video: e.video.slice(0,4) };
}

// une source = un sujet dans la boite, meme si elle inspire un post et une video.
export function editorialIdeas(editorial: Editorial | null): Draft[] {
 const seen = new Set<string>();
 return [...(editorial?.video || []), ...(editorial?.x || [])].filter(d => {
  const link = safeLink(d.source);
  if (!link) return false;
  const url = new URL(link); url.hash = '';
  for (const key of [...url.searchParams.keys()]) if (key.startsWith('utm_') || key === 's') url.searchParams.delete(key);
  const key = url.href;
  if (seen.has(key)) return false;
  seen.add(key); return true;
 });
}
