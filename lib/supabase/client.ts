import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  const error = 'Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.';
  console.error('❌', error);
  console.error('URL:', supabaseUrl ? `Set (${supabaseUrl.substring(0, 30)}...)` : 'Missing');
  console.error('Key:', supabaseAnonKey ? 'Set' : 'Missing');
  
  // Throw error in development to catch issues early
  if (process.env.NODE_ENV === 'development') {
    throw new Error(error);
  }
}

// Validate URL format - must be a Supabase URL, not a GitHub Pages URL
if (supabaseUrl) {
  if (!supabaseUrl.startsWith('http')) {
    const error = `Invalid Supabase URL format: ${supabaseUrl}. URL must start with http:// or https://`;
    console.error('❌', error);
    if (process.env.NODE_ENV === 'development') {
      throw new Error(error);
    }
  }
  
  // Check if URL looks like a Supabase URL
  if (!supabaseUrl.includes('supabase.co') && !supabaseUrl.includes('supabase')) {
    console.warn('⚠️ Warning: Supabase URL does not appear to be a valid Supabase URL:', supabaseUrl);
  }
}

// Create a browser client that stores sessions in cookies (required for middleware)
// Note: If env vars are missing, this will fail at runtime, which is better than silently using wrong URL
export const supabase = createBrowserClient(
  supabaseUrl || '',
  supabaseAnonKey || ''
);

