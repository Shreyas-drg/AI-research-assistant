# AI Research Paper Summarizer & Assistant

A full-stack application that uses AI to automatically summarize research papers, with user authentication and personal paper storage. Upload a PDF, get an instant summary with key points, TL;DR, and APA citation. Save papers to your personal collection and track your research.

## 🎯 Overview

```
┌──────────────────────────────────────────────────────────────┐
│                  Next.js Frontend                            │
│                (http://localhost:3000)                       │
│         - User Authentication (Register/Login)               │
│         - Upload PDF files                                   │
│         - Display summaries (Copy/Download)                  │
│         - View "My Papers" (Personal Collection)             │
│         - User Profile & Statistics                          │
└────────────────────┬─────────────────────────────────────────┘
                     │ API Calls (JWT Auth)
                     ↓
┌──────────────────────────────────────────────────────────────┐
│                 Express.js Backend                           │
│                (http://localhost:5000)                       │
│         - JWT Authentication                                 │
│         - Handle file uploads                                │
│         - Parse PDFs                                         │
│         - Call Ollama AI API                                 │
│         - Save papers per user                               │
│         - Rate limiting & Security                           │
└────────────────────┬─────────────────────────────────────────┘
                     │ Database Calls
                     ↓
┌──────────────────────────────────────────────────────────────┐
│              MongoDB Atlas Database                          │
│         - User accounts & authentication                     │
│         - Per-user paper storage                             │
│         - Search & retrieval                                 │
└──────────────────────────────────────────────────────────────┘
```

## 📁 Project Structure

```
AI research assistant/
├── backend/
│   ├── src/
│   │   ├── index.ts                 # Express server
│   │   ├── constants.ts             # Configuration
│   │   ├── types.ts                 # TypeScript types
│   │   ├── db/
│   │   │   └── mongodb.ts           # MongoDB connection
│   │   ├── middleware/
│   │   │   └── rateLimiter.ts       # Rate limiting
│   │   ├── routes/
│   │   │   ├── authRoutes.ts        # Auth endpoints
│   │   │   └── paperRoutes.ts       # Paper upload/retrieval
│   │   ├── services/
│   │   │   └── aiService.ts         # Ollama AI integration
│   │   ├── types/
│   │   │   └── user.ts              # User type definitions
│   │   └── utils/
│   │       ├── authUtils.ts         # JWT utilities
│   │       ├── cache.ts             # Caching layer
│   │       ├── helpers.ts           # Helper functions
│   │       └── requestQueue.ts      # Request queuing
│   ├── uploads/                     # Temporary files
│   ├── .env                         # Backend env vars
│   ├── package.json
│   └── README.md
│
└── frontend/
    ├── app/
    │   ├── components/
    │   │   ├── Navbar.tsx           # Navigation bar
    │   │   ├── FileUpload.tsx        # File upload component
    │   │   ├── SummaryDisplay.tsx    # Summary display (with copy/download)
    │   │   ├── ComparisonDisplay.tsx # Side-by-side comparison
    │   │   ├── ComparisonFileUpload.tsx # Comparison file upload
    │   │   ├── AuthModal.tsx         # Login/Register modal
    │   │   ├── UserProfile.tsx       # User profile component
    │   │   └── ComparisonDisplay.tsx # Comparison display
    │   ├── context/
    │   │   └── AuthContext.tsx       # Auth state management
    │   ├── lib/
    │   │   ├── api.ts               # API client & functions
    │   │   ├── downloadUtils.tsx    # Download utilities
    │   │   ├── highlightKeywords.tsx # Keyword highlighting
    │   │   └── searchUtils.tsx      # Search utilities
    │   ├── profile/
    │   │   └── page.tsx             # User profile page
    │   ├── page.tsx                 # Main home page
    │   ├── layout.tsx               # Root layout
    │   ├── globals.css              # Global styles
    │   └── globals.d.ts             # Type definitions
    ├── public/                       # Static assets
    ├── .env.local                   # Frontend env vars
    ├── package.json
    ├── next.config.js
    ├── tsconfig.json
    ├── tailwind.config.ts
    └── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- MongoDB Atlas account (free tier available)
- Ollama running locally (for AI summarization)

### 0. Setup MongoDB

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster (free tier M0)
3. Create a database user with password
4. Get your connection string
5. Add the connection string to backend `.env` as `MONGODB_URI`

For local development, see [backend/MONGODB_SETUP.md](backend/MONGODB_SETUP.md)

### 1. Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env and add:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
# JWT_SECRET=your-secret-key-here
# OLLAMA_BASE_URL=http://localhost:11434
# PORT=5000
# CORS_ORIGIN=http://localhost:3000

# Start backend server
npm run dev
```

