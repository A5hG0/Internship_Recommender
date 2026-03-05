import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient';
import Header from './Header';

interface AuthProps {
    theme?: 'light' | 'dark';
    onThemeToggle?: () => void;
}

const Auth: React.FC<AuthProps> = ({ theme = 'light', onThemeToggle = () => {} }) => {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const validateForm = (): boolean => {
        if (!email || !password) {
            setError('Please enter both email and password.');
            return false;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters.');
            return false;
        }
        if (!email.includes('@')) {
            setError('Please enter a valid email address.');
            return false;
        }
        return true;
    };

    const handleLogin = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        setError(null);
        setMessage(null);

        if (!supabase) {
            setError("Authentication service is not configured. Please contact support.");
            setLoading(false);
            return;
        }

        try {
            const { error } = await supabase.auth.signInWithPassword({ 
                email: email.toLowerCase().trim(), 
                password 
            });

            if (error) {
                // Handle specific error messages
                if (error.message.includes('Invalid login credentials')) {
                    setError('Invalid email or password. Please try again.');
                } else if (error.message.includes('Email not confirmed')) {
                    setError('Please confirm your email address first.');
                } else {
                    setError(error.message || 'Failed to sign in. Please try again.');
                }
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred.';
            setError(`Sign in failed: ${errorMessage}`);
            console.error('Sign in error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSignUp = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        setError(null);
        setMessage(null);

        if (!supabase) {
            setError("Authentication service is not configured. Please contact support.");
            setLoading(false);
            return;
        }

        try {
            const { data, error } = await supabase.auth.signUp({ 
                email: email.toLowerCase().trim(), 
                password 
            });

            if (error) {
                // Handle specific error messages
                if (error.message.includes('already registered')) {
                    setError('This email is already registered. Please sign in instead.');
                } else if (error.message.includes('invalid')) {
                    setError('Invalid email address. Please check and try again.');
                } else {
                    setError(error.message || 'Failed to sign up. Please try again.');
                }
            } else if (data?.user) {
                setMessage('🎉 Account created! Check your email to confirm your account.');
                setEmail('');
                setPassword('');
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred.';
            setError(`Sign up failed: ${errorMessage}`);
            console.error('Sign up error:', err);
        } finally {
            setLoading(false);
        }
    };

    const formAction = isSignUp ? handleSignUp : handleLogin;
    const buttonText = isSignUp ? 'Sign Up' : 'Sign In';
    const formTitle = isSignUp ? 'Create a New Account' : 'Sign In to Your Account';

    const handleForgotPassword = async () => {
        if (!email || !email.includes('@')) {
            setError('Please enter your email address first, then click "Forgot password?"');
            return;
        }
        if (!supabase) {
            setError('Authentication service is not configured.');
            return;
        }
        setLoading(true);
        setError(null);
        setMessage(null);
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email.toLowerCase().trim());
            if (error) {
                setError(error.message || 'Failed to send reset email.');
            } else {
                setMessage('Password reset link sent! Check your email inbox.');
            }
        } catch (err) {
            setError('An unexpected error occurred. Please try again.');
            console.error('Password reset error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-[#fafafa] dark:bg-[#0a0a0a] font-sans">
            <Header theme={theme} onThemeToggle={onThemeToggle} />
            <div className="flex-grow flex items-center justify-center px-4">
                <div className="w-full max-w-[380px] animate-fade-in">
                    {/* Logo + Title */}
                    <div className="text-center mb-10">
                        <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-neutral-900 dark:bg-white flex items-center justify-center shadow-sm">
                            <span className="text-white dark:text-neutral-900 text-xl font-bold">I</span>
                        </div>
                        <h1 className="text-[28px] font-semibold text-neutral-900 dark:text-white tracking-tight mb-1">
                            {isSignUp ? 'Create account' : 'Welcome back'}
                        </h1>
                        <p className="text-[15px] text-neutral-400 dark:text-neutral-500">{formTitle}</p>
                    </div>

                    {/* Form Card */}
                    <div className="bg-white dark:bg-white/[0.03] border border-neutral-200/70 dark:border-white/[0.06] rounded-2xl p-7 shadow-sm">
                        <form className="space-y-5" onSubmit={formAction}>
                            <div>
                                <label htmlFor="email" className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-neutral-400 dark:text-neutral-500 mb-2">Email</label>
                                <input
                                    id="email"
                                    className="w-full px-4 py-3 bg-neutral-50 dark:bg-white/5 border border-neutral-200 dark:border-white/10 text-neutral-900 dark:text-white placeholder-neutral-300 dark:placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 dark:focus:ring-white/10 focus:border-neutral-300 dark:focus:border-white/20 rounded-xl text-[15px] transition-all duration-200"
                                    type="email"
                                    placeholder="your@email.com"
                                    value={email}
                                    required
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-neutral-400 dark:text-neutral-500 mb-2">Password</label>
                                <input
                                    id="password"
                                    className="w-full px-4 py-3 bg-neutral-50 dark:bg-white/5 border border-neutral-200 dark:border-white/10 text-neutral-900 dark:text-white placeholder-neutral-300 dark:placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 dark:focus:ring-white/10 focus:border-neutral-300 dark:focus:border-white/20 rounded-xl text-[15px] transition-all duration-200"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    required
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                {!isSignUp && (
                                    <button
                                        type="button"
                                        onClick={handleForgotPassword}
                                        className="mt-2 text-[12px] text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors duration-200"
                                    >
                                        Forgot password?
                                    </button>
                                )}
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 px-8 text-[15px] font-semibold rounded-xl text-white bg-neutral-900 dark:bg-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100 focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 active:scale-[0.98] mt-1"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                                        Processing…
                                    </span>
                                ) : buttonText}
                            </button>
                        </form>

                        {/* Error / Success Messages */}
                        {error && (
                            <div className="mt-4 p-3 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/10 rounded-xl">
                                <p className="text-[13px] text-center text-red-600 dark:text-red-400">{error}</p>
                            </div>
                        )}
                        {message && (
                            <div className="mt-4 p-3 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/10 rounded-xl">
                                <p className="text-[13px] text-center text-emerald-600 dark:text-emerald-400">{message}</p>
                            </div>
                        )}
                    </div>

                    {/* Toggle link */}
                    <div className="mt-6 text-center">
                        <button
                            type="button"
                            onClick={() => {
                                setIsSignUp(!isSignUp);
                                setError(null);
                                setMessage(null);
                            }}
                            className="text-[13px] text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors duration-200"
                        >
                            {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Auth;

