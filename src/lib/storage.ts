import { supabase } from './supabase';
import { withRetry } from './supabase';

export const BUCKET_NAME = 'model-files';
export const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500MB

function sanitizePath(path: string): string[] {
  return path
    .trim()
    .split('/')
    .filter(Boolean)
    .map(part => part.replace(/[^\w\-. ]/g, '_'));
}

function buildStoragePath(userId: string, modelId: string, filename: string) {
  // Clean and validate path components
  const cleanUserId = userId.trim();
  const cleanModelId = modelId.trim();
  const pathParts = sanitizePath(filename);

  // Validate path components
  if (!cleanUserId) {
    throw new Error('User ID is required');
  }
  if (!cleanModelId) {
    throw new Error('Model ID is required');
  }
  if (!pathParts.length) {
    throw new Error('Invalid filename');
  }

  // Construct storage path: userId/models/modelId/filename
  return `${cleanUserId}/models/${cleanModelId}/${pathParts.join('/')}`;
}

export async function listFolder(
  userId: string,
  modelId: string,
  folderPath: string = ''
): Promise<string[]> {
  const prefix = buildStoragePath(userId, modelId, folderPath);

  try {
    const { data, error } = await withRetry(() =>
      supabase.storage
        .from(BUCKET_NAME)
        .list(prefix, {
          limit: 100,
          search: '',
          sortBy: { column: 'name', order: 'asc' }
        })
    );

    if (error) throw error;
    
    return data
      .filter(item => !item.name.endsWith('/.gitkeep'))
      .map(item => item.name.slice(prefix.length + 1))
      .filter(Boolean);
  } catch (err) {
    console.error('Error listing folder:', err);
    return [];
  }
}
export async function uploadFile(
  userId: string, 
  modelId: string, 
  filename: string,
  content: string | Blob
): Promise<string> {
  if (!userId || !modelId || !filename) {
    throw new Error('Missing required parameters');
  }

  const storagePath = buildStoragePath(userId, modelId, filename);

  // Convert content to Blob if needed
  const fileContent = typeof content === 'string' 
    ? new Blob([content], { type: 'text/plain' })
    : content;

  // Validate file size
  if (fileContent.size > MAX_FILE_SIZE) {
    throw new Error(`File size exceeds maximum limit of ${MAX_FILE_SIZE / (1024 * 1024)}MB`);
  }

  // Upload file
  const { data, error } = await withRetry(() => 
    supabase.storage
      .from(BUCKET_NAME)
      .upload(storagePath, fileContent, { 
        upsert: true,
        contentType: typeof content === 'string' ? 'text/plain' : content.type,
        cacheControl: '3600'
      })
  );

  if (error) {
    console.error('Storage upload error:', error);
    throw error;
  }
  return data.path;
}

export async function downloadFile(
  userId: string, 
  modelId: string, 
  filename: string
): Promise<string> {
  const storagePath = buildStoragePath(userId, modelId, filename);

  // Download file
  const { data, error } = await withRetry(() =>
    supabase.storage
      .from(BUCKET_NAME)
      .download(storagePath)
  );

  if (error) throw error;
  return await data.text();
}

export async function listFiles(
  userId: string, 
  modelId: string
): Promise<string[]> {
  const prefix = `${userId}/models/${modelId}/`;

  // List files
  const { data, error } = await withRetry(() =>
    supabase.storage
      .from(BUCKET_NAME)
      .list(prefix, {
        limit: 100,
        offset: 0,
        sortBy: { column: 'name', order: 'asc' }
      })
  );

  if (error) throw error;
  return data.map(file => file.name.replace(prefix, '')).filter(Boolean);
}

export async function deleteFile(
  userId: string, 
  modelId: string, 
  filename: string
): Promise<void> {
  const storagePath = buildStoragePath(userId, modelId, filename);

  const { error } = await withRetry(() =>
    supabase.storage
      .from(BUCKET_NAME)
      .remove([storagePath])
  );

  if (error) throw error;
}