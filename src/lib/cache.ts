// Simple in-memory cache for serverless functions
// In production, consider using Redis or Vercel KV

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const cache = new Map<string, CacheEntry<any>>();

const DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

export async function getCached<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = DEFAULT_TTL
): Promise<T> {
  const now = Date.now();
  const cached = cache.get(key);

  // Return cached data if it exists and hasn't expired
  if (cached && now - cached.timestamp < ttl) {
    return cached.data;
  }

  // Fetch fresh data
  const data = await fetcher();

  // Store in cache
  cache.set(key, { data, timestamp: now });

  return data;
}

export function invalidateCache(key: string): void {
  cache.delete(key);
}

export function clearCache(): void {
  cache.clear();
}
