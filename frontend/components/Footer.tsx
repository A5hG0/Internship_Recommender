import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="border-t border-neutral-200 dark:border-neutral-800 mt-auto">
            <div className="container mx-auto px-4 py-6 text-center text-neutral-500 dark:text-neutral-400">
                <p className="text-sm">&copy; {new Date().getFullYear()} Internify. Powered by AI.</p>
            </div>
        </footer>
    );
};

export default Footer;