# AI Research Assistant - Backend

A TypeScript/Express backend API for summarizing research papers using OpenAI's GPT-4.

## Features

- 📄 PDF file upload and parsing
- 🤖 Automated research paper summarization using OpenAI
- 🔒 Security validations (file type, size limits)
- ⚡ Error handling and logging
- 🌐 CORS support
- 📊 Type-safe TypeScript codebase

## Tech Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **PDF Parsing**: pdf-parse
- **AI**: OpenAI API (GPT-4 Mini)
- **File Upload**: Multer

## Installation

### Prerequisites
- Node.js 18+ and npm
- OpenAI API key

### Setup

1. **Clone/Navigate to the project:**
```bash
cd backend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create `.env` file** (copy from `.env.example`):
```bash
OPENAI_API_KEY=your_api_key_here
PORT=5000
CORS_ORIGIN=http://localhost:3000
```

4. **Install additional types (if not already done):**
```bash
npm install @types/pdf-parse
```

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

### POST /api/paper/upload

Upload and summarize a research paper.

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body: `file` (PDF file)

**Example with cURL:**
```bash
curl -X POST http://localhost:5000/api/paper/upload \
  -F "file=@paper.pdf"
```

**Success Response (200):**
```json
{
  "summary": "TL;DR: ...\n\nKey Points:\n- ...\n\nSimple Explanation: ..."
}
```

**Error Responses:**
- `400` - No file, invalid format, or empty file
- `413` - File exceeds 50MB limit
- `500` - Server error

## Configuration

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `OPENAI_API_KEY` | Required | Your OpenAI API key |
| `PORT` | 5000 | Server port |
| `CORS_ORIGIN` | http://localhost:3000 | Allowed frontend URL |

### File Limits

- **Max File Size**: 50MB
- **Max Text Processing**: 8000 characters
- **API Timeout**: 30 seconds

## Project Structure

```
backend/
├── src/
│   ├── index.ts              # Server entry point
│   ├── routes/
│   │   └── paperRoutes.ts    # Paper upload endpoint
│   └── services/
│       └── aiService.ts      # OpenAI integration
├── uploads/                  # Temporary file storage
├── .env                      # Environment variables (gitignored)
├── .env.example              # Example env file
├── .gitignore               # Git ignore file
├── package.json             # Dependencies
├── tsconfig.json            # TypeScript config
└── README.md                # This file
```

## Error Handling

The API provides detailed error messages:

- **Invalid PDF**: "Please upload a PDF file"
- **Empty file**: "File is empty"
- **No text**: "PDF contains no readable text"
- **File too large**: "File size exceeds 50MB limit"
- **API error**: "Authentication failed with OpenAI" or "Rate limited by OpenAI"
- **Generic error**: "Error processing file"

## Security Features

✅ File type validation (PDF only)
✅ File size limits (50MB max)
✅ Empty file detection
✅ PDF content validation
✅ Automatic file cleanup
✅ API key from environment variables
✅ CORS origin validation
✅ Global error handler
✅ Timeout protection (30s)

## Security Warnings

⚠️ **Never commit `.env` file**
⚠️ **Keep API keys secret**
⚠️ **Use HTTPS in production**
⚠️ **Set appropriate CORS_ORIGIN**
⚠️ **Monitor API usage to avoid unexpected costs**

## Troubleshooting

### "OPENAI_API_KEY is not configured"
- Check that `.env` file exists in the backend folder
- Verify `OPENAI_API_KEY` is set correctly
- Restart the server after updating `.env`

### "File read error"
- Check file permissions
- Ensure `uploads/` folder exists
- Try with a smaller PDF file

### "Rate limited by OpenAI"
- Wait a few minutes before retrying
- Check your OpenAI API usage
- Consider upgrading your API plan

### "Request timeout"
- Try with a smaller PDF
- Check your internet connection
- Verify OpenAI API is not down

## License

MIT
