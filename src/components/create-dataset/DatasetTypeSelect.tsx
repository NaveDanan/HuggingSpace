import React from 'react';
import { FormField } from '../ui/FormField';

interface DatasetTypeSelectProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

const TYPES = [
  { id: 'tabular', name: 'Tabular Data' },
  { id: 'image', name: 'Image Dataset' },
  { id: 'text', name: 'Text Corpus' },
  { id: 'audio', name: 'Audio Dataset' },
  { id: 'video', name: 'Video Dataset' },
];

export function DatasetTypeSelect({ value, onChange, error }: DatasetTypeSelectProps) {
  return (
    <FormField
      label="Dataset Type"
      error={error}
      tooltip="Select the type of data in your dataset"
    >
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 
                 text-gray-900 dark:text-white rounded-lg px-4 py-2
                 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 
                 focus:border-transparent"
      >
        {TYPES.map((type) => (
          <option key={type.id} value={type.id}>
            {type.name}
          </option>
        ))}
      </select>
    </FormField>
  );
}