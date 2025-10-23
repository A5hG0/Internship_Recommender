import React from 'react';

interface ProgressBarProps {
    percentage: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ percentage }) => {
    return (
        <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-1.5">
            <div
                className="bg-neutral-800 dark:bg-neutral-300 h-1.5 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${percentage}%` }}
            ></div>
        </div>
    );
};

export default ProgressBar;