import Redis from 'ioredis';
import { REDIS_URL, isProduction } from './env.js';

// Redis enabled flag - allows graceful fallback
let redisEnabled = true;

// Create Redis client with production-ready settings
const redis = new Redis(REDIS_URL, {
    maxRetriesPerRequest: 3,
    retryStrategy: (times) => {
        if (times > 3) {
            console.error('Redis: Max retries reached, disabling cache');
            redisEnabled = false;
            return null; // Stop retrying
        }
        return Math.min(times * 100, 3000);
    },
    enableReadyCheck: true,
    lazyConnect: true,
    // TLS for production Redis (Render uses this)
    tls: isProduction && REDIS_URL.includes('rediss://') ? {} : undefined
});

// Connection event handlers
redis.on('connect', () => {
    console.log('Redis: Connected');
    redisEnabled = true;
});

redis.on('error', (err) => {
    console.error('Redis Error:', err.message);
});

redis.on('close', () => {
    console.log('Redis: Connection closed');
});

// Connect on startup (non-blocking)
redis.connect().catch(err => {
    console.error('Redis: Failed to connect:', err.message);
    console.log('Redis: Application will continue without caching');
    redisEnabled = false;
});

/**
 * Check if Redis is currently available
 */
export const isRedisEnabled = () => redisEnabled;

export default redis;
