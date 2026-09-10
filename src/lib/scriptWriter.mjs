export function parseBrief(data) {
 if (!data || typeof data.topic!=='string' || data.topic.trim().length<8 || data.topic.length>2500) throw new Error('Décris ton sujet en 8 à 2 500 caractères.');
 if (![45,60,90].includes(data.duration)) throw new Error('Choisis une durée de 45, 60 ou 90 secondes.');
 if (data.source && (typeof data.source!=='string' || data.source.length>2000 || !https(data.source))) throw new Error('Le lien source doit commencer par https://.');
 if (data.previous && (typeof data.previous!=='string' || data.previous.length>6000)) throw new Error('Le script est trop long.');
 if (data.direction && (typeof data.direction!=='string' || data.direction.length>1000)) throw new Error('La consigne est trop longue.');
 return {topic:data.topic.trim(),duration:data.duration,source:data.source||'',previous:data.previous||'',direction:data.direction||''};
}
export function https(value) {try {const u=new URL(value);return u.protocol==='https:'&&!u.username&&!u.password;}catch{return false;}}
export function validJobId(id) { return typeof id === 'string' && /^sj-[a-f0-9]{28}$/.test(id); }
export function validateResult(data) {
 if (!data || typeof data.title !== 'string' || typeof data.script !== 'string' || typeof data.note !== 'string' || !Array.isArray(data.sources) || data.script.length > 6000 || !data.script.trim()) throw new Error('Script incomplet.');
 const sources=data.sources.filter(s=>typeof s.title==='string'&&https(s.url)).slice(0,6);
 if(!sources.length)throw new Error('Source requise.');
 return {title:data.title.slice(0,140),script:data.script.trim(),note:data.note.slice(0,1000),sources};
}
