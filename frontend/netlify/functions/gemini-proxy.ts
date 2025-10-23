import { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { GoogleGenAI, Type } from "@google/genai";

// Mirroring the frontend types for self-containment.
interface UserProfile {
    fullName: string;
    email: string;
    fieldOfStudy: string;
    skills: string; // Comma-separated
    resumeFile: {
        mimeType: string;
        data: string; // base64 encoded
    };
}

interface Internship {
    company: string;
    role: string;
    field: string;
    skillsRequired: string[];
    location: string;
    description: string;
    matchScore?: number;
    reasoning?: string;
}

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
    // This will cause the function to fail deployment if the key isn't set, which is a good thing.
    throw new Error("GEMINI_API_KEY environment variable not set for the serverless function.");
}

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
const model = "gemini-2.5-flash";

const generateInternships = async (): Promise<Internship[]> => {
    const prompt = `
        You are a data provider for a career counseling service.
        Your task is to generate a diverse list of 12 realistic, high-quality internship opportunities for students.
        Cover a wide range of fields like Computer Science, AI, Design, Finance, Mechanical Engineering, Marketing, Biotechnology, and Cybersecurity.
        Ensure the data is varied, the descriptions are compelling, and the required skills are appropriate for an intern.
        Your entire output MUST be a valid JSON array that conforms to the provided schema. Do not include any other text or explanations.
    `;

    const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        company: { type: Type.STRING },
                        role: { type: Type.STRING },
                        field: { type: Type.STRING },
                        skillsRequired: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING }
                        },
                        location: { type: Type.STRING },
                        description: { type: Type.STRING },
                    },
                    required: ["company", "role", "field", "skillsRequired", "location", "description"],
                },
            },
        },
    });

    const jsonText = response.text?.trim();
    if (!jsonText) throw new Error("No response text from API");
    return JSON.parse(jsonText);
};

const getRecommendations = async (userProfile: UserProfile, internships: Internship[]): Promise<Internship[]> => {
    const promptText = `
        You are an expert career counselor named 'Internify AI'. Your task is to recommend the best internships for a student based on their profile and resume.
        
        **User Profile:**
        - **Field of Study:** ${userProfile.fieldOfStudy}
        - **Skills & Interests:** ${userProfile.skills}

        **Available Internships:**
        ${JSON.stringify(internships, null, 2)}

        **Instructions:**
        1. Deeply analyze the user's field of study, skills, and the content of their attached resume. The resume is the most important source of truth for their experience.
        2. Compare the user's comprehensive profile against each available internship's field and required skills.
        3. Calculate a 'matchScore' from 0 to 100 for each internship, representing how well it aligns with the user's profile. A higher score means a better match. Be critical in your scoring.
        4. Provide a brief, one-sentence 'reasoning' for why you assigned that score, referencing specifics from their profile or resume.
        5. Return ONLY the top 5 best-matching internships, sorted from highest to lowest match score.
        6. Your entire output MUST be a valid JSON array that conforms to the provided schema. Do not include any other text or explanations outside of the JSON structure.
    `;

    const parts: any[] = [
        { text: promptText },
        {
            inlineData: {
                mimeType: userProfile.resumeFile.mimeType,
                data: userProfile.resumeFile.data,
            },
        }
    ];

    const response = await ai.models.generateContent({
        model,
        contents: { parts },
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        company: { type: Type.STRING },
                        role: { type: Type.STRING },
                        field: { type: Type.STRING },
                        skillsRequired: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING }
                        },
                        location: { type: Type.STRING },
                        description: { type: Type.STRING },
                        matchScore: {
                            type: Type.INTEGER,
                            description: "A score from 0-100 indicating the match quality."
                        },
                        reasoning: {
                            type: Type.STRING,
                            description: "A brief, one-sentence explanation for the score."
                        },
                    },
                    required: ["company", "role", "field", "skillsRequired", "location", "description", "matchScore", "reasoning"],
                },
            },
        },
    });

    const jsonText = response.text?.trim();
    if (!jsonText) throw new Error("No response text from API");
    const recommendedInternships: Internship[] = JSON.parse(jsonText);
    return recommendedInternships.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
};

const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method Not Allowed' }),
        };
    }

    try {
        if (!event.body) {
            throw new Error("Request body is empty.");
        }
        
        const { action, payload } = JSON.parse(event.body);
        let result;

        if (action === 'generate') {
            result = await generateInternships();
        } else if (action === 'recommend') {
            const { userProfile, internships } = payload;
            if (!userProfile || !internships) {
                throw new Error("Missing 'userProfile' or 'internships' in payload for 'recommend' action.");
            }
            result = await getRecommendations(userProfile, internships);
        } else {
            throw new Error(`Invalid action: ${action}`);
        }

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(result),
        };
    } catch (error) {
        console.error("Error in gemini-proxy function:", error);
        const errorMessage = error instanceof Error ? error.message : "An unknown server error occurred.";
        return {
            statusCode: 500,
            body: JSON.stringify({ error: `Server error: ${errorMessage}` }),
        };
    }
};

export { handler };
