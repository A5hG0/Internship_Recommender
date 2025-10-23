import { Internship, UserProfile } from "../types";

const PROXY_ENDPOINT = '/.netlify/functions/gemini-proxy';

/**
 * Gets internship recommendations by calling the backend proxy.
 * 
 * @param userProfile The user's profile information.
 * @param internships The list of available internships.
 * @returns A promise that resolves to an array of the top 5 recommended internships.
 */
export const getInternshipRecommendations = async (userProfile: UserProfile, internships: Internship[]): Promise<Internship[]> => {
    try {
        const response = await fetch(PROXY_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'recommend',
                payload: {
                    userProfile,
                    internships,
                },
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Request failed with status ${response.status}`);
        }

        const recommendedInternships: Internship[] = await response.json();
        return recommendedInternships;

    } catch (error) {
        console.error("Error calling backend proxy for recommendations:", error);
        if (error instanceof Error) {
            // Prepend a user-friendly message to the technical error.
            throw new Error(`AI Service Error: ${error.message}`);
        }
        throw new Error("Failed to fetch recommendations from the AI due to an unknown error.");
    }
};


/**
 * Generates a fresh list of internships by calling the backend proxy.
 * @returns A promise that resolves to an array of 12 internships.
 */
export const generateNewInternships = async (): Promise<Internship[]> => {
     try {
        const response = await fetch(PROXY_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'generate',
            }),
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Request failed with status ${response.status}`);
        }

        return await response.json();

    } catch (error) {
        console.error("Error calling backend proxy for new internships:", error);
        if (error instanceof Error) {
            throw new Error(`AI Service Error: ${error.message}`);
        }
        throw new Error("Failed to generate new internships from the AI due to an unknown error.");
    }
};
