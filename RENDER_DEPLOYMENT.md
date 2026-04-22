# Deploying Backend to Render

This guide will help you deploy your Express.js backend to Render.

## Prerequisites

1. A GitHub/GitLab/Bitbucket account with your project repository pushed
2. A Render account (sign up at https://render.com)
3. MongoDB Atlas setup (see [backend/MONGODB_SETUP.md](backend/MONGODB_SETUP.md))
4. Environment variables configured

## Step 1: Ensure Backend is Ready

### Check package.json scripts

Your `backend/package.json` should have:
```json
{
  "scripts": {
    "dev": "ts-node-dev src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  }
}
```

### Create build output directory

Ensure TypeScript compilation outputs to `dist/`:

Check your `backend/tsconfig.json` has:
```json
{
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  }
}
```

## Step 2: Push Your Code to GitHub

If you haven't already, push your project to GitHub:

```bash
git add .
git commit -m "Ready for production deployment"
git push origin main
```

Make sure both `frontend/` and `backend/` folders are in the same repository.

## Step 3: Sign Up / Login to Render

1. Go to https://render.com
2. Click **"Sign Up"** or **"Log In"**
3. Choose GitHub to connect your repository

## Step 4: Create New Web Service

1. Go to Dashboard → **"New"** → **"Web Service"**
2. Select your Git repository
3. Configure the service:

   **Basic Settings**:
   - **Name**: `ai-research-backend` (or your preferred name)
   - **Environment**: `Node`
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: `backend`

   **Build & Deploy**:
   - **Build Command**: `npm ci && npm run build`
   - **Start Command**: `npm start`

## Step 5: Set Environment Variables

In the Render dashboard, add these environment variables:

```
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
OLLAMA_API_URL=<your-ollama-api-url>
CORS_ORIGIN=https://your-vercel-frontend.vercel.app
JWT_SECRET=your-secret-key
PORT=10000
NODE_ENV=production
```

### Where to find these values:

- **MONGODB_URI**: From MongoDB Atlas cluster → "Connect" → "Drivers"
  - Replace `<username>`, `<password>`, `<cluster>`, `<database>`
  - Example: `mongodb+srv://airesearch:mypassword123@cluster0.xyz.mongodb.net/aidb?retryWrites=true&w=majority`

- **OLLAMA_API_URL**: The URL where your Ollama instance is running
  - Example: `http://ollama-server:11434` or a cloud-hosted Ollama service

- **CORS_ORIGIN**: Your Vercel frontend URL (set after frontend deployment)
  - Example: `https://ai-research-frontend.vercel.app`

- **JWT_SECRET**: Generate a secure random string
  - Example: `abc123xyz456!@#$%^&*()`

- **PORT**: Keep as `10000` (Render assigns this by default)

- **NODE_ENV**: Set to `production`

## Step 6: Deploy

1. Click **"Create Web Service"**
2. Render will start building and deploying your backend
3. Your backend will be live at `https://<service-name>.onrender.com`

## Step 7: Update Frontend Environment Variable

After your backend is deployed:

1. Go to Vercel dashboard
2. Navigate to your frontend project → **"Settings"** → **"Environment Variables"**
3. Update `NEXT_PUBLIC_API_URL`:
   ```
   NEXT_PUBLIC_API_URL=https://<service-name>.onrender.com
   ```
4. Redeploy the frontend

## Important Notes

### Cold Starts on Free Tier

Render's free tier puts services to sleep after 15 minutes of inactivity. The first request will take 30-50 seconds to respond.

To avoid this:
- Upgrade to **Render's Paid Plan** ($7/month minimum)
- Or implement a ping service to keep it awake

### Database Connection Issues

If you get connection errors:

1. Check MongoDB Atlas IP Whitelist:
   - Go to MongoDB Atlas → **"Network Access"**
   - Make sure `0.0.0.0/0` (Allow access from anywhere) is added
   
2. Verify MONGODB_URI format in environment variables

3. Test the connection in your backend logs

## Monitoring & Logs

- View deployment logs: Go to your service → **"Logs"** tab
- Real-time metrics: **"Metrics"** tab
- Check for errors: Scroll through logs for any `Error` messages

## Troubleshooting

### Build fails with "npm: command not found"
- Make sure Node environment is selected
- Check Build Command is correct: `npm ci && npm run build`

### Port binding errors
- Ensure your backend uses `process.env.PORT` or defaults to a valid port
- Check [backend/src/index.ts](backend/src/index.ts) line where server listens

### Cannot connect to MongoDB
- Verify MONGODB_URI is correct
- Check MongoDB user credentials
- Allow access from Render IP in MongoDB Atlas (or use 0.0.0.0/0)

### CORS errors from frontend
- Make sure CORS_ORIGIN matches your Vercel frontend URL exactly
- Verify the variable is set in Render environment

### Service keeps restarting
- Check logs for errors
- Ensure all required environment variables are set
- Look for memory issues (check "Metrics")

## Upgrading from Free Tier

To avoid cold starts:

1. In Render Dashboard → Service → **"Settings"**
2. Find **"Plan"** section
3. Upgrade to a Paid Plan

The cheapest paid plan is **Starter** at $7/month and includes:
- No cold starts
- 0.5 GB RAM
- Enough for a small application

---

**Next**: See [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md) for frontend deployment instructions.

## Quick Summary

```
1. Create Render account
2. Connect GitHub repository
3. Create Web Service with root directory: backend
4. Set environment variables
5. Deploy
6. Note your backend URL: https://<service-name>.onrender.com
7. Update Vercel with this URL as NEXT_PUBLIC_API_URL
8. Redeploy Vercel frontend
```
