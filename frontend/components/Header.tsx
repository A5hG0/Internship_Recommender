import React from 'react';
import ThemeToggle from './ThemeToggle';

interface HeaderProps {
    theme: 'light' | 'dark';
    onThemeToggle: () => void;
    onSignOut?: () => void;
    userEmail?: string;
}

const Header: React.FC<HeaderProps> = ({ theme, onThemeToggle, onSignOut, userEmail }) => {
    const initial = userEmail ? userEmail.charAt(0).toUpperCase() : '';

    return (
        <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 dark:bg-[#0a0a0a]/70 border-b border-neutral-200/50 dark:border-white/5 animate-slide-down">
            <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
                <h1 className="text-[17px] font-semibold tracking-tight text-neutral-900 dark:text-white">
                    Internify
                </h1>
                <div className="flex items-center gap-3">
                    {userEmail && onSignOut && (
                        <>
                            {/* Mobile: avatar circle */}
                            <div className="sm:hidden w-7 h-7 rounded-full bg-neutral-200 dark:bg-white/10 flex items-center justify-center" title={userEmail}>
                                <span className="text-[12px] font-semibold text-neutral-600 dark:text-neutral-300">{initial}</span>
                            </div>
                            {/* Desktop: email text */}
                            <span className="text-[13px] text-neutral-400 dark:text-neutral-500 hidden sm:block truncate max-w-[180px]" title={userEmail}>
                                {userEmail}
                            </span>
                            <button 
                                onClick={onSignOut} 
                                className="text-[13px] font-medium text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900/20 dark:focus-visible:ring-white/20 rounded-lg px-1"
                                aria-label="Sign Out"
                            >
                                Sign Out
                            </button>
                            <div className="w-px h-4 bg-neutral-200 dark:bg-neutral-800" />
                        </>
                    )}
                    <ThemeToggle theme={theme} onToggle={onThemeToggle} />
                </div>
            </div>
        </header>
    );
};

export default Header;