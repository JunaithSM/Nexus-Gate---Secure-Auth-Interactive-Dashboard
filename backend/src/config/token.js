import jwt from "jsonwebtoken";
import {
    JWT_SECRET,
    REFRESH_TOKEN_SECRET,
    ACCESS_TOKEN_EXPIRY,
    REFRESH_TOKEN_EXPIRY,
    REFRESH_COOKIE_MAX_AGE,
    isProduction
} from "./env.js";

/**
 * Generate an access token (short-lived, for Authorization header)
 */
const generateAccessToken = (user) => {
    if (!user || !user.id) {
        throw new Error("Invalid user for token generation");
    }
    return jwt.sign(
        { id: user.id, role: user.role },
        JWT_SECRET,
        { expiresIn: ACCESS_TOKEN_EXPIRY }
    );
};

/**
 * Generate a refresh token (long-lived, stored in HttpOnly cookie)
 */
const generateRefreshToken = (user) => {
    if (!user || !user.id) {
        throw new Error("Invalid user for token generation");
    }
    return jwt.sign(
        { id: user.id, role: user.role },
        REFRESH_TOKEN_SECRET,
        { expiresIn: REFRESH_TOKEN_EXPIRY }
    );
};

/**
 * Verify access token from Authorization header
 */
const verifyAccessToken = (token) => {
    return jwt.verify(token, JWT_SECRET);
};

/**
 * Verify refresh token from cookie
 */
const verifyRefreshToken = (token) => {
    return jwt.verify(token, REFRESH_TOKEN_SECRET);
};

/**
 * Get cookie options for refresh token
 */
const getRefreshCookieOptions = () => ({
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: REFRESH_COOKIE_MAX_AGE,
    path: '/auth/refresh'
});

/**
 * Set refresh token cookie on response
 */
const setRefreshCookie = (res, refreshToken) => {
    res.cookie('refreshToken', refreshToken, getRefreshCookieOptions());
};

/**
 * Clear refresh token cookie
 */
const clearRefreshCookie = (res) => {
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax',
        path: '/auth/refresh'
    });
};

export {
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
    verifyRefreshToken,
    setRefreshCookie,
    clearRefreshCookie
};