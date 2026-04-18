import express, { Request, Response } from "express";
import multer from "multer";
import fs from "fs";
const pdfParse = require("pdf-parse");
import { summarizeText } from "../services/aiService";
import { FILE_UPLOAD, HTTP_STATUS, ERROR_MESSAGES } from "../constants";

const router = express.Router();

const buildFallbackSummary = (text: string): string => {
  const normalizedText = text.replace(/\s+/g, " ").trim();
  const sentences = normalizedText
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length > 0);

  const tldr = sentences.slice(0, 3);
  const keyPoints = sentences.slice(3, 8);
  const simpleExplanation = sentences.slice(8, 11);

  const keywordCandidates = normalizedText
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .split(/\s+/)
    .filter((word) => word.length > 4);

  const stopWords = new Set([
    "about",
    "after",
    "before",
    "between",
    "could",
    "their",
    "there",
    "these",
    "those",
    "using",
    "which",
    "while",
    "where",
    "because",
    "through",
  ]);

  const frequency = new Map<string, number>();
  for (const word of keywordCandidates) {
    if (stopWords.has(word)) continue;
    frequency.set(word, (frequency.get(word) ?? 0) + 1);
  }

  const keywords = [...frequency.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([word]) => word);

  const listOrFallback = (items: string[], fallback: string) =>
    items.length > 0 ? items : [fallback];

  const sections = [
    "1. TL;DR (fallback)",
    ...listOrFallback(tldr, "This PDF was uploaded successfully but AI summarization is temporarily unavailable.")
      .map((line) => `- ${line}`),
    "",
    "2. Key Points",
    ...listOrFallback(keyPoints, "Unable to extract detailed key points from this document.").map(
      (line) => `- ${line}`
    ),
    "",
    "3. Simple Explanation",
    ...listOrFallback(simpleExplanation, "Please retry in a few minutes for a full AI-generated summary.").map(
      (line) => `- ${line}`
    ),
    "",
    "4. Keywords",
    `- ${keywords.length > 0 ? keywords.join(", ") : "No strong keywords detected"}`,
    "",
    "5. APA Citation",
    "- Citation unavailable in fallback mode (please retry for AI citation).",
    "",
    "_Note: This is a local fallback summary because the AI provider is currently busy._",
  ];

  return sections.join("\n");
};

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
      let summary: string;
      let usedFallback = false;
      try {
        summary = await summarizeText(text);
      } catch (error) {
        if (
          error instanceof Error &&
          (error.message === ERROR_MESSAGES.RATE_LIMITED ||
            error.message === ERROR_MESSAGES.SERVICE_UNAVAILABLE)
        ) {
          console.warn("Using local fallback summary due to AI API limits");
          summary = buildFallbackSummary(text);
          usedFallback = true;
        } else {
          throw error;
        }
      }

      if (!summary) {
        return res.status(HTTP_STATUS.INTERNAL_ERROR).json({ error: "Failed to generate summary" });
      }

      // Send response
      res.json({ summary, usedFallback });
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