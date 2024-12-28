import React, { useRef, useState } from 'react';
import { FilePlus, Upload } from 'lucide-react';
import { cn } from '../../lib/utils';

interface FileActionsProps {
  onFileCreate: () => void;
  onFileUpload: (files: FileList) => Promise<void> | void;
  className?: string;
  disabled?: boolean;
}

export function FileActions({ onFileCreate, onFileUpload, className, disabled }: FileActionsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      try {
        setUploading(true);
        await onFileUpload(e.target.files);
      } finally {
        setUploading(false);
        // Reset input so the same file can be uploaded again
        e.target.value = '';
      }
    }
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <button
        onClick={onFileCreate}
        className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md
                 bg-blue-600 text-white hover:bg-blue-700
                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        <FilePlus className="w-4 h-4" />
        New file
      </button>

      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading || disabled}
        className={cn(
          "flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md",
          "bg-blue-600 text-white hover:bg-blue-700",
          "disabled:opacity-50 disabled:cursor-not-allowed"
        )}>
        <Upload className="w-4 h-4" />
        {uploading ? 'Uploading...' : 'Upload files'}
      </button>

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