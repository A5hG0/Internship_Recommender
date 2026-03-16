import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    
    // Only pass Supabase vars to the frontend — Gemini key stays server-side only
    const supabaseUrl = env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
    const supabaseKey = env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';
    
    return {
      plugins: [react()],
      define: {
        'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(supabaseUrl),
        'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(supabaseKey),
      },
      resolve: {
        alias: {
          '@': '/',
        }
      }
    };
});
