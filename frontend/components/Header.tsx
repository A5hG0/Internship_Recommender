import React from 'react';
import ThemeToggle from './ThemeToggle';

interface HeaderProps {
    theme: 'light' | 'dark';
    onThemeToggle: () => void;
    onSignOut?: () => void;
    userEmail?: string;
}

const Header: React.FC<HeaderProps> = ({ theme, onThemeToggle, onSignOut, userEmail }) => {
    return (
        <header className="border-b border-neutral-200 dark:border-neutral-800">
            <div className="container mx-auto px-4 py-3">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-medium text-neutral-900 dark:text-white">Internify</h1>
                    <div className="flex items-center gap-4">
                        {userEmail && onSignOut && (
                            <>
                                <span className="text-sm text-neutral-500 dark:text-neutral-400 hidden sm:block" title={userEmail}>
                                    {userEmail}
                                </span>
                                <button 
                                    onClick={onSignOut} 
                                    className="text-sm font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors"
                                    aria-label="Sign Out"
                                >
                                    Sign Out
                                </button>
                            </>
                        )}
                        <ThemeToggle theme={theme} onToggle={onThemeToggle} />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;