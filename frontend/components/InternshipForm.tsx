import React, { useState } from 'react';
import type { FormEvent } from 'react';
import { UserProfile } from '../types';

interface InternshipFormProps {
    onSubmit: (profile: UserProfile) => void;
    loading: boolean;
}

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const encoded = reader.result?.toString().split(',')[1];
            if (encoded) {
                resolve(encoded);
            } else {
                reject(new Error("Could not encode file to base64"));
            }
        };
        reader.onerror = error => reject(error);
    });
};

const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const getFileIcon = (type: string): string => {
    if (type === 'application/pdf') return 'PDF';
    if (type.includes('word') || type.includes('doc')) return 'DOC';
    return 'FILE';
};


const InternshipForm: React.FC<InternshipFormProps> = ({ onSubmit, loading }) => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [fieldOfStudy, setFieldOfStudy] = useState('');
    const [skills, setSkills] = useState('');
    const [resumeFile, setResumeFile] = useState<File | null>(null);
    const [isFileProcessing, setIsFileProcessing] = useState(false);
    const [fileError, setFileError] = useState<string | null>(null);

    // Inline validation
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const getFieldError = (field: string, value: string): string | null => {
        if (!touched[field]) return null;
        if (!value.trim()) return 'This field is required.';
        if (field === 'email' && !value.includes('@')) return 'Please enter a valid email address.';
        return null;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setFileError(null);

        if (!resumeFile) {
            setFileError("A resume file is required to get recommendations.");
            return;
        }

        setIsFileProcessing(true);
        try {
            const base64Data = await fileToBase64(resumeFile);
            const resumeFileData = {
                mimeType: resumeFile.type,
                data: base64Data
            };

            const userProfile: UserProfile = {
                fullName,
                email,
                fieldOfStudy,
                skills,
                resumeFile: resumeFileData,
            };
            onSubmit(userProfile);
        } catch (error) {
            console.error("Error converting file:", error);
            setFileError("There was an error processing your resume. Please try again or select a different file.");
        } finally {
            setIsFileProcessing(false);
        }
    };

    const getButtonText = () => {
        if (loading) return 'Analyzing...';
        if (isFileProcessing) return 'Processing Resume...';
        return 'Get Recommendations';
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-7 animate-fade-in" noValidate>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="group">
                    <label htmlFor="fullName" className="block text-[11px] font-medium uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-2">Full Name</label>
                    <input
                        type="text"
                        id="fullName"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        onBlur={() => setTouched(t => ({ ...t, fullName: true }))}
                        required
                        className={`w-full bg-neutral-50 dark:bg-white/5 border rounded-xl px-4 py-3 text-[15px] text-neutral-900 dark:text-white placeholder-neutral-300 dark:placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 dark:focus:ring-white/10 transition-all duration-300 ${getFieldError('fullName', fullName) ? 'border-red-300 dark:border-red-500/30' : 'border-neutral-200 dark:border-white/10 focus:border-neutral-400 dark:focus:border-neutral-500'}`}
                        placeholder="Jane Doe"
                    />
                    {getFieldError('fullName', fullName) && <p className="mt-1 text-[12px] text-red-500 dark:text-red-400">{getFieldError('fullName', fullName)}</p>}
                </div>
                <div className="group">
                    <label htmlFor="email" className="block text-[11px] font-medium uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-2">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onBlur={() => setTouched(t => ({ ...t, email: true }))}
                        required
                        className={`w-full bg-neutral-50 dark:bg-white/5 border rounded-xl px-4 py-3 text-[15px] text-neutral-900 dark:text-white placeholder-neutral-300 dark:placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 dark:focus:ring-white/10 transition-all duration-300 ${getFieldError('email', email) ? 'border-red-300 dark:border-red-500/30' : 'border-neutral-200 dark:border-white/10 focus:border-neutral-400 dark:focus:border-neutral-500'}`}
                        placeholder="jane@example.com"
                    />
                    {getFieldError('email', email) && <p className="mt-1 text-[12px] text-red-500 dark:text-red-400">{getFieldError('email', email)}</p>}
                </div>
            </div>
            <div>
                <label htmlFor="fieldOfStudy" className="block text-[11px] font-medium uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-2">Field of Study</label>
                <input
                    type="text"
                    id="fieldOfStudy"
                    value={fieldOfStudy}
                    onChange={(e) => setFieldOfStudy(e.target.value)}
                    onBlur={() => setTouched(t => ({ ...t, fieldOfStudy: true }))}
                    required
                    className={`w-full bg-neutral-50 dark:bg-white/5 border rounded-xl px-4 py-3 text-[15px] text-neutral-900 dark:text-white placeholder-neutral-300 dark:placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 dark:focus:ring-white/10 transition-all duration-300 ${getFieldError('fieldOfStudy', fieldOfStudy) ? 'border-red-300 dark:border-red-500/30' : 'border-neutral-200 dark:border-white/10 focus:border-neutral-400 dark:focus:border-neutral-500'}`}
                    placeholder="Computer Science, Finance, Marketing..."
                />
                {getFieldError('fieldOfStudy', fieldOfStudy) && <p className="mt-1 text-[12px] text-red-500 dark:text-red-400">{getFieldError('fieldOfStudy', fieldOfStudy)}</p>}
            </div>
            <div>
                <label htmlFor="skills" className="block text-[11px] font-medium uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-2">Skills &amp; Interests</label>
                <textarea
                    id="skills"
                    rows={3}
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    required
                    className="w-full bg-neutral-50 dark:bg-white/5 border border-neutral-200 dark:border-white/10 rounded-xl px-4 py-3 text-[15px] text-neutral-900 dark:text-white placeholder-neutral-300 dark:placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 dark:focus:ring-white/10 focus:border-neutral-400 dark:focus:border-neutral-500 transition-all duration-300 resize-none"
                    placeholder="Python, React, Data Analysis, SEO..."
                ></textarea>
                <p className="mt-1.5 text-[12px] text-neutral-400 dark:text-neutral-600">The AI will also analyze your resume for a deeper match.</p>
            </div>
            <div>
                <label htmlFor="resume" className="block text-[11px] font-medium uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-2">Resume</label>
                <label
                    htmlFor="resume"
                    className="flex items-center justify-center w-full h-28 border-2 border-dashed border-neutral-200 dark:border-white/10 rounded-2xl cursor-pointer hover:border-neutral-400 dark:hover:border-white/20 hover:bg-neutral-50 dark:hover:bg-white/[0.02] transition-all duration-300 group"
                >
                    {resumeFile ? (
                        <div className="text-center flex items-center justify-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-white/5 flex items-center justify-center flex-shrink-0">
                                <span className="text-[10px] font-bold text-neutral-500 dark:text-neutral-400 uppercase">{getFileIcon(resumeFile.type)}</span>
                            </div>
                            <div className="text-left">
                                <p className="text-[13px] font-medium text-neutral-700 dark:text-neutral-300 truncate max-w-[200px]">{resumeFile.name}</p>
                                <p className="text-[11px] text-neutral-400 dark:text-neutral-600">{formatFileSize(resumeFile.size)} · Click to change</p>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center">
                            <svg className="w-6 h-6 mx-auto text-neutral-300 dark:text-neutral-600 mb-2 group-hover:text-neutral-400 dark:group-hover:text-neutral-500 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 16V4m0 0L8 8m4-4l4 4M4 16l.586.586a2 2 0 001.414.586h12a2 2 0 001.414-.586L20 16" />
                            </svg>
                            <p className="text-[13px] text-neutral-400 dark:text-neutral-500">Drop your resume or <span className="text-neutral-600 dark:text-neutral-400 font-medium">browse</span></p>
                            <p className="text-[11px] text-neutral-300 dark:text-neutral-600 mt-0.5">PDF, DOC, DOCX</p>
                        </div>
                    )}
                </label>
                <input
                    type="file"
                    id="resume"
                    required
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => {
                        setResumeFile(e.target.files ? e.target.files[0] : null);
                        setFileError(null);
                    }}
                    className="hidden"
                />
                {fileError && (
                    <p className="mt-2 text-[13px] text-red-500 dark:text-red-400 animate-fade-in">{fileError}</p>
                )}
            </div>
            <div className="pt-2">
                <button
                    type="submit"
                    disabled={loading || isFileProcessing}
                    className="w-full py-3.5 px-6 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-[15px] font-semibold rounded-xl hover:bg-neutral-800 dark:hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-900/20 dark:focus:ring-white/20 focus:ring-offset-2 focus:ring-offset-[#fafafa] dark:focus:ring-offset-[#0a0a0a] disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] transition-all duration-300"
                >
                    {getButtonText()}
                </button>
            </div>
        </form>
    );
};

export default InternshipForm;