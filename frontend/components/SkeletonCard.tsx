import React from 'react';

const SkeletonCard: React.FC = () => {
    return (
        <div className="bg-white dark:bg-white/[0.03] border border-neutral-200/70 dark:border-white/[0.06] rounded-2xl p-6 animate-pulse">
            {/* Company name */}
            <div className="h-3 w-20 bg-neutral-200 dark:bg-white/10 rounded-full mb-3" />
            {/* Role title */}
            <div className="h-5 w-48 bg-neutral-200 dark:bg-white/10 rounded-lg mb-3" />
            {/* Location + field */}
            <div className="flex items-center gap-3 mb-6">
                <div className="h-3 w-24 bg-neutral-100 dark:bg-white/5 rounded-full" />
                <div className="h-3 w-px bg-neutral-200 dark:bg-white/5" />
                <div className="h-3 w-20 bg-neutral-100 dark:bg-white/5 rounded-full" />
            </div>
            {/* Description lines */}
            <div className="space-y-2 mb-5">
                <div className="h-3 w-full bg-neutral-100 dark:bg-white/5 rounded-full" />
                <div className="h-3 w-5/6 bg-neutral-100 dark:bg-white/5 rounded-full" />
                <div className="h-3 w-4/6 bg-neutral-100 dark:bg-white/5 rounded-full" />
            </div>
            {/* Skill pills */}
            <div className="flex gap-2">
                <div className="h-6 w-16 bg-neutral-100 dark:bg-white/5 rounded-full" />
                <div className="h-6 w-20 bg-neutral-100 dark:bg-white/5 rounded-full" />
                <div className="h-6 w-14 bg-neutral-100 dark:bg-white/5 rounded-full" />
            </div>
        </div>
    );
};

export default SkeletonCard;
