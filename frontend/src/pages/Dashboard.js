import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Mail, Sparkles, Loader, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import './Dashboard.css';
import api, { clearAccessToken } from '../config';
import { useCard3D } from '../hooks/useCard3D';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const handleLogout = async () => {
        try {
            await api.post('/auth/logout');
        } catch (error) {
            console.error("Logout error:", error);
        }
        // Clear token from memory
        clearAccessToken();
        // Clear auth context (this triggers route guard redirect)
        await logout();
        navigate('/signin');
    };

    useEffect(() => {
        const getUser = async () => {
            try {
                const response = await api.get('/api/user');
                setUser(response.data);
            } catch (error) {
                console.error("Failed to fetch user:", error);
                // Interceptor will handle redirect if refresh fails
            } finally {
                setLoading(false);
            }
        };
        getUser();
    }, []);

    const {
        handleMouseMove,
        handleMouseLeave,
        rotateX,
        rotateY,
        shineBackground,
        needsPermission,
        requestGyroPermission
    } = useCard3D();

    if (loading) {
        return (
            <div className="dashboard-container">
                <div className="flex items-center justify-center min-h-screen">
                    <Loader className="animate-spin" size={32} />
                </div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <div className="dashboard-container">
            <div className="blob blob-1" style={{ width: '400px', height: '400px', top: '10%', left: '30%' }}></div>
            <div className="blob blob-2" style={{ width: '300px', height: '300px', bottom: '10%', right: '30%' }}></div>

            <div
                style={{
                    width: '100%',
                    maxWidth: '400px',
                    position: 'relative',
                    perspective: '1000px',
                }}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.5, type: "spring" }}
                    className="user-card"
                    style={{
                        rotateX,
                        rotateY,
                        transformStyle: "preserve-3d",
                        width: '100%',
                    }}
                >
                    <motion.div
                        style={{
                            position: "absolute",
                            inset: -1,
                            borderRadius: "24px",
                            zIndex: 1,
                            background: shineBackground,
                            pointerEvents: "none",
                        }}
                    />

                    <div className="absolute top-4 right-4 text-white/20" style={{ zIndex: 2 }}>
                        <Sparkles size={24} />
                    </div>

                    <div className="avatar-container" style={{ position: 'relative', zIndex: 2 }}>
                        {user.name && user.name.charAt(0)}
                    </div>

                    <h2 className="user-name" style={{ position: 'relative', zIndex: 2 }}>{user.name}</h2>

                    <div className="user-email-badge" style={{ position: 'relative', zIndex: 2 }}>
                        <Mail size={16} />
                        <span>{user.email}</span>
                    </div>

                    <button onClick={handleLogout} className="btn-logout" style={{ position: 'relative', zIndex: 2 }}>
                        <LogOut size={18} />
                        Log Out
                    </button>

                    <div className="mt-6 text-xs text-gray-500 uppercase tracking-widest" style={{ position: 'relative', zIndex: 2 }}>
                        Member ID:<span className="ml-1 font-mono">#{user.id && user.id.toString().toUpperCase()}</span>
                    </div>

                    {user.role === 'admin' && (
                        <button
                            onClick={() => navigate('/admin')}
                            className="mt-6 w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl text-white font-semibold shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 group"
                            style={{ position: 'relative', zIndex: 2 }}
                        >
                            <Shield size={18} className="group-hover:rotate-12 transition-transform duration-300" />
                            Admin Panel
                        </button>
                    )}
                </motion.div>

                {needsPermission && (
                    <button
                        onClick={requestGyroPermission}
                        style={{
                            position: 'absolute',
                            bottom: '20px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            padding: '10px 20px',
                            background: 'rgba(255,255,255,0.1)',
                            border: '1px solid rgba(255,255,255,0.2)',
                            borderRadius: '20px',
                            color: 'white',
                            backdropFilter: 'blur(10px)',
                            cursor: 'pointer',
                            zIndex: 20
                        }}
                    >
                        Enable 3D Effect
                    </button>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
