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
                        Building secure apps and exploring cybersecurity while mastering Linux and full-stack development.
                    </p>

                    <div className="flex items-center gap-4 pt-6 border-t border-white/10">
                            <div className="text-white font-semibold text-lg flex items-center gap-2">
                                S Mohammed Junaith
                            </div>
                            <div className="text-sm text-gray-400 font-medium">Full Stack Developer</div>   
                    </div>
                </motion.div>
            </div>

        </div>
    );
};

export default AuthLayout;
