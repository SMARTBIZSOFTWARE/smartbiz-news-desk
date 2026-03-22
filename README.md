# SmartBiz News Desk — Setup Guide

## Stack
- Frontend: React + Vite → Cloudflare Pages (Free)
- Database: Supabase (Free)
- AI: Google Gemini 1.5 Flash (Free tier)

---

## Step 1 — Install & Run Locally
```
npm install
cp .env.example .env
# Fill in .env with your keys
npm run dev
```

---

## Step 2 — Fill .env
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_GEMINI_KEY=AIzaSy...your_gemini_key
```

Get free Gemini key: https://aistudio.google.com/apikey

---

## Step 3 — Deploy to Cloudflare Pages
1. Push to GitHub
2. Go to https://pages.cloudflare.com
3. Connect GitHub repo
4. Build settings:
   - Build command: `npm run build`
   - Output directory: `dist`
5. Add Environment Variables (same as .env):
   - VITE_SUPABASE_URL
   - VITE_SUPABASE_ANON_KEY
   - VITE_GEMINI_KEY
6. Deploy!
