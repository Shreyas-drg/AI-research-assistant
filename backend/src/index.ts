import express, { Application, Request, Response, ErrorRequestHandler } from "express";
import cors from "cors";
import dotenv from "dotenv";
import paperRoutes from "./routes/paperRoutes";
import { logger, validateEnv } from "./utils/helpers";
import { HTTP_STATUS } from "./constants";

dotenv.config();

// Validate required environment variables
try {
  validateEnv("OPENAI_API_KEY");
} catch (error) {
  console.error("❌ Configuration Error:", error instanceof Error ? error.message : error);
  process.exit(1);
}

const app: Application = express();

// Middleware
app.use(logger);
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Routes
app.use("/api/paper", paperRoutes);

// Health check
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "API Running...", status: "ok", timestamp: new Date() });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(HTTP_STATUS.NOT_FOUND).json({ error: "Route not found" });
});

// Global error handler
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.error("Unhandled Error:", err);

  if (err instanceof SyntaxError) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: "Invalid JSON" });
  }

  res.status(HTTP_STATUS.INTERNAL_ERROR).json({ error: "Internal server error" });
};

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || "development"}`);
});