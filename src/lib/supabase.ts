import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';
import { sleep } from '../utils/async';

/**
 * Helper to read an environment variable from process.env and fall back to import.meta.env
 * Logs both to the console and writes directly to the terminal (stdout/stderr).
 */
function readEnvVariable(
  systemVar: string,
  viteVar: string,
  isRequired = false
): string | undefined {
  // Check system environment variable first
  if (process.env[systemVar]) {
    console.log(`Using system environment variable for: ${systemVar}`);
    process.stdout.write(`\x1b[32m[Terminal] Using system environment variable for: ${systemVar}\x1b[0m\n`);
    return process.env[systemVar];
  }

  // Fallback to .env / import.meta.env
  if (import.meta.env[viteVar]) {
    console.log(`Falling back to .env variable for: ${viteVar}`);
    process.stdout.write(`\x1b[33m[Terminal] Falling back to .env variable for: ${viteVar}\x1b[0m\n`);
    return import.meta.env[viteVar];
  }

  // If it's a required variable, throw an error if not found in either place
  if (isRequired) {
    const errMsg = `Missing required environment variable: '${systemVar}' or '${viteVar}'.`;
    console.error(errMsg);
    process.stderr.write(`\x1b[31m[Terminal] ${errMsg}\x1b[0m\n`);
    throw new Error(
      `${errMsg} Please set it in your system environment or in your .env file.`
    );
  }

  return undefined;
}

// Read required variables first from process.env then fallback to .env
const supabaseUrl = readEnvVariable('SUPABASE_URL', 'VITE_SUPABASE_URL', true);
const supabaseAnonKey = readEnvVariable('SUPABASE_ANON_KEY', 'VITE_SUPABASE_ANON_KEY', true);

// Read optional GitHub-related variables
const githubClientId = readEnvVariable('GITHUB_CLIENT_ID', 'VITE_GITHUB_CLIENT_ID');
const githubClientSecret = readEnvVariable('GITHUB_CLIENT_SECRET', 'VITE_GITHUB_CLIENT_SECRET');

// Export config for use in other files
export const config = {
  supabaseUrl,
  supabaseAnonKey,
  githubClientId,
  githubClientSecret
};

// Create Supabase client with better error handling
export const supabase = createClient<Database>(supabaseUrl!, supabaseAnonKey!, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'X-Client-Info': 'spaces-clone',
      'Cache-Control': 'no-cache',
      'Retry-After': '1'
    }
  },
  db: {
    schema: 'public'
  }
});

// Track connection status
let isConnected = false;

/**
 * Wait until a connection can be established (up to the provided timeout).
 */
export async function waitForConnection(timeout = 5000): Promise<boolean> {
  const start = Date.now();

  while (Date.now() - start < timeout) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .limit(1);

      if (!error) {
        isConnected = true;
        return true;
      }
    } catch (err) {
      console.warn('Connection check failed:', err);
      process.stdout.write(`\x1b[33m[Terminal] Connection check failed: ${err}\x1b[0m\n`);
    }
    await sleep(1000);
  }

  return false;
}

/**
 * Retry a given operation with an exponential backoff if specific network errors occur.
 */
export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries = 5,
  baseDelay = 1000
): Promise<T> {
  // Ensure connection is established first
  if (!isConnected) {
    await waitForConnection();
  }

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      // Add a 10 second timeout to any operation
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout')), 10000);
      });

      const result = await Promise.race([operation(), timeoutPromise]);
      if (!result) {
        throw new Error('Operation returned no data');
      }
      return result;
    } catch (err: any) {
      // Check if we should retry
      const isRetryableError = err instanceof Error && (
        err.message.includes('Failed to fetch') ||
        err.message.includes('NetworkError') ||
        err.message.includes('network timeout') ||
        err.message.includes('Request timeout') ||
        err.message.includes('Connection refused')
      );

      if (isRetryableError) {
        const warnMsg = `Network error (attempt ${attempt}/${maxRetries}): ${err.message}`;
        console.warn(warnMsg);
        process.stdout.write(`\x1b[33m[Terminal] ${warnMsg}\x1b[0m\n`);
        
        if (attempt === maxRetries) throw err;

        // Exponential backoff with jitter
        const delay = Math.min(
          baseDelay * Math.pow(2, attempt - 1) + Math.random() * baseDelay,
          15000
        );
        await sleep(delay);
      } else {
        // Non-retryable error => throw immediately
        throw err;
      }
    }
  }

  // If we exit the loop without returning, the operation failed all retries
  throw new Error('Operation failed after multiple retries');
}

/**
 * Checks the connection by selecting from the 'spaces' table.
 */
export async function checkConnection(): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('spaces')
      .select('id')
      .limit(1)
      .maybeSingle();

    return !error;
  } catch (err) {
    console.error('Check connection failed:', err);
    process.stderr.write(`\x1b[31m[Terminal] Check connection failed: ${err}\x1b[0m\n`);
    return false;
  }
}
