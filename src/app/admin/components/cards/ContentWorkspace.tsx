"use client";
import { useEffect, useState } from 'react';
import Card from '../Card';
import type { Overview } from '@/app/api/admin/overview/route';
import type { ContentDoc } from '../types';
import { channels, safeLink, type Draft, type Editorial } from '@/lib/contentPlan';
import { fmtNum, fmtStamp, shiftDay } from '../helpers';
const num = (n: number | null | undefined) => n == null ? '—' : fmtNum(n);
const signed = (n: number | null | undefined) => n == null ? '—' : `${n > 0 ? '+' : ''}${fmtNum(n)}`;

function Proposal({ choices, saved, onSave, kind, day }: { choices: Draft[]; saved: Draft[]; onSave: (d: Draft) => void; kind: Draft['kind']; day?: string }) {
 const [index, setIndex] = useState(0);
 const [edit, setEdit] = useState<Draft | null>(null);
 const [copied, setCopied] = useState(false);
 const [error, setError] = useState('');
 const selected = choices[index % Math.max(1, choices.length)];
 const draft = selected && (saved.find(d=>d.id===selected.id) || selected);
 if (!draft) return <p className="hint">Proposition en préparation.</p>;
 const current = edit?.id === draft.id ? edit : draft;
 const source = safeLink(current.source);
 const copy = async () => { try { await navigator.clipboard.writeText(kind === 'video' ? [current.title,current.text,current.detail].filter(Boolean).join('\n\n') : current.text); setCopied(true); setError(''); } catch { setError('Copie indisponible. Ouvre « modifier » pour sélectionner le texte.'); } };
 return <>
  {kind === 'video' && <div className="content-picks" aria-label="sujets vidéo">{choices.map((d,i)=><button key={d.id} aria-pressed={i===index} disabled={!!edit} onClick={()=>{setIndex(i);setCopied(false);setError('');}}><span>{String(i+1).padStart(2,'0')}</span>{d.title}</button>)}</div>}
  {edit ? <div className="content-edit"><label>{kind === 'x' ? 'tweet' : 'idée'}<textarea aria-label={kind === 'x' ? 'brouillon du tweet' : 'idée vidéo'} value={current.text} onChange={e=>setEdit({...current,text:e.target.value})} rows={5}/></label><div className="content-actions"><button onClick={()=>{onSave(current);setEdit(null);}}>enregistrer</button><button onClick={()=>setEdit(null)}>annuler</button></div></div> : <p className={`content-copy ${kind === 'x' ? 'content-copy--tweet' : ''}`}>{current.text}</p>}
  <div className="content-actions">
   <button className="content-primary" onClick={copy}>{copied?'copié ✓':'copier'}</button>
   {!edit && <button onClick={()=>setEdit(draft)}>modifier</button>}
   {!edit && kind === 'x' && choices.length>1 && <button onClick={()=>{setIndex(i=>i+1);setCopied(false);setError('');}}>autre idée ↻</button>}
   {source && <a href={source} target="_blank" rel="noreferrer" title={`source du ${current.sourceDate?.slice(0,10) || day}`}>source ↗</a>}
  </div>
  {kind === 'video' && current.trend && <details className="content-fold"><summary>pourquoi maintenant</summary><p className="hint">{current.trend.label}</p>{safeLink(current.trend.url) && <a href={safeLink(current.trend.url)} target="_blank" rel="noreferrer">voir le signal ↗</a>}</details>}
  {current.detail && <details className="content-fold"><summary>{kind==='x'?'développer l’avis':'voir le déroulé'}</summary><p className="content-detail">{current.detail}</p></details>}
  {kind === 'x' ? <label className="content-published"><input type="checkbox" checked={draft.done} onChange={e=>onSave({...current,done:e.target.checked})}/>publié</label> : <div className="content-distribution">{channels.filter(c=>c.key!=='x').map(c=><label key={c.key}><input type="checkbox" checked={draft.published?.includes(c.key) || false} onChange={e=>onSave({...current,published:e.target.checked?[...(current.published||[]),c.key]:(current.published||[]).filter(p=>p!==c.key)})}/>{c.name}</label>)}</div>}
  {error && <p className="hint" role="status">{error}</p>}
 </>;
}

