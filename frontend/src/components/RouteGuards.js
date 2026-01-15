import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader } from 'lucide-react';

/**
 * ProtectedRoute - Requires authentication
 * Redirects to signin if not authenticated
 */
export const ProtectedRoute = () => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a2e 50%, #0a0a1a 100%)' }}>
                <Loader className="animate-spin text-white" size={40} />
            </div>
        );
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
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a2e 50%, #0a0a1a 100%)' }}>
                <Loader className="animate-spin text-white" size={40} />
            </div>
        );
    }

    return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Outlet />;
};
