import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Loader, Eye, EyeOff, Github, Chrome } from 'lucide-react';
import { motion } from 'framer-motion';
import { URL } from '../config';
import axios from 'axios';
import StatusToast from '../components/StatusToast';
const SignIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post(`${URL}/signin`, { email, password }, { withCredentials: true });

            setSuccess({
                title: "Login Successful",
                message: response.data.message
            });
            navigate('/dashboard');
        } catch (error) {
            console.error("Login failed:", error);
            setError({
                title: "Authentication Failed",
                message: error.response?.data?.message || "Please check your credentials and try again"
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
                <h1 className="text-gradient">Welcome Back</h1>
                <p className="subtitle">Sign in to continue your journey</p>
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
                <span>Or continue with</span>
            </div>

            <form onSubmit={handleLogin}>

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
                    <div className="icon-wrapper"><Mail size={20} /></div>
                    <input
                        type="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="input-field"
                        required
                    />
                </div>

                <div className="form-group">
                    <div className="icon-wrapper"><Lock size={20} /></div>
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
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

                <div className="flex-between mb-6">
                    <label className="checkbox-label">
                        <input type="checkbox" className="checkbox-input" />
                        Remember me
                    </label>
                    <a href="#" className="link text-sm">Forgot Password?</a>
                </div>

                <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? <Loader className="animate-spin" size={20} /> :
                        <>Sign In <ArrowRight size={20} /></>
                    }
                </button>
            </form>

            <div className="text-center mt-6 text-sm text-gray-400">
                Don't have an account? <Link to="/signup" className="link">Create Account</Link>
            </div>
        </motion.div>
    );
};

export default SignIn;
