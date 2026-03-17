# Portfolio — Mathieu Astruc

## Setup

### 1. Installer Node.js
Télécharge et installe Node.js LTS depuis https://nodejs.org

### 2. Installer les dépendances
```bash
cd ~/Desktop/newwebsite
npm install
```

### 3. Configurer la clé API Anthropic
```bash
cp .env.local.example .env.local
# Édite .env.local et colle ta clé API Anthropic
```

### 4. Lancer en développement
```bash
npm run dev
```
Ouvre http://localhost:3000

### 5. Remplir tes informations
Édite le fichier `data/portfolio.md` avec tes vraies informations.
Le RAG utilisera ce fichier pour répondre aux questions des visiteurs.

---

## Structure

```
data/
  portfolio.md        ← TES INFORMATIONS ICI (markdown)
src/
  app/
    page.tsx          ← Page principale
    api/chat/route.ts ← API RAG + Claude
  components/
    Hero.tsx          ← Interface chat (le "menu")
    Navigation.tsx    ← Barre de nav minimale
  lib/
    rag.ts            ← Logique de recherche contextuelle
```

## Ajouter plus d'informations au RAG

Tu peux créer plusieurs fichiers `.md` dans `data/` :
- `data/portfolio.md` — Vue d'ensemble
- `data/projects.md` — Détail des projets
- `data/experience.md` — Expériences professionnelles

Le RAG les chargera tous automatiquement.
