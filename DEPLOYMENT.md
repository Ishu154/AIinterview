# Deployment Guide

## Overview
- **Frontend**: Deploy to Vercel (free)
- **Backend**: Deploy to Render (free)

## Backend Deployment (Render)

### Step 1: Push to GitHub
Ensure your code is pushed to: https://github.com/Ishu154/AIinterview.git

### Step 2: Deploy to Render
1. Go to [render.com](https://render.com) and sign up/login
2. Click **New** → **Web Service**
3. Connect your GitHub repo
4. Configure:
   - **Name**: `ai-interviewer-backend`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Add environment variable:
   - `GEMINI_API_KEY` = your new API key
6. Click **Create Web Service**

Your backend URL will be: `https://ai-interviewer-backend.onrender.com`

---

## Frontend Deployment (Vercel)

### Step 1: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com) and sign up/login
2. Click **Add New** → **Project**
3. Import your GitHub repo
4. Configure:
   - **Root Directory**: `frontend`
   - **Framework Preset**: Next.js (auto-detected)
5. Add environment variable:
   - `NEXT_PUBLIC_API_URL` = `https://ai-interviewer-backend.onrender.com`
6. Click **Deploy**

---

## Post-Deployment
1. Update CORS in backend if needed
2. Test the full interview flow
3. Monitor for any errors in Render/Vercel dashboards
