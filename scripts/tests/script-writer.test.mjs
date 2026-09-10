import test from 'node:test';
import assert from 'node:assert/strict';
import {seal,unseal,parseBrief,parseOutput,prompt} from '../../src/lib/scriptWriter.mjs';
test('clé chiffrée authentifiée, aléatoire et non récupérable avec un autre secret',()=>{
 const a=seal('secret-api','master'),b=seal('secret-api','master');assert.notEqual(a,b);assert(!a.includes('secret-api'));assert.equal(unseal(a,'master'),'secret-api');assert.throws(()=>unseal(a,'other'));assert.throws(()=>seal('secret',''));
});
test('validation des briefs et URLs dangereuses',()=>{
 const b={topic:'Le computer use',duration:60};assert.equal(parseBrief(b).topic,b.topic);for(const patch of [{duration:999},{topic:'abc'},{source:'javascript:alert(1)'},{source:'https://user:password@example.com'},{previous:'x'.repeat(6001)}])assert.throws(()=>parseBrief({...b,...patch}));
});
test('ne retourne pas un script partiel ou sans source ; accepte une demande de précision',()=>{
 const response=d=>({status:'completed',output:[{type:'message',content:[{type:'output_text',text:JSON.stringify(d)}]}]});
 const d={title:'Test',script:'Texte',sources:[{title:'Source',url:'https://example.com/'}],note:''};
 assert.equal(parseOutput(response(d)).script,'Texte');assert.throws(()=>parseOutput({...response(d),status:'incomplete'}));assert.throws(()=>parseOutput(response({...d,sources:[{title:'X',url:'javascript:alert(1)'}]})));assert.equal(parseOutput(response({...d,script:'',sources:[],note:'Quel modèle ?'})).note,'Quel modèle ?');
});
test('profil obligatoire et corpus considéré comme référence de langue uniquement',()=>{assert.throws(()=>prompt(null));assert.match(prompt({video:{},corpus:[{transcript:'exemple privé'}]}),/jamais une source factuelle/);});
