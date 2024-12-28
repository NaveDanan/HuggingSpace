import React, { useState } from 'react';
import { FileExplorer } from './FileExplorer';
import { FileViewer } from './FileViewer';
import { FileActions } from './FileActions';
import { CreateFileModal } from './CreateFileModal';
import { CommitHistory } from './CommitHistory';
import { useModelFiles, useUpdateModelFile } from '../../hooks/useModelFiles';
import { useModelCommits } from '../../hooks/useModelCommits';
import { findFileContent } from '../../utils/repository';
import type { Model } from '../../types/models';

interface ModelFilesProps {
  model: Model;
}

export function ModelFiles({ model }: ModelFilesProps) {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { 
    files, 
    loading, 
    error,
    addFile,
    uploadFiles
  } = useModelFiles(model.id);
  const { updateFile, loading: updateLoading } = useUpdateModelFile(model.id);
  const { commits, loading: commitsLoading, createCommit: createModelCommit } = useModelCommits(model.id);

  const handleFileUpdate = async (content: string, commitMessage: string) => {
    if (!selectedFile) return;
    
    try {
      await createModelCommit(commitMessage, [selectedFile]);
    } catch (err) {
      console.error('Error creating commit:', err);
      throw err;
    }
    
    await updateFile(selectedFile, content);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className={`px-3 py-1.5 text-sm border rounded-lg transition-colors
                     ${showHistory
                       ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                       : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                     }`}
          >
            {showHistory ? 'Show Files' : `History: ${commits.length} Commits`}
          </button>
        </div>
        <FileActions
          onFileCreate={() => setShowCreateModal(true)}
          onFileUpload={uploadFiles}
          disabled={!model.is_owner}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <FileExplorer
            files={files}
            selectedPath={selectedFile || undefined}
            loading={loading}
            error={error}
            onFileSelect={setSelectedFile}
          />
        </div>

        <div className="lg:col-span-3">
          {showHistory ? (
            <CommitHistory 
              commits={commits} 
              loading={commitsLoading} 
              onFileSelect={(path) => {
                setSelectedFile(path);
                setShowHistory(false);
              }}
            />
          ) : selectedFile ? (
            <FileViewer
              path={selectedFile}
              content={findFileContent(files, selectedFile) || '// Empty file'}
              language="javascript"
              readOnly={!model.is_owner}
              isOwner={model.is_owner}
              onSave={handleFileUpdate}
            />
          ) : (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              Select a file to view its contents
            </div>
          )}
        </div>
      </div>

      <CreateFileModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={(filename) => {
          addFile(filename);
          setSelectedFile(filename);
        }}
      />
    </div>
  );
}