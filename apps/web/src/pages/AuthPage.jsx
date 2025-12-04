import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogIn, UserPlus, Mail, Lock, User, Loader2, Zap } from 'lucide-react';

export default function AuthPage() {
    const { signIn, signUp } = useAuth();
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [demoLoading, setDemoLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        fullName: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isLogin) {
                const { error } = await signIn(formData.email, formData.password);
                if (error) throw error;
            } else {
                const { error } = await signUp(formData.email, formData.password, formData.fullName);
                if (error) throw error;
                setError('Check your email for verification link!');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDemoMode = () => {
        setDemoLoading(true);
        // Store demo mode in localStorage and navigate
        localStorage.setItem('omninexus_demo_mode', 'true');
        localStorage.setItem('omninexus_demo_user', JSON.stringify({
            email: 'demo@omninexus.com',
            user_metadata: { full_name: 'Demo User' },
            created_at: new Date().toISOString()
        }));
        setTimeout(() => {
            window.location.href = '/';
        }, 500);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
            <div className="max-w-md w-full">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-purple-600 rounded-2xl mb-4">
                        <span className="text-2xl font-bold text-white">O</span>
                    </div>
                    <h1 className="text-3xl font-bold text-white">OmniNexus</h1>
                    <p className="text-slate-400 mt-2">Enterprise Intelligence Platform</p>
                </div>

                {/* Auth Form */}
                <div className="bg-slate-850 border border-slate-800 rounded-2xl p-8 shadow-2xl">
                    <div className="flex items-center justify-center space-x-4 mb-6">
                        <button
                            onClick={() => setIsLogin(true)}
                            className={`flex items-center space-x-2 px-6 py-2 rounded-lg transition-all ${isLogin ? 'bg-primary-600 text-white' : 'text-slate-400 hover:text-white'
                                }`}
                        >
                            <LogIn size={18} />
                            <span>Login</span>
                        </button>
                        <button
                            onClick={() => setIsLogin(false)}
                            className={`flex items-center space-x-2 px-6 py-2 rounded-lg transition-all ${!isLogin ? 'bg-primary-600 text-white' : 'text-slate-400 hover:text-white'
                                }`}
                        >
                            <UserPlus size={18} />
                            <span>Sign Up</span>
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {!isLogin && (
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" size={18} />
                                    <input
                                        type="text"
                                        value={formData.fullName}
                                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                        required={!isLogin}
                                        className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-primary-500 outline-none"
                                        placeholder="John Doe"
                                    />
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" size={18} />
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                    className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-primary-500 outline-none"
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" size={18} />
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                    minLength={6}
                                    className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-primary-500 outline-none"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className={`p-3 rounded-lg text-sm ${error.includes('Check your email')
                                    ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                                    : 'bg-red-500/10 text-red-400 border border-red-500/20'
                                }`}>
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-500 hover:to-purple-500 text-white rounded-lg font-medium transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin" size={18} />
                                    <span>Processing...</span>
                                </>
                            ) : (
                                <>
                                    {isLogin ? <LogIn size={18} /> : <UserPlus size={18} />}
                                    <span>{isLogin ? 'Login' : 'Create Account'}</span>
                                </>
                            )}
                        </button>
                    </form>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-700"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-slate-850 text-slate-500">or</span>
                        </div>
                    </div>

                    <button
                        onClick={handleDemoMode}
                        disabled={demoLoading}
                        className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white rounded-lg font-medium transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
                    >
                        {demoLoading ? (
                            <>
                                <Loader2 className="animate-spin" size={18} />
                                <span>Loading Demo...</span>
                            </>
                        ) : (
                            <>
                                <Zap size={18} />
                                <span>Try Demo (No Signup Required)</span>
                            </>
                        )}
                    </button>

                    <p className="text-slate-500 text-xs text-center mt-4">
                        Demo mode lets you explore all features without an account
                    </p>
                </div>
            </div>
        </div>
    );
}
