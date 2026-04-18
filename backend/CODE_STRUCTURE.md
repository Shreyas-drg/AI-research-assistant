# Code Structure & Architecture

## Project Overview

```
backend/
├── src/
│   ├── index.ts                 # Express app entry point
│   ├── constants.ts             # Centralized constants & configurations
│   ├── types.ts                 # TypeScript type definitions
│   ├── routes/
│   │   └── paperRoutes.ts       # PDF upload endpoint handler
│   ├── services/
│   │   └── aiService.ts         # OpenAI API integration
│   └── utils/
│       └── helpers.ts           # Utility functions (logger, validators)
├── uploads/                     # Temporary uploaded files (auto-deleted)
├── dist/                        # Compiled JavaScript (generated)
├── .env                         # Environment variables (gitignored)
├── .env.example                 # Environment template
├── .gitignore                   # Git ignore rules
├── package.json                 # Dependencies & scripts
├── tsconfig.json                # TypeScript configuration
├── README.md                    # Project documentation
├── TESTING.md                   # Testing guide
└── CODE_STRUCTURE.md            # This file
```

## File-by-File Overview

### `src/index.ts` - Server Entry Point
**Purpose:** Initialize Express app, configure middleware, and start the server

**Key Features:**
- Environment validation (ensures OPENAI_API_KEY exists)
- CORS configuration
- JSON payload limits (50MB)
- Request logging middleware
- Error handling
- Health check endpoint

**Key Functions:**
- `app.listen(PORT)` - Starts the server

### `src/constants.ts` - Configuration & Constants
**Purpose:** Centralize all magic strings and numbers for easy maintenance

**Exports:**
- `FILE_UPLOAD` - File constraints (size, type, directory)
- `API` - OpenAI API config (model, timeout, tokens)
- `HTTP_STATUS` - Standard HTTP status codes
- `ERROR_MESSAGES` - Consistent error messages
- `SUCCESS_MESSAGES` - Success response messages

**Why centralize?** Makes it easy to change limits or messages in one place without searching through all files.

### `src/types.ts` - TypeScript Types
**Purpose:** Define all TypeScript interfaces for type safety

**Interfaces:**
- `ApiResponse<T>` - Standard API response format
- `PaperSummary` - PDF summary response
- `UploadedFile` - Multer uploaded file
- `ErrorResponse` - Error response format

### `src/routes/paperRoutes.ts` - API Endpoints
**Purpose:** Handle PDF upload and processing requests

**Endpoint:** `POST /api/paper/upload`

**Process Flow:**
```
1. Client sends PDF file
2. Multer validates file (type, size)
3. Server reads and parses PDF
4. Text is extracted and validated
5. OpenAI summarizes the text
6. Response sent to client
7. Temporary file is deleted (finally block)
```

**Error Handling:**
- Validates file exists
- Checks MIME type (must be `application/pdf`)
- Checks file size > 0
- Validates PDF has readable text
- Handles API errors gracefully
- Ensures file cleanup with try-finally

### `src/services/aiService.ts` - OpenAI Integration
**Purpose:** Connect to OpenAI API and generate summaries

**Function:** `summarizeText(text: string): Promise<string>`

**Process:**
1. Validates input text is not empty
2. Checks OPENAI_API_KEY environment variable
3. Sends request to OpenAI API
4. Extracts summary from response
5. Handles specific API errors:
   - 401: Invalid API key
   - 429: Rate limit exceeded
   - 500: OpenAI server error

**Key Config:**
- Model: `gpt-4o-mini` (cost-effective)
- Temperature: `0.7` (balanced creativity)
- Max tokens: `1500` (controls response length)
- Timeout: `30s`

### `src/utils/helpers.ts` - Utility Functions
**Purpose:** Reusable utilities and middleware

**Functions:**
- `logger()` - Express middleware that logs all requests
- `validateEnv(variable: string)` - Ensures environment variables exist
- `getSafeErrorMessage()` - Extract error message safely
- `formatResponse()` - Standard success response format
- `formatError()` - Standard error response format

## Data Flow

