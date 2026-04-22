# Quick Deployment Guide (5 Minutes)

Fast overview of deploying your AI Research Assistant to production.

## What You Need

1. **GitHub Account** - with your project pushed to a repository
2. **MongoDB Atlas Account** - for the database
3. **Render Account** - for the backend
4. **Vercel Account** - for the frontend

## Deployment Architecture

```
Users → Vercel (Frontend)
         ↓ (API Calls)
         Render (Backend)
         ↓ (Queries)
         MongoDB Atlas (Database)
```

## Step-by-Step

### 1️⃣ Prepare Backend for Deployment

Verify your `backend/package.json` has these scripts:
```json
"scripts": {
  "build": "tsc",
  "start": "node dist/index.js"
}
```

Your `backend/tsconfig.json` should have:
```json
{
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  }
}
```

### 2️⃣ Deploy Backend to Render (15 mins)

1. Go to https://render.com → **Sign Up** with GitHub
2. Click **"New"** → **"Web Service"**
3. Select your GitHub repository
4. Fill in these fields:
   - **Name**: `ai-research-backend`
   - **Environment**: `Node`
   - **Root Directory**: `backend`
   - **Build Command**: `npm ci && npm run build`
   - **Start Command**: `npm start`
5. Click **"Advanced"** and add Environment Variables:

```
MONGODB_URI=your-mongodb-connection-string
OLLAMA_API_URL=your-ollama-url
JWT_SECRET=generate-random-string
NODE_ENV=production
CORS_ORIGIN=https://placeholder.vercel.app
```

6. Click **"Create Web Service"**
7. **Wait for deployment** - copy your backend URL when done:
   ```
   https://<service-name>.onrender.com
   ```

### 3️⃣ Deploy Frontend to Vercel (10 mins)

1. Go to https://vercel.com → **Sign Up** with GitHub
2. Click **"Add New"** → **"Project"**
3. Select your GitHub repository
4. Fill in these fields:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
5. Under **Environment Variables**, add:
   ```
   NEXT_PUBLIC_API_URL=https://<your-render-backend>.onrender.com
   ```
6. Click **"Deploy"**
7. **Wait for deployment** - copy your frontend URL when done:
   ```
   https://<project>.vercel.app
   ```

### 4️⃣ Update Backend CORS (2 mins)

1. Go to Render Dashboard → Your backend service
2. Go to **"Environment"** tab
3. Edit `CORS_ORIGIN` and change it to your Vercel URL:
   ```
   CORS_ORIGIN=https://<your-vercel-frontend>.vercel.app
   ```
4. Click **"Save"** - this will trigger a redeploy

### 5️⃣ Test Everything ✅

Visit your frontend: `https://<your-vercel-frontend>.vercel.app`

- [ ] Page loads
- [ ] Can register/login
- [ ] Can upload PDF
- [ ] Summary appears
- [ ] No CORS errors in browser console

## Environment Variables Explained

| Variable | Example | Where From |
|----------|---------|-----------|
| `MONGODB_URI` | `mongodb+srv://user:pass@...` | MongoDB Atlas → Connect |
| `OLLAMA_API_URL` | `https://api.ollama.com` | Your Ollama instance |
| `JWT_SECRET` | `abc123xyz789...` | Generate random string |
| `NEXT_PUBLIC_API_URL` | `https://backend.onrender.com` | From Render deployment |

## Common Issues

### ❌ CORS Error when uploading PDF
→ Check `CORS_ORIGIN` in Render backend matches your Vercel URL exactly

### ❌ "Cannot connect to database"
→ Check MongoDB Atlas IP whitelist allows `0.0.0.0/0`

### ❌ Backend keeps restarting
→ Check all environment variables are set in Render

### ❌ Environment variables not loading
→ Redeploy after adding variables (click "Redeploy" button)

## After Deployment

- **Monitor Backend**: https://dashboard.render.com
- **Monitor Frontend**: https://vercel.com/dashboard
- **Monitor Database**: https://cloud.mongodb.com

---

**That's it!** Your application is now live. 🎉

For detailed guides, see:
- [RENDER_DEPLOYMENT.md](RENDER_DEPLOYMENT.md) - Backend details
- [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md) - Frontend details
- [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) - Full checklist
