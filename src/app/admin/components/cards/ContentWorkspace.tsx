"use client";
import { useEffect, useState } from 'react';
import Card from '../Card';
import type { Overview } from '@/app/api/admin/overview/route';
import type { ContentDoc } from '../types';
import { channels, dailyDraft, type Draft } from '@/lib/contentPlan';
import { fmtNum, fmtStamp, shiftDay } from '../helpers';
const num = (n: number | null | undefined) => n == null ? '—' : fmtNum(n);
const signed = (n: number | null | undefined) => n == null ? '—' : `${n > 0 ? '+' : ''}${fmtNum(n)}`;

export default function ContentWorkspace({ overview, doc, today, onChange }: { overview: Overview | null; doc: ContentDoc; today: string; onChange: (d: ContentDoc) => void }) {
 const [date, setDate] = useState(shiftDay(today,-1));
 const [suggestion, setSuggestion] = useState(dailyDraft(today, 'x'));
 const [mode, setMode] = useState('idée de fond · recherche des actualités…');
 const [copied, setCopied] = useState('');
 const [editing, setEditing] = useState<Draft | null>(null);
 useEffect(() => {
  let active = true;
  setSuggestion(dailyDraft(today,'x'));
  fetch('/api/admin/content').then(r => { if (!r.ok) throw Error(); return r.json(); }).then(v => { if (active) { setSuggestion(v.draft); setMode(v.mode); } }).catch(() => { if (active) setMode('idée de fond · sources indisponibles'); });
  return () => { active = false; };
 }, [today]);
 const drafts = doc.drafts || [];
 const x = drafts.find(d => d.id === `x-${today}`) || suggestion;
 const video = drafts.find(d => d.id === `video-${today}`) || dailyDraft(today, 'video');
 const persist = (d: Draft) => onChange({ ...doc, drafts: [...drafts.filter(v => v.id !== d.id), d] });
 const copy = async (d: Draft) => { try { await navigator.clipboard.writeText(d.text); setCopied(d.id); } catch { setCopied('échec · sélectionne le texte pour le copier'); } };
 const rows = overview?.analytics?.days.find(d => d.date === date)?.platforms || [];
 const sum = (key: 'followers' | 'views' | 'delta') => { const values=rows.map(r=>r[key]).filter((v): v is number => v != null); return { value: values.length ? values.reduce((a,b)=>a+b,0) : null, count: values.length }; };
 const followers = sum('followers'), views = sum('views'), delta = sum('delta');
 const draftCard = (draft: Draft) => {
  const current = editing?.id === draft.id ? editing : draft;
  return <>
   <p className="pro-eyebrow">{draft.kind === 'x' ? mode : 'un tournage · quatre plateformes'}</p>
   <h3 className="pro-subject">{draft.title}</h3>
   {draft.source && <p className="hint"><a href={draft.source} target="_blank" rel="noreferrer">release officielle ↗</a> · {draft.sourceDate?.slice(0,10)} · à lire avant publication</p>}
   <label className="pro-editor"><span className="sr-only">{draft.kind === 'x' ? 'brouillon du tweet' : 'plan de la vidéo'}</span><textarea value={current.text} onChange={e => setEditing({ ...current, text: e.target.value })} rows={draft.kind === 'x' ? 6 : 10} /></label>
   <div className="pro-actions">
    <button className="chip" onClick={() => { persist(current); setEditing(null); }}>enregistrer le brouillon</button>
    <button className="chip" onClick={() => copy(current)}>{copied === draft.id ? 'copié ✓' : 'copier'}</button>
    {draft.kind === 'x' && <button className="chip" onClick={() => persist({ ...current, done: !draft.done })}>{draft.done ? 'publié ✓' : 'marquer publié'}</button>}
   </div>
   {draft.kind === 'video' && <div className="pro-diffusion">{channels.filter(c=>c.key!=='x').map(c=><label key={c.key}><input type="checkbox" checked={draft.published?.includes(c.key) || false} onChange={e => persist({ ...current, published: e.target.checked ? [...(draft.published || []),c.key] : draft.published?.filter(p=>p!==c.key) })} />{c.name}</label>)}</div>}
  </>;
 };
 return <>
  <Card title="mes réseaux" aside="le quotidien, simplement" span={12} i={0}>
   <div className="pro-toolbar"><div className="chips">{channels.map(c=><a className="chip" key={c.key} href={c.url} target="_blank" rel="noreferrer">{c.name} <span className="hint">@{c.handle}</span> ↗</a>)}</div><label className="pro-date">jour du relevé <input aria-label="jour du relevé" type="date" value={date} min={overview?.analytics?.days[0]?.date} max={today} onChange={e=>{if(e.target.value)setDate(e.target.value);}} /></label></div>
   <div className="pro-totals">{[['abonnements cumulés',followers],['variation des abonnés',delta],['vues gagnées · contenus suivis',views]].map(([label,total])=>{const t=total as typeof followers;return <div key={String(label)}><span className="money-k">{String(label)}</span><strong>{label === 'variation des abonnés' ? signed(t.value) : num(t.value)}</strong><small>{t.count}/5 plateformes · {t.count<5?'total partiel':'relevés disponibles'}</small></div>;})}</div>
   <div className="pro-table-wrap"><table className="pro-table"><thead><tr><th>plateforme</th><th>abonnés</th><th>variation / veille</th><th>vues / veille</th><th>couverture & relevé</th></tr></thead><tbody>{channels.map(c=>{const r=rows.find(r=>r.key===c.key);const last=overview?.audience?.platforms.find(p=>p.key===c.key);return <tr key={c.key}><th><a href={c.url} target="_blank" rel="noreferrer">{c.name} ↗</a></th><td>{num(r?.followers)}</td><td>{signed(r?.delta)}</td><td>{num(r?.views)}</td><td>{r?.ts ? <>{r.compared}/{r.observed} contenus comparables<small>{fmtStamp(r.ts)}</small></> : <small>{last ? `dernier relevé abonnés : ${fmtStamp(last.ts)} · ${num(last.followers)}` : 'aucun relevé disponible'}</small>}</td></tr>;})}</tbody></table></div>
   <p className="hint">Dernier relevé de chaque jour, heure de Paris. Les vues mesurent l’écart des mêmes contenus entre deux jours consécutifs ; les nouveaux contenus sans point de comparaison sont exclus. Un tiret signifie « inconnu ». {date === today ? 'Aujourd’hui est encore incomplet. ' : ''}Les abonnements ne sont pas une audience unique.</p>
   <details className="pro-history"><summary>historique · 30 jours</summary><div className="pro-table-wrap"><table className="pro-table"><thead><tr><th>jour</th>{channels.map(c=><th key={c.key}>{c.name}<small>abonnés / vues</small></th>)}</tr></thead><tbody>{[...(overview?.analytics?.days || [])].reverse().map(d=><tr key={d.date}><th><button onClick={()=>setDate(d.date)}>{d.date.slice(5)}</button></th>{channels.map(c=>{const r=d.platforms.find(p=>p.key===c.key);return <td key={c.key}>{num(r?.followers)} / {num(r?.views)}</td>;})}</tr>)}</tbody></table></div></details>
  </Card>
  <Card title="le tweet du jour" aside={today} span={7} i={1}>{draftCard(x)}<p className="hint">Une idée, une question précise. Ajoute ton observation après un vrai test. Publication manuelle sur X.</p></Card>
  <Card title="créer la conversation" aside="IA · ingénierie · terrain" span={5} i={2}>
   <p className="pro-statement">Documenter ce que tu construis. Montrer ce qui résiste.</p>
   <p>Ton angle : les choix concrets derrière les démos IA — tests, coûts, erreurs et décisions de quelqu’un qui fabrique.</p>
   <ol className="pro-principles"><li>Un fait sourcé ou une expérience personnelle par tweet.</li><li>Une réponse utile : un contre-exemple, une mesure, un bout de code ou une vraie question.</li><li>Revenir discuter quand quelqu’un apporte un point intéressant.</li></ol>
   <a className="chip" href="https://x.com/search?q=%28AI%20OR%20LLM%20OR%20agents%29%20%28evals%20OR%20inference%20OR%20engineering%29&f=live" target="_blank" rel="noreferrer">chercher une conversation sur X ↗</a>
   <p className="hint">Lis le fil avant de répondre. La veille actuelle du lab couvre surtout la vidéo : aucun faux fil X n’est proposé ici.</p>
   <details><summary>ce que l’algorithme nous apprend</summary><p>Le classement prédit les actions de chaque lecteur à partir de son historique. Cela suggère de rester cohérent et utile à une communauté précise. Ce n’est pas une garantie de portée, et les poids ne multiplient pas les compteurs de likes.</p><a href="https://github.com/xai-org/x-algorithm#scoring-and-ranking" target="_blank" rel="noreferrer">source : dépôt X, consulté le 9 septembre 2026 ↗</a></details>
  </Card>
  <Card title="la prochaine vidéo" aside="atelier · deuxième étape" span={7} i={3}>{draftCard(video)}</Card>
  <Card title="à ta sauce" aside="inspiration ≠ imitation" span={5} i={4}>
   <p className="pro-statement">Une expérience réelle devient ton histoire.</p>
   <p>chrispathway, becoming.lea et consti.in.tech sont tes références. Le point de départ reste ton propre travail : une friction, un test visible, un verdict personnel.</p>
   <ul className="pro-principles"><li>« Le détail qui a cassé ma démo »</li><li>« Est-ce que ça me fait vraiment gagner du temps ? »</li><li>« Un concept, un mini-projet »</li></ul>
   <p className="hint">Un seul montage pour Instagram, TikTok, Facebook et YouTube. Adapte uniquement la légende et la couverture si nécessaire.</p>
   <details><summary>veille du lab</summary>{overview?.veille?.items.length ? overview.veille.items.map((v,i)=><p key={i}><a href={/^https?:\/\//.test(v.url)?v.url:undefined} target="_blank" rel="noreferrer">{v.handle} · {v.title} ↗</a></p>) : <p className="hint">Aucune veille récente disponible.</p>}</details>
  </Card>
  {(drafts.length>0 || doc.ideas?.length>0) && <Card title="mes brouillons" aside="conservés dans le store privé" span={12} i={5}>
   {drafts.slice().sort((a,b)=>b.day.localeCompare(a.day)).map(d=><details key={d.id}><summary>{d.day} · {d.kind === 'x'?'X':'vidéo'} · {d.title} {d.done?'✓':''}</summary><p className="pro-saved">{d.text}</p><button className="chip" onClick={()=>copy(d)}>copier</button></details>)}
   {doc.ideas?.map(d=><p key={d.id}>{d.done?'✓ ':''}{d.text}</p>)}
  </Card>}
  {copied.startsWith('échec') && <p role="status">{copied}</p>}
 </>;
}
