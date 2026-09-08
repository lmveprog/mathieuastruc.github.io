// une voix de praticien : montrer une preuve, expliquer le compromis, ouvrir la discussion.
export const channels = [
  { key: 'instagram', name: 'instagram', handle: 'matheusgen_', url: 'https://www.instagram.com/matheusgen_/' },
  { key: 'x', name: 'X', handle: 'matheusnpu', url: 'https://x.com/matheusnpu' },
  { key: 'tiktok', name: 'tiktok', handle: 'matheusgen', url: 'https://www.tiktok.com/@matheusgen' },
  { key: 'facebook', name: 'facebook', handle: 'matheusgen', url: 'https://www.facebook.com/matheusgen' },
  { key: 'youtube', name: 'youtube', handle: 'matheusgen', url: 'https://www.youtube.com/@matheusgen' },
] as const;
export type Channel = typeof channels[number]['key'];
export type DailyMetric = { key: Channel; handles: string[]; followers: number | null; delta: number | null; views: number | null; compared: number; observed: number; ts: number | null };
export type Analytics = { generated: number; days: { date: string; platforms: DailyMetric[] }[] };
export type Draft = { id: string; day: string; kind: 'x' | 'video'; title: string; text: string; source?: string; sourceDate?: string; done: boolean; published?: string[] };
const topics = [
 ['Un agent qui sait s’arrêter', 'À quel moment votre agent doit-il demander de l’aide plutôt que réessayer ? Je trouve cette décision plus intéressante que le nombre d’outils qu’on lui branche. Vous posez quelle limite ?', 'Donner une tâche à un agent, montrer une boucle qui échoue, puis ajouter un budget et une sortie vers un humain.'],
 ['La démo contre le cas réel', 'Une démo IA réussie me donne envie de voir les cas qui échouent. Vous gardez quel test difficile pour décider si un nouvel outil mérite sa place dans votre workflow ?', 'Prendre une tâche de ton quotidien, montrer le cas facile puis un cas ambigu. Afficher le résultat réel, même raté.'],
 ['Le coût d’une bonne réponse', 'Pour choisir un modèle, vous mesurez le coût par requête ou le coût par tâche vraiment réussie ? Les retries et la vérification humaine peuvent changer le verdict.', 'Comparer deux modèles sur une même petite tâche. Chronométrer aussi la correction, puis montrer coût, temps et résultat.'],
 ['Le contexte avant le prompt', 'Quand un assistant de code se trompe, je veux distinguer deux choses : une consigne floue ou une information manquante. Comment vous rendez le contexte du projet accessible sans tout lui envoyer ?', 'Filmer une réponse sans contexte, ajouter le fichier utile, comparer. Expliquer précisément ce que tu as changé.'],
 ['Une évaluation minuscule', 'Quel est votre plus petit jeu de tests utile pour une fonctionnalité IA ? Je partirais de cas réels et de quelques pièges, puis je regarderais les régressions à chaque changement.', 'Construire cinq cas réels à l’écran, tester une modification et afficher les réussites comme les échecs.'],
 ['Le droit de ne pas automatiser', 'Quelle tâche avez-vous essayé d’automatiser avec l’IA avant de revenir en arrière ? Le temps de supervision est un coût qu’on voit rarement dans les démos.', 'Choisir une vraie friction de ta journée. Montrer une tentative, le coût de contrôle et ta décision personnelle.'],
 ['Comprendre en construisant', 'Quel concept IA avez-vous vraiment compris en construisant un petit projet ? Je cherche les expériences qui font mieux comprendre une limite qu’une dizaine de slides.', 'Expliquer un concept avec un mini-projet qui tourne : un écran, une manipulation, une limite visible.'],
];
export function dailyDraft(day: string, kind: 'x' | 'video'): Draft {
 const index = Math.floor(Date.parse(day+'T12:00:00Z') / 86400000) % topics.length;
 const [title, tweet, demo] = topics[index];
 return { id: `${kind}-${day}`, day, kind, title, done: false,
 text: kind === 'x' ? tweet : `ACCROCHE · ${title}. Voici le test que je veux faire.\n\nDÉMO · ${demo}\n\nVERDICT · Ce qui marche, ce qui bloque, et ce que je ferais ensuite. À remplir après le test.\n\nQUESTION · Comment tu traites ce problème dans ton travail ?\n\nFORMAT · 35–60 s, face caméra + capture du vrai test. Même montage sur Instagram, TikTok, Facebook et YouTube.` };
}
