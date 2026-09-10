import { NextResponse } from 'next/server';
import { getDocs, putScriptConfig } from '@/lib/adminStore';
import { MODEL, seal, unseal, parseBrief, prompt, schema, parseOutput } from '@/lib/scriptWriter.mjs';
export const dynamic='force-dynamic';
export const runtime='nodejs';
export const maxDuration=300;
const json=(body:unknown,status=200)=>NextResponse.json(body,{status,headers:{'Cache-Control':'no-store'}});
function sameOrigin(req:Request){return req.headers.get('origin')===new URL(req.url).origin;}
async function key(){
 if(process.env.OPENAI_API_KEY)return process.env.OPENAI_API_KEY;
 const d=await getDocs(['script-config']);
 const c=d['script-config'] as {encryptedKey?:string}|null;
 return c?.encryptedKey?unseal(c.encryptedKey,process.env.ADMIN_STORE_TOKEN||''):'';
}
export async function GET(){try{
 const d=await getDocs(['editorial-voice']);const voice=d['editorial-voice'] as {corpus?:{name:string}[]}|null;
 return json({configured:!!await key(),model:MODEL,examples:voice?.corpus?.length||0});
}catch{return json({error:'Connexion indisponible. Réessaie.'},503);}}
export async function PUT(req:Request){
 if(!sameOrigin(req))return json({error:'Origine refusée.'},403);
 try{
 const body=await req.text();if(body.length>2000)return json({error:'Clé invalide.'},400);
 const d=JSON.parse(body);if(typeof d.apiKey!=='string'||!/^sk-[A-Za-z0-9_-]{20,}$/.test(d.apiKey.trim()))return json({error:'Vérifie ta clé API OpenAI.'},400);
 const candidate=d.apiKey.trim();
 const check=await fetch(`https://api.openai.com/v1/models/${MODEL}`,{headers:{Authorization:`Bearer ${candidate}`},signal:AbortSignal.timeout(15000),cache:'no-store'});
 if(!check.ok)return json({error:check.status===401?'Cette clé est refusée par OpenAI.':`Cette clé n’a pas accès à ${MODEL}. Vérifie les permissions du projet OpenAI.`},400);
 await putScriptConfig({encryptedKey:seal(candidate,process.env.ADMIN_STORE_TOKEN||'')});
 return json({configured:true});
 }catch{return json({error:'Connexion impossible. La clé n’a pas été enregistrée.'},503);}
}
export async function DELETE(req:Request){
 if(!sameOrigin(req))return json({error:'Origine refusée.'},403);
 try{if(process.env.OPENAI_API_KEY)return json({error:'La clé est configurée sur le serveur.'},409);await putScriptConfig({});return json({configured:false});}catch{return json({error:'Déconnexion impossible.'},503);}
}
let active=false;
export async function POST(req:Request){
 if(!sameOrigin(req))return json({error:'Origine refusée.'},403);
 if(active)return json({error:'Un script est déjà en préparation. Patiente un instant.'},429);
 let brief;
 try{const body=await req.text();if(body.length>14000)return json({error:'Brief trop long.'},400);brief=parseBrief(JSON.parse(body));}catch(e){return json({error:e instanceof SyntaxError?'Brief illisible.':(e as Error).message},400);}
 active=true;
 try{
 const apiKey=await key();if(!apiKey)return json({error:'Connecte ta clé API OpenAI pour générer ton script.'},428);
 const docs=await getDocs(['editorial-voice']);
 const r=await fetch('https://api.openai.com/v1/responses',{method:'POST',headers:{Authorization:`Bearer ${apiKey}`,'Content-Type':'application/json'},body:JSON.stringify({model:MODEL,store:false,instructions:prompt(docs['editorial-voice']),input:JSON.stringify(brief),tools:[{type:'web_search'}],tool_choice:'required',max_tool_calls:5,reasoning:{effort:'medium'},max_output_tokens:6000,text:{format:{type:'json_schema',name:'video_script',strict:true,schema}}}),signal:AbortSignal.timeout(240000)});
 if(!r.ok)return json({error:r.status===401?'Clé API refusée. Reconnecte OpenAI.':r.status===429?'Crédit ou limite API atteinte. Vérifie ton compte OpenAI.':r.status===403||r.status===404?'Astra est indisponible pour cette clé API.':'OpenAI est indisponible. Ton texte est conservé.'},502);
 return json(parseOutput(await r.json()));
 }catch(e){return json({error:(e as Error).name==='TimeoutError'?'La génération a pris trop de temps. Ton texte est conservé.':'Le script n’a pas pu être généré. Précise ton sujet et réessaie.'},503);}finally{active=false;}
}
