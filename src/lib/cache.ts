import Redis from "ioredis";

/**
 * Redis client singleton.
 * Falls back gracefully if Redis is not configured — all cache methods
 * return null and log a warning instead of crashing.
 */

const REDIS_URL = process.env.REDIS_URL;

let redis: Redis | null = null;

function getRedis(): Redis | null {
    if (!REDIS_URL) return null;

    if (!redis) {
        redis = new Redis(REDIS_URL, {
            maxRetriesPerRequest: 3,
            retryStrategy(times) {
                if (times > 3) return null; // Stop retrying
                return Math.min(times * 200, 2000);
            },
            lazyConnect: true,
        });

        redis.on("error", (err) => {
            console.warn("[Cache] Redis error:", err.message);
        });
    }

    return redis;
}

// ─── Cache Helpers ─────────────────────────────────────────

/**
 * Get a cached value. Returns null if Redis is unavailable or key doesn't exist.
 */
export async function cacheGet<T>(key: string): Promise<T | null> {
    const client = getRedis();
    if (!client) return null;

    try {
        const value = await client.get(`assure:${key}`);
        return value ? JSON.parse(value) : null;
    } catch {
        return null;
    }
}

/**
 * Set a cached value with optional TTL (seconds). Defaults to 60s.
 */
export async function cacheSet(key: string, value: any, ttlSeconds = 60): Promise<void> {
    const client = getRedis();
    if (!client) return;

    try {
        await client.setex(`assure:${key}`, ttlSeconds, JSON.stringify(value));
    } catch {
        // Silently fail — cache is best-effort
    }
}

/**
 * Invalidate a cache key.
 */
export async function cacheInvalidate(key: string): Promise<void> {
    const client = getRedis();
    if (!client) return;

    try {
        await client.del(`assure:${key}`);
    } catch {
        // Silently fail
    }
}

/**
 * Rate limiter using Redis. Returns true if the action is allowed.
 */
export async function rateLimit(identifier: string, maxRequests = 10, windowSeconds = 60): Promise<boolean> {
    const client = getRedis();
    if (!client) return true; // Allow if no Redis

    try {
        const key = `assure:ratelimit:${identifier}`;
        const current = await client.incr(key);
        if (current === 1) {
            await client.expire(key, windowSeconds);
        }
        return current <= maxRequests;
    } catch {
        return true;
    }
}
