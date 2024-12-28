import type { FileNode } from '../types/repository';

function sanitizePath(path: string): string[] {
  return path.trim().split('/').filter(Boolean);
}

export function buildFileTree(files: Array<{ path: string; content: string }>): FileNode[] {
  const root: FileNode[] = [];

  files.forEach(({ path, content }) => {
    if (!path) return;
    
    const parts = sanitizePath(path);
    if (!parts.length) return;

    let current = root;

    parts.forEach((part, index) => {
      const isFile = index === parts.length - 1;
      const existing = current.find(node => node.name === part);
      const currentPath = parts.slice(0, index + 1).join('/');

      if (existing) {
        if (!isFile) {
          if (!existing.children) {
            existing.children = [];
          }
          current = existing.children!;
        } else {
          // Update existing file
          existing.content = content;
          existing.size = content.length;
          existing.lastModified = new Date().toISOString();
        }
      } else {
        const node: FileNode = {
          name: part,
          type: isFile ? 'file' : 'folder',
          path: currentPath,
          ...(isFile ? {
            content,
            size: content.length,
            lastModified: new Date().toISOString()
          } : { 
            children: [] 
          })
        };
        current.push(node);
        if (!isFile) {
          current = node.children!;
        }
      }
    });
  });

  return sortFileTree(root);
}

export function findFileContent(files: FileNode[], path: string | null): string | null {
  if (!path) return null;
  
  const parts = sanitizePath(path);
  if (!parts.length) return null;

  let current = files;

  for (const part of parts) {
    const node = current.find(f => f.name === part);
    if (!node) return null;
    if (node.type === 'folder') {
      if (!node.children) return null;
      current = node.children || [];
    } else {
      return node.content || '';
    }
  }

  return null;
}

export function insertFile(files: FileNode[], path: string | null, file: FileNode): void {
  const parts = sanitizePath(path);
  if (parts.length === 0) return;

  const fileName = parts.pop();
  if (!fileName) return;

  let current = files;

  // Create folders if they don't exist
  for (const part of parts) {
    let folder = current.find(f => f.type === 'folder' && f.name === part);
    if (!folder) {
      folder = {
        name: part,
        type: 'folder',
        path: parts.slice(0, parts.indexOf(part) + 1).join('/'),
        children: []
      };
      current.push(folder);
      sortFileTree(current);
    }
    current = folder.children!;
  }

  // Add or update file
  const index = current.findIndex(f => f.name === fileName);
  if (index !== -1) {
    current[index] = file;
  } else {
    current.push(file);
    sortFileTree(current);
  }
}

export function removeFile(files: FileNode[], path: string | null): void {
  const parts = sanitizePath(path);
  if (parts.length === 0) return;

  const fileName = parts.pop();
  if (!fileName) return;

  let current = files;

  // Navigate to parent folder
  for (const part of parts) {
    const folder = current.find(f => f.type === 'folder' && f.name === part);
    if (!folder || !folder.children) return;
    current = folder.children;
  }

  // Remove file
  const index = current.findIndex(f => f.name === fileName);
  if (index !== -1) {
    current.splice(index, 1);
  }
}

function sortFileTree(nodes: FileNode[]): FileNode[] {
  return nodes.sort((a, b) => {
    if (a.type === b.type) {
      return a.name.localeCompare(b.name);
    }
    return a.type === 'folder' ? -1 : 1;
  });
}