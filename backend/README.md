# AI Research Assistant - Backend

A TypeScript/Express backend API for summarizing research papers with user authentication and personal paper storage. Uses Ollama for local AI inference and MongoDB for data persistence.

## Features

- 🔐 **User Authentication** - JWT-based register and login
- 📄 **PDF File Upload & Parsing** - Secure file upload with validation
- 🤖 **AI Summarization** - Local Ollama inference (no cloud AI costs)
- 💾 **Personal Paper Storage** - MongoDB per-user paper persistence
- 📂 **My Papers API** - Retrieve user's saved papers
- 🔒 **Security** - JWT tokens, file type validation, size limits
- ⚡ **Error Handling** - Comprehensive error messages and logging
- 🌐 **CORS Support** - Configurable CORS origin
- 📊 **Type-safe** - Full TypeScript codebase
- 🚦 **Rate Limiting** - Request rate limiting and queuing
- 💾 **Caching Layer** - Response caching for optimization
- 🔍 **Database Indexes** - Optimized MongoDB queries

## Tech Stack

- **Runtime**: Node.js 18+
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: MongoDB Atlas
- **Authentication**: JWT (jsonwebtoken)
- **PDF Parsing**: pdf-parse
- **AI**: Ollama (Local)
- **File Upload**: Multer
- **Password Hashing**: bcryptjs
- **HTTP Client**: Axios

## Prerequisites

- Node.js 18+ and npm
- MongoDB Atlas account (free tier available)
- Ollama running locally (for AI summarization)

## Installation

### 1. Clone/Navigate to the project:
```bash
cd backend
```

### 2. Install dependencies:
```bash
npm install
```

### 3. Create `.env` file with required variables:
```bash
# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this

# Ollama Configuration
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=mistral

# Server Configuration
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

### 4. Setup Ollama (for AI summarization):
```bash
# Download Ollama from https://ollama.ai
# Run in another terminal
ollama serve

# Pull a model in another terminal
ollama pull mistral
# Or: ollama pull neural-chat, ollama pull llama2, etc.
```

### 5. MongoDB Setup:
See [MONGODB_SETUP.md](./MONGODB_SETUP.md) for detailed instructions.

## Development

Start the development server:
```bash
npm run dev
```

The server will run on `http://localhost:5000`

## Production Build

```bash
npm run build
npm start
```

## API Endpoints

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
  "timestamp": "2024-04-19T10:30:00.000Z"
}
```

### Authentication

**POST** `/api/auth/register`

Register a new user.

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123","name":"John Doe"}'
```

**Request:**
- Content-Type: `application/json`
- Body: `{ email: string, password: string, name?: string }`

**Success Response (201):**
```json
{
  "message": "User registered successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "expiresIn": "7d",
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "email": "user@example.com",
      "name": "John Doe"
    }
  }
}
```

**POST** `/api/auth/login`

Login with credentials.

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

**Response:** Same as register (201/200)

### Papers

**POST** `/api/paper/upload` (Authenticated)

Upload and summarize a research paper.

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Headers: `Authorization: Bearer <JWT_TOKEN>`
- Body: `file` (PDF file)

**Example with cURL:**
```bash
curl -X POST http://localhost:5000/api/paper/upload \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@paper.pdf"
```

**Success Response (200):**
```json
{
  "summary": "TL;DR: ...\n\nKey Points:\n- ...",
  "paperId": "507f1f77bcf86cd799439011",
  "fileName": "paper.pdf",
  "message": "Paper saved to your account"
}
```

**GET** `/api/paper/my-papers` (Authenticated)

Get all papers saved by the authenticated user.

```bash
curl http://localhost:5000/api/paper/my-papers \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Success Response (200):**
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

**DELETE** `/api/paper/:paperId` (Authenticated)

Delete a paper.

```bash
curl -X DELETE http://localhost:5000/api/paper/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Error Responses:**
- `400` - Bad request (no file, invalid format, empty file)
- `401` - Unauthorized (invalid/missing token)
- `413` - File exceeds 50MB limit
- `500` - Server error

## Configuration

### Environment Variables

| Variable | Default | Required | Description |
|----------|---------|----------|-------------|
| `MONGODB_URI` | - | ✅ Yes | MongoDB Atlas connection string |
| `JWT_SECRET` | - | ✅ Yes | Secret key for JWT signing |
| `OLLAMA_BASE_URL` | http://localhost:11434 | ❌ No | Ollama API endpoint |
| `OLLAMA_MODEL` | mistral | ❌ No | Ollama model to use |
| `PORT` | 5000 | ❌ No | Server port |
| `NODE_ENV` | development | ❌ No | Environment (development/production) |
| `CORS_ORIGIN` | http://localhost:3000 | ❌ No | Allowed frontend URL |

