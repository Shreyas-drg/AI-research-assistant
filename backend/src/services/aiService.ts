import axios from "axios";
import { API, ERROR_MESSAGES } from "../constants";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const summarizeText = async (text: string): Promise<string> => {
  // Validate input
  if (!text || text.trim().length === 0) {
    throw new Error("Text cannot be empty");
  }

  if (!process.env.OPENAI_API_KEY) {
    throw new Error(ERROR_MESSAGES.MISSING_API_KEY);
  }

  for (let attempt = 1; attempt <= API.RETRY_ATTEMPTS; attempt++) {
    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: API.MODEL,
          messages: [
            {
              role: "user",
              content: `
Summarize this research paper into:
1. TL;DR (3 lines)
2. Key Points (bullets)
3. Simple Explanation
4. Keywords
5. APA Citation

Paper:
${text}
            `,
            },
          ],
          temperature: API.TEMPERATURE,
          max_tokens: API.MAX_TOKENS,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
          timeout: API.TIMEOUT,
        }
      );

      const content = response.data.choices?.[0]?.message?.content;

      if (!content) {
        throw new Error("No response from OpenAI API");
      }

      return content;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const statusCode = error.response?.status;

        if (statusCode === 401) {
          console.error("OpenAI Auth Error: Invalid API key");
          throw new Error(ERROR_MESSAGES.INVALID_API_KEY);
        }

        if (statusCode === 429) {
          if (attempt === API.RETRY_ATTEMPTS) {
            console.error(
              `OpenAI Rate Limit: exceeded retries (${API.RETRY_ATTEMPTS} attempts)`
            );
            throw new Error(ERROR_MESSAGES.RATE_LIMITED);
          }

          const delay = API.RETRY_BASE_DELAY_MS * Math.pow(2, attempt - 1);
          console.warn(`OpenAI rate limited. Retrying attempt ${attempt + 1} in ${delay}ms`);
          await sleep(delay);
          continue;
        }

        if (statusCode === 500) {
          console.error("OpenAI Server Error");
          throw new Error(ERROR_MESSAGES.SERVICE_UNAVAILABLE);
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