export default function ContentWorkspace({ overview, doc, today, onChange }: { overview: Overview | null; doc: ContentDoc; today: string; onChange: (d: ContentDoc) => void }) {
 const [date,setDate] = useState(shiftDay(today,-1));
 const [editorial,setEditorial] = useState<Editorial | null>(null);
 const [error,setError] = useState(false);
 useEffect(()=>{let active=true;fetch('/api/admin/content',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error();return r.json();}).then(v=>{if(active){setEditorial(v.editorial);setError(false);}}).catch(()=>{if(active)setError(true);});return()=>{active=false;};},[today]);
 const drafts=doc.drafts||[];
 const persist=(d:Draft)=>onChange({...doc,drafts:[...drafts.filter(v=>v.id!==d.id),d]});
 const rows=overview?.analytics?.days.find(d=>d.date===date)?.platforms||[];
 const sum=(key:'followers'|'views'|'delta')=>{const values=rows.map(r=>r[key]).filter((v):v is number=>v!=null);return{value:values.length?values.reduce((a,b)=>a+b,0):null,count:values.length};};
 const followers=sum('followers'),views=sum('views'),delta=sum('delta');
 const edition=editorial?.day===today?'aujourd’hui':editorial?`du ${editorial.day.slice(8,10)}/${editorial.day.slice(5,7)}`:'';
 return <>
  <Card title="audience" span={12} i={0} className="content-analytics" aside={<input aria-label="jour du relevé" type="date" value={date} min={overview?.analytics?.days[0]?.date} max={today} onChange={e=>{if(e.target.value)setDate(e.target.value);}}/>}>
   <div className="content-metrics"><div><strong>{num(followers.value)}</strong><span>abonnés <small>{followers.count}/5 réseaux</small></span></div><div><strong>{signed(delta.value)}</strong><span>depuis la veille <small>{delta.count}/5</small></span></div><div><strong>{num(views.value)}</strong><span>vues suivies <small>{views.count}/5 réseaux</small></span></div></div>
   <table className="content-networks"><thead><tr><th>réseau</th><th>abonnés</th><th>+/−</th><th>vues</th></tr></thead><tbody>{channels.map(c=>{const r=rows.find(p=>p.key===c.key);return <tr key={c.key}><th><a href={c.url} target="_blank" rel="noreferrer" title={`@${c.handle}`}>{c.name} ↗</a></th><td>{num(r?.followers)}</td><td>{signed(r?.delta)}</td><td>{num(r?.views)}</td></tr>;})}</tbody></table>
   <div className="content-analytics-footer"><span>totaux partiels · — indisponible</span><details><summary>détail & historique</summary><p className="hint">Écarts entre les derniers relevés de deux jours consécutifs, heure de Paris. Vues des contenus comparables uniquement ; nouveaux contenus exclus. Abonnements non dédupliqués.{date===today?' Journée en cours.':''}</p>{channels.map(c=>{const r=rows.find(p=>p.key===c.key);const last=overview?.audience?.platforms.find(p=>p.key===c.key);return <p className="hint" key={c.key}>{c.name} · {r?.ts?`${r.compared}/${r.observed} contenus · ${fmtStamp(r.ts)}`:last?`dernier relevé : ${num(last.followers)} abonnés · ${fmtStamp(last.ts)}`:'aucun relevé'}</p>;})}<div className="content-history"><table className="content-networks"><thead><tr><th>jour</th>{channels.map(c=><th key={c.key}>{c.name}<small>abonnés / vues</small></th>)}</tr></thead><tbody>{[...(overview?.analytics?.days||[])].reverse().map(d=><tr key={d.date}><th><button onClick={()=>setDate(d.date)}>{d.date.slice(5)}</button></th>{channels.map(c=>{const r=d.platforms.find(p=>p.key===c.key);return <td key={c.key}>{num(r?.followers)} / {num(r?.views)}</td>;})}</tr>)}</tbody></table></div></details></div>
  </Card>
  <Card title="sur X" span={6} i={1} aside={edition} className="content-proposal"><Proposal key={`x-${editorial?.day}`} choices={editorial?.x||[]} saved={drafts} onSave={persist} kind="x" day={editorial?.day}/></Card>
  <Card title="en vidéo" span={6} i={2} aside={editorial ? `${editorial.video.length} sujets · ${edition}` : edition} className="content-proposal"><Proposal key={`video-${editorial?.day}`} choices={editorial?.video||[]} saved={drafts} onSave={persist} kind="video" day={editorial?.day}/></Card>
  {error && <p className="hint">Propositions indisponibles. Recharge la page pour réessayer.</p>}
  {(drafts.length>0||doc.ideas?.length>0)&&<div className="content-archive"><details><summary>brouillons enregistrés ({drafts.length+(doc.ideas?.length||0)})</summary>{[...drafts].sort((a,b)=>b.day.localeCompare(a.day)).map(d=><details key={d.id}><summary>{d.day} · {d.kind==='x'?'X':'vidéo'} · {d.title}{d.done?' ✓':''}</summary><p className="content-detail">{d.text}</p></details>)}{doc.ideas?.map(d=><p key={d.id}>{d.text}</p>)}</details></div>}
 </>;
}
