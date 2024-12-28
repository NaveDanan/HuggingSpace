import { useState, useEffect, useCallback } from 'react';
import { useAuthContext } from '../contexts/AuthContext';
import { uploadFile, downloadFile, listFiles } from '../lib/storage';
import { buildFileTree } from '../utils/repository';
import type { FileNode } from '../types/repository';

export function useModelFiles(modelId: string) {
  const { user } = useAuthContext();
  const [files, setFiles] = useState<FileNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Load initial file structure
  useEffect(() => {
    async function loadFiles() {
      if (!user || !modelId) {
        setFiles([]);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Get list of files
        const filePaths = await listFiles(user.id, modelId);
        
        // Load file contents in parallel
        const fileContents = await Promise.all(
          filePaths.map(async path => {
            try {
              const content = await downloadFile(user.id, modelId, path);
              return { path, content };
            } catch (err) {
              console.error(`Failed to load file ${path}:`, err);
              return { path, content: '' };
            }
          })
        );

        // Build file tree
        const tree = buildFileTree(fileContents);
        setFiles(tree);
      } catch (err) {
        console.error('Error loading files:', err);
        setError(err instanceof Error ? err : new Error('Failed to load files'));
      } finally {
        setLoading(false);
      }
    }

    loadFiles();
  }, [modelId, user]);

  // File operations
  const addFile = useCallback(async (filename: string, content: string = '') => {
    if (!user) throw new Error('Not authenticated');

    try {
      setLoading(true);
      await uploadFile(user.id, modelId, filename, content);
      
      setFiles(current => {
        const newFile = {
          name: filename,
          type: 'file' as const,
          path: filename,
          content,
          size: content.length,
          lastModified: new Date().toISOString()
        };

        return buildFileTree([...current.map(f => ({
          path: f.path,
          content: f.content || ''
        })), {
          path: filename,
          content
        }]);
      });
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to create file');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [modelId, user]);

  const uploadFiles = useCallback(async (fileList: FileList) => {
    if (!user) throw new Error('Not authenticated');

    try {
      setLoading(true);
      const uploads = [];

      for (const file of Array.from(fileList)) {
        try {
          const content = await file.text();
          const filename = file.name;
          
          uploads.push(
            uploadFile(user.id, modelId, filename, content)
              .then(() => ({ path: filename, content }))
          );
        } catch (err) {
          console.error(`Failed to process file ${file.name}:`, err);
        }
      }

      const results = await Promise.all(uploads);
      
      setFiles(current => {
        const currentFiles = current.map(f => ({
          path: f.path,
          content: f.content || ''
        }));
        
        const newFiles = results.map(({ path, content }) => ({
          path,
          content
        }));

        return buildFileTree([...currentFiles, ...newFiles]);
      });
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to upload files');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [modelId, user]);

  return {
    files,
    loading,
    error,
    addFile,
    uploadFiles
  };
}

export function useUpdateModelFile(modelId: string) {
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const updateFile = async (path: string, content: string) => {
    if (!user) throw new Error('Not authenticated');

    try {
      setLoading(true);
      await uploadFile(user.id, modelId, path, content);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to update file');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    updateFile,
    loading,
    error
  };
}