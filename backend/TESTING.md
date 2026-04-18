# Testing Guide

## Quick Start

### 1. Start the Server
```bash
npm run dev
```

You should see:
```
🚀 Server running on port 5000
📝 Environment: development
```

### 2. Test Health Check
Verify the server is running:

**Using cURL:**
```bash
curl http://localhost:5000
```

**Expected Response:**
```json
{
  "message": "API Running...",
  "status": "ok",
  "timestamp": "2024-04-11T10:30:00.000Z"
}
```

## API Testing

### Upload & Summarize PDF

**Using cURL:**
```bash
curl -X POST http://localhost:5000/api/paper/upload \
  -F "file=@research_paper.pdf"
```

**Using Postman:**
1. Set method to `POST`
2. URL: `http://localhost:5000/api/paper/upload`
3. Go to `Body` tab
4. Select `form-data`
5. Add key `file` with type `File`
6. Select your PDF file
7. Click `Send`

**Using Python:**
```python
import requests

with open('paper.pdf', 'rb') as f:
    files = {'file': f}
    response = requests.post('http://localhost:5000/api/paper/upload', files=files)
    print(response.json())
```

**Using JavaScript/Fetch:**
```javascript
const formData = new FormData();
formData.append('file', fileInput.files[0]);

const response = await fetch('http://localhost:5000/api/paper/upload', {
  method: 'POST',
  body: formData
});

const data = await response.json();
console.log(data.summary);
```

## Success Response

```json
{
  "summary": "TL;DR: This paper presents a novel approach to machine learning optimization...\n\nKey Points:\n- Introduces new algorithm\n- Shows 30% improvement\n- Tested on multiple datasets\n\nSimple Explanation: The researchers developed a faster way to train AI models...\n\nKeywords: machine learning, optimization, neural networks\n\nAPA Citation: Author, A. (2024). Title of paper. Journal Name, 10(5), 123-145."
}
```

## Error Responses

### No File Uploaded
```bash
curl -X POST http://localhost:5000/api/paper/upload
```
Response (400):
```json
{
  "error": "No file uploaded"
}
```

### Invalid File Type
```bash
# Upload a .txt file instead of PDF
curl -X POST http://localhost:5000/api/paper/upload \
  -F "file=@document.txt"
```
Response (400):
```json
{
  "error": "Please upload a PDF file"
}
```

### File Too Large (>50MB)
Response (413):
```json
{
  "error": "File size exceeds 50MB limit"
}
```

### Empty PDF
Response (400):
```json
{
  "error": "PDF contains no readable text"
}
```

### OpenAI API Issues
Response (500):
```json
{
  "error": "Authentication failed with OpenAI"
}
```
or
```json
{
  "error": "Rate limited by OpenAI - please try again later"
}
```

## Test Files

### Create a Sample PDF (Python)
```python
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas

c = canvas.Canvas("sample.pdf", pagesize=letter)
c.drawString(100, 750, "Sample Research Paper")
c.drawString(100, 730, "This is a test PDF for the API.")
c.drawString(100, 710, "It contains some sample text to be summarized.")
c.save()
```

### Create a Sample PDF (Online)
- Use [SmallPDF](https://smallpdf.com/) to convert text to PDF
- Or use Google Docs and export as PDF

## Common Issues & Solutions

### Issue: "OPENAI_API_KEY is not configured"
**Solution:**
- Check `.env` file exists
- Verify key is set: `OPENAI_API_KEY=sk-...`
- Restart server after updating `.env`

### Issue: File uploads but no summary appears
**Solution:**
- Check your OpenAI API quota
- Verify API key is valid
- Check server logs for errors
- Try with a smaller PDF

### Issue: "Rate limited by OpenAI"
**Solution:**
- Wait a few minutes
- Check your API usage at https://platform.openai.com/usage
- Consider upgrading your plan

## Performance Testing

### Test with Different File Sizes
```bash
# Small file (< 1MB) - Should be instant
curl -X POST http://localhost:5000/api/paper/upload \
  -F "file=@small.pdf"

# Medium file (5-10MB) - Should take 2-5 seconds
# Large file (20-50MB) - Should take 10-30 seconds
```

### Monitor Server Logs
When running `npm run dev`, you'll see logs like:
```
[2024-04-11T10:30:45.123Z] POST /api/paper/upload - 200 (5234ms)
[2024-04-11T10:31:10.456Z] GET / - 200 (2ms)
```

This shows the request method, endpoint, status code, and response time.

## Integration Testing

### Test with a Frontend App
Your frontend can call the API like:

```javascript
async function uploadPaper(file) {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch('http://localhost:5000/api/paper/upload', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Error:', error.error);
      return null;
    }

    const data = await response.json();
    return data.summary;
  } catch (error) {
    console.error('Network error:', error);
    return null;
  }
}
```

## Debugging Tips

1. **Check server is running:** Visit `http://localhost:5000` in browser
2. **Monitor uploaded files:** Check `uploads/` folder (should auto-delete)
3. **Enable verbose logging:** Add more `console.log()` statements
4. **Test API in isolation:** Use Postman instead of frontend
5. **Check OpenAI status:** Visit https://status.openai.com
6. **Review API costs:** Monitor at https://platform.openai.com/account/usage/overview

## Next Steps

1. ✅ Test API endpoints with different files
2. ✅ Verify error handling
3. ✅ Connect frontend
4. ✅ Set up production deployment
