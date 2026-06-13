import axios from "axios";
import { API, ERROR_MESSAGES } from "../constants";
import { getCachedSummary, cacheSummary } from "../utils/cache";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const summarizeText = async (text: string): Promise<string> => {
  // Validate input
  if (!text || text.trim().length === 0) {
    throw new Error("Text cannot be empty");
  }

  const groqApiKey = process.env.GROQ_API_KEY;
  if (!groqApiKey) {
    throw new Error(ERROR_MESSAGES.MISSING_API_KEY);
  }

  // Check cache first (saves processing time and tokens!)
  const cachedSummary = getCachedSummary(text);
  if (cachedSummary) {
    return cachedSummary;
  }

  // Sanitize text - remove HTML entities and special characters
  let sanitizedText = text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\x00/g, "") // Remove null bytes
    .trim();

  // Limit text for performance
  const limitedText = sanitizedText.slice(0, API.MAX_TEXT_LENGTH);

  for (let attempt = 1; attempt <= API.RETRY_ATTEMPTS; attempt++) {
    try {
      console.log(`🤖 Calling Groq (${API.MODEL}) - attempt ${attempt}...`);

      const response = await axios.post(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          model: API.MODEL,
          messages: [
            {
              role: "user",
              content: `Summarize this research paper concisely:
- Main idea
- Key findings
- Conclusion

Paper:
${limitedText}`,
            },
          ],
          temperature: API.TEMPERATURE,
          max_tokens: API.MAX_TOKENS,
        },
        {
          headers: {
            Authorization: `Bearer ${groqApiKey}`,
            "Content-Type": "application/json",
          },
          timeout: API.TIMEOUT,
        }
      );

      const content = response.data?.choices?.[0]?.message?.content?.trim();

      if (!content) {
        throw new Error("No response from Groq");
      }

      // Cache the summary for future requests
      cacheSummary(text, content);
      console.log("✅ Summary generated successfully");

      return content;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const statusCode = error.response?.status;
        const errorData = error.response?.data;

        console.error("🔴 Groq API Full Response Error:", JSON.stringify(errorData, null, 2));

        if (statusCode === 401) {
          console.error("❌ Groq Auth Error: Invalid API key");
          throw new Error(ERROR_MESSAGES.INVALID_API_KEY);
        }

        if (statusCode === 404) {
          console.error("❌ Groq model not found. Check if model name is correct.");
          throw new Error("Groq model not found. Try using mistral-7b-instant");
        }

        if (statusCode === 429 || error.message.includes("too many requests")) {
          if (attempt === API.RETRY_ATTEMPTS) {
            console.error("❌ Groq: Rate limit exceeded");
            throw new Error(ERROR_MESSAGES.RATE_LIMITED);
          }

          const delay = API.RETRY_BASE_DELAY_MS * Math.pow(2, attempt - 1);
          console.warn(`⏳ Groq rate limited. Retrying in ${delay}ms...`);
          await sleep(delay);
          continue;
        }

        if (statusCode === 400) {
          console.error("❌ Groq 400 Bad Request");
          console.error("Full error:", JSON.stringify(errorData, null, 2));
          if (attempt < API.RETRY_ATTEMPTS) {
            const delay = API.RETRY_BASE_DELAY_MS * Math.pow(2, attempt - 1);
            console.warn(`Retrying in ${delay}ms...`);
            await sleep(delay);
            continue;
          }
          throw new Error(`Groq API Error: ${errorData?.error?.message || "Unknown error"}`);
        }

        console.error("❌ Groq API Error:", statusCode, error.message);
      } else if (error instanceof Error) {
        console.error("❌ Error:", error.message);
      }

      throw error;
    }
  }

  throw new Error(ERROR_MESSAGES.GENERIC_ERROR);
};