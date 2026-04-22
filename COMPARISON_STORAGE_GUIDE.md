# Paper Storage Schema Update

## Overview

Updated the paper storage in MongoDB to support both **single paper uploads** and **comparison documents**. Now when multiple papers are compared, they're stored together in a single document.

## Database Schema

### Single Paper Document
```typescript
{
  _id: ObjectId,
  type: "single",
  userId: ObjectId,
  fileName: string,
  fileHash: string,
  summary: string,
  createdAt: Date,
  updatedAt: Date
}
```

### Comparison Document
```typescript
{
  _id: ObjectId,
  type: "comparison",
  userId: ObjectId,
  comparisonName: string,           // e.g., "Comparison of AI Papers"
  papers: [
    {
      fileName: string,
      fileHash: string,
      summary: string
    },
    {
      fileName: string,
      fileHash: string,
      summary: string
    }
    // ... more papers
  ],
  comparisonSummary?: string,       // Overall comparison summary (optional)
  createdAt: Date,
  updatedAt: Date
}
```

## API Endpoints

### 1. Upload Single Paper (Existing)
**POST** `/api/paper/upload`

- Uploads a single PDF file
- Generates summary
- Saves as `type: "single"` document
- Returns: `{ summary, paperId, fileName }`

### 2. Save Comparison (New)
**POST** `/api/paper/save-comparison`

Request body:
```json
{
  "comparisonName": "Comparison of 3 AI Papers",
  "papers": [
    {
      "fileName": "paper1.pdf",
      "fileHash": "abc123...",
      "summary": "This paper discusses..."
    },
    {
      "fileName": "paper2.pdf",
      "fileHash": "def456...",
      "summary": "This paper explores..."
    },
    {
      "fileName": "paper3.pdf",
      "fileHash": "ghi789...",
      "summary": "This paper presents..."
    }
  ],
  "comparisonSummary": "All three papers discuss AI concepts... (optional)"
}
```

Response:
```json
{
  "message": "Comparison saved successfully",
  "comparisonId": "507f1f77bcf86cd799439011",
  "paperCount": 3,
  "comparisonName": "Comparison of 3 AI Papers"
}
```

**Requirements:**
- At least 2 papers required
- Each paper must have: `fileName`, `fileHash`, `summary`
- Authentication required (Bearer token in Authorization header)

### 3. Get User's Papers (Updated)
**GET** `/api/paper/my-papers`

Returns both single papers and comparisons:

```json
{
  "message": "User papers retrieved",
  "count": 4,
  "data": [
    {
      "id": "507f1f77bcf86cd799439011",
      "type": "single",
      "fileName": "paper1.pdf",
      "summary": "Summary text...",
      "createdAt": "2026-04-22T..."
    },
    {
      "id": "507f1f77bcf86cd799439012",
      "type": "comparison",
      "comparisonName": "Comparison of 3 Papers",
      "paperCount": 3,
      "papers": [
        { "fileName": "paper2.pdf", "summary": "..." },
        { "fileName": "paper3.pdf", "summary": "..." },
        { "fileName": "paper4.pdf", "summary": "..." }
      ],
      "comparisonSummary": "Overall comparison...",
      "createdAt": "2026-04-22T..."
    }
  ]
}
```

### 4. Delete Paper/Comparison (Unchanged)
**DELETE** `/api/paper/:paperId`

Works for both single papers and comparisons. Deletes the entire comparison document (all papers in it).

---

## Frontend Implementation Example

### Step 1: Upload Multiple PDFs
```javascript
// Upload each PDF individually to get summaries
const paper1 = await uploadPaper(file1, token);
const paper2 = await uploadPaper(file2, token);
const paper3 = await uploadPaper(file3, token);
```

### Step 2: Save Comparison
```javascript
const response = await fetch('http://localhost:5000/api/paper/save-comparison', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    comparisonName: 'AI Research Papers Comparison',
    papers: [
      {
        fileName: 'paper1.pdf',
        fileHash: 'hash1...',
        summary: paper1.summary
      },
      {
        fileName: 'paper2.pdf',
        fileHash: 'hash2...',
        summary: paper2.summary
      },
      {
        fileName: 'paper3.pdf',
        fileHash: 'hash3...',
        summary: paper3.summary
      }
    ],
    comparisonSummary: 'All three papers discuss...' // Optional
  })
});

const { comparisonId } = await response.json();
console.log('Comparison saved:', comparisonId);
```

### Step 3: Retrieve and Display
```javascript
// Get all papers and comparisons
const papers = await getUserPapers(token);

papers.forEach(item => {
  if (item.type === 'comparison') {
    console.log(`Comparison: ${item.comparisonName}`);
    console.log(`  Papers: ${item.paperCount}`);
    console.log(`  Summary: ${item.comparisonSummary}`);
  } else {
    console.log(`Paper: ${item.fileName}`);
    console.log(`  Summary: ${item.summary}`);
  }
});
```

---

## Database Indexes

MongoDB automatically creates indexes for:
- `userId` - for querying user's papers
- `createdAt` - for sorting by date
- `type` - for filtering by document type

---

## Migration Note

**Existing papers** in your database:
- Already stored as individual documents without `type` field
- Will still work (backwards compatible)
- When querying, treat missing `type` as `"single"`
- New uploads will have `type: "single"` field

To migrate old documents, you can run this MongoDB command:
```javascript
db.papers.updateMany(
  { type: { $exists: false } },
  { $set: { type: "single" } }
)
```

---

## Usage Workflow

1. **User uploads PDFs individually** → Get summaries → `type: "single"` documents saved
2. **User selects papers to compare** → System generates comparison → Call `/api/paper/save-comparison`
3. **Comparison saved** → All papers stored in one `type: "comparison"` document
4. **User views "My Papers"** → Shows both single papers and comparisons with all details

---

## Benefits

✅ **Organized Storage** - Related comparison papers stay together
✅ **Easy Retrieval** - One query gets the entire comparison
✅ **Better Performance** - No need to fetch multiple documents for a comparison
✅ **Clear Structure** - Type field makes it easy to differentiate between documents
✅ **Backward Compatible** - Existing single papers still work

---

## Restart Backend

```bash
npm run dev
```

You should see all three database indexes created:
```
✅ Connected to MongoDB Atlas
✅ Database indexes created
✅ Database connected
```

Ready to use! 🎉
