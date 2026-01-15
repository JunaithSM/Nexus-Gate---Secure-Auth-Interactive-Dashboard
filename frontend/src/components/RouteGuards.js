import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingScreen from './LoadingScreen';

/**
 * ProtectedRoute - Requires authentication
 * Redirects to signin if not authenticated
 */
export const ProtectedRoute = () => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <LoadingScreen />;
    }

    return isAuthenticated ? <Outlet /> : <Navigate to="/signin" replace />;
};

/**
 * PublicRoute - For sign-in/sign-up pages
 * Redirects to dashboard if already authenticated
 */
export const PublicRoute = () => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <LoadingScreen />;
    }

    return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Outlet />;
};
