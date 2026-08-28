import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

const publicRequestRatelimit =
  redisUrl && redisToken
    ? new Ratelimit({
        redis: new Redis({ url: redisUrl, token: redisToken }),
        limiter: Ratelimit.slidingWindow(5, "10 m"),
        prefix: "fillo:public-request",
      })
    : null;

/**
 * true si l'IP a dépassé la limite de demandes publiques (5 / 10 min).
 * Si Upstash n'est pas configuré (variables d'environnement absentes, ex.
 * en développement local), n'applique aucune limite plutôt que de bloquer
 * tout le trafic légitime.
 */
export async function isPublicRequestRateLimited(ip: string): Promise<boolean> {
  if (!publicRequestRatelimit) {
    return false;
  }

  const { success } = await publicRequestRatelimit.limit(ip);
  return !success;
}
