# MongoDB Atlas Connection Setup (Step-by-Step)

## Current Status ✓
Your project already has MongoDB configured! I found existing credentials in your `.env` file.

## What We'll Do

1. Create/access MongoDB Atlas account
2. Create a cluster
3. Create database user
4. Allow network access
5. Connect your backend to Atlas
6. Test the connection

---

## Step 1: Go to MongoDB Atlas

1. Visit: https://www.mongodb.com/cloud/atlas
2. Click **"Sign In"** if you have an account, or **"Sign Up"** to create one
3. Complete the login/registration
4. You'll see the MongoDB Atlas dashboard

---

## Step 2: Create a Project (if needed)

If you don't already have a project:

1. Click **"Create a Project"** (or **"New Project"**)
2. Enter Project Name: `AI Research Assistant`
3. Click **"Create Project"**

---

## Step 3: Create a Cluster

1. In your project dashboard, click **"Create a Deployment"** or **"Build a Cluster"**
2. Choose deployment type: **"M0 FREE"** (free tier)
3. Select provider & region (choose closest to you):
   - Provider: AWS/Google Cloud/Azure (any)
   - Region: e.g., "N. Virginia (us-east-1)"
4. Click **"Create Deployment"**
5. **Wait** for the cluster to be created (2-3 minutes)
6. You'll get a notification when ready

---

## Step 4: Create Database User

1. In your cluster dashboard, go to **"Security"** → **"Database Access"**
2. Click **"Add New Database User"**
3. Fill in the form:
   - **Username**: `draggonite6_db_user` (or your preferred username)
   - **Password**: Use "Autogenerate Secure Password" or enter a strong password
   - **Role**: Select "Atlas admin"
4. Click **"Add User"**
5. **Save the password** somewhere secure (you'll need it)

---

## Step 5: Allow Network Access

1. Go to **"Security"** → **"Network Access"**
2. Click **"Add IP Address"**
3. Select **"Allow Access from Anywhere"** (0.0.0.0/0)
   - For development, this is fine
   - For production, restrict to your server's IP
4. Click **"Confirm"**

---

## Step 6: Get Your Connection String

1. Go to your cluster dashboard
2. Click the **"Connect"** button
3. Choose **"Drivers"** (Node.js)
4. Copy the connection string - it will look like:

```
mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

---

## Step 7: Update Your .env File

Your `backend/.env` file currently has:

```env
OLLAMA_API_URL=http://localhost:11434
OLLAMA_MODEL=mistral
# MONGODB_URI=mongodb+srv://draggonite6_db_user:LHxRj9giL8Tc5ZtD@cluster0.cjag1ws.mongodb.net/ai_research_assistant?retryWrites=true&w=majority
MONGODB_URI=mongodb://localhost:27017/ai_research_assistant
JWT_SECRET=25053c6847a606b45c500b65c329b9118869ce887c405c3989badcf1f7df93e4
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

### ⚠️ Important: Replace the MONGODB_URI

1. Comment out the local MongoDB line:
   ```env
   # MONGODB_URI=mongodb://localhost:27017/ai_research_assistant
   ```

2. Uncomment and update the Atlas URI:
   ```env
   MONGODB_URI=mongodb+srv://draggonite6_db_user:LHxRj9giL8Tc5ZtD@cluster0.cjag1ws.mongodb.net/ai_research_assistant?retryWrites=true&w=majority
   ```

3. Replace the values:
   - `draggonite6_db_user` → your username
   - `LHxRj9giL8Tc5ZtD` → your password (from Step 4)
   - `cluster0.cjag1ws.mongodb.net` → your cluster URL (from Step 6)

**Final .env should look like:**
```env
OLLAMA_API_URL=http://localhost:11434
OLLAMA_MODEL=mistral
MONGODB_URI=mongodb+srv://draggonite6_db_user:YOUR_PASSWORD@cluster0.cjag1ws.mongodb.net/ai_research_assistant?retryWrites=true&w=majority
JWT_SECRET=25053c6847a606b45c500b65c329b9118869ce887c405c3989badcf1f7df93e4
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

---

## Step 8: Test the Connection

### Option A: Run Backend Server

1. Open terminal in `backend/` folder
2. Run:
   ```bash
   npm run dev
   ```

3. Look for these messages in the console:
   ```
   ✅ Connected to MongoDB Atlas
   ✅ Database connected
   🚀 Server running on port 5000
   ```

4. If you see these messages, **you're connected!** ✓

### Option B: Test with API Request

1. Backend is running (from Option A)
2. Open browser and visit:
   ```
   http://localhost:5000/
   ```

3. Should see JSON response:
   ```json
   {
     "message": "API Running...",
     "status": "ok",
     "timestamp": "2026-04-22T..."
   }
   ```

---

## ✅ Verification Checklist

Before proceeding, verify:

- [ ] MongoDB Atlas account created
- [ ] Cluster deployed (shows as "Active")
- [ ] Database user created
- [ ] Network access allows 0.0.0.0/0
- [ ] Connection string copied
- [ ] MONGODB_URI updated in `.env`
- [ ] Backend starts without errors
- [ ] Logs show "✅ Connected to MongoDB Atlas"
- [ ] API health check returns JSON

---

## Troubleshooting

### ❌ Error: "MONGODB_URI is not set"
- Check `.env` file exists in `backend/` folder
- Verify `MONGODB_URI=...` is uncommented
- Restart the backend server

### ❌ Error: "Authentication failed"
- Check username and password are correct
- Make sure password doesn't have special characters (or is URL-encoded)
- Verify database user exists in MongoDB Atlas → Security → Database Access

### ❌ Error: "connect ECONNREFUSED" or "IP address not whitelisted"
- Go to MongoDB Atlas → Security → Network Access
- Make sure `0.0.0.0/0` is added
- Wait a few minutes for network rules to apply
- Try connecting again

### ❌ Cannot connect from production (Render/Vercel)
- Keep `0.0.0.0/0` for now (development)
- In production, add Render's static IP:
  - Go to Render dashboard → your service → Settings
  - Find Static IP address
  - Add it to MongoDB Atlas Network Access

### ❌ Database is empty / collections don't exist
- This is normal! Collections are created automatically when you:
  1. Register a user (creates `users` collection)
  2. Upload a paper (creates `papers` collection)
- Your backend code creates indexes automatically on first connection

---

## Next Steps

Once connected to MongoDB Atlas:

1. ✅ Test user registration at `http://localhost:3000`
2. ✅ Upload a PDF and verify it's saved to MongoDB
3. ✅ View "My Papers" to confirm data is persisting
4. ✅ Proceed with deployment to Render and Vercel

---

## MongoDB Atlas Dashboard

Bookmark these useful links:

- **Main Dashboard**: https://cloud.mongodb.com
- **Your Cluster**: https://cloud.mongodb.com/v2 (shows your cluster status)
- **Collections**: Click cluster name → Collections tab
- **Logs**: Click cluster name → Logs tab (for debugging)

---

## Helpful MongoDB Commands (Optional)

Once your backend is connected, you can view data directly in MongoDB Atlas:

1. Go to your cluster → **Collections** tab
2. Select database: `ai_research_assistant`
3. View collections:
   - `users` - Registered users
   - `papers` - Uploaded papers/summaries
   - System.indexes - Database indexes

You can view, edit, and delete data directly from the Atlas UI.

---

For more help, see [backend/MONGODB_SETUP.md](../backend/MONGODB_SETUP.md)
