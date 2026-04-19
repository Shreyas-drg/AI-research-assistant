/**
 * Request queue to enforce spacing between OpenAI API calls
 * Ensures we don't exceed free tier limits
 */

let lastRequestTime = 0;
const MIN_REQUEST_SPACING_MS = 35000; // 35 seconds = extra safe for free tier

/**
 * Wait until it's safe to make the next API request
 */
export const waitForRateLimit = async (): Promise<void> => {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;

  if (timeSinceLastRequest < MIN_REQUEST_SPACING_MS) {
    const waitTime = MIN_REQUEST_SPACING_MS - timeSinceLastRequest;
    console.log(`⏳ Spacing requests: waiting ${Math.ceil(waitTime / 1000)}s to avoid OpenAI rate limit`);
    await new Promise((resolve) => setTimeout(resolve, waitTime));
  }

  lastRequestTime = Date.now();
};

/**
 * Get seconds until next request is allowed
 */
export const getWaitTimeBeforeNextRequest = (): number => {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  const waitTime = Math.max(0, MIN_REQUEST_SPACING_MS - timeSinceLastRequest);
  return Math.ceil(waitTime / 1000);
};