Backend runs on: **http://localhost:5000**

### 2. Setup Frontend

```bash
cd frontend

# Install dependencies
npm install

# Create .env.local file (copy from .env.example if available)
# NEXT_PUBLIC_API_URL=http://localhost:5000

# Start frontend development server
npm run dev
```

Frontend runs on: **http://localhost:3000**

### 3. Start Ollama (for AI summarization)

```bash
# Download and run Ollama (https://ollama.ai)
ollama serve

# In another terminal, pull the model
ollama pull mistral

# Or use another model like llama2, neural-chat, etc.
```

### 4. Test the Application

1. Open http://localhost:3000 in your browser
2. **Register**: Create a new account with email and password
3. **Login**: Sign in with your credentials
4. **Upload PDF**: Upload a research paper PDF
5. **View Summary**: See the AI-generated summary
6. **Save to Profile**: Papers are automatically saved to your account
7. **My Papers**: View all your saved papers in the "My Papers" section
8. **Profile Page**: Click "Profile" to see your statistics and settings
9. **Copy/Download**: Copy summaries or download in multiple formats

## 📋 Quick Commands

### Backend Commands
```bash
cd backend

# Development
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Check for errors
npm run lint
```

### Frontend Commands
```bash
cd frontend

# Development
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Check for linting issues
npm run lint
```

## 🔧 Configuration

### Backend (.env)
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
JWT_SECRET=your-jwt-secret-key
OLLAMA_BASE_URL=http://localhost:11434
PORT=5000
CORS_ORIGIN=http://localhost:3000
NODE_ENV=development
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### Ollama Models
Available models (choose one):
- `mistral` - Fast and efficient
- `neural-chat` - Good for conversations
- `llama2` - Popular open model
- `dolphin-mixtral` - High quality

Pull a model:
```bash
ollama pull mistral
```

## 📚 Features

### ✨ New Features (Latest)
- 🔐 **User Authentication**: Register and login with JWT tokens
- 💾 **Personal Paper Storage**: Papers saved per user in MongoDB
- 📂 **My Papers View**: See all your saved papers in one place
- 👤 **Profile Page**: User profile with statistics and settings
- 📋 **Paper Management**: View, delete, and organize your papers
- 📊 **User Statistics**: Track number of papers summarized
- 📋 **Copy to Clipboard**: Quick copy functionality with feedback
- 🎯 **Per-User Isolation**: Papers are completely isolated per user

### Backend
- ✅ TypeScript support
- ✅ Express.js framework
- ✅ MongoDB integration for persistent storage
- ✅ JWT authentication & authorization
- ✅ PDF parsing with pdf-parse
- ✅ Ollama AI integration (local or remote)
- ✅ File upload validation
- ✅ Size limits (50MB max)
- ✅ Error handling
- ✅ Request logging
- ✅ CORS support
- ✅ Rate limiting
- ✅ Request queuing system
- ✅ Caching layer

