# OmniNexus Deployment Guide

This guide covers deploying OmniNexus with:
- **Frontend** → Vercel (already done ✓)
- **Backend** → Railway (5-minute setup)

---

## Architecture Overview

```
┌─────────────────┐         ┌─────────────────┐
│   VERCEL        │         │    RAILWAY      │
│   (Frontend)    │  ───►   │    (Backend)    │
│                 │  API    │                 │
│  React + Vite   │ calls   │  FastAPI +      │
│  Static files   │         │  OpenAI/Claude  │
└─────────────────┘         └─────────────────┘
```

---

## Step 1: Deploy Backend to Railway

### 1.1 Sign up for Railway
1. Go to [railway.app](https://railway.app)
2. Click **"Start a New Project"**
3. Sign in with GitHub

### 1.2 Create New Project
1. Click **"Deploy from GitHub repo"**
2. Select your repository: `Lakshyabh1509/omninexus-platform`
3. **Important**: Click **"Add Root Directory"** and set it to: `apps/api`

### 1.3 Configure Environment Variables
In Railway dashboard → Your project → **Variables** tab:

| Variable | Value |
|----------|-------|
| `OPENAI_API_KEY` | `sk-your-openai-key` |
| `ANTHROPIC_API_KEY` | `sk-ant-your-anthropic-key` (optional) |
| `PERPLEXITY_API_KEY` | `pplx-your-key` (optional) |

### 1.4 Deploy
1. Railway will auto-detect Python and build
2. Wait 2-3 minutes for deployment
3. Click **"Generate Domain"** to get your URL
4. Your backend URL will be like: `https://omninexus-api-production.up.railway.app`

### 1.5 Test Backend
Open in browser: `https://your-railway-url.up.railway.app/health`

Should return:
```json
{"status": "healthy", "timestamp": "..."}
```

---

## Step 2: Connect Frontend to Backend

### 2.1 Add Environment Variable in Vercel
1. Go to [vercel.com](https://vercel.com) → Your project
2. **Settings** → **Environment Variables**
3. Add:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://your-railway-url.up.railway.app` |

> ⚠️ **No trailing slash!** Use `https://api.example.com` not `https://api.example.com/`

### 2.2 Redeploy on Vercel
1. Go to **Deployments** tab
2. Click the **"..."** menu on latest deployment
3. Select **"Redeploy"**

---

## Step 3: Verify Everything Works

1. Open your Vercel URL: `https://omninexus-platform.vercel.app`
2. Navigate to **AI Support**
3. Send a message like "What is EBITDA?"
4. Response should show **"LIVE"** badge (not "MOCK")

---

## Troubleshooting

### AI Support still shows "MOCK"
- Check Railway logs for errors
- Verify `OPENAI_API_KEY` is set correctly in Railway
- Ensure `VITE_API_URL` in Vercel has no trailing slash

### CORS Errors in Console
- Backend CORS is already configured to allow all origins
- Make sure Railway deployment is complete

### Railway Build Fails
- Check that root directory is set to `apps/api`
- Verify `requirements.txt` exists in `apps/api`

---

## Quick Reference

| Service | URL | Purpose |
|---------|-----|---------|
| Vercel | `omninexus-platform.vercel.app` | Frontend (React) |
| Railway | `your-api.railway.app` | Backend (FastAPI) |

| Vercel Env Vars | |
|-----------------|---|
| `VITE_API_URL` | Railway backend URL |
| `VITE_SUPABASE_URL` | Supabase URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase key |

| Railway Env Vars | |
|------------------|---|
| `OPENAI_API_KEY` | For GPT-4 responses |
| `ANTHROPIC_API_KEY` | Fallback to Claude |
| `PERPLEXITY_API_KEY` | Fallback to Perplexity |

---

## Cost Estimates

| Service | Free Tier | Notes |
|---------|-----------|-------|
| Vercel | ✅ Unlimited | Static hosting free |
| Railway | ✅ $5/month credit | Usually enough for low traffic |
| OpenAI | Pay per use | ~$0.01-0.03 per AI response |
