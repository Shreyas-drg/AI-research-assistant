import axios from "axios";
import { API, ERROR_MESSAGES } from "../constants";
import { getCachedSummary, cacheSummary } from "../utils/cache";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const summarizeText = async (text: string): Promise<string> => {
  // Validate input
  if (!text || text.trim().length === 0) {
    throw new Error("Text cannot be empty");
  }

  const ollamaUrl = process.env.OLLAMA_API_URL;
  if (!ollamaUrl) {
    throw new Error(ERROR_MESSAGES.MISSING_API_KEY);
  }

  // Check cache first (saves processing time!)
  const cachedSummary = getCachedSummary(text);
  if (cachedSummary) {
    return cachedSummary;
  }

  // Limit text for performance
  const limitedText = text.slice(0, API.MAX_TEXT_LENGTH);

  for (let attempt = 1; attempt <= API.RETRY_ATTEMPTS; attempt++) {
    try {
      console.log(`🤖 Calling Ollama (${API.MODEL}) - attempt ${attempt}...`);

      const response = await axios.post(
        `${ollamaUrl}/api/generate`,
        {
          model: API.MODEL,
          prompt: `Summarize this research paper concisely:
- Main idea
- Key findings
- Conclusion

Paper:
${limitedText}`,
          stream: false,
          temperature: API.TEMPERATURE,
          num_predict: API.MAX_TOKENS,
        },
        {
          timeout: API.TIMEOUT,
        }
      );

      const content = response.data?.response?.trim();

      if (!content) {
        throw new Error("No response from Ollama");
      }

      // Cache the summary for future requests
      cacheSummary(text, content);
      console.log("✅ Summary generated successfully");

      return content;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const statusCode = error.response?.status;

        if (statusCode === 401) {
          console.error("OpenAI Auth Error: Invalid API key");
          throw new Error(ERROR_MESSAGES.INVALID_API_KEY);
        }

        if (statusCode === 404 || error.message.includes("ECONNREFUSED")) {
          console.error("❌ Ollama not running on localhost:11434");
          throw new Error(ERROR_MESSAGES.SERVICE_UNAVAILABLE);
        }

        if (statusCode === 429 || error.message.includes("too many requests")) {
          if (attempt === API.RETRY_ATTEMPTS) {
            console.error("Ollama: exceeded retries");
            throw new Error(ERROR_MESSAGES.RATE_LIMITED);
          }

          const delay = API.RETRY_BASE_DELAY_MS * Math.pow(2, attempt - 1);
          console.warn(`Ollama busy. Retrying in ${delay}ms...`);
          await sleep(delay);
          continue;
        }

        console.error("API Error:", statusCode, error.message);
      } else if (error instanceof Error) {
        console.error("Error:", error.message);
      }

      throw error;
    }
  }

  throw new Error(ERROR_MESSAGES.GENERIC_ERROR);
};