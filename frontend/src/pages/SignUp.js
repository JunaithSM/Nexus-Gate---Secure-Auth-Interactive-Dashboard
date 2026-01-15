import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, ArrowRight, Loader, Eye, EyeOff, Github, Chrome } from 'lucide-react';
import { motion } from 'framer-motion';
import StatusToast from '../components/StatusToast';
import api, { setAccessToken } from '../config';
import { useAuth } from '../context/AuthContext';

const SignUp = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const response = await api.post('/auth/signup', formData);

            // Store access token in memory
            setAccessToken(response.data.accessToken);

            // Update auth context to trigger route guards
            login(response.data.accessToken, response.data.user);

            setSuccess({
                title: "Account Created",
                message: response.data.message
            });

            // Immediately redirect to dashboard
            navigate('/dashboard');
        } catch (error) {
            console.error("Signup failed:", error);
            setError({
                title: "Registration Failed",
                message: error.response?.data?.message || "Please check your information and try again"
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="text-center mb-8">
                <h1 className="text-gradient">Create Account</h1>
                <p className="subtitle">Join our exclusive community today</p>
            </div>

            <div className="social-buttons">
                <button className="btn-social">
                    <Chrome size={20} /> Google
                </button>
                <button className="btn-social">
                    <Github size={20} /> Github
                </button>
            </div>

            <div className="divider">
                <span>Or register with email</span>
            </div>

            <form onSubmit={handleSubmit}>
                <StatusToast
                    type="error"
                    title={error?.title}
                    message={error?.message}
                    onClose={() => setError(null)}
                />
                <StatusToast
                    type="success"
                    title={success?.title}
                    message={success?.message}
                    onClose={() => setSuccess(null)}
                />

                <div className="form-group">
                    <div className="icon-wrapper"><User size={20} /></div>
                    <input
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        value={formData.name}
                        onChange={handleChange}
                        className="input-field"
                        required
                    />
                </div>

                <div className="form-group">
                    <div className="icon-wrapper"><Mail size={20} /></div>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={handleChange}
                        className="input-field"
                        required
                    />
                </div>

                <div className="form-group">
                    <div className="icon-wrapper"><Lock size={20} /></div>
                    <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Create Password"
                        value={formData.password}
                        onChange={handleChange}
                        className="input-field"
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="password-toggle"
                    >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>

                <div className="legal-text mb-4 text-center">
                    By joining, you agree to our <button type="button" className="link" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Terms</button> and <button type="button" className="link" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Privacy Policy</button>.
                </div>

                <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? <Loader className="animate-spin" size={20} /> :
                        <>Sign Up <ArrowRight size={20} /></>
                    }
                </button>
            </form>

            <div className="text-center mt-6 text-sm text-gray-400">
                Already have an account? <Link to="/signin" className="link">Sign In</Link>
            </div>
        </motion.div>
    );
};

export default SignUp;
