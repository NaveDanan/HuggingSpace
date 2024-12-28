import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ErrorRetryProps {
  message: string;
  onRetry: () => void;
}

export function ErrorRetry({ message, onRetry }: ErrorRetryProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
      <p className="text-red-600 dark:text-red-400 text-center mb-4">{message}</p>
      <button 
        onClick={onRetry}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                 transition-colors duration-200"
      >
        Try Again
      </button>
    </div>
  );
}