# MongoDB Atlas Setup Guide

This guide will help you set up MongoDB Atlas for user authentication in the AI Research Assistant.

## Step 1: Create MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Click **"Sign Up"** or **"Sign In"** if you have an account
3. Complete the registration process
4. Verify your email address

## Step 2: Create a New Cluster

1. After signing in, click **"Create"** to create a new project
2. Enter a project name (e.g., "AI Research Assistant")
3. Click **"Create Project"**
4. Click **"Create a Deployment"**
5. Choose **"M0 FREE"** tier (free tier with 512MB storage)
6. Select your preferred cloud provider and region
7. Click **"Create Deployment"**

> **Note:** Free tier is sufficient for development and testing.

## Step 3: Create Database User

1. In the cluster dashboard, go to **"Security"** → **"Database Access"**
2. Click **"Add New Database User"**
3. Enter a username (e.g., `airesearch`)
4. Enter a strong password (save this somewhere secure)
5. Choose **"Built-in Role"** and select **"Atlas admin"**
6. Click **"Add User"**

## Step 4: Configure Network Access

1. Go to **"Security"** → **"Network Access"**
2. Click **"Add IP Address"**
3. Select **"Allow Access from Anywhere"** (for development)
   - In production, restrict to your server's IP
4. Click **"Confirm"**

## Step 5: Get Connection String

1. Go to your cluster dashboard
2. Click **"Connect"**
3. Choose **"Drivers"** (Node.js)
4. Copy the connection string
5. The format will be:
   ```
   mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority
   ```

## Step 6: Update Environment Variables

1. Open `backend/.env` (create if it doesn't exist)
2. Add the following:

```env
# MongoDB Atlas Connection
MONGODB_URI=mongodb+srv://airesearch:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/ai_research_assistant?retryWrites=true&w=majority

# JWT Secret (generate a random string)
JWT_SECRET=your_random_secret_key_here

# Ollama API
OLLAMA_API_URL=http://localhost:11434

# Server
PORT=5000
NODE_ENV=development

# CORS
CORS_ORIGIN=http://localhost:3000
```

**Replace:**
- `airesearch` with your database username
- `YOUR_PASSWORD` with your database password
- `cluster0.xxxxx.mongodb.net` with your actual cluster URL
- `your_random_secret_key_here` with a strong random string

## Step 7: Install Dependencies

```bash
cd backend
npm install
```

This installs the new dependencies:
- `mongodb` - Database driver
- `jsonwebtoken` - JWT token generation
- `@types/jsonwebtoken` - TypeScript types

## Step 8: Test the Connection

1. Start the backend:
   ```bash
   npm run dev
   ```

2. You should see:
   ```
   ✅ Connected to MongoDB Atlas
   ✅ Database indexes created
   🚀 Server running on port 5000
   ```

## Step 9: Test Authentication APIs

Use Postman or curl to test:

### Register a New User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123",
    "name": "Test User"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123"
  }'
```

### Verify Token
```bash
curl -X POST http://localhost:5000/api/auth/verify \
  -H "Content-Type: application/json" \
  -d '{
    "token": "YOUR_JWT_TOKEN_HERE"
  }'
```

## Password Requirements

- Minimum 6 characters
- At least 1 uppercase letter
- At least 1 number

Example valid passwords:
- `Password123`
- `MyApp2024`
- `Secure99`

## Troubleshooting

### Connection Refused
- Ensure MongoDB Atlas cluster is running
- Check if your IP is whitelisted in Network Access
- Verify the connection string is correct

### Authentication Failed
- Check if the database user credentials are correct
- Ensure the password doesn't contain special characters that need URL encoding
- Try recreating the database user

### JWT Secret Issues
- Generate a strong random secret:
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```

## Next Steps

1. Update the `AuthModal` frontend component (already done!)
2. Test authentication in your application
3. Implement "Save Papers to User Account" feature
4. Add user profile management

## Security Notes

- **Never commit `.env` file** to version control
- Use strong, unique passwords for database users
- In production, rotate JWT secrets regularly
- Restrict network access to your server's IP only
- Consider enabling two-factor authentication in MongoDB Atlas

---

For more information, visit the [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/).
