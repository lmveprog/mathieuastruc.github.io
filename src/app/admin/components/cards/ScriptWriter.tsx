'use client';
import { useEffect, useState } from 'react';
import Card from '../Card';
import type { Draft } from '@/lib/contentPlan';
type Result={title:string;script:string;note:string;sources:{title:string;url:string}[]};
export default function ScriptWriter({onSave}:{onSave:(d:Draft)=>void}){
 const [topic,setTopic]=useState(''),[source,setSource]=useState(''),[duration,setDuration]=useState(60),[direction,setDirection]=useState('');
 const [result,setResult]=useState<Result|null>(null),[busy,setBusy]=useState(false),[error,setError]=useState(''),[copied,setCopied]=useState(false),[saved,setSaved]=useState(false);
 const [configured,setConfigured]=useState<boolean|null>(null),[examples,setExamples]=useState(0),[apiKey,setApiKey]=useState(''),[connecting,setConnecting]=useState(false),[ready,setReady]=useState(false);
 useEffect(()=>{
  try{const d=JSON.parse(sessionStorage.getItem('matheus-script-work')||'null');if(d){setTopic(d.topic||'');setSource(d.source||'');setDuration(d.duration||60);setResult(d.result||null);}}catch{}setReady(true);
  fetch('/api/admin/script').then(async r=>{const d=await r.json();if(!r.ok)throw Error(d.error);setConfigured(d.configured);setExamples(d.examples);}).catch(()=>setError('Connexion au générateur indisponible. Recharge la page.'));
 },[]);
 useEffect(()=>{if(ready)try{sessionStorage.setItem('matheus-script-work',JSON.stringify({topic,source,duration,result}));}catch{}},[topic,source,duration,result,ready]);
 async function connect(remove=false){setConnecting(true);setError('');try{const r=await fetch('/api/admin/script',{method:remove?'DELETE':'PUT',headers:{'Content-Type':'application/json'},body:remove?undefined:JSON.stringify({apiKey})});const d=await r.json();if(!r.ok)throw Error(d.error);setConfigured(d.configured);setApiKey('');}catch(e){setError((e as Error).message);}finally{setConnecting(false);}}
 async function generate(revise=false){setBusy(true);setError('');setCopied(false);setSaved(false);try{const r=await fetch('/api/admin/script',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({topic,source,duration,previous:revise?result?.script:'',direction:revise?direction:''})});const d=await r.json();if(!r.ok)throw Error(d.error);if(!d.script){setError(d.note||'Précise ton sujet.');return;}setResult(d);setDirection('');}catch(e){setError((e as Error).message||'Génération indisponible.');}finally{setBusy(false);}}
 const words=result?.script.trim().split(/\s+/).filter(Boolean).length||0;
 return <Card title="écrire ma vidéo" span={12} i={0} className="script-writer" aside={examples?`${examples} vidéos de référence`:'ta voix'}>
  <form onSubmit={e=>{e.preventDefault();generate();}}>
   <label htmlFor="script-topic">De quoi tu veux parler ?</label>
   <textarea id="script-topic" placeholder="Un sujet, une actu, ton avis… Par exemple : pourquoi le computer use change la donne pour les ingénieurs" value={topic} onChange={e=>setTopic(e.target.value)} maxLength={2500} minLength={8} required rows={3} disabled={busy}/>
   <div className="script-brief-options"><label>Source · facultatif<input type="url" placeholder="https://…" value={source} onChange={e=>setSource(e.target.value)} maxLength={2000} disabled={busy}/></label><label>Durée<select value={duration} onChange={e=>setDuration(Number(e.target.value))} disabled={busy}><option value={45}>≈ 45 secondes</option><option value={60}>≈ 1 minute</option><option value={90}>≈ 1 min 30</option></select></label></div>
   <div className="content-actions"><button type="submit" className="content-primary" disabled={busy||!configured||topic.trim().length<8}>{busy?'recherche et écriture…':result?'écrire une nouvelle version':'écrire mon script'}</button><small>Astra · sources vérifiées sur le web</small></div>
  </form>
  {busy&&<p className="hint" role="status">Astra cherche les sources puis écrit dans ta voix. Cela peut prendre quelques minutes.</p>}
  {error&&<p className="script-error" role="alert">{error}</p>}
  {result&&<div className="script-result" aria-busy={busy}><div className="studio-list-heading"><h3>{result.title}</h3><small>{words} mots · ≈ {Math.round(words/4)} s à ton débit</small></div><label className="sr-only" htmlFor="written-script">Ton script à lire</label><textarea id="written-script" className="script-text" value={result.script} onChange={e=>{setResult({...result,script:e.target.value});setSaved(false);setCopied(false);}} disabled={busy} rows={15}/>
   <div className="content-actions"><button disabled={busy} className="content-primary" onClick={async()=>{try{await navigator.clipboard.writeText(result.script);setCopied(true);}catch{setError('Sélectionne le texte pour le copier.');}}}>{copied?'copié ✓':'copier le script'}</button><button disabled={busy||saved} onClick={()=>{onSave({id:`script-${crypto.randomUUID()}`,day:new Date().toLocaleDateString('en-CA',{timeZone:'Europe/Paris'}),kind:'video',title:result.title,text:result.script,source:result.sources[0]?.url,done:false,published:[],edition:'voice-v3'});setSaved(true);}}>{saved?'ajouté aux brouillons':'garder dans mes brouillons'}</button></div>
   {result.note&&<p className="hint">{result.note}</p>}
   <div className="idea-links">{result.sources.map(s=><a key={s.url} href={s.url} target="_blank" rel="noreferrer">{s.title} ↗</a>)}</div>
   <form className="script-revise" onSubmit={e=>{e.preventDefault();generate(true);}}><label htmlFor="script-direction">Tu veux changer quoi ?</label><div className="content-actions"><input id="script-direction" placeholder="Plus court, une accroche plus directe, plus technique…" value={direction} onChange={e=>setDirection(e.target.value)} maxLength={1000} required disabled={busy}/><button disabled={busy||!configured||!direction.trim()}>retravailler</button></div></form>
  </div>}
  <details className="script-settings" open={configured===false?true:undefined}><summary>connexion OpenAI {configured?'· connectée':''}</summary><p className="hint">{configured?'Ta clé est conservée chiffrée côté serveur.':'Connecte une clé API OpenAI ayant accès à Astra. Les appels sont facturés sur ton compte API.'} Ton sujet et tes exemples d’écriture sont transmis à OpenAI pour rédiger le script.</p>{configured?<button disabled={connecting||busy} onClick={()=>connect(true)}>déconnecter</button>:<form onSubmit={e=>{e.preventDefault();connect();}}><label htmlFor="script-key">Clé API OpenAI</label><div className="content-actions"><input id="script-key" type="password" autoComplete="off" placeholder="sk-…" value={apiKey} onChange={e=>setApiKey(e.target.value)} required disabled={connecting}/><button disabled={connecting||!apiKey}>{connecting?'vérification…':'connecter'}</button><a href="https://platform.openai.com/api-keys" target="_blank" rel="noreferrer">créer une clé ↗</a></div></form>}</details>
 </Card>;
}
