"use client";
import { useEffect, useState } from 'react';
import Card from '../Card';
import StudioAnalytics from './StudioAnalytics';
import IdeaBox from './IdeaBox';
import ScriptWriter from './ScriptWriter';
import type { Overview } from '@/app/api/admin/overview/route';
import type { ContentDoc } from '../types';
import { channels, safeLink, editorialIdeas, type Draft, type Editorial } from '@/lib/contentPlan';

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
 const copy = async () => { try { await navigator.clipboard.writeText(current.text); setCopied(true); setError(''); } catch { setError('Copie indisponible. Ouvre « modifier » pour sélectionner le texte.'); } };
 return <>
  {kind === 'video' && <div className="content-picks" aria-label="sujets vidéo">{choices.map((d,i)=><button key={d.id} aria-pressed={i===index} disabled={!!edit} onClick={()=>{setIndex(i);setCopied(false);setError('');}}><span>{String(i+1).padStart(2,'0')}</span>{d.title}</button>)}</div>}
  {edit ? <div className="content-edit"><label>{kind === 'x' ? 'tweet' : 'script'}<textarea aria-label={kind === 'x' ? 'brouillon du tweet' : 'script vidéo'} value={current.text} onChange={e=>setEdit({...current,text:e.target.value})} rows={14}/></label><div className="content-actions"><button onClick={()=>{onSave(current);setEdit(null);}}>enregistrer</button><button onClick={()=>setEdit(null)}>annuler</button></div></div> : <p className={`content-copy ${kind === 'x' ? 'content-copy--tweet' : ''}`}>{current.text}</p>}
  <div className="content-actions">
   <button className="content-primary" onClick={copy}>{copied?'copié ✓':'copier'}</button>
   {!edit && <button onClick={()=>setEdit(draft)}>modifier</button>}
   {!edit && kind === 'x' && choices.length>1 && <button onClick={()=>{setIndex(i=>i+1);setCopied(false);setError('');}}>autre idée ↻</button>}
   {source && <a href={source} target="_blank" rel="noreferrer" title={current.sourceDate ? `source du ${current.sourceDate.slice(0,10)}` : 'ouvrir la source'}>source ↗</a>}
  </div>
  {kind === 'x' ? <label className="content-published"><input type="checkbox" checked={draft.done} onChange={e=>onSave({...current,done:e.target.checked})}/>publié</label> : <div className="content-distribution">{channels.filter(c=>c.key!=='x').map(c=><label key={c.key}><input type="checkbox" checked={draft.published?.includes(c.key) || false} onChange={e=>onSave({...current,published:e.target.checked?[...(current.published||[]),c.key]:(current.published||[]).filter(p=>p!==c.key)})}/>{c.name}</label>)}</div>}
  {error && <p className="hint" role="status">{error}</p>}
 </>;
}

