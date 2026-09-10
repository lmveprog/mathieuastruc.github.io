import test from 'node:test';
import assert from 'node:assert/strict';
import {parseBrief,validJobId,validateResult} from '../../src/lib/scriptWriter.mjs';
test('validation des briefs et URLs dangereuses',()=>{const b={topic:'Le computer use',duration:60};assert.equal(parseBrief(b).topic,b.topic);for(const patch of [{duration:999},{topic:'abc'},{source:'javascript:alert(1)'},{source:'https://user:password@example.com'},{previous:'x'.repeat(6001)}])assert.throws(()=>parseBrief({...b,...patch}));});
test('la file ne peut écrire dans un autre document',()=>{assert(validJobId('sj-'+'a'.repeat(28)));for(const id of ['editorial','script-config','../content','sj-foo'])assert(!validJobId(id));});
test('un résultat sans source ou sans texte ne devient pas un script',()=>{const d={title:'Test',script:'Texte',sources:[{title:'Source',url:'https://example.com/'}],note:''};assert.equal(validateResult(d).script,'Texte');assert.throws(()=>validateResult({...d,script:''}));assert.throws(()=>validateResult({...d,sources:[{title:'X',url:'javascript:alert(1)'}]}));});
