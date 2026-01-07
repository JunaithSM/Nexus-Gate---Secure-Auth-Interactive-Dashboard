import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, Mail, Sparkles } from 'lucide-react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import './Dashboard.css'; // Import Dashboard Styles
import { useEffect } from 'react';
import api from '../config';

const Dashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({});
    const [needsPermission, setNeedsPermission] = useState(false);

    const handleLogout = async () => {
        try {
            await api.patch('/logout', {});
        } catch (error) {
            console.error("Logout failed", error);
        }
        navigate('/signin');
    };

    useEffect(() => {
        const getUser = async () => {
            try {
                const response = await api.get('/user');
                setUser(response.data);
            } catch (error) {
                if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                    try {
                        // Try to refresh the token
                        await api.patch('/refresh', {});
                        // Retry getting user info
                        const retryResponse = await api.get('/user');
                        setUser(retryResponse.data);
                    } catch (refreshError) {
                        console.error("Session expired:", refreshError);
                        navigate('/signin');
                    }
                } else {
                    console.error("Failed to fetch user:", error);
                    navigate('/signin');
                }
            }
        };
        getUser();
    }, [navigate]);

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    useEffect(() => {
        const handleOrientation = (event) => {
            const { beta, gamma } = event;
            if (beta === null || gamma === null) return;

            // Clamp values and map as before
            const xVal = Math.max(-0.5, Math.min(0.5, (gamma / 90) * -0.5));
            const yVal = Math.max(-0.5, Math.min(0.5, ((beta - 45) / 90) * -0.5));

            x.set(xVal);
            y.set(yVal);
        };

        // iOS 13+ requires permission
        if (
            typeof DeviceOrientationEvent !== 'undefined' &&
            typeof DeviceOrientationEvent.requestPermission === 'function'
        ) {
            setNeedsPermission(true);
        } else {
            // Android and non-iOS 13+ devices don't need permission
            window.addEventListener("deviceorientation", handleOrientation);
        }

        return () => window.removeEventListener("deviceorientation", handleOrientation);
    }, [x, y]);

    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["17.5deg", "-17.5deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-17.5deg", "17.5deg"]);

    const shineX = useTransform(x, [-0.5, 0.5], ["0%", "100%"]);
    const shineY = useTransform(y, [-0.5, 0.5], ["0%", "100%"]);

    const handleMouseMove = (e) => {
        // Use currentTarget to always refer to the stable wrapper
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;
        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    const requestGyroPermission = async () => {
        try {
            if (typeof DeviceOrientationEvent.requestPermission === 'function') {
                const response = await DeviceOrientationEvent.requestPermission();
                if (response === 'granted') {
                    setNeedsPermission(false);
                    window.addEventListener("deviceorientation", (event) => {
                        const { beta, gamma } = event;
                        if (beta === null || gamma === null) return;
                        const xVal = Math.max(-0.5, Math.min(0.5, (gamma / 90) * -0.5));
                        const yVal = Math.max(-0.5, Math.min(0.5, ((beta - 45) / 90) * -0.5));
                        x.set(xVal);
                        y.set(yVal);
                    });
                } else {
                    alert("Permission denied for 3D effect.");
                }
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="dashboard-container">
            {/* Decorative Background Blobs */}
            <div className="blob blob-1" style={{ width: '400px', height: '400px', top: '10%', left: '30%' }}></div>
            <div className="blob blob-2" style={{ width: '300px', height: '300px', bottom: '10%', right: '30%' }}></div>

            {/* Stable Hitbox Wrapper */}
            <div
                style={{
                    width: '100%',
                    maxWidth: '400px',
                    position: 'relative',
                    // Improve perspective here if needed, but keeping it on container is fine,
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
                        width: '100%', // Ensure it fills wrapper
                    }}
                >
                    {/* Shine Effect Overlay */}
                    <motion.div
                        style={{
                            position: "absolute",
                            inset: -1,
                            borderRadius: "24px",
                            zIndex: 1,
                            background: useTransform(
                                [shineX, shineY],
                                ([latestX, latestY]) => `radial-gradient(circle at ${latestX} ${latestY}, rgba(255,255,255,0.10), transparent 80%)`
                            ),
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
                            className="mt-4 px-4 py-2 bg-indigo-500/20 text-indigo-300 rounded-lg text-sm font-semibold hover:bg-indigo-500/30 transition-colors"
                            style={{ position: 'relative', zIndex: 2, border: '1px solid rgba(99, 102, 241, 0.4)' }}
                        >
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
