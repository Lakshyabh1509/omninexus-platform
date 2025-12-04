# OmniNexus Deployment Guide

This guide covers deploying OmniNexus with:
- **Frontend** → Vercel (already done ✓)
- **Backend** → Render (Free Tier)

---

## Architecture Overview

```
┌─────────────────┐         ┌─────────────────┐
│   VERCEL        │         │    RENDER       │
│   (Frontend)    │  ───►   │    (Backend)    │
│                 │  API    │                 │
│  React + Vite   │ calls   │  FastAPI +      │
│  Static files   │         │  OpenAI/Claude  │
└─────────────────┘         └─────────────────┘
```

---

## Step 1: Deploy Backend to Render (Free)

### 1.1 Sign up for Render
1. Go to [render.com](https://render.com)
2. Click **"Get Started"**
3. Sign in with GitHub

### 1.2 Create New Web Service
1. Click **"New +"** → **"Web Service"**
2. Select your repository: `Lakshyabh1509/omninexus-platform`
3. Click **"Connect"**

### 1.3 Configure Service
Fill in the following details:

| Field | Value |
|-------|-------|
| **Name** | `omninexus-api` (or similar) |
| **Region** | Singapore (or closest to you) |
| **Branch** | `main` |
| **Root Directory** | `apps/api` |
| **Runtime** | `Python 3` |
| **Build Command** | `pip install -r requirements.txt` |
| **Start Command** | `uvicorn main:app --host 0.0.0.0 --port $PORT` |
| **Instance Type** | **Free** |

### 1.4 Configure Environment Variables
Scroll down to **"Environment Variables"** and add:

| Key | Value |
|-----|-------|
| `PYTHON_VERSION` | `3.11.0` |
| `OPENAI_API_KEY` | `sk-your-openai-key` |
| `ANTHROPIC_API_KEY` | `sk-ant-your-anthropic-key` (optional) |
| `PERPLEXITY_API_KEY` | `pplx-your-key` (optional) |

### 1.5 Deploy
1. Click **"Create Web Service"**
2. Wait for the build to finish (can take 3-5 minutes)
3. Once live, copy your backend URL (e.g., `https://omninexus-api.onrender.com`)

> **Note**: The free tier spins down after 15 minutes of inactivity. The first request might take 50 seconds to wake it up.

---

## Step 2: Connect Frontend to Backend

### 2.1 Add Environment Variable in Vercel
1. Go to [vercel.com](https://vercel.com) → Your project
2. **Settings** → **Environment Variables**
3. Add:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://omninexus-api.onrender.com` |

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
- Check Render logs for errors
- Verify `OPENAI_API_KEY` is set correctly in Render
- Ensure `VITE_API_URL` in Vercel has no trailing slash
- **Wait for cold start**: On free tier, the first request takes time. Wait 1 minute and try again.

### CORS Errors in Console
- Backend CORS is already configured to allow all origins
- Make sure Render deployment is marked "Live"

---

## Quick Reference

| Service | URL | Purpose |
|---------|-----|---------|
| Vercel | `omninexus-platform.vercel.app` | Frontend (React) |
| Render | `omninexus-api.onrender.com` | Backend (FastAPI) |

| Vercel Env Vars | |
|-----------------|---|
| `VITE_API_URL` | Render backend URL |

| Render Env Vars | |
|-----------------|---|
| `OPENAI_API_KEY` | For GPT-4 responses |
| `PYTHON_VERSION` | `3.11.0` |

---

## Cost Estimates

| Service | Free Tier | Notes |
|---------|-----------|-------|
| Vercel | ✅ Unlimited | Static hosting free |
| Render | ✅ Free Web Service | Spins down after inactivity |
| OpenAI | Pay per use | ~$0.01-0.03 per AI response |
