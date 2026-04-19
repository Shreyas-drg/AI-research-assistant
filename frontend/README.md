# AI Research Assistant - Frontend

A modern Next.js 14 frontend for the AI research paper summarizer with user authentication, personal paper storage, and a complete research assistant experience.

## Features

- 🔐 **User Authentication** - Register and login with JWT tokens
- 📄 **PDF Upload & Summarization** - Upload papers and get AI summaries
- 💾 **Personal Paper Storage** - Save papers to your account
- 📂 **My Papers** - View all your saved research papers
- 👤 **User Profile** - Profile page with statistics and settings
- 📋 **Copy to Clipboard** - Quick copy with visual feedback
- 📥 **Download Summaries** - Export in multiple formats (TXT, MD, JSON, CSV, HTML)
- 🎯 **Beautiful UI** - Gradient design with smooth animations
- 📱 **Fully Responsive** - Mobile, tablet, and desktop support
- 🔗 **Auto API Detection** - Connection status monitoring
- ♿ **Accessible** - WCAG compliant components
- 🚀 **Fast Performance** - Code splitting and optimization

## Tech Stack

- **Framework**: Next.js 14 (React 18)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **State Management**: React Context API & Hooks
- **Authentication**: JWT tokens (localStorage)
- **Package Manager**: npm

## Prerequisites

- Node.js 18+
- npm or yarn
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

### 3. Create `.env.local` file:
```bash
# Create .env.local (or copy from .env.example)
echo "NEXT_PUBLIC_API_URL=http://localhost:5000" > .env.local
```

### 4. Ensure backend is running:
```bash
# In another terminal
cd ../backend
npm run dev
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
│   ├── components/
│   │   ├── Navbar.tsx               # Top navigation with menu
│   │   ├── FileUpload.tsx            # File upload component
│   │   ├── SummaryDisplay.tsx        # Summary display with copy/download
│   │   ├── ComparisonDisplay.tsx     # Side-by-side comparison
│   │   ├── ComparisonFileUpload.tsx  # Comparison file upload
│   │   ├── AuthModal.tsx             # Login/Register modal
│   │   └── UserProfile.tsx           # User profile component
│   ├── context/
│   │   └── AuthContext.tsx           # Auth state management
│   ├── lib/
│   │   ├── api.ts                    # API client & functions
│   │   ├── downloadUtils.tsx         # Download utilities
│   │   ├── highlightKeywords.tsx     # Keyword highlighting
│   │   └── searchUtils.tsx           # Search utilities
│   ├── profile/
│   │   └── page.tsx                  # User profile page
│   ├── page.tsx                      # Main home page
│   ├── layout.tsx                    # Root layout
│   ├── globals.css                   # Global Tailwind styles
│   └── globals.d.ts                  # Type definitions
├── public/                            # Static assets
├── .env.local                         # Environment variables
├── next.config.js                     # Next.js configuration
├── tsconfig.json                      # TypeScript configuration
├── tailwind.config.ts                 # Tailwind CSS configuration
├── postcss.config.js                  # PostCSS configuration
├── package.json                       # Dependencies
└── README.md                          # This file
```

## Components

### Navbar
Navigation component with menu dropdown and authentication options.

**Features:**
- Home and My Papers links
- User profile dropdown
- Authentication status
- Logout functionality

### FileUpload
Main file upload component for PDF selection.

**Props:**
- `onFileSelect` - Callback when file is selected
- `isLoading` - Show loading state
- `disabled` - Disable upload

**Features:**
- Drag and drop support
- Click to browse
- File type validation (PDF only)
- File size validation (50MB max)
- Loading state with spinner

### SummaryDisplay
Displays the generated summary with action buttons.

**Props:**
- `summary` - The summary text
- `fileName` - Name of uploaded file
- `onReset` - Callback to reset view
- `paperId` - ID of saved paper

**Features:**
- Copy to clipboard with toast feedback
- Download as multiple formats:
  - Plain text (.txt)
  - Markdown (.md)
  - JSON (.json)
  - CSV (.csv)
  - HTML (.html)
- Upload another file
- Scrollable content area
- Keyword highlighting

### ComparisonDisplay
Shows multiple papers side-by-side for comparison.

**Props:**
- `papers` - Array of papers to compare
- `onReset` - Callback to reset view

**Features:**
- Grid layout (up to 3 papers per row)
- Copy all summaries
- Download comparison
- Search within summaries
- Responsive design

### AuthModal
Login and registration modal.

**Features:**
- Toggle between login and register
- Email validation
- Password strength indicator
- Error messages
- Loading states
- Auto-dismiss on success

### UserProfile
User profile display component.

**Features:**
- User avatar with initial
- Member date
- Paper count
- User statistics
- Settings panel
- View My Papers button

## API Integration

The frontend communicates with the backend API. Make sure the backend is running on port 5000.

### Authentication Flow

1. **Register** - Create new account with email/password
2. **Login** - Get JWT token
3. **Store Token** - Save in localStorage
4. **Send with Requests** - Attach `Authorization: Bearer <token>` header
5. **Auto Logout** - Redirect to home if token expires

### API Endpoints Used

**Authentication:**
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login with credentials

**Papers:**
- `POST /api/paper/upload` - Upload and summarize paper
- `GET /api/paper/my-papers` - Get user's saved papers
- `DELETE /api/paper/:paperId` - Delete a paper

## Environment Variables

| Variable | Default | Required | Description |
|----------|---------|----------|-------------|
| `NEXT_PUBLIC_API_URL` | http://localhost:5000 | ❌ No | Backend API URL |

**Note:** Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser.

## Styling

The project uses Tailwind CSS for styling with a custom theme.

