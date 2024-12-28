import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';
import { sleep } from '../utils/async';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
}

// Create Supabase client with better error handling
export const supabase = createClient<Database>(supabaseUrl || '', supabaseAnonKey || '', {
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

// Add connection status check
let isConnected = false;

export async function waitForConnection(timeout = 5000): Promise<boolean> {
  const start = Date.now();
  
  while (Date.now() - start < timeout) {
    try {
      const { data, error } = await supabase.from('profiles').select('id').limit(1);
      if (!error) {
        isConnected = true;
        return true;
      }
    } catch (err) {
      console.warn('Connection check failed:', err);
    }
    await sleep(1000);
  }
  
  return false;
}

// Enhanced retry mechanism with exponential backoff
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
      // Add timeout to prevent hanging requests
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout')), 10000);
      });
      
      const result = await Promise.race([
        operation(),
        timeoutPromise
      ]);

      if (!result) {
        throw new Error('Operation returned no data');
      }
      return result;
    } catch (err) {
      const isRetryableError = err instanceof Error && (
        err.message.includes('Failed to fetch') ||
        err.message.includes('NetworkError') ||
        err.message.includes('network timeout') ||
        err.message.includes('Request timeout') ||
        err.message.includes('Connection refused')
      );

      if (isRetryableError) {
        console.warn(`Network error (attempt ${attempt}/${maxRetries}):`, err);
        if (attempt === maxRetries) throw err;
        
        // Exponential backoff with jitter
        const delay = Math.min(
          baseDelay * Math.pow(2, attempt - 1) + Math.random() * baseDelay,
          15000
        );
        await sleep(delay);
        continue;
      } else {
        throw err;
      }
    }
  }
  throw new Error('Operation failed after multiple retries');
}

// Helper to check connection status
export async function checkConnection(): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('spaces')
      .select('id')
      .limit(1)
      .maybeSingle();
      
    return !error;
  } catch {
    return false;
  }
}