import { NextResponse } from 'next/server';
import { getDocs, putScriptJob } from '@/lib/adminStore';
import { parseBrief, validJobId } from '@/lib/scriptWriter.mjs';
export const dynamic='force-dynamic';
const json=(body:unknown,status=200)=>NextResponse.json(body,{status,headers:{'Cache-Control':'no-store'}});
export async function GET(req:Request){try{
 const id=new URL(req.url).searchParams.get('id');
 if(id){if(!validJobId(id))return json({error:'Demande invalide.'},400);const d=await getDocs([id]);return d[id]?json({job:d[id]}):json({error:'Demande introuvable.'},404);}
 const d=await getDocs(['editorial-voice']);const voice=d['editorial-voice'] as {corpus?:unknown[]}|null;
 return json({examples:voice?.corpus?.length||0,mode:'codex',intervalMinutes:5});
}catch{return json({error:'Connexion indisponible. Réessaie.'},503);}}
export async function POST(req:Request){
 if(req.headers.get('origin')!==new URL(req.url).origin)return json({error:'Origine refusée.'},403);
 let brief,id;
 try{const body=await req.text();if(body.length>14000)return json({error:'Brief trop long.'},400);const d=JSON.parse(body);brief=parseBrief(d);id=d.id;if(!validJobId(id))return json({error:'Identifiant invalide.'},400);}catch(e){return json({error:e instanceof SyntaxError?'Brief illisible.':(e as Error).message},400);}
 try{
 const existing=(await getDocs([id]))[id];if(existing)return json({job:existing});
 const job={id,...brief,status:'pending',createdAt:new Date().toISOString(),attempts:0};
 await putScriptJob(id,job);return json({job},202);
 }catch{return json({error:'Envoi impossible. Ton sujet est conservé ; réessaie.'},503);}
}
