import React, { useState } from 'react';
import { RepositoryHeader } from './RepositoryHeader';
import { FileExplorer } from './FileExplorer';
import { FileViewer } from './FileViewer';

interface RepositoryViewProps {
  name: string;
  description: string;
  stats: {
    stars: number;
    forks: number;
    watchers: number;
  };
  files: {
    name: string;
    type: 'file' | 'folder';
    path: string;
    size?: number;
    children?: any[];
  }[];
  branches: string[];
}

export function RepositoryView({
  name,
  description,
  stats,
  files,
  branches,
}: RepositoryViewProps) {
  const [currentBranch, setCurrentBranch] = useState(branches[0]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg border dark:border-gray-700">
      <RepositoryHeader
        name={name}
        description={description}
        stats={stats}
        currentBranch={currentBranch}
        branches={branches}
        onBranchChange={setCurrentBranch}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-6">
        <div className="lg:col-span-1">
          <FileExplorer
            files={files}
            onFileSelect={setSelectedFile}
            selectedPath={selectedFile || undefined}
          />
        </div>

        <div className="lg:col-span-3">
          {selectedFile ? (
            <FileViewer
              path={selectedFile}
              content="// File content will be loaded here"
              language="javascript"
            />
          ) : (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              Select a file to view its contents
            </div>
          )}
        </div>
      </div>
    </div>
  );
}