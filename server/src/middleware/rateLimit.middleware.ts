import { Context, Next } from 'hono';

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitRecord>();

/**
 * Lightweight sliding-window rate limiter middleware
 */
export function rateLimiter(options: { maxRequests: number; windowMs: number }) {
  const { maxRequests, windowMs } = options;

  return async (c: Context, next: Next) => {
    // Determine client identifier (IP address or fallback)
    const forwardedHeader = c.req.header('x-forwarded-for');
    const clientIp =
      (forwardedHeader ? forwardedHeader.split(',')[0]?.trim() : null) ||
      c.req.header('x-real-ip') ||
      'unknown-client';

    const key = `${c.req.path}:${clientIp}`;
    const now = Date.now();
    const record = rateLimitStore.get(key);

    if (!record || record.resetAt <= now) {
      rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
      return next();
    }

    if (record.count >= maxRequests) {
      const retryAfterSec = Math.ceil((record.resetAt - now) / 1000);
      c.header('Retry-After', String(retryAfterSec));
      return c.json(
        {
          success: false,
          error: 'Too many requests. Please try again later.',
          retryAfter: retryAfterSec,
        },
        429
      );
    }

    record.count += 1;
    await next();
  };
}