### Request-Response Cycle
```
┌──────────────────────────────────────────┐
│  Client sends PDF file                   │
└──────────────────────────────────────────┘
              ↓
┌──────────────────────────────────────────┐
│  Multer middleware validates file        │
│  - Check type (must be PDF)              │
│  - Check size (max 50MB)                 │
└──────────────────────────────────────────┘
              ↓
┌──────────────────────────────────────────┐
│  paperRoutes.ts handler processes:       │
│  1. Read PDF from disk                   │
│  2. Parse with pdf-parse library         │
│  3. Extract text                         │
│  4. Validate text exists                 │
│  5. Limit to 8000 chars                  │
└──────────────────────────────────────────┘
              ↓
┌──────────────────────────────────────────┐
│  aiService.summarizeText() calls:        │
│  OpenAI API (gpt-4o-mini)                │
│  with text + prompt                      │
└──────────────────────────────────────────┘
              ↓
┌──────────────────────────────────────────┐
│  Response returned with summary          │
│  (TL;DR, Key Points, etc.)               │
└──────────────────────────────────────────┘
```

## Environment Variables

| Variable | Purpose | Required |
|----------|---------|----------|
| `OPENAI_API_KEY` | OpenAI API authentication | ✅ Yes |
| `PORT` | Server port | ❌ No (default: 5000) |
| `CORS_ORIGIN` | Allowed frontend URL | ❌ No (default: http://localhost:3000) |

## Dependencies & Why

```
express          - Web server framework
cors             - Handle cross-origin requests  
dotenv           - Load environment variables
multer           - Handle file uploads
pdf-parse        - Extract text from PDFs
axios            - Make HTTP requests to OpenAI
typescript       - Type-safe development
ts-node-dev      - Run TypeScript during development
```

## Error Handling Strategy

**3-Layer Error Handling:**

1. **Route Level (paperRoutes.ts)**
   - Validates input (file exists, type, size)
   - Handles file system errors
   - Returns specific status codes

2. **Service Level (aiService.ts)**
   - Validates input parameters
   - Catches API errors
   - Throws meaningful error messages

3. **Global Level (index.ts)**
   - Catches unhandled errors
   - Returns consistent error response
   - Logs errors for debugging

## Security Features

✅ **File Validation**
- Type check (must be PDF)
- Size limit (50MB max)
- Empty file detection

✅ **API Security**
- Never expose API keys in logs
- Use environment variables
- Timeout protection (30s)

✅ **Input Safety**
- Text truncated (8000 chars max)
- No file path traversal
- Auto file cleanup

✅ **HTTP Security**
- CORS configuration
- 404 handler
- Global error handler

## Performance Considerations

1. **File Upload Limits**
   - 50MB file size limit (prevent DOS)
   - 8000 character text limit (faster API response)

2. **Request Timeout**
   - 30 second timeout on OpenAI calls
   - Prevents hanging requests

3. **File Cleanup**
   - Temporary files deleted immediately
   - Uses try-finally for guaranteed cleanup

4. **Request Logging**
   - Logs all requests with timestamp and duration
   - Helps identify slow endpoints

## Testing the Code

### Unit Test Example (Pseudo-code)
```typescript
// Test that invalid file types are rejected
test('should reject non-PDF files', async () => {
  const response = await request(app)
    .post('/api/paper/upload')
    .attach('file', 'document.txt')
  
  expect(response.status).toBe(400)
  expect(response.body.error).toContain('PDF')
})

// Test that API validates file size
test('should reject files over 50MB', async () => {
  // Create 51MB file
  const response = await request(app)
    .post('/api/paper/upload')
    .attach('file', largeFile)
  
  expect(response.status).toBe(413)
})
```

## Future Improvements

1. **Database Integration**
   - Store summary history
   - Track user uploads

2. **Authentication**
   - Add JWT tokens
   - User accounts

3. **Caching**
   - Cache summaries for same files
   - Reduce API calls

4. **Rate Limiting**
   - Limit requests per user
   - Prevent abuse

5. **File Formats**
   - Support DOCX, PPT
   - Web scraping

6. **Advanced Summaries**
   - Customizable prompt
   - Multiple summary formats
   - Translation support

## Running & Deploying

**Development:**
```bash
npm run dev
```

**Build for Production:**
```bash
npm run build
npm start
```

**Docker Deployment:**
```dockerfile
FROM node:20
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 5000
CMD ["npm", "start"]
```

## References

- [Express.js Docs](https://expressjs.com/)
- [TypeScript Docs](https://www.typescriptlang.org/)
- [OpenAI API Docs](https://platform.openai.com/docs)
- [Multer Upload Docs](https://github.com/expressjs/multer)
- [PDF-Parse Docs](https://www.npmjs.com/package/pdf-parse)