export default function ContentWorkspace({ overview, doc, today, onChange }: { overview: Overview | null; doc: ContentDoc; today: string; onChange: (d: ContentDoc) => void }) {
 const [openedDraft,setOpenedDraft]=useState<Draft|null>(null);
 const [panel,setPanel]=useState<'studio'|'publish'|'ideas'|'write'>('studio');
 useEffect(()=>{try {const saved=sessionStorage.getItem('matheus-panel');if(saved==='studio'||saved==='publish'||saved==='ideas'||saved==='write')setPanel(saved);}catch{}},[]);
 const choosePanel=(p:typeof panel)=>{setPanel(p);try{sessionStorage.setItem('matheus-panel',p);}catch{}};
 const [editorial,setEditorial] = useState<Editorial | null>(null);
 const [error,setError] = useState(false);
 useEffect(()=>{let active=true;fetch('/api/admin/content',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error();return r.json();}).then(v=>{if(active){setEditorial(v.editorial);setError(false);}}).catch(()=>{if(active)setError(true);});return()=>{active=false;};},[today]);
 const drafts=doc.drafts||[];
 const persist=(d:Draft)=>onChange({...doc,drafts:[...drafts.filter(v=>v.id!==d.id),d]});
 const ideaCount=new Set(editorialIdeas(editorial).map(d=>d.id).concat((doc.ideas||[]).filter(i=>!i.done).map(i=>i.sourceId||i.id))).size;
 const edition=(day?:string)=>day===today?'aujourd’hui':day?`du ${day.slice(8,10)}/${day.slice(5,7)}`:'';
 return <>
  <div className="content-nav" role="tablist" aria-label="atelier Matheus">{([{key:'studio',label:'studio'},{key:'write',label:'écrire'},{key:'publish',label:'à publier'},{key:'ideas',label:'boîte à idées'}] as const).map(p=><button key={p.key} id={`tab-${p.key}`} role="tab" aria-selected={panel===p.key} aria-controls={`panel-${p.key}`} tabIndex={panel===p.key?0:-1} onClick={()=>choosePanel(p.key)} onKeyDown={e=>{const keys=['studio','write','publish','ideas'] as const;const i=keys.indexOf(p.key);const next=e.key==='ArrowRight'?keys[(i+1)%4]:e.key==='ArrowLeft'?keys[(i+3)%4]:e.key==='Home'?keys[0]:e.key==='End'?keys[3]:null;if(next){e.preventDefault();choosePanel(next);document.getElementById(`tab-${next}`)?.focus();}}}>{p.label}{p.key==='ideas'&&<small>{ideaCount}</small>}</button>)}</div>
  <div id="panel-studio" role="tabpanel" aria-labelledby="tab-studio" hidden={panel!=='studio'} style={{display:panel==='studio'?'contents':'none'}}><StudioAnalytics/></div>
  <div id="panel-write" role="tabpanel" aria-labelledby="tab-write" hidden={panel!=='write'} style={{display:panel==='write'?'contents':'none'}}><ScriptWriter onSave={persist}/></div>
  <div id="panel-publish" role="tabpanel" aria-labelledby="tab-publish" hidden={panel!=='publish'} style={{display:panel==='publish'?'contents':'none'}}>
  {openedDraft&&<Card title={openedDraft.kind==='x'?'post':'script vidéo'} span={12} i={0} aside={<button onClick={()=>setOpenedDraft(null)}>← tous les brouillons</button>} className="content-focused"><h3>{openedDraft.title}</h3><Proposal key={openedDraft.id} choices={[openedDraft]} saved={drafts} onSave={persist} kind={openedDraft.kind} day={openedDraft.day}/></Card>}
  <div style={{display:openedDraft?'none':'contents'}}>
  <Card title="sur X" span={6} i={1} aside={edition(editorial?.x[0]?.day)} className="content-proposal"><Proposal key={`x-${editorial?.day}`} choices={editorial?.x||[]} saved={drafts} onSave={persist} kind="x" day={editorial?.day}/></Card>
  <Card title="en vidéo" span={6} i={2} aside={editorial ? `${editorial.video.length} sujets · ${edition(editorial.video[0]?.day)}` : ''} className="content-proposal content-proposal--video"><Proposal key={`video-${editorial?.day}`} choices={editorial?.video||[]} saved={drafts} onSave={persist} kind="video" day={editorial?.day}/></Card>
  {error && <p className="hint">Propositions indisponibles. Recharge la page pour réessayer.</p>}
  {(drafts.length>0)&&<div className="content-archive"><details><summary>brouillons enregistrés ({drafts.length})</summary>{[...drafts].sort((a,b)=>b.day.localeCompare(a.day)).map(d=><details key={d.id}><summary>{d.day} · {d.kind==='x'?'X':'vidéo'} · {d.title}{d.done?' ✓':''}</summary><p className="content-detail">{d.text}</p></details>)}</details></div>}
  </div>
  </div>
  <div id="panel-ideas" role="tabpanel" aria-labelledby="tab-ideas" hidden={panel!=='ideas'} style={{display:panel==='ideas'?'contents':'none'}}><IdeaBox doc={doc} editorial={editorial} today={today} onChange={onChange} onOpen={d=>{setOpenedDraft(d);choosePanel('publish');}}/></div>
 </>;
}
