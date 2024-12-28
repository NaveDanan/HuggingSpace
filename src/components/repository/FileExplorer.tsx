import React, { useState } from 'react';
import { File, Folder, ChevronDown, ChevronRight, FileText } from 'lucide-react';
import { cn } from '../../lib/utils';

interface FileNode {
  name: string;
  type: 'file' | 'folder';
  path: string;
  size?: number;
  children?: FileNode[];
}

interface FileExplorerProps {
  files: FileNode[];
  onFileSelect: (path: string) => void;
  selectedPath?: string;
  loading?: boolean;
  error?: Error | null;
}

export function FileExplorer({ 
  files, 
  onFileSelect, 
  selectedPath,
  loading,
  error 
}: FileExplorerProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 bg-white dark:bg-gray-800 
                    border dark:border-gray-700 rounded-lg">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-white dark:bg-gray-800 
                    border dark:border-gray-700 rounded-lg p-4">
        <p className="text-red-500 text-center mb-4">{error.message}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set());

  const toggleFolder = (path: string) => {
    const newExpanded = new Set(expandedPaths);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedPaths(newExpanded);
  };

  const renderNode = (node: FileNode) => {
    const isExpanded = expandedPaths.has(node.path);
    const isSelected = node.path === selectedPath;

    return (
      <div key={node.path}>
        <button
          onClick={() => {
            if (node.type === 'folder') {
              toggleFolder(node.path);
            } else {
              onFileSelect(node.path);
            }
          }}
          className={cn(
            "w-full flex items-center gap-2 px-3 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-800",
            isSelected && "bg-blue-50 dark:bg-blue-900/20"
          )}
        >
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {node.type === 'folder' ? (
              <>
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-500" />
                )}
                <Folder className="w-4 h-4 text-gray-400" />
              </>
            ) : (
              <>
                <div className="w-4" /> {/* Spacing for alignment */}
                <File className="w-4 h-4 text-gray-400" />
              </>
            )}
            <span className="truncate">{node.name}</span>
          </div>
        </button>

        {node.type === 'folder' && isExpanded && node.children && (
          <div className="ml-4 border-l dark:border-gray-700">
            {node.children.map(child => renderNode(child))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="border dark:border-gray-700 rounded-lg overflow-hidden">
      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 border-b dark:border-gray-700">
        <h3 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
          <FileText className="w-4 h-4" />
          Files
        </h3>
      </div>
      {files.map(node => renderNode(node))}
    </div>
  );
}