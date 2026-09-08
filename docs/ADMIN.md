# /admin — mon tableau de bord perso

tout ce qu'il faut savoir sur mathieuastruc.com/admin : comment c'est branché, où vivent les données, comment ajouter une carte. écrit le 9 septembre 2026, après la première soirée de construction.

## en deux mots

- une page privée sur le portfolio (next.js 14, app router, vercel). même DA que le site : papier chaud, computer modern + mondwest, cartes glass, dark mode. le fond est différent de l'accueil : trois halos flous qui dérivent + une trame de points (`Backdrop.tsx`, css pur).
- **deux faces** : `mathieu astruc · perso / pro` et `matheus · content`. switch en haut à gauche, retenu en localStorage, `#mathieu` / `#matheus` dans l'url.
- les deux faces sont construites. la face matheus rassemble analytics et atelier éditorial (9 septembre 2026).

## arborescence

```
src/
  middleware.ts                 garde /admin et /api/admin (cookie signé) + /matheus (basic auth)
  lib/
    adminAuth.ts                cookie hmac (web crypto, marche en edge et en node)
    adminStore.ts               client du store json sur le vps (jeton bearer)
    agenda.ts                   loadAgenda() : google (apps script) sinon ics
    gcal.ts                     appels à l'apps script (lecture / création / suppression)
    ics.ts                      lecteur ics maison (récurrences, exdate, recurrence-id)
  app/admin/
    layout.tsx                  noindex + admin.css
    page.tsx                    rend AdminDashboard
    login/page.tsx              formulaire de mot de passe
    admin.css                   tout le style de l'admin
    components/
      AdminDashboard.tsx        le cadre : switch des faces, accroche, grille, save() vers le store
      Backdrop.tsx              le fond
      Card.tsx                  une carte de la grille (titre décrypté, largeur en colonnes /12)
      types.ts                  les docs du store (todos, habits, notes, config, content, money)
      helpers.ts                dates paris, semaine, mois, euros
      cards/
        WeekTodos.tsx           todo de la semaine
        Mail.tsx                gmail (imap)
        Agenda.tsx              google agenda (lecture + ajout + suppression)
        Money.tsx               dépenses, un mois à la fois
  app/api/admin/
    login/  logout/             session
    store/  store/[key]/        lecture groupée / écriture d'un doc
    overview/                   météo + visiteurs + lab + agenda, en un appel
    agenda/                     GET (frais) / POST (créer) / DELETE (supprimer)
    mail/                       imap gmail, cache 3 min
docs/
  agenda.gs                     le script google apps script à déployer
  ADMIN.md                      ce fichier
```

## auth

- mot de passe = variable `ADMIN_PW` sur vercel. pas de valeur par défaut dans le code (repo public) : sans la variable, le login répond 503.
- après login, cookie `ma_admin` = `expiration.signature` (hmac sha-256 avec `ADMIN_SECRET`, ou `ADMIN_PW` à défaut), httpOnly, 30 jours. changer `ADMIN_SECRET` déconnecte tout le monde.
- le middleware redirige `/admin/*` vers `/admin/login` sans cookie valide, et répond 401 sur `/api/admin/*`.
- `/admin` est `noindex` (metadata + en-tête `X-Robots-Tag`), `Cache-Control: no-store`, et exclu dans `robots.txt`.

## les données : le store sur le vps

vercel n'a pas de disque, et je ne voulais pas d'une base pour quelques fichiers json. donc un micro-service node sur mon vps :

- `ssh ubuntu@149.202.61.220`, dossier `~/projects/adminstore/`, `server.js` sans dépendance, pm2 `adminstore`, port 8480 en local, nginx `location /api/admin-store/` sur lavalley.xyz.
- jeton dans `~/projects/adminstore/token` (0600). le même jeton est dans `ADMIN_STORE_TOKEN` sur vercel. **seul le serveur next l'utilise**, jamais le navigateur.
- un doc = un fichier `store/<clé>.json`. clés autorisées côté site (`DOC_KEYS` dans `adminStore.ts`) : `todos`, `habits`, `notes`, `config`, `content`, `money`.
- routes du service : `GET docs?keys=a,b`, `GET|PUT doc/<clé>`, `GET lab` (extrait de `hub.json` du lab matheusgen : abonnés, mes contenus, veille), `GET guests` (compteur de visiteurs du portfolio + uniques du jour).
- côté site : `GET /api/admin/store?keys=…` (groupé) et `PUT /api/admin/store/<clé>` (remplace le doc entier ; ils sont petits). `save()` dans `AdminDashboard` fait l'écriture, avec un délai pour les champs texte.

