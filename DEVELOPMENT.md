# Development Guide

Quick reference for running and developing the AI Research Paper Summarizer.

## 🎯 Start Everything

### Option 1: Manual Setup (2 Terminals)

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Expected: `🚀 Server running on port 5000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
Expected: `Ready in 2s` 

Then open: http://localhost:3000

### Option 2: Windows Batch Script

Simply run:
```bash
setup.bat
```

This will:
1. Check Node.js installation
2. Install backend dependencies
3. Install frontend dependencies
4. Show next steps

### Option 3: VS Code Integrated Terminal

1. Open project root in VS Code
2. Terminal → New Terminal
3. Split terminal (or open new one)
4. In Terminal 1:
   ```bash
   cd backend && npm run dev
   ```
5. In Terminal 2:
   ```bash
   cd frontend && npm run dev
   ```

## 🔍 Verify Setup

### Prerequisites
1. **Node.js** (v16+)
2. **MongoDB Atlas** account (free tier available)
3. **Ollama** running on localhost:11434

### Environment Variables Setup

**Backend Configuration:**
1. Create `backend/.env` file:
   ```bash
   cp backend/.env.example backend/.env
   ```
2. Update values in `backend/.env`:
   - `MONGODB_URI` - Get from MongoDB Atlas
   - `JWT_SECRET` - Generate a random string
   - `OLLAMA_API_URL` - Should be `http://localhost:11434`

### MongoDB Atlas Setup

For detailed MongoDB Atlas setup instructions, see [MONGODB_SETUP.md](./backend/MONGODB_SETUP.md)

Quick steps:
1. Create free cluster on MongoDB Atlas
2. Create database user with strong password
3. Add your IP to Network Access (or allow all for dev)
4. Copy connection string
5. Replace credentials in `.env` file

### Check Backend
```bash
# In new terminal
curl http://localhost:5000

# Should return
{
  "message": "API Running...",
  "status": "ok",
  "timestamp": "2024-04-11T10:30:00.000Z"
}
```

### Check MongoDB Connection
```bash
# Start backend server
cd backend
npm run dev

# Should see in logs:
# ✅ Connected to MongoDB Atlas
# ✅ Database indexes created
# 🚀 Server running on port 5000
```

### Check Frontend
Open http://localhost:3000 in browser. You should see:
- Title: "AI Research Paper Summarizer"
- Upload area with gradient background
- "🟢 Connected" status indicator
- Login/Sign Up button in navbar

## 🧪 Test Upload

1. Get a PDF file (any research paper or test PDF)
2. On http://localhost:3000, drag and drop or click to upload
3. Wait for processing
4. See summary result

## 📝 File Structure During Dev

```
Backend server running on :5000
├── src/
│   ├── index.ts          → Main server file
│   ├── routes/
│   │   └── paperRoutes.ts → Hot reload on change
│   ├── services/
│   │   └── aiService.ts  → Hot reload on change
│   └── ...
├── uploads/              → Temporary PDF files (auto-deleted)
└── dist/                 → Compiled JS (created on first run)

Frontend server running on :3000
├── app/
│   ├── page.tsx          → Hot reload on change
│   ├── components/
│   │   ├── FileUpload.tsx → Hot reload on change
│   │   └── ...
│   └── lib/
│       └── api.ts        → Hot reload on change
└── .next/                → Build cache (auto-managed)
```

## 🔄 Hot Reload

Both servers support hot reload:

**Backend:** `ts-node-dev` watches for changes and restarts
- Edit `src/index.ts` → Auto restart
- Edit `src/routes/paperRoutes.ts` → Auto restart

**Frontend:** Next.js watches for changes and recompiles
- Edit `app/page.tsx` → Auto refresh in browser
- Edit components → Auto refresh in browser

## 🐛 Common Issues During Development

### Issue: Port 5000 Already in Use
```bash
# Kill existing process
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Or use different port
PORT=5001 npm run dev
```

### Issue: Changes Not Reflecting
**Backend:** Restart the server (Ctrl+C, then npm run dev)
**Frontend:** Clear browser cache (Ctrl+Shift+Delete)

### Issue: API Connection Error
1. Check backend is running (check terminal for port 5000 message)
2. Check .env files have correct ports
3. Verify browser console for error messages

### Issue: "Cannot find module"
```bash
# Clear node_modules and reinstall
rm -r node_modules
npm install
```

## 📊 Monitoring

### Watch Backend Logs
```bash
# In backend terminal, you'll see:
[2024-04-11T10:30:45.123Z] POST /api/paper/upload - 200 (5234ms)
[2024-04-11T10:31:10.456Z] GET / - 200 (2ms)

# This shows: timestamp, method, path, status, duration
```

### Watch Frontend Logs
```bash
# In browser console (F12):
- Network tab shows API calls
- Console tab shows any errors
- Application tab shows stored data
```

## 🚀 Building for Production

### Build Backend
```bash
cd backend
npm run build

# Creates dist/ folder with compiled JavaScript
# Then deploy with: npm start
```

### Build Frontend
```bash
cd frontend
npm run build

# Creates .next/ folder with optimized build
# Then deploy with: npm start
```

## 🔐 Environment Setup

### Backend .env
```env
OPENAI_API_KEY=sk-...         # ⚠️ REQUIRED - Add your key
PORT=5000                      # Optional, default 5000
CORS_ORIGIN=http://localhost:3000  # Optional
```

### Frontend .env.local
```env
NEXT_PUBLIC_API_URL=http://localhost:5000  # Optional, default this value
```

## 💡 Development Tips

### 1. Use VS Code Extensions
- **ES7+ React/Redux/React-Native snippets** - Quick typings
- **Thunder Client** or **REST Client** - Test API endpoints
- **Prettier** - Auto format code

### 2. Debug Backend
```typescript
// Add in your code
console.log('Debug info:', variable);

// Will appear in backend terminal
```

### 3. Debug Frontend
```typescript
// Use browser DevTools
console.log('Debug:', state);
debugger; // Pause execution
```

### 4. Test API Endpoints
Use Thunder Client extension or cURL:
```bash
curl -X POST http://localhost:5000/api/paper/upload \
  -F "file=@test.pdf"
```

## 📚 Next Steps

1. ✅ Backend and frontend running
2. 📤 Test PDF upload
3. 🎨 Customize UI in `app/page.module.css`
4. 🔧 Modify API behavior in `src/services/aiService.ts`
5. 🚀 Deploy to production

## 🆘 Getting Help

- **Backend issues?** → See `backend/README.md`
- **Frontend issues?** → See `frontend/README.md`
- **API testing?** → See `backend/TESTING.md`
- **Architecture?** → See `backend/CODE_STRUCTURE.md`

## ⚡ Quick Commands Reference

```bash
# Backend setup
cd backend
npm install @types/pdf-parse
npm run dev              # Start dev server
npm run build            # Build for production
npm start                # Run production build

# Frontend setup
cd frontend
npm install
npm run dev              # Start dev server
npm run build            # Build for production
npm start                # Run production build

# Testing
curl http://localhost:5000                    # Test backend
curl http://localhost:3000                    # Test frontend

# Cleanup
rm -r node_modules      # Remove dependencies
npm cache clean --force # Clear npm cache
```

---

**Happy Developing! 🚀**

Ready to test? Just run both servers and visit http://localhost:3000!
