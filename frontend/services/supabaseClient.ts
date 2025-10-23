import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Validate that URL is a proper HTTP/HTTPS URL
const isValidUrl = (url: string): boolean => {
    try {
        new URL(url);
        return url.startsWith('http://') || url.startsWith('https://');
    } catch {
        return false;
    }
};

export const supabase = (supabaseUrl && supabaseAnonKey && isValidUrl(supabaseUrl))
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

export const supabaseError = (!supabaseUrl || !supabaseAnonKey || !isValidUrl(supabaseUrl))
    ? "Authentication is currently disabled. The Supabase environment variables have not been configured for this deployment. URL: " + (supabaseUrl || 'not set')
    : null;
