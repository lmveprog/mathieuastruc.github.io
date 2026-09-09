# matheus — brief éditorial

Objectif : une communauté de gens qui construisent avec l’IA, ingénieurs et professionnels du secteur. La page `/admin#matheus` doit rester simple. Le contenu du jour vit dans le doc privé `editorial`, jamais dans le code public.

## ce qui a été rejeté

Les titres de releases GitHub suivis de « vous en pensez quoi ? », les sujets techniques interchangeables, les listes de bonnes pratiques, le ton formateur LinkedIn et les énormes plans vidéo. Ne pas recycler les sept anciens gabarits. Une nouvelle version d’Ollama n’est pas un sujet par défaut.

## la voix

Une position compréhensible et discutable, défendue par un mécanisme concret. Relier une annonce à une conséquence pour ceux qui construisent : dépendance à un fournisseur, coût de vérification, valeur d’une compétence, contrôle du matériel, distribution, capacité à livrer. Précis, oral, personnel, sans leçon ni mise en scène de supériorité.

Référence choisie : BetterCallMedhi. Les posts consultés via Thread Reader et des reprises accessibles montrent une structure fait → explication → conséquence → avis. Retenir cette construction ; écrire des formulations originales. Ne pas emprunter sa biographie, ses expressions récurrentes, ses certitudes géopolitiques ou ses affirmations non vérifiées. Ne jamais raconter une expérience que Matheus n’a pas faite.

Références de lecture (analyse de structure uniquement, pas sources factuelles) :
- https://threadreaderapp.com/user/BetterCallMedhi
- https://x.com/BetterCallMedhi/status/2026466690574463291

## chaque jour

1. Commencer par les discussions qui montent réellement sur X, Hacker News et dans la presse spécialisée, puis remonter aux sources. Les références de pertinence données par Matheus le 9 septembre sont Navier–Stokes et la démission de Jacob Coxon : grandes percées, controverses et décisions humaines qui font parler le milieu IA. Ne pas réduire la veille à des sorties de produits ou à des tutoriels de développeur. Classer les sujets par traction, fraîcheur et intérêt narratif. Lire des sources primaires récentes (24–72 h idéalement, une semaine si le fond le justifie) : annonces majeures, recherches, infrastructure, produits ayant une vraie conséquence. Lire le contenu de la source, pas seulement son titre. Contrôler date de publication ET date du fait. Ne pas transformer une promesse marketing en résultat établi.
2. Choisir un sujet principal et un autre angle réellement différent. La thèse doit pouvoir être contestée ; un simple résumé ne suffit pas. Distinguer fait attesté et interprétation proposée. Pas de statistiques inventées, d’annonce ancienne présentée comme nouvelle, ni d’extrapolation « tout le monde sera remplacé ».
3. Écrire 2 propositions X : `text` <= 280 caractères, autonome, 2–3 petits paragraphes ; `detail` développe le raisonnement en 80–150 mots maximum, disponible au clic. Lien primaire et date dans `source` / `sourceDate`, hors du texte à copier. Éviter la question de fin automatique.
4. Relever pour chaque sujet vidéo un signal de traction public, daté, avec URL (discussion, score observé, reprises indépendantes). Une annonce seule ne prouve pas une tendance. Indiquer clairement un signal faible ou absent. Enregistrer cela dans `trend: { label, url?, checkedAt }`. Ne pas inventer des métriques de viralité. Écrire 4 sujets vidéo distincts (3 si seulement 3 sont solides) : titre = accroche précise, `text` = une phrase sur ce qu’on va montrer (350 caractères maximum), `detail` = 3 temps de tournage concrets en 60–100 mots. Faire comprendre une tension en montrant quelque chose. Même vidéo sur Instagram, TikTok, Facebook, YouTube ; pas de vidéo X. Ne pas confondre idée de tournage et résultat déjà obtenu. Références utilisateur : chrispathway, becoming.lea, consti.in.tech, avec son propre vécu comme matière.
5. Comparer les propositions aux jours précédents dans le store ; éviter les répétitions. Si aucune actualité ne mérite un avis, proposer un sujet de fond explicitement daté comme édition, sans fausse fraîcheur. Ne jamais remplir avec une release mineure pour respecter une cadence.
6. Publier seulement dans le dashboard privé avec `python3 scripts/publish-editorial.py CHEMIN_JSON`. Cela ne publie aucun tweet, vidéo, commentaire ou message. Ne jamais modifier le doc `content` : les brouillons et statuts utilisateur doivent rester intacts.

## format privé

```json
{
  "day": "YYYY-MM-DD",
  "generated": "ISO-8601",
  "x": [{
    "id": "x-YYYY-MM-DD-sujet-v2",
    "day": "YYYY-MM-DD",
    "kind": "x",
    "edition": "opinion-v2",
    "title": "sujet court",
    "text": "prise de position originale",
    "detail": "raisonnement développé",
    "source": "https://source-primaire.exemple/article",
    "sourceDate": "YYYY-MM-DD",
    "done": false
  }],
  "video": [{
    "id": "video-YYYY-MM-DD-sujet-v2",
    "day": "YYYY-MM-DD",
    "kind": "video",
    "edition": "opinion-v2",
    "title": "accroche",
    "text": "ce qu’on va montrer",
    "detail": "3 temps de tournage",
    "done": false,
    "published": []
  }]
}
```

Le script valide les tailles et types, conserve l’ancienne édition dans `store/editorial-history/`, puis remplace atomiquement `store/editorial.json`. Le serveur lit ce doc via `getDocs(['editorial'])`. Une édition ancienne affiche sa date réelle. Aucun gabarit ne se fait passer pour une actualité générée.

## renouvellement à 7 h

Routine Codex quotidienne à 7 h Europe/Paris, attachée à la tâche actuelle qui utilise `gpt-6-astra`. Elle hérite du modèle de cette tâche : ne pas changer ce modèle si Astra doit continuer à préparer les sujets. Cette routine dépend de la disponibilité de Codex et du Mac ; ce n’est pas un cron Vercel. Identifiant : `pr-parer-le-contenu-quotidien-de-matheus`. Quatre vidéos (trois si nécessaire), deux avis X. Pas de publication sociale automatique.
