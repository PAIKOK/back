import IORedis from "ioredis";
import { env } from "../config/env";

/**
 * Shared connection ONLY for producers (API)
 */
export const redis = new IORedis({
    host: env.redis.host,
    port: env.redis.port,
    maxRetriesPerRequest: null,
    enableReadyCheck: false
});
