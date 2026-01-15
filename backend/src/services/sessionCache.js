import redis, { isRedisEnabled } from '../config/redis.js';

// Cache TTL in seconds (7 days for refresh sessions)
const SESSION_TTL = 7 * 24 * 60 * 60;

/**
 * Session Cache Service
 * Uses Redis for fast refresh session lookups
 * Gracefully falls back if Redis is unavailable
 */
const sessionCache = {
    /**
     * Store a session in cache
     */
    set: async (userId, sessionData) => {
        if (!isRedisEnabled()) return false;
        try {
            const key = `session:${userId}`;
            await redis.setex(key, SESSION_TTL, JSON.stringify(sessionData));
            return true;
        } catch (err) {
            console.error('Redis Cache Set Error:', err.message);
            return false;
        }
    },

    /**
     * Get a session from cache
     */
    get: async (userId) => {
        if (!isRedisEnabled()) return null;
        try {
            const key = `session:${userId}`;
            const data = await redis.get(key);
            return data ? JSON.parse(data) : null;
        } catch (err) {
            console.error('Redis Cache Get Error:', err.message);
            return null;
        }
    },

    /**
     * Delete a session from cache
     */
    delete: async (userId) => {
        if (!isRedisEnabled()) return false;
        try {
            const key = `session:${userId}`;
            await redis.del(key);
            return true;
        } catch (err) {
            console.error('Redis Cache Delete Error:', err.message);
            return false;
        }
    },

    /**
     * Check if session exists in cache
     */
    exists: async (userId) => {
        if (!isRedisEnabled()) return false;
        try {
            const key = `session:${userId}`;
            return await redis.exists(key) === 1;
        } catch (err) {
            console.error('Redis Cache Exists Error:', err.message);
            return false;
        }
    }
};

export default sessionCache;
