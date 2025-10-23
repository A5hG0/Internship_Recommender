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

    const handleLogin = async (event: React.FormEvent) => {
        event.preventDefault();
        
        // Validate inputs
        if (!email || !password) {
            setError('Please enter both email and password.');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }

        if (!email.includes('@')) {
            setError('Please enter a valid email address.');
            return;
        }

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

        // Validate inputs
        if (!email || !password) {
            setError('Please enter both email and password.');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }

        if (!email.includes('@')) {
            setError('Please enter a valid email address.');
            return;
        }

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

    return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-neutral-900 font-sans">
            <Header theme={theme} onThemeToggle={onThemeToggle} />
            <div className="flex-grow flex items-center justify-center px-4">
                <div className="w-full max-w-sm p-8 space-y-8">
                    <div className="text-center">
                        <h1 className="text-4xl font-semibold text-neutral-900 dark:text-white mb-2">Internify</h1>
                        <p className="text-neutral-600 dark:text-neutral-400">{formTitle}</p>
                    </div>
                    <form className="space-y-6" onSubmit={formAction}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Email address</label>
                            <input
                                id="email"
                                className="w-full px-4 py-2 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white placeholder-neutral-500 dark:placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent rounded-lg transition"
                                type="email"
                                placeholder="your@email.com"
                                value={email}
                                required
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Password</label>
                            <input
                                id="password"
                                className="w-full px-4 py-2 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white placeholder-neutral-500 dark:placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent rounded-lg transition"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                required
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full inline-flex justify-center py-3 px-8 border border-transparent text-base font-semibold rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-neutral-400 disabled:cursor-not-allowed dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-offset-neutral-900 dark:disabled:bg-neutral-600 transition-colors"
                            >
                                {loading ? 'Processing...' : buttonText}
                            </button>
                        </div>
                        {error && <p className="text-sm text-center text-red-600 dark:text-red-400 font-medium">{error}</p>}
                        {message && <p className="text-sm text-center text-green-600 dark:text-green-400 font-medium">{message}</p>}
                    </form>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-neutral-300 dark:border-neutral-700"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white dark:bg-neutral-900 text-neutral-500 dark:text-neutral-400">or</span>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => {
                            setIsSignUp(!isSignUp);
                            setError(null);
                            setMessage(null);
                        }}
                        className="w-full text-sm text-center text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors font-medium"
                    >
                        {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Auth;
