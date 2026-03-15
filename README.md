# SmartBiz News Desk — Setup Guide

## Stack
- Frontend: React + Vite → Cloudflare Pages (Free)
- Database: Supabase (Free, already have it)
- AI: OpenRouter (Free tier)
- No backend server needed!

---

## Step 1 — Install & Run Locally

```bash
npm install
cp .env.example .env
# Fill in .env with your keys
npm run dev
```

Open: http://localhost:5173

---

## Step 2 — Fill .env

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_OPENROUTER_KEY=sk-or-v1-xxxxx
```

---

## Step 3 — Deploy to Cloudflare Pages

1. Push this folder to GitHub
2. Go to https://pages.cloudflare.com
3. Connect GitHub repo
4. Build settings:
   - Build command: `npm run build`
   - Output directory: `dist`
5. Add Environment Variables (same as .env)
6. Deploy!

Your app is live at: https://smartbiz-news-desk.pages.dev

---

## Supabase Table

Run schema.sql in your Supabase SQL Editor (already done ✓)
