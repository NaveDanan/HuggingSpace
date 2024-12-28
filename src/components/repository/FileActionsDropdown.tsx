import React, { useRef, useState } from 'react';
import { Plus, FileText, Folder, Upload } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useOnClickOutside } from '../../hooks/useOnClickOutside';

interface FileActionsDropdownProps {
  onNewFile: () => void;
  onNewFolder: () => void;
  onUploadFiles: (files: FileList) => Promise<void> | void;
  disabled?: boolean;
}

export function FileActionsDropdown({ 
  onNewFile, 
  onNewFolder, 
  onUploadFiles, 
  disabled 
}: FileActionsDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useOnClickOutside(dropdownRef, () => setIsOpen(false));

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      try {
        if (disabled) return;
        setUploading(true);
        await onUploadFiles(e.target.files);
        setIsOpen(false);
      } finally {
        setUploading(false);
        e.target.value = '';
      }
    }
  };

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled || uploading}
        className={cn(
          "flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md",
          "bg-blue-600 text-white hover:bg-blue-700",
          "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
          "disabled:opacity-50 disabled:cursor-not-allowed"
        )}
      >
        <Plus className="w-4 h-4" />
        Add
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg 
                      border border-gray-200 dark:border-gray-700 py-1 z-50">
          <button
            onClick={() => {
              onNewFile();
              if (!disabled) setIsOpen(false);
            }}
            disabled={disabled}
            className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300
                     hover:bg-gray-50 dark:hover:bg-gray-700/50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FileText className="w-4 h-4" />
            New File
          </button>

          <button
            onClick={() => {
              onNewFolder();
              if (!disabled) setIsOpen(false);
            }}
            disabled={disabled}
            className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300
                     hover:bg-gray-50 dark:hover:bg-gray-700/50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Folder className="w-4 h-4" />
            New Folder
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled || uploading}
            className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300
                     hover:bg-gray-50 dark:hover:bg-gray-700/50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Upload className="w-4 h-4" />
            {uploading ? 'Uploading...' : 'Upload Files'}
          </button>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}