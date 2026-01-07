import React from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import '../pages/Auth.css'; // Import Auth Styles

const AuthLayout = () => {
    return (
        <div className="split-screen-container">

            {/* LEFT PANEL: FORM */}
            <div className="left-panel-form">
                <div className="form-max-width">
                    {/* Mobile ambient background */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none lg:hidden">
                        <div className="blob blob-1" style={{ width: '200px', height: '200px', opacity: 0.2 }}></div>
                    </div>

                    <Outlet />
                </div>
            </div>

            {/* RIGHT PANEL: VISUAL */}
            <div className="right-panel-visual">
                <div className="blob blob-1"></div>
                <div className="blob blob-2"></div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="hero-card"
                >
                    <h2 className="text-4xl font-bold mb-4 text-white">Elevate Your Experience.</h2>
                    <p className="text-gray-300 text-lg leading-relaxed mb-6">
                        Join thousands of developers and creators building the future with our premium platform. Secure, fast, and beautiful.
                    </p>

                    <div className="flex items-center gap-4 pt-6 border-t border-white/10">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400"></div>
                        <div>
                            <div className="text-white font-medium">Alex Morgan</div>
                            <div className="text-sm text-gray-400">Product Designer</div>
                        </div>
                    </div>
                </motion.div>
            </div>

        </div>
    );
};

export default AuthLayout;
