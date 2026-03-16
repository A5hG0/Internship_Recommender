import React from 'react';

interface ProgressBarProps {
    percentage: number;
}

const getBarColor = (p: number): string => {
    if (p >= 80) return 'bg-emerald-500';
    if (p >= 60) return 'bg-blue-500';
    if (p >= 40) return 'bg-amber-500';
    return 'bg-neutral-400';
};

const ProgressBar: React.FC<ProgressBarProps> = ({ percentage }) => {
    return (
        <div className="w-full h-1 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
            <div
                className={`h-full rounded-full animate-progress-fill ${getBarColor(percentage)}`}
                style={{ '--progress-width': `${percentage}%`, width: `${percentage}%` } as React.CSSProperties}
            />
        </div>
    );
};

export default ProgressBar;