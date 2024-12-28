import React, { useState } from 'react';
import { X } from 'lucide-react';

interface CreateFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (folderPath: string) => void;
  currentPath?: string;
}

export function CreateFolderModal({ 
  isOpen, 
  onClose, 
  onSubmit,
  currentPath = ''
}: CreateFolderModalProps) {
  const [folderName, setFolderName] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    setError('');
    const trimmedName = folderName.trim();
    if (!trimmedName) {
      setError('Folder name is required');
      return;
    }

    // Basic folder name validation
    if (!/^[\w\-. ]+$/.test(trimmedName)) {
      setError('Invalid folder name. Use only letters, numbers, spaces, dots, and dashes');
      return;
    }

    const fullPath = currentPath 
      ? `${currentPath}/${trimmedName}`.replace(/\/+/g, '/')
      : trimmedName;

    try {
      onSubmit(fullPath);
      setFolderName('');
      setError('');
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create folder');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Create new folder
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label 
              htmlFor="foldername"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Folder Name
            </label>
            <input
              type="text"
              id="foldername"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              placeholder="e.g., src"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600
                       rounded-md shadow-sm bg-white dark:bg-gray-700
                       text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {error && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
            )}
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300
                       hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600
                       hover:bg-blue-700 rounded-md
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}