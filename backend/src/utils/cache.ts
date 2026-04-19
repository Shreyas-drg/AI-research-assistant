import crypto from 'crypto';

// In-memory cache for summaries
const cache = new Map<string, { summary: string; timestamp: number }>();

// Cache expiry: 24 hours
const CACHE_EXPIRY_MS = 24 * 60 * 60 * 1000;

/**
 * Generate hash of text to use as cache key
 */
export const generateCacheKey = (text: string): string => {
  return crypto.createHash('md5').update(text).digest('hex');
};

/**
 * Get cached summary if it exists and hasn't expired
 */
export const getCachedSummary = (text: string): string | null => {
  const key = generateCacheKey(text);
  const cached = cache.get(key);

  if (!cached) {
    return null;
  }

  // Check if cache has expired
  if (Date.now() - cached.timestamp > CACHE_EXPIRY_MS) {
    cache.delete(key);
    return null;
  }

  console.log('📦 Cache HIT - returning cached summary');
  return cached.summary;
};

/**
 * Store summary in cache
 */
export const cacheSummary = (text: string, summary: string): void => {
  const key = generateCacheKey(text);
  cache.set(key, { summary, timestamp: Date.now() });
  console.log('💾 Summary cached');
};

/**
 * Clear all cached summaries (for testing)
 */
export const clearCache = (): void => {
  cache.clear();
  console.log('🗑️ Cache cleared');
};

/**
 * Get cache stats
 */
export const getCacheStats = () => {
  return {
    itemsInCache: cache.size,
    totalMemoryEstimate: `${(cache.size * 1000) / 1024 / 1024}MB (approx)`,
  };
};
