export interface FileNode {
  name: string;
  type: 'file' | 'folder';
  path: string;
  size?: number;
  children?: FileNode[];
  content?: string;
  lastModified?: string;
}

export interface Commit {
  id: string;
  message: string;
  author: string;
  date: string;
  files: string[];
}

export interface FileOperation {
  type: 'create' | 'update' | 'delete';
  path: string;
  content?: string;
}