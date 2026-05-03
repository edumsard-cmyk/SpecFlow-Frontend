/**
 * Rate limit em memória por instância (adequado a dev e a um único nó).
 * Em várias réplicas, use um store compartilhado (Redis/KV).
 */
type Bucket = { resetAt: number; count: number }

const buckets = new Map<string, Bucket>()

const PRUNE_EVERY = 500

function prune(now: number) {
  if (buckets.size < PRUNE_EVERY) return
  for (const [k, b] of buckets) {
    if (b.resetAt < now) buckets.delete(k)
  }
}

export function consumeAiRateLimit(
  key: string,
  max: number,
  windowMs: number
): { ok: true } | { ok: false; retryAfterMs: number } {
  const now = Date.now()
  prune(now)

  let b = buckets.get(key)
  if (!b || b.resetAt <= now) {
    b = { resetAt: now + windowMs, count: 0 }
    buckets.set(key, b)
  }

  if (b.count >= max) {
    return { ok: false, retryAfterMs: Math.max(0, b.resetAt - now) }
  }

  b.count += 1
  return { ok: true }
}
