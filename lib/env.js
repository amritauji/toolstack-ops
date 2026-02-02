// Environment validation
const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY'
];

const optionalEnvVars = [
  'SUPABASE_SERVICE_ROLE_KEY',
  'NEXT_PUBLIC_APP_NAME',
  'NEXT_PUBLIC_APP_URL'
];

export function validateEnv() {
  const missing = [];
  const warnings = [];

  // Check required variables
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      missing.push(envVar);
    }
  }

  // Check optional but recommended variables
  for (const envVar of optionalEnvVars) {
    if (!process.env[envVar]) {
      warnings.push(envVar);
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      'Please check your .env.local file.'
    );
  }

  if (warnings.length > 0 && process.env.NODE_ENV === 'development') {
    console.warn(
      `⚠️  Optional environment variables not set: ${warnings.join(', ')}`
    );
  }

  // Validate URL format
  try {
    new URL(process.env.NEXT_PUBLIC_SUPABASE_URL);
  } catch {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL must be a valid URL');
  }

  return {
    supabase: {
      url: process.env.NEXT_PUBLIC_SUPABASE_URL,
      anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY
    },
    app: {
      name: process.env.NEXT_PUBLIC_APP_NAME || 'ToolStack Ops',
      url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    }
  };
}

// Safe config getter - doesn't throw on import
export function getConfig() {
  try {
    return validateEnv();
  } catch (error) {
    // Return defaults for development
    if (process.env.NODE_ENV === 'development') {
      console.error('Environment validation failed:', error.message);
      return {
        supabase: {
          url: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
          anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
          serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY
        },
        app: {
          name: process.env.NEXT_PUBLIC_APP_NAME || 'ToolStack Ops',
          url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
        }
      };
    }
    throw error;
  }
}