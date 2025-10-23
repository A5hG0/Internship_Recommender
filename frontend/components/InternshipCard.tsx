import React from 'react';
import { Internship } from '../types';
import ProgressBar from './ProgressBar';

interface InternshipCardProps {
    internship: Internship;
    onToggleSave: (internship: Internship) => void;
    isSaved: boolean;
    rank?: number;
}

const getRankBadge = (rank: number) => {
    const badges = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣'];
    return badges[rank - 1] || '';
};

const getMatchColor = (score: number | undefined) => {
    if (!score) return 'text-neutral-600 dark:text-neutral-400';
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-blue-600 dark:text-blue-400';
    if (score >= 40) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-orange-600 dark:text-orange-400';
};

const getMatchBgColor = (score: number | undefined) => {
    if (!score) return 'bg-neutral-100 dark:bg-neutral-800';
    if (score >= 80) return 'bg-green-100 dark:bg-green-900/30';
    if (score >= 60) return 'bg-blue-100 dark:bg-blue-900/30';
    if (score >= 40) return 'bg-yellow-100 dark:bg-yellow-900/30';
    return 'bg-orange-100 dark:bg-orange-900/30';
};

const InternshipCard: React.FC<InternshipCardProps> = ({ internship, onToggleSave, isSaved, rank }) => {
    return (
        <div className={`rounded-lg p-6 border-l-4 transition-all hover:shadow-lg ${getMatchBgColor(internship.matchScore)} ${
            internship.matchScore && internship.matchScore >= 80 ? 'border-green-500' :
            internship.matchScore && internship.matchScore >= 60 ? 'border-blue-500' :
            internship.matchScore && internship.matchScore >= 40 ? 'border-yellow-500' :
            'border-neutral-300 dark:border-neutral-700'
        }`}>
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4 flex-grow">
                    {rank && (
                        <div className="text-3xl font-bold flex-shrink-0 w-12 h-12 flex items-center justify-center">
                            {getRankBadge(rank)}
                        </div>
                    )}
                    <div className="flex-grow">
                        <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-1">{internship.company}</p>
                        <h4 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-1">{internship.role}</h4>
                        <div className="flex flex-wrap items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                            <span>📍 {internship.location}</span>
                            <span>•</span>
                            <span>🏢 {internship.field}</span>
                        </div>
                    </div>
                </div>
                <button
                    onClick={() => onToggleSave(internship)}
                    className={`flex-shrink-0 px-4 py-2 text-sm font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-neutral-900 whitespace-nowrap ml-4 ${
                        isSaved
                            ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md focus:ring-blue-500'
                            : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-300 dark:hover:bg-neutral-600 focus:ring-neutral-500'
                    }`}
                    aria-label={isSaved ? 'Unsave this internship' : 'Save this internship'}
                >
                    {isSaved ? '❤️ Saved' : '🔖 Save'}
                </button>
            </div>

            {internship.matchScore !== undefined && (
                <div className="mb-5 bg-white dark:bg-neutral-800/50 rounded p-4">
                    <div className="flex justify-between items-center mb-2">
                        <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Match Score</p>
                        <p className={`text-lg font-bold ${getMatchColor(internship.matchScore)}`}>{internship.matchScore}%</p>
                    </div>
                    <ProgressBar percentage={internship.matchScore || 0} />
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-2">
                        {internship.matchScore >= 80 ? '🎯 Perfect match for your profile' :
                         internship.matchScore >= 60 ? '✅ Great fit for you' :
                         internship.matchScore >= 40 ? '👍 Good opportunity to explore' :
                         '🔍 Interesting role'}
                    </p>
                </div>
            )}
            
            {internship.reasoning && (
                <div className="mb-5 bg-white dark:bg-neutral-800/50 rounded p-4 border-l-2 border-neutral-400 dark:border-neutral-600">
                    <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Why this match? 💡</p>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 italic">
                        {internship.reasoning}
                    </p>
                </div>
            )}

            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-5 leading-relaxed">{internship.description}</p>

            <div className="bg-white dark:bg-neutral-800/50 rounded p-4">
                <h5 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 mb-3">✨ Skills Required:</h5>
                <div className="flex flex-wrap gap-2">
                    {internship.skillsRequired.map(skill => (
                        <span 
                            key={skill} 
                            className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-semibold px-3 py-1.5 rounded-full border border-blue-200 dark:border-blue-800/50"
                        >
                            {skill}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default InternshipCard;