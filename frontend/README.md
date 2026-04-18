# AI Research Assistant - Frontend

A modern Next.js 14 frontend for the AI research paper summarizer application.

## Features

- 📄 Drag-and-drop PDF upload
- ⚡ Real-time file validation
- 🎯 Beautiful UI with gradient background
- 📱 Fully responsive design
- 🔗 Auto API connection detection
- 📋 Copy and download summaries
- 🎭 Smooth animations and transitions
- ♿ Accessible components

## Tech Stack

- **Framework**: Next.js 14 (React 18)
- **Language**: TypeScript
- **Styling**: CSS Modules
- **HTTP Client**: Axios
- **Package Manager**: npm

## Prerequisites

- Node.js 18+
- npm
- Backend API running on http://localhost:5000

## Installation

### 1. Navigate to frontend folder:
```bash
cd frontend
```

### 2. Install dependencies:
```bash
npm install
```

### 3. Setup environment (optional):
```bash
# Create .env.local (already provided as .env.example)
echo "NEXT_PUBLIC_API_URL=http://localhost:5000" > .env.local
```

## Development

Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Production Build

Build for production:
```bash
npm run build
npm start
```

## Project Structure

```
frontend/
├── app/
│   ├── components/           # React components
│   │   ├── FileUpload.tsx    # File upload component
│   │   └── SummaryDisplay.tsx # Summary display component
│   ├── lib/
│   │   └── api.ts            # API client
│   ├── page.tsx              # Main page
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
├── public/                    # Static assets
├── .env.local                # Environment variables
├── next.config.js            # Next.js config
├── tsconfig.json             # TypeScript config
├── package.json              # Dependencies
└── README.md                 # This file
```

## Components

### FileUpload
Handles PDF file selection with drag-and-drop support.

**Props:**
- `onFileSelect` - Callback when file is selected
- `isLoading` - Show loading state
- `disabled` - Disable upload

**Features:**
- Drag and drop
- Click to browse
- File type validation (PDF only)
- File size validation (50MB max)

### SummaryDisplay
Displays the generated summary with action buttons.

**Props:**
- `summary` - The summary text
- `fileName` - Name of uploaded file
- `onReset` - Callback to reset view

**Features:**
- Copy to clipboard
- Download as text file
- Upload another file
- Scrollable content area

## API Integration

The frontend communicates with the backend API. Make sure the backend is running:

```bash
# In backend folder
npm run dev
```

### API Endpoint

**POST** `/api/paper/upload`
- Accepts: multipart/form-data (PDF file)
- Returns: `{ summary: string }`

## Environment Variables

| Variable | Default | Required |
|----------|---------|----------|
| `NEXT_PUBLIC_API_URL` | http://localhost:5000 | ❌ No |

**Note:** Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser.

## Styling

The project uses CSS Modules for component styling and global CSS for shared styles.

- **CSS Modules**: Each component has a `.module.css` file
- **Global Styles**: `app/globals.css` for body and HTML styles
- **Color Scheme**: Purple gradient background with clean white cards
- **Responsive**: Mobile-first approach with media queries

## Features in Detail

### 1. File Upload
- Drag and drop support
- Click to browse
- File type validation (PDF only)
- Size limit validation (50MB)
- Loading state with spinner

### 2. Summary Display
- Clean, readable format
- Copy summary to clipboard
- Download as text file
- Upload another file
- Close/reset button

### 3. Error Handling
- API connection detection
- File validation errors
- API errors with messages
- Dismissible error alerts

### 4. Responsive Design
- Mobile-optimized
- Tablet support
- Desktop-enhanced
- Touch-friendly buttons

## Testing

### Manual Testing

1. **Start servers:**
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev
   
   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

2. **Upload a PDF:**
   - Go to http://localhost:3000
   - Upload a PDF file
   - Wait for summary

3. **Test features:**
   - Copy summary button
   - Download summary button
   - Upload another file

### Test with Sample PDF

Use any research paper PDF or create a test one:

```bash
# Using ReportLab (Python)
python -c "
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
c = canvas.Canvas('test.pdf', pagesize=letter)
c.drawString(100, 750, 'Sample Research Paper')
c.save()
"
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## Performance

- **Code Splitting**: Automatic with Next.js
- **Image Optimization**: Handled by Next.js
- **CSS**: Optimized CSS modules
- **Request Timeout**: 60 seconds

## Security

✅ Input validation (file type, size)
✅ No sensitive data in frontend
✅ HTTPS ready
✅ Environment variable protection
✅ CORS handled by backend

## Troubleshooting

### "Backend Not Connected"
- Check backend is running: `npm run dev` in backend folder
- Verify port 5000 is accessible
- Check .env.local has correct API URL

### "Please upload a PDF file"
- Only PDF files are supported
- Check file extension is .pdf
- Try a different PDF

### "File size exceeds 50MB limit"
- Upload a smaller PDF
- Split large PDFs

### Build errors
- Delete `node_modules` and `.next`
- Run `npm install` again
- Clear npm cache: `npm cache clean --force`

## Deployment

### Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Deploy to Netlify

```bash
# Build
npm run build

# Deploy the .next folder
```

### Docker

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

## Future Improvements

1. **Authentication**
   - User accounts
   - Save summaries

2. **Database**
   - Store history
   - User preferences

3. **Features**
   - Multiple file formats
   - Batch uploads
   - Custom prompts
   - Different summary styles

4. **Performance**
   - Image optimization
   - Code splitting
   - Caching

## Contributing

Contributions welcome! Please:
1. Fork the repo
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## License

MIT

## Support

For issues or questions:
- Check the troubleshooting section
- Review backend README.md
- Contact support

## References

- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [TypeScript Docs](https://www.typescriptlang.org/)
- [Axios Docs](https://axios-http.com/)
