/**
 * In-memory sliding-window rate limiter.
 * Limits client requests per time-window without external redis requirement,
 * with automatic expiration to prevent memory leaks.
 */

interface RateLimitRecord {
  timestamps: number[];
}

const rateLimitMap = new Map<string, RateLimitRecord>();

// Clean up stale entries every 5 minutes
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000;
let lastCleanup = Date.now();

function cleanupStaleEntries(windowMs: number) {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;

  const threshold = now - windowMs;
  for (const [key, record] of rateLimitMap.entries()) {
    const valid = record.timestamps.filter((ts) => ts > threshold);
    if (valid.length === 0) {
      rateLimitMap.delete(key);
    } else {
      record.timestamps = valid;
    }
  }
  lastCleanup = now;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetSeconds: number;
  totalLimit: number;
}

export function checkRateLimit(
  identifier: string,
  limit: number = 20,
  windowSeconds: number = 60
): RateLimitResult {
  const now = Date.now();
  const windowMs = windowSeconds * 1000;
  cleanupStaleEntries(windowMs);

  const threshold = now - windowMs;
  const record = rateLimitMap.get(identifier) || { timestamps: [] };

  // Retain only requests within the active window
  const activeTimestamps = record.timestamps.filter((ts) => ts > threshold);

  if (activeTimestamps.length >= limit) {
    const oldestTimestamp = activeTimestamps[0];
    const resetSeconds = Math.max(1, Math.ceil((oldestTimestamp + windowMs - now) / 1000));
    return {
      allowed: false,
      remaining: 0,
      resetSeconds,
      totalLimit: limit,
    };
  }

  activeTimestamps.push(now);
  rateLimitMap.set(identifier, { timestamps: activeTimestamps });

  return {
    allowed: true,
    remaining: limit - activeTimestamps.length,
    resetSeconds: windowSeconds,
    totalLimit: limit,
  };
}

/**
 * Utility to extract client IP from Next.js request headers
 */
export function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  return "127.0.0.1";
}
