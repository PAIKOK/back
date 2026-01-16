import IORedis from "ioredis";

const HOUR_SECONDS = 60 * 60;

export class RateLimiter {
    constructor(
        private redis: IORedis,
        private limitPerHour: number
    ) { }

    /**
     * Returns true if allowed to send now.
     * Atomic & multi-worker safe.
     */
    async tryConsume(key: string): Promise<boolean> {
        const count = await this.redis.incr(key);
        if (count === 1) {
            await this.redis.expire(key, HOUR_SECONDS);
        }
        return count <= this.limitPerHour;
    }

    /**
     * Seconds until the counter resets.
     */
    async secondsUntilReset(key: string): Promise<number> {
        const ttl = await this.redis.ttl(key);
        return ttl > 0 ? ttl : HOUR_SECONDS;
    }
}
