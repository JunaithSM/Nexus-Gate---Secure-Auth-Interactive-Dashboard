import { POOL } from "../config/db.js";

/**
 * Refresh Session Repository
 * Manages refresh token sessions in PostgreSQL
 */
const refreshSessionRepo = {
    /**
     * Create a new refresh session
     */
    create: async ({ userId, tokenHash, expiresAt }) => {
        const result = await POOL.query(
            `INSERT INTO refresh_sessions (user_id, token_hash, expires_at) 
             VALUES ($1, $2, $3) 
             RETURNING *`,
            [userId, tokenHash, expiresAt]
        );
        return result.rows[0];
    },

    /**
     * Get session by ID
     */
    getById: async (id) => {
        const result = await POOL.query(
            "SELECT * FROM refresh_sessions WHERE id = $1",
            [id]
        );
        return result.rows[0];
    },

    /**
     * Get active session by user ID
     */
    getByUserId: async (userId) => {
        const result = await POOL.query(
            `SELECT * FROM refresh_sessions 
             WHERE user_id = $1 AND revoked = false 
             ORDER BY created_at DESC 
             LIMIT 1`,
            [userId]
        );
        return result.rows[0];
    },

    /**
     * Delete session by ID
     */
    deleteById: async (id) => {
        const result = await POOL.query(
            "DELETE FROM refresh_sessions WHERE id = $1 RETURNING *",
            [id]
        );
        return result.rows[0];
    },

    /**
     * Delete all sessions for a user (for logout)
     */
    deleteByUserId: async (userId) => {
        const result = await POOL.query(
            "DELETE FROM refresh_sessions WHERE user_id = $1 RETURNING *",
            [userId]
        );
        return result.rows;
    },

    /**
     * Revoke all sessions for a user (for security events)
     */
    revokeByUserId: async (userId) => {
        const result = await POOL.query(
            "UPDATE refresh_sessions SET revoked = true WHERE user_id = $1 RETURNING *",
            [userId]
        );
        return result.rows;
    },

    /**
     * Clean up expired sessions (call periodically)
     */
    deleteExpired: async () => {
        const result = await POOL.query(
            "DELETE FROM refresh_sessions WHERE expires_at < NOW() RETURNING *"
        );
        return result.rows;
    }
};

export default refreshSessionRepo;
