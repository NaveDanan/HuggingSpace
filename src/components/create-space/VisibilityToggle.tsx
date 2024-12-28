import React from 'react';
import { FormField } from '../ui/FormField';
import { Eye, EyeOff } from 'lucide-react';

interface VisibilityToggleProps {
  value: boolean;
  onChange: (value: boolean) => void;
}

export function VisibilityToggle({ value, onChange }: VisibilityToggleProps) {
  return (
    <FormField
      label="Visibility"
      tooltip="Control who can see your Space"
    >
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => onChange(false)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2
                    transition-colors ${!value
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                    }`}
        >
          <Eye className="w-4 h-4" />
          <span>Public</span>
        </button>
        <button
          type="button"
          onClick={() => onChange(true)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2
                    transition-colors ${value
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                    }`}
        >
          <EyeOff className="w-4 h-4" />
          <span>Private</span>
        </button>
      </div>
    </FormField>
  );
}