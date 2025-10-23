export interface UserProfile {
    fullName: string;
    email: string;
    fieldOfStudy: string;
    skills: string; // Comma-separated
    resumeFile: {
        mimeType: string;
        data: string; // base64 encoded
    };
}

export interface Internship {
    company: string;
    role: string;
    field: string;
    skillsRequired: string[];
    location: string;
    description: string;
    matchScore?: number;
    reasoning?: string;
}

export interface CachedInternships {
    timestamp: number;
    internships: Internship[];
}