import { compareSync, hashSync } from "../config/hash.js";
import userRepo from "../repository/user.repo.js";
import refreshSessionRepo from "../repository/refresh_session.repo.js";
import sessionCache from "../services/sessionCache.js";
import {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken,
    setRefreshCookie,
    clearRefreshCookie
} from "../config/token.js";
import { JWT_SECRET } from "../config/env.js";

/**
 * POST /signup
 */
const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "Name, email and password are required" });
        }

        const hashedPassword = await hashSync(password);

        const existingUser = await userRepo.getByEmail(email);
        if (existingUser) {
            return res.status(409).json({ message: "Email already exists" });
        }

        const user = await userRepo.create({
            name,
            email,
            password: hashedPassword
        });

        await sendTokenResponse(res, user, 201, "Signup successful");
    } catch (err) {
        console.error("Signup error:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};

/**
 * POST /signin
 */
const signin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await userRepo.getByEmail(email);
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        if (!await compareSync(password, user.password)) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        if (!JWT_SECRET) {
            console.error("JWT_SECRET is not defined!");
            return res.status(500).json({ message: "Internal server configuration error" });
        }

        await sendTokenResponse(res, user, 200, "Login successful");
    } catch (err) {
        console.error("Signin error:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};

/**
 * POST /refresh
 * Uses Redis cache for faster session lookup
 */
const refresh = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken || refreshToken === 'undefined') {
            clearRefreshCookie(res);
            return res.status(401).json({ message: "No refresh token provided" });
        }

        // Verify JWT signature
        let decoded;
        try {
            decoded = verifyRefreshToken(refreshToken);
        } catch (err) {
            clearRefreshCookie(res);
            return res.status(403).json({ message: "Invalid refresh token" });
        }

        // Try Redis cache first for faster lookup
        let session = await sessionCache.get(decoded.id);

        // If not in cache, fallback to PostgreSQL
        if (!session) {
            session = await refreshSessionRepo.getByUserId(decoded.id);

            // Cache the session for next time
            if (session) {
                await sessionCache.set(decoded.id, session);
            }
        }

        if (!session || session.revoked) {
            clearRefreshCookie(res);
            return res.status(403).json({ message: "Session not found or revoked" });
        }

        // Verify token hash
        const isValidToken = await compareSync(refreshToken, session.token_hash);
        if (!isValidToken) {
            await refreshSessionRepo.revokeByUserId(decoded.id);
            await sessionCache.delete(decoded.id);
            clearRefreshCookie(res);
            return res.status(403).json({ message: "Invalid refresh token" });
        }

        // Check expiry
        if (new Date(session.expires_at) < new Date()) {
            await refreshSessionRepo.deleteById(session.id);
            await sessionCache.delete(decoded.id);
            clearRefreshCookie(res);
            return res.status(403).json({ message: "Refresh token expired" });
        }

        // Get user
        const user = await userRepo.getById(decoded.id);
        if (!user) {
            await refreshSessionRepo.deleteById(session.id);
            await sessionCache.delete(decoded.id);
            clearRefreshCookie(res);
            return res.status(401).json({ message: "User not found" });
        }

        // Rotate: delete old session from DB and cache
        await refreshSessionRepo.deleteById(session.id);
        await sessionCache.delete(decoded.id);

        // Generate new tokens
        await sendTokenResponse(res, user, 200, "Token refreshed");
    } catch (err) {
        console.error("Refresh error:", err);
        clearRefreshCookie(res);
        res.status(500).json({ message: "Internal server error" });
    }
};

/**
 * POST /logout
 * Clears both PostgreSQL and Redis
 */
const logout = async (req, res) => {
    try {
        if (req.user && req.user.id) {
            // Clear from PostgreSQL
            await refreshSessionRepo.deleteByUserId(req.user.id);
            // Clear from Redis cache
            await sessionCache.delete(req.user.id);
        }

        clearRefreshCookie(res);
        res.status(200).json({ message: "Logout successful" });
    } catch (err) {
        console.error("Logout error:", err);
        clearRefreshCookie(res);
        res.status(500).json({ message: "Internal server error" });
    }
};

/**
 * Helper: Generate tokens and store session in DB + Redis
 */
const sendTokenResponse = async (res, user, statusCode, message) => {
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    const hashedRefreshToken = await hashSync(refreshToken);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // Store in PostgreSQL
    const session = await refreshSessionRepo.create({
        userId: user.id,
        tokenHash: hashedRefreshToken,
        expiresAt: expiresAt
    });

    // Cache in Redis for fast lookups
    await sessionCache.set(user.id, {
        id: session.id,
        user_id: user.id,
        token_hash: hashedRefreshToken,
        expires_at: expiresAt,
        revoked: false
    });

    setRefreshCookie(res, refreshToken);

    res.status(statusCode).json({
        message: message,
        accessToken: accessToken,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    });
};

export default {
    signup,
    signin,
    refresh,
    logout
};