### Frontend
- ✅ Next.js 14 with React 18
- ✅ TypeScript
- ✅ Tailwind CSS styling
- ✅ User authentication (Register/Login modals)
- ✅ Drag-and-drop file upload
- ✅ Real-time validation
- ✅ Beautiful gradient UI
- ✅ Responsive design
- ✅ Copy/Download summaries (multiple formats)
- ✅ API connection detection
- ✅ Error notifications & toasts
- ✅ Navigation menu (Home, My Papers, Profile)
- ✅ User profile page with stats
- ✅ My Papers section with saved documents

## 🔐 Security

### Backend
- API key from environment variables
- File type validation (PDF only)
- File size limits
- CORS configuration
- Global error handler
- Automatic file cleanup

### Frontend
- Input validation
- No sensitive data in code
- HTTPS ready
- Environment variable protection

## 📖 API Documentation

### Authentication

**Register**
**POST** `/api/auth/register`
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123","name":"John Doe"}'
```

Response (201):
```json
{
  "message": "User registered successfully",
  "data": {
    "token": "eyJhbGc...",
    "expiresIn": "7d",
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "email": "user@example.com",
      "name": "John Doe"
    }
  }
}
```

**Login**
**POST** `/api/auth/login`
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

Response (200): Same as register

### Papers

**Health Check**
**GET** `/`
```bash
curl http://localhost:5000
```
Response:
```json
{
  "message": "API Running...",
  "status": "ok",
  "timestamp": "2024-04-19T10:30:00.000Z"
}
```

**Upload & Summarize** (Authenticated)
**POST** `/api/paper/upload`
```bash
curl -X POST http://localhost:5000/api/paper/upload \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@research_paper.pdf"
```

Request:
- Content-Type: `multipart/form-data`
- Body: PDF file named `file`
- Headers: `Authorization: Bearer <JWT_TOKEN>`

Response (200):
```json
{
  "summary": "TL;DR: ...\n\nKey Points:\n- ...",
  "paperId": "507f1f77bcf86cd799439011",
  "fileName": "research_paper.pdf",
  "message": "Paper saved to your account"
}
```

Errors:
- `400` - Invalid file (not PDF, empty, too large)
- `401` - Unauthorized (no token or invalid token)
- `413` - File exceeds 50MB
- `500` - Server error

**Get User's Papers** (Authenticated)
**GET** `/api/paper/my-papers`
```bash
curl http://localhost:5000/api/paper/my-papers \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

Response (200):
```json
{
  "papers": [
    {
      "id": "507f1f77bcf86cd799439011",
      "fileName": "paper1.pdf",
      "summary": "TL;DR: ...",
      "createdAt": "2024-04-19T10:30:00.000Z"
    }
  ]
}
```

**Delete Paper** (Authenticated)
**DELETE** `/api/paper/:paperId`
```bash
curl -X DELETE http://localhost:5000/api/paper/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

Response (200):
```json
{
  "message": "Paper deleted successfully"
}
```

## 🧪 Testing

### Prerequisites
- Backend running: `npm run dev` in backend folder
- Frontend running: `npm run dev` in frontend folder
- Ollama running: `ollama serve` in another terminal
- MongoDB Atlas cluster created and connected

### Test Backend
```bash
# In backend folder
npm run dev

# In another terminal
curl http://localhost:5000  # Should return API Running

# Test authentication
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123","name":"Test User"}'
```

### Test Frontend
```bash
# In frontend folder (make sure backend is running)
npm run dev

