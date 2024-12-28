import { useState, useCallback } from 'react';

interface FileNode {
  name: string;
  type: 'file' | 'folder';
  path: string;
  size?: number;
  children?: FileNode[];
  content?: string;
}

export function useRepositoryFiles(initialFiles: FileNode[] = []) {
  const [files, setFiles] = useState<FileNode[]>(initialFiles);

  const addFile = useCallback((path: string) => {
    setFiles(current => {
      const newFiles = [...current];
      const pathParts = path.split('/');
      const fileName = pathParts.pop()!;
      
      let currentLevel = newFiles;
      let currentPath = '';
      
      // Navigate to the correct folder
      for (const part of pathParts) {
        currentPath = currentPath ? `${currentPath}/${part}` : part;
        const folder = currentLevel.find(f => f.type === 'folder' && f.name === part);
        if (!folder) {
          const newFolder: FileNode = {
            name: part,
            type: 'folder',
            path: currentPath,
            children: []
          };
          currentLevel.push(newFolder);
          currentLevel = newFolder.children!;
        } else {
          currentLevel = folder.children!;
        }
      }
      
      // Add the file
      currentLevel.push({
        name: fileName,
        type: 'file',
        path: path,
        size: 0,
        content: ''
      });
      
      return newFiles;
    });
  }, []);

  const uploadFiles = useCallback(async (fileList: FileList) => {
    const newFiles: FileNode[] = [];
    
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      const content = await file.text();
      
      newFiles.push({
        name: file.name,
        type: 'file',
        path: file.name,
        size: file.size,
        content
      });
    }
    
    setFiles(current => [...current, ...newFiles]);
  }, []);

  const updateFileContent = useCallback((path: string, content: string) => {
    setFiles(current => {
      const newFiles = [...current];
      const file = findFile(newFiles, path);
      if (file && file.type === 'file') {
        file.content = content;
      }
      return newFiles;
    });
  }, []);

  return {
    files,
    addFile,
    uploadFiles,
    updateFileContent
  };
}

function findFile(files: FileNode[], path: string): FileNode | null {
  const pathParts = path.split('/');
  let current: FileNode | null = null;
  let currentFiles = files;

  for (const part of pathParts) {
    current = currentFiles.find(f => f.name === part) || null;
    if (!current) return null;
    if (current.type === 'folder') {
      currentFiles = current.children || [];
    }
  }

  return current;
}