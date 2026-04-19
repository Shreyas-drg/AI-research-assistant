import { Request, Response, NextFunction } from 'express';

// Store IP -> request timestamps
const userRequests = new Map<string, number[]>();

// Rate limit: 3 requests per minute (matches OpenAI free tier!)
const MAX_REQUESTS = 3;
const TIME_WINDOW_MS = 60 * 1000; // 1 minute

/**
 * Middleware to rate limit requests per user/IP
 * IMPORTANT: This matches OpenAI free tier limits to prevent cascading rate limits
 */
export const rateLimitMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const userIp = req.ip || req.socket.remoteAddress || 'unknown';
  const now = Date.now();

  // Get or create request timestamps for this user
  if (!userRequests.has(userIp)) {
    userRequests.set(userIp, []);
  }

  const timestamps = userRequests.get(userIp) || [];

  // Remove old timestamps outside the time window
  const validTimestamps = timestamps.filter((time) => now - time < TIME_WINDOW_MS);

  // Check if user exceeded rate limit
  if (validTimestamps.length >= MAX_REQUESTS) {
    const oldestRequest = validTimestamps[0];
    const resetTime = new Date(oldestRequest + TIME_WINDOW_MS);
    const timeUntilReset = Math.ceil((resetTime.getTime() - now) / 1000);

    console.warn(`⚠️ Rate limit exceeded for IP: ${userIp}`);

    res.status(429).json({
      error: 'Rate limit exceeded',
      message: `You have reached the limit of ${MAX_REQUESTS} summaries per minute. Please wait before trying again.`,
      retryAfter: timeUntilReset,
      resetTime: resetTime.toISOString(),
    });
    return;
  }

  // Add current request timestamp
  validTimestamps.push(now);
  userRequests.set(userIp, validTimestamps);

  // Log remaining requests
  const remainingRequests = MAX_REQUESTS - validTimestamps.length;
  console.log(`📊 User ${userIp}: ${remainingRequests} requests remaining in this minute`);

  next();
};

/**
 * Get rate limit stats for a user
 */
export const getUserRateLimitStats = (
  req: Request
): { remaining: number; resetTime: Date } => {
  const userIp = req.ip || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const timestamps = userRequests.get(userIp) || [];
  const validTimestamps = timestamps.filter((time) => now - time < TIME_WINDOW_MS);

  const resetTime = new Date(
    Math.max(...validTimestamps.map((time) => time + TIME_WINDOW_MS))
  );

  return {
    remaining: Math.max(0, MAX_REQUESTS - validTimestamps.length),
    resetTime,
  };
};

/**
 * Clear rate limit data (for testing)
 */
export const clearRateLimitData = (): void => {
  userRequests.clear();
  console.log('🗑️ Rate limit data cleared');
};