pour lire ou modifier un doc à la main :

```sh
TOKEN=$(ssh ubuntu@149.202.61.220 cat projects/adminstore/token)
curl -H "Authorization: Bearer $TOKEN" https://lavalley.xyz/api/admin-store/doc/money
```

## variables d'environnement (vercel, production)

| variable | rôle |
|---|---|
| `ADMIN_PW` | mot de passe du login |
| `ADMIN_SECRET` | (option) clé de signature du cookie, sinon `ADMIN_PW` |
| `ADMIN_STORE_TOKEN` | jeton du store sur le vps |
| `ADMIN_GAS_URL` | url `/exec` de l'apps script google (agenda lecture + écriture) |
| `ADMIN_GAS_SECRET` | la même clé que `SECRET` dans le script |
| `ADMIN_ICS_URL` | (repli) adresses ics secrètes google, séparées par des virgules, lecture seule |
| `ADMIN_GMAIL_USER` | adresse gmail |
| `ADMIN_GMAIL_APP_PW` | mot de passe d'application google (imap) |

toute modification de variable demande un **redeploy** (deployments → ⋯ → redeploy). en local, `.env.local` (ignoré par git) avec au minimum `ADMIN_PW` et `ADMIN_STORE_TOKEN`.

## la face mathieu, carte par carte

**accroche** (`ProfileCard` du site) : bonjour / bonsoir + prénom (ripple `LiquidText`), date, heure de paris en direct, météo open-meteo (ville dans `config.weather`, paris par défaut).

**todo de la semaine** — doc `todos` : `{ items: [{ id, text, done, created, day }] }`. sept colonnes lundi → dimanche, « + » sous un jour, clic pour cocher, × pour retirer. ce qui n'est pas fait avant le lundi remonte dans « en retard » avec « → auj. ». les tâches faites depuis plus de deux semaines sont purgées à la prochaine écriture.

**mails** — `/api/admin/mail` ouvre une connexion imap (`imapflow`) sur `INBOX`, prend les non-lus, marque « important » ceux qui portent `\Important` ou `\Starred`. résultat gardé 3 min par instance. la carte affiche le nombre de non-lus, une ligne « n importants à regarder », la liste (importants en tête, point bleu). se rafraîchit toutes les 3 min.

**agenda** — `loadAgenda()` prend google si `ADMIN_GAS_URL` + `ADMIN_GAS_SECRET` sont posés, sinon l'ics (lecture seule, en retard de quelques heures côté google). fenêtre = aujourd'hui + 7 jours, groupé par jour, heures de paris, tous les agendas cochés dans google agenda. en mode google : bouton « + ajouter à l'agenda » (titre, date, journée ou heures, lieu) et × sur les événements de l'agenda principal.

le script (`docs/agenda.gs`) : `doGet` liste les événements entre `from` et `to`, `doPost` crée / supprime dans l'agenda principal. déploiement : script.google.com → nouveau projet → coller → déployer → application web → exécuter en tant que moi → accès tout le monde → copier l'url `/exec`. la clé dans le fichier commité est un placeholder : la vraie est dans le script déployé et dans vercel. ⚠️ en ligne de commande, ne pas forcer `-X POST` avec `-L` : apps script répond par une redirection, et curl la re-POSTe. node `fetch` avec `redirect: "follow"` est le bon chemin.

