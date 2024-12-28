import React from 'react';
import { FormField } from '../ui/FormField';

interface SpaceNameInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function SpaceNameInput({ value, onChange, error }: SpaceNameInputProps) {
  return (
    <FormField
      label="Space Name"
      error={error}
      tooltip="Choose a unique name for your Space"
    >
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="my-awesome-model"
        className="w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 
                 text-gray-900 dark:text-white rounded-lg px-4 py-2
                 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 
                 focus:border-transparent"
      />
    </FormField>
  );
}