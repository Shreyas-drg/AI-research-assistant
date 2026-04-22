# Deployment Checklist

Use this checklist to ensure everything is ready for production deployment.

## Pre-Deployment

### Backend Preparation
- [ ] `backend/package.json` has correct `build` and `start` scripts
- [ ] `backend/tsconfig.json` has `outDir: "./dist"` and `rootDir: "./src"`
- [ ] All environment variables are validated in `src/index.ts`
- [ ] Error handling is proper in Express app
- [ ] Database connections handle errors gracefully
- [ ] CORS is configured with environment variable

### Frontend Preparation
- [ ] `frontend/package.json` has correct scripts (Next.js default)
- [ ] All API calls use `NEXT_PUBLIC_API_URL` environment variable
- [ ] No hardcoded URLs (e.g., `http://localhost:5000`)
- [ ] Check [frontend/lib/api.ts](frontend/lib/api.ts) for all API endpoints
- [ ] Environment variables are properly typed

### Git Repository
- [ ] All changes committed and pushed to main branch
- [ ] No sensitive data in repository (API keys, passwords)
- [ ] `.env.local` and `.env.*.local` are in `.gitignore`
- [ ] Both `frontend/` and `backend/` folders are in the same repo

### Environment Variables Prepared
- [ ] MongoDB Atlas connection string ready
  - Username and password set
  - IP whitelist configured (0.0.0.0/0 or Render IP)
  - Database name created
  
- [ ] Ollama API URL available
  - Test connection locally
  
- [ ] JWT_SECRET generated
  - Strong random string or use `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
  
- [ ] Frontend URL placeholder ready
  - Will be set after Vercel deployment

## Deployment Order

### Step 1: Deploy Backend (Render)
- [ ] Create Render account
- [ ] Connect GitHub repository
- [ ] Create new Web Service
- [ ] Set Root Directory to `backend`
- [ ] Add all environment variables (except CORS_ORIGIN)
- [ ] Wait for successful deployment
- [ ] **Save the backend URL**: `https://<service-name>.onrender.com`

### Step 2: Deploy Frontend (Vercel)
- [ ] Create Vercel account
- [ ] Connect GitHub repository
- [ ] Create new project
- [ ] Set Root Directory to `frontend`
- [ ] Add `NEXT_PUBLIC_API_URL` = (backend URL from Step 1)
- [ ] Wait for successful deployment
- [ ] **Save the frontend URL**: `https://<project>.vercel.app`

### Step 3: Update Backend CORS
- [ ] Go back to Render dashboard
- [ ] Update `CORS_ORIGIN` environment variable with frontend URL
- [ ] Redeploy backend service

## Post-Deployment Testing

### Backend Health Check
- [ ] Visit `https://<backend>.onrender.com/` in browser
- [ ] Should see: `{"message":"API Running...","status":"ok","timestamp":"..."}`
- [ ] Check logs for any errors

### Frontend Health Check
- [ ] Visit `https://<frontend>.vercel.app` in browser
- [ ] Page loads without errors
- [ ] Check browser console for errors

### API Integration Test
- [ ] Login/Register works
- [ ] Can upload PDF file
- [ ] Backend processes PDF without errors
- [ ] Summary appears in frontend
- [ ] Can save paper to collection
- [ ] Can view "My Papers"

### Cross-Origin Testing
- [ ] No CORS errors in browser console
- [ ] API requests succeed from frontend
- [ ] Authentication (JWT) works properly

## Production Monitoring

### Set Up Monitoring
- [ ] Enable Render notifications (email alerts)
- [ ] Set up Vercel analytics
- [ ] Monitor MongoDB Atlas metrics
- [ ] Set up error tracking (optional: Sentry, LogRocket)

### Regular Checks
- [ ] Check Render logs for errors
- [ ] Monitor API response times
- [ ] Track MongoDB storage usage
- [ ] Monitor failed requests

## Troubleshooting Quick Links

- Backend deployment issues → See [RENDER_DEPLOYMENT.md](RENDER_DEPLOYMENT.md#troubleshooting)
- Frontend deployment issues → See [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md#troubleshooting)
- Database issues → See [backend/MONGODB_SETUP.md](backend/MONGODB_SETUP.md)

## Important URLs

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | `https://<project>.vercel.app` | User interface |
| Backend API | `https://<service>.onrender.com` | API endpoints |
| MongoDB Atlas | `https://cloud.mongodb.com` | Database management |
| Vercel Dashboard | `https://vercel.com/dashboard` | Frontend deployment |
| Render Dashboard | `https://dashboard.render.com` | Backend deployment |

## Environment Variables Quick Reference

```bash
# Render Backend (.env)
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db?retryWrites=true&w=majority
OLLAMA_API_URL=https://ollama-api-url
CORS_ORIGIN=https://frontend-url.vercel.app
JWT_SECRET=your-secure-secret-key
PORT=10000
NODE_ENV=production

# Vercel Frontend
NEXT_PUBLIC_API_URL=https://backend-service.onrender.com
```

---

Once all checks are complete, your application is live in production! 🚀
