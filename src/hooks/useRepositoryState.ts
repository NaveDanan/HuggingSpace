import { useState, useCallback } from 'react';

export function useRepositoryState() {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [currentPath, setCurrentPath] = useState<string[]>(['main']);

  const handleFileSelect = useCallback((path: string) => {
    setSelectedFile(path);
  }, []);

  const handlePathChange = useCallback((path: string[]) => {
    setCurrentPath(path);
    setSelectedFile(null);
  }, []);

  return {
    selectedFile,
    currentPath,
    handleFileSelect,
    handlePathChange
  };
}