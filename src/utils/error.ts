import { PostgrestError } from '@supabase/supabase-js';

export function handleSupabaseError(error: unknown): Error {
  if (error instanceof Error) {
    if (error.message === 'Request timed out') {
      return new Error('Connection timed out. Please try again.');
    }
    if (error.message === 'Failed to fetch') {
      return new Error('Network error. Please check your connection and try again.');
    }
    return error;
  }
  
  if (typeof error === 'object' && error !== null) {
    const postgrestError = error as PostgrestError;
    if (postgrestError.message) {
      // Handle specific Supabase errors
      if (postgrestError.code === 'PGRST116') {
        return new Error('Resource not found');
      }
      if (postgrestError.code === '42501') {
        return new Error('Permission denied');
      }
      return new Error(postgrestError.message);
    }
  }
  
  return new Error('An unexpected error occurred. Please try again.');
}