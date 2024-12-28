import React, { useRef, useState } from 'react';
import { FileActionsDropdown } from './FileActionsDropdown';
import { cn } from '../../lib/utils';

interface FileActionsProps {
  onFileCreate: () => void;
  onFolderCreate: () => void;
  onFileUpload: (files: FileList) => Promise<void> | void;
  className?: string;
  disabled?: boolean;
}

export function FileActions({ onFileCreate, onFolderCreate, onFileUpload, className, disabled }: FileActionsProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <FileActionsDropdown
        onNewFile={onFileCreate}
        onNewFolder={onFolderCreate}
        onUploadFiles={onFileUpload}
        disabled={disabled}
      />
    </div>
  );
}