**dépenses** — doc `money` : `{ entries: MoneyEntry[], recurring: Recurring[] }`.
- `MoneyEntry` = `{ id, date, label, amount, kind: "in" | "out", category }` : un mouvement ponctuel.
- `Recurring` = `{ id, label, amount, kind, category, day, every: "month" | "year", month?, since?, until?, source?, cancelUrl? }` : un fixe qui se compte tout seul chaque mois (ou chaque année) entre `since` et `until` (mois `yyyy-mm`, inclus).
- la carte montre **un mois à la fois** : gagné / dépensé (dont fixes) / reste (+ euros par jour jusqu'à la fin du mois en cours), à gauche les fixes du mois triés par jour de prélèvement (passés grisés, aujourd'hui en bleu, lien « résilier ↗ » si `cancelUrl`, sinon « paypal ↗ » si `source` = paypal, × = arrêter, ce qui pose `until` au mois précédent et garde l'historique), à droite les mouvements du mois et le formulaire (case « chaque mois » = crée un fixe au lieu d'une ligne).
- les fixes de départ viennent de la lecture de mes paiements automatiques paypal (page paiements automatiques + transactions de l'année), complétés à la main (loyer, box, salaire, outils payés par carte). paypal ne voit pas ce qui passe par carte.

## conventions

- commentaires en français, minuscules, voix humaine. commits pareil, auteur lmveprog, pas de trailer.
- une carte = `<article className="card">` via `Card.tsx`, **jamais `<section>`** dans l'admin : le css du site donne une marge à toutes les sections.
- les données perso (dates, liens, montants) vivent dans le store, pas dans le code : le repo est public.
- les secrets ne passent jamais par le code ni par un formulaire rempli par claude : je les colle moi-même dans vercel.
- pour vérifier une modif : `npm run build`, puis `npx next start -p 3789`, login local avec le `ADMIN_PW` de `.env.local`, et une capture playwright (`playwright-core` est dans `~/Documents/projets/impostralv3/node_modules`, `channel: "chrome"`). une capture avant / après plutôt qu'une description.

## ajouter une carte

1. un composant dans `components/cards/`, qui reçoit ses données et une fonction `onChange` (le doc entier), et rend `<Card title span i>`.
2. si elle a besoin d'un nouveau doc : ajouter la clé dans `DOC_KEYS` (`adminStore.ts`), le type + la valeur vide dans `types.ts`.
3. si elle lit une source externe : un bloc de plus dans `/api/admin/overview` (avec `Promise.allSettled`, chaque bloc peut manquer sans casser les autres) ou une route dédiée si c'est lent.
4. la poser dans la grille de la bonne face dans `AdminDashboard.tsx` (`span` = largeur sur 12, `i` = ordre d'apparition).
5. build, capture, push.

## la face matheus (content) — sources historiques

ce qui existe déjà pour l'alimenter, sans rien brancher de plus :

- `GET lab` du store = `hub.json` du lab matheusgen (relevé 2× par jour à 6 h et 18 h sur le vps) : `abonnes` (séries par plateforme : tiktok, instagram, youtube, facebook, x), `mes_contenus` (mes posts avec vues / likes / commentaires / vitesse), `veille` (ce que les comptes suivis ont publié sur 24 h), `base` (compteurs de la base).
- `GET guests` = visiteurs du portfolio.
- `/api/admin/overview` renvoie déjà `audience` (abonnés, deltas 24 h / 7 j, sparkline 14 jours), `contents` (top vues / ce qui bouge) et `veille` (top 6 par vues).
- doc `content` = `{ ideas: [] }`, prévu pour les idées à publier.
- la v1 (avant la remise à zéro) avait des cartes audience / contenus / veille / à publier / raccourcis : elles sont dans l'historique git, commit `dbbe430`, `src/app/admin/components/widgets.tsx`.


## face matheus : version du 9 septembre 2026

la page est `/admin#matheus`. `ContentWorkspace.tsx` remplace la carte vide et réutilise le store privé `content` sans supprimer les anciennes `ideas`.

### comptes

instagram **@matheusgen_** (underscore confirmé), X **@matheusnpu**, tiktok / facebook / youtube **@matheusgen**. le lab identifie la page facebook par son id natif ; les liens de navigation utilisent les handles publics.

### analytics simples

- sélection du jour (hier par défaut), abonnements cumulés, variation des abonnés, vues gagnées, détail des cinq réseaux et historique 30 jours ; date civile de Paris.
- `scripts/admin-analytics.py` lit la base SQLite du lab en lecture seule et produit le doc privé `analytics`. installé dans `~/projects/adminstore/`, appelé après `publish.py` par le cron existant du lab (6 h / 18 h, fuseau du serveur). aucune donnée analytics dans le dossier public du site.
- pour chaque jour, dernier relevé d’abonnés et dernière mesure de chaque contenu. variation = différence avec la veille ; pas de veille, pas de delta. vues = somme des différences des contenus présents les deux jours. les nouveaux contenus sans mesure la veille sont exclus, les corrections négatives sont conservées. ce sont des écarts entre relevés, pas les statistiques officielles minuit–minuit.
- couverture affichée : contenus comparables / contenus mesurés. les vues ne couvrent pas forcément tout le compte. les totaux affichent le nombre de plateformes disponibles ; ne pas les présenter comme complets si une source manque. les abonnements ne sont pas des personnes dédupliquées.
- état constaté : vues comparables sur tiktok et youtube ; pas de mesures de vues Facebook/X dans la base ; dernier relevé Instagram au 27 août. les données manquantes restent `—`, avec le dernier relevé connu à côté. il faudra une source autorisée de statistiques Facebook/X et rétablir la collecte Instagram pour avoir les cinq plateformes à jour.
- `/api/admin/overview` lit ce doc via `getAnalytics()`. la clé n’est volontairement pas ajoutée à `DOC_KEYS` : le navigateur ne doit pas remplacer cet export.

### un brouillon X par jour

`GET /api/admin/content` consulte les releases officielles GitHub de transformers, vLLM et Ollama (timeout 7 s, cache de source 1 h). sélection datée parmi les releases des sept derniers jours. sans source récente accessible : idée de fond explicitement étiquetée. ce premier moteur est un gabarit déterministe, pas une veille générale ni un appel à un modèle IA. les sept idées de fond tournent chaque semaine.

le brouillon se modifie, se copie et s’enregistre ; « marquer publié » est un suivi manuel, aucun appel de publication à X. les brouillons enregistrés sont prioritaires sur les nouvelles suggestions et restent dans l’historique. la recherche de conversations ouvre X : pas encore de sélection automatisée de posts auxquels répondre. le lab actuel filtre principalement des vidéos et ne fournit pas ces fils X.

positionnement proposé : IA et ingénierie en pratique, preuves observables, compromis, retours de construction. référence : [dépôt X](https://github.com/xai-org/x-algorithm), consulté le 9 septembre 2026. le classement combine des probabilités prédites pour chaque lecteur ; les poids ne s’appliquent pas directement aux compteurs d’interactions. cohérence de sujet et conversations utiles sont des hypothèses éditoriales à tester, pas une promesse de portée.

### vidéos : atelier de départ

une idée de test réel, accroche, démonstration, verdict à compléter après l’expérience et question finale. un seul montage, cases de diffusion Instagram / TikTok / Facebook / YouTube. pas de vidéo X. références fournies par Matheus : chrispathway, becoming.lea, consti.in.tech ; aucune imitation de scripts ni analyse de leur style prétendue. le texte est un plan de tournage, pas une vidéo générée.

schéma ajouté, compatible avec les anciennes idées : `content = { ideas: Todo[], drafts?: Draft[] }`, `Draft = { id, day, kind: "x" | "video", title, text, source?, sourceDate?, done, published?: string[] }`. les identifiants du jour sont `x-YYYY-MM-DD` / `video-YYYY-MM-DD`. aucune nouvelle variable d’environnement.

### vérification et exploitation

`npm run build` et `python3 -m unittest discover -s scripts/tests`. le test analytics couvre les jours à Paris, les sources absentes, les nouveaux contenus, les corrections négatives et l’exclusion des comptes de veille. export atomique pour éviter un fichier tronqué. sauvegarde du cron avant branchement : `lab-cron.sh.before-admin-pro` sur le VPS.
