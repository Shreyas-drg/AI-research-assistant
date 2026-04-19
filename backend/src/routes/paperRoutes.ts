import express, { Request, Response } from "express";
import multer from "multer";
import fs from "fs";
import crypto from "crypto";
const pdfParse = require("pdf-parse");
import { summarizeText } from "../services/aiService";
import { FILE_UPLOAD, HTTP_STATUS, ERROR_MESSAGES, API } from "../constants";
import { getDB } from "../db/mongodb";
import { verifyToken } from "../utils/authUtils";
import { ObjectId } from "mongodb";

const router = express.Router();

// Configure multer with security limits
const upload = multer({
  dest: FILE_UPLOAD.UPLOAD_DIR,
  limits: {
    fileSize: FILE_UPLOAD.MAX_FILE_SIZE,
  },
});

// Helper function to extract user ID from Authorization header
const getUserIdFromHeader = (req: Request): string | null => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("⚠️  No Authorization header found");
    return null;
  }

  const token = authHeader.substring(7);
  const payload = verifyToken(token);
  if (!payload) {
    console.log("❌ Token verification failed");
    return null;
  }
  console.log("✅ Token verified, userId:", payload.userId);
  return payload?.userId || null;
};

router.post(
  "/upload",
  upload.single("file"),
  async (req: Request, res: Response) => {
    let filePath: string | null = null;

    try {
      // Check if file exists
      if (!req.file) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: ERROR_MESSAGES.NO_FILE });
      }

      filePath = req.file.path;

      // Validate file type
      if (!FILE_UPLOAD.ALLOWED_MIMETYPES.includes(req.file.mimetype)) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: ERROR_MESSAGES.INVALID_FILE_TYPE });
      }

      // Validate file size
      if (req.file.size === 0) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: ERROR_MESSAGES.EMPTY_FILE });
      }

      // Read and parse PDF
      const fileBuffer = fs.readFileSync(filePath);
      const data = await pdfParse(fileBuffer);

      // Validate PDF content
      if (!data.text || data.text.trim().length === 0) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: ERROR_MESSAGES.NO_TEXT_IN_PDF });
      }

      // Limit text for API (reduces token usage significantly!)
      const text = data.text.slice(0, API.MAX_TEXT_LENGTH);

      console.log(`📄 Processing PDF: ${text.length} chars extracted`);

      // Generate AI summary
      const summary = await summarizeText(text);

      if (!summary) {
        return res.status(HTTP_STATUS.INTERNAL_ERROR).json({ error: "Failed to generate summary" });
      }

      // Get userId from token if authenticated
      const userId = getUserIdFromHeader(req);

      // Create file hash
      const fileHash = crypto.createHash("md5").update(fileBuffer).digest("hex");

      // Save paper to database if user is authenticated
      let paperId = null;
      if (userId) {
        const db = getDB();
        const papersCollection = db.collection("papers");

        const paper = {
          userId: new ObjectId(userId),
          fileName: req.file.originalname || "document.pdf",
          fileHash,
          summary,
          createdAt: new Date(),
        };

        const result = await papersCollection.insertOne(paper);
        paperId = result.insertedId.toString();
        console.log(`💾 Paper saved for user ${userId}: ${paperId}`);
      } else {
        console.log("⚠️  No authenticated user - paper NOT saved to database");
      }

      // Send response
      res.json({
        summary,
        paperId,
        fileName: req.file.originalname || "document.pdf",
        message: userId ? "Paper saved to your account" : "Summary generated (login to save)",
      });
    } catch (error) {
      console.error("Route Error:", error);

      // Provide specific error messages
      if (error instanceof Error) {
        if (error.message.includes("File too large")) {
          return res.status(HTTP_STATUS.PAYLOAD_TOO_LARGE).json({ error: ERROR_MESSAGES.FILE_TOO_LARGE });
        }
        if (error.message.includes("ENOENT")) {
          return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: "File read error" });
        }
        if (error.message === ERROR_MESSAGES.RATE_LIMITED) {
          return res.status(HTTP_STATUS.SERVICE_UNAVAILABLE).json({ error: ERROR_MESSAGES.RATE_LIMITED });
        }
        if (error.message === ERROR_MESSAGES.INVALID_API_KEY) {
          return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: ERROR_MESSAGES.INVALID_API_KEY });
        }
      }

      res.status(HTTP_STATUS.INTERNAL_ERROR).json({ error: ERROR_MESSAGES.GENERIC_ERROR });
    } finally {
      // Ensure file is always deleted, even on error
      if (filePath && fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
  }
);

/**
 * GET /api/paper/my-papers
 * Get all papers uploaded by the authenticated user
 */
router.get("/my-papers", async (req: Request, res: Response) => {
  try {
    const userId = getUserIdFromHeader(req);

    if (!userId) {
      console.log("❌ No authenticated user for my-papers request");
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        error: "Authentication required",
      });
    }

    const db = getDB();
    const papersCollection = db.collection("papers");

    const papers = await papersCollection
      .find({ userId: new ObjectId(userId) })
      .sort({ createdAt: -1 })
      .toArray();

    console.log(`📚 Retrieved ${papers.length} papers for user ${userId}`);

    res.json({
      message: "User papers retrieved",
      count: papers.length,
      data: papers.map((paper: any) => ({
        id: paper._id.toString(),
        fileName: paper.fileName,
        summary: paper.summary,
        createdAt: paper.createdAt,
      })),
    });
  } catch (error) {
    console.error("Get papers error:", error);
    res.status(HTTP_STATUS.INTERNAL_ERROR).json({
      error: "Failed to retrieve papers",
    });
  }
});

/**
 * DELETE /api/paper/:paperId
 * Delete a paper by ID (only if owned by user)
 */
router.delete("/:paperId", async (req: Request, res: Response) => {
  try {
    const userId = getUserIdFromHeader(req);
    const paperId = req.params.paperId;

    if (!userId) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        error: "Authentication required",
      });
    }

    if (!paperId || typeof paperId !== "string") {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        error: "Invalid paper ID",
      });
    }

    const db = getDB();
    const papersCollection = db.collection("papers");

    const result = await papersCollection.deleteOne({
      _id: new ObjectId(paperId),
      userId: new ObjectId(userId),
    });

    if (result.deletedCount === 0) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        error: "Paper not found or not owned by you",
      });
    }

    res.json({
      message: "Paper deleted successfully",
    });
  } catch (error) {
    console.error("Delete paper error:", error);
    res.status(HTTP_STATUS.INTERNAL_ERROR).json({
      error: "Failed to delete paper",
    });
  }
});

export default router;