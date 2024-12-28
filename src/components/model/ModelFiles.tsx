import React, { useState } from 'react';
import { File, Folder, ChevronDown, ChevronRight, Download } from 'lucide-react';
import { formatBytes } from '../../utils/format';

interface FileNode {
  name: string;
  type: 'file' | 'folder';
  size?: number;
  lastModified?: string;
  children?: FileNode[];
}

interface ModelFilesProps {
  files: FileNode[];
  currentBranch: string;
  branches: string[];
  onBranchChange: (branch: string) => void;
}

export function ModelFiles({ files, currentBranch, branches, onBranchChange }: ModelFilesProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

  const toggleFolder = (path: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedFolders(newExpanded);
  };

  const renderNode = (node: FileNode, path: string = '') => {
    const fullPath = path ? `${path}/${node.name}` : node.name;
    const isExpanded = expandedFolders.has(fullPath);

    return (
      <div key={fullPath}>
        <div className="flex items-center py-2 px-4 hover:bg-gray-50">
          <div className="flex-1 flex items-center gap-2">
            {node.type === 'folder' ? (
              <>
                <button
                  onClick={() => toggleFolder(fullPath)}
                  className="p-1 hover:bg-gray-200 rounded"
                >
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-500" />
                  )}
                </button>
                <Folder className="w-4 h-4 text-gray-400" />
              </>
            ) : (
              <>
                <div className="w-6" /> {/* Spacing for alignment */}
                <File className="w-4 h-4 text-gray-400" />
              </>
            )}
            <span className="text-sm text-gray-900">{node.name}</span>
          </div>
          {node.type === 'file' && (
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">
                {formatBytes(node.size || 0)}
              </span>
              <button className="p-1 text-gray-400 hover:text-gray-600">
                <Download className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
        {node.type === 'folder' && isExpanded && node.children && (
          <div className="ml-6 border-l">
            {node.children.map((child) => renderNode(child, fullPath))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg border">
      <div className="flex items-center gap-4 p-4 border-b">
        <select
          value={currentBranch}
          onChange={(e) => onBranchChange(e.target.value)}
          className="px-3 py-1.5 bg-gray-100 border border-gray-300 rounded-lg text-sm
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {branches.map((branch) => (
            <option key={branch} value={branch}>
              {branch}
            </option>
          ))}
        </select>

        <div className="text-sm text-gray-600">
          <span className="font-medium">Last commit</span> 2 days ago
        </div>
      </div>

      <div className="divide-y">
        {files.map((node) => renderNode(node))}
      </div>
    </div>
  );
}