"use client";
import { useCallback, useEffect, useState } from 'react';
import Card from '../Card';
import { channels, safeLink } from '@/lib/contentPlan';
import type { StudioResponse, StudioVideo } from '@/lib/studio';
import { fmtNum } from '../helpers';
const num = (n: number | null | undefined) => n == null ? '—' : fmtNum(n);
const sum = (xs: (number | null | undefined)[]) => { const ns = xs.filter((n): n is number => n != null); return ns.length ? ns.reduce((a,b)=>a+b,0) : null; };
const date = (ts: number | null) => ts ? new Date(ts*1000).toLocaleDateString('fr-FR',{day:'numeric',month:'short',timeZone:'Europe/Paris'}) : 'date inconnue';
const stamp = (ts: number | null) => ts ? new Date(ts*1000).toLocaleString('fr-FR',{timeZone:'Europe/Paris'}) : 'aucun relevé';
const age = (ts: number | null) => { if (!ts) return 'non connecté'; const m=Math.max(0,Math.floor((Date.now()/1000-ts)/60)); return m<1?'à l’instant':m<60?`il y a ${m} min`:m<1440?`il y a ${Math.floor(m/60)} h`:`il y a ${Math.floor(m/1440)} j`; };
const signed = (n: number | null) => n == null ? '—' : `${n>0?'+':''}${num(n)}`;