### File Limits

- **Max File Size**: 50MB
- **Max Text Processing**: 8000 characters per file
- **JWT Expiration**: 7 days

## Project Structure

```
backend/
├── src/
│   ├── index.ts                    # Server entry point
│   ├── constants.ts                # Configuration constants
│   ├── types.ts                    # TypeScript types
│   ├── db/
│   │   └── mongodb.ts              # MongoDB connection
│   ├── middleware/
│   │   └── rateLimiter.ts          # Rate limiting
│   ├── routes/
│   │   ├── authRoutes.ts           # Authentication endpoints
│   │   └── paperRoutes.ts          # Paper upload/retrieval endpoints
│   ├── services/
│   │   └── aiService.ts            # Ollama AI integration
│   ├── types/
│   │   └── user.ts                 # User type definitions
│   └── utils/
│       ├── authUtils.ts            # JWT utilities
│       ├── cache.ts                # Caching layer
│       ├── helpers.ts              # Helper functions
│       └── requestQueue.ts         # Request queuing
├── uploads/                        # Temporary file storage
├── .env                            # Environment variables (gitignored)
├── .env.example                    # Example env file
├── .gitignore                      # Git ignore file
├── package.json                    # Dependencies
├── tsconfig.json                   # TypeScript config
├── MONGODB_SETUP.md                # MongoDB setup guide
├── TESTING.md                      # Testing guide
└── README.md                       # This file
```

## Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  email: String (unique),
  password: String (hashed),
  name: String,
  createdAt: Date
}
```

### Papers Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (references User),
  fileName: String,
  fileHash: String (MD5),
  summary: String,
  createdAt: Date
}
```

**Indexes:**
- userId (for fast per-user queries)
- createdAt (for sorting by date)
- fileHash (for duplicate detection)

## Error Handling

The API provides detailed error messages:

- **Invalid PDF**: "Please upload a PDF file"
- **Empty file**: "File is empty"
- **No text**: "PDF contains no readable text"
- **File too large**: "File size exceeds 50MB limit"
- **Authentication failed**: "Invalid email or password"
- **Token expired**: "Token has expired"
- **Ollama error**: "Failed to connect to Ollama API"
- **Generic error**: "Error processing file"

## Security Features

✅ JWT authentication
✅ Password hashing (bcryptjs)
✅ File type validation (PDF only)
✅ File size limits (50MB max)
✅ Empty file detection
✅ PDF content validation
✅ Automatic file cleanup
✅ API keys from environment variables
✅ CORS origin validation
✅ Global error handler
✅ Request rate limiting
✅ Secure headers
✅ Database user isolation

## Security Warnings

⚠️ **Never commit `.env` file**
⚠️ **Keep JWT_SECRET secret (use 32+ character random string)**
⚠️ **Use HTTPS in production**
⚠️ **Set appropriate CORS_ORIGIN**
⚠️ **Whitelist MongoDB Atlas IP**
⚠️ **Monitor MongoDB usage for security**

## Troubleshooting

### "MongoDB connection failed"
- Check MONGODB_URI in .env file
- Verify MongoDB Atlas cluster is running
- Check username and password are correct
- Ensure IP is whitelisted in MongoDB Atlas

### "No Ollama API response"
- Start Ollama: `ollama serve`
- Verify OLLAMA_BASE_URL in .env points to correct address
- Pull a model: `ollama pull mistral`
- Check model is running: `ollama list`

### "JWT_SECRET is not configured"
- Check that `.env` file exists in the backend folder
- Verify `JWT_SECRET` is set
- Use a strong random string (32+ characters)
- Restart the server after updating `.env`

### "Authentication failed"
- Verify credentials are correct
- Check MongoDB is connected
- Check user exists in database
- Look for error messages in backend logs

### "Request timeout"
- Try with a smaller PDF
- Check internet connection
- Verify Ollama API is responding
- Check system resources

## Testing

See [TESTING.md](./TESTING.md) for detailed testing instructions.

## Contributing

Contributions welcome! Please:
1. Fork the repo
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Create Pull Request

## License

MIT

## Support

For issues or questions:
- Check the troubleshooting section
- Review [MONGODB_SETUP.md](./MONGODB_SETUP.md)
- Check [TESTING.md](./TESTING.md)
- Review backend logs with `npm run dev`

## References

- [Express.js Docs](https://expressjs.com)
- [MongoDB Docs](https://docs.mongodb.com)
- [JWT.io](https://jwt.io)
- [Ollama GitHub](https://github.com/ollama/ollama)
- [TypeScript Docs](https://www.typescriptlang.org/)
