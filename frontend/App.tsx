import React, { useState, useEffect } from 'react';
import { Internship, UserProfile, CachedInternships } from './types';
import { getInternshipRecommendations, generateNewInternships } from './services/geminiService';
import Header from './components/Header';
import Footer from './components/Footer';
import InternshipForm from './components/InternshipForm';
import InternshipCard from './components/InternshipCard';
import Loader from './components/Loader';
import Auth from './components/Auth';
import { supabase, supabaseError } from './services/supabaseClient';
import { Session } from '@supabase/supabase-js';

const CACHE_KEY = 'internify_internships_cache';
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes
const SAVED_KEY = 'internify_saved_internships';

const InternshipFinder: React.FC = () => {
    const [internships, setInternships] = useState<Internship[]>([]);
    const [matchedInternships, setMatchedInternships] = useState<Internship[] | null>(null);
    const [savedInternships, setSavedInternships] = useState<Internship[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [internshipsLoading, setInternshipsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [submitted, setSubmitted] = useState<boolean>(false);

    useEffect(() => {
        const fetchInternships = async () => {
            const cachedData = localStorage.getItem(CACHE_KEY);
            if (cachedData) {
                try {
                    const { timestamp, internships: cachedInternships }: CachedInternships = JSON.parse(cachedData);
                    const isCacheValid = (Date.now() - timestamp) < CACHE_DURATION;
                    if (isCacheValid && cachedInternships?.length > 0) {
                        console.log("Loading internships from valid cache.");
                        setInternships(cachedInternships);
                        setInternshipsLoading(false);
                        return;
                    }
                } catch (e) {
                    console.error("Failed to parse cache, fetching new data.", e);
                    localStorage.removeItem(CACHE_KEY);
                }
            }

            console.log("Cache invalid or empty. Fetching new internships...");
            setInternshipsLoading(true);
            try {
                const newInternships = await generateNewInternships();
                setInternships(newInternships);
                const cachePayload: CachedInternships = {
                    timestamp: Date.now(),
                    internships: newInternships,
                };
                localStorage.setItem(CACHE_KEY, JSON.stringify(cachePayload));
            } catch (err) {
                console.error("Failed to generate new internships:", err);
                setError("Could not load internship opportunities. Please refresh the page.");
            } finally {
                setInternshipsLoading(false);
            }
        };

        fetchInternships();

        const intervalId = setInterval(fetchInternships, 37 * 60 * 1000);

        try {
            const saved = localStorage.getItem(SAVED_KEY);
            if (saved) {
                setSavedInternships(JSON.parse(saved));
            }
        } catch (e) {
            console.error("Failed to load saved internships from local storage.", e);
            localStorage.removeItem(SAVED_KEY);
        }

        return () => clearInterval(intervalId);
    }, []);

    const handleFormSubmit = async (profile: UserProfile) => {
        setLoading(true);
        setError(null);
        setMatchedInternships(null);
        setSubmitted(true);

        try {
            const results = await getInternshipRecommendations(profile, internships);
            
            if (results.length > 0) {
                 const resultsMap = new Map<string, Internship>();
                 results.forEach(r => resultsMap.set(`${r.company}-${r.role}`, r));

                 const updatedInternships = internships.map((i: Internship) => {
                     const key = `${i.company}-${i.role}`;
                     if (resultsMap.has(key)) {
                         return resultsMap.get(key)!;
                     }
                     return i;
                 }).sort((a: Internship, b: Internship) => (b.matchScore || 0) - (a.matchScore || 0));

                 setMatchedInternships(updatedInternships);
            } else {
                setMatchedInternships([]);
            }

        } catch (err) {
            console.error(err);
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unknown error occurred. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleToggleSave = (internshipToToggle: Internship) => {
        setSavedInternships((prevSaved: Internship[]) => {
            const isAlreadySaved = prevSaved.some(
                (saved: Internship) => saved.company === internshipToToggle.company && saved.role === internshipToToggle.role
            );
    
            let newSavedList;
            if (isAlreadySaved) {
                newSavedList = prevSaved.filter(
                    (saved: Internship) => !(saved.company === internshipToToggle.company && saved.role === internshipToToggle.role)
                );
            } else {
                newSavedList = [...prevSaved, internshipToToggle];
            }
    
            try {
                localStorage.setItem(SAVED_KEY, JSON.stringify(newSavedList));
            } catch (e) {
                console.error("Failed to save internships to local storage.", e);
            }
            
            return newSavedList;
        });
    };

    return (
        <main className="flex-grow container mx-auto px-4 py-8 md:py-16">
            <div className="max-w-2xl mx-auto">
                {savedInternships.length > 0 && (
                    <section id="saved-section" className="mb-16">
                        <h3 className="text-2xl font-light text-center mb-10 text-neutral-900 dark:text-white">Your Saved Internships</h3>
                        <div className="space-y-8">
                            {savedInternships.map((internship: Internship) => (
                                <InternshipCard
                                    key={`saved-${internship.company}-${internship.role}`}
                                    internship={internship}
                                    onToggleSave={handleToggleSave}
                                    isSaved={true}
                                />
                            ))}
                        </div>
                    </section>
                )}

                <section id="form-section" className="mb-16">
                     <h2 className="text-4xl md:text-5xl font-light text-center text-neutral-900 dark:text-white mb-4">Find Your Perfect Internship</h2>
                     <p className="text-center text-neutral-500 dark:text-neutral-400 mb-10">Fill out the form below, upload your resume, and let our AI find the best opportunities for you.</p>
                     {internshipsLoading ? (
                        <div className="text-center p-8 border border-neutral-200 dark:border-neutral-800 rounded-md">
                            <Loader text="Loading fresh internships..." />
                        </div>
                     ) : (
                        <InternshipForm onSubmit={handleFormSubmit} loading={loading} />
                     )}
                </section>
                
                <section id="results-section">
                    {loading && <Loader text="Analyzing your profile..."/>}
                    {error && <div className="text-center text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/50 p-4 rounded-md">{error}</div>}
                    
                    {!loading && matchedInternships && matchedInternships.length > 0 && (
                        <div>
                            <div className="text-center mb-12">
                                <h3 className="text-3xl md:text-4xl font-light text-neutral-900 dark:text-white mb-2">🎯 Your Top Matches</h3>
                                <p className="text-neutral-500 dark:text-neutral-400">We found {matchedInternships.length} internships for you. Here are your top 5 best matches.</p>
                            </div>
                            <div className="space-y-6">
                                {matchedInternships.slice(0, 5).map((internship: Internship, index: number) => {
                                    const isSaved = savedInternships.some(
                                        (saved: Internship) => saved.company === internship.company && saved.role === internship.role
                                    );
                                    return (
                                        <InternshipCard
                                            key={`${internship.company}-${internship.role}-${index}`}
                                            internship={internship}
                                            onToggleSave={handleToggleSave}
                                            isSaved={isSaved}
                                            rank={index + 1}
                                        />
                                    );
                                })}
                            </div>
                            {matchedInternships.length > 5 && (
                                <div className="text-center mt-10 p-4 bg-neutral-50 dark:bg-neutral-800/30 rounded-lg">
                                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                        Showing 5 of {matchedInternships.length} matches. <span className="font-medium">Your perfect opportunity is here! 🚀</span>
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {!loading && submitted && matchedInternships?.length === 0 && !error && (
                        <div className="text-center text-neutral-500 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-800 p-8 rounded-md">
                            <h3 className="text-xl font-medium mb-2">No Recommendations Found</h3>
                            <p>We couldn't find any suitable internships based on your profile. Try adjusting your skills or field of study.</p>
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
};

const App: React.FC = () => {
    const [session, setSession] = useState<Session | null>(null);
    const [authLoading, setAuthLoading] = useState(true);
    const [theme, setTheme] = useState<'light' | 'dark'>(() => {
        // Initialize theme from localStorage or system preference
        if (typeof window !== 'undefined') {
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme === 'light' || savedTheme === 'dark') {
                return savedTheme;
            }
            // Check system preference
            if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                return 'dark';
            }
        }
        return 'light';
    });

    // Apply theme to DOM immediately on mount and when theme changes
    useEffect(() => {
        const applyTheme = (themeValue: 'light' | 'dark') => {
            const root = document.documentElement;
            if (themeValue === 'dark') {
                root.classList.add('dark');
            } else {
                root.classList.remove('dark');
            }
            try {
                localStorage.setItem('theme', themeValue);
            } catch (error) {
                console.error('Failed to save theme preference:', error);
            }
        };

        applyTheme(theme);
    }, [theme]);

    // Initialize theme on first mount
    useEffect(() => {
        const root = document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
    }, []);

    // Handle Supabase auth
    useEffect(() => {
        if (!supabase) {
            setAuthLoading(false);
            return;
        }

        let isMounted = true;

        const initializeAuth = async () => {
            try {
                const { data: { session: currentSession }, error } = await supabase!.auth.getSession();
                if (error) {
                    console.error('Error getting session:', error);
                }
                if (isMounted) {
                    setSession(currentSession);
                    setAuthLoading(false);
                }
            } catch (error) {
                console.error('Error initializing auth:', error);
                if (isMounted) {
                    setAuthLoading(false);
                }
            }
        };

        initializeAuth();

        // Subscribe to auth state changes
        const { data } = supabase!.auth.onAuthStateChange((_event: string, session: Session | null) => {
            if (isMounted) {
                setSession(session);
            }
        });

        return () => {
            isMounted = false;
            if (data?.subscription) {
                data.subscription.unsubscribe();
            }
        };
    }, []);

    const handleThemeToggle = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    const handleSignOut = async () => {
        if (supabase) {
            await supabase.auth.signOut();
        }
    };

    // Gracefully handle missing Supabase configuration
    if (!supabase) {
        return (
            <div className="min-h-screen flex flex-col font-sans text-neutral-800 dark:text-neutral-200">
                <div className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 text-center p-2 text-sm" role="alert">
                   {supabaseError}
                </div>
                <Header 
                    theme={theme} 
                    onThemeToggle={handleThemeToggle} 
                />
                <InternshipFinder />
                <Footer />
            </div>
        );
    }
    
    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-neutral-900">
                <Loader text="Initializing..." />
            </div>
        );
    }

    if (!session) {
        return <Auth theme={theme} onThemeToggle={handleThemeToggle} />;
    }

    return (
        <div className="min-h-screen flex flex-col font-sans text-neutral-800 dark:text-neutral-200">
            <Header 
                theme={theme} 
                onThemeToggle={handleThemeToggle} 
                onSignOut={handleSignOut} 
                userEmail={session.user.email} 
            />
            <InternshipFinder />
            <Footer />
        </div>
    );
};

export default App;