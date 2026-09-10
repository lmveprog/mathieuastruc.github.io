'use client';
import { useEffect, useState } from 'react';
import Card from '../Card';
import type { Draft } from '@/lib/contentPlan';
type Result={title:string;script:string;note:string;sources:{title:string;url:string}[]};
export default function ScriptWriter({onSave}:{onSave:(d:Draft)=>void}){
 const [topic,setTopic]=useState(''),[source,setSource]=useState(''),[duration,setDuration]=useState(60),[direction,setDirection]=useState('');
 const [result,setResult]=useState<Result|null>(null),[busy,setBusy]=useState(false),[error,setError]=useState(''),[copied,setCopied]=useState(false),[saved,setSaved]=useState(false);
 const [examples,setExamples]=useState(0),[ready,setReady]=useState(false),[jobId,setJobId]=useState(''),[status,setStatus]=useState('');
 useEffect(()=>{
  try{const d=JSON.parse(sessionStorage.getItem('matheus-script-work')||'null');if(d){setTopic(d.topic||'');setSource(d.source||'');setDuration(d.duration||60);setResult(d.result||null);setJobId(d.jobId||'');setStatus(d.status||'');setBusy(['pending','processing'].includes(d.status));}}catch{}setReady(true);
  fetch('/api/admin/script').then(async r=>{const d=await r.json();if(!r.ok)throw Error(d.error);setExamples(d.examples);}).catch(()=>setError('Connexion au générateur indisponible. Recharge la page.'));
 },[]);
 useEffect(()=>{if(ready)try{sessionStorage.setItem('matheus-script-work',JSON.stringify({topic,source,duration,result,jobId,status}));}catch{}},[topic,source,duration,result,jobId,status,ready]);
 useEffect(()=>{
  if(!jobId||!['pending','processing'].includes(status))return;
  let active=true;
  const check=async()=>{try{const r=await fetch(`/api/admin/script?id=${jobId}`,{cache:'no-store'});const d=await r.json();if(!r.ok)throw Error(d.error);if(!active)return;const j=d.job;setStatus(j.status);if(j.status==='done'){setResult(j.result);setBusy(false);setDirection('');setError('');}else if(j.status==='error'){setError(j.error||'Précise ton sujet puis réessaie.');setBusy(false);}else setError('');}catch{if(active)setError('Connexion interrompue. Ta demande est conservée ; reconnexion automatique.');}};
  check();const timer=setInterval(check,10000);return()=>{active=false;clearInterval(timer);};
 },[jobId,status]);
 async function generate(revise=false){
  setBusy(true);setError('');setCopied(false);setSaved(false);
  const id=`sj-${crypto.randomUUID().replace(/-/g,'').slice(0,28)}`;
  try{const r=await fetch('/api/admin/script',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id,topic,source,duration,previous:revise?result?.script:'',direction:revise?direction:''})});const d=await r.json();if(!r.ok)throw Error(d.error);setJobId(id);setStatus(d.job.status);}catch(e){setError((e as Error).message||'Envoi indisponible.');setBusy(false);}
 }
 const words=result?.script.trim().split(/\s+/).filter(Boolean).length||0;
 return <Card title="écrire ma vidéo" span={12} i={0} className="script-writer" aside={examples?`${examples} vidéos de référence`:'ta voix'}>
  <form onSubmit={e=>{e.preventDefault();generate();}}>
   <label htmlFor="script-topic">De quoi tu veux parler ?</label>
   <textarea id="script-topic" placeholder="Un sujet, une actu, ton avis… Par exemple : pourquoi le computer use change la donne pour les ingénieurs" value={topic} onChange={e=>setTopic(e.target.value)} maxLength={2500} minLength={8} required rows={3} disabled={busy}/>
   <div className="script-brief-options"><label>Source · facultatif<input type="url" placeholder="https://…" value={source} onChange={e=>setSource(e.target.value)} maxLength={2000} disabled={busy}/></label><label>Durée<select value={duration} onChange={e=>setDuration(Number(e.target.value))} disabled={busy}><option value={45}>≈ 45 secondes</option><option value={60}>≈ 1 minute</option><option value={90}>≈ 1 min 30</option></select></label></div>
   <div className="content-actions"><button type="submit" className="content-primary" disabled={busy||topic.trim().length<8}>{busy?(status==='processing'?'écriture en cours…':'demande envoyée…'):result?'écrire une nouvelle version':'écrire mon script'}</button><small>Astra via Codex · sans clé API</small></div>
  </form>
  {busy&&<p className="hint" role="status">{status==='processing'?'Astra recherche les sources et écrit ton script.':'Ta demande attend le prochain passage de Codex (toutes les 5 min). Le script apparaîtra ici automatiquement.'}</p>}
  {error&&<p className="script-error" role="alert">{error}</p>}
  {result&&<div className="script-result" aria-busy={busy}><div className="studio-list-heading"><h3>{result.title}</h3><small>{words} mots · ≈ {Math.round(words/4)} s à ton débit</small></div><label className="sr-only" htmlFor="written-script">Ton script à lire</label><textarea id="written-script" className="script-text" value={result.script} onChange={e=>{setResult({...result,script:e.target.value});setSaved(false);setCopied(false);}} disabled={busy} rows={15}/>
   <div className="content-actions"><button disabled={busy} className="content-primary" onClick={async()=>{try{await navigator.clipboard.writeText(result.script);setCopied(true);}catch{setError('Sélectionne le texte pour le copier.');}}}>{copied?'copié ✓':'copier le script'}</button><button disabled={busy||saved} onClick={()=>{onSave({id:`script-${crypto.randomUUID()}`,day:new Date().toLocaleDateString('en-CA',{timeZone:'Europe/Paris'}),kind:'video',title:result.title,text:result.script,source:result.sources[0]?.url,done:false,published:[],edition:'voice-v3'});setSaved(true);}}>{saved?'ajouté aux brouillons':'garder dans mes brouillons'}</button></div>
   {result.note&&<p className="hint">{result.note}</p>}
   <div className="idea-links">{result.sources.map(s=><a key={s.url} href={s.url} target="_blank" rel="noreferrer">{s.title} ↗</a>)}</div>
   <form className="script-revise" onSubmit={e=>{e.preventDefault();generate(true);}}><label htmlFor="script-direction">Tu veux changer quoi ?</label><div className="content-actions"><input id="script-direction" placeholder="Plus court, une accroche plus directe, plus technique…" value={direction} onChange={e=>setDirection(e.target.value)} maxLength={1000} required disabled={busy}/><button disabled={busy||!direction.trim()}>retravailler</button></div></form>
  </div>}
  <p className="hint script-settings">Utilise ton accès Codex et ses limites habituelles. Le Mac et Codex doivent être disponibles ; aucun crédit API à acheter.</p>
 </Card>;
}
