# Environment Variables Setup Guide

This guide shows you how to find and prepare all environment variables needed for deployment.

## For Render Backend

### 1. MONGODB_URI

**Where to get it:**

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Click on your cluster → **"Connect"**
3. Choose **"Drivers"**
4. Copy the connection string that looks like:
   ```
   mongodb+srv://username:password@cluster0.xyz.mongodb.net/databaseName?retryWrites=true&w=majority
   ```

**Important**: 
- Replace `<username>` and `<password>` with your MongoDB Atlas credentials
- Replace `<databaseName>` with your database name (e.g., `airesearch`)

**Example**:
```
mongodb+srv://airesearch:mypassword123@cluster0.xyz.mongodb.net/airesearch?retryWrites=true&w=majority
```

### 2. OLLAMA_API_URL

**Where to get it:**

The URL of your Ollama instance. This could be:

- **Local Ollama** (if running on your machine):
  ```
  http://localhost:11434
  ```

- **Remote Ollama Server**:
  ```
  https://your-ollama-server.com:11434
  ```

- **Cloud Ollama Service**:
  ```
  https://api.ollama.com
  ```

Contact whoever is providing the Ollama service to get the correct URL.

### 3. JWT_SECRET

**How to generate:**

Generate a secure random string using Node.js:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

This will output something like:
```
a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0
```

Copy this entire string and use it as `JWT_SECRET`.

### 4. CORS_ORIGIN

**Set after Vercel deployment:**

This is your Vercel frontend URL, which you'll only have AFTER deploying to Vercel.

Once you deploy frontend to Vercel, you'll get a URL like:
```
https://ai-research-frontend.vercel.app
```

Use this exact URL (with https://) for `CORS_ORIGIN`.

### 5. NODE_ENV

Set to:
```
production
```

### 6. PORT

Keep as:
```
10000
```

(Render will automatically assign this port)

---

## For Vercel Frontend

### 1. NEXT_PUBLIC_API_URL

**Set after Render deployment:**

Once you deploy backend to Render, you'll get a URL like:
```
https://ai-research-backend.onrender.com
```

Use this exact URL (with https://) for `NEXT_PUBLIC_API_URL`.

---

## Summary Table

| Service | Variable | Value | When Set |
|---------|----------|-------|----------|
| **Render** | `MONGODB_URI` | From MongoDB Atlas | Before deployment |
| **Render** | `OLLAMA_API_URL` | Your Ollama URL | Before deployment |
| **Render** | `JWT_SECRET` | Random secure string | Before deployment |
| **Render** | `CORS_ORIGIN` | Vercel frontend URL | After Vercel deployment |
| **Render** | `NODE_ENV` | `production` | Before deployment |
| **Render** | `PORT` | `10000` | Before deployment |
| **Vercel** | `NEXT_PUBLIC_API_URL` | Render backend URL | After Render deployment |

---

## Deployment Order

1. **First**: Get MongoDB URI, Ollama URL, and generate JWT_SECRET
2. **Deploy Backend to Render** with all variables except CORS_ORIGIN
3. **Copy backend URL** from Render (e.g., `https://xxx.onrender.com`)
4. **Deploy Frontend to Vercel** with `NEXT_PUBLIC_API_URL=<backend-url>`
5. **Copy frontend URL** from Vercel (e.g., `https://xxx.vercel.app`)
6. **Update Backend** CORS_ORIGIN with frontend URL and redeploy

---

## Quick Verification Checklist

Before deploying, verify you have:

- [ ] MongoDB Atlas account created
- [ ] MongoDB cluster created and running
- [ ] Database user created with password
- [ ] MONGODB_URI connection string copied
- [ ] Ollama service URL confirmed
- [ ] Generated a JWT_SECRET string
- [ ] GitHub repository with latest code pushed
- [ ] GitHub account linked to Render
- [ ] GitHub account linked to Vercel

Once you have all these, you're ready to deploy!

---

## Troubleshooting

### "Invalid MONGODB_URI"
- Check that the username and password are URL-encoded
- Verify the database name exists
- Ensure IP whitelist allows access from Render

### "Cannot connect to Ollama"
- Verify the Ollama URL is correct and accessible
- Check that the service is running
- If using localhost, you cannot access it from Render (use a remote Ollama)

### "CORS error" or "Access denied"
- Make sure CORS_ORIGIN in Render matches your Vercel frontend URL exactly
- Include `https://` prefix
- Redeploy Render after changing CORS_ORIGIN

### Environment variables not loading
- After adding variables in dashboard, redeploy the service
- Variable changes don't take effect until you redeploy

---

For more details, see [QUICK_DEPLOYMENT_GUIDE.md](QUICK_DEPLOYMENT_GUIDE.md)
