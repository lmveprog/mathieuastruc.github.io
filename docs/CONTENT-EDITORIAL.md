# matheus — brief éditorial

Objectif : faire grandir une communauté IA, ingénieurs et gens du milieu. La page `/admin#matheus` montre le contenu à publier, pas des instructions de rédaction. Les propositions vivent dans le doc privé `editorial`. Le corpus et l’analyse de la voix vivent dans `editorial-voice` sur le même store.

## avant d’écrire

Lire par SSH `/home/ubuntu/projects/adminstore/store/editorial-voice.json`. Ce document contient cinq transcriptions réelles des vidéos de Matheus et l’analyse de leur écriture. Relire au moins deux transcriptions adaptées au sujet. Elles servent de référence de voix, jamais de preuve factuelle pour une actualité. Ne pas prétendre analyser le montage ou les images à partir des seules transcriptions.

La référence X choisie est https://x.com/BetterCallMedhi/status/2097472336257863722, accessible lors de l’analyse via https://threadreaderapp.com/user/BetterCallMedhi. En retenir l’oralité, les minuscules, le débit continu, la faible ponctuation et les arguments concrets. Les formulations, opinions et vérifications doivent être originales. Le message de référence comporte des affirmations à contrôler : ne jamais importer automatiquement sa conclusion sur les mathématiques ou une accusation.

## sur X

Deux posts originaux en français, généralement 90–160 mots chacun. L’utilisateur a explicitement demandé une écriture brute, peu structurée en apparence, presque sans ponctuation. Pas de limite arbitraire à 280 caractères. Minuscules, 1–3 paragraphes de longueurs différentes, phrases qui s’enchaînent comme un avis développé à l’oral. Garder les apostrophes, accents et notations utiles. Pas de faux défauts ajoutés exprès.

Commencer par quelque chose à défendre, donner des éléments précis, aller au bout du raisonnement. Ne pas afficher un plan fait / mécanisme / conséquence / opinion. Éviter les conclusions de consultant, la question d’engagement finale, le résumé neutre, le jargon gratuit et les insultes prises à la référence. Ne jamais inventer une expérience vécue, une certitude ou une accusation pour avoir un ton fort. Un style libre peut soutenir une pensée rigoureuse.

Tout le post est dans `text`. Pas de version raccourcie doublée d’un développement caché. Ne pas publier sur X automatiquement.

## en vidéo

Quatre sujets, trois si seulement trois sont solides. Pour chacun, `title` sert uniquement à choisir le sujet ; `text` contient uniquement le script parlé complet, généralement 150–210 mots. La première phrase est directement l’accroche. Écrire le texte que Matheus peut lire face caméra, avec des paragraphes qui laissent respirer.

Retenir ce qui est observé dans ses vidéos : tutoiement, accroche directe, explication accessible, exemple concret, précision sur la limite. Connecteurs naturels comme « en gros », « imagine », « donc », « mais attention », sans les placer mécaniquement. Ponctuation normale pour les scripts vidéo. Le ton sans ponctuation concerne X seulement. Adapter la construction au sujet, ne pas forcer une leçon technique sur une démission ou une controverse.

Aucun timecode, aucune consigne « montrer / filmer / ton avis », aucun titre hook / angle / déroulé / CTA, aucun résumé ajouté au script. Ne pas promettre de guide ou de lien envoyé en commentaire si la ressource et sa distribution n’existent pas. Ne pas prétendre avoir essayé un produit inaccessible. Même script pour Instagram, TikTok, Facebook et YouTube ; pas de vidéo sur X.

## choisir les sujets chaque matin

1. Commencer par les discussions qui montent sur X, Hacker News et dans la presse spécialisée. Remonter aux sources primaires et les lire. Priorité aux dernières 24–48 h, en contrôlant date du fait et date de publication. Les repères de pertinence donnés par Matheus le 9 septembre sont Navier–Stokes et la démission de Jacob Coxon : percées, controverses et décisions humaines qui font parler le milieu IA. Ne pas réduire la veille aux sorties de produits.
2. Classer par traction observable, fraîcheur et intérêt narratif. Conserver un signal daté par vidéo dans `trend: { label, url?, checkedAt }`. Une annonce seule n’est pas une preuve de viralité ; indiquer si le signal est faible ou manque. Ne pas inventer de métriques. Ces notes restent dans les données, hors du script et de l’affichage principal.
3. Distinguer résultat annoncé, validation indépendante, hypothèse et opinion. Pour une controverse, confronter la déclaration au document original et à une source contradictoire pertinente. Ne jamais appeler « arnaque » un résultat parce qu’un compte influent le fait.
4. Comparer à `editorial.json` et `editorial-history/` pour éviter les répétitions. Une édition ancienne conserve sa date réelle. Ne pas remplir avec des releases mineures ou de faux sujets du jour.
5. Lire tous les scripts à voix haute mentalement : peuvent-ils être dits tels quels ? Chaque post X défend-il une idée concrète avec une écriture naturelle ? Retirer les phrases génériques qui pourraient se coller à n’importe quelle annonce.

## format privé et publication

`editorial` contient `day` (YYYY-MM-DD Paris), `generated` (ISO-8601), `x` et `video`.

Chaque proposition contient `id` unique (par exemple `video-YYYY-MM-DD-sujet-v3`), `day`, `kind`, `edition: "voice-v3"`, `title`, `text`, `source` (HTTPS), `sourceDate` si connue, `done: false`. Les vidéos contiennent aussi `published: []` et `trend`. Ne pas inventer une date pour une source historique. Aucun `detail` en v3. Maximum technique : 6000 caractères par texte ; privilégier les budgets éditoriaux ci-dessus.

Valider puis publier avec `python3 scripts/publish-editorial.py CHEMIN_JSON`. Le script conserve l’édition précédente dans `editorial-history/` et remplace `editorial.json` atomiquement. Vérifier la relecture. Ne jamais modifier `content` : brouillons, modifications et statuts de publication appartiennent à l’utilisateur. Une réécriture change l’identifiant pour ne pas masquer un brouillon sauvegardé.

## routine

Routine quotidienne à 7 h Europe/Paris, attachée à la tâche utilisant `gpt-6-astra`, identifiant `pr-parer-le-contenu-quotidien-de-matheus`. Quatre scripts vidéo et deux posts X. Elle dépend de la disponibilité de Codex et du Mac. Les mises à jour normales restent silencieuses. Pas de publication sociale automatique.
