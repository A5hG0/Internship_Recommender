import React from 'react';

interface LoaderProps {
    text?: string;
}

const Loader: React.FC<LoaderProps> = ({ text = "Loading..." }) => {
    return (
        <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
            <div className="relative w-10 h-10 mb-5">
                <div className="absolute inset-0 rounded-full border-[2px] border-neutral-200 dark:border-neutral-800" />
                <div className="absolute inset-0 rounded-full border-[2px] border-transparent border-t-neutral-900 dark:border-t-white animate-spin-slow" />
            </div>
            <p className="text-[13px] text-neutral-400 dark:text-neutral-500 font-medium tracking-wide animate-pulse-soft">
                {text}
            </p>
        </div>
    );
};

export default Loader;
