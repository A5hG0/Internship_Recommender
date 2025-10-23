import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }: { mode: string }) => {
    const env = loadEnv(mode, '.', '');
    
    // Also read from process.env for Netlify environment variables
    const supabaseUrl = env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
    const supabaseKey = env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';
    const geminiKey = env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || '';
    
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'import.meta.env.VITE_GEMINI_API_KEY': JSON.stringify(geminiKey),
        'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(supabaseUrl),
        'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(supabaseKey),
        'process.env.GEMINI_API_KEY': JSON.stringify(geminiKey)
      },
      resolve: {
        alias: {
          '@': '/',
        }
      }
    };
});
