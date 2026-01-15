import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    withCredentials: true  // Required for cookies to be sent cross-domain
});

// Token storage (in-memory only - NOT localStorage)
let accessToken = null;
let isRefreshing = false;
let failedQueue = [];

/**
 * Set access token (called after login/refresh)
 */
export const setAccessToken = (token) => {
    accessToken = token;
};

/**
 * Get current access token
 */
export const getAccessToken = () => accessToken;

/**
 * Clear access token (called on logout)
 */
export const clearAccessToken = () => {
    accessToken = null;
};

/**
 * Process queued requests after token refresh
 */
const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

/**
 * Request Interceptor
 * Adds Authorization header with access token
 */
api.interceptors.request.use(
    (config) => {
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

/**
 * Response Interceptor
 * Handles 401 errors by refreshing token and retrying
 */
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If not a 401 error, just reject
        if (!error.response || error.response.status !== 401) {
            return Promise.reject(error);
        }

        // Don't retry if this is a refresh request (prevents infinite loop)
        if (originalRequest.url === '/auth/refresh') {
            clearAccessToken();
            return Promise.reject(error);
        }

        // Don't retry if already retried once
        if (originalRequest._retry) {
            return Promise.reject(error);
        }

        // If already refreshing, queue this request
        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject });
            }).then((token) => {
                originalRequest.headers.Authorization = `Bearer ${token}`;
                return api(originalRequest);
            }).catch(err => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
            // Attempt to refresh - browser sends cookie automatically
            const response = await api.post('/auth/refresh');
            const newToken = response.data.accessToken;

            // Store new token
            setAccessToken(newToken);

            // Process queued requests
            processQueue(null, newToken);

            // Retry original request with new token
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return api(originalRequest);
        } catch (refreshError) {
            // Refresh failed - clear token and reject all queued requests
            processQueue(refreshError, null);
            clearAccessToken();

            // Redirect to login if on a protected page
            if (window.location.pathname !== '/signin' &&
                window.location.pathname !== '/signup' &&
                window.location.pathname !== '/') {
                window.location.href = '/signin';
            }

            return Promise.reject(refreshError);
        } finally {
            isRefreshing = false;
        }
    }
);

export default api;