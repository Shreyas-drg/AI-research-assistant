# AI Research Paper Summarizer

A full-stack application that uses AI to automatically summarize research papers. Upload a PDF, get an instant summary with key points, TL;DR, and APA citation.

## 🎯 Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Next.js Frontend                         │
│                  (http://localhost:3000)                    │
│         - Upload PDF files                                  │
│         - Display summaries                                 │
│         - Copy/Download results                             │
└────────────────────┬────────────────────────────────────────┘
                     │ API Calls
                     ↓
┌─────────────────────────────────────────────────────────────┐
│                  Express.js Backend                         │
│                 (http://localhost:5000)                     │
│         - Handle file uploads                               │
│         - Parse PDFs                                        │
│         - Call OpenAI API                                   │
│         - Return summaries                                  │
└─────────────────────────────────────────────────────────────┘
```

## 📁 Project Structure

```
AI research assistant/
├── backend/
│   ├── src/
│   │   ├── index.ts              # Express server
│   │   ├── constants.ts          # Configuration
│   │   ├── types.ts              # TypeScript types
│   │   ├── routes/
│   │   │   └── paperRoutes.ts    # PDF upload endpoint
│   │   ├── services/
│   │   │   └── aiService.ts      # OpenAI integration
│   │   └── utils/
│   │       └── helpers.ts        # Utilities
│   ├── uploads/                  # Temporary files
│   ├── .env                      # Backend env vars
│   ├── package.json
│   └── README.md
│
└── frontend/
    ├── app/
    │   ├── components/           # React components
    │   ├── lib/
    │   │   └── api.ts           # API client
    │   ├── page.tsx             # Main page
    │   └── layout.tsx           # Root layout
    ├── .env.local               # Frontend env vars
    ├── package.json
    └── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- OpenAI API key

### 1. Setup Backend

```bash
cd backend

# Install dependencies
npm install @types/pdf-parse
npm install

# Create .env file
cp .env.example .env

# Edit .env and add your OpenAI API key
# OPENAI_API_KEY=sk-...

# Start backend server
npm run dev
```

Backend runs on: **http://localhost:5000**

### 2. Setup Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start frontend development server
npm run dev
```

Frontend runs on: **http://localhost:3000**

### 3. Test the Application

1. Open http://localhost:3000 in your browser
2. Upload a PDF research paper
3. Wait for the summary
4. Copy or download the results

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
OPENAI_API_KEY=your_api_key_here
PORT=5000
CORS_ORIGIN=http://localhost:3000
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## 📚 Features

### Backend
- ✅ TypeScript support
- ✅ Express.js framework
- ✅ PDF parsing with pdf-parse
- ✅ OpenAI GPT-4 integration
- ✅ File upload validation
- ✅ Size limits (50MB max)
- ✅ Error handling
- ✅ Request logging
- ✅ CORS support

### Frontend
- ✅ Next.js 14 with React 18
- ✅ TypeScript
- ✅ Drag-and-drop file upload
- ✅ Real-time validation
- ✅ Beautiful gradient UI
- ✅ Responsive design
- ✅ Copy/Download summaries
- ✅ API connection detection
- ✅ Error notifications

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

### Health Check
**GET** `/`
```bash
curl http://localhost:5000
```
Response:
```json
{
  "message": "API Running...",
  "status": "ok",
  "timestamp": "2024-04-11T10:30:00.000Z"
}
```

### Upload & Summarize
**POST** `/api/paper/upload`
```bash
curl -X POST http://localhost:5000/api/paper/upload \
  -F "file=@research_paper.pdf"
```

Request:
- Content-Type: `multipart/form-data`
- Body: PDF file named `file`

Response (200):
```json
{
  "summary": "TL;DR: ...\n\nKey Points:\n- ...\n\nSimple Explanation: ...\n\nKeywords: ...\n\nAPA Citation: ..."
}
```

Errors:
- `400` - Invalid file (not PDF, empty, too large)
- `413` - File exceeds 50MB
- `500` - Server error

## 🧪 Testing

### Test Backend
```bash
# In backend folder
npm run dev

# In another terminal
curl http://localhost:5000  # Should return API Running
```

### Test Frontend
```bash
# In frontend folder (make sure backend is running)
npm run dev

# Open http://localhost:3000 in browser
```

### Test Full Flow
1. Backend running: `npm run dev` in backend folder
2. Frontend running: `npm run dev` in frontend folder
3. Open http://localhost:3000
4. Upload a PDF
5. View summary

## 📦 Deployment

### Deploy Backend (Heroku, Railway, Render)
```bash
cd backend
# Follow platform-specific instructions
# Make sure OPENAI_API_KEY is set in environment variables
```

### Deploy Frontend (Vercel, Netlify)
```bash
cd frontend
# For Vercel: just push to GitHub, Vercel auto-deploys
# For Netlify: npm run build && deploy
# Make sure NEXT_PUBLIC_API_URL points to deployed backend
```

## 🐛 Troubleshooting

### Backend Issues

**"OPENAI_API_KEY is not configured"**
- Create .env file in backend folder
- Add your OpenAI API key
- Restart server

**"Error processing file"**
- Check PDF is valid
- Ensure file is not corrupted
- Check file size < 50MB

**"Rate limited by OpenAI"**
- Wait a few minutes
- Check your API quota
- Upgrade API plan if needed

### Frontend Issues

**"Backend Not Connected"**
- Start backend: `npm run dev` in backend folder
- Check port 5000 is accessible
- Verify .env.local has correct API URL

**"Please upload a PDF file"**
- Only PDFs are supported
- Check file extension

**Build errors**
- Delete node_modules: `rm -r node_modules`
- Clear cache: `npm cache clean --force`
- Reinstall: `npm install`

## 📞 Support

- **Backend Issues**: Check [backend/README.md](backend/README.md)
- **Frontend Issues**: Check [frontend/README.md](frontend/README.md)
- **API Documentation**: Check [backend/TESTING.md](backend/TESTING.md)
- **Architecture**: Check [backend/CODE_STRUCTURE.md](backend/CODE_STRUCTURE.md)

## 🛠 Tech Stack Summary

**Backend:**
- Node.js + Express.js
- TypeScript
- pdf-parse
- Axios
- OpenAI API

**Frontend:**
- Next.js 14
- React 18
- TypeScript
- CSS Modules
- Axios

## 📝 Environment Files

### Backend (.env)
```env
OPENAI_API_KEY=sk-...  # Your OpenAI API key
PORT=5000              # Server port
CORS_ORIGIN=http://localhost:3000  # Frontend URL
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000  # Backend URL
```

## 🎓 Learning Resources

- [Express.js Guide](https://expressjs.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [OpenAI API Reference](https://platform.openai.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the project
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## ⭐ Features Coming Soon

- [ ] User authentication
- [ ] Save summaries to database
- [ ] Multiple file formats (DOCX, PPT)
- [ ] Batch uploads
- [ ] Custom summary styles
- [ ] Translation support
- [ ] Dark mode
- [ ] History/favorites

---

**Happy Summarizing! 🎉**

For detailed setup and troubleshooting, check individual README files in backend/ and frontend/ folders.
