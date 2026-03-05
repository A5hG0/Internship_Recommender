import { Internship } from '../types';
import ProgressBar from './ProgressBar';

interface InternshipCardProps {
    internship: Internship;
    onToggleSave: (internship: Internship) => void;
    isSaved: boolean;
    rank?: number;
}

const getScoreColor = (score: number | undefined): string => {
    if (!score) return 'text-neutral-500';
    if (score >= 80) return 'text-emerald-600 dark:text-emerald-400';
    if (score >= 60) return 'text-blue-600 dark:text-blue-400';
    if (score >= 40) return 'text-amber-600 dark:text-amber-400';
    return 'text-neutral-500';
};

const getScoreLabel = (score: number): string => {
    if (score >= 80) return 'Excellent match';
    if (score >= 60) return 'Strong match';
    if (score >= 40) return 'Good match';
    return 'Potential match';
};

const getLinkedInSearchUrl = (role: string, company: string): string => {
    const query = encodeURIComponent(`${role} ${company}`);
    return `https://www.linkedin.com/jobs/search/?keywords=${query}`;
};

const InternshipCard: React.FC<InternshipCardProps> = ({ internship, onToggleSave, isSaved, rank }) => {

    return (
        <div className="group relative bg-white dark:bg-white/[0.03] border border-neutral-200/70 dark:border-white/[0.06] rounded-2xl p-6 hover:shadow-lg hover:shadow-neutral-200/50 dark:hover:shadow-none dark:hover:border-white/10 hover:-translate-y-0.5 transition-all duration-500 ease-out animate-fade-in focus-within:ring-2 focus-within:ring-neutral-900/10 dark:focus-within:ring-white/10">
            {/* Rank badge */}
            {rank && (
                <div className="absolute -top-3 -left-2 w-7 h-7 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-[12px] font-bold flex items-center justify-center shadow-sm">
                    {rank}
                </div>
            )}

            {/* Top row: Company + Save */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex-grow min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-neutral-400 dark:text-neutral-500 mb-1.5">{internship.company}</p>
                    <h4 className="text-[20px] font-semibold text-neutral-900 dark:text-white leading-tight mb-2 tracking-tight">{internship.role}</h4>
                    <div className="flex flex-wrap items-center gap-3 text-[13px] text-neutral-400 dark:text-neutral-500">
                        <span className="flex items-center gap-1">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
                            {internship.location}
                        </span>
                        <span className="w-px h-3 bg-neutral-200 dark:bg-neutral-700" />
                        <span>{internship.field}</span>
                    </div>
                </div>
                <button
                    onClick={() => onToggleSave(internship)}
                    className={`flex-shrink-0 ml-4 w-9 h-9 flex items-center justify-center rounded-full transition-all duration-300 active:scale-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900/20 dark:focus-visible:ring-white/20 ${
                        isSaved
                            ? 'bg-red-50 dark:bg-red-500/10 text-red-500'
                            : 'bg-neutral-100 dark:bg-white/5 text-neutral-300 dark:text-neutral-600 hover:text-neutral-500 dark:hover:text-neutral-400'
                    }`}
                    aria-label={isSaved ? 'Unsave this internship' : 'Save this internship'}
                >
                    <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill={isSaved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={isSaved ? 0 : 1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                    </svg>
                </button>
            </div>

            {/* Match score */}
            {internship.matchScore !== undefined && (
                <div className="mb-5 p-4 bg-neutral-50 dark:bg-white/[0.02] rounded-xl border border-neutral-100 dark:border-white/5">
                    <div className="flex justify-between items-center mb-3">
                        <p className="text-[12px] font-medium text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">{getScoreLabel(internship.matchScore)}</p>
                        <p className={`text-[22px] font-bold tracking-tight ${getScoreColor(internship.matchScore)}`}>{internship.matchScore}<span className="text-[14px] font-normal opacity-50">%</span></p>
                    </div>
                    <ProgressBar percentage={internship.matchScore || 0} />
                </div>
            )}
            
            {/* Reasoning */}
            {internship.reasoning && (
                <div className="mb-5 pl-4 border-l-2 border-neutral-200 dark:border-white/10">
                    <p className="text-[13px] text-neutral-500 dark:text-neutral-400 leading-relaxed italic">
                        {internship.reasoning}
                    </p>
                </div>
            )}

            {/* Description */}
            <p className="text-[14px] text-neutral-500 dark:text-neutral-400 leading-relaxed mb-5">{internship.description}</p>

            {/* Skills */}
            <div className="flex flex-wrap gap-1.5 mb-5">
                {internship.skillsRequired.map(skill => (
                    <span 
                        key={skill} 
                        className="text-[12px] font-medium px-3 py-1 rounded-full bg-neutral-100 dark:bg-white/5 text-neutral-500 dark:text-neutral-400 border border-neutral-200/50 dark:border-white/5"
                    >
                        {skill}
                    </span>
                ))}
            </div>

            {/* Bottom row: Apply link + Feedback */}
            <div className="flex items-center justify-between pt-4 border-t border-neutral-100 dark:border-white/5">
                <a
                    href={getLinkedInSearchUrl(internship.role, internship.company)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[13px] font-medium text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900/20 dark:focus-visible:ring-white/20 rounded-lg px-1 -ml-1"
                >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                    </svg>
                    Search on LinkedIn
                </a>
            </div>
        </div>
    );
};

export default InternshipCard;