- **Tailwind CSS**: Utility-first CSS framework
- **Global Styles**: `app/globals.css` for shared styles
- **Color Scheme**: Gradient backgrounds with clean cards
- **Responsive**: Mobile-first approach with breakpoints
- **Animations**: Smooth transitions and hover effects

### Tailwind Configuration
- Customized colors and spacing
- Gradient utilities
- Animation utilities
- Responsive breakpoints

## Features in Detail

### 1. Authentication
- Email and password validation
- Secure JWT token storage
- Auto-login on page reload
- Token expiration handling
- Protected routes for authenticated users

### 2. File Upload
- Drag and drop support
- Click to browse files
- Real-time file type validation (PDF only)
- File size validation (50MB max)
- Progress indication
- Error handling with user-friendly messages

### 3. Paper Summarization
- AI-powered summaries using Ollama
- Clean, readable format
- Keyword highlighting
- Copy to clipboard with feedback
- Download in multiple formats

### 4. My Papers
- View all saved papers
- Search and filter
- Delete papers
- Sort by date
- Responsive grid layout

### 5. User Profile
- Display user information
- Show statistics (papers count, member date)
- Account settings
- Logout functionality

### 6. Error Handling
- API connection detection
- File validation errors
- Authentication errors
- User-friendly error messages
- Dismissible error notifications

### 7. Responsive Design
- Mobile-optimized (320px+)
- Tablet support (768px+)
- Desktop-enhanced (1024px+)
- Touch-friendly buttons and inputs
- Adaptive layouts

## Authentication

### JWT Token Flow

1. User registers/logs in
2. Backend returns JWT token
3. Frontend stores token in localStorage
4. Subsequent requests include token in Authorization header
5. Backend verifies token before processing
6. Token expires after 7 days

### Protected Routes

- `/profile` - Requires authentication
- `/api/paper/upload` - Requires authentication
- `/api/paper/my-papers` - Requires authentication

## Testing

### Manual Testing

1. **Start backend:**
   ```bash
   cd backend
   npm run dev
   ```

2. **Start frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Test Authentication:**
   - Register a new account
   - Verify email validation works
   - Login with credentials
   - Check token is stored

4. **Test Paper Upload:**
   - Upload a PDF file
   - Wait for AI summary
   - Verify summary displays
   - Copy summary to clipboard
   - Download in different formats

5. **Test My Papers:**
   - Upload multiple papers
   - Go to "My Papers" view
   - Verify all papers display
   - Delete a paper
   - Verify deletion works

6. **Test Profile:**
   - Click "Profile" in menu
   - Verify user info displays
   - Check paper count is correct
   - View settings (if implemented)

7. **Test Multi-User:**
   - Logout
   - Register different user
   - Upload paper as new user
   - Verify papers are isolated per user

### Test with Sample PDF

Use any research paper PDF or create a test one:

```bash
# Using ReportLab (Python)
python -c "
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
c = canvas.Canvas('test.pdf', pagesize=letter)
c.drawString(100, 750, 'Sample Research Paper')
c.drawString(100, 730, 'This is test content for summarization.')
c.save()
"
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Android)

## Performance

- **Code Splitting**: Automatic with Next.js
- **Image Optimization**: Next.js Image optimization
- **CSS**: Tailwind CSS tree-shaking
- **Request Timeout**: 300 seconds (5 minutes for AI processing)
- **Caching**: Browser cache for static assets
- **Compression**: Gzip compression enabled

## Security

✅ Input validation (file type, size)
✅ JWT token secure storage
✅ No sensitive data in frontend code
✅ HTTPS ready for production
✅ Environment variable protection
✅ CORS handled by backend
✅ XSS protection
✅ CSRF tokens for forms

## Troubleshooting

### "Backend Not Connected"
- Check backend is running: `npm run dev` in backend folder
- Verify port 5000 is accessible
- Check `.env.local` has correct `NEXT_PUBLIC_API_URL`
- Check browser console for API errors

### "Authentication Failed"
- Verify backend is running
- Check email/password are correct
- Ensure MongoDB is connected
- Look for error messages in browser DevTools

### "Cannot upload file"
- Check backend is running
- Verify you're logged in
- Ensure file is PDF format
- Check file size < 50MB
- Look at browser Network tab for errors

### "Papers not saving"
- Login to ensure authenticated
- Check "My Papers" after uploading
- Verify backend logs show paper saved
- Check MongoDB for data

### "Cannot see My Papers"
- Ensure you're logged in
- Refresh the page
- Check backend logs for token errors
- Verify papers exist in database

### Build errors
- Delete `node_modules` and `.next`:
  ```bash
  rm -rf node_modules .next
  # Windows: rmdir /s /q node_modules && rmdir /s /q .next
  ```
- Clear npm cache: `npm cache clean --force`
- Reinstall: `npm install`

### "Page not found" errors
- Ensure Next.js is running: `npm run dev`
- Check route names match file structure
- Verify all files are saved
- Clear browser cache

## Deployment

### Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

**Environment variables in Vercel:**
```
NEXT_PUBLIC_API_URL=https://your-backend-url.com
```

### Deploy to Netlify

```bash
# Build
npm run build

# Deploy the .next folder to Netlify
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
- Review backend README in [../backend/README.md](../backend/README.md)
- Check [../backend/MONGODB_SETUP.md](../backend/MONGODB_SETUP.md)
- Check [../backend/TESTING.md](../backend/TESTING.md)
- Review console errors in browser DevTools

## References

- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [TypeScript Docs](https://www.typescriptlang.org/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Axios Docs](https://axios-http.com/)
- [JWT.io](https://jwt.io/)
