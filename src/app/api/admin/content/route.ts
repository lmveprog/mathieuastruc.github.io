import { NextResponse } from 'next/server';
import { dailyDraft } from '@/lib/contentPlan';
export const dynamic = 'force-dynamic';
// sources primaires, pas de titres de veille sociale transformes en faits.
export async function GET() {
 const day = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Paris' }).format(new Date());
 const repos = ['huggingface/transformers', 'vllm-project/vllm', 'ollama/ollama'];
 const results = await Promise.allSettled(repos.map(async repo => {
  const r = await fetch(`https://api.github.com/repos/${repo}/releases/latest`, { headers: { Accept: 'application/vnd.github+json' }, next: { revalidate: 3600 }, signal: AbortSignal.timeout(7000) });
  if (!r.ok) throw new Error('source indisponible');
  const v = await r.json();
  if (!v.published_at || !v.html_url || !v.tag_name) throw new Error('source incomplète');
  return { repo, date: String(v.published_at), url: String(v.html_url), tag: String(v.tag_name).slice(0,40) };
 }));
 const recent = results.flatMap(r => r.status === 'fulfilled' ? [r.value] : []).filter(r => {
  const age = Date.now()-Date.parse(r.date); return age >= 0 && age < 7*86400000;
 }).sort((a,b) => b.date.localeCompare(a.date));
 const draft = dailyDraft(day, 'x');
 if (recent.length) {
  const news = recent[Math.floor(Date.parse(day)/86400000)%recent.length];
  draft.title = `${news.repo} · ${news.tag}`;
  draft.source = news.url; draft.sourceDate = news.date;
  draft.text = `${news.repo.split('/')[1]} ${news.tag} : release du ${news.date.slice(0,10)}. Avant de migrer, quel test vous ferait dire « cette version vaut le coup » : qualité, latence ou régressions sur vos cas réels ?\n\n${news.url}`;
 }
 return NextResponse.json({ draft, mode: recent.length ? 'actualité · release officielle' : 'idée de fond · pas d’actualité vérifiée disponible', video: dailyDraft(day, 'video') });
}
