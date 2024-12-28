import React from 'react';
import { FormField } from '../ui/FormField';

interface DescriptionInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function DescriptionInput({ value, onChange, error }: DescriptionInputProps) {
  return (
    <FormField
      label="Description"
      error={error}
      tooltip="Briefly describe what your Space does"
    >
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="A short description of your Space..."
        className="w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 
                 text-gray-900 dark:text-white rounded-lg px-4 py-2
                 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 
                 focus:border-transparent min-h-[100px] resize-y"
      />
    </FormField>
  );
}