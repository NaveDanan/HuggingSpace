import React from 'react';
import { GitCommit, ChevronRight, FileText, Plus, Minus, Edit2 } from 'lucide-react';
import type { Commit } from '../../types/repository';

const getChangeIcon = (type: string) => {
  switch (type) {
    case 'added':
      return <Plus className="w-4 h-4 text-green-500" />;
    case 'deleted':
      return <Minus className="w-4 h-4 text-red-500" />;
    default:
      return <Edit2 className="w-4 h-4 text-yellow-500" />;
  }
};

interface CommitHistoryProps {
  commits: Commit[];
  loading?: boolean;
  onFileSelect?: (path: string) => void;
}

export function CommitHistory({ commits, loading, onFileSelect }: CommitHistoryProps) {
  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 bg-gray-100 dark:bg-gray-800 rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {commits.map((commit) => (
        <div
          key={commit.id}
          className="bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 p-4 
                   hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
        >
          <div className="flex items-start gap-3">
            <GitCommit className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-gray-900 dark:text-white font-medium break-words whitespace-pre-wrap">
                {commit.message}
              </p>
              <div className="mt-1 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <span>{commit.author}</span>
                <span>•</span>
                <span>{new Date(commit.date).toLocaleDateString()}</span>
              </div>
              {commit.files.length > 0 && (
                <div className="mt-2 space-y-1">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {commit.files.length} changed files
                  </p>
                  <div className="space-y-1">
                    {commit.files.map((file) => (
                      <button
                        key={file}
                        onClick={() => onFileSelect?.(file)}
                        className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 
                                 hover:underline w-full text-left py-1"
                      >
                        <FileText className="w-4 h-4" />
                        <span className="truncate">{file}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <code className="text-sm text-gray-500 dark:text-gray-400 font-mono">
              {commit.id.slice(0, 7)}
            </code>
          </div>
        </div>
      ))}
    </div>
  );
}