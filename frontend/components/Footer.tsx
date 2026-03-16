import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="mt-auto border-t border-neutral-100 dark:border-white/5">
            <div className="max-w-5xl mx-auto px-6 py-8 flex items-center justify-between">
                <p className="text-[12px] text-neutral-400 dark:text-neutral-600">
                    &copy; {new Date().getFullYear()} Internify
                </p>
                <p className="text-[12px] text-neutral-300 dark:text-neutral-700">
                    Powered by AI
                </p>
            </div>
        </footer>
    );
};

export default Footer;