import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
  console.error('URL:', supabaseUrl ? 'Set' : 'Missing');
  console.error('Key:', supabaseAnonKey ? 'Set' : 'Missing');
}

// Create a browser client that stores sessions in cookies (required for middleware)
export const supabase = createBrowserClient(supabaseUrl || '', supabaseAnonKey || '');

