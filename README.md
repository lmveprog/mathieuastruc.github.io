# mathieu astruc — portfolio

Personal portfolio with an AI chat interface that answers questions about my background, projects, and experience.

**Live → [mathieuastruc.com](https://mathieuastruc.com)**

## Stack

- **Next.js 15** — App Router, TypeScript
- **Groq** — LLaMA 3.3 70B for chat, streamed responses
- **RAG** — TF-IDF retrieval over `data/portfolio.md`
- **WebGL** — Fluid simulation on the home page
- **Vercel** — Deployment

## Run locally

```bash
npm install
cp .env.local.example .env.local   # add your GROQ_API_KEY
npm run dev
```

## Content

All RAG knowledge lives in [`data/portfolio.md`](data/portfolio.md) — edit it to update what the AI knows.
