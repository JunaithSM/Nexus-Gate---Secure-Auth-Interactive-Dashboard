import React from 'react';
import { motion } from 'framer-motion';

const LoadingScreen = () => {
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 overflow-hidden bg-[#0a0a1a]">
            {/* Ambient Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/10 blur-[120px] rounded-full mix-blend-screen animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-500/10 blur-[120px] rounded-full mix-blend-screen animate-pulse" style={{ animationDelay: '2s' }} />
            </div>

            <div className="relative z-10 flex flex-col items-center justify-center">
                {/* Cybernetic Core Animation */}
                <div className="relative w-24 h-24 mb-8">
                    {/* Outer Rotating Ring */}
                    <motion.div
                        className="absolute inset-0 border-2 border-indigo-500/30 rounded-full border-t-indigo-400"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    />

                    {/* Inner Rotating Ring (Counter) */}
                    <motion.div
                        className="absolute inset-2 border-2 border-purple-500/30 rounded-full border-b-purple-400"
                        animate={{ rotate: -360 }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    />

                    {/* Central Pulsing Core */}
                    <motion.div
                        className="absolute inset-0 m-auto w-12 h-12 bg-white/5 rounded-full backdrop-blur-md border border-white/10"
                        animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <div className="absolute inset-0 m-auto w-4 h-4 bg-indigo-400 rounded-full shadow-[0_0_20px_rgba(99,102,241,0.6)]" />
                    </motion.div>
                </div>

                {/* Text Animation */}
                <div className="flex flex-col items-center gap-2">
                    <motion.h2
                        className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 background-animate"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                        INITIALIZING
                    </motion.h2>
                    <div className="flex gap-1">
                        {[0, 1, 2].map((i) => (
                            <motion.div
                                key={i}
                                className="w-1.5 h-1.5 bg-gray-500 rounded-full"
                                animate={{ scale: [1, 1.5, 1], backgroundColor: ["#6b7280", "#a5b4fc", "#6b7280"] }}
                                transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoadingScreen;