function Chart({ points, label }: { points: { label: string; value: number | null; at?: number }[]; label: string }) {
 const [hover, setHover] = useState<number | null>(null);
 const values=points.flatMap(p=>p.value==null?[]:[p.value]);
 if (!values.length) return <div className="studio-chart-empty">L’historique se construit à partir des relevés disponibles.</div>;
 const lo=Math.min(0,...values), hi=Math.max(...values,1), height=150;
 const pos=(v:number,i:number)=>[44+570*(points[i]?.at!=null && points[points.length-1]?.at!==points[0]?.at ? (points[i].at!-points[0].at!)/(points[points.length-1].at!-points[0].at!) : i/Math.max(1,points.length-1)),18+height-(v-lo)/(hi-lo)*height];
 let path='';let connected=false;
 points.forEach((p,i)=>{if(p.value==null){connected=false;return;}const [x,y]=pos(p.value,i);path+=`${connected?'L':'M'}${x},${y} `;connected=true;});
 const current=hover!=null?points[hover]:null;
 return <div className="studio-chart">
  <div className="studio-chart-caption" aria-live="polite">{current?`${current.label} · ${num(current.value)}`:label}</div>
  <svg viewBox="0 0 640 200" role="img" aria-label={label}>
   {[0,.5,1].map(n=><g key={n}><line x1="44" x2="614" y1={18+n*height} y2={18+n*height} className="studio-gridline"/><text x="0" y={22+n*height}>{num(Math.round(hi-n*(hi-lo)))}</text></g>)}
   <path d={path} className="studio-curve"/>
   {points.map((p,i)=>{if(p.value==null)return null;const [x,y]=pos(p.value,i);return <g key={i}><circle cx={x} cy={y} r="3" className="studio-dot"/><circle cx={x} cy={y} r="10" fill="transparent" tabIndex={0} onFocus={()=>setHover(i)} onBlur={()=>setHover(null)} onMouseEnter={()=>setHover(i)} onMouseLeave={()=>setHover(null)} aria-label={`${p.label} : ${num(p.value)}`}><title>{p.label} : {num(p.value)}</title></circle></g>;})}
   <text x="44" y="196">{points[0]?.label}</text><text x="614" y="196" textAnchor="end">{points[points.length-1]?.label}</text>
  </svg>
 </div>;
}
function Thumb({ video }: { video: StudioVideo }) {
 const [failed,setFailed]=useState(false);
 const src=safeLink(video.thumbnail);
 return <div className="studio-thumb">{src&&!failed?<img src={src} alt="" loading="lazy" referrerPolicy="no-referrer" onError={()=>setFailed(true)}/>:<span aria-hidden="true">▶</span>}</div>;
}
export default function StudioAnalytics() {
 const [data,setData]=useState<StudioResponse|null>(null),[loading,setLoading]=useState(true),[error,setError]=useState(false);
 const [platform,setPlatform]=useState('all'),[period,setPeriod]=useState(7),[metric,setMetric]=useState<'views'|'followers'>('views');
 const [expanded,setExpanded]=useState<string|null>(null),[limit,setLimit]=useState(8);
 const refresh=useCallback(async()=>{setLoading(true);try{const r=await fetch('/api/admin/studio',{cache:'no-store'});if(!r.ok)throw Error();const d=await r.json();if(!d.studio)throw Error();setData(d);setError(false);}catch{setError(true);}finally{setLoading(false);}},[]);
 useEffect(()=>{refresh();const t=setInterval(()=>{if(!document.hidden)refresh();},60000);const visible=()=>{if(!document.hidden)refresh();};document.addEventListener('visibilitychange',visible);return()=>{clearInterval(t);document.removeEventListener('visibilitychange',visible);};},[refresh]);
 const studio=data?.studio;
 const platforms=(studio?.platforms||[]).filter(p=>platform==='all'||p.key===platform);
 const videos=(studio?.videos||[]).filter(v=>platform==='all'||v.platform===platform);
 const days=(data?.analytics?.days||[]).slice(-period);
 const points=days.map(d=>({label:`${d.date.slice(8)}/${d.date.slice(5,7)}`,value:sum(d.platforms.filter(p=>platform==='all'||p.key===platform).map(p=>p[metric]))}));
 const views=sum(days.map(d=>sum(d.platforms.filter(p=>platform==='all'||p.key===platform).map(p=>p.views))));
 return <Card title="studio" span={12} i={0} className="studio" aside={<button className="studio-refresh" onClick={refresh} disabled={loading}>{loading?'actualisation…':'actualiser ↻'}</button>}>
  <div className="studio-heading"><h3>Vue d’ensemble</h3><span title={stamp(studio?.generated||null)}>mise à jour auto · {age(studio?.generated||null)}</span></div>
  <div className="studio-toolbar"><div className="studio-filters" aria-label="réseau affiché">{[{key:'all',name:'tous'},...channels].map(c=><button key={c.key} aria-pressed={platform===c.key} onClick={()=>{setPlatform(c.key);setExpanded(null);setLimit(8);}}>{c.name}</button>)}</div><select aria-label="période des statistiques" value={period} onChange={e=>setPeriod(Number(e.target.value))}><option value={7}>7 derniers jours</option><option value={28}>28 derniers jours</option></select></div>
  {error&&<p className="studio-warning" role="status">Actualisation indisponible. {data?'Les derniers chiffres restent affichés.':'Réessaie dans un instant.'}</p>}
  <div className="studio-layout"><div className="studio-performance">
   <div className="studio-metrics"><button aria-pressed={metric==='views'} onClick={()=>setMetric('views')}><span>Vues mesurées · {period} j</span><strong>{num(views)}</strong><small>sur les contenus comparables</small></button><button aria-pressed={metric==='followers'} onClick={()=>setMetric('followers')}><span>Abonnés actuels</span><strong>{num(sum(platforms.map(p=>p.followers)))}</strong><small>{platforms.filter(p=>p.followers!=null).length}/{platforms.length||5} réseaux suivis</small></button></div>
   <Chart key={`${platform}-${metric}-${period}`} points={points} label={metric==='views'?'Vues gagnées entre les relevés quotidiens':'Abonnés relevés chaque jour'}/>
   <p className="studio-note">{metric==='views'?'Historique partiel · les nouveaux contenus sans relevé antérieur sont exclus.':'Les jours sans relevé restent vides. Les totaux peuvent couvrir des réseaux différents.'}</p>
  </div><aside className="studio-live"><h4>En ce moment</h4><p className="studio-note">Collecte toutes les {studio?.collectionMinutes||15} min</p>{platforms.map(p=><div className="studio-account" key={p.key}><span><i className={p.ts&&Date.now()/1000-p.ts<1800?'is-fresh':''}/>{channels.find(c=>c.key===p.key)?.name||p.key}<small title={stamp(p.ts)}>{age(p.ts)}{data?.sync[p.key]?.ok===false?' · collecte à réessayer':''}</small></span><strong title={p.approximate?'compteur public potentiellement arrondi':undefined}>{p.approximate?'≈ ':''}{num(p.followers)}</strong></div>)}<p className="studio-note">Abonnés · délais propres aux plateformes</p></aside></div>
  <div className="studio-list-heading"><h3>Dernières publications</h3><span>{videos.length} suivies</span></div>
  {!videos.length?<p className="studio-chart-empty">{loading?'Chargement des publications…':platform==='facebook'||platform==='x'?'Les abonnés sont suivis. Les statistiques des publications ne sont pas encore connectées.':'Aucune publication disponible pour ce réseau.'}</p>:<div className="studio-table-wrap"><table className="studio-table"><thead><tr><th>Contenu</th><th>Vues</th><th>24 h</th><th>J’aime</th><th>Commentaires</th></tr></thead><tbody>{videos.slice(0,limit).map(v=><VideoRow key={v.id} video={v} expanded={expanded===v.id} toggle={()=>setExpanded(expanded===v.id?null:v.id)}/>)}</tbody></table></div>}
  {videos.length>limit&&<button className="studio-more" onClick={()=>setLimit(n=>n+8)}>voir plus</button>}
 </Card>;
}
function VideoRow({ video:v,expanded,toggle }: { video:StudioVideo;expanded:boolean;toggle:()=>void }) {
 return <><tr><td><button className="studio-video" onClick={toggle} aria-expanded={expanded}><Thumb video={v}/><span><strong>{v.title}</strong><small>{v.platform} · {date(v.publishedAt)}</small><small title={stamp(v.measuredAt)}>relevé {age(v.measuredAt)}</small></span></button></td><td>{num(v.views)}</td><td className={v.gain24h!=null&&v.gain24h>0?'studio-positive':''}>{signed(v.gain24h)}</td><td>{num(v.likes)}</td><td>{num(v.comments)}</td></tr>{expanded&&<tr className="studio-video-detail"><td colSpan={5}><div className="studio-detail-heading"><span>{v.lastGain!=null?`${signed(v.lastGain)} vues depuis le relevé du ${stamp(v.previousAt)}`:'Le suivi de cette publication commence.'}</span>{safeLink(v.url)&&<a href={safeLink(v.url)} target="_blank" rel="noreferrer">ouvrir la publication ↗</a>}</div><Chart points={v.history.map(p=>({label:new Date(p.ts*1000).toLocaleString('fr-FR',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit',timeZone:'Europe/Paris'}),value:p.views,at:p.ts}))} label="Vues cumulées à chaque relevé"/></td></tr>}</>;
}
