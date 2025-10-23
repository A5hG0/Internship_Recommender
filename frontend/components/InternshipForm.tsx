import React, { useState, FormEvent } from 'react';
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
            // result is "data:mime/type;base64,the_base_64_string"
            // we want just "the_base_64_string"
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


const InternshipForm: React.FC<InternshipFormProps> = ({ onSubmit, loading }) => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [fieldOfStudy, setFieldOfStudy] = useState('');
    const [skills, setSkills] = useState('');
    const [resumeFile, setResumeFile] = useState<File | null>(null);
    const [isFileProcessing, setIsFileProcessing] = useState(false);
    const [fileError, setFileError] = useState<string | null>(null);

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
        <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1">Full Name</label>
                    <input
                        type="text"
                        id="fullName"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                        className="w-full bg-transparent border-0 border-b border-neutral-300 dark:border-neutral-700 focus:outline-none focus:ring-0 focus:border-neutral-900 dark:focus:border-neutral-200 transition"
                        placeholder="e.g., Jane Doe"
                    />
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full bg-transparent border-0 border-b border-neutral-300 dark:border-neutral-700 focus:outline-none focus:ring-0 focus:border-neutral-900 dark:focus:border-neutral-200 transition"
                        placeholder="e.g., jane.doe@example.com"
                    />
                </div>
            </div>
            <div>
                <label htmlFor="fieldOfStudy" className="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1">Field of Study</label>
                <input
                    type="text"
                    id="fieldOfStudy"
                    value={fieldOfStudy}
                    onChange={(e) => setFieldOfStudy(e.target.value)}
                    required
                    className="w-full bg-transparent border-0 border-b border-neutral-300 dark:border-neutral-700 focus:outline-none focus:ring-0 focus:border-neutral-900 dark:focus:border-neutral-200 transition"
                    placeholder="e.g., Computer Science, Finance, Marketing"
                />
            </div>
            <div>
                <label htmlFor="skills" className="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1">Skills / Interests</label>
                <textarea
                    id="skills"
                    rows={3}
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    required
                    className="w-full bg-transparent border rounded-md border-neutral-300 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-neutral-900 focus:ring-blue-500 focus:border-blue-500 dark:focus:border-blue-500 transition p-2"
                    placeholder="e.g., Python, React, Data Analysis, SEO, User Research"
                ></textarea>
                 <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">List your key skills here. The AI will also analyze your resume for more details.</p>
            </div>
            <div>
                <label htmlFor="resume" className="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1">Upload Resume</label>
                <input
                    type="file"
                    id="resume"
                    required
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => {
                        setResumeFile(e.target.files ? e.target.files[0] : null);
                        setFileError(null); // Clear error on new file selection
                    }}
                    className="w-full text-sm text-neutral-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-neutral-100 file:text-neutral-700 hover:file:bg-neutral-200 dark:text-neutral-400 dark:file:bg-neutral-800 dark:file:text-neutral-300 dark:hover:file:bg-neutral-700 cursor-pointer"
                />
                <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">A resume is required for the AI to analyze your experience.</p>
                {resumeFile && (
                    <div className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
                        Selected file: <span className="font-medium text-neutral-700 dark:text-neutral-300">{resumeFile.name}</span>
                    </div>
                )}
                {fileError && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400">{fileError}</p>
                )}
            </div>
            <div className="text-center pt-4">
                <button
                    type="submit"
                    disabled={loading || isFileProcessing}
                    className="w-full md:w-auto inline-flex justify-center py-3 px-8 border border-transparent text-base font-medium rounded-md text-white bg-neutral-900 hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-500 disabled:bg-neutral-400 disabled:cursor-not-allowed dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200 dark:focus:ring-offset-neutral-900 dark:disabled:bg-neutral-600 transition-colors"
                >
                    {getButtonText()}
                </button>
            </div>
        </form>
    );
};

export default InternshipForm;