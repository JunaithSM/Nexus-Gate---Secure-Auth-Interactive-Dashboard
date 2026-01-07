import React, { useEffect } from 'react';
import { AlertCircle, Zap, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './StatusToast.css';

const StatusToast = ({ type = 'error', title, message, onClose, duration = 4000 }) => {
    useEffect(() => {
        if (message && duration) {
            const timer = setTimeout(() => {
                onClose && onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [message, duration, onClose]);

    const isError = type === 'error';
    const displayTitle = title || (isError ? 'Error' : 'Success');

    return (
        <AnimatePresence>
            {message && (
                <motion.div
                    initial={{ opacity: 0, y: -20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    className={`status-toast ${isError ? 'error' : 'success'}`}
                >
                    {/* Icon */}
                    <div className="toast-icon-wrapper">
                        {isError ? <AlertCircle size={20} strokeWidth={2.5} /> : <Zap size={20} strokeWidth={2.5} fill="currentColor" />}
                    </div>

                    {/* Content */}
                    <div className="toast-content">
                        <h4 className="toast-title">
                            {displayTitle}
                        </h4>
                        <p className="toast-message">
                            {message}
                        </p>
                    </div>

                    {/* Close Button */}
                    <button
                        type="button"
                        onClick={onClose}
                        className="toast-close-btn"
                    >
                        <X size={16} />
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default StatusToast;
