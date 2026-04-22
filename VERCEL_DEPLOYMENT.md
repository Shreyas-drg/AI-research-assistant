# Deploying Frontend to Vercel

This guide will help you deploy your Next.js frontend to Vercel.

## Prerequisites

1. A GitHub/GitLab/Bitbucket account with your project repository pushed
2. A Vercel account (sign up at https://vercel.com)
3. Your backend URL (from Render deployment)

## Step 1: Push Your Code to GitHub

If you haven't already, push your project to GitHub:

```bash
git add .
git commit -m "Ready for production deployment"
git push origin main
```

Make sure both `frontend/` and `backend/` folders are in the same repository.

## Step 2: Sign Up / Login to Vercel

1. Go to https://vercel.com
2. Click **"Sign Up"** or **"Log In"**
3. Choose your preferred sign-in method (GitHub, GitLab, Bitbucket, or Email)

## Step 3: Create New Project

1. Click **"Add New..."** → **"Project"**
2. Select your Git repository containing the project
3. Vercel will auto-detect that it's a monorepo with a Next.js app
4. Configure the project:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)
   - **Install Command**: `npm ci` (default)

## Step 4: Set Environment Variables

1. Under **"Environment Variables"** section, add the following:

```
NEXT_PUBLIC_API_URL=https://your-render-backend.onrender.com
```

⚠️ **Important**: The `NEXT_PUBLIC_` prefix makes this variable accessible in the browser. This is needed for API calls from the frontend.

2. Check your [frontend/lib/api.ts](frontend/lib/api.ts) file to see if there are other environment variables needed. Add them here.

## Step 5: Deploy

1. Click **"Deploy"**
2. Vercel will build and deploy your Next.js app
3. Your frontend will be live at `https://<project-name>.vercel.app`

## Step 6: Update Backend CORS Settings

After your frontend is deployed, you'll need to update the backend CORS origin:

1. Go to your Render dashboard (see [RENDER_DEPLOYMENT.md](RENDER_DEPLOYMENT.md))
2. In the backend service, update the environment variable:
   ```
   CORS_ORIGIN=https://your-vercel-frontend.vercel.app
   ```
3. Redeploy the backend

## Monitoring & Logs

- View deployment logs: Go to your project → **"Deployments"** tab
- Real-time analytics: **"Analytics"** tab
- Check logs: Each deployment has a **"Logs"** link

## Troubleshooting

### Build fails with "Module not found"
- Ensure all dependencies are in `frontend/package.json`
- Check that the root directory is set to `frontend`

### API calls return CORS errors
- Make sure `NEXT_PUBLIC_API_URL` is set correctly
- Verify the backend has the correct `CORS_ORIGIN` environment variable

### Environment variables not loading
- Ensure variables are prefixed with `NEXT_PUBLIC_` for browser access
- Redeploy after adding new environment variables

## Redeploying

To redeploy after making changes:

1. Push changes to your GitHub repository
2. Vercel automatically triggers a new deployment
3. Or manually click **"Redeploy"** in the Vercel dashboard

---

**Next**: See [RENDER_DEPLOYMENT.md](RENDER_DEPLOYMENT.md) for backend deployment instructions.
