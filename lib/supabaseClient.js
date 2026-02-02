import { createBrowserClient } from "@supabase/ssr";

// Create Supabase client with fallback handling
function createSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  // Check if we have valid credentials
  if (!url || !key || url.includes('your-project') || key.includes('your-anon-key')) {
    console.error('❌ Supabase credentials not configured properly');
    console.error('Please update your .env.local file with actual Supabase credentials');
    
    // Return a mock client that throws helpful errors
    return {
      auth: {
        signInWithPassword: () => Promise.reject(new Error('Supabase not configured. Please update .env.local')),
        signUp: () => Promise.reject(new Error('Supabase not configured. Please update .env.local')),
        signOut: () => Promise.reject(new Error('Supabase not configured. Please update .env.local')),
        getUser: () => Promise.resolve({ data: { user: null }, error: null })
      },
      from: () => ({
        select: () => Promise.resolve({ data: [], error: null }),
        insert: () => Promise.reject(new Error('Supabase not configured')),
        update: () => Promise.reject(new Error('Supabase not configured')),
        delete: () => Promise.reject(new Error('Supabase not configured'))
      })
    };
  }
  
  return createBrowserClient(url, key);
}

export const supabase = createSupabaseClient();