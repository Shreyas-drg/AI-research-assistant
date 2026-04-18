import express, { Request, Response } from "express";
import multer from "multer";
import fs from "fs";
const pdfParse = require("pdf-parse");
import { summarizeText } from "../services/aiService";
import { FILE_UPLOAD, HTTP_STATUS, ERROR_MESSAGES } from "../constants";

const router = express.Router();

// Configure multer with security limits
const upload = multer({
  dest: FILE_UPLOAD.UPLOAD_DIR,
  limits: {
    fileSize: FILE_UPLOAD.MAX_FILE_SIZE,
  },
});

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

      // Limit text for API (important for cost and performance)
      const text = data.text.slice(0, FILE_UPLOAD.MAX_FILE_SIZE);

      // Generate AI summary
      const summary = await summarizeText(text);

      if (!summary) {
        return res.status(HTTP_STATUS.INTERNAL_ERROR).json({ error: "Failed to generate summary" });
      }

      // Send response
      res.json({ summary });
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

export default router;