# Open http://localhost:3000 in browser
```

### Test Full Flow
1. **Backend running**: `npm run dev` in backend folder
2. **Frontend running**: `npm run dev` in frontend folder
3. **Ollama running**: `ollama serve` with a model pulled
4. **Open browser**: http://localhost:3000
5. **Register**: Create a new account
6. **Login**: Sign in with your account
7. **Upload PDF**: Upload a research paper
8. **View Summary**: Wait for AI to generate summary
9. **Save**: Paper should appear in "My Papers" section
10. **Profile**: Click "Profile" to see statistics
11. **Copy/Download**: Test copy and download functionality

### Test Multi-User Scenario
1. Register User 1 and upload a paper
2. Logout and register User 2
3. Upload different paper as User 2
4. Login as User 1 - should only see User 1's papers
5. Verify papers are isolated per user in MongoDB

## 📦 Deployment

### Deploy Backend (Railway, Render, Heroku)

**Using Railway (Recommended):**
1. Create account at [Railway.app](https://railway.app)
2. Connect your GitHub repository
3. Set environment variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: A strong random key
   - `OLLAMA_BASE_URL`: Remote Ollama instance or local
   - `CORS_ORIGIN`: Your frontend URL
4. Deploy automatically on push

**Using Render:**
1. Create account at [Render.com](https://render.com)
2. Create new Web Service from GitHub
3. Build command: `cd backend && npm install`
4. Start command: `cd backend && npm start`
5. Set environment variables in Render dashboard
6. Deploy

### Deploy Frontend (Vercel, Netlify)

**Using Vercel (Recommended):**
1. Push code to GitHub
2. Go to [Vercel.com](https://vercel.com) and connect your repo
3. Set environment variable:
   - `NEXT_PUBLIC_API_URL`: Your backend URL
4. Auto-deploys on push
5. Vercel provides HTTPS by default

**Using Netlify:**
1. Push code to GitHub
2. Connect repository at [Netlify.com](https://netlify.com)
3. Build command: `npm run build`
4. Publish directory: `.next`
5. Set environment variable: `NEXT_PUBLIC_API_URL`
6. Deploy

### MongoDB Atlas Setup for Production
1. Create production cluster (M1 or higher for reliability)
2. Enable automatic backups
3. Configure IP whitelist (allow deployment provider IPs)
4. Create dedicated database user (separate from dev)
5. Enable encryption at rest
6. Use connection string with DNS SRV record

### Complete Deployment Checklist
- [ ] MongoDB Atlas cluster configured
- [ ] Backend environment variables set
- [ ] Frontend environment variables set
- [ ] JWT_SECRET is strong (32+ characters)
- [ ] CORS_ORIGIN matches frontend domain
- [ ] MONGODB_URI is production cluster
- [ ] Ollama is accessible from backend (local or remote)
- [ ] Backend deployed and running
- [ ] Frontend deployed and running
- [ ] Test full flow (register → upload → view papers)
- [ ] Monitor logs for errors
- [ ] Setup monitoring/alerts

## 🐛 Troubleshooting

### Backend Issues

**"MongoDB connection failed"**
- Check MONGODB_URI in .env file
- Verify MongoDB Atlas is running
- Check username and password are correct
- Whitelist your IP in MongoDB Atlas

**"No Ollama API response"**
- Start Ollama: `ollama serve`
- Verify OLLAMA_BASE_URL in .env points to correct address
- Pull a model: `ollama pull mistral`
- Check model is running: `ollama list`

**"JWT_SECRET is not configured"**
- Create .env file in backend folder
- Add `JWT_SECRET=your-secret-key-here`
- Restart server

**"Error processing file"**
- Check PDF is valid and not corrupted
- Ensure file is not empty
- Check file size < 50MB
- Verify PDF contains readable text

**"Rate limited / Request timeout"**
- Wait a few minutes
- Check Ollama is responding
- Verify model is loaded
- Check system resources

### Frontend Issues

**"Backend Not Connected"**
- Start backend: `npm run dev` in backend folder
- Check port 5000 is accessible
- Verify NEXT_PUBLIC_API_URL in .env.local has correct API URL
- Check backend logs for errors

**"Authentication Failed"**
- Verify backend is running
- Check email/password are correct
- Ensure MongoDB is connected
- Look for error messages in console

**"Papers not saving"**
- Login to ensure you're authenticated
- Check "My Papers" after uploading
- Verify MongoDB is connected
- Check Authorization header in browser DevTools

**"Cannot see My Papers"**
- Ensure you're logged in
- Refresh the page
- Check backend logs for token verification errors
- Verify papers exist in MongoDB for your user

**"Build errors"**
- Delete node_modules: `rm -r node_modules` (Windows: `rmdir /s /q node_modules`)
- Clear cache: `npm cache clean --force`
- Reinstall: `npm install`
- Clear Next.js cache: `rm -rf .next` (Windows: `rmdir /s /q .next`)

## 📞 Support

- **Backend Issues**: Check [backend/README.md](backend/README.md)
- **Frontend Issues**: Check [frontend/README.md](frontend/README.md)
- **API Documentation**: Check [backend/TESTING.md](backend/TESTING.md)
- **Architecture**: Check [backend/CODE_STRUCTURE.md](backend/CODE_STRUCTURE.md)

## 🛠 Tech Stack Summary

**Backend:**
- Node.js + Express.js
- TypeScript
- MongoDB Atlas (Database)
- JWT Authentication
- pdf-parse (PDF processing)
- Axios (HTTP client)
- Ollama (Local AI API)
- Multer (File uploads)
- Rate limiting & Request queuing

**Frontend:**
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Axios (API client)
- React Hooks (State management)
- JWT Token storage (localStorage)
- Toast notifications

## 📝 Environment Files

### Backend (.env)
```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Ollama Configuration
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=mistral

# Server Configuration
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

### Frontend (.env.local)
```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### Example .env for Production
```env
# MongoDB (Atlas)
MONGODB_URI=mongodb+srv://prod_user:SecurePassword@prod-cluster.mongodb.net/research-db

# JWT (use a strong random string)
JWT_SECRET=$(openssl rand -base64 32)

# Ollama (could be remote)
OLLAMA_BASE_URL=https://ollama.yourdomain.com
OLLAMA_MODEL=mistral

# Server
PORT=5000
NODE_ENV=production
CORS_ORIGIN=https://yourdomain.com
```

## 🔐 Security

### Backend Security
- JWT tokens for authentication
- Password hashing (bcryptjs)
- File type validation (PDF only)
- File size limits (50MB max)
- Request rate limiting
- CORS configuration
- Input validation & sanitization
- Secure error messages (no sensitive info)
- Environment variables for secrets

### Frontend Security
- Tokens stored securely (localStorage)
- HTTPS ready
- No sensitive data hardcoded
- Input validation before submission
- CORS headers enforced
- Environment variables protection

### MongoDB Security
- IP whitelist enabled
- Encrypted connections (TLS/SSL)
- Database user with minimal permissions
- Regular backups enabled
- Encryption at rest enabled
- Audit logging available

## 🎓 Learning Resources

- [Express.js Guide](https://expressjs.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Ollama Documentation](https://github.com/ollama/ollama)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [JWT Authentication](https://jwt.io/)

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the project
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## ⭐ Planned Features

- [ ] Paper comparison (side-by-side analysis)
- [ ] Paper collections/folders
- [ ] Collaborative folders (share with others)
- [ ] Multiple file formats (DOCX, PPTX, TXT)
- [ ] Batch uploads (multiple papers at once)
- [ ] Custom summary styles (concise, detailed, executive)
- [ ] AI-powered search across your papers
- [ ] Translation support (multilingual)
- [ ] Dark mode UI
- [ ] Keyboard shortcuts
- [ ] Paper annotations and highlights
- [ ] Export collections as PDF/ZIP
- [ ] Paper recommendations based on content
- [ ] Advanced analytics dashboard
- [ ] Paper tagging and categorization
- [ ] Full-text search with filters

---

**Happy Summarizing! 🎉**

For detailed information, check:
- [Backend Setup](backend/MONGODB_SETUP.md)
- [Backend README](backend/README.md)
- [Frontend README](frontend/README.md)
- [Architecture](backend/CODE_STRUCTURE.md)
