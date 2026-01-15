import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import api from '../config';

const AuthContext = createContext(null);

/**
 * Auth Provider
 * Stores access token in memory (not localStorage for security)
 * Provides login, logout, and token management
 */
export const AuthProvider = ({ children }) => {
    const [accessToken, setAccessToken] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    /**
     * Get current access token
     */
    const getAccessToken = useCallback(() => {
        return accessToken;
    }, [accessToken]);

    /**
     * Store tokens after login/signup
     */
    const login = useCallback((token, userData) => {
        setAccessToken(token);
        setUser(userData);
    }, []);

    /**
     * Clear tokens on logout
     */
    const logout = useCallback(async () => {
        try {
            await api.post('/auth/logout');
        } catch (error) {
            console.error("Logout error:", error);
        }
        setAccessToken(null);
        setUser(null);
    }, []);

    /**
     * Try to refresh token on app load
     * If refresh cookie exists and is valid, we can restore the session
     */
    useEffect(() => {
        const initAuth = async () => {
            try {
                // Try to refresh - if cookie is valid, we get a new access token
                const response = await api.post('/auth/refresh');
                if (response.data.accessToken) {
                    setAccessToken(response.data.accessToken);
                    setUser(response.data.user);
                }
            } catch (error) {
                // No valid session - this is expected for new users
                console.log("No active session");
            } finally {
                setLoading(false);
            }
        };
        initAuth();
    }, []);

    /**
     * Update access token (called by axios interceptor after refresh)
     */
    const updateAccessToken = useCallback((token) => {
        setAccessToken(token);
    }, []);

    const value = {
        accessToken,
        user,
        loading,
        isAuthenticated: !!accessToken,
        login,
        logout,
        getAccessToken,
        updateAccessToken
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

/**
 * Hook to use auth context
 */
